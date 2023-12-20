import { gql, OperationVariables, QueryOptions } from '@apollo/client'
import apolloClientInstance from 'adapter/apollo'
import { Token } from 'lib/Token'

export type ApolloClientResponse<T> = {
  data: T
  loading: boolean
  networkStatus: number
}

export type ApolloClientFilter = {
  first?: number
  skip?: number
  where?: { to?: string; from: string }
}

export const apolloQuery = async <R>(
  options: Omit<QueryOptions<OperationVariables, any>, 'query'> & { query: string }
) => {
  const { query, variables } = options
  return (await apolloClientInstance.query({ query: gql(query), variables })) as ApolloClientResponse<R>
}

export const getBeatNFTsByPage = async (variables?: ApolloClientFilter) => {
  const query = `
  query GetTokenByPage($first: Int, $skip: Int) {
    tokens(first: $first, skip: $skip) {
      id
      tokenId
      owners {
        id
      }
      latestPrice
    }
  } 
  `
  return apolloQuery<{ tokens: Token[] }>({
    query,
    variables,
  })
}
