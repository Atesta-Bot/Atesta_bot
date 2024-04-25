import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { getSignerFor } from '../wallet';
import { Chains } from "../wallet/chains";

const EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const SCHEMA_UID = "0xe4e843eca0b777daf3500b7712099c9426ef4522021216503657575fb132ca2b";

const schemaEncoder = new SchemaEncoder("string DAO_name,string event_name,string description,string usd_amount");

interface ISchemaItem {
	name: string,
	value: any,
	type: "string"
}

export interface IAttestationData {
	daoName: string,
	eventName: string,
	description: string,
	usdAmount: number
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
