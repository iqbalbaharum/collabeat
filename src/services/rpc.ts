import rpc from "adapter/jsonrpc"
import { formatDataKey } from "utils"

const getMetadataAllVersion = (chain: String, address: String, token_id: String) => {
  const encoded_key = formatDataKey(chain, address, token_id)
  return rpc({
    method: 'POST',
    data: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "get_metadatas_all_version",
      "params": [
        encoded_key
      ],
      "id": "1"
    })
  })
}

const getMetadataUseKeyByBlock = (nftKey: String, meta_contract_id: String, version: String) => {
  return rpc({
    method: 'POST',
    data: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "get_metadatas_by_block",
      "params": [nftKey, meta_contract_id, version],
      "id": "1"
    })
  })
}

const getContentFromIpfs = (cid: String) => {
  return rpc({
    method: 'POST',
    data: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "ipfs_get",
      "params": [cid],
      "id": "1"
    })
  })
}

const publish = (alias: String, chain_id: String, data: String, mcdata: String, meta_contract_id: String, method: String, public_key: String, signature: String, token_address: String, token_id: String, version: String) => {
  return rpc({
    method: 'POST',
    data: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "publish",
      "params": {
        alias, chain_id, data, mcdata, meta_contract_id, method, public_key, signature, token_address, token_id, version
      },
      "id": "1"
    })
  })
}

export default {getMetadataAllVersion, getMetadataUseKeyByBlock, getContentFromIpfs, publish}