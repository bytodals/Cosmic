import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radii } from "@/constants/theme";

type Star = {
	id: number;
	left: number;
	top: number;
	size: number;
	opacity: number;
	glowOpacity: number;
	glowScale: number;
	depth: 0 | 1 | 2;
};

const STAR_COUNT = 120;
const LAYER_COUNT = 3;
const USE_NATIVE_DRIVER = Platform.OS !== "web";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const StarField = () => {
	// Generate static star positions for performance
	const starsByLayer = useMemo(() => {
		const layers: Star[][] = Array.from({ length: LAYER_COUNT }, () => []);

		for (let i = 0; i < STAR_COUNT; i += 1) {
			const depth = Math.floor(Math.random() * LAYER_COUNT) as 0 | 1 | 2;
			layers[depth].push({
				id: i,
				left: Math.random() * 100,
				top: Math.random() * 100,
				size: Math.random() * 1.8 + 0.7 + depth * 0.2,
				opacity: Math.random() * 0.24 + 0.2 + depth * 0.05,
				glowOpacity: Math.random() * 0.12 + 0.08,
				glowScale: Math.random() * 1.6 + 2.6,
				depth,
			});
		}

		return layers as [Star[], Star[], Star[]];
	}, []);

	const layerAnimations = useRef(
		Array.from({ length: LAYER_COUNT }, () => ({
			translateX: new Animated.Value(0),
			translateY: new Animated.Value(0),
			twinkle: new Animated.Value(0),
			scale: new Animated.Value(1),
		})),
	).current;

	const nebulaAnimations = useRef({
		oneX: new Animated.Value(0),
		oneY: new Animated.Value(0),
		oneScale: new Animated.Value(1),
		twoX: new Animated.Value(0),
		twoY: new Animated.Value(0),
		twoScale: new Animated.Value(1),
	}).current;

	useEffect(() => {
		const runningAnimations: Animated.CompositeAnimation[] = [];

		// Layer drift + twinkle animations
		layerAnimations.forEach((layer, index) => {
			const driftDistance = 10 + index * 6;
			const baseDuration = 18000 - index * 2200;

			const driftX = Animated.loop(
				Animated.sequence([
					Animated.timing(layer.translateX, {
						toValue: driftDistance,
						duration: baseDuration,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(layer.translateX, {
						toValue: -driftDistance,
						duration: baseDuration,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
				]),
			);

			const driftY = Animated.loop(
				Animated.sequence([
					Animated.timing(layer.translateY, {
						toValue: driftDistance * 0.72,
						duration: baseDuration + 3000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(layer.translateY, {
						toValue: -driftDistance * 0.72,
						duration: baseDuration + 3000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
				]),
			);

			const twinkle = Animated.loop(
				Animated.sequence([
					Animated.timing(layer.twinkle, {
						toValue: 1,
						duration: 1800 + index * 550,
						easing: Easing.inOut(Easing.quad),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(layer.twinkle, {
						toValue: 0,
						duration: 2400 + index * 700,
						easing: Easing.inOut(Easing.quad),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
				]),
			);

			const scalePulse = Animated.loop(
				Animated.sequence([
					Animated.timing(layer.scale, {
						toValue: 1.06,
						duration: 3000 + index * 650,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(layer.scale, {
						toValue: 0.97,
						duration: 3400 + index * 650,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
				]),
			);

			driftX.start();
			driftY.start();
			twinkle.start();
			scalePulse.start();

			runningAnimations.push(driftX, driftY, twinkle, scalePulse);
		});

		// === NEBULA ANIMATIONS (the part you asked for) ===
		const nebulaOneMotion = Animated.loop(
			Animated.sequence([
				Animated.parallel([
					Animated.timing(nebulaAnimations.oneX, {
						toValue: 16,
						duration: 26000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(nebulaAnimations.oneY, {
						toValue: -12,
						duration: 26000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(nebulaAnimations.oneScale, {
						toValue: 1.12,
						duration: 26000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
				]),
				Animated.parallel([
					Animated.timing(nebulaAnimations.oneX, {
						toValue: -10,
						duration: 26000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(nebulaAnimations.oneY, {
						toValue: 10,
						duration: 26000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(nebulaAnimations.oneScale, {
						toValue: 0.94,
						duration: 26000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
				]),
			]),
		);

		const nebulaTwoMotion = Animated.loop(
			Animated.sequence([
				Animated.parallel([
					Animated.timing(nebulaAnimations.twoX, {
						toValue: -18,
						duration: 30000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(nebulaAnimations.twoY, {
						toValue: 12,
						duration: 30000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(nebulaAnimations.twoScale, {
						toValue: 1.15,
						duration: 30000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
				]),
				Animated.parallel([
					Animated.timing(nebulaAnimations.twoX, {
						toValue: 8,
						duration: 30000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(nebulaAnimations.twoY, {
						toValue: -10,
						duration: 30000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
					Animated.timing(nebulaAnimations.twoScale, {
						toValue: 0.93,
						duration: 30000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: USE_NATIVE_DRIVER,
					}),
				]),
			]),
		);

		nebulaOneMotion.start();
		nebulaTwoMotion.start();
		runningAnimations.push(nebulaOneMotion, nebulaTwoMotion);

		// Cleanup when component unmounts
		return () => {
			runningAnimations.forEach((animation) => animation.stop());
		};
	}, [layerAnimations, nebulaAnimations]);

	return (
		<View
			style={styles.container}
			pointerEvents="none"
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants">
			{/* Nebula One */}
			<AnimatedGradient
				colors={colors.nebulaOneGradient}
				start={{ x: 0.1, y: 0.1 }}
				end={{ x: 0.9, y: 0.9 }}
				style={[
					styles.nebula,
					styles.nebulaOne,
					{
						transform: [
							{ translateX: nebulaAnimations.oneX },
							{ translateY: nebulaAnimations.oneY },
							{ scale: nebulaAnimations.oneScale },
						],
					},
				]}
			/>

			{/* Nebula Two */}
			<AnimatedGradient
				colors={colors.nebulaTwoGradient}
				start={{ x: 0.9, y: 0.2 }}
				end={{ x: 0.2, y: 0.8 }}
				style={[
					styles.nebula,
					styles.nebulaTwo,
					{
						transform: [
							{ translateX: nebulaAnimations.twoX },
							{ translateY: nebulaAnimations.twoY },
							{ scale: nebulaAnimations.twoScale },
						],
					},
				]}
			/>

			{/* Soft nebula mist layer */}
			<AnimatedGradient
				colors={[
					"rgba(255,255,255,0)",
					colors.nebulaMist,
					"rgba(255,255,255,0)",
				]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={styles.nebulaMist}
			/>

			{/* Stars with animation */}
			{starsByLayer.map((layerStars, layerIndex) => {
				const layer = layerAnimations[layerIndex];
				const layerOpacity = layer.twinkle.interpolate({
					inputRange: [0, 1],
					outputRange: [0.35, 1],
				});

				return (
					<Animated.View
						key={layerIndex}
						style={[
							styles.layer,
							{
								opacity: layerOpacity,
								transform: [
									{ translateX: layer.translateX },
									{ translateY: layer.translateY },
									{ scale: layer.scale },
								],
							},
						]}>
						{layerStars.map((star) => (
							<View
								key={star.id}
								style={[
									styles.starShell,
									{
										left: `${star.left}%`,
										top: `${star.top}%`,
										width: star.size,
										height: star.size,
									},
								]}>
								{/* Glow layer */}
								<View
									style={[
										styles.starGlow,
										{
											width: star.size * star.glowScale,
											height: star.size * star.glowScale,
											borderRadius: (star.size * star.glowScale) / 2,
											left: -((star.size * star.glowScale - star.size) / 2),
											top: -((star.size * star.glowScale - star.size) / 2),
											opacity: star.glowOpacity,
										},
									]}
								/>

								{/* Core star */}
								<View
									style={[
										styles.starCore,
										{
											width: star.size,
											height: star.size,
											borderRadius: star.size / 2,
											opacity: star.opacity,
										},
									]}
								/>
							</View>
						))}
					</Animated.View>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		zIndex: 3,
		elevation: 1,
		overflow: "hidden",
	},
	noPointerEvents: {
		pointerEvents: "none",
	},
	layer: {
		...StyleSheet.absoluteFillObject,
	},
	starShell: {
		position: "absolute",
	},
	starGlow: {
		position: "absolute",
		backgroundColor: colors.primary,
		...Platform.select({
			web: {
				boxShadow: `0 0 18px ${colors.primary}`,
			},
			default: {
				shadowColor: colors.primary,
				shadowOffset: { width: 0, height: 0 },
				shadowOpacity: 0.85,
				shadowRadius: 18,
			},
		}),
	},
	starCore: {
		backgroundColor: colors.starCore,
	},
	nebula: {
		position: "absolute",
		borderRadius: radii.full,
		opacity: 1,
		...Platform.select({
			web: {
				boxShadow: `0 0 60px ${colors.starCoreShadow}`,
			},
			default: {
				shadowColor: colors.starCoreShadow,
				shadowOffset: { width: 0, height: 0 },
				shadowOpacity: 0.6,
				shadowRadius: 60,
			},
		}),
	},
	nebulaOne: {
		width: 480,
		height: 480,
		top: -170,
		right: -160,
	},
	nebulaTwo: {
		width: 460,
		height: 460,
		bottom: -180,
		left: -170,
		opacity: 0.95,
	},
	nebulaMist: {
		position: "absolute",
		left: -80,
		right: -80,
		top: "20%",
		height: "52%",
		opacity: 0.7,
	},
});

export default StarField;
