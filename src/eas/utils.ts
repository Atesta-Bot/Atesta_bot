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
		await ctx.reply(`Creating attestation...`)
		console.log(`Creating attestation for ${chain}...`)
		console.log(`createAttestationFor called with context:`)

		console.log(ctx.session.attestationData)

		await ctx.reply(`Mock attestation`)


		// create a new instance of Attester
		const attester = new Attester(chain);

		// create the attestation
		try {
			const txHash = await attester.createAttestation(ctx.session.attestationData.dao.address, {
				daoName: ctx.session.attestationData.dao.name,
				eventName: ctx.session.attestationData.eventName,
				description: ctx.session.attestationData.description,
				usdAmount: ctx.session.attestationData.usdAmount
			})
			await ctx.reply(`txHash: ${txHash}`)
		} catch (error) {
			await ctx.reply(error)
		}
	}
}
