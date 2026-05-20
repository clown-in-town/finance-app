import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react-native';

interface CustomDatePickerProps {
  date: string; // ISO string
  onChange: (isoString: string) => void;
  label?: string;
}

export function CustomDatePicker({ date, onChange, label }: CustomDatePickerProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  
  const [showModal, setShowModal] = useState(false);
  
  const currentDate = date && date.includes('T') ? new Date(date) : new Date();
  
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day, currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    onChange(newDate.toISOString());
    setShowModal(false);
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  const displayDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

  const renderCalendar = () => {
    const grid = [];
    let dayCounter = 1;
    
    for (let row = 0; row < 6; row++) {
      const rowCells = [];
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < firstDayOfMonth) {
          rowCells.push(<View key={`empty-${col}`} style={styles.cell} />);
        } else if (dayCounter > daysInMonth) {
          rowCells.push(<View key={`empty-${row}-${col}`} style={styles.cell} />);
        } else {
          const day = dayCounter;
          const isSelected = day === currentDate.getDate() && viewMonth === currentDate.getMonth() && viewYear === currentDate.getFullYear();
          const isToday = day === new Date().getDate() && viewMonth === new Date().getMonth() && viewYear === new Date().getFullYear();
          
          rowCells.push(
            <TouchableOpacity 
              key={day} 
              style={[
                styles.cell, 
                isSelected && { backgroundColor: colors.primary },
                !isSelected && isToday && { borderWidth: 1, borderColor: colors.primary }
              ]}
              onPress={() => handleSelectDay(day)}
            >
              <Text style={[
                styles.cellText, 
                { color: isSelected ? '#fff' : colors.text },
                isToday && !isSelected && { color: colors.primary, fontWeight: 'bold' }
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
          dayCounter++;
        }
      }
      grid.push(<View key={row} style={styles.row}>{rowCells}</View>);
      if (dayCounter > daysInMonth) break;
    }
    return grid;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <TouchableOpacity 
        style={[styles.inputButton, { borderColor: colors.border }]} 
        onPress={() => {
          setViewMonth(currentDate.getMonth());
          setViewYear(currentDate.getFullYear());
          setShowModal(true);
        }}
      >
        <Text style={[styles.inputText, { color: colors.text }]}>{displayDate}</Text>
        <CalendarIcon size={20} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Fecha</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <X size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                <ChevronLeft size={24} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.monthText, { color: colors.text }]}>
                {monthNames[viewMonth]} {viewYear}
              </Text>
              <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                <ChevronRight size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.daysHeader}>
              {dayNames.map(day => (
                <View key={day} style={styles.dayHeaderCell}>
                  <Text style={[styles.dayHeaderText, { color: colors.textMuted }]}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  inputButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarGrid: {
    
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 2,
  },
  cellText: {
    fontSize: 16,
  },
});
