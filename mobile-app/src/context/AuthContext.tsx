import React, { createContext, useReducer, ReactNode } from "react";
import { authReducer, initialState } from "./authReducer";
import { useEffect } from "react";
import { getCurrentUser } from "../services/authService";
import { User } from "../models/User";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (user:User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({children}: Props) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const loadUser = async () => {
            const user = await getCurrentUser();
            if (user) {
                dispatch({
                    type: "LOGIN",
                    payload: user,
                });
            }
        };
        loadUser();
    }, []);

    const login = (user: User) => {
        dispatch({
            type: "LOGIN",
            payload: user,
        });
    };

    const logout = () => {
        dispatch({
            type: "LOGOUT",
        });
    };
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>

    );
};