import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { getSignerFor } from '../wallet';
import { IChain } from "../wallet/chains";

const EAS_BASE_ADDRESS = "0x4200000000000000000000000000000000000021"; // "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const EAS_ARB_ADDRESS = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
const SCHEMA_UID_BASE = "0xdb1b4ddf7e76efab3770ddc544f1edf3443b01251747aa8f008137f4bb1d12c4";
const SCHEMA_UID_ARB = "0x9c3afcf92221b9a0f05fc97ad0a36db27c332596bd7ddc5832975c03a98ae28f";

const schemaEncoder = new SchemaEncoder("string DAO_name,string event_name,string description,string usd_amount,string ticket_url,address attester_address");

interface ISchemaItem {
	name: string,
	value: any,
	type: "string" | "address"
}

export interface IAttestationData {
	daoName: string,
	eventName: string,
	description: string,
	usdAmount: number,
	ticketUrl: string,
	attesterAddress: string
}

/**
	* Facade for the EAS 
*/
export class Attester {
	eas: EAS | undefined;

	constructor(chain: IChain) {
		if (chain.id === 'arbitrum') {
			const signer = getSignerFor(chain)
			this.eas = new EAS(EAS_ARB_ADDRESS).connect(signer);
		}
		if (chain.id === 'base-sepolia') {
			const signer = getSignerFor(chain)
			this.eas = new EAS(EAS_BASE_ADDRESS).connect(signer);
		}
		
	}

	/**
		* Creates a new attestation
		* @param to - Recipient of the attestation
		* @param data - The values for our schema
		* @param chain - The chain to create the attestation on
		* @returns the new attestation uid
	*/
	async createAttestation(to: string, data: IAttestationData, chain: IChain) {

		const _toEncode: ISchemaItem[] = [
			{ name: "DAO_name", value: data.daoName, type: "string" },
			{ name: "event_name", value: data.eventName, type: "string" },
			{ name: "description", value: data.description, type: "string" },
			{ name: "usd_amount", value: data.usdAmount.toString(), type: "string" },
			{ name: "ticket_url", value: data.ticketUrl, type: "string" },
			{ name: "attester_address", value: data.attesterAddress, type: "address" },
		]

		const _encodedData = schemaEncoder.encodeData(_toEncode)

		if (!this.eas) {
			throw new Error("EAS instance is not initialized");
		}
		const tx = await this.eas.attest({
			schema: chain.id === 'arbitrum' ? SCHEMA_UID_ARB : SCHEMA_UID_BASE,
			data: {
				recipient: to,
				expirationTime: BigInt(0),
				revocable: false,
				data: _encodedData,
			},
		});
		const newAttestationUID = await tx.wait();
		console.log("New attestation UID:", newAttestationUID);

		return newAttestationUID;
	}
}
