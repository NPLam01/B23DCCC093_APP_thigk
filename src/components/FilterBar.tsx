import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { FilterType, FILTERS } from '../types/task';
import colors from '../theme/colors';

interface FilterBarProps {
  currentFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onSelectFilter,
  counts,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {FILTERS.map(filter => {
          const isSelected = currentFilter === filter;
          const count = counts[filter] ?? 0;
          const isOverdueTab = filter === 'Quá hạn';

          return (
            <Pressable
              key={filter}
              style={({ pressed }) => [
                styles.tabButton,
                isSelected && styles.tabButtonSelected,
                isSelected && isOverdueTab && styles.tabButtonOverdueSelected,
                pressed && styles.tabButtonPressed,
              ]}
              onPress={() => onSelectFilter(filter)}>
              <Text
                style={[
                  styles.tabText,
                  isSelected && styles.tabTextSelected,
                  isSelected && isOverdueTab && styles.tabTextOverdueSelected,
                ]}>
                {filter}
              </Text>

              <View
                style={[
                  styles.countBadge,
                  isSelected && styles.countBadgeSelected,
                  isOverdueTab && count > 0 && !isSelected && styles.countBadgeOverdueUnselected,
                  isOverdueTab && count > 0 && isSelected && styles.countBadgeOverdueSelected,
                ]}>
                <Text
                  style={[
                    styles.countText,
                    isSelected && styles.countTextSelected,
                    isOverdueTab && count > 0 && !isSelected && styles.countTextOverdueUnselected,
                    isOverdueTab && count > 0 && isSelected && styles.countTextOverdueSelected,
                  ]}>
                  {count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1.2,
    borderColor: colors.border,
  },
  tabButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabButtonOverdueSelected: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  tabButtonPressed: {
    opacity: 0.75,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextSelected: {
    color: colors.textInverse,
  },
  tabTextOverdueSelected: {
    color: colors.textInverse,
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  countBadgeOverdueUnselected: {
    backgroundColor: colors.dangerLight,
  },
  countBadgeOverdueSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  countTextSelected: {
    color: colors.textInverse,
  },
  countTextOverdueUnselected: {
    color: colors.danger,
  },
  countTextOverdueSelected: {
    color: colors.textInverse,
  },
});

export default FilterBar;
