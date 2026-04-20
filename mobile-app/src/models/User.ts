export interface User {
    id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
    name?: string;
}

export type UserProfileUpdate = {
    fullName?: string;
    email?: string;
    profilePicture?: string;
};
