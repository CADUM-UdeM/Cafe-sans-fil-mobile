import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headingLargeBold: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
  },
  headingLargeBase: {
    fontFamily: 'Poppins-Regular',
    fontSize: 32,
  },
  
  headingMediumBold: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
  headingMediumBase: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
  },

  headingSmallBold: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  headingSmallBase: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },

  bodyLargeBase: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  bodyLargeSemiBold: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  bodyLargeMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },

  bodyNormalBase: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  bodyNormalSemiBold: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  bodyNormalMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },

  bodySmallBold: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
  },
  bodySmallBase: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
  },

  homeSearchText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13.5,
  },
});

/**
 * Typography constants
 * This defines the typography styles used throughout the application.
 * @constant TYPOGRAPHY
 */
const TYPOGRAPHY = {
  heading: {
    large: {
      bold: styles.headingLargeBold,
      base: styles.headingLargeBase,
    },
    medium: {
      bold: styles.headingMediumBold,
      base: styles.headingMediumBase,
    },
    small: {
      bold: styles.headingSmallBold,
      base: styles.headingSmallBase,
    },
  },
  body: {
    large: {
      base: styles.bodyLargeBase,
      semiBold: styles.bodyLargeSemiBold,
      medium: styles.bodyLargeMedium,
    },
    normal: {
      base: styles.bodyNormalBase,
      semiBold: styles.bodyNormalSemiBold,
      medium: styles.bodyNormalMedium,
    },
    small: {
      bold: styles.bodySmallBold,
      base: styles.bodySmallBase,
    },
  },
  component: {
    homeSearchText: styles.homeSearchText,
  }
};

export default TYPOGRAPHY;
