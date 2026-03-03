import * as React from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { styles } from "./WelcomeScreen.style";

export default function WelcomeScreen() {
  const userName = "User";

  return (
    <ImageBackground
      source={require("@/src/resources/welcome_banner.svg")}
      style={styles.root}
      imageStyle={styles.image}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          {/* ===== Header ===== */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>P4</Text>
            </View>
            <Text style={styles.brandText}>Pocket4Students</Text>
          </View>

          {/* ===== Hero Section ===== */}
          <View style={styles.hero}>
            <Text style={styles.hello}>Hello, {userName}</Text>

            <Text style={styles.title}>Take control{"\n"}of your money.</Text>

            <Text style={styles.subtitle}>
              Track expenses, set goals and build better financial habits with a
              simple and modern experience.
            </Text>

            {/* Feature Pills */}
            <View style={styles.pillRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>Budgets</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>Insights</Text>
              </View>
              <View style={styles.pill}>
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
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.secondaryButtonText}>Register</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>Login</Text>
              </Pressable>
            </View>

            <Text style={styles.footerText}>
              Secure • Private • Student-focused
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}
