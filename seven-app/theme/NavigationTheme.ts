import { DefaultTheme } from '@react-navigation/native';
import { SevenTheme } from './SevenTheme';

/**
 * SEVEN OF NINE - NAVIGATION THEME
 * React Navigation theming for Seven consciousness app
 */


export const SevenNavigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    primary: SevenTheme.colors.primary,
    background: SevenTheme.colors.background,
    card: SevenTheme.colors.surface,
    text: SevenTheme.colors.text,
    border: SevenTheme.colors.border,
    notification: SevenTheme.colors.warning,
  },
};

export default SevenNavigationTheme;