// Reusable input field

import { Text, TextInput, View } from "react-native";
import { colors } from "@/constants/theme";

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
        placeholderTextColor={colors.mutedForeground}
        className="rounded-2xl border border-border bg-background px-4 py-3.5 text-text"
      />
      {helperText && <Text className="mt-1 text-xs text-text-muted">{helperText}</Text>}
    </View>
  );
}