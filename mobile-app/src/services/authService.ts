import { User, UserProfileUpdate } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "pocket_users"; // Storage key
const CURRENT_USER_KEY = "current_user";

function normalizeUser(raw: any): User {
  const fullName =
    typeof raw?.fullName === "string" && raw.fullName.trim().length > 0
      ? raw.fullName.trim()
      : typeof raw?.name === "string" && raw.name.trim().length > 0
        ? raw.name.trim()
        : "Student User";

  const profilePicture =
    typeof raw?.profilePicture === "string" && raw.profilePicture.trim().length > 0
      ? raw.profilePicture
      : undefined;

  return {
    id: String(raw?.id ?? Date.now()),
    email: String(raw?.email ?? "").trim().toLowerCase(),
    fullName,
    profilePicture,
    name: fullName,
  };
}

async function getStoredUsers(): Promise<User[]> {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson).map(normalizeUser) : [];
}

async function saveStoredUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  // Get existing users from storage
  const users = await getStoredUsers();

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
    profilePicture: undefined,
    name: normalizedName,
  };
  users.push(user);

  // Save 
  await saveStoredUsers(users);
  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  // Get users from storage
  const users = await getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Find user
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) throw new Error("User not found");

  await saveStoredUsers(users);
  return user;
};

export const saveUserProfile = async (
  user: User,
  updates: UserProfileUpdate
): Promise<User> => {
  const updatedUser = normalizeUser({
    ...user,
    ...updates,
  });
  const users = await getStoredUsers();
  const existingIndex = users.findIndex((storedUser) => storedUser.id === user.id);

  if (existingIndex >= 0) {
    users[existingIndex] = updatedUser;
  } else {
    users.push(updatedUser);
  }

  await saveStoredUsers(users);
  await saveCurrentUser(updatedUser);
  return updatedUser;
};

// Save current logged-in user
export const saveCurrentUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizeUser(user)));
};

// Get current logged-in user (restore session)
export const getCurrentUser = async (): Promise<User | null> => {
  const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return userJson ? normalizeUser(JSON.parse(userJson)) : null;
};

// Clear current user (logout)
export const clearCurrentUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};
