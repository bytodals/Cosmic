// components/ui/FormInput.tsx
// Reusable input field that follows our design system.
// Removes duplicate code from the birth modal (DRY).

import { Text, TextInput, View } from 'react-native';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  required?: boolean;
  helperText?: string;
}

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  helperText,
}: FormInputProps) {
  return (
    <View>
      <Text className="mb-2 text-text">
        {label} {required && <Text className="text-error">*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8a82a0"
        className="rounded-2xl border border-border bg-background px-4 py-3.5 text-text"
      />
      {helperText && <Text className="mt-1 text-xs text-textMuted">{helperText}</Text>}
    </View>
  );
}