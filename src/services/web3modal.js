import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { base, hardhat } from '@wagmi/core/chains'

const projectId = (NODE_ENV == "production"? WALLET_CONNECT_PROD : WALLET_CONNECT_DEV); // <-- put your walletconnect projectId here

const chains = [base, hardhat]
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  appName: 'App',
})

export default createWeb3Modal({ wagmiConfig, projectId, chains })