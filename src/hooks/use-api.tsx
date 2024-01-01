import React, { createContext, useContext } from 'react'
import rpc from 'services/rpc'

interface ApiContextProps {
  rpc: typeof rpc
}

interface ApiProviderProps {
  children: React.ReactNode
}

export const ApiContext = createContext<ApiContextProps | undefined>({ rpc })

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within a ApiProvider')
  }
  return context
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  return <ApiContext.Provider value={{ rpc }}>{children}</ApiContext.Provider>
}
