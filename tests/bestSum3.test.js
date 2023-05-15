import { describe, expect, it } from "vitest";

const findBestSum3 = (
  costs,
  remainingSkills,
  budget,
  sameIndexLimitation = 0
) => {
  let previous = [[], 0];
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
    let a = +costs[i];

    bLoop: for (let j = i; j < len; j++) {
      let b = +costs[j];
      if (a === b && remainingSkills[b].total === 1) {
        continue;
      }
      for (let k = j; k < len; k++) {
        let c = +costs[k];

        // array is sorted so everything else will fail
        if (a + b + c > budget) {
          continue bLoop;
        }

        // if current total not higher than the previous best continue
        if (a + b + c <= previous[1]) {
          continue;
        }

        let numberUsingSameIndex = 0;

        if (a === b && remainingSkills[a].total < 1 + ++numberUsingSameIndex) {
          //if not enough spaces continue
          continue;
        }

        if (a === c && remainingSkills[a].total < 1 + ++numberUsingSameIndex) {
          continue;
        } else if (
          numberUsingSameIndex !== 2
          && b === c
          && remainingSkills[c].total < Math.min(3, 1 + ++numberUsingSameIndex)
        ) {
          continue;
        }

        if (
          sameIndexLimitation
          && numberUsingSameIndex + sameIndexLimitation < 3
        )
          continue;

        previous = [[a, b, c], a + b + c];
        if (previous[1] === budget) return previous;
        continue;
      }
    }
  }

  return previous;
};
findBestSum3(
  [1, 2, 3],
  {
    1: { total: 2 },
    2: { total: 2 },
    3: { total: 2 },
  },
  6,
  0
);
// let ugh = findBestSum3(findBestSum3(
// [1, 2, 3, 4, 5],
// {
// 1: { total: 3 },
// 2: { total: 3 },
// 3: { total: 3 },
// 4: { total: 3 },
// 5: { total: 3 },
// },
// 13,
// 1
// ))
// console.log(ugh)
describe("testCase3_13", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [1, 2, 3, 4, 5],
        {
          1: { total: 3 },
          2: { total: 3 },
          3: { total: 3 },
          4: { total: 3 },
          5: { total: 3 },
        },
        13,
        1
      )
    ).toStrictEqual([[4, 4, 4], 12]);
  });
});

describe("testCase3_1", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [2, 3, 4],
        {
          2: { total: 2 },
          3: { total: 1 },
          4: { total: 1 },
        },
        13,
        2
      )
    ).toStrictEqual([[2, 2, 4], 8]);
  });
});

describe("testCase3_2", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [1],
        {
          1: { total: 2 },
        },
        13,
        1
      )
    ).toStrictEqual([[], 1]);
  });
});

describe("testCase3_3", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [1, 2, 3],
        {
          1: { total: 1 },
          2: { total: 1 },
          3: { total: 1 },
        },
        5,
        0
      )
    ).toStrictEqual([[], 1]);
  });
});

describe("testCase3_4", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [1, 2, 3],
        {
          1: { total: 2 },
          2: { total: 2 },
          3: { total: 2 },
        },
        6,
        0
      )
    ).toStrictEqual([[1, 2, 3], 6]);
  });
});

describe("testCase3_5", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [1, 2, 3],
        {
          1: { total: 1 },
          2: { total: 1 },
          3: { total: 1 },
        },
        10,
        0
      )
    ).toStrictEqual([[1, 2, 3], 6]);
  });
});

describe("testCase3_6", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [1, 2, 3],
        {
          1: { total: 1 },
          2: { total: 1 },
          3: { total: 1 },
        },
        2,
        0
      )
    ).toStrictEqual([[], 1]);
  });
});

describe("testCase3_7", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [1, 2, 3],
        {
          1: { total: 2 },
          2: { total: 1 },
          3: { total: 1 },
        },
        6,
        2
      )
    ).toStrictEqual([[1, 1, 3], 5]);
  });
});
describe("testCase3_8", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [1, 2, 3],
        {
          1: { total: 2 },
          2: { total: 1 },
          3: { total: 1 },
        },
        6,
        1
      )
    ).toStrictEqual([[], 1]);
  });
});

describe("testCase3_9", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [1, 2, 3],
        {
          1: { total: 3 },
          2: { total: 1 },
          3: { total: 1 },
        },
        6,
        1
      )
    ).toStrictEqual([[1, 1, 1], 3]);
  });
});

describe("testCase3_10", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [2, 3, 4, 5],
        {
          2: { total: 3 },
          3: { total: 3 },
          4: { total: 3 },
          5: { total: 3 },
        },
        13,
        1
      )
    ).toStrictEqual([[4, 4, 4], 12]);
  });
});

describe("testCase3_11", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [2, 3, 4, 5],
        {
          2: { total: 3 },
          3: { total: 3 },
          4: { total: 3 },
          5: { total: 3 },
        },
        12,
        0
      )
    ).toStrictEqual([[3, 4, 5], 12]);
  });
});

describe("testCase3_12", () => {
  it("test_findBestSum3", () => {
    expect(
      findBestSum3(
        [2, 3, 4, 5],
        {
          2: { total: 3 },
          3: { total: 3 },
          4: { total: 3 },
          5: { total: 3 },
        },
        12,
        2
      )
    ).toStrictEqual([[4, 4, 4], 12]);
  });
});

/*

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
// testCases3.forEach((testCase, index) => {
// test(`Test 3_${index + 1}`, () => {
// test_findBestSum3(testCase);
// });
// });

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
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 4 },
    5: { total: 0 },
  },
   9,
   1,
  freeSpaces: { 5: { total: 1 } },
  )).toStrictEqual(  [[4, 5], 9])
  ,
};

const testCase2_2 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    1: { total: 2 },
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 2 },
    5: { total: 2 },
  },
   9,
   1,
  freeSpaces: {},
  )).toStrictEqual(  [[4, 4], 8])
  ,
};

const testCase2_3 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
   2,
   0,
  freeSpaces: {},
  )).toStrictEqual(  [[], 0])
  ,
};

const testCase2_4 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    1: { total: 2 },
    2: { total: 2 },
    3: { total: 2 },
  },
   3,
   0,
  freeSpaces: { 3: { total: 1 } },
  )).toStrictEqual(  [[1, 2], 3])
  ,
};

const testCase2_5 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
   5,
   0,
  freeSpaces: {},
  )).toStrictEqual(  [[2, 3], 5])
  ,
};

const testCase2_6 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
   1,
   0,
  freeSpaces: {},
  )).toStrictEqual(  [[], 0])
  ,
};
const testCase2_7 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    1: { total: 1 },
    2: { total: 1 },
    3: { total: 1 },
  },
   2,
   1,
  freeSpaces: { 1: { total: 1 } },
  )).toStrictEqual(  [[1, 1], 2])
  ,
};

const testCase2_8 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    1: { total: 2 },
    2: { total: 1 },
    3: { total: 1 },
  },
   6,
   1,
  freeSpaces: { 3: { total: 1 } },
  )).toStrictEqual(  [[3, 3], 6])
  ,
};

const testCase2_9 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    1: { total: 2 },
    2: { total: 1 },
    3: { total: 0 },
  },
   8,
   1,
  freeSpaces: { 3: { total: 1 } },
  )).toStrictEqual(  [[2, 3], 5])
  ,
};

const testCase2_10 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 2 },
    5: { total: 2 },
  },
   4,
   1,
  freeSpaces: {},
  )).toStrictEqual(  [[2, 2], 4])
  ,
};

const testCase2_11 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 2 },
    5: { total: 2 },
  },
   10,
   1,
  freeSpaces: {},
  )).toStrictEqual(  [[5, 5], 10])
  ,
};

const testCase2_12 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 2 },
    5: { total: 1 },
  },
   9,
   0,
  freeSpaces: {},
  )).toStrictEqual(  [[4, 5], 9])
  ,
};

const testCase2_13 = {
 expect(
    findBestSum3([1, 2, 3, 4, 5], {
    1: { total: 2 },
    2: { total: 2 },
    3: { total: 2 },
    4: { total: 0 },
    5: { total: 2 },
  },
   9,
   1,
  freeSpaces: { 4: { total: 1 } },
  )).toStrictEqual(  [[4, 5], 9])
  ,
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
//
// testCases2.forEach((testCase, index) => {
// test(`Test 2_${index + 1}`, () => {
// test_findBestSum2(testCase);
// });
// });
//
 */
