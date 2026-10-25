import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { colors, radius, spacing, typography } from '../themes';

export default function EmptyState({
    icon = 'calendar-outline',
    message = 'No hay resultados',
    title,
}) {
    return(
        <View style={styles.container}>
            <View style={styles.circle}>
                <Ionicons name={icon} size={34} color={colors.textPrimary}/>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxxl,
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: radius.circle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: typography.lineHeight.md,
  },
});