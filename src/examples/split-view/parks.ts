import type { SFSymbol } from 'sf-symbols-typescript';

export type Park = {
  id: string;
  name: string;
  state: string;
  established: number;
  landmark: string;
  summary: string;
};

export type Region = {
  id: string;
  name: string;
  systemImage: SFSymbol;
  color: string;
  parks: Park[];
};

export const REGIONS: Region[] = [
  {
    id: 'mountains',
    name: 'Mountains',
    systemImage: 'mountain.2.fill',
    color: '#5E7CE2',
    parks: [
      {
        id: 'yosemite',
        name: 'Yosemite',
        state: 'California',
        established: 1890,
        landmark: 'Half Dome',
        summary:
          'Granite walls, giant sequoias, and waterfalls that pour off the rim of a glacier-carved valley.',
      },
      {
        id: 'glacier',
        name: 'Glacier',
        state: 'Montana',
        established: 1910,
        landmark: 'Going-to-the-Sun Road',
        summary:
          'A crown of peaks and turquoise lakes crossed by one road that climbs over the Continental Divide.',
      },
      {
        id: 'rocky-mountain',
        name: 'Rocky Mountain',
        state: 'Colorado',
        established: 1915,
        landmark: 'Trail Ridge Road',
        summary:
          'Alpine tundra above the tree line, where elk graze beside the highest paved through road in the country.',
      },
      {
        id: 'grand-teton',
        name: 'Grand Teton',
        state: 'Wyoming',
        established: 1929,
        landmark: 'Cathedral Group',
        summary:
          'Jagged peaks that rise straight out of the valley floor with no foothills in between.',
      },
    ],
  },
  {
    id: 'deserts',
    name: 'Deserts',
    systemImage: 'sun.max.fill',
    color: '#E08A3C',
    parks: [
      {
        id: 'joshua-tree',
        name: 'Joshua Tree',
        state: 'California',
        established: 1994,
        landmark: 'Keys View',
        summary:
          'Where the Mojave meets the Colorado Desert, dotted with twisted trees and boulder piles.',
      },
      {
        id: 'arches',
        name: 'Arches',
        state: 'Utah',
        established: 1971,
        landmark: 'Delicate Arch',
        summary:
          'Red sandstone fins and arches, shaped by erosion into more than two thousand openings.',
      },
      {
        id: 'saguaro',
        name: 'Saguaro',
        state: 'Arizona',
        established: 1994,
        landmark: 'Cactus Forest Loop',
        summary:
          'Forests of the tall, many-armed cactus that grows almost nowhere outside the Sonoran Desert.',
      },
      {
        id: 'death-valley',
        name: 'Death Valley',
        state: 'California, Nevada',
        established: 1994,
        landmark: 'Badwater Basin',
        summary:
          'Salt flats below sea level, sand dunes, and the hottest air temperature ever recorded.',
      },
    ],
  },
  {
    id: 'coasts',
    name: 'Coasts',
    systemImage: 'water.waves',
    color: '#2F9FB5',
    parks: [
      {
        id: 'acadia',
        name: 'Acadia',
        state: 'Maine',
        established: 1919,
        landmark: 'Cadillac Mountain',
        summary: 'Pink granite shoreline and carriage roads on an island off the Atlantic coast.',
      },
      {
        id: 'olympic',
        name: 'Olympic',
        state: 'Washington',
        established: 1938,
        landmark: 'Hoh Rain Forest',
        summary:
          'Wild beaches, glaciated peaks, and one of the largest temperate rain forests in the country.',
      },
      {
        id: 'channel-islands',
        name: 'Channel Islands',
        state: 'California',
        established: 1980,
        landmark: 'Anacapa Island',
        summary: 'Five islands off Southern California, reachable only by boat or small plane.',
      },
      {
        id: 'dry-tortugas',
        name: 'Dry Tortugas',
        state: 'Florida',
        established: 1992,
        landmark: 'Fort Jefferson',
        summary: 'Coral reefs and a brick fort on small keys seventy miles west of Key West.',
      },
    ],
  },
  {
    id: 'forests',
    name: 'Forests',
    systemImage: 'tree.fill',
    color: '#3E9B5F',
    parks: [
      {
        id: 'great-smoky',
        name: 'Great Smoky Mountains',
        state: 'Tennessee, North Carolina',
        established: 1934,
        landmark: 'Clingmans Dome',
        summary: 'Old Appalachian ridges wrapped in the blue haze that gives the range its name.',
      },
      {
        id: 'redwood',
        name: 'Redwood',
        state: 'California',
        established: 1968,
        landmark: 'Tall Trees Grove',
        summary:
          'Coast redwoods, the tallest trees on Earth, growing right up to the Pacific shore.',
      },
      {
        id: 'sequoia',
        name: 'Sequoia',
        state: 'California',
        established: 1890,
        landmark: 'General Sherman Tree',
        summary: 'Home of the largest tree on Earth by volume, high in the southern Sierra Nevada.',
      },
      {
        id: 'congaree',
        name: 'Congaree',
        state: 'South Carolina',
        established: 2003,
        landmark: 'Boardwalk Loop',
        summary: 'Old-growth bottomland forest that floods with the rivers that run through it.',
      },
    ],
  },
];
