import { createContext, useContext, useEffect, useState } from "react";
import AuthModel from "../models/AuthModel";
import axios from "axios";
import Environment from "../config/Environment";
import User from "../models/User";
import * as SecureStore from 'expo-secure-store';

interface AuthProps{
    authState?: {token:string|null; user:User|null};
    onRegister?: (name:string, email:string, password:string) =>Promise<any>;
    onLogin?: (email:string, password:string)=>Promise<any>;
    onLogout?: () =>Promise<any>;
}

const AuthContext = createContext<AuthProps>({});
export const useAuth = () =>{
    return useContext(AuthContext);
}

export const AuthProvider = ({children}:any) =>{

    const [authState, setAuthState] = useState<AuthModel>({token:null, user:null});

    useEffect(()=>{
        const loadToken = async () =>{
            const token = await SecureStore.getItemAsync("TOKEN");
            const user = await SecureStore.getItemAsync("USER");
            if(token){
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token:token,
                    user: JSON.parse(user)
                })
            }
        }
        loadToken();
    },[]);

    const register = async(name:string, email:string, password:string) =>{
        try{
            const response = await axios.post(`${Environment.getApiUrl()}/users`,{name, email, password});

            return response;
        }catch(e){
            throw e;
        }
    }

    const login = async(email:string, password:string) =>{
        try{
            const response = await axios.post(`${Environment.getApiUrl()}/users/login`, {email, password});
            
            setAuthState({
                token: response.data.token,
                user:{
                    id: response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                } as Partial<User>
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            await SecureStore.setItemAsync("TOKEN", response.data.token);
            await SecureStore.setItemAsync("USER", JSON.stringify(response.data.user));

            return response;

        }catch(e:any){
            throw e;
        }
    }

    const logout = async () =>{
        await SecureStore.deleteItemAsync("TOKEN");

        axios.defaults.headers.common['Authorization']="";

        setAuthState({
            token:null,
            user:null
        })
    }


    const value = {
        onLogin: login,
        onLogout: logout,
        onRegister: register,
        authState: authState
    } as AuthProps;


    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}