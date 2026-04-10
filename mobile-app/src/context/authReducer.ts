import { User, UserProfileUpdate } from "../models/User";

export interface AuthState {
    isAuthenticated : boolean;
    user : User | null;
}

export type AuthAction =
    | { type: "LOGIN"; payload: User }
    | { type: "LOGOUT" }
    | { type: "UPDATE_PROFILE"; payload: UserProfileUpdate };

export const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

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
            };
        case "UPDATE_PROFILE":
            if (!state.user) {
                return state;
            }

            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
}