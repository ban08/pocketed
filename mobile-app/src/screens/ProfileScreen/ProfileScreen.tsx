import * as React from "react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { AuthContext } from "@/src/context/AuthContext";
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

  const profile = React.useMemo(
    () => ({
      fullName: user?.fullName?.trim() || "Student User",
      email: user?.email?.trim() || "student@university.edu",
      address: user?.address?.trim() || "Address not provided yet",
      profilePicture: user?.profilePicture,
    }),
    [user]
  );

  const handleBack = React.useCallback(() => {
    router.replace("/(tabs)/dashboard");
  }, [router]);

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
          updateProfile({ profilePicture: result.assets[0].uri });
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
        updateProfile({ profilePicture: result.assets[0].uri });
      } catch {
        Alert.alert(
          "Could not update profile picture",
          "Please try again in a moment."
        );
      }
    },
    [updateProfile]
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
    updateProfile({ profilePicture: undefined });
  }, [updateProfile]);

  const hasAddress = Boolean(user?.address?.trim());
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
            <Text style={styles.introTitle}>Your Profile Information</Text>
            <Text style={styles.introSubtitle}>
              This screen uses placeholders now and is already ready for backend
              profile sync later.
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
                  Choose from gallery or take a photo.
                </Text>
                <View style={styles.avatarButtonRow}>
                  <Pressable
                    style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}
                    onPress={handleChangePhoto}
                    accessibilityRole="button"
                    accessibilityLabel="Change profile picture"
                  >
                    <Text style={styles.photoButtonText}>Change Photo</Text>
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
              <Text style={styles.fieldValue}>{profile.fullName}</Text>
            </View>

            <View style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldValue}>{profile.email}</Text>
            </View>

            <View style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>Address</Text>
              <Text
                style={[
                  styles.fieldValue,
                  !hasAddress && styles.fieldValueMuted,
                ]}
              >
                {profile.address}
              </Text>
            </View>
          </View>

          <Text style={styles.note}>
            Placeholder-first mode enabled: profile data currently lives in local
            AuthContext and can be replaced by backend services later.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
