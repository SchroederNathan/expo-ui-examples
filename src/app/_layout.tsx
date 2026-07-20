import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { PlatformColor, useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerTitleStyle: { color: PlatformColor('label') },
          headerBlurEffect: 'none',
          headerBackButtonDisplayMode: 'minimal',
        }}>
        <Stack.Screen name="index" options={{ title: 'Examples', headerLargeTitle: true }} />
      </Stack>
    </ThemeProvider>
  );
}
