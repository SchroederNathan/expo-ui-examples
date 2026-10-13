import { Button, Form, HStack, LabeledContent, Section, Spacer, Text } from '@expo/ui/swift-ui';
import {
  accessibilityIdentifier,
  accessibilityLabel,
  buttonStyle,
  disabled,
  font,
  foregroundStyle,
  frame,
  listSectionMargins,
  listSectionSpacing,
  monospacedDigit,
  onGeometryChange,
  padding,
  splitArrangementLayoutSize,
  textSelection,
} from '@expo/ui/swift-ui/modifiers';
import type { Hinge } from 'expo-hinge';
import { Color } from 'expo-router';

import type { HingeSession } from './use-hinge-session';

const sectionMargin = listSectionMargins({ edges: 'leading', length: 20 });
const valueStyle = [
  foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
  monospacedDigit(),
  textSelection(true),
];

type ReadingsFormProps = {
  hinge: Hinge | null;
  posture: string;
  available: boolean;
  session: HingeSession;
  onReset: () => void;
  sideBySide: boolean;
  topInset: number;
  onFrameChange: (frame: { x: number; y: number; width: number; height: number }) => void;
};

export function ReadingsForm({
  hinge,
  posture,
  available,
  session,
  onReset,
  sideBySide,
  topInset,
  onFrameChange,
}: ReadingsFormProps) {
  return (
    <Form
      modifiers={[
        frame({ maxWidth: Infinity, maxHeight: Infinity }),
        listSectionSpacing('compact'),
        onGeometryChange(onFrameChange),
        splitArrangementLayoutSize({ minWidth: 280, idealWidth: 340, maxWidth: 420 }),
      ]}>
      <Section
        header={
          <Text modifiers={[font({ textStyle: 'caption' }), padding({ top: topInset })]}>
            Readings
          </Text>
        }
        modifiers={[sectionMargin]}>
        {sideBySide && (
          <LabeledContent label="Angle">
            <Text modifiers={valueStyle}>
              {hinge ? `${hinge.angle.toFixed(1)}°` : 'Unavailable'}
            </Text>
          </LabeledContent>
        )}
        <LabeledContent label="System status">
          <Text modifiers={valueStyle}>{posture}</Text>
        </LabeledContent>
        <LabeledContent label="API available">
          <Text modifiers={valueStyle}>{available ? 'Yes' : 'No'}</Text>
        </LabeledContent>
        {sideBySide && (
          <LabeledContent label="Layout">
            <Text modifiers={valueStyle}>Split</Text>
          </LabeledContent>
        )}
      </Section>

      <Section
        header={
          <HStack>
            <Text modifiers={[font({ textStyle: 'caption' })]}>This session</Text>
            <Spacer />
            <Button
              label="Reset"
              onPress={onReset}
              modifiers={[
                buttonStyle('plain'),
                foregroundStyle(Color.ios.systemBlue),
                font({ textStyle: 'subheadline' }),
                frame({ minHeight: 44 }),
                accessibilityLabel('Reset session'),
                accessibilityIdentifier('hinge-reset'),
                disabled(!hinge && session.events === 0),
              ]}
            />
          </HStack>
        }
        modifiers={[sectionMargin]}>
        <LabeledContent label="Lowest">
          <Text modifiers={valueStyle}>
            {session.minimum === null ? 'No samples' : `${session.minimum.toFixed(1)}°`}
          </Text>
        </LabeledContent>
        <LabeledContent label="Highest">
          <Text modifiers={valueStyle}>
            {session.maximum === null ? 'No samples' : `${session.maximum.toFixed(1)}°`}
          </Text>
        </LabeledContent>
        <LabeledContent label="Events">
          <Text modifiers={[...valueStyle, accessibilityIdentifier('hinge-event-count')]}>
            {session.events.toLocaleString()}
          </Text>
        </LabeledContent>
      </Section>
    </Form>
  );
}
