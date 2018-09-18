export const TIERS = { // MUST be small to large
  smallStandard: {
    weight: 0.75,
    longest: 15,
    median: 12,
    shortest: .75
  },
  largeStandard: {
    weight: 20,
    longest: 18,
    median: 14,
    shortest: 8
  },
  smallOver: {
    weight: 70,
    longest: 60,
    median: 30,
    shortest: 1000,
    girth: 130
  },
  mediumOver: {
    weight: 150,
    longest: 108,
    median: 1000,
    shortest: 1000,
    girth: 130
  },
  largeOver: {
    weight: 150,
    longest: 108,
    median: 1000,
    shortest: 1000,
    girth: 165
  },
  specialOver: {
    weight: 2000,
    longest: 1000,
    median: 1000,
    shortest: 1000,
    girth: 1000
  },
};