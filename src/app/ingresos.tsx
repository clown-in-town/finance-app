import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MOCK_TRANSACTIONS } from '@/constants/MockData';
import { TransactionCard } from '@/components/TransactionCard';
import { CustomButton } from '@/components/CustomButton';

export default function IngresosScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [showForm, setShowForm] = useState(false);

  const incomes = MOCK_TRANSACTIONS.filter(t => t.type === 'income');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <CustomButton 
          title={showForm ? "Cancelar" : "Registrar Ingreso"} 
          onPress={() => setShowForm(!showForm)} 
          variant={showForm ? 'outline' : 'primary'}
        />
      </View>

      {showForm && (
        <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Nuevo Ingreso</Text>
          <TextInput 
            style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
            placeholder="Descripción" 
            placeholderTextColor={colors.textMuted}
          />
          <TextInput 
            style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
            placeholder="Monto" 
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
          />
          <TextInput 
            style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
            placeholder="Fecha" 
            placeholderTextColor={colors.textMuted}
          />
          <CustomButton title="Guardar" onPress={() => setShowForm(false)} />
        </View>
      )}

      <View style={styles.listContainer}>
        {incomes.map(tx => (
          <TransactionCard
            key={tx.id}
            type={tx.type as 'income'}
            amount={tx.amount}
            description={tx.description}
            date={tx.date}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  formContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
});
