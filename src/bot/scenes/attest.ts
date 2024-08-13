// @ts-nocheck
import { Markup, Scenes } from "telegraf";
import fetch from 'node-fetch';
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
	// search for the dao in db 
	// save the dao
	try {

		if (ctx.session.attestationData.dao) return await next();

		const daoName = ctx.message.text.toLowerCase().trim();

		if (!daoName) {
			return await ctx.reply('Please provide a valid DAO name.');
		}

		const { data: dao, error: daoError } = await supabase
			.from('daos')
			.select('*')
			.eq('name', ctx.message.text.toLowerCase())
			.single()

		if (daoError || !dao) {
            return await ctx.reply('No DAO found with that name.');
        }

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
		const res = await fetch(fileLink.href)

		if (!res.ok) {
			throw new Error(`Failed to download image: ${res.statusText}`);
		}
		// console.log('---->> ', res);

		const fileBuffer = await res.arrayBuffer();
		const buffer = Buffer.from(fileBuffer); 

		// upload the file to supbase
		// Subir el archivo a Supabase
		const fileName = `ticket-${photo?.file_unique_id}-${Date.now()}.jpeg`;
		// console.log('File name: ', fileName);

		const { data, error } = await supabase.storage
			.from('tickets')
			.upload(fileName, buffer, {
				contentType: 'image/jpeg',
			});
		console.log('Image uploaded: ', data);

		if (error) {
			throw new Error(`Failed to upload image to Supabase: ${error.message}`);
		}

		// Guardar la URL de la imagen en la sesión
		const { data: publicURL } = supabase
			.storage
			.from('tickets')
			.getPublicUrl(fileName);

		console.log('Public URL: ', publicURL);
		ctx.session.attestationData.imageUrl = publicURL;

		await ctx.reply('Photo uploaded successfully!');
		await ctx.reply('Now enter the fiat amount to be paid in USD');
	} catch (error) {
		console.error('Error during photo upload:', error);
		await ctx.reply('An error occurred while uploading the photo. Please try again.');
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
