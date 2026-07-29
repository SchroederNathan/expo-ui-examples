// Converts a Material Symbols SVG (viewBox "0 -960 960 960") into an Android
// vector drawable that @expo/ui's VectorIconLoader can parse. That parser
// ignores <group>, so the -960 Y offset has to be folded into the path data.
import { writeFileSync } from 'node:fs';

/** Y-parameter indices per absolute path command (relative commands need no shift). */
const Y_INDICES = {
  M: [1], L: [1], T: [1], V: [0],
  C: [1, 3, 5], S: [1, 3], Q: [1, 3], A: [6],
  H: [], Z: [],
};

function shiftY(pathData, dy) {
  const tokens = pathData.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const out = [];
  let cmd = null;
  let args = [];

  let isFirst = true;

  const flush = () => {
    if (!cmd) return;
    const key = cmd.toUpperCase();
    const stride = { M: 2, L: 2, T: 2, V: 1, H: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0 }[key];
    const yIdx = cmd === key ? Y_INDICES[key] : []; // only absolute commands shift
    if (stride > 0) {
      if (isFirst && cmd === 'm') {
        // A leading `m` is absolute per the SVG spec ("If a relative moveto
        // appears as the first element of the path, it is treated as a pair of
        // absolute coordinates"), so its first pair still needs the shift — only
        // the implicit linetos that follow are true offsets. Without this, any
        // symbol whose path starts lowercase lands a full viewport too high and
        // renders as nothing at all.
        args[1] = +(args[1] + dy).toFixed(3);
      } else {
        for (let i = 0; i < args.length; i += stride) {
          for (const j of yIdx) args[i + j] = +(args[i + j] + dy).toFixed(3);
        }
      }
    }
    isFirst = false;
    // An implicit-lineto run after `M` keeps the moveto's Y indices, which is
    // what the M entry already encodes, so no special casing is needed.
    out.push(cmd + args.join(' '));
    args = [];
  };

  for (const t of tokens) {
    if (/[a-zA-Z]/.test(t)) {
      flush();
      cmd = t;
    } else {
      args.push(parseFloat(t));
    }
  }
  flush();
  return out.join('');
}

const [, , name, outPath] = process.argv;
const url = `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/default/24px.svg`;
const svg = await (await fetch(url)).text();

const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
if (viewBox !== '0 -960 960 960') throw new Error(`${name}: unexpected viewBox "${viewBox}"`);

const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
if (paths.length === 0) throw new Error(`${name}: no <path> found`);

// fillColor is required: the loader passes it straight through as the path's
// fill brush, and a path with no brush paints nothing. <Icon tint> then
// recolors the result with a ColorFilter, so the black here is just a base.
const xml = `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="960"
    android:viewportHeight="960">
${paths
  .map((d) => `  <path android:fillColor="#FF000000" android:pathData="${shiftY(d, 960)}" />`)
  .join('\n')}
</vector>
`;

writeFileSync(outPath, xml);
console.log(`${name} -> ${outPath} (${xml.length} bytes)`);
