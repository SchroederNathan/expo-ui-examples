export type Photo = {
  id: string;
  title: string;
  uri: string;
  /** Intrinsic size of the remote image. */
  width: number;
  height: number;
};

// picsum.photos returns a stable photo per seed at exactly the size asked for, so
// the aspect ratio is known before the image loads. Both screens read it from here:
// the detail screen can size its zoom target on the first render, with no measuring
// pass and no size params on the href.
const photo = (id: string, title: string, width: number, height: number): Photo => ({
  id,
  title,
  uri: `https://picsum.photos/seed/${id}/${width}/${height}`,
  width,
  height,
});

// Mixed aspect ratios — every thumbnail is square, so each one morphs into a
// different shape on the way in.
export const PHOTOS: Photo[] = [
  photo('granite', 'Granite Pass', 1200, 1600),
  photo('harbor', 'Harbor Light', 1600, 1067),
  photo('atrium', 'Atrium', 1200, 1200),
  photo('dunes', 'Dune Line', 1600, 900),
  photo('pinecrest', 'Pine Crest', 1000, 1500),
  photo('cobalt', 'Cobalt Bay', 1400, 1400),
];
