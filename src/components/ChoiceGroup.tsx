import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import colors from '../theme/colors';

interface ChoiceGroupProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  variant?: 'default' | 'priority' | 'category';
  error?: string | null;
  required?: boolean;
}

export const ChoiceGroup: React.FC<ChoiceGroupProps> = ({
  label,
  options,
  selected,
  onSelect,
  variant = 'default',
  error,
  required = false,
}) => {
  const getButtonStyles = (option: string) => {
    const isSelected = selected === option;

    if (!isSelected) {
      return {
        container: styles.optionUnselected,
        text: styles.optionTextUnselected,
        dotColor: 'transparent',
      };
    }

    if (variant === 'priority') {
      const pColor = colors.priority[option as keyof typeof colors.priority];
      if (pColor) {
        return {
          container: [
            styles.optionSelected,
            {
              backgroundColor: pColor.background,
              borderColor: pColor.color,
            },
          ],
          text: [styles.optionTextSelected, { color: pColor.color }],
          dotColor: pColor.color,
        };
      }
    }

    if (variant === 'category') {
      const cColor = colors.category[option as keyof typeof colors.category];
      if (cColor) {
        return {
          container: [
            styles.optionSelected,
            {
              backgroundColor: cColor.background,
              borderColor: cColor.color,
            },
          ],
          text: [styles.optionTextSelected, { color: cColor.color }],
          dotColor: cColor.color,
        };
      }
    }

    return {
      container: [
        styles.optionSelected,
        {
          backgroundColor: colors.primaryLight,
          borderColor: colors.primary,
        },
      ],
      text: [styles.optionTextSelected, { color: colors.primary }],
      dotColor: colors.primary,
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requiredStar}> *</Text>}
      </Text>

      <View style={styles.optionsWrap}>
        {options.map(option => {
          const isSelected = selected === option;
          const { container, text, dotColor } = getButtonStyles(option);

          return (
            <Pressable
              key={option}
              style={({ pressed }) => [
                styles.optionButton,
                container,
                pressed && styles.optionPressed,
              ]}
              onPress={() => onSelect(option)}>
              {isSelected && (
                <View
                  style={[styles.indicatorDot, { backgroundColor: dotColor }]}
                />
              )}
              <Text style={[styles.optionText, text]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  requiredStar: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    minHeight: 38,
  },
  optionUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  optionSelected: {
    borderWidth: 1.5,
  },
  optionPressed: {
    opacity: 0.75,
  },
  indicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  optionText: {
    fontSize: 13.5,
  },
  optionTextUnselected: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '700',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12.5,
    color: colors.danger,
    fontWeight: '500',
  },
});

export default ChoiceGroup;
