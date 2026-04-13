import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { styles } from "./AddExpenseScreen.style";
import { AuthContext } from "@/src/context/AuthContext";
import { BASE_URL } from "@/src/services/api";

export default function AddExpenseScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSave = async () => {

    if (!title || !amount || !category) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
        if (!user?.id) {
      Alert.alert("Error", "User not found");
      return;
    }
    try{ 
      await fetch(`${BASE_URL}/users/${user?.id}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          category,
          date: new Date().toISOString().split("T")[0],
        }),
      });
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save expense");
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>

        <Text style={styles.title}>Add Expense</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Coffee"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="e.g. 5.50"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Food"
        />

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.buttonPrimary,
            pressed && styles.buttonPrimaryPressed,
          ]}
        >
          <Text style={styles.buttonText}>Save Expense</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Cancel</Text>
        </Pressable>

      </SafeAreaView>
    </View>
  );
}