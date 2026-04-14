import { useContext } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";
import { View, Text, StyleSheet } from 'react-native';
import { getExpenses } from '@/src/services/expenseService';
import { Expense } from '@/src/models/Expense';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

export default function HomeScreen() {

  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return null;
  }
  const expenses: Expense[] = getExpenses();
  const total = expenses.reduce(
    (sum: number, item: Expense) => sum + item.amount, 0);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>pocketED</Text>
        <Text style={styles.totalText}>Total this month: €{total}</Text>

        {expenses.map((item: Expense) => (
          <Text key={item.id} style={styles.expenseItem}>
            {item.title} - €{item.amount}
          </Text>
        ))}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  expenseItem: {
    fontSize: 16,
    marginVertical: spacing.sm,
  },
});