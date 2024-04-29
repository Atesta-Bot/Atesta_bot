import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { getSignerFor } from '../wallet';
import { Chains } from "../wallet/chains";

const EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const SCHEMA_UID = "0x9c3afcf92221b9a0f05fc97ad0a36db27c332596bd7ddc5832975c03a98ae28f";

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
	eas: EAS;

	constructor(chain: Chains) {
		const signer = getSignerFor(chain)
		this.eas = new EAS(EAS_ADDRESS).connect(signer);
	}

	/**
		* Creates a new attestation
		* @param to - Recipient of the attestation
		* @param data - The values for our schema
		* @returns the new attestation uid
	*/
	async createAttestation(to: string, data: IAttestationData) {

		const _toEncode: ISchemaItem[] = [
			{ name: "DAO_name", value: data.daoName, type: "string" },
			{ name: "event_name", value: data.eventName, type: "string" },
			{ name: "description", value: data.description, type: "string" },
			{ name: "usd_amount", value: data.usdAmount.toString(), type: "string" },
			{ name: "ticket_url", value: data.ticketUrl, type: "string" },
			{ name: "attester_address", value: data.attesterAddress, type: "address" },
		]

		const _encodedData = schemaEncoder.encodeData(_toEncode)

		const tx = await this.eas.attest({
			schema: SCHEMA_UID,
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
