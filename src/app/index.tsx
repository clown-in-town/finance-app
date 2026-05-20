import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TransactionCard } from '@/components/TransactionCard';
import { Wallet } from 'lucide-react-native';
import { useFinance } from '@/context/FinanceContext';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  
  const { expenses } = useFinance();

  // Calcular balance real
  const balance = expenses.reduce((acc, current) => {
    if (current.type === 'income') {
      return acc + current.amount;
    } else {
      return acc - current.amount;
    }
  }, 0);

  // Ordenar movimientos cronológicamente (más recientes primero)
  const sortedTransactions = [...expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
        <View style={styles.balanceHeader}>
          <Wallet color="#ffffff" size={24} />
          <Text style={styles.balanceTitle}>Balance Actual</Text>
        </View>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Últimos Movimientos</Text>
        {sortedTransactions.length === 0 ? (
          <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 20 }}>
            No hay movimientos recientes.
          </Text>
        ) : (
          sortedTransactions.map(tx => (
            <TransactionCard
              key={tx.id}
              type={tx.type as 'income' | 'expense'}
              amount={tx.amount}
              description={tx.description}
              date={tx.date}
              categoryId={tx.categoryId}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
