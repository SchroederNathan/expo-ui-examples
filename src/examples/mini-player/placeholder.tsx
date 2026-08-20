import { PlatformColor, StyleSheet, Text, View } from 'react-native';

// Empty tab body for New and Radio — the demo's content lives in the Home
// tab's album screen; these tabs exist because NativeTabs resolves triggers
// from real route files, so each trigger needs a route to point at.
export default function Placeholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nothing here — the demo lives in Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PlatformColor('systemBackground'),
  },
  label: {
    fontSize: 15,
    color: PlatformColor('secondaryLabel'),
  },
});
