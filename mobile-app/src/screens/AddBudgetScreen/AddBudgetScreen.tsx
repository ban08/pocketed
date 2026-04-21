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
import { styles } from "../AddExpenseScreen/AddExpenseScreen.style";
import { AuthContext } from "@/src/context/AuthContext";
import { BASE_URL } from "@/src/services/api";

export default function AddBudgetScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const handleSave = async () => {
    // validation
    if (!category || !limit) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      await fetch(`${BASE_URL}/users/${user.id}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          limit: Number(limit),
          period: "monthly",
        }),
      });

      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save budget");
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>

        <Text style={styles.title}>Add Budget</Text>

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Food"
        />

        <Text style={styles.label}>Limit</Text>
        <TextInput
          style={styles.input}
          value={limit}
          onChangeText={setLimit}
          keyboardType="numeric"
          placeholder="e.g. 500"
        />

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.buttonPrimary,
            pressed && styles.buttonPrimaryPressed,
          ]}
        >
          <Text style={styles.buttonText}>Save Budget</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Cancel</Text>
        </Pressable>

      </SafeAreaView>
    </View>
  );
}