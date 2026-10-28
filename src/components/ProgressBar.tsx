import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
}) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Tiến độ công việc</Text>
          <Text style={styles.subtitle}>
            {completed}/{total} việc đã hoàn thành
          </Text>
        </View>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{percentage}%</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%` },
            percentage === 100 && styles.fillComplete,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  percentBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  track: {
    height: 9,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  fillComplete: {
    backgroundColor: colors.success,
  },
});

export default ProgressBar;
