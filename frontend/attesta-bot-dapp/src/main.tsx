import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { baseSepolia } from "viem/chains";

const environmentId = import.meta.env.VITE_ENVIRONMENT_ID;

const config = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(
  //<React.StrictMode>
    <ChakraProvider>
      <DynamicContextProvider
        settings={{
          environmentId: environmentId!,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    </ChakraProvider>
  //</React.StrictMode>
);
