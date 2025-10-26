import { defineChain } from 'viem'

export const hyperevm = defineChain({
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
  iconUrl: 'https://static.debank.com/image/chain/logo_url/hyper/0b3e288cfe418e9ce69eef4c96374583.png',
})
