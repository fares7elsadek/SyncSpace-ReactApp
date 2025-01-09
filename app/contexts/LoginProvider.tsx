"use client"
import React, { useEffect, useState } from 'react'
import { createContext ,useContext } from 'react'

const loginContext = createContext({}) ; 

export const LoginProvider = ({children}:{children:any}) => {
    const [logedin , setLogedin] = useState(false) ;
    

    return (
        <loginContext.Provider value={{logedin , setLogedin}}>
            {children}
        </loginContext.Provider>
  )
}

export const useLogin = ()=>{
    return useContext(loginContext);
}