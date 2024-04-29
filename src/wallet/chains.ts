export interface IChain {
	id: string,
	name: string,
	rpcEndpoint: string,
	explorerUrl: string,
}
export const Chains: IChain[] = [
	{
		id: 'ethereum-sepolia',
		name: 'Ethereum Sepolia',
		rpcEndpoint: 'https://ethereum-sepolia-rpc.publicnode.com',
		explorerUrl: 'https://sepolia.easscan.org'
	},
	{
		id: 'optimism-sepolia',
		name: 'Optimism Sepolia',
		rpcEndpoint: 'https://optimism-sepolia-rpc.publicnode.com',
		explorerUrl: 'https://optimism-sepolia.easscan.org'
	}
]
