import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MOCK_CATEGORIES } from '@/constants/MockData';
import { CustomButton } from '@/components/CustomButton';
import { Edit2, Trash2 } from 'lucide-react-native';

export default function CategoriasScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleDelete = (name: string) => {
    Alert.alert(
      "Eliminar categoría",
      `¿Estás seguro de eliminar la categoría "${name}"? Los gastos registrados en esta categoría pasarán a ser "General".`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => console.log('Deleted', name) }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <CustomButton 
          title={showForm ? "Cancelar" : "Agregar Categoría"} 
          onPress={() => { setShowForm(!showForm); setEditingCategory(null); }} 
          variant={showForm ? 'outline' : 'primary'}
        />
      </View>

      {(showForm || editingCategory) && (
        <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>
            {editingCategory ? 'Modificar Categoría' : 'Nueva Categoría'}
          </Text>
          <TextInput 
            style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
            placeholder="Nombre de la categoría" 
            placeholderTextColor={colors.textMuted}
          />
          <CustomButton title="Guardar" onPress={() => { setShowForm(false); setEditingCategory(null); }} />
        </View>
      )}

      <View style={styles.listContainer}>
        {MOCK_CATEGORIES.map(category => (
          <View key={category.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              <View style={[styles.colorDot, { backgroundColor: category.color }]} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
            
            <View style={styles.actions}>
              <CustomButton 
                title="" 
                variant="outline" 
                onPress={() => { setEditingCategory(category.id); setShowForm(false); }} 
              />
              <View style={styles.actionIcon}>
                <Edit2 size={20} color={colors.primary} onPress={() => { setEditingCategory(category.id); setShowForm(false); }} />
              </View>
              <View style={styles.actionIcon}>
                <Trash2 size={20} color={colors.danger} onPress={() => handleDelete(category.name)} />
              </View>
            </View>
          </View>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 16,
    padding: 8,
  }
});
