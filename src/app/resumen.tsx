import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MOCK_BALANCE_HISTORY, MOCK_CATEGORIES, MOCK_TRANSACTIONS } from '@/constants/MockData';
import { LineChart, PieChart, BarChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

export default function ResumenScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [period, setPeriod] = useState<30 | 60 | 90>(30);
  const [activeSlide, setActiveSlide] = useState(0);

  // Line chart data
  const lineData = MOCK_BALANCE_HISTORY.map(item => ({
    value: item.value,
    label: item.label,
    dataPointText: item.value.toString()
  }));

  // Pie chart data
  const pieData = MOCK_CATEGORIES.map(cat => {
    const total = MOCK_TRANSACTIONS
      .filter(t => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      value: total > 0 ? total : 10, // Mock minimum value for visibility
      color: cat.color,
      text: cat.name,
    };
  });

  // Bar chart data
  const barData = [
    { value: 4000, label: 'Ingresos', frontColor: colors.success },
    { value: 2500, label: 'Egresos', frontColor: colors.danger }
  ];

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveSlide(Math.round(index));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>Periodo:</Text>
        <View style={styles.segmentedControl}>
          {[30, 60, 90].map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.segmentButton,
                period === p && { backgroundColor: colors.primary }
              ]}
              onPress={() => setPeriod(p as 30 | 60 | 90)}
            >
              <Text style={[
                styles.segmentText,
                { color: period === p ? '#fff' : colors.text }
              ]}>{p} días</Text>
            </TouchableOpacity>
          ))}
        </View>
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
              dataPointsColor={colors.primary}
              textShiftY={-10}
              textShiftX={-10}
              textColor={colors.text}
              yAxisTextStyle={{ color: colors.textMuted }}
              xAxisLabelTextStyle={{ color: colors.textMuted }}
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
              showText
              textColor="black"
              textSize={12}
              showTextBackground
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
              yAxisTextStyle={{ color: colors.textMuted }}
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
    justifyContent: 'center',
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
