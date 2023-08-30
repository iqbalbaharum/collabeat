
const ChainName = ({ chainId }: {chainId: string}) => {

  switch(chainId.toString()) {
    case '1':
      return (<>Ethereum</>)
    case '4':
      return (<>Rinkeby</>)
    case '56':
      return (<>Binance</>)
    case '1313161554':
      return (<>Aurora</>)
    case '80001':
      return (<>Polygon (Mumbai)</>)
    case '97':
      return (<>Binance (Testnet)</>)
    case '1313161555':
      return (<>Aurora (Testnet)</>)
    case 'solana':
      return (<>Solana</>)
    case 'near':
      return (<>Near</>)
    default:
      return (<>Chain ID: {chainId}</>)
  }
}

export default ChainName