import { Column, Host, Text, useMaterialColors } from '@expo/ui/jetpack-compose';
import { fillMaxSize, paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function DropdownMenuScreen() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Column modifiers={[fillMaxSize(), paddingAll(16)]} verticalArrangement={{ spacedBy: 8 }}>
        <Text color={colors.onBackground} style={{ typography: 'titleMedium' }}>
          Dropdown Menu
        </Text>
        <Text color={colors.onSurfaceVariant} style={{ typography: 'bodySmall' }}>
          Build the example here.
        </Text>
      </Column>
    </Host>
  );
}
