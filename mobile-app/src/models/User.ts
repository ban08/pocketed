export interface User {
    id: string;
        fullName: string;
    email: string;
        address: string;
        profilePicture?: string;
}

export type UserProfileUpdate = Partial<
    Pick<User, "fullName" | "email" | "address" | "profilePicture">
>;