import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { ChevronDown, Circle, LucideIcon } from "lucide-react-native";

// Constants
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";

import { useModal } from "../layouts/GlobalModal";
import FilterModalLayout from "../layouts/FilterModalLayout";

type TooltipProps = {
  /** Text label to display inside the tooltip */
  label: string;

  /** Optional status indicator to determine the icon's color and behavior */
  status?: "green" | "orange" | "red";

  /** Optional custom icon to display at the start of the tooltip */
  Icon?: LucideIcon;

  /** Whether to show the chevron icon at the end of the tooltip (default: true) */
  showChevron?: boolean;

  /** Whether to change the tooltip color when pressed (default: false) */
  changeColorOnPress?: boolean;

  /** Optional color to apply to the tooltip */
  color?: string;

  /** Optional text color to apply to the tooltip */
  textColor?: string;

  /** Optional children to display inside the tooltip */
  children?: React.ReactNode;

  /** Callback function triggered when the tooltip is pressed */
  onPress?: () => void;
};

/**
 * ## Tooltip
 *
 * A versatile tooltip component for displaying labels, optional status indicators,
 * and interactive chevrons. The tooltip supports custom icons, dynamic statuses,
 * and press interactions. When `showChevron` is enabled, you'll need to provide
 * a children component to display inside the modal.
 *
 * ### Features
 * - Customizable status (`green`, `orange`, `red`) with default circular icons.
 * - Optional chevron icon to indicate expandable content or actions.
 * - Supports custom icons for further flexibility.
 * - Pressable for interactions (e.g., navigating or triggering actions).
 *
 * ### Example Usage
 *
 * **Basic Example**
 * ```tsx
 * <Tooltip
 *   label="Open"
 *   status="green"
 * />
 * ```
 *
 * **With Custom Icon**
 * ```tsx
 * import { Globe } from "lucide-react-native";
 *
 * <Tooltip
 *   label="Global"
 *   Icon={Globe}
 *   onPress={() => console.log("Tooltip pressed!")}
 * />
 * ```
 *
 * **Without Chevron**
 * ```tsx
 * <Tooltip
 *   label="Details"
 *   status="orange"
 *   showChevron={false}
 * />
 * ```
 *
 * @param TooltipProps - Props for the Tooltip component.
 * @returns {JSX.Element} The rendered tooltip component.
 */
export default function Tooltip({
  children,
  label,
  status,
  Icon = status && Circle, // Default to Circle if a status is provided
  showChevron = true,
  color,
  textColor,
  changeColorOnPress = false,
  onPress,
}: TooltipProps): JSX.Element {
  const [isPressed, setIsPressed] = React.useState(false);

  const modalContext = useModal();
  const openModal = modalContext ? modalContext.openModal : () => {};
  const closeModal = modalContext ? modalContext.closeModal : () => {};

  function handleApplyFilter() {
    closeModal();
    setIsPressed(true);
    onPress && onPress();
  }

  function handleResetFilter() {
    closeModal();
    setIsPressed(false);
  }

  function handlePress() {
    !showChevron && setIsPressed(!isPressed);

    if (showChevron) {
      openModal(
        <View>
          <FilterModalLayout
            title={label}
            handleApplyFilter={handleApplyFilter}
            handleResetFilter={handleResetFilter}
          >
            {/* Forms elements for the filter like search box, multi-select */}
            {children}
          </FilterModalLayout>
        </View>
      );
    }
    if (onPress && !showChevron) onPress();
  }
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.tooltipContainer,
        changeColorOnPress
          ? isPressed
            ? { backgroundColor: COLORS.black }
            : { backgroundColor: COLORS.lightGray }
          : { backgroundColor: COLORS.lightGray },
        color && { backgroundColor: color },
      ]}
      activeOpacity={0.7}
      testID="tooltip-container"
    >
      {/* Icon if provided */}
      {Icon && (
        <View style={styles.iconContainer}>
          {status === "green" ? (
            <Icon
              width={12}
              height={12}
              strokeWidth={3}
              color={COLORS.status.green}
              fill={COLORS.status.green}
              testID="tooltip-icon"
            />
          ) : status === "orange" ? (
            <Icon
              width={12}
              height={12}
              strokeWidth={3}
              color={COLORS.status.orange}
              fill={COLORS.status.orange}
              testID="tooltip-icon"
            />
          ) : status === "red" ? (
            <Icon
              width={12}
              height={12}
              strokeWidth={3}
              color={COLORS.status.red}
              fill={COLORS.status.red}
              testID="tooltip-icon"
            />
          ) : (
            <Icon
              width={14}
              height={14}
              strokeWidth={3}
              color={
                changeColorOnPress
                  ? isPressed
                    ? COLORS.white
                    : COLORS.black
                  : COLORS.black
              }
              testID="tooltip-icon"
            />
          )}
        </View>
      )}

      {/* Label */}
      <Text
        style={[
          TYPOGRAPHY.body.normal.semiBold,
          changeColorOnPress
            ? isPressed
              ? { color: COLORS.white }
              : { color: COLORS.black }
            : { color: COLORS.black },
          !showChevron && { marginRight: SPACING.xxs }, // Adjust margin if no chevron
          textColor && { color: textColor },
        ]}
      >
        {label}
      </Text>

      {/* Chevron Down if enabled */}
      {showChevron && (
        <ChevronDown
          width={16}
          height={16}
          strokeWidth={2.8}
          color={isPressed ? COLORS.white : COLORS.black}
          testID="chevron-down"
        />
      )}
    </TouchableOpacity>
  );
}

function InfoModalLayout({
  title,
  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque nostrum accusantium autem eos vero consequatur reiciendis quae tenetur possimus sit!",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <>
      <Text style={[TYPOGRAPHY.heading.medium.bold, { textAlign: "center" }]}>
        {title}
      </Text>
      <Text
        style={[
          TYPOGRAPHY.body.large.medium,
          { textAlign: "center", margin: SPACING.md },
        ]}
      >
        {description}
      </Text>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  tooltipContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: 500, // Rounded appearance
    gap: SPACING.xxs, // Space between elements
  },
  iconContainer: {
    marginRight: SPACING.xxs, // Space between icon and label
  },
});
