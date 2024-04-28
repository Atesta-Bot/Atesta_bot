// @ts-nocheck
import { Markup, Scenes } from "telegraf";
import { supabase, uploadFile } from "../../db";
import { Bucket } from "../../types/buckets";
import { Chains } from "../../wallet/chains";
import { createAttestationFor } from "../../eas/utils";
import { NUMBER_REGEX } from "../../types/regex";

export const attestScene = new Scenes.BaseScene('ATTESTA_SCENE')

// 1. ask for the ticket img
attestScene.enter(async (ctx) => {
	console.log('[attest scene started]')
	// get user information
	try {
		const { data, error } = await supabase
			.from('attesters')
			.select('*')
			.eq('chat_id', ctx.chat?.id)
			.single()

		if (error) throw error
		if (!data) throw 'You need to setup the chat before making attestations.\nCall /start again to trigger the setup'

		ctx.session.attestationData = {
			chatId: ctx.chat?.id,
			user: data,
		}

		await ctx.reply('Enter the name of the event')
	} catch (error) {
		console.error(error)
		await ctx.reply(JSON.stringify(error))
		return await ctx.scene.leave()
	}

})

// save the eventName and ask for the ticket img 
attestScene.hears(/.*/, async (ctx, next) => {
	if (ctx.session.attestationData.eventName) return await next()

	ctx.session.attestationData.eventName = ctx.message.text
	await ctx.reply('Send a photo of the ticket')
})

// handle photo upload and ask for the amount in usd
attestScene.on('photo', async (ctx) => {
	try {
		await ctx.reply('Uploading photo...')
		console.log('Uploading photo to supabase...')

		const photo = ctx.message.photo.pop()
		const fileLink = await ctx.telegram.getFileLink(photo?.file_id)

		// download file from telegram servers
		const res = await fetch(fileLink)
		const file = await res.blob()

		// upload the file to supbase
		const fileName = `ticket-${photo?.file_unique_id}-${Date.now()}.jpeg`
		const url = await uploadFile(Bucket.Tickets, fileName, file)
		console.log(`Image uploaded: ${url}`)
		await ctx.reply('Done')

		// await ctx.reply(url)
		ctx.session.attestationData.imageUrl = url
		await ctx.reply('Now enter the fiat amount to be payed in USD')
	} catch (error) {
		await ctx.reply('Error')
		console.error(error)
		await ctx.reply(error)
	}
})

// hears for numbers, intented to receive USD fiat amount
// ask for a description or note
attestScene.hears(NUMBER_REGEX, async (ctx, next) => {
	if (ctx.session.attestationData.usdAmount) return await next()
	const amount = Number(ctx.text)

	ctx.session.attestationData.usdAmount = amount

	await ctx.reply('Add a description for the attestation')
})

attestScene.hears(/.*/, async (ctx) => {
	if (!ctx.session.attestationData.imageUrl ||
		!ctx.session.attestationData.usdAmount) {
		return await ctx.reply('Not a valid response')
	}

	if (!ctx.session.attestationData.description) {
		// save the description and ask for the dao
		ctx.session.attestationData.description = ctx.message.text;
		await ctx.reply('Now enter the name of the DAO')
	} else if (!ctx.session.attestationData.daoAddress) {
		// search for the dao in db 
		// save the dao
		const { data } = await supabase
			.from('daos')
			.select('*')
			.eq('name', ctx.message.text)
			.single()

		if (!data) return await ctx.reply('No DAO found with that name')

		ctx.session.attestationData.dao = data

		// ask for the chain to conclude
		await ctx.reply('Select a chain to create the attestation', Markup.inlineKeyboard([
			Markup.button.callback('Optimism', 'OPTIMISM_ATTESTATION'),
			Markup.button.callback('Arbitrum', 'ARBITRUM_ATTESTATION'),
		]))
	} else {
		await ctx.reply('Not a valid response')
	}
})

// create attestation 
attestScene.action('OPTIMISM_ATTESTATION', createAttestationFor(Chains.Optimism))
attestScene.action('ARBITRUM_ATTESTATION', createAttestationFor(Chains.Arbitrum))

