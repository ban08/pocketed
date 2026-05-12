import * as React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { User } from "../../models/User";
import { loginUser } from "../../services/authService";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { styles, loginPalette } from "./LoginScreen.style";

type IconProps = { size?: number; color?: string };

const Icon = {
  Mail: ({ size = 18, color = loginPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={4} width={20} height={16} rx={2} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M2 8l10 6 10-6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Lock: ({ size = 18, color = loginPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={10} rx={2} stroke={color} strokeWidth={1.5} />
      <Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
  GraduationCap: ({ size = 20, color = loginPalette.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 10L12 5 2 10l10 5 10-5z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <Path d="M6 12.5v4C8 18 10 19 12 19s4-1 6-2.5v-4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
};

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useContext(AuthContext);

  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState(params.email as string || "");

  const handleLogoPress = React.useCallback(() => {
    router.replace("/auth/welcome");
  }, [router]);

  const handleLogin = React.useCallback(async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }
    try {
      const user: User = await loginUser(email, password);
      login(user);
      router.push("/(tabs)");
    } catch (error) {
      console.error("LOGIN ERROR", error);
      Alert.alert("Error", "Login failed. Please check your credentials.");
    }
  }, [email, password, login, router]);

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

              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Log in and keep your finances on track.
              </Text>
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

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconWrap}>
                <Icon.Mail />
              </View>
              <TextInput
                testID="login-email-input"
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
                testID="login-password-input"
                style={styles.input}
                placeholder="Your secret password"
                placeholderTextColor="#5B6471"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            {/* ===== Actions ===== */}
            <Pressable
              testID="login-submit-button"
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.primaryButtonText}>Let&apos;s Go</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Icon.GraduationCap size={20} color={loginPalette.textPrimary} />
              <Text style={styles.secondaryButtonText}>University Account</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>
                Don&apos;t have an account yet?{" "}
              </Text>
              <Pressable
                testID="login-register-link"
                onPress={() => router.push("/auth/register")}
              >
                <Text style={styles.footerLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
