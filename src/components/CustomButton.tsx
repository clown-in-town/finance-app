import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'outline';
  loading?: boolean;
}

export function CustomButton({ title, onPress, variant = 'primary', loading = false }: CustomButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  let backgroundColor = colors.primary;
  let textColor = '#fff';
  let borderColor = 'transparent';

  if (variant === 'danger') {
    backgroundColor = colors.danger;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    textColor = colors.primary;
    borderColor = colors.primary;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor, borderWidth: variant === 'outline' ? 1 : 0 },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
