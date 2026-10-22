export const MAX_SERVER_BOOSTS = 14;

const BOOST_LEVELS = [
  { level: 1, boosts: 2 },
  { level: 2, boosts: 7 },
  { level: 3, boosts: 14 },
];

export const getBoostLevel = (boosts = 0) =>
  BOOST_LEVELS.reduce(
    (level, entry) => (boosts >= entry.boosts ? entry.level : level),
    0,
  );

export const getNextBoostLevel = (boosts = 0) =>
  BOOST_LEVELS.find((entry) => boosts < entry.boosts) ?? null;
