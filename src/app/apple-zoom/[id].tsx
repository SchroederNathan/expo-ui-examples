// The one route the Apple Zoom example owns. A zoom transition needs a real push
// onto the Stack, so the destination cannot be rendered through `[slug].tsx`.
// The screen itself stays in the example folder, so the example is still one
// self-contained directory.
export { default } from '@/examples/apple-zoom/photo-detail';
