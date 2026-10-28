import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import colors from '../theme/colors';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string | null;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  hint?: string;
  showCharCount?: boolean;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = 'default',
  hint,
  showCharCount = false,
  required = false,
}) => {
  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
        {showCharCount && maxLength && (
          <Text
            style={[
              styles.charCount,
              value.length >= maxLength && styles.charCountWarning,
            ]}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          hasError && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? 'top' : 'center'}
      />

      {hasError && <Text style={styles.errorText}>{error}</Text>}

      {!hasError && hint && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  requiredStar: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  charCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  charCountWarning: {
    color: colors.danger,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  multilineInput: {
    minHeight: 84,
    paddingTop: 10,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12.5,
    color: colors.danger,
    fontWeight: '500',
  },
  hintText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
});

export default FormField;
