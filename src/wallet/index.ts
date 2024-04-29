import { ethers } from "ethers";
import { Chains, IChain } from "./chains";

const privateKey = process.env.WALLET_PRIVATE_KEY as string

// const provider = new ethers.JsonRpcProvider(process.env.RPC);
// export const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

export const getSignerFor = (chain: IChain) => {
	const provider = new ethers.JsonRpcProvider(chain.rpcEndpoint)
	const signer = new ethers.Wallet(privateKey, provider)
	return signer
}
