import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { EXAMPLES } from '@/examples/registry';

export default function ExampleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const example = EXAMPLES.find((e) => e.slug === slug);

  if (!example) {
    return <Redirect href="/" />;
  }

  const Screen = example.screen;
  return (
    <>
      <Stack.Screen options={{ title: example.title }} />
      <Screen />
    </>
  );
}
