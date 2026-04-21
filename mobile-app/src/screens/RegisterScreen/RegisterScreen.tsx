import * as React from "react";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { User } from "../../models/User";
import { registerUser, saveCurrentUser } from "../../services/authService";
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
import { styles } from "./RegisterScreen.style";

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
      const user: User = await registerUser(name, email, password);
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
                  <Text style={styles.logoText}>P4</Text>
                </Pressable>
                <Text style={styles.brandText}>Pocket4Students</Text>
              </View>

              <Text style={styles.greeting}>Join the crew 🎓</Text>
              <Text style={styles.subtitle}>
                Create your account and start managing your money like a pro.
              </Text>
            </View>

            <View style={styles.pillRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>📊 Budgets</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>💡 Insights</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>🎯 Goals</Text>
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

            {/* ===== Form ===== */}
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>😊</Text>
              <TextInput
                style={styles.input}
                placeholder="What should we call you?"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

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
                placeholder="Make it strong 💪"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔑</Text>
              <TextInput
                style={styles.input}
                placeholder="One more time..."
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* ===== Actions ===== */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={handleRegister}
            >
              <Text style={styles.primaryButtonText}>
                Create Account 🚀
              </Text>
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
              <Text style={{ fontSize: 20 }}>🎓</Text>
              <Text style={styles.secondaryButtonText}>
                University Account
              </Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/auth/login")}>
                <Text style={styles.footerLink}>Log In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
