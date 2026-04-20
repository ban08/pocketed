import React, { createContext, useEffect, useReducer, ReactNode } from "react";
import { authReducer, initialState } from "./authReducer";
import { User, UserProfileUpdate } from "../models/User";
import { getCurrentUser, saveUserProfile } from "../services/authService";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (user:User) => void;
    logout: () => void;
    updateProfile: (updates: UserProfileUpdate) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({children}: Props) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    dispatch({
                        type: "LOGIN",
                        payload: user,
                    });
                }
            } finally {
                setIsLoading(false);
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

    const updateProfile = async (updates: UserProfileUpdate) => {
        if (!state.user) {
            return;
        }

        const updatedUser = await saveUserProfile(state.user, updates);
        dispatch({
            type: "LOGIN",
            payload: updatedUser,
        });
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: state.isAuthenticated,
                isLoading,
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
