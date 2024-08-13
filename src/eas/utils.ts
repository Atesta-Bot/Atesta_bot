// @ts-nocheck
import { Context } from "telegraf"
import { IChain } from "../wallet/chains"
import { Attester } from "."

/**
	* Handler that returns a Middleware for Telegraf actions 
*/
export const createAttestationFor = (chain: IChain) => {
	return async (ctx: Context) => {
		// todo: Handle attestation creation
		await ctx.reply(`Creating attestation on ${chain.name}...`)
		// console.log('ATTEST DATA ', ctx.session.attestationData)

		// create a new instance of Attester
		const attester = new Attester(chain);

		// create the attestation
		try {
			const txHash = await attester.createAttestation(ctx.session.attestationData.dao.address, {
				daoName: ctx.session.attestationData.dao.name,
				eventName: ctx.session.attestationData.eventName,
				description: ctx.session.attestationData.description,
				usdAmount: ctx.session.attestationData.usdAmount,
				ticketUrl: ctx.session.attestationData.imageUrl.publicUrl,
				attesterAddress: ctx.session.attestationData.user.address
			})

			await ctx.reply(`Attestation created: ${chain.explorerUrl}/attestation/view/${txHash}`)
		} catch (error) {
			console.error(error)
			await ctx.reply(error)
		} finally {
			await ctx.scene.leave()
		}
	}
}
