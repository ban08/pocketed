import * as React from "react";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { User } from "../../models/User";
import { loginUser, saveCurrentUser } from "../../services/authService";
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
import { styles } from "./LoginScreen.style";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const { login } = useContext(AuthContext);

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
      await saveCurrentUser(user); // Save session
      login(user);
      router.push("/(tabs)");
    } catch (error) {
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
                  <Text style={styles.logoText}>P4</Text>
                </Pressable>
                <Text style={styles.brandText}>Pocket4Students</Text>
              </View>

              <Text style={styles.greeting}>Welcome back! 👋</Text>
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

            {/* ===== Form ===== */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="you@university.edu"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Your secret password"
                placeholderTextColor="#9CA3AF"
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
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.primaryButtonText}>Let&apos;s Go 🚀</Text>
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
              <Text style={{ fontSize: 20 }}>🎓</Text>
              <Text style={styles.secondaryButtonText}>
                University Account
              </Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>
                Don&apos;t have an account yet?{" "}
              </Text>
              <Pressable onPress={() => router.push("/auth/register")}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
