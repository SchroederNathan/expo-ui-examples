/**
 * What the playground starts with — exercises most of the supported syntax at once.
 * Two lines, because newlines do survive: the parse is inline-only, not single-line.
 */
export const INITIAL_SOURCE =
  '**Expo UI** renders *real* SwiftUI.\nSo `markdownEnabled` is [free](https://docs.expo.dev/versions/latest/sdk/ui/swift-ui/text/).';

/**
 * Inline syntax `LocalizedStringKey` understands. Each entry is shown verbatim on
 * the left of a row and rendered on the right, so the two columns differ.
 *
 * The image is the odd one out: the syntax is parsed, but a SwiftUI `Text` cannot
 * host an image, so it collapses to the alt text alone.
 */
export const SUPPORTED = [
  '**bold**',
  '__also bold__',
  '*italic*',
  '_also italic_',
  '***both***',
  '~~strike~~',
  '`code`',
  '[link](https://expo.dev)',
  '![Image](logo.png)',
  '\\*escaped\\*',
];

/**
 * Block syntax, which the inline-only parser leaves alone. Both columns of these
 * rows come out identical — that is the finding, not a rendering bug.
 */
export const LITERAL = [
  '# Heading',
  '- List item',
  '1. Numbered item',
  '> Block quote',
  '<b>HTML</b>',
];
