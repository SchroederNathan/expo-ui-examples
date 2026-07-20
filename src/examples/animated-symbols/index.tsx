import { View } from 'react-native';

import { AnimatedSymbols } from './animated-symbols';

export default function AnimatedSymbolsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AnimatedSymbols />
    </View>
  );
}
