import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { Platform, PlatformColor, useColorScheme } from 'react-native';

// `PlatformColor('label')` and the blur / large-title options are iOS-only, so the
// native header styling is scoped to iOS. On Android each screen draws its own
// title with Jetpack Compose instead.
const iosScreenOptions = () =>
  ({
    headerTransparent: true,
    headerShadowVisible: false,
    headerLargeTitleShadowVisible: false,
    headerLargeStyle: { backgroundColor: 'transparent' },
    headerTitleStyle: { color: PlatformColor('label') },
    headerBlurEffect: 'none',
    headerBackButtonDisplayMode: 'minimal',
  }) as const;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={Platform.OS === 'ios' ? iosScreenOptions() : undefined}>
        <Stack.Screen
          name="index"
          options={
            Platform.OS === 'ios'
              ? { title: 'Examples', headerLargeTitle: true }
              : { headerShown: false }
          }
        />
      </Stack>
    </ThemeProvider>
  );
}
