import * as React from "react";
import { useRouter } from "expo-router";
import {
  Image, 
  ImageBackground,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { styles, welcomePalette } from "./WelcomeScreen.style";



const AppLogo = require("@/assets/images/pocketed-icon-color.png"); 
const BrandText = require("@/assets/images/pocketed-logo-green.png");

type IconProps = { size?: number; color?: string };

const Icon = {
  BarChart: ({ size = 13, color = welcomePalette.accent }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1={6} y1={20} x2={6} y2={12} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={12} y1={20} x2={12} y2={6} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={18} y1={20} x2={18} y2={15} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  Lightbulb: ({ size = 13, color = welcomePalette.accent }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V17H9v-2.8A6 6 0 0 1 6 9a6 6 0 0 1 6-6Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Target: ({ size = 13, color = welcomePalette.accent }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={5} stroke={color} strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={1.5} fill={color} />
    </Svg>
  ),
};

export default function WelcomeScreen() {
  const userName = "User";
  const router = useRouter();

  const handleRegisterPress = React.useCallback(() => {
    router.push("/auth/register");
  }, [router]);

  const handleLoginPress = React.useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  const handleGuestLoginPress = React.useCallback(() => {
    router.push("/(tabs)");
  }, [router]);

  return (
    <ImageBackground
      source={require("@/src/resources/welcome-banner.jpeg")}
      style={styles.root}
      imageStyle={styles.image}
    > */
      <StatusBar barStyle="light-content" />

      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          {/* ===== Header ===== */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              {/* App Logo PNG */}
              <Image 
                source={AppLogo} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
            </View>
            
            {/* Brand Text PNG */}
            <Image 
              source={BrandText} 
              style={styles.brandImage} 
              resizeMode="contain" 
            />
          </View>

          {/* ===== Hero Section ===== */}
          <View style={styles.hero}>
            <Text style={styles.hello}>Hello, {userName}</Text>

            <Text style={styles.title}>Take control{"\n"}of your money.</Text>

            <Text style={styles.subtitle}>
              Track expenses, set goals and build better financial habits.
            </Text>

            {/* Feature Pills */}
            <View style={styles.pillRow}>
              <View style={styles.pill}>
                <Icon.BarChart />
                <Text style={styles.pillText}>Budgets</Text>
              </View>
              <View style={styles.pill}>
                <Icon.Lightbulb />
                <Text style={styles.pillText}>Insights</Text>
              </View>
              <View style={styles.pill}>
                <Icon.Target />
                <Text style={styles.pillText}>Goals</Text>
              </View>
            </View>
          </View>

          {/* ===== Bottom Sheet ===== */}
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            <Text style={styles.sheetTitle}>Get Started</Text>
            <Text style={styles.sheetSubtitle}>
              Login to continue or create your account in seconds.
            </Text>

            <View style={styles.buttonRow}>
              <Pressable
                testID="welcome-login-button"
                accessibilityLabel="welcome-login-button"
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleLoginPress}
              >
                <Text style={styles.primaryButtonText}>Login</Text>
              </Pressable>

              <Pressable
                testID="welcome-register-button"
                accessibilityLabel="welcome-register-button"
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleRegisterPress}
              >
                <Text style={styles.secondaryButtonText}>Register</Text>
              </Pressable>

              <Pressable
                testID="welcome-guest-button"
                accessibilityLabel="welcome-guest-button"
                style={({ pressed }) => [
                  styles.thirdButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleGuestLoginPress}
              >
                <Text style={styles.thirdButtonText}>Continue as guest</Text>
              </Pressable>
            </View>

            <Text style={styles.footerText}>
              For Students, From Students
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}