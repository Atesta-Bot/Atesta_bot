// @ts-nocheck
import { Markup, Scenes } from "telegraf";
import { supabase, uploadFile } from "../../db";
import { Bucket } from "../../types/buckets";
import { Chains } from "../../wallet/chains";
import { createAttestationFor } from "../../eas/utils";
import { NUMBER_REGEX } from "../../types/regex";

export const attestScene = new Scenes.BaseScene('ATTESTA_SCENE')

// attestation flow 
// 1. ticket photo
// 1.1 save it in storage
//
// 2. fiat amount in usd
//
// 3. select chain (selector)
// 3.1 update attestation in db 
//
// 4. set recipent

attestScene.enter(async (ctx) => {
	console.log('[attest scene started]')
	// get user information
	try {
		const { data, error } = await supabase
			.from('attesters')
			.select('*')
			.eq('chatId', ctx.chat?.id)
			.single()

		if (error) throw error
		if (!data) throw 'You need to setup the chat before making attestations.\nCall /start again to trigger the setup'

		ctx.session.attestationData = {
			chatId: ctx.chat?.id,
			user: data
		}

		await ctx.reply('Send a photo of the ticket')
	} catch (error) {
		console.error(error)
		await ctx.reply(JSON.stringify(error))
		return await ctx.scene.leave()
	}

})

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
attestScene.hears(NUMBER_REGEX, async (ctx) => {
	const amount = Number(ctx.text)

	ctx.session.attestationData.amount = amount

	// todo: change order to set first the receiver
	// ask the user for the chain where the attestation is gonna be made
	await ctx.reply('Select a chain to create the attestation', Markup.inlineKeyboard([
		Markup.button.callback('Optimism', 'OPTIMISM_ATTESTATION'),
		Markup.button.callback('Arbitrum', 'ARBITRUM_ATTESTATION'),
	]))
})

// create attestation 
attestScene.action('OPTIMISM_ATTESTATION', createAttestationFor(Chains.Optimism))
attestScene.action('ARBITRUM_ATTESTATION', createAttestationFor(Chains.Arbitrum))

// Catch all handler
attestScene.hears(/.*/, async (ctx) => {
	await ctx.reply('Not a valid response')
})
