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
import { addIncome } from "@/src/services/expenseService";

const incomeCategories = [
  "Salary",
  "Scholarship",
  "Bonus",
  "Gift",
  "Freelance",
  "Investment",
  "Other",
];

export default function AddIncomeScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");

  const handleSave = async () => {
    console.log("HANDLE START"); 
    if (!title || !amount) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
        if (!user?.id) {
      Alert.alert("Error", "User not found");
      return;
    }
    try{ 
      console.log("TRY START");
      await addIncome(user.id, {
        title,
        amount: Number(amount),
        category: "Income",
        date: new Date().toISOString().split("T")[0],
      });
      console.log("SUCCESS"); 
      router.back();
    } catch (error) {
      console.error("ERROR",error);
      Alert.alert("Error", "Failed to save income");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>

        <Text style={styles.title}>Add Income</Text>

        {/* TITLE */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          testID="income-title-input"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        {/* AMOUNT */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          testID="income-amount-input"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        {/* CATEGORIES */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", margin: 8 }}>
          {incomeCategories.map((cat) => (
            <Pressable
              key={cat}
              testID={`income-category-${cat.toLowerCase()}`}
              onPress={() => {
                setCategory(cat);
                setTitle(cat);
              }}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: category === cat ? "#6366F1" : "#E5E7EB",
              }}
            >
              <Text style={{ color: category === cat ? "white" : "black" }}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* SAVE BUTTON */}
        <Pressable
          testID="income-save-button"
          onPress={() => {
            console.log("PRESS WORKS");
            handleSave();
          }}
          style={({ pressed }) => [
            {
              backgroundColor: "#6366F1",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 20,
              width: "100%",
              zIndex: 10, 
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            Save Income
          </Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}
