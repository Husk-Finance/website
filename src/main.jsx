import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.scss'
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, base, mantle } from 'wagmi/chains';
import { Porto } from 'porto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { hyperevm } from './constants/chains';

Porto.create();

const queryClient = new QueryClient();

const RPC_URLS = {
  [mainnet.id]: 'https://lb.drpc.live/ethereum/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT',
  [mantle.id]: 'https://lb.drpc.live/mantle/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT',
  [base.id]: 'https://lb.drpc.live/base/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT',
  [hyperevm.id]: 'https://lb.drpc.live/hyperliquid/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT',
};

export const NETWORKS = {
  MAINNET: {
    id: mainnet.id,
    name: 'Ethereum',
    shortName: 'Ethereum',
    nativeCurrency: mainnet.nativeCurrency,
    rpcUrl: RPC_URLS[mainnet.id],
    blockExplorer: 'https://etherscan.io',
    chain: mainnet,
  },
  MANTLE: {
    id: mantle.id,
    name: 'Mantle',
    shortName: 'Mantle',
    nativeCurrency: mantle.nativeCurrency,
    rpcUrl: RPC_URLS[mantle.id],
    blockExplorer: 'https://mantlescan.xyz',
    chain: mantle,
  },
  BASE: {
    id: base.id,
    name: 'Base',
    shortName: 'Base',
    nativeCurrency: base.nativeCurrency,
    rpcUrl: RPC_URLS[base.id],
    blockExplorer: 'https://basescan.org',
    chain: base,
  },
  HYPEREVM: {
    id: hyperevm.id,
    name: 'HyperEVM',
    shortName: 'HyperEVM',
    nativeCurrency: hyperevm.nativeCurrency,
    rpcUrl: RPC_URLS[hyperevm.id],
    blockExplorer: 'https://hyperevmscan.io',
    chain: hyperevm,
  }
};

export const CHAIN_IDS = {
  MAINNET: mainnet.id,
  MANTLE: mantle.id,
  BASE: base.id,
  HYPEREVM: hyperevm.id,
};

export const DEFAULT_CHAIN_ID = CHAIN_IDS.MAINNET;

export function getNetworkByChainId(chainId) {
  return Object.values(NETWORKS).find(network => network.id === chainId) || null;
}

export function isSupportedChain(chainId) {
  return Object.values(CHAIN_IDS).includes(chainId);
}

const transports = {};
for (const key in RPC_URLS) {
  transports[key] = http(RPC_URLS[key]);
}

const config = getDefaultConfig({
  appName: 'Husk Finance',
  projectId: 'cd660e6d5a6c12fe81c7f640dc8b779f',
  ssr: false,
  chains: [mainnet, mantle, base, hyperevm],
  transports: transports
});

const myDarkTheme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: '#388262', // Custom accent color
    accentColorForeground: '#ffffff',
    modalBackground: '#1a1a1a',
    modalText: '#ffffff',
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myDarkTheme}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
