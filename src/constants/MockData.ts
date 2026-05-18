export const MOCK_CATEGORIES = [
  { id: '1', name: 'Alimentación', color: '#f59e0b', icon: 'pizza' },
  { id: '2', name: 'Transporte', color: '#3b82f6', icon: 'car' },
  { id: '3', name: 'Vivienda', color: '#8b5cf6', icon: 'home' },
  { id: '4', name: 'Entretenimiento', color: '#ec4899', icon: 'film' },
  { id: '5', name: 'General', color: '#64748b', icon: 'tag' },
];

export const MOCK_TRANSACTIONS = [
  { id: 't1', type: 'expense', amount: 450, categoryId: '1', date: '2023-10-25', description: 'Supermercado' },
  { id: 't2', type: 'expense', amount: 120, categoryId: '2', date: '2023-10-24', description: 'Gasolina' },
  { id: 't3', type: 'income', amount: 3500, categoryId: '5', date: '2023-10-15', description: 'Nómina Quincenal' },
  { id: 't4', type: 'expense', amount: 800, categoryId: '3', date: '2023-10-16', description: 'Luz y Agua' },
  { id: 't5', type: 'expense', amount: 200, categoryId: '4', date: '2023-10-20', description: 'Cine' },
  { id: 't6', type: 'income', amount: 500, categoryId: '5', date: '2023-10-22', description: 'Venta artículo' },
];

export const MOCK_BALANCE_HISTORY = [
  { value: 1200, label: '1 oct' },
  { value: 1000, label: '5 oct' },
  { value: 1500, label: '10 oct' },
  { value: 4500, label: '15 oct' },
  { value: 4000, label: '20 oct' },
  { value: 3400, label: '25 oct' },
];

// Computed
export const CURRENT_BALANCE = 3400;
