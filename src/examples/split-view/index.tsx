import { Host } from '@expo/ui';
import {
  Button,
  ContentUnavailableView,
  Image,
  Label,
  LabeledContent,
  List,
  Menu,
  NavigationSplitView,
  type NavigationSplitViewVisibility,
  Picker,
  Section,
  Text,
  Toolbar,
  ToolbarItem,
  VStack,
} from '@expo/ui/swift-ui';
import {
  font,
  foregroundStyle,
  frame,
  listRowBackground,
  listStyle,
  multilineTextAlignment,
  navigationSplitViewColumnWidth,
  navigationSplitViewStyle,
  navigationTitle,
  padding,
  pickerStyle,
  type NavigationSplitViewStyle,
  tag,
} from '@expo/ui/swift-ui/modifiers';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';

import { REGIONS, type Park, type Region } from './parks';

const secondary = foregroundStyle({ type: 'hierarchical', style: 'secondary' });

const VISIBILITIES: { value: NavigationSplitViewVisibility; label: string }[] = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'all', label: 'All Columns' },
  { value: 'doubleColumn', label: 'List and Detail' },
  { value: 'detailOnly', label: 'Detail Only' },
];

const STYLES: { value: NavigationSplitViewStyle; label: string }[] = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'prominentDetail', label: 'Prominent Detail' },
];

// Navigation Split View — a three-column field guide: regions in the sidebar, their
// parks in the content column, and the selected park in the detail column. The same
// tree lays itself out for whatever width the window has: a push-and-pop stack on
// an iPhone or the folded iPhone Duo, and side-by-side columns on an iPad or the
// unfolded Duo. Folding and unfolding keeps the selection, so the open park stays
// open. The stack header is hidden because every column brings its own navigation
// bar.
export default function SplitViewScreen() {
  const router = useRouter();
  // Nothing starts selected. In a stacked layout the split view pushes down to the
  // deepest selected column, so a preselected park would open the app on its detail
  // page instead of the region list.
  const [regionId, setRegionId] = useState<string | null>(null);
  const [parkId, setParkId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<NavigationSplitViewVisibility>('automatic');
  const [style, setStyle] = useState<NavigationSplitViewStyle>('automatic');

  const region = REGIONS.find((r) => r.id === regionId);
  const park = region?.parks.find((p) => p.id === parkId);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Host style={{ flex: 1 }}>
        <NavigationSplitView
          // Controlled: dragging the sidebar or tapping the sidebar button reports
          // the new visibility here, and it only takes effect once it comes back in.
          columnVisibility={visibility}
          onColumnVisibilityChange={setVisibility}
          modifiers={[navigationSplitViewStyle(style)]}>
          <NavigationSplitView.Sidebar>
            <Toolbar>
              <List
                // A single-element selection. In a stacked layout, choosing a row
                // pushes the next column; popping back clears the selection.
                selection={regionId ? [regionId] : []}
                onSelectionChange={(selection) => {
                  const next = selection[0];
                  setRegionId(typeof next === 'string' ? next : null);
                  // A new region clears the park, so the detail column never shows a
                  // park from a region that is no longer selected.
                  if (next !== regionId) setParkId(null);
                }}
                modifiers={[
                  listStyle('sidebar'),
                  navigationTitle('Field Guide'),
                  navigationSplitViewColumnWidth({ min: 180, ideal: 220, max: 280 }),
                ]}>
                <Section title="Regions">
                  {REGIONS.map((r) => (
                    <RegionRow key={r.id} region={r} />
                  ))}
                </Section>
              </List>
              <Toolbar.Content>
                <ToolbarItem placement="topBarLeading">
                  {/* A toolbar shows only the icon; the label is what VoiceOver reads. */}
                  <Button
                    label="Examples"
                    systemImage="chevron.backward"
                    onPress={() => router.back()}
                  />
                </ToolbarItem>
              </Toolbar.Content>
            </Toolbar>
          </NavigationSplitView.Sidebar>

          <NavigationSplitView.Content>
            {region ? (
              <List
                selection={parkId ? [parkId] : []}
                onSelectionChange={(selection) => {
                  const next = selection[0];
                  setParkId(typeof next === 'string' ? next : null);
                }}
                modifiers={[
                  navigationTitle(region.name),
                  navigationSplitViewColumnWidth({ min: 260, ideal: 320, max: 400 }),
                ]}>
                {region.parks.map((p) => (
                  <ParkRow key={p.id} park={p} />
                ))}
              </List>
            ) : (
              <ContentUnavailableView
                title="No Region Selected"
                systemImage="map"
                description="Pick a region from the sidebar."
              />
            )}
          </NavigationSplitView.Content>

          <NavigationSplitView.Detail>
            <Toolbar>
              {park && region ? (
                <ParkDetail park={park} region={region} />
              ) : (
                <ContentUnavailableView
                  title="No Park Selected"
                  systemImage="tree"
                  description="Pick a park to read about it."
                />
              )}
              <Toolbar.Content>
                <ToolbarItem placement="topBarTrailing">
                  <LayoutMenu
                    visibility={visibility}
                    onVisibilityChange={setVisibility}
                    style={style}
                    onStyleChange={setStyle}
                  />
                </ToolbarItem>
              </Toolbar.Content>
            </Toolbar>
          </NavigationSplitView.Detail>
        </NavigationSplitView>
      </Host>
    </>
  );
}

