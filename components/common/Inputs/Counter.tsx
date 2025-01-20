import COLORS from "@/constants/Colors";
import TYPOGRAPHY from "@/constants/Typography";
import { Minus, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Counter() {
  const [count, setCount] = useState(1);
  // TODO: Add a max prop to limit the counter to a certain number
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => Math.max(1, prev - 1));

  return (
    <View style={styles.textInput}>
      <TouchableOpacity onPress={decrement} style={styles.button}>
        <Minus width={15} strokeWidth={3} color={"black"}></Minus>
      </TouchableOpacity>

      <Text style={TYPOGRAPHY.body.normal.medium}>{count}</Text>

      <TouchableOpacity onPress={increment} style={styles.button}>
        <Plus width={15} strokeWidth={3} color={"black"}></Plus>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderRadius: 100,
    width: 108,
    height: 48,
    borderWidth: 1,
    borderColor: "#EDF1F3",
    boxShadow: "0px 1px 2px 0px rgba(228, 229, 231, 0.24)",
    color: "#000000",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    
  },
  button: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
});
