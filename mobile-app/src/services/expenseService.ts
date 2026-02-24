import expenses from '../data/expenses.json';
import { Expense } from '../models/Expense';

export const getExpenses = (): Expense[] => {
    return expenses as Expense[];
}