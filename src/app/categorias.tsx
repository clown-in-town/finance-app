import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { CustomButton } from '@/components/CustomButton';
import { Edit2, Trash2 } from 'lucide-react-native';
import { useFinance } from '@/context/FinanceContext';

export default function CategoriasScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'El nombre de la categoría es requerido.');
      return;
    }

    if (editingCategoryId) {
      const success = updateCategory(editingCategoryId, categoryName);
      if (success) {
        setShowForm(false);
        setEditingCategoryId(null);
        setCategoryName('');
      }
    } else {
      const success = addCategory(categoryName);
      if (success) {
        setShowForm(false);
        setCategoryName('');
      }
    }
  };

  const handleEdit = (id: string, name: string) => {
    if (id === 'general') {
      Alert.alert('Aviso', 'La categoría general no puede ser modificada.');
      return;
    }
    setEditingCategoryId(id);
    setCategoryName(name);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategoryId(null);
    setCategoryName('');
  };

  const handleDelete = (id: string, name: string) => {
    if (id === 'general') {
      Alert.alert('Aviso', 'La categoría general no puede ser eliminada.');
      return;
    }

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`¿Estás seguro de eliminar la categoría "${name}"? Los gastos registrados en esta categoría pasarán a ser "General".`);
      if (confirmed) {
        deleteCategory(id);
      }
    } else {
      Alert.alert(
        "Eliminar categoría",
        `¿Estás seguro de eliminar la categoría "${name}"? Los gastos registrados en esta categoría pasarán a ser "General".`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Eliminar", 
            style: "destructive", 
            onPress: () => deleteCategory(id)
          }
        ]
      );
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <CustomButton 
          title={showForm ? "Cancelar" : "Agregar Categoría"} 
          onPress={showForm ? handleCancel : () => setShowForm(true)} 
          variant={showForm ? 'outline' : 'primary'}
        />
      </View>

      {showForm && (
        <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>
            {editingCategoryId ? 'Modificar Categoría' : 'Nueva Categoría'}
          </Text>
          <TextInput 
            style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
            placeholder="Nombre de la categoría" 
            placeholderTextColor={colors.textMuted}
            value={categoryName}
            onChangeText={setCategoryName}
          />
          <CustomButton title="Guardar" onPress={handleSave} />
        </View>
      )}

      <View style={styles.listContainer}>
        {categories.map(category => (
          <View key={category.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              <View style={[styles.colorDot, { backgroundColor: category.color }]} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
            
            <View style={styles.actions}>
              {category.id !== 'general' && (
                <>
                  <TouchableOpacity style={styles.actionIcon} onPress={() => handleEdit(category.id, category.name)}>
                    <Edit2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIcon} onPress={() => handleDelete(category.id, category.name)}>
                    <Trash2 size={20} color={colors.danger} />
                  </TouchableOpacity>
                </>
              )}
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
