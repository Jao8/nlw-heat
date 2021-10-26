import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User ={
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInURL: string;
    signOut: () => void;
}


type AuthResponse = {
    token: string;
    user:{
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

type AuthProvider = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);


export function AuthProvider(props: AuthProvider){

    const [user, setUser] = useState<User | null>(null);

    const clientID = "28b058d9d3096478bb08"
    
    const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=${clientID}`
    
    async function signIn(githubCode:string) {
        const res = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        });
    
        const { token, user } = res.data;
    
        localStorage.setItem('@dowhile:token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(user);
        
    }

    function signOut() {
        setUser(null);
        localStorage.removeItem('@dowhile:token');
    }
    
    useEffect(() =>{
        const url = window.location.href;
        const hasGitHubCode = url.includes("?code=");
    
        if(hasGitHubCode){
            const [baseURL, githubCode] = url.split('?code=');
    
            window.history.pushState({}, '', baseURL)
            
            signIn(githubCode);
        }
    });

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token');

        if(token){
            
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>('profile').then(res => {
                setUser(res.data);                
            });
        }
    })

    return(
        <AuthContext.Provider value={{ signInURL, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}