import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { type LucideIcon, ShoppingBasket } from "lucide-react-native";

import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";

type BasketButtonProps = {
  Icon?: LucideIcon;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>,
};

export default function IconButton({
  style,
  Icon = ShoppingBasket,
  onPress,
  accessibilityLabel="Shopping Basket",
}: BasketButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.iconButtonContainer, style]} 
      onPress={onPress}
      activeOpacity={0.5}
      testID="icon-button"
    >
      <Icon
        width={SPACING["xl"]}
        height={SPACING["xl"]}
        strokeWidth={2.2}
        color={COLORS.black}
        accessibilityLabel={accessibilityLabel}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButtonContainer: {
    backgroundColor: COLORS.lightGray,
    padding: SPACING.xs,
    borderRadius: 100,
  },
});
