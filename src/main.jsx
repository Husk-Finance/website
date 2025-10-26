import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.scss'
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { custom } from '@wagmi/core';
import { mainnet, base, mantle, mantleSepoliaTestnet } from 'wagmi/chains';
import { Porto } from 'porto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { hyperevm } from './constants/chains';

Porto.create();

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Husk Finance',
  projectId: 'cd660e6d5a6c12fe81c7f640dc8b779f',
  ssr: false,
  // chains: [mainnet, base, hyperevm, mantle, mantleSepoliaTestnet],
  chains: [mantleSepoliaTestnet],
  transports: {
    [mainnet.id]: http('https://lb.drpc.live/ethereum/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT'),
    [base.id]: http('https://lb.drpc.live/base/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT'),
    [hyperevm.id]: http('https://lb.drpc.live/hyperliquid/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT'),
    [mantle.id]: http('https://lb.drpc.live/mantle/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT'),
    [mantleSepoliaTestnet.id]: http('https://lb.drpc.live/mantle-sepolia/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT')
  },
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
