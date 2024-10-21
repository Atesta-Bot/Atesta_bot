// Define the type for attestations
export interface Attestation {
    id: string;
    attester: string;
    recipient: string;
    refUID: string;
    revocable: boolean;
    revocationTime: number;
    expirationTime: number;
    decodedDataJson: string;
    timeCreated: number;
  }