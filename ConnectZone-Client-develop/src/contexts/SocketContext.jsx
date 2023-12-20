import { createContext, useReducer, useEffect } from 'react'
import { io } from "socket.io-client"

const ENDPOINT = "http://localhost:8080";

export const socket = io(ENDPOINT)

export const SocketContext = createContext()
export const SocketContextProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

