import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { base, hardhat } from '@wagmi/core/chains'

const projectId = '718e3fe502080e8ed967b458d568c21d' // <-- put your walletconnect projectId here

const chains = [hardhat]
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  appName: 'App',
})

export default createWeb3Modal({ wagmiConfig, projectId, chains })