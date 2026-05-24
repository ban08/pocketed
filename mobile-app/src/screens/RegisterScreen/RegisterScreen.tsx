import * as React from "react";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { User } from "../../models/User";
import { registerUser } from "../../services/authService";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle, Line } from "react-native-svg";
import { styles, registerPalette } from "./RegisterScreen.style";

type IconProps = { size?: number; color?: string };

const Icon = {
  User: ({ size = 18, color = registerPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.5} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
  Mail: ({ size = 18, color = registerPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={4} width={20} height={16} rx={2} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M2 8l10 6 10-6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Lock: ({ size = 18, color = registerPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={10} rx={2} stroke={color} strokeWidth={1.5} />
      <Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
  Key: ({ size = 18, color = registerPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={8} cy={12} r={4} stroke={color} strokeWidth={1.5} />
      <Path d="M12 12h9" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M18 10v4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
  GraduationCap: ({ size = 20, color = registerPalette.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 10L12 5 2 10l10 5 10-5z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <Path d="M6 12.5v4C8 18 10 19 12 19s4-1 6-2.5v-4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  BarChart: ({ size = 13, color = registerPalette.accent }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1={6} y1={20} x2={6} y2={12} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={12} y1={20} x2={12} y2={6} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={18} y1={20} x2={18} y2={15} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  Lightbulb: ({ size = 13, color = registerPalette.accent }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V17H9v-2.8A6 6 0 0 1 6 9a6 6 0 0 1 6-6Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Target: ({ size = 13, color = registerPalette.accent }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={5} stroke={color} strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={1.5} fill={color} />
    </Svg>
  ),
};

export default function RegisterScreen() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleLogoPress = React.useCallback(() => {
    router.replace("/auth/welcome");
  }, [router]);

  const handleRegister = React.useCallback(async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      await registerUser(name, email, password);
      router.replace({
        pathname: "/auth/login",
        params: { email },
      });
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  }, [name, email, password, confirmPassword, login, router]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ===== Image Hero ===== */}
      <ImageBackground
        source={require("@/src/resources/welcome-banner.jpeg")}
        style={styles.heroBanner}
        imageStyle={styles.heroBannerImage}
      >
        <View style={styles.heroOverlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.heroTopGroup}>
              <View style={styles.header}>
                <Pressable
                  style={styles.logoBox}
                  onPress={handleLogoPress}
                  accessibilityRole="button"
                  accessibilityLabel="Back to welcome screen"
                >
                  <Text style={styles.logoText}>P.</Text>
                </Pressable>
                <Text style={styles.brandText}>pocketED</Text>
              </View>

              <Text style={styles.greeting}>Join the crew</Text>
              <Text style={styles.subtitle}>
                Create your account and start managing your money like a pro.
              </Text>
            </View>

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
          </SafeAreaView>
        </View>
      </ImageBackground>

      {/* ===== Form Card ===== */}
      <KeyboardAvoidingView
        style={styles.cardWrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.card}>
            <View style={styles.cardHandle} />

            <Text style={styles.label}>Name</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconWrap}>
                <Icon.User />
              </View>
              <TextInput
                testID="register-name-input"
                style={styles.input}
                placeholder="What should we call you?"
                placeholderTextColor="#5B6471"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconWrap}>
                <Icon.Mail />
              </View>
              <TextInput
                testID="register-email-input"
                style={styles.input}
                placeholder="you@university.edu"
                placeholderTextColor="#5B6471"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconWrap}>
                <Icon.Lock />
              </View>
              <TextInput
                testID="register-password-input"
                style={styles.input}
                placeholder="Make it strong"
                placeholderTextColor="#5B6471"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconWrap}>
                <Icon.Key />
              </View>
              <TextInput
                testID="register-confirm-password-input"
                style={styles.input}
                placeholder="One more time..."
                placeholderTextColor="#5B6471"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* ===== Actions ===== */}
            <Pressable
              testID="register-submit-button"
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={handleRegister}
            >
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </Pressable>

            <Text style={styles.termsText}>
              By signing up you agree to our{" "}
              <Text style={styles.termsLink}>Terms</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Icon.GraduationCap size={20} color={registerPalette.textPrimary} />
              <Text style={styles.secondaryButtonText}>University Account</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable
                testID="register-login-link"
                onPress={() => router.push("/auth/login")}
              >
                <Text style={styles.footerLink}>Log In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
