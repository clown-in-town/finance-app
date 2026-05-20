import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TransactionCard } from '@/components/TransactionCard';
import { CustomButton } from '@/components/CustomButton';
import { useFinance } from '@/context/FinanceContext';
import { CustomDatePicker } from '@/components/CustomDatePicker';

export default function IngresosScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [showForm, setShowForm] = useState(false);

  const { expenses: allTransactions, addExpense } = useFinance();
  const incomes = allTransactions.filter(t => t.type === 'income');

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString());

  const handleSave = () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido.');
      return;
    }

    addExpense({
      type: 'income',
      amount: numericAmount,
      description: description.trim(),
      date: date,
    });
    
    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString());
    setShowForm(false);
  };

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
            value={description}
            onChangeText={setDescription}
          />
          <TextInput 
            style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
            placeholder="Monto" 
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
            value={amount}
            onChangeText={setAmount}
          />
          
          <CustomDatePicker 
            label="Fecha"
            date={date}
            onChange={setDate}
          />

          <CustomButton title="Guardar" onPress={handleSave} />
        </View>
      )}

      <View style={styles.listContainer}>
        {incomes.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No hay ingresos registrados aún. ¡Añade uno nuevo!
          </Text>
        ) : (
          incomes.map(tx => (
            <TransactionCard
              key={tx.id}
              type={tx.type as 'income'}
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
  }
});
