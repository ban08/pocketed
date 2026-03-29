import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/User';

const USER_INFO_KEY = 'pocket4students_user_info';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData): Promise<User> => {
  const existingJson = await AsyncStorage.getItem(USER_INFO_KEY);

  if (existingJson) {
    const existingUser: User = JSON.parse(existingJson);
    if (existingUser.email === data.email) {
      throw new Error('This email is already registered.');
    }
  }

  const newUser: User = {
    id: String(Date.now()),
    name: data.name,
    email: data.email,
    password: data.password,
  };

  await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(newUser));

  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const userJson = await AsyncStorage.getItem(USER_INFO_KEY);

  //  AUTO-CREATE USER (for testing purposes only)
  if (!userJson) {
    const defaultUser: User = {
      id: "1",
      name: "Test User",
      email: "test@edu.up.pt",
      password: "Test123#", 
    };

    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(defaultUser));

    if (email === defaultUser.email && password === defaultUser.password) {
      return defaultUser;
    }
  }

  const existingUser: User = JSON.parse(
    (await AsyncStorage.getItem(USER_INFO_KEY)) as string
  );

  if (existingUser.email !== email || existingUser.password !== password) {
    throw new Error('Invalid email or password.');
  }

  return existingUser;
};