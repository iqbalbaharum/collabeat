import { useState } from 'react'
import { useGetNftMetadata } from 'repositories/rpc.repository'

interface Prop {
  dataKey: string
}

const useLoadNft = (prop: Prop) => {
  const { data: nft } = useGetNftMetadata(prop.dataKey)

  return { nft }
}

export default useLoadNft