function RegionRow({ region }: { region: Region }) {
  return (
    // A Label gives every icon the same width, so the region names line up.
    <Label
      title={region.name}
      icon={<Image systemName={region.systemImage} size={17} color={region.color} />}
      modifiers={[tag(region.id)]}
    />
  );
}

function ParkRow({ park }: { park: Park }) {
  return (
    <VStack alignment="leading" spacing={2} modifiers={[tag(park.id), padding({ vertical: 2 })]}>
      <Text modifiers={[font({ textStyle: 'headline' })]}>{park.name}</Text>
      <Text modifiers={[font({ textStyle: 'subheadline' }), secondary]}>
        {`${park.state} · Est. ${park.established}`}
      </Text>
    </VStack>
  );
}

function ParkDetail({ park, region }: { park: Park; region: Region }) {
  return (
    <List modifiers={[navigationTitle(park.name)]}>
      <Section>
        <VStack
          spacing={10}
          modifiers={[
            frame({ maxWidth: Infinity }),
            padding({ vertical: 16 }),
            listRowBackground('transparent'),
          ]}>
          <Image systemName={region.systemImage} size={56} color={region.color} />
          <Text
            modifiers={[font({ textStyle: 'body' }), secondary, multilineTextAlignment('center')]}>
            {park.summary}
          </Text>
        </VStack>
      </Section>
      <Section title="Details">
        <LabeledContent label="State">
          <Text>{park.state}</Text>
        </LabeledContent>
        <LabeledContent label="Established">
          <Text>{String(park.established)}</Text>
        </LabeledContent>
        <LabeledContent label="Landmark">
          <Text>{park.landmark}</Text>
        </LabeledContent>
        <LabeledContent label="Region">
          <Text>{region.name}</Text>
        </LabeledContent>
      </Section>
    </List>
  );
}

// The two layout props, driven from the detail column's toolbar. Column visibility
// only matters when there is room for more than one column; in a stacked layout the
// split view ignores it and shows one column at a time.
function LayoutMenu({
  visibility,
  onVisibilityChange,
  style,
  onStyleChange,
}: {
  visibility: NavigationSplitViewVisibility;
  onVisibilityChange: (visibility: NavigationSplitViewVisibility) => void;
  style: NavigationSplitViewStyle;
  onStyleChange: (style: NavigationSplitViewStyle) => void;
}) {
  return (
    <Menu label="Layout" systemImage="rectangle.split.3x1">
      <Picker
        label="Columns"
        systemImage="sidebar.left"
        selection={visibility}
        onSelectionChange={onVisibilityChange}
        modifiers={[pickerStyle('menu')]}>
        {VISIBILITIES.map((v) => (
          <Text key={v.value} modifiers={[tag(v.value)]}>
            {v.label}
          </Text>
        ))}
      </Picker>
      <Picker
        label="Style"
        systemImage="rectangle.righthalf.inset.filled"
        selection={style}
        onSelectionChange={onStyleChange}
        modifiers={[pickerStyle('menu')]}>
        {STYLES.map((s) => (
          <Text key={s.value} modifiers={[tag(s.value)]}>
            {s.label}
          </Text>
        ))}
      </Picker>
    </Menu>
  );
}
