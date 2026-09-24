import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { EXAMPLES, runsOnThisPlatform } from '@/examples/registry';

export default function ExampleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const example = EXAMPLES.find((e) => e.slug === slug);

  // Unknown slugs and deep links to the other platform's examples go back to the list.
  if (!example || !runsOnThisPlatform(example)) {
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
