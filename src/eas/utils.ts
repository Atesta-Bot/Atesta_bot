// @ts-nocheck
import { Context } from "telegraf"
import { Chains } from "../wallet/chains"
import { Attester, IAttestationData } from "."

/**
	* Handler that returns a Middleware for Telegraf actions 
*/
export const createAttestationFor = (chain: Chains) => {
	return async (ctx: Context) => {
		// todo: Handle attestation creation
		await ctx.reply(`Creating attestation on ${chain}...`)
		console.log(`Creating attestation for ${chain}...`)
		console.log(`createAttestationFor called with context:`)

		console.log(ctx.session.attestationData)

		// create a new instance of Attester
		const attester = new Attester(chain);

		// create the attestation
		try {
			const txHash = await attester.createAttestation(ctx.session.attestationData.dao.address, {
				daoName: ctx.session.attestationData.dao.name,
				eventName: ctx.session.attestationData.eventName,
				description: ctx.session.attestationData.description,
				usdAmount: ctx.session.attestationData.usdAmount,
				ticketUrl: ctx.session.attestationData.imageUrl,
				attesterAddress: ctx.session.attestationData.user.address
			})

			await ctx.reply(`txHash: ${txHash}`)
		} catch (error) {
			console.error(error)
			await ctx.reply(error)
		} finally {
			await ctx.scene.leave()
		}
	}
}
