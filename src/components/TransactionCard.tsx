import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { useFinance } from '@/context/FinanceContext';

interface TransactionCardProps {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  categoryId?: string;
}

export function TransactionCard({ type, amount, description, date, categoryId }: TransactionCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const { categories } = useFinance();
  
  const isIncome = type === 'income';
  const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
  const iconColor = isIncome ? colors.success : colors.danger;
  
  // Buscar por ID, y si no se encuentra (porque a lo mejor en gastos usaban el nombre como id temporal),
  // intentar buscar por nombre (lowercase) para asegurar compatibilidad.
  const category = categoryId 
    ? categories.find(c => c.id === categoryId || c.name.toLowerCase() === categoryId.toLowerCase()) 
    : null;

  let displayDate = date;
  if (date.includes('T')) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    displayDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  } else if (date.includes('-')) {
    const parts = date.split('-');
    if (parts.length === 3) {
      displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Icon size={24} color={iconColor} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.description, { color: colors.text }]}>{description}</Text>
        <View style={styles.meta}>
          <Text style={[styles.date, { color: colors.textMuted }]}>{displayDate}</Text>
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
              <Text style={[styles.categoryText, { color: category.color }]}>{category.name}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={[styles.amount, { color: iconColor }]}>
        {isIncome ? '+' : '-'}${amount.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
