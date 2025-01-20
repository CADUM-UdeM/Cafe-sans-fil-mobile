type ColorsType = {
  white: string;
  black: string;
  black45: string;
  subtuleDark: string;
  lightGray: string;
  status: {
      green: string;
      orange: string;
      red: string;
  };
  statusbarInactive: string;
};

/**
 * A collection of color constants used throughout the application.
 * 
 * @constant
 * @type {ColorsType}
 * @property {string} white - Hex code for white color.
 * @property {string} black - Hex code for black color.
 * @property {string} black45 - RGBA code for black color with 45% opacity.
 * @property {string} subtuleDark - Hex code for a subtle dark color.
 * @property {string} lightGray - Hex code for light gray color.
 * @property {Object} status - Object containing status color codes.
 * @property {string} status.green - Hex code for green status color.
 * @property {string} status.orange - Hex code for orange status color.
 * @property {string} status.red - Hex code for red status color.
 * @property {string} statusbarInactive - Hex code for inactive status bar color.
 */
const COLORS: ColorsType = {
  white: "#FFFFFF",
  black: "#000000",

  black45: "rgba(0, 0, 0, 0.45)",
  subtuleDark: "#424242",
  lightGray: "#F2F2F7",

  status: {
    green: "#3E9C66",
    orange: "#E29B00",
    red: "#E20000",
  },

  statusbarInactive: "#D0D0D0",
};

export default COLORS;