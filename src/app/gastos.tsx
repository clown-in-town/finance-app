import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TransactionCard } from '@/components/TransactionCard';
import { CustomButton } from '@/components/CustomButton';
import { useFinance } from '@/context/FinanceContext';
import { ChevronDown } from 'lucide-react-native';
import { CustomDatePicker } from '@/components/CustomDatePicker';

export default function GastosScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [showForm, setShowForm] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const { expenses: allExpenses, addExpense, categories } = useFinance();
  const expenses = allExpenses.filter(e => e.type === 'expense');
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('general');
  const [date, setDate] = useState(new Date().toISOString());

  const selectedCategory = categories.find(c => c.id === categoryId);

  const handleSave = () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa descripción y monto.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido.');
      return;
    }

    addExpense({
      type: 'expense',
      amount: numericAmount,
      description: description.trim(),
      date: date,
      categoryId: categoryId
    });
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategoryId('general');
    setDate(new Date().toISOString());
    setShowForm(false);
    setShowCategoryDropdown(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <CustomButton 
          title={showForm ? "Cancelar" : "Registrar Gasto"} 
          onPress={() => setShowForm(!showForm)} 
          variant={showForm ? 'outline' : 'primary'}
        />
      </View>

      {showForm && (
        <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Nuevo Gasto</Text>
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
          
          <Text style={[styles.label, { color: colors.text }]}>Categoría</Text>
          <TouchableOpacity 
            style={[styles.dropdownButton, { borderColor: colors.border }]} 
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            activeOpacity={0.7}
          >
            <Text style={{ color: selectedCategory ? colors.text : colors.textMuted, fontSize: 16 }}>
              {selectedCategory ? selectedCategory.name : 'Selecciona una categoría'}
            </Text>
            <ChevronDown size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <View style={[styles.dropdownList, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                {categories.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.dropdownItem, 
                      categoryId === c.id && { backgroundColor: colors.primary + '15' }
                    ]}
                    onPress={() => {
                      setCategoryId(c.id);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText, 
                      { color: colors.text }, 
                      categoryId === c.id && { color: colors.primary, fontWeight: 'bold' }
                    ]}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <CustomDatePicker 
            label="Fecha"
            date={date}
            onChange={setDate}
          />

          <CustomButton title="Guardar" onPress={handleSave} />
        </View>
      )}

      <View style={styles.listContainer}>
        {expenses.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No hay gastos registrados aún. ¡Añade uno nuevo!
          </Text>
        ) : (
          expenses.map(tx => (
            <TransactionCard
              key={tx.id}
              type={tx.type as 'expense'}
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  dropdownButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
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
