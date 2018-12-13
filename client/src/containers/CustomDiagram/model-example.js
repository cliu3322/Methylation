// @flow

import type { EntityState } from '../../src/entity/reducer';

// TODO: I could potentially have a situation where the model for a link only
// has a `target` property and the entity reducer figures out the proper values
// of `points` when SETting the diagram. In this way I'd had a mix of
// declarative in the inital model and then switch to explicit after load.

const model: EntityState = [
  {
    id: 'upload',
    type: 'Task',
    width: 120,
    height: 60,
    x: 50,
    y: 0,
    name: 'upload FastQC',
    linksTo: [
      {
        target: 'trim',
        edited: false,
        points: [
        ],
      },
    ],
  },
  {
    id: 'trim',
    type: 'Trim',
    width: 50,
    height: 50,
    x: 300,
    y: 0,
    name: 'trim',
    linksTo: [
      {
        target: 'Align',
        edited: false,
        points: [
        ],
      },
    ],
  },
  {
    id: 'Align',
    type: 'Event',
    width: 125,
    height: 75,
    x: 600,
    y: 0,
    name: 'Align',
    linksTo: [
      {
        target: 'Filter',
        edited: false,
        points: [
        ],
      },
    ],
  },
  {
    id: 'Filter',
    type: 'Event',
    width: 125,
    height: 75,
    x: 800,
    y: 100,
    name: 'Filter',
    linksTo: [
      {
        target: 'Extract',
        edited: false,
        points: [
        ],
      },
    ],
  },
  {
    id: 'Extract',
    type: 'Event',
    width: 125,
    height: 75,
    x: 800,
    y: 200,
    name: 'Extract primary reads',
    linksTo: [
      {
        target: 'Adddownsampling',
        edited: false,
        points: [
        ],
      },
    ],
  },
  {
    id: 'Adddownsampling',
    type: 'Event',
    width: 125,
    height: 75,
    x: 600,
    y: 200,
    name: 'Add downsampling',
    linksTo: [
      {
        target: 'MethylationExtractorBismark',
        edited: false,
        points: [
        ],
      },
      {
        target: 'MethylationExtractorMethylDackel',
        edited: false,
        points: [
        ],
      },
    ],
  },
  {
    id: 'MethylationExtractorBismark',
    type: 'Event',
    width: 125,
    height: 75,
    x: 400,
    y: 150,
    name: 'Methylation Extractor (Bismark)',
    linksTo: [
      {
        target: 'Annotation',
        edited: false,
        points: [
        ],
      },
    ],
  },
  {
    id: 'MethylationExtractorMethylDackel',
    type: 'Event',
    width: 125,
    height: 75,
    x: 400,
    y: 250,
    name: 'Methylation extractor (MethylDackel)',
    linksTo: [
      {
        target: 'Annotation',
        edited: false,
        points: [
        ],
      },
    ],
  },
  {
    id: 'Annotation',
    type: 'Event',
    width: 125,
    height: 75,
    x: 200,
    y: 200,
    name: 'Annotation',
  },
];

export default model;
