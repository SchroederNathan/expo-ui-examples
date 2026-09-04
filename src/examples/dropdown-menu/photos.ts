export type Photo = {
  id: string;
  title: string;
  uri: string;
};

// The same picsum seeds as the Apple Zoom and Pull-Down Menu examples, so the demos
// browse one photo set. Copied rather than imported across example folders — every
// example stays self-contained so it can be dropped into another project as-is.
const photo = (id: string, title: string, width: number, height: number): Photo => ({
  id,
  title,
  uri: `https://picsum.photos/seed/${id}/${width}/${height}`,
});

export const PHOTOS: Photo[] = [
  photo('granite', 'Granite Pass', 1200, 1600),
  photo('harbor', 'Harbor Light', 1600, 1067),
  photo('atrium', 'Atrium', 1200, 1200),
  photo('dunes', 'Dune Line', 1600, 900),
  photo('pinecrest', 'Pine Crest', 1000, 1500),
  photo('cobalt', 'Cobalt Bay', 1400, 1400),
];
