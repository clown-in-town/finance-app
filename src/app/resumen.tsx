import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { LineChart, PieChart, BarChart } from 'react-native-gifted-charts';
import { useFinance } from '@/context/FinanceContext';

const { width } = Dimensions.get('window');

export default function ResumenScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  
  const [period, setPeriod] = useState<number | 'all'>(30);
  const [activeSlide, setActiveSlide] = useState(0);

  const { expenses, categories } = useFinance();

  // 1. Filtrar transacciones según el periodo
  const now = new Date();
  const filteredExpenses = expenses.filter(tx => {
    if (period === 'all') return true;
    const txDate = new Date(tx.date);
    const diffTime = Math.abs(now.getTime() - txDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= period;
  });

  // 2. Datos para gráfico de barras (Ingresos vs Egresos)
  const totalIncome = filteredExpenses.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredExpenses.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  const barData = [
    { value: totalIncome, label: 'Ingresos', frontColor: colors.success },
    { value: totalExpense, label: 'Egresos', frontColor: colors.danger }
  ];

  // 3. Datos para gráfico de pastel (Gastos por Categoría)
  const pieDataRaw = categories.map(cat => {
    const total = filteredExpenses
      .filter(t => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      value: total,
      color: cat.color,
      text: cat.name,
    };
  }).filter(item => item.value > 0);

  const pieData = pieDataRaw.length > 0 
    ? pieDataRaw 
    : [{ value: 1, color: colors.border, text: 'Sin gastos' }];

  // 4. Datos para gráfico de línea (Evolución del Balance)
  const allSorted = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const cutoffDate = period === 'all' ? new Date(0) : new Date(now.getTime() - period * 24 * 60 * 60 * 1000);
  
  let currentBalance = 0;
  const balancePoints: {date: Date, value: number}[] = [];
  
  allSorted.forEach(tx => {
    const txDate = new Date(tx.date);
    currentBalance += (tx.type === 'income' ? tx.amount : -tx.amount);
    
    if (txDate >= cutoffDate) {
      balancePoints.push({
        date: txDate,
        value: currentBalance
      });
    }
  });

  if (balancePoints.length === 0) {
    balancePoints.push({ date: now, value: currentBalance });
  }

  // Agrupar por día para no saturar la gráfica si hay muchas transacciones el mismo día
  const groupedPoints: Record<string, number> = {};
  balancePoints.forEach(p => {
    const dayStr = `${p.date.getDate().toString().padStart(2, '0')}/${(p.date.getMonth() + 1).toString().padStart(2, '0')}`;
    groupedPoints[dayStr] = p.value; // Conserva el balance final de ese día
  });

  let lineData = Object.entries(groupedPoints).map(([label, value]) => ({
    value: value,
    label: label,
  }));

  if (lineData.length === 1) {
    lineData.unshift({ value: lineData[0].value, label: 'Inicio' });
  }

  // Agregar espacio si hay muchos puntos
  const lineSpacing = lineData.length > 5 ? 40 : 60;

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveSlide(Math.round(index));
  };

  const periods: (number | 'all')[] = [30, 60, 90, 'all'];
  const getPeriodLabel = (p: number | 'all') => p === 'all' ? 'Todos' : `${p} d`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>Periodo:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentedControl}>
          {periods.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.segmentButton,
                period === p && { backgroundColor: colors.primary }
              ]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[
                styles.segmentText,
                { color: period === p ? '#fff' : colors.text }
              ]}>{getPeriodLabel(p)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.carousel}
      >
        {/* Slide 1: Line Chart */}
        <View style={[styles.slide, { width }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Evolución del Balance</Text>
          <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <LineChart
              data={lineData}
              color={colors.primary}
              thickness={3}
              spacing={lineSpacing}
              dataPointsColor={colors.primary}
              textShiftY={-10}
              textShiftX={-10}
              textColor={colors.text}
              yAxisTextStyle={{ color: colors.textMuted, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: 10 }}
              hideRules
              curved
            />
          </View>
        </View>

        {/* Slide 2: Pie Chart */}
        <View style={[styles.slide, { width }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Gastos por Categoría</Text>
          <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <PieChart
              data={pieData}
              donut
              radius={100}
              innerRadius={60}
              showText={pieDataRaw.length > 0}
              textColor="black"
              textSize={12}
              showTextBackground={pieDataRaw.length > 0}
              textBackgroundColor="white"
              textBackgroundRadius={12}
            />
          </View>
        </View>

        {/* Slide 3: Bar Chart */}
        <View style={[styles.slide, { width }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Ingresos vs Egresos</Text>
          <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <BarChart
              data={barData}
              barWidth={60}
              spacing={40}
              roundedTop
              roundedBottom
              xAxisLabelTextStyle={{ color: colors.textMuted }}
              yAxisTextStyle={{ color: colors.textMuted, fontSize: 10 }}
              hideRules
              showValuesAsTopLabel
              topLabelTextStyle={{ color: colors.text, fontWeight: 'bold' }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === activeSlide ? colors.primary : colors.border }
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  segmentText: {
    fontWeight: '600',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    padding: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
