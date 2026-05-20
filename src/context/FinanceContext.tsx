import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Expense {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  date: string;
  categoryId?: string;
}

interface FinanceContextType {
  categories: Category[];
  expenses: Expense[];
  addCategory: (name: string) => boolean;
  updateCategory: (id: string, newName: string) => boolean;
  deleteCategory: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'general', name: 'General', color: '#64748b', icon: 'tag' },
  { id: '1', name: 'Alimentación', color: '#f59e0b', icon: 'pizza' },
  { id: '2', name: 'Transporte', color: '#3b82f6', icon: 'car' },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addCategory = (name: string) => {
    const nameLower = name.trim().toLowerCase();
    
    // Validamos usando el estado más reciente
    let success = false;
    setCategories(prev => {
      if (prev.some(c => c.name.toLowerCase() === nameLower)) {
        Alert.alert('Error', 'Ya existe una categoría con ese nombre.');
        return prev;
      }
      
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      const newCategory: Category = {
        id: Date.now().toString(),
        name: name.trim(),
        color: randomColor,
        icon: 'tag',
      };
      
      success = true;
      return [...prev, newCategory];
    });
    return true; // Asumimos éxito inmediato para la UI, o el componente maneja el form
  };

  const updateCategory = (id: string, newName: string) => {
    if (id === 'general') {
      Alert.alert('Error', 'La categoría general no puede ser modificada.');
      return false;
    }

    const nameLower = newName.trim().toLowerCase();
    
    setCategories(prev => {
      if (prev.some(c => c.id !== id && c.name.toLowerCase() === nameLower)) {
        Alert.alert('Error', 'Ya existe otra categoría con ese nombre.');
        return prev;
      }
      return prev.map(c => c.id === id ? { ...c, name: newName.trim() } : c);
    });
    
    return true;
  };

  const deleteCategory = (id: string) => {
    if (id === 'general') {
      Alert.alert('Error', 'La categoría general no puede ser eliminada.');
      return;
    }

    // Buscamos la categoría para saber su nombre por si hay gastos guardados con el nombre en lugar del ID
    const categoryToDelete = categories.find(c => c.id === id);
    const nameLower = categoryToDelete ? categoryToDelete.name.toLowerCase() : '';

    // Reasignar los gastos asociados a esta categoría a la categoría 'general'
    setExpenses(prevExpenses => prevExpenses.map(exp => {
      const isMatch = exp.categoryId === id || 
                      (exp.categoryId && exp.categoryId.toLowerCase() === nameLower);
      return isMatch ? { ...exp, categoryId: 'general' } : exp;
    }));

    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  return (
    <FinanceContext.Provider value={{ categories, expenses, addCategory, updateCategory, deleteCategory, addExpense }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
