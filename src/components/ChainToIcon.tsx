import { ArbitrumIcon, BNBIcon, EthereumIcon, PolygonIcon } from './Icons/chains'

interface Prop {
  chain: String
}

const ChainToIcon = (prop: Prop) => {
  switch (prop.chain) {
    case '1':
      return <EthereumIcon />
    case '137':
      return <PolygonIcon />
    case '56':
      return <BNBIcon />
    case '42161':
      return <ArbitrumIcon />
  }
}

export default ChainToIcon
