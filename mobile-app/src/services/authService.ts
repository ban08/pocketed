import { User } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "pocket_users"; // Storage key

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  // Get existing users from storage
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: User[] = usersJson ? JSON.parse(usersJson) : [];

  // Check if user exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) throw new Error("User already exists");

  // Create new user
  const user: User = { id: Date.now().toString(), email , name};
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
  const users: User[] = usersJson ? JSON.parse(usersJson) : [];

  // Find user
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("User not found");
  return user;
};
// Save current logged-in user
export const saveCurrentUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem("current_user", JSON.stringify(user));
};

// Get current logged-in user (restore session)
export const getCurrentUser = async (): Promise<User | null> => {
  const userJson = await AsyncStorage.getItem("current_user");
  return userJson ? JSON.parse(userJson) : null;
};

// Clear current user (logout)
export const clearCurrentUser = async (): Promise<void> => {
  await AsyncStorage.removeItem("current_user");
};