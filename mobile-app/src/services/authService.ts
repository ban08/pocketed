import { User } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "pocket_users"; // Storage key

function normalizeUser(raw: any): User {
  const fullName =
    typeof raw?.fullName === "string" && raw.fullName.trim().length > 0
      ? raw.fullName.trim()
      : typeof raw?.name === "string" && raw.name.trim().length > 0
        ? raw.name.trim()
        : "Student User";

  const address =
    typeof raw?.address === "string" && raw.address.trim().length > 0
      ? raw.address.trim()
      : "Address not provided yet";

  const profilePicture =
    typeof raw?.profilePicture === "string" && raw.profilePicture.trim().length > 0
      ? raw.profilePicture
      : undefined;

  return {
    id: String(raw?.id ?? Date.now()),
    email: String(raw?.email ?? "").trim().toLowerCase(),
    fullName,
    address,
    profilePicture,
    name: fullName,
  };
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  // Get existing users from storage
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: User[] = usersJson ? JSON.parse(usersJson).map(normalizeUser) : [];

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim() || "Student User";

  // Check if user exists
  const existingUser = users.find((u) => u.email === normalizedEmail);
  if (existingUser) throw new Error("User already exists");

  // Create new user
  const user: User = {
    id: Date.now().toString(),
    fullName: normalizedName,
    email: normalizedEmail,
    address: "Address not provided yet",
    profilePicture: undefined,
    name: normalizedName,
  };
  users.push(user);

  // Save 
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  // Get users from storage
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: User[] = usersJson ? JSON.parse(usersJson).map(normalizeUser) : [];
  const normalizedEmail = email.trim().toLowerCase();

  // Find user
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) throw new Error("User not found");

  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  return user;
};
// Save current logged-in user
export const saveCurrentUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem("current_user", JSON.stringify(user));
};

// Get current logged-in user (restore session)
export const getCurrentUser = async (): Promise<User | null> => {
  const userJson = await AsyncStorage.getItem("current_user");
  return userJson ? normalizeUser(JSON.parse(userJson)) : null;
};

// Clear current user (logout)
export const clearCurrentUser = async (): Promise<void> => {
  await AsyncStorage.removeItem("current_user");
};