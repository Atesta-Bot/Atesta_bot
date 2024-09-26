export interface IChain {
	id: string,
	name: string,
	rpcEndpoint: string,
	explorerUrl: string,
}
export const Chains: IChain[] = [
	// {
	// 	id: 'ethereum-sepolia',
	// 	name: 'Ethereum Sepolia',
	// 	rpcEndpoint: 'https://ethereum-sepolia-rpc.publicnode.com',
	// 	explorerUrl: 'https://sepolia.easscan.org'
	// },
	{
	 	id: 'arbitrum',
	 	name: 'Arbitrum',
	 	rpcEndpoint: 'https://arbitrum.drpc.org',
	 	explorerUrl: 'https://arbitrum.easscan.org'
	},
	{
		id: 'base-sepolia',
		name: 'Base Sepolia',
		rpcEndpoint: 'https://sepolia.base.org',
		explorerUrl: 'https://base-sepolia.easscan.org'
	}
]
