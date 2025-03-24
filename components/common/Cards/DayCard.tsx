import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";

type DayCardProps = {
  day: string;
  blocks: { start: string; end: string }[];
};

export default function DayCard({ day, blocks }: DayCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.dayText}>{day.charAt(0) + day.slice(1).toLowerCase()}</Text>
      <View style={styles.flatListWrapper}>
        <FlatList
          data={blocks}
          keyExtractor={(item, index) => `${item.start}-${index}`}
          horizontal
          contentContainerStyle={styles.flatListContent}
          style={{alignSelf: "center"}}
          renderItem={({ item }) => (
            <View style={styles.blockContainer}>
              <Text style={styles.blockText}>{item.start} - {item.end}</Text>
            </View>
          )}
          
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 16,
    alignItems: "center", // Center align the day and FlatList
    width:110
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  flatListWrapper: {
    width: 100, // Ensure the FlatList takes full width
  },
  flatListContent: {
    justifyContent: "center", // Center align FlatList items horizontally
    width:100
  },
  blockContainer: {
    marginHorizontal: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingVertical:8,
    justifyContent: "center",
    alignItems: "center",
    width:100

  },
  blockText: {
    fontSize: 14,
  },
});