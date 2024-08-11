import type { Role } from "./utils/osu-role.js";

export default [
  {
    // 8 digit
    id: "1271976241800548435",
    range: [10000000, Infinity],
  },
  {
    // 7 digit
    id: "1271973063524618432",
    range: [1000000, 9999999],
  },
  {
    // 6 digit
    id: "1271973165916094564",
    range: [100000, 999999],
  },
  {
    // 5 digit
    id: "1271973510650265640",
    range: [10000, 99999],
  },
  {
    // 4 digit
    id: "1271973553217998878",
    range: [1000, 9999],
  },
  {
    // 3 digit
    id: "1271973853102608487",
    range: [100, 999],
  },
  {
    // 2 digit
    id: "1271974037194674218",
    range: [10, 99],
  },
  {
    // 1 digit
    id: "1271974230866530366",
    range: [1, 9],
  },
] satisfies Role[];
