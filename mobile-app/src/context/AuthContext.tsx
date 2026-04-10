import React, { createContext, useReducer, ReactNode } from "react";
import { authReducer, initialState } from "./authReducer";
import { User, UserProfileUpdate } from "../models/User";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (user:User) => void;
    logout: () => void;
    updateProfile: (updates: UserProfileUpdate) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({children}: Props) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

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

    const updateProfile = (updates: UserProfileUpdate) => {
        dispatch({
            type: "UPDATE_PROFILE",
            payload: updates,
        });
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                login,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>

    );
};