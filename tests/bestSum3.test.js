import { assert, describe, test, expect, it } from "vitest";
const findBestSum3 = (
  costs,
  remainingSkills,
  budget
) => {
  let previous = [[], 0];
  const sumOfIndexes = [0, 0];
  let a, b, c;
  /*  uses previous[1] to allow the i = 0 through the 
first time
 This gives better chances of taking from the middle of 
the array as well as a half-assed one time binary 
shortcut */
  for (let i = 0, len = costs.length; i !== 0 || !previous[1]; ) {
    if (++i >= len) {
      // if previous[1] !== 0 a result likely more
      // preferred has already been found so return
      if (previous[1]) return previous;
      // if no results have been found for previous ++ to
      // prevent infinite loop
      ++previous[1];
      // return i back to 0 to try the first index
      i = 0;
    }
    a = +costs[i];
    }
    bLoop: for (let j = i; j < len; j++) {
      b = +costs[j];

      if (a === b &&  remainingSkills[b].total === 1) continue;
      cLoop: for (let k = j; k < len; k++) {
        c = +costs[k];

        if (a + b + c > budget) continue bLoop;
        if (a + b + c <= previous[1]) continue;

        switch (remainingSkills[c].total) {
          case 1:
            if (c === a || c === b) continue cLoop;
            break;
          case 2:
            if (c === a && c === b) continue cLoop;
            break;
          default:
            break;
        }
          previous = [[a, b, c], a + b + c];
          if (previous[1] === budget) return previous;
          continue;
        }
      }

  return previous;
};
function test_findBestSum3(testCase) {
  testCase.costs = [...Object.keys(testCase.remainingSkills)].sort();
  // testCase.costs.push(testCase.costs.shift());
  const result = findBestSum3(
    testCase.costs,
    testCase.remainingSkills,
    testCase.budget
  );
  expect(JSON.stringify(result)).toEqual(JSON.stringify(testCase.expected));
}
const testCase3_1 = {
  remainingSkills: {
    2: { total: 2 },
    3: { total: 1 },
    4: { total: 1 },
  },
  budget: 13,
  sameIndexCount: 2,
  expected: [[2, 2, 4], 8],
  description: "Test 3_1:",
};

const testCase3_2 = {
  remainingSkills: {
    1: { total: 2 },
    2: { total: 0 },
    3: { total: 0 },
    4: { total: 0 },
    5: { total: 0 },
  },
  budget: 13,
  sameIndexCount: 1,
  expected: [[], 1],
  description: "Test 3_2:",
};

const testCase3_3 = {
  remainingSkills: {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 5,
  sameIndexCount: 0,
  expected: [[], 1],
  description: "Test 3_3:",
};

const testCase3_4 = {
  remainingSkills: {
    1: { total: 2 },
    2: { total: 2 },
    3: { total: 2 },
  },
  budget: 6,
  sameIndexCount: 0,
  expected: [[2, 2, 2], 6],
  description: "Test 3_4:",
};

const testCase3_5 = {
  remainingSkills: {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 10,
  sameIndexCount: 0,
  expected: [[1, 2, 3], 6],
  description: "Test 3_5:",
};

const testCase3_6 = {
  remainingSkills: {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 2,
  sameIndexCount: 0,
  expected: [[], 1],
  description: "Test 3_6:",
};
const testCase3_7 = {
  remainingSkills: {
    1: { total: 2 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 6,
  sameIndexCount: 2,
  expected: [[1, 1, 3], 5],
  description: "Test 3_7:",
};

const testCase3_8 = {
  remainingSkills: {
    1: { total: 2 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 6,
  sameIndexCount: 1,
  expected: [[], 1],
  description: "Test 3_8:",
};

const testCase3_9 = {
  remainingSkills: {
    1: { total: 3 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 6,
  sameIndexCount: 1,
  expected: [[1, 1, 1], 3],
  description: "Test 3_9:",
};

const testCase3_10 = {
  remainingSkills: {
    2: { total: 3 },
    3: { total: 3 },
    4: { total: 3 },
    5: { total: 3 },
  },
  budget: 13,
  sameIndexCount: 1,
  expected: [[4, 4, 4], 12],
  description: "Test 3_10:",
};

const testCase3_11 = {
  remainingSkills: {
    2: { total: 3 },
    3: { total: 3 },
    4: { total: 3 },
    5: { total: 3 },
  },
  budget: 12,
  sameIndexCount: 0,
  expected: [[3, 4, 5], 12],
  description: "Test 3_11:",
};

const testCase3_12 = {
  remainingSkills: {
    2: { total: 3 },
    3: { total: 3 },
    4: { total: 3 },
    5: { total: 3 },
  },
  budget: 12,
  sameIndexCount: 2,
  expected: [[4, 4, 4], 12],
  description: "Test 3_12:",
};

const testCase3_13 = {
  remainingSkills: {
    1: { total: 3 },
    2: { total: 3 },
    3: { total: 3 },
    4: { total: 3 },
    5: { total: 3 },
  },
  budget: 13,
  sameIndexCount: 1,
  expected: [[4, 4, 4], 12],
  description: "Test 3_13:",
};
const testCases3 = [
  testCase3_1,
  testCase3_2,
  testCase3_3,
  testCase3_4,
  testCase3_5,
  testCase3_6,
  testCase3_7,
  testCase3_8,
  testCase3_9,
  testCase3_10,
  testCase3_11,
  testCase3_12,
  testCase3_13,
];
testCases3.forEach((testCase, index) => {
  test(`Test 3_${index + 1}`, () => {
    test_findBestSum3(testCase);
  });
});

function findBestSum2(
  costs,
  remainingSkills,
  budget,
  maxSameI,
  freeSpaces = {}
) {
  let previous = [[], 0];

  for (let i = 0, len = costs.length; i < len; ++i) {
    const a = +costs[i];
    if ((freeSpaces[a]?.total || 0) + remainingSkills[a].total < 1) continue;
    for (let j = i; j < len; j++) {
      const b = +costs[j];
      if (a === b && !freeSpaces[b] && remainingSkills[b].total === 1) continue;
      if (a !== b && maxSameI && !freeSpaces[a] && !freeSpaces[b]) continue;
      if (
        a === b
        && ((!freeSpaces[b] && remainingSkills[b].total < 1)
          || (freeSpaces[b]?.total === 1 && remainingSkills[b].total < 1)
          || (maxSameI
            && (freeSpaces[b]?.total || 0) + remainingSkills[b].total < 1))
      ) {
        continue;
      }

      if (a + b > budget || a + b <= previous[1]) continue;

      previous = [[a, b], a + b];
      if (previous[1] === budget) return previous;
      // }
    }
  }

  return previous;
}
function test_findBestSum2(testCase) {
  testCase.costs = [...Object.keys(testCase.remainingSkills)].sort();
  // testCase.costs.push(testCase.costs.shift());
  const result = findBestSum2(
    testCase.costs,
    testCase.remainingSkills,
    testCase.budget,
    testCase.sameIndexCount,
    testCase.freeSpaces
  );

  expect(JSON.stringify(result)).toEqual(JSON.stringify(testCase.expected));
}

const testCase2_1 = {
  remainingSkills: {
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 4 },
    5: { total: 0 },
  },
  budget: 9,
  sameIndexCount: 1,
  freeSpaces: { 5: { total: 1 } },
  expected: [[4, 5], 9],
  description: "Test 3_1:",
};

const testCase2_2 = {
  remainingSkills: {
    1: { total: 2 },
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 2 },
    5: { total: 2 },
  },
  budget: 9,
  sameIndexCount: 1,
  freeSpaces: {},
  expected: [[4, 4], 8],
  description: "Test 3_2:",
};

const testCase2_3 = {
  remainingSkills: {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 2,
  sameIndexCount: 0,
  freeSpaces: {},
  expected: [[], 0],
  description: "Test 3_3:",
};

const testCase2_4 = {
  remainingSkills: {
    1: { total: 2 },
    2: { total: 2 },
    3: { total: 2 },
  },
  budget: 3,
  sameIndexCount: 0,
  freeSpaces: { 3: { total: 1 } },
  expected: [[1, 2], 3],
  description: "Test 3_4:",
};

const testCase2_5 = {
  remainingSkills: {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 5,
  sameIndexCount: 0,
  freeSpaces: {},
  expected: [[2, 3], 5],
  description: "Test 3_5:",
};

const testCase2_6 = {
  remainingSkills: {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 1,
  sameIndexCount: 0,
  freeSpaces: {},
  expected: [[], 0],
  description: "Test 3_6:",
};
const testCase2_7 = {
  remainingSkills: {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 2,
  sameIndexCount: 1,
  freeSpaces: { 1: { total: 1 } },
  expected: [[1, 1], 2],
  description: "Test 3_7:",
};

const testCase2_8 = {
  remainingSkills: {
    1: { total: 2 },
    2: { total: 1 },
    3: { total: 1 },
  },
  budget: 6,
  sameIndexCount: 1,
  freeSpaces: { 3: { total: 1 } },
  expected: [[3, 3], 6],
  description: "Test 3_8:",
};

const testCase2_9 = {
  remainingSkills: {
    1: { total: 2 },
    2: { total: 1 },
    3: { total: 0 },
  },
  budget: 8,
  sameIndexCount: 1,
  freeSpaces: { 3: { total: 1 } },
  expected: [[2, 3], 5],
  description: "Test 3_9:",
};

const testCase2_10 = {
  remainingSkills: {
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 2 },
    5: { total: 2 },
  },
  budget: 4,
  sameIndexCount: 1,
  freeSpaces: {},
  expected: [[2, 2], 4],
  description: "Test 3_10:",
};

const testCase2_11 = {
  remainingSkills: {
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 2 },
    5: { total: 2 },
  },
  budget: 10,
  sameIndexCount: 1,
  freeSpaces: {},
  expected: [[5, 5], 10],
  description: "Test 3_11:",
};

const testCase2_12 = {
  remainingSkills: {
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 2 },
    5: { total: 1 },
  },
  budget: 9,
  sameIndexCount: 0,
  freeSpaces: {},
  expected: [[4, 5], 9],
  description: "Test 3_12:",
};

const testCase2_13 = {
  remainingSkills: {
    1: { total: 2 },
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 0 },
    5: { total: 2 },
  },
  budget: 9,
  sameIndexCount: 1,
  freeSpaces: { 4: { total: 1 } },
  expected: [[4, 5], 9],
  description: "Test 3_13:",
};
const testCases2 = [
  testCase2_1,
  testCase2_2,
  testCase2_3,
  testCase2_4,
  testCase2_5,
  testCase2_6,
  testCase2_7,
  testCase2_8,
  testCase2_9,
  testCase2_10,
  testCase2_11,
  testCase2_12,
  testCase2_13,
];

testCases2.forEach((testCase, index) => {
  test(`Test 2_${index + 1}`, () => {
    test_findBestSum2(testCase);
  });
});
