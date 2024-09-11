'use client'

import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './store' 

export const Providers = ({ children }: PropsWithChildren) => {
  return <Provider store={makeStore()}>{children}</Provider>
}