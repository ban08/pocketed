import * as React from "react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { AuthContext } from "@/src/context/AuthContext";
import { colors } from "@/src/theme/colors";
import { styles } from "./ProfileScreen.style";

type PickerSource = "camera" | "gallery";

function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "SU";
  if (words.length === 1) return words[0][0].toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = React.useContext(AuthContext);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");

  const profile = React.useMemo(
    () => ({
      fullName: user?.fullName?.trim() || "Student User",
      email: user?.email?.trim() || "student@university.edu",
      profilePicture: user?.profilePicture,
    }),
    [user]
  );

  React.useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
  }, [profile.email, profile.fullName]);

  const handleBack = React.useCallback(() => {
    router.replace("/(tabs)/dashboard");
  }, [router]);

  const saveProfilePicture = React.useCallback(
    async (profilePicture?: string) => {
      try {
        await updateProfile({ profilePicture });
        setStatusMessage(profilePicture ? "Profile picture saved." : "Profile picture removed.");
      } catch {
        Alert.alert(
          "Could not update profile picture",
          "Please try again in a moment."
        );
      }
    },
    [updateProfile]
  );

  const pickProfilePicture = React.useCallback(
    async (source: PickerSource) => {
      try {
        if (source === "camera") {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) {
            Alert.alert(
              "Camera permission needed",
              "Allow camera access to take a profile picture."
            );
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

          if (result.canceled || !result.assets?.length) return;
          await saveProfilePicture(result.assets[0].uri);
          return;
        }

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Photo permission needed",
            "Allow media library access to pick a profile picture."
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (result.canceled || !result.assets?.length) return;
        await saveProfilePicture(result.assets[0].uri);
      } catch {
        Alert.alert(
          "Could not update profile picture",
          "Please try again in a moment."
        );
      }
    },
    [saveProfilePicture]
  );

  const handleChangePhoto = React.useCallback(() => {
    Alert.alert("Profile Picture", "Choose photo source", [
      {
        text: "Gallery",
        onPress: () => {
          void pickProfilePicture("gallery");
        },
      },
      {
        text: "Camera",
        onPress: () => {
          void pickProfilePicture("camera");
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  }, [pickProfilePicture]);

  const handleRemovePhoto = React.useCallback(() => {
    void saveProfilePicture(undefined);
  }, [saveProfilePicture]);

  const handleSaveProfile = React.useCallback(async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      Alert.alert("Missing information", "Name and email are required.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");
    try {
      await updateProfile({
        fullName: trimmedName,
        email: trimmedEmail,
      });
      setStatusMessage("Profile saved.");
    } catch {
      Alert.alert("Could not save profile", "Please try again in a moment.");
    } finally {
      setIsSaving(false);
    }
  }, [email, fullName, updateProfile]);

  const hasPhoto = Boolean(profile.profilePicture);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Back to dashboard"
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Account Details</Text>
            <Text style={styles.introSubtitle}>
              Keep your name, email and profile picture up to date.
            </Text>
          </View>

          <View style={styles.photoCard}>
            <Text style={styles.photoLabel}>Profile Picture</Text>
            <View style={styles.avatarRow}>
              <View style={styles.avatarShell}>
                {hasPhoto ? (
                  <Image
                    source={profile.profilePicture}
                    style={styles.avatarImage}
                    contentFit="cover"
                  />
                ) : (
                  <Text style={styles.avatarFallbackText}>
                    {getInitials(profile.fullName)}
                  </Text>
                )}
              </View>

              <View style={styles.avatarMeta}>
                <Text style={styles.avatarHint}>
                  Choose a photo that makes this account feel yours.
                </Text>
                <View style={styles.avatarButtonRow}>
                  <Pressable
                    style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}
                    onPress={handleChangePhoto}
                    accessibilityRole="button"
                    accessibilityLabel="Change profile picture"
                  >
                    <Text style={styles.photoButtonText}>
                      {hasPhoto ? "Change" : "Add Photo"}
                    </Text>
                  </Pressable>
                  {hasPhoto && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.photoButtonGhost,
                        pressed && styles.pressed,
                      ]}
                      onPress={handleRemovePhoto}
                      accessibilityRole="button"
                      accessibilityLabel="Remove profile picture"
                    >
                      <Text style={styles.photoButtonGhostText}>Remove</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.fieldsGroup}>
            <View style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.fieldInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.fieldInput}
                value={email}
                onChangeText={setEmail}
                placeholder="you@university.edu"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              isSaving && styles.disabledButton,
              pressed && styles.pressed,
            ]}
            onPress={handleSaveProfile}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Save profile information"
          >
            {isSaving ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.saveButtonText}>Save Profile</Text>
            )}
          </Pressable>

          {statusMessage ? <Text style={styles.note}>{statusMessage}</Text> : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
