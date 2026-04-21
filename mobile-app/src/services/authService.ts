import { User } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./api";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) throw new Error("Registration failed");

  const data = await res.json();
  const userRes = await fetch(`${BASE_URL}/users/${data.id}`);
  const fullUser = await userRes.json();

  const user: User = {
    id: fullUser.id,
    email: fullUser.email,
    name: fullUser.name,
  };

  await saveCurrentUser(user);

  return user;
};


export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid email or password");
  }

  const data = await res.json();
  console.log("LOGIN RESPONSE", data);

  const userRes = await fetch(`${BASE_URL}/users/${data.id}`);
  const fullUser = await userRes.json();

  const user: User = {
    id: fullUser.id,        
    email: fullUser.email,
    name: fullUser.name, 
  };
  console.log("FULL USER", fullUser);

  await saveCurrentUser(user);

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