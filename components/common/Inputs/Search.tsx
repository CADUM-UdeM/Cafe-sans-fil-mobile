import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";

import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";

type SearchBarProps = {
  placeholder?: string;
  onSearch: (text: string) => void;
  onFilter: () => void;
};

export default function SearchBar({
  placeholder = "Rechercher les cafés, les plats",
  onSearch,
  onFilter,
}: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      <Search
        width={20}
        height={20}
        strokeWidth={3.5}
        color={COLORS.subtuleDark}
        testID="search-icon"
      />

      <TextInput
        style={[TYPOGRAPHY.component.homeSearchText, styles.searchInput]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.subtuleDark}
        onChangeText={onSearch}
        returnKeyType="search"
      />

      <TouchableOpacity
        onPress={onFilter}
        style={styles.filterButton}
        testID="filter-icon-container"
      >
        <SlidersHorizontal
          width={20}
          height={20}
          strokeWidth={3}
          color={COLORS.subtuleDark}
          testID="filter-icon"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    borderRadius: 50,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.lightGray,
  },
  searchInput: {
    flex: 1,
    color: COLORS.black,
    marginLeft: SPACING.md,
  },
  filterButton: {
    marginLeft: SPACING.sm,
  },
});
