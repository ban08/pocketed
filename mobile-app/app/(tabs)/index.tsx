import { View, Text, StyleSheet } from 'react-native';
import { getExpenses } from '@/src/services/expenseService';
import { Expense } from '@/src/models/Expense';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

export default function HomeScreen() {
  const expenses: Expense[] = getExpenses();

  const total = expenses.reduce(
    (sum: number, item: Expense) => sum + item.amount,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pocket4Students</Text>
      <Text>Total this month: €{total}</Text>

      {expenses.map((item: Expense) => (
        <Text key={item.id}>
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
});