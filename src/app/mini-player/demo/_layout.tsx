// The one nested layout the mini-player example owns. `NativeTabs` resolves
// its triggers from real sibling route files, so the tab layout can't be
// rendered through `[slug].tsx` like a normal example screen — it needs
// `index.tsx` and `library.tsx` next to it. The screen itself stays in the
// example folder, so the example is still one self-contained directory.
export { default } from '@/examples/mini-player/tab-layout';
