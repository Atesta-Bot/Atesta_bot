import { Context } from "telegraf"
import { Chains } from "../wallet/chains"

/**
	* Handler that returns a Middleware for Telegraf actions 
*/
export const createAttestationFor = (chain: Chains) => {
	return async (ctx: Context) => {
		// todo: Handle attestation creation
		await ctx.reply(`Creating attestation...`)
		console.log(`Creating attestation for ${chain}...`)

		// // create a new instance of Attester
		// const attester = new Attester(chain);
		//
		// // create the attestation payload
		// const payload: IAttestationData = {}
		//
		// // create the attestation
		// const txHash = await attester.createAttestation()
	}
}
