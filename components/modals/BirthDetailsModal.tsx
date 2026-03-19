// personalize horoscopes and calculate moon/ascendant signs
// reusable FormInput and Card components

import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";

import {
  BirthDetails,
  emptyBirthDetails,
  inferZodiacSignFromBirthDate,
  hasCompletedBirthDetails,
} from "@/lib/birthDetailsStorage";

type BirthDetailsModalProps = {
  visible: boolean;
  onClose?: () => void;
  onSave: (details: BirthDetails) => Promise<void> | void;
  initialDetails?: BirthDetails | null;
  onClear?: () => void;
  forceCompletion?: boolean;
  isSaving?: boolean;
};

export default function BirthDetailsModal({
  visible,
  onClose,
  onSave,
  initialDetails = null,
  forceCompletion = false,
  isSaving = false,
  onClear,
}: BirthDetailsModalProps) {
  const [form, setForm] = useState<BirthDetails>(emptyBirthDetails);
  const [error, setError] = useState<string | null>(null);

  const inferredZodiac = inferZodiacSignFromBirthDate(form.birthDate.trim());
  const canSave = hasCompletedBirthDetails(form);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setForm(initialDetails ?? emptyBirthDetails);
      setError(null);
    }
  }, [visible, initialDetails]);

  const handleSave = async () => {
    if (!inferredZodiac) {
      setError('Please enter a valid birth date (YYYY-MM-DD)');
      return;
    }

    setError(null);
    try {
      await onSave({
        ...form,
        zodiacSign: inferredZodiac,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save birth details');
    }
  };

  const handleClose = () => {
    if (forceCompletion) return; // Don't allow closing if forced
    onClose?.();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 items-center justify-center bg-background px-5">
            <Card className="w-full max-w-md bg-background border-border">
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 6 }}
              >
                <Text className="text-center font-display text-3xl text-foreground">
                  Tell us about yourself
                </Text>
                <Text className="mt-2 text-center text-text-muted">
                  Personalize your daily horoscope and birth chart.
                </Text>

                <View className="mt-8 gap-5">
                  <FormInput
                    label="Full name"
                    value={form.fullName}
                    onChangeText={(fullName) => setForm((prev) => ({ ...prev, fullName }))}
                    placeholder="Your name"
                  />

                  <FormInput
                    label="Birth date"
                    value={form.birthDate}
                    onChangeText={(birthDate) => setForm((prev) => ({ ...prev, birthDate }))}
                    placeholder="YYYY-MM-DD"
                    required
                  />

                  <FormInput
                    label="Birth time (optional)"
                    value={form.birthTime || ''}
                    onChangeText={(birthTime) => setForm((prev) => ({ ...prev, birthTime }))}
                    placeholder="HH:mm"
                  />

                  <FormInput
                    label="Birth city"
                    value={form.birthPlace}
                    onChangeText={(birthPlace) => setForm((prev) => ({ ...prev, birthPlace }))}
                    placeholder="e.g. Stockholm"
                    required
                    helperText="Needed for accurate Moon and Ascendant signs"
                  />
                </View>

                {error && <Text className="mt-4 text-center text-error">{error}</Text>}

                {inferredZodiac && (
                  <Text className="mt-6 text-center text-sm text-primary">
                    Your Sun sign: {inferredZodiac.charAt(0).toUpperCase() + inferredZodiac.slice(1)}
                  </Text>
                )}

                <View className="mt-6 flex-row gap-3">
                  {!forceCompletion && (
                    <Button variant="outline" onPress={handleClose} disabled={isSaving} style={{ flex: 1 }}>
                      Cancel
                    </Button>
                  )}
                  <Button onPress={handleSave} disabled={isSaving || !canSave} style={{ flex: 1 }}>
                    {isSaving ? 'Saving...' : 'Save & Continue'}
                  </Button>
                </View>

                {/* Clear / forget data */}
                {initialDetails && (
                  <View className="mt-4">
                    <Button variant="outline" onPress={() => { onClear?.(); onClose?.(); }}>
                      Forget my data
                    </Button>
                  </View>
                )}
              </ScrollView>
            </Card>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}