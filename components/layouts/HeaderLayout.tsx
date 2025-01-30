import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, Tabs, useRouter } from "expo-router";

import SPACING from "@/constants/Spacing";
import COLORS from "@/constants/Colors";

import AccountInfo from "@/components/common/Auth/AccountInfo";
import IconButton from "@/components/common/Buttons/IconButton";

// FIXME: Replace with actual user data. This is just a placeholder.
export const user = {
  fullName: "Darlene Robertson",
  profilePicture: require("../../assets/images/placeholder/ProfilePicture.png"),
};

type HeaderLayoutProps = {
  fullName?: string;
  profilePicture?: any;
};

/**
 * HeaderLayout component that renders a header layout with account info and icon button.
 */
export default function HeaderLayout({fullName, profilePicture}: HeaderLayoutProps) {
  const navigation = useRouter();
  return (
    <SafeAreaView style={styles.headerContainer} testID="header-container">
      <AccountInfo
        profilePicture={user.profilePicture}
        profileName={user.fullName}
      />
      <IconButton onPress={() => navigation.push('/(main)/pannier')}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingTop: SPACING.xs, 
    paddingBottom: -SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
    borderBottomColor: COLORS.lightGray,
  },
});
