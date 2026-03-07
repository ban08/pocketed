import { User } from "../models/User"

export interface AuthState {
    isAuthenticated : boolean;
    user : User | null;
}

export type AuthAction =
    | { type: "LOGIN"; payload: User }
    | { type: "LOGOUT" };

export const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
}

export function authReducer(
    state: AuthState,
    action: AuthAction
): AuthState {
    switch (action.type) {
        case "LOGIN":
            return {
                isAuthenticated: true,
                user: action.payload,
            };
        case "LOGOUT":
            return {
                isAuthenticated: false,
                user: null,
            }
        default:
            return state;
    }
}