import { useEffect, useState } from "react";
import {
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import Button from "@/components/ui/button";

import {
	BirthDetails,
	clearSavedBirthDetails,
	emptyBirthDetails,
	getBirthDetails,
	getRememberBirthDetailsPreference,
	inferZodiacSignFromBirthDate,
	saveBirthDetails,
	setSessionBirthDetails,
	setRememberBirthDetailsPreference,
} from "@/lib/birthDetailsStorage";

type BirthDetailsModalProps = {
	open: boolean;
	initialValue?: BirthDetails | null;
	forceCompletion?: boolean;
	isSaving?: boolean;
	onClose?: () => void;
	onSave: (details: BirthDetails, rememberMe: boolean) => Promise<void> | void;
};

type EditableBirthField = Exclude<keyof BirthDetails, "zodiacSign">;

const FIELDS: Array<{
	key: EditableBirthField;
	label: string;
	placeholder: string;
	autoCapitalize?: "none" | "characters" | "words";
}> = [
	{
		key: "fullName",
		label: "Full name",
		placeholder: "Jane Doe",
		autoCapitalize: "words",
	},
	{
		key: "birthDate",
		label: "Birth date",
		placeholder: "1998-04-21",
		autoCapitalize: "none",
	},
	{
		key: "birthTime",
		label: "Birth time",
		placeholder: "14:30",
		autoCapitalize: "none",
	},
	{
		key: "birthPlace",
		label: "Birth place",
		placeholder: "Stockholm",
		autoCapitalize: "words",
	},
	{
		key: "birthCountryCode",
		label: "Country code",
		placeholder: "SE",
		autoCapitalize: "characters",
	},
	{
		key: "birthTimezone",
		label: "Timezone",
		placeholder: "Europe/Stockholm",
		autoCapitalize: "none",
	},
];

export default function BirthDetailsModal({
	open,
	initialValue,
	forceCompletion = false,
	isSaving = false,
	onClose,
	onSave,
}: BirthDetailsModalProps) {
	const [draft, setDraft] = useState<BirthDetails>(
		initialValue ?? emptyBirthDetails,
	);
	const [isHydrating, setIsHydrating] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [rememberMe, setRememberMe] = useState(true);

	useEffect(() => {
		if (!open) {
			return;
		}

		let isMounted = true;

		const hydrate = async () => {
			setIsHydrating(true);
			const [storedDetails, rememberPreference] = await Promise.all([
				getBirthDetails(),
				getRememberBirthDetailsPreference(),
			]);

			if (isMounted) {
				setRememberMe(rememberPreference);
				setDraft(initialValue ?? storedDetails ?? emptyBirthDetails);
				setIsHydrating(false);
			}
		};

		void hydrate();

		return () => {
			isMounted = false;
		};
	}, [initialValue, open]);

	const handleChange = (field: EditableBirthField, value: string) => {
		setDraft((current) => ({
			...current,
			[field]: field === "birthCountryCode" ? value.toUpperCase() : value,
		}));
	};

	const handleClose = () => {
		if (!forceCompletion) {
			onClose?.();
		}
	};

	const handleSave = async () => {
		setIsSubmitting(true);

		try {
			const normalizedDetails: BirthDetails = {
				...draft,
				zodiacSign:
					draft.zodiacSign || inferZodiacSignFromBirthDate(draft.birthDate) || "",
			};

			await setRememberBirthDetailsPreference(rememberMe);

			if (rememberMe) {
				await saveBirthDetails(normalizedDetails);
			} else {
				await clearSavedBirthDetails();
				setSessionBirthDetails(normalizedDetails);
			}

			await onSave(normalizedDetails, rememberMe);
			onClose?.();
		} finally {
			setIsSubmitting(false);
		}
	};

	const disableSave =
		isSaving ||
		isSubmitting ||
		isHydrating ||
		!draft.birthDate ||
		!draft.fullName;

	return (
		<Modal
			animationType="slide"
			transparent
			visible={open}
			onRequestClose={handleClose}>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					<Text style={styles.title}>Birth details</Text>
					<Text style={styles.subtitle}>
						Save your details and choose whether this device should remember them.
					</Text>

					<ScrollView
						contentContainerStyle={styles.form}
						keyboardShouldPersistTaps="handled">
						{FIELDS.map((field) => (
							<View key={field.key} style={styles.fieldGroup}>
								<Text style={styles.label}>{field.label}</Text>
								<TextInput
									autoCapitalize={field.autoCapitalize ?? "none"}
									placeholder={field.placeholder}
									placeholderTextColor="#7A7194"
									style={styles.input}
									value={draft[field.key]}
									onChangeText={(value) => handleChange(field.key, value)}
								/>
							</View>
						))}

						{!!draft.zodiacSign && (
							<View style={styles.badge}>
								<Text style={styles.badgeText}>Detected sign: {draft.zodiacSign}</Text>
							</View>
						)}
					</ScrollView>

					<View style={styles.rememberRow}>
						<Pressable
							onPress={() => setRememberMe((current) => !current)}
							style={[
								styles.checkbox,
								rememberMe ? styles.checkboxActive : null,
							]}>
							{rememberMe ? <Text style={styles.checkboxTick}>✓</Text> : null}
						</Pressable>
						<View style={styles.rememberTextWrap}>
							<Text style={styles.rememberTitle}>Remember me on this device</Text>
							<Text style={styles.rememberDescription}>
								Turn off to use details only for this session.
							</Text>
						</View>
					</View>

					<View style={styles.actions}>
						{!forceCompletion && (
							<View style={styles.secondaryAction}>
								<Button onPress={handleClose} variant="outline" size="md">
									Close
								</Button>
							</View>
						)}
						<View style={styles.primaryAction}>
							<Button onPress={handleSave} disabled={disableSave}>
								{isSaving || isSubmitting ? "Saving..." : "Save details"}
							</Button>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(8, 8, 14, 0.72)",
	},
	card: {
		maxHeight: "88%",
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		backgroundColor: "#171320",
		paddingHorizontal: 20,
		paddingTop: 22,
		paddingBottom: 28,
	},
	title: {
		color: "#EDE8D8",
		fontSize: 24,
		fontWeight: "700",
	},
	subtitle: {
		marginTop: 8,
		marginBottom: 20,
		color: "#B9B0D0",
		fontSize: 14,
		lineHeight: 20,
	},
	form: {
		gap: 14,
		paddingBottom: 12,
	},
	fieldGroup: {
		gap: 6,
	},
	label: {
		color: "#D6CEE8",
		fontSize: 13,
		fontWeight: "600",
	},
	input: {
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.12)",
		backgroundColor: "#211C2E",
		paddingHorizontal: 14,
		paddingVertical: 12,
		color: "#F8F4FF",
	},
	badge: {
		marginTop: 4,
		alignSelf: "flex-start",
		borderRadius: 999,
		backgroundColor: "rgba(184, 125, 86, 0.18)",
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	badgeText: {
		color: "#E7C4A9",
		fontWeight: "600",
		textTransform: "capitalize",
	},
	rememberRow: {
		marginTop: 8,
		flexDirection: "row",
		gap: 10,
	},
	checkbox: {
		width: 22,
		height: 22,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.3)",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 1,
	},
	checkboxActive: {
		backgroundColor: "#B87D56",
		borderColor: "#B87D56",
	},
	checkboxTick: {
		color: "#F8F4FF",
		fontWeight: "800",
		fontSize: 13,
		lineHeight: 16,
	},
	rememberTextWrap: {
		flex: 1,
	},
	rememberTitle: {
		color: "#EDE8D8",
		fontSize: 13,
		fontWeight: "600",
	},
	rememberDescription: {
		marginTop: 2,
		color: "#B9B0D0",
		fontSize: 12,
		lineHeight: 17,
	},
	actions: {
		marginTop: 18,
		flexDirection: "row",
		gap: 12,
	},
	secondaryAction: {
		flex: 1,
	},
	primaryAction: {
		flex: 1.4,
	},
});
