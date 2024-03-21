import { Context } from "telegraf"
import { Chains } from "../wallet/chains"

export const createAttestationFor = (chain: Chains) => {
	return async (ctx: Context) => {
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
