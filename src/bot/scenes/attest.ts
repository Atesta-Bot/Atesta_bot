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
			user: data,
		}

		await ctx.reply('Enter the name of the event')
	} catch (error) {
		console.error(error)
		await ctx.reply(JSON.stringify(error))
		return await ctx.scene.leave()
	}

})

attestScene.hears(/.*/, async (ctx, next) => {
	if (ctx.session.attestationData.eventName) return await next()
	ctx.session.attestationData.eventName = ctx.message.text
	await ctx.reply('Enter the name of the DAO')
})

attestScene.hears(/.*/, async (ctx, next) => {
	if (ctx.session.attestationData.dao) return await next()
	// search for the dao in db 
	// save the dao
	try {
		const { data: dao } = await supabase
			.from('daos')
			.select('*')
			.eq('name', ctx.message.text.toLowerCase())
			.single()

		if (!dao) return await ctx.reply('No DAO found with that name')

		const { data: allowedAttester } = await supabase
			.from('allowed_attesters')
			.select('*')
			.eq('attester_id', ctx.session.attestationData.user.id)
			.eq('dao_id', dao.id)
			.single()

		if (!allowedAttester) {
			await ctx.reply('You are not allowed to create attestations for this DAO')
			return await ctx.scene.leave()
		}

		ctx.session.attestationData.dao = dao
		await ctx.reply('Send a photo of the ticket')

	} catch (error) {
		console.error(error)
		await ctx.reply(error)
	}
})

// handle photo upload and ask for the amount in usd
attestScene.on('photo', async (ctx) => {
	try {
		await ctx.reply('Uploading photo...')
		console.log('Uploading photo to supabase...')

		const photo = ctx.message.photo.pop()
		const fileLink = await ctx.telegram.getFileLink(photo?.file_id)
		console.log('file link: ', fileLink)
		// download file from telegram servers
		const res = await fetch(fileLink)
		const file = await res.blob()

		// upload the file to supbase
		const fileName = `ticket-${photo?.file_unique_id}-${Date.now()}.jpeg`
		console.log('file name: ', fileName, file)
		// const url = await uploadFile(Bucket.Tickets, fileName, file)
		// console.log(`Image uploaded: ${url}`)
		await ctx.reply('Done')

		// await ctx.reply(url)
		ctx.session.attestationData.imageUrl = "ticket-AQADLawxG2qb4Ed9-1719435862355.jpeg" //url
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

attestScene.hears(/.*/, async (ctx, next) => {
	if (ctx.session.attestationData.description) return await next()
	ctx.session.attestationData.description = ctx.message.text

	const callbacks = Chains.map(chain => Markup.button.callback(chain.name, chain.id))

	// ask for the chain to conclude
	await ctx.reply('Select a chain to create the attestation', Markup.inlineKeyboard(callbacks))
})

attestScene.hears(/.*/, async (ctx) => {
	await ctx.reply('Not a valid response')
})

// create attestations
Chains.forEach(chain => {
	attestScene.action(chain.id, createAttestationFor(chain))
})
