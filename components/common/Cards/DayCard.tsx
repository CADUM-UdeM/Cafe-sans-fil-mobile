import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";

type DayCardProps = {
  day: string;
  blocks: { start: string; end: string }[];
};

export default function DayCard({ day, blocks }: DayCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.dayText}>{day}</Text>
      <View style={styles.flatListWrapper}>
        <FlatList
          data={blocks}
          keyExtractor={(item, index) => `${item.start}-${index}`}
          horizontal
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <View style={styles.blockContainer}>
              <Text style={styles.blockText}>{item.start}</Text>
              <Text style={styles.blockText}>{item.end}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 16,
    alignItems: "center", // Center align the day and FlatList
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  flatListWrapper: {
    width: "100%", // Ensure the FlatList takes full width
  },
  flatListContent: {
    justifyContent: "center", // Center align FlatList items horizontally
  },
  blockContainer: {
    marginHorizontal: 8,
    backgroundColor: "#f2f2f2",
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  blockText: {
    fontSize: 14,
    textAlign: "center",
  },
});