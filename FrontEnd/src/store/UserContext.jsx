import axios from "axios";

import { createContext, useState} from 'react';
import { useEffect } from "react";

export const UserContext = createContext({}) ;

export function UserContextProvider({children}){
    const [user , setUser] = useState() ;
    const [ready , setReady] = useState(false) ;
    useEffect(() => {
        if(!user){
            axios.get('/profile').then(({data}) => {
                
                setUser(data);
                setReady(true) ;
            });
            
            
        }

    },[])
    return <>
        <UserContext.Provider value={{user , setUser,ready}}>
        {children}
        </UserContext.Provider>
    </>
}