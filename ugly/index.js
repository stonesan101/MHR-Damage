let lastEvent = "";
let comboTracker = [];
let buildKeys = 0;
let testKeyCount = 0;
let armorCount = "";
const dropHZ = document.getElementById("dropHZ");
const dropWeapon = document.getElementById("dropWeapon");
const weaponType = document.getElementById("dropWeaponType");
const dropMon = document.getElementById("dropMonster");
const dropQuest = document.getElementById("dropQuest");
const weaponTypes = [
  ["LightBowGun"],
  ["GreatSword"],
  ["ChargeBlade"],
  ["InsectGlaive"],
  ["SwordNShield"],
  ["DualBlades"],
  ["SwitchAxe"],
  ["LongSword"],
  ["Lance"],
  ["HeavyBowGun"],
  ["Bow"],
  ["HuntingHorn"],
  ["Gunlance"],
  ["Hammer"],
];
// const registerServiceWorker = async () => {
// if ("serviceWorker" in navigator) {
// Check if a service worker is already registered
// const registration = await navigator.serviceWorker.getRegistration();
// if (!registration) {
// Register the service worker if it's not already registered
// await navigator.serviceWorker.register("/sw.js", { scope: "/" });
// }
//
// try {
// if ("serviceWorker" in navigator) return;
// await navigator.serviceWorker.register("/sw.js", {
// scope: "/",
// });
// } catch (error) {
// console.error(`Registration failed with ${error}`);
// }
// }
// };
// if ("serviceWorker" in navigator) {
// 1 + 1;
// } else {
// registerServiceWorker();
// }

const getGrade = (a, b) => {
  if (a.includes("S") || b.includes("S")) return "S";
  if (b <= a) return b;
  return a;
};
const info = {};
async function getInfo() {
  try {
    const baseURL = window.location.href.slice(0, window.location.href.lastIndexOf("/"));
    weaponTypeSelect();
    const monster = fetch(`${window.location.href.slice(0, window.location.href.lastIndexOf("/"))}/json/monster.json`)
      .then((data) => data.json())
      .then((data) => {
        info.monster = data;
        // monsterSelect();
        // partSelect();
      });
    // Await(await fetch(`${baseURL}/json/rampage.json`)).json().then(x=>info[rampage]=x)
    const rampage = fetch(`${baseURL}/json/rampage.json`)
      .then((data) => data.json())
      .then((data) => {
        info.rampage = data;
      });
    const types = fetch(`${baseURL}/json/types.json`)
      .then((data) => data.json())
      .then((data) => {
        info.types = data;
      });
    const skills = fetch(`${baseURL}/json/skills.json`)
      .then((data) => data.json())
      .then((data) => {
        info.skills = data;
      });
    const quest = fetch(`${baseURL}/json/quest.json`)
      .then((data) => data.json())
      .then((data) => {
        info.quest = data;
      });
    const LightBowGun = fetch(`${baseURL}/json/LightBowGun.json`)
      .then((data) => data.json())
      .then((data) => {
        info.LightBowGun = data;
      });
    const ammo = fetch(`${baseURL}/json/ammo.json`)
      .then((data) => data.json())
      .then((data) => {
        info.ammo = data;
      });
    const weaponsLoaded = await Promise.all([LightBowGun, types, rampage]).then(() => {
      // weaponSelect();
      // rampageSelect();
    });
    await Promise.all([monster, skills, quest, ammo, weaponsLoaded])
      .then(() => {
        classChange();
        document.querySelectorAll("#dropMonster>option").forEach((x, i) => {
          if (x.textContent === "Toadversary") {
            document.getElementById("dropMonster").selectedIndex = i;
          }
        });
        // partSelect();
        // healthSelect();
        // monChart();
        // dataCompile();
      })
      .then(() => info);
    if (document.getElementsByTagName("SCRIPT")[0].src.includes("backup.js")) {
      weaponTypes.push("mhrice");
      const newScript = document.createElement("script");
      newScript.src = "utilities.js";
      document.body.append(newScript);
      const newScript2 = document.createElement("script");
      newScript2.src = "setCreation.js";
      document.body.append(newScript2);
      const newScript3 = document.createElement("script");
      newScript3.src = "setBuilderWorker.js";
      document.body.append(newScript3);
      // } else {
      // const newScript2 = document.createElement("script");
      // newScript2.src = "setPrep.js";
      // document.body.append(newScript2);
      // const newScript3 = document.createElement("script");
      // newScript3.src = "setworker.js";
      // document.body.append(newScript3);
    }
    weaponTypes.push("armor");

    fetch(`${baseURL}/json/charms.json`)
      .then((data) => data.json())
      .then((data) => {
        const combos = [];
        const charm1Frag = document.createDocumentFragment();
        const charm2Frag = document.createDocumentFragment();
        for (let k = 0, j = 0; ; ) {
          if (k === 0) {
            const option1 = document.createElement("option");
            option1.value = Object.values(data)[j][0]?.grade;
            option1.textContent = `${Object.keys(data)[j]} +${Object.values(data)[j][1]}`;
            charm1Frag.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = Object.values(data)[j][0]?.grade;
            option2.textContent = `${Object.keys(data)[j]} +${Object.values(data)[j][2]}`;
            charm2Frag.appendChild(option2);
          }
          if (++j === Object.keys(data).length) {
            j = 0;
            if (++k === Object.keys(data).length) {
              break;
            } else if (k === 1) {
              document.getElementById("charm1Skill1")?.appendChild(charm1Frag.cloneNode(true));
              document.getElementById("charm1Skill2")?.appendChild(charm2Frag.cloneNode(true));
              document.getElementById("charm2Skill1")?.appendChild(charm1Frag.cloneNode(true));
              document.getElementById("charm2Skill2")?.appendChild(charm2Frag.cloneNode(true));
            }
          }

          if (
            k !== j &&
            Object.keys(data)[k] !== "Bludgeoner" &&
            Object.keys(data)[j] !== "Bludgeoner" &&
            (info.types.Lvl4[Object.keys(data)[k]] === null ||
              info.types.qurious[Object.keys(data)[k]] >= 9 ||
              !info.types.qurious[Object.keys(data)[k]] ||
              info.types.Lvl4[Object.keys(data)[k]] < 2) &&
            (info.types.Lvl4[Object.keys(data)[j]] === null ||
              info.types.qurious[Object.keys(data)[j]] >= 9 ||
              !info.types.qurious[Object.keys(data)[j]] ||
              info.types.Lvl4[Object.keys(data)[j]] < 2) &&
            !info.types.decoLevels[0].some((x) => Object.keys(x)[0] === Object.keys(data)[k]) &&
            !info.types.decoLevels[0].some((x) => Object.keys(x)[0] === Object.keys(data)[j]) &&
            Object.values(data)[k][1] >= 3 &&
            Object.values(data)[j][2] >= 2
          ) {
            combos.push({
              skills: {
                [Object.keys(data)[k]]: Object.values(data)[k][1],
                [Object.keys(data)[j]]: Object.values(data)[j][2],
              },
              grade: getGrade(Object.values(data)[k][0]?.grade, Object.values(data)[j][0]?.grade),
            });
          }
        }
        info.charms = combos;
      });

    // const baseURL = window.location.origin;
    weaponTypes.slice(1).forEach((fileName) => {
      fetch(`${baseURL}/json/${fileName}.json`)
        .then((data) => data.json())
        .then((data) => {
          info[fileName] = data;

          if (fileName === "armor") {
            // armorSelect();
            // setDecoSlots(document.getElementById("charm1Skill1"));
            // setDecoSlots(document.getElementById("charm2Skill1"));
            // updateSelectedSkills(window.event);
          }
        });
    });
  } catch (err) {
    console.error(err);
  }
}

getInfo();
const getArmorTypes = () => ["helm", "chest", "arm", "waist", "leg"];
// document.addEventListener('DOMContentLoaded',  () => {
// });
const timesUsed = (valueToCheck, arr = comboTracker, count = 0) => {
  arr.forEach((value) => {
    if (value == valueToCheck) ++count;
  });
  return count;
};

function dataCompile(e = window?.event) {
  updateSelectedSkills();
  if (/BowGun/.test(weaponType.value)) {
    rangedDPS(e);
  } else {
    meleeDPS(e);
  }
}
const resetTable = (meleeDamage) => {
  let i = 0;
  let j = 2;
  const k = 0;
  const cells = document.querySelectorAll("#dpsBody>tr>td:nth-child(n+3)");
  while (true) {
    if (++j === 7) {
      j = 2;
      if (++i === meleeDamage.length) break;
    }
    cells[k].textContent = meleeDamage[i][j];
  }
};
function rangedDPS(e) {
  document.querySelector("output.elementalAug").value = 0;
  document.getElementById("elementalResult").value = "+0";

  document.querySelector("output.sharpnessAug").value = 0;
  document.getElementById("sharpnessResult").value = "+0";

  const rangedDamage = [];
  const ammoFrameData = [];
  let ammo = {};
  let pass1 = true;
  // Let attackTypes = {...getWeaponMR() };
  const attackTypes = getWeaponMR();
  ["Shot", "Sever", "Blunt", "IgnoreHZV"].forEach((type) => {
    attackTypes[type] = getInitialStats(attackTypes, type);
  });

  const theseAttacks = getUsedAttacks();
  for (let i = 0; i < Object.keys(theseAttacks).length; i++) {
    let power = {
      ...attackTypes[Object.values(theseAttacks)[i].type],
      ...Object.values(theseAttacks)[i],
    };
    power = getDependantSkills(power);
    power = getRemainingSkills(power);
    power = damageCalculations(power);
    if (/Demon|Armor|Wyvern Blast|Glide|Wyvernsn|Guard/.test(power.attackName)) {
      ammo.ticsAdjust = 1;
    } else {
      ammo = calculateAmmoFrames(power);
    }

    const totalEffective = ~~((~~power.efr + ~~power.efe) * ammo.ticsAdjust);
    const totalCrit = ~~(~~power.rawCrit + ~~power.eleCrit);
    const totalNon = ~~(~~power.rawNon + ~~power.eleNon);

    const shotsToKill = formatNumbers(~~(0.99 + document.getElementById("health").value / totalEffective));
    // Const timeToKill = /(Sticky|Slicing)/.test(power.attackName)
    // ? 5 + ~~( (60 / ammo.shotsPerMin) * shotsToKill) // Adds delay time for stickies/ slicing;
    // : ~~( (60 / ammo.shotsPerMin) * shotsToKill);
    let timeToKill = /Stic|Slic/.test(power.attackName)
      ? 5 + ~~(0.98 + 60 / ammo.shotsPerMin) * ~~(0.99 + document.getElementById("health").value / totalEffective)
      : ~~(0.98 + 60 / ammo.shotsPerMin) * ~~(0.99 + document.getElementById("health").value / totalEffective);
    timeToKill = formatNumbers(timeToKill);
    const rawBoth = [`${~~power.rawNon} / ${~~power.rawCrit}`];
    const eleBoth = [`${~~power.eleNon} / ${~~power.eleCrit}`];
    const total = [`${~~totalNon} / ${~~totalCrit}`];
    const damage = [
      power.attackName,
      rawBoth,
      eleBoth,
      total,
      totalEffective,
      ammo.shotsPerGain === "NaN%" || ammo.shotsPerGain === "0.00%" ? "No Gain" : ammo.shotsPerGain,
      /(\d{2},\d{3})/.test(shotsToKill) ? "N / A" : shotsToKill,
      /(\d{2},\d{3})/.test(timeToKill) ? "N / A" : timeToKill,
    ];

    rangedDamage.push(damage);

    const ammoStats = [
      power.attackName,
      power.rawMV,
      ammo.reloadSpeed === undefined ? " N / A " : ammo.reloadSpeed,
      ammo.recoilSpeed === undefined ? " N / A " : ammo.recoilSpeed,
      isNaN(ammo.clipSize) ? "N / A" : ammo.clipSize,
      power.ticsPer + 1,
      ammo.shotsPerMinBase === undefined ? " N / A " : ammo.shotsPerMinBase,
      ammo.shotsPerMin === undefined ? " N / A " : ammo.shotsPerMin,
    ];

    ammoFrameData.push(ammoStats);
    if (pass1) {
      const stats = [
        ["Stat", "Raw", "Ele Pierce"],
        ["Base", ~~power.baseRaw, ~~(22 * (1 + power.raw / 100))],
        ["True", ~~power.raw, ~~((22 * power.BEM + power.BE) * (1 + power.raw / 100))],
        [
          "eTrue",
          ~~(power.raw * getCritBoost(power.aff, power.Crit).PRM * power.PRM * power.augPRM),

          ~~(
            (22 * power.BEM + power.BE) *
            (1 + power.raw / 100) *
            power.PEM *
            power.augPEM *
            getCritEle(power.aff, power.Crit).PEM
          ),
        ],
        [
          "EFR/EFE",
          ~~(power.raw * getCritBoost(power.aff, power.Crit).EFR * power.PRM * power.augPRM),

          ~~(
            (22 * power.BEM + power.BE) *
            (1 + power.raw / 100) *
            power.PEM *
            power.augPEM *
            getCritEle(power.aff, power.Crit).EFE
          ),
        ],
        ["Critical"].concat(
          Number(getCritBoost(power.aff).EFR).toFixed(3),
          Number(getCritEle(power.aff).EFE).toFixed(2)
        ),
        ["Affinity", ~~(power.aff * 100)],
      ];
      createTable(stats);
      pass1 = false;
    }
  }

  rangedDamage.splice(0, 0, [
    "Ammo Type",
    "Raw",
    "Element",
    "Total",
    "Effective",
    "RPM Gain",
    "Shots \n To Kill",
    "Seconds \n To Kill",
  ]);

  buildDamageTable(rangedDamage, "dps", e);
  ammoFrameData.splice(0, 0, [
    "Ammo Type",
    "rawMV",
    "Reload",
    "Recoil",
    "Clip Size",
    "Procs Per",
    "RPM Base",
    "Current RPM",
  ]);
  buildDamageTable(ammoFrameData, "ammo", e);
}

function meleeDPS(e) {
  const runTimeStart = performance.now();
  const meleeDamage = [["Combo", "Attack Name", "MV", "Raw", "Element", "Total", "Effective"]];
  let comboDamage = [0, 0, 0, 0, 0, 0, 0, 0];
  let thisIndex = -1;
  let comboHitsUsed = {};
  const lastSharp = Sharpness.selectedIndex;
  // Let attackTypes = {...getWeaponMR() };
  const attackTypes = getWeaponMR();
  ["Shot", "Sever", "Blunt", "IgnoreHZV"].forEach((type) => {
    attackTypes[type] = getInitialStats(attackTypes, type);
  });

  Object.values(getUsedAttacks()).forEach((attack) => {
    ++thisIndex;
    let power = {
      ...attack,
      ...attackTypes[attack.type],
    };
    power = getDependantSkills(power);
    if (/input/.test(e?.target?.className) && power.attackName === "Combo Damage") {
      updateComboTracker();
      updateComboDisplay();
    }

    if (power.attackName === "Combo Damage") {
      comboHitsUsed = weaponType.value === "Bow" ? hitsPerColorSharp()[1] : getComboHitsAndSetSharpness(power.aff);
    }

    power = getRemainingSkills(power);
    power = damageCalculations(power);
    if (comboTracker.includes(thisIndex.toString())) {
      /* Goes through each color sharpness and filters the recorded attacks for the number of times this current attack was used
       * then applies the given sharpness modifier to the damage if damage type is sever or blunt then multiplies by the times used
       * saves results in the comboDamage var and += the totals for every sharpness of every attack
       * to later be used to update the comboDamage in the dpsTable
       */
      const colorsUsed = Object.entries(comboHitsUsed).filter((x) => x[1].length > 0);
      colorsUsed.forEach((sharpness) => {
        if (!timesUsed(thisIndex, sharpness[1])) return;
        const { PRM, PEM } =
          power.noSharpMod === false
            ? info.skills.Sharpness[capital(sharpness[0])]
            : {
                PRM: 1,
                PEM: 1,
              };
        const hitsPerAttackPerSharpness = timesUsed(thisIndex, sharpness[1]);
        // Combo=[rawMV,rawNon,rawCrit,eleNon,eleCrit,totalNon,TotalCrit,EFR,EFE,totalEffective]
        comboDamage = [
          (comboDamage[0] += Number(~~(power.rawMV * hitsPerAttackPerSharpness))),
          (comboDamage[1] += Number(~~(power.rawNon * PRM) * hitsPerAttackPerSharpness)),
          (comboDamage[2] += Number(~~(power.rawCrit * PRM) * hitsPerAttackPerSharpness)),
          (comboDamage[3] += Number(~~(power.eleNon * PEM) * hitsPerAttackPerSharpness)),
          (comboDamage[4] += Number(~~(power.eleCrit * PEM) * hitsPerAttackPerSharpness)),
          (comboDamage[5] += Number(
            ~~(power.rawNon * PRM) * hitsPerAttackPerSharpness + ~~(power.eleNon * PEM) * hitsPerAttackPerSharpness
          )),
          (comboDamage[6] += Number(
            ~~(power.rawCrit * PRM) * hitsPerAttackPerSharpness + ~~(power.eleCrit * PEM) * hitsPerAttackPerSharpness
          )),
          (comboDamage[7] += Number(
            ~~(power.efr * PRM) * hitsPerAttackPerSharpness + ~~(power.efe * PEM) * hitsPerAttackPerSharpness
          )),
        ];
      });
    }

    // Damage/meleeDamage adds sharpness to the calculations and arranges them in the array to be used for the damageContainer
    let sharpnessModifier = info.skills.Sharpness[Sharpness.selectedOptions[0].text];
    if (weaponType.value === "Bow" && power.type !== "Shot") {
      switch (BowCoating.selectedOptions[0].text) {
        case "Power":
          sharpnessModifier = "1.35";
          break;
        case "Close Range":
          sharpnessModifier = "1.32";
          break;
        case "Close Range+":
          sharpnessModifier = "1.39";
          break;
      }
    }

    const damage = [
      "replaceME",
      power.attackName,
      power.rawMV,
      `${formatNumbers(~~(power.rawNon * sharpnessModifier.PRM))} / ${formatNumbers(
        ~~(power.rawCrit * sharpnessModifier.PRM)
      )}`,
      `${formatNumbers(~~(power.eleNon * sharpnessModifier.PEM))} / ${formatNumbers(
        ~~(power.eleCrit * sharpnessModifier.PEM)
      )}`,
      `${formatNumbers(
        ~~(power.rawNon * sharpnessModifier.PRM) + ~~(power.eleNon * sharpnessModifier.PEM)
      )} / ${formatNumbers(~~(power.rawCrit * sharpnessModifier.PRM) + ~~(power.eleCrit * sharpnessModifier.PEM))}`,
      formatNumbers(
        (~~(power.efe * sharpnessModifier.PEM) + ~~(power.efr * sharpnessModifier.PRM)) * (power.ticsPer + 1)
      ),
    ];

    meleeDamage.push(damage);
    // Stats stores calculations to be used for the statsTable

    const ele = lower(power.eleType) === "none" ? 0 : power.ele;
    const stats = [
      [["Stat"], ["Raw"], [power.eleType]],
      ["Base", ~~power.baseRaw, power.baseEle],
      ["True", ~~power.raw, ~~ele],
      [
        "eTrue",
        ~~(power.raw * getCritBoost(power.aff, power.Crit).PRM * power.PRM * power.augPRM * sharpnessModifier.PRM),

        ~~(ele * getCritEle(power.aff, power.Crit).PEM * power.PEM * power.augPEM * sharpnessModifier.PEM),
      ],
      [
        "EFR/EFE",
        ~~(power.raw * getCritBoost(power.aff, power.Crit).EFR * power.PRM * power.augEFR * sharpnessModifier.PRM),

        ~~(
          ele *
          getCritEle(power.aff, power.Crit).EFE *
          power.PEM *
          power.augPEM *
          power.augEFR *
          sharpnessModifier.PEM
        ),
      ],
      ["Critical"].concat(Number(getCritBoost(power.aff).EFR).toFixed(3), Number(getCritEle(power.aff).EFE).toFixed(2)),
      ["Sharp."].concat(Object.values(Object.values(info.skills.Sharpness)[8 - Sharpness.selectedIndex])),
      ["Affinity", ~~(power.aff * 100)],
    ];

    createTable(stats);
  });
  if (weaponType.value === "Gunlance") {
    gunlanceShelling(meleeDamage, comboDamage, e);

    console.log((performance.now() - runTimeStart) / 1000);
    gunlanceShelling(532);
    // } else if (
    //   lastSharp === Sharpness.selectedIndex &&
    //   !/BowChargePlus|dropWeapon|taWikiSetBuilder/.test(e?.target?.id) // &&!weaponType.value === 'ChargeBlade'
    // ) {
    //   if (/input|inputButton/.test(e?.target?.className)) {
    //     document.getElementById("c0").textContent = `${formatNumbers(comboDamage[0])}`;
    //     document.getElementById("d0").textContent = `${formatNumbers(
    //       comboDamage[1]
    //     )} / ${formatNumbers(comboDamage[2])}`;
    //     document.getElementById("e0").textContent = `${formatNumbers(
    //       comboDamage[3]
    //     )} / ${formatNumbers(comboDamage[4])}`;
    //     document.getElementById("f0").textContent = `${formatNumbers(
    //       comboDamage[5]
    //     )} / ${formatNumbers(comboDamage[6])}`;
    //     document.getElementById("g0").textContent = `${formatNumbers(comboDamage[7])}`;

    //     console.log((performance.now() - runTimeStart) / 1000);
    //     console.log(window.event);
    //   } else {
    //     meleeDamage.splice(0, 2, [
    //       "replaceME",
    //       "Combo Damage",
    //       `${formatNumbers(comboDamage[0])}`,
    //       `${formatNumbers(comboDamage[1])} / ${formatNumbers(comboDamage[2])}`,
    //       `${formatNumbers(comboDamage[3])} / ${formatNumbers(comboDamage[4])}`,
    //       `${formatNumbers(comboDamage[5])} / ${formatNumbers(comboDamage[6])}`,
    //       `${formatNumbers(comboDamage[7])}`,
    //     ]);

    //     resetTable(meleeDamage);
    //     const runTimeEnd = performance.now();
    //     console.log((runTimeEnd - runTimeStart) / 1000);
    //     console.log(window.event);
    //   }
  } else {
    meleeDamage.splice(1, 1, [
      "replaceME",
      "Combo Damage",
      `${formatNumbers(comboDamage[0])}`,
      `${formatNumbers(comboDamage[1])} / ${formatNumbers(comboDamage[2])}`,
      `${formatNumbers(comboDamage[3])} / ${formatNumbers(comboDamage[4])}`,
      `${formatNumbers(comboDamage[5])} / ${formatNumbers(comboDamage[6])}`,
      `${formatNumbers(comboDamage[7])}`,
    ]);
    buildDamageTable(meleeDamage, "dps", e);

    console.log((performance.now() - runTimeStart) / 1000);
    console.log(window.event);
  }
}

function getRampageSkills(
  power = {
    ...info[weaponType.value].weapons[dropWeapon.value],
  }
) {
  // Applies rampage any bonuses that effect base stats
  for (let i = 0; i < 6; i++) {
    const element = document.querySelectorAll("#weaponRampage>select")[i];
    if (element.style.display === "none") break;
    const rampageSkill = info.rampage["Rampage-Up Skill"][element.value];
    if (rampageSkill !== undefined) {
      for (const stat of Object.keys(rampageSkill)) {
        power[stat] += rampageSkill[stat];
      }
    }
  }
  // For skills that change the base element
  if (!/BowGun/.test(weaponType.value)) {
    power.eleType = /Fire|Water|Thunder|Ice|Dragon|Blase|Sleep|Poison|Para/.test(weaponRampage.children[1].value)
      ? weaponRampage.children[1].value.match(/Fire|Water|Thunder|Ice|Dragon|Blase|Sleep|Poison|Para/)[0]
      : power.eleType;
  }

  return {
    ...power,
  };
}

const getWeaponMR = () => {
  const power = {
    ...info[weaponType.value].weapons[dropWeapon.value],
  };
  if (/BowGun/.test(weaponType.value)) {
    // Power Barrel
    if (document.getElementById("BowgunBarrel")?.selectedOptions[0]?.textContent === "Power") {
      power.baseRaw = ~~(power.baseRaw * (document.getElementById("Tune-Up").selectedIndex < 2 ? 1.125 : 1.15));
    }
    if (document.getElementById("BowgunBarrel")?.selectedOptions[0]?.textContent === "Long") {
      power.baseRaw = ~~(power.baseRaw * (document.getElementById("Tune-Up").selectedIndex < 2 ? 1.05 : 1.075));
    }
  }
  const attackAugVal = (+document.querySelector("output.attackAug").value / 2) * 5;

  power.baseRaw += attackAugVal;
  document.getElementById("attackResult").value = `+ ${attackAugVal}`;
  const affinityAugVal = (+document.querySelector("output.affinityAug").value / 3) * 5;

  if (power.aff) {
    power.aff += affinityAugVal;
  } else {
    power.aff = affinityAugVal;
  }
  document.getElementById("affinityResult").value = `+ ${affinityAugVal}`;
  document.getElementById("rampageResult").textContent =
    document.querySelector("output.rampageAug").value > 0 ? "+1" : "+0";
  if (power.eleType !== "None" && document.querySelector("output.elementalAug").value !== 0) {
    let inc = 0;
    // adds appropriate amount of element for different weapons
    if (weaponType.value === "GreatSword")
      inc = [0, 5, 10, 15, 20, 25, 33][document.querySelector("output.elementalAug").value];

    if (weaponType?.value === "lance" || weaponType?.value === "Gunlance")
      inc = [0, 3, 6, 10, 14, 18, 24][document.querySelector("output.elementalAug").value];

    if (!inc) inc = [0, 3, 6, 9, 12, 15, 20][document.querySelector("output.elementalAug").value];

    power.baseEle += inc;
    document.getElementById("elementalResult").value = `+ ${inc}`;
  } else {
    document.querySelector("output.elementalAug").value = 0;
  }

  power.baseAff = power.aff;
  return JSON.parse(JSON.stringify(power));
};
const getRangedSkills = (power) => {
  if (/Pierc/.test(power.attackName)) {
    power.getSkills.push(info.skills.PierceUp[document.getElementById("PierceUp").selectedIndex]);
  } else if (/Spread/.test(power.attackName)) {
    power.getSkills.push(info.skills.SpreadUp[document.getElementById("SpreadUp").selectedIndex]);
  } else if (/Normal|Rapid/.test(power.attackName)) {
    power.getSkills.push(info.skills.NormalRapidUp[document.getElementById("NormalRapidUp").selectedIndex]);
  }

  if (/RF+/.test(power.attackName)) {
    power.getSkills.push(info.skills.RapidFireUp[document.getElementById("RapidFireUp").selectedIndex]);
  }

  if (/Wyvern|Dragon Piercer/.test(power.attackName)) {
    power.getSkills.push(info.skills.SpecialAmmoBoost[document.getElementById("SpecialAmmoBoost").selectedIndex]);
  }

  if (/BowGun/.test(weaponType.value)) {
    if (weaponType.value === "HeavyBowGun") {
      if (/Sticky|Wyvern/.test(power.attackName)) {
        power.augEFR *=
          info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][
            power.attackName.match("Sticky|Wyvern")[0]
          ][1];
        power.augPRM *=
          info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][
            power.attackName.match("Sticky|Wyvern")[0]
          ][0];
      }

      if (!/snipe|heart|Cluster/.test(power.attackName)) {
        power.PRM *= info.skills.ChargeLevel[ChargeLevel.selectedIndex].PRM;
        if (power.NoEleBuff) {
          power.baseEle *= info.skills.ChargeLevel[ChargeLevel.selectedIndex].PEM;
        } else {
          power.PEM *= info.skills.ChargeLevel[ChargeLevel.selectedIndex].PEM;
        }
      }
    }

    if (
      weaponType.value === "LightBowGun" &&
      /Pierce|Spread|Normal/.test(power.attackName) &&
      document.getElementById("CriticalFirePower").selectedIndex > 0
    ) {
      if (/Normal/.test(power.attackName)) {
        power.PRM *= 1.3;
      } else if (/Spread/.test(power.attackName)) {
        power.PRM *= 1.2;
      } else if (/Pierce/.test(power.attackName)) {
        power.PRM *= 1.1;
      }
    }
  }

  if (weaponType.value === "Bow" && !/Stake/.test(power.attackName)) {
    power.getSkills.push(info.skills.BowCoating[BowCoating.selectedIndex]);
  }

  return getStats(power);
};
const getMeleeSkills = (power) => {
  if (weaponType.value === "LongSword" && !/Helm Breaker|Serene/.test(power.attackName)) {
    power.getSkills.push(info.skills.SpiritGauge[SpiritGauge.selectedIndex]);
  } else if (/Helm Breaker|Serene/.test(power.attackName)) {
    power.getSkills.push(
      /Helm Breaker/.test(power.attackName)
        ? power.getSkills.push(info.skills.Helmbreaker[Helmbreaker.selectedIndex])
        : power.getSkills.push(info.skills.SerenePose[SerenePose.selectedIndex])
    );
  }

  if (weaponType.value === "GreatSword") {
    // Applies GreatSwords Charge Level Bonus
    const thisAttack = power.attackName.match(
      /Charged Slash|Rising Slash|Wide Slash|Strong Charged Slash|True Charged Slash|Rage Slash/
    );
    if (thisAttack && document.getElementById("StrongarmStance").selectedIndex > 0) {
      power.PRM *= info.skills.StrongarmStance[thisAttack][0];
      power.PEM *= info.skills.StrongarmStance[thisAttack][1];
    }

    if (/(?<!Tackle )Lv[1-3]/.test(power.attackName)) {
      power.rawMV *= Number(`1.${power.attackName.match(/(?<=Lv)[1-3]/)[0]}`);
      power.rawMV = power.rawMV.toFixed(1);
    }
  }

  // Applies ChargeBlade specific abilities
  if (weaponType.value === "ChargeBlade") {
    if (!/3rd|(?<!Midair |Axe: )UED|(?<!Charged )Sword(?!.*Shield)/.test(power.attackName)) {
      power.getSkills.push(info.skills.savageAxe[savageAxe.selectedIndex]);
    }

    power.phialType === "Impact Phial"
      ? power.getSkills.push(info.skills.impShieldCharge[impShieldCharge.selectedIndex])
      : power.getSkills.push(info.skills.eleShieldCharge[eleShieldCharge.selectedIndex]);
  }

  return getStats(power);
};
function getDependantSkills(power) {
  power.getSkills = [];
  if ("FireWaterIceThunderDragon".includes(power.eleType)) {
    document.querySelectorAll(`.${lower(power.eleType)}`).forEach((skill) => {
      if (skill.selectedIndex > 0) {
        power.getSkills.push(info.skills[skill.id][skill.selectedIndex]);
      }
    });
  }

  if (weaponType.value.includes("Bow")) return getRangedSkills(power);
  return getMeleeSkills(power);
}

function getEnrage() {
  return document.getElementById("dropEnraged").value === "Enraged" ? info.monster[dropMon.value]?.anger_data : 1;
}
const getWeaknessExploit = (rawHZ) =>
  rawHZ >= 45
    ? info.skills.WeaknessExploit[Math.min(0, document.getElementById("WeaknessExploit").selectedIndex)].aff
    : 0;
function getInitialStats(power, type) {
  if (comboTracker[0] === null) {
    comboTracker = [];
  }

  power.baseRaw += power.Draw === true ? Number(document.getElementById("PunishingDraw").value) : 0;
  power.BR = 0;
  power.BRM = 1;
  power.PRM = 1;
  power.BEM = 1;
  power.BE = 0;
  power.PEM = 1;
  const usedSkills = {};
  let skills = [];
  power.getSkills = [];
  Object.values(info.types[type]).forEach((skill) => {
    if (
      !document.getElementById([skill])?.style.display.includes("none") &&
      document.getElementById([skill]).selectedIndex &&
      !usedSkills[skill]
    )
      power.getSkills.push(info.skills[skill][document.getElementById([skill]).selectedIndex]);
    usedSkills[skill] = 1;
  });

  // Applies Demon Ammo if selected and damage type is sever or blunt
  power.PRM *= document.getElementById("DemonAmmo").checked && /(Sever|Blunt)/.test(power.type) ? 1.1 : 1;
  document.querySelectorAll("input.skillButton").forEach((thisInput) => {
    if (thisInput.checked && info.skills[thisInput.id] && !usedSkills[thisInput.id]) {
      power.getSkills.push(info.skills[thisInput.id]);
      usedSkills[thisInput.id] = 1;
    } else if (!info.skills[thisInput.id]) console.log(thisInput.id);
  });

  document.getElementById("enrageDisplay").textContent = `${~~(getEnrage() * 100)}%`;
  if (document.getElementById("dropEnraged").value === "Enraged") {
    skills.push("Agitator");
    power.PEM *= getEnrage();
    power.PRM *= getEnrage();
  }

  if (weaponType.value === "DualBlades") {
    power.BEM *= info.skills.ArchdemonMode[document.getElementById("ArchdemonMode").selectedIndex].BEM;
    power.BEM *= !/\[Feral Demon Mode\]/.test(power.attackName)
      ? info.skills.DemonMode[document.getElementById("DemonMode").selectedIndex].BEM
      : 1;
    power.BRM *= !/\[Demon Mode\]/.test(power.attackName)
      ? info.skills.FeralDemonMode[document.getElementById("FeralDemonMode").selectedIndex].BRM
      : 1;
    power.aff += document.getElementById("weaponRampage0").value === "Hellion Mode" ? 20 : 0;
  }

  if (weaponType.value === "Bow") {
    skills = skills.concat("UpperCrit", "HerculesDraw");
  }

  // skills = power.getSkills.filter(isUnique);

  skills.forEach((skillName) => {
    if (!usedSkills[skillName] && document.getElementById([skillName]).selectedIndex) {
      usedSkills[skillName] = 1;
      power.getSkills.push(info.skills[skillName][document.getElementById([skillName]).selectedIndex]);
    }
  });

  getStats(power);
  // Applies Water Blight if selected appropriate to the hzv
  if (document.getElementById("weaponRampage0").value === "Kushala Daora Soul") {
    power.aff += 15;
  }

  power.aff += getWeaknessExploit(getRawHZ(type));
  power.aff = Math.min(power.aff, 100) / 100;

  return {
    ...power,
  };
}

function updateComboTracker() {
  if (!document.getElementsByClassName("inputs")?.length) return;
  if (!Number.isNaN(Number(window?.event?.target.id)) && window?.event?.target.id !== "0") {
    // If value entered in the e?.target combo input > amount stored in comboTracker [] adds attack id to the end of the comboTracker until they are ===
    let difference =
      document.querySelectorAll(".inputs")[window?.event?.target.id].value - timesUsed(window?.event?.target.id);
    while (difference > 0) {
      comboTracker.push(window.event.target.id);
      --difference;
    }

    // If value entered in the e.target combo input < amount stored in comboTracker [] removes the last instance of this attack id from the comboTracker until they are ===
    while (difference < 0) {
      comboTracker.splice(comboTracker.lastIndexOf(window?.event?.target.id), 1);
      ++difference;
    }
  }
}

function updateComboDisplay() {
  document.querySelectorAll("li.comboHits").forEach((x) => x.remove());
  let comboHit;
  comboTracker.forEach((index) => {
    comboHit = document.createElement("li");
    comboHit.className = `${index} comboHits`;
    comboHit.setAttribute("draggable", "true");
    comboHit.textContent = document.querySelector(`td#b${[index]}>output`).textContent;
    document.getElementById("comboCountDisplay").append(comboHit);
  });
}

// Finds HitsOfSharpness current sharpness as well as what combo hits were used how many times per color
// function TotalHitsOfSharpUsed(power) {
const getInitialSharpness = () => {
  let pointsFor = document.getElementById("Handicraft").selectedIndex * 10;
  const { sharpness, handicraft } = getWeaponMR();
  const quriousSharp = (document.querySelector("#augToggle > div:nth-child(5) > output.sharpnessAug").value / 3) * 10;
  sharpness.red -= quriousSharp;
  const startingIndex = Object.values(sharpness).indexOf(0) === -1 ? 6 : Object.values(sharpness).indexOf(0) - 1;
  sharpness[Object.keys(sharpness)[startingIndex]] += quriousSharp;
  for (let i = startingIndex; pointsFor; ++i) {
    const min = Math.min(pointsFor, handicraft.shift());
    sharpness[Object.keys(sharpness)[i < 0 ? 6 : i]] += min;
    pointsFor -= min;
  }
  return sharpness;
};
function applySharpnessSkills(
  aff,
  totalSharp = {
    ...getInitialSharpness(),
  }
) {
  let totalSharpnessCapacity = [];
  const razorSharp = info.skills.RazorSharp[document.getElementById("RazorSharp").selectedIndex].Sharp;
  const MT = info.skills[`MastersTouch`][document.getElementById(`MastersTouch`).selectedIndex].Sharp * aff;
  // Applies the extra hits of sharpness from the Masters Touch skill;
  const mTBonus =
    aff > 0 && document.getElementById(`MastersTouch`).selectedIndex > 0
      ? sharpnessReduction(MT) * sharpnessReduction(razorSharp)
      : sharpnessReduction(razorSharp);
  totalSharpnessCapacity = Object.entries(totalSharp).map((sharp) => ~~(Number(sharp[1]) * Number(mTBonus)));
  return totalSharpnessCapacity;
}

function listOfAllComboHits() {
  let [...listOfEachAttack] = comboTracker;
  if (comboTracker[0] !== undefined && comboTracker[0] !== null) {
    let comboMulti = document.getElementsByClassName("inputComboRepeat")[0].value;
    // For each pont in the comboMultiplier input, adds another comboTracker [] to the listOfEachAttack
    while (comboMulti > 1) {
      listOfEachAttack = listOfEachAttack.concat(comboTracker);
      --comboMulti;
    }

    return listOfEachAttack;
  }
}

function getComboHitsAndSetSharpness(affinity = 0) {
  const [remainingSharp, comboHitsPerColor, total] = hitsPerColorSharp(affinity);

  document.getElementById("Sharpness").selectedIndex = 6 - remainingSharp.lastIndexOf(0);
  remainingSharp.forEach((count, index) => {
    document.querySelector("#sharpnessContainer").children[6 - index].style.width = `${(count / total) * 100}%`;
    document.querySelector("#sharpnessContainer").children[6 - index].textContent = count < 0.1 ? "" : ~~count;
  });
  return comboHitsPerColor;
}

// function hitsPerColorSharp(affinity = 0, everyHitsAttackIndex = listOfAllComboHits()) {
//   // array to hold the list of all combo hits per color sharpness
//   const comboHitsPerColor = {
//     purple: [],
//     white: [],
//     blue: [],
//     green: [],
//     yellow: [],
//     orange: [],
//     red: [],
//   };
//   // applies sharpness reduction skills...bow does not use sharpness
//   const maxHitsPerColor =
//     weaponType.value !== "Bow" ? applySharpnessSkills(affinity).reverse() : [0, 0, 0, 1, 0, 0, 0, 0];
//   const sharpnessCapacity = Object.values(maxHitsPerColor).reduce((a, b) => a + b);
//   if (everyHitsAttackIndex) {
//     const attackKeys = Object.keys(getUsedAttacks());
//     everyHitsAttackIndex.forEach((thisAttackIndex) => {
//       const thisAttackKey = attackKeys[thisAttackIndex];
//       const hitsPer = getHitsPerTic(thisAttackKey, thisAttackIndex);
//       if (weaponType.value !== "Gunlance" || thisAttackIndex < 27) {
//         for (let i = 0; i < getAttacks()[thisAttackKey].ticsPer + 1; i++) {
//           if (maxHitsPerColor[0] > 0.1) {
//             comboHitsPerColor.purple.push(thisAttackIndex);
//             maxHitsPerColor[0] -= hitsPer;
//             continue;
//           }
//           if (maxHitsPerColor[1] > 0.1) {
//             comboHitsPerColor.white.push(thisAttackIndex);
//             maxHitsPerColor[1] -= hitsPer;
//             continue;
//           }
//           if (maxHitsPerColor[2] > 0.1) {
//             comboHitsPerColor.blue.push(thisAttackIndex);
//             maxHitsPerColor[2] -= hitsPer;
//             continue;
//           }
//           if (maxHitsPerColor[3] > 0.1) {
//             comboHitsPerColor.green.push(thisAttackIndex);
//             maxHitsPerColor[3] -= hitsPer;
//             continue;
//           }
//           if (maxHitsPerColor[4] > 0.1) {
//             comboHitsPerColor.yellow.push(thisAttackIndex);
//             maxHitsPerColor[4] -= hitsPer;
//             continue;
//           }
//           if (maxHitsPerColor[5] > 0.1) {
//             comboHitsPerColor.orange.push(thisAttackIndex);
//             maxHitsPerColor[5] -= hitsPer;
//             continue;
//           }
//           if (maxHitsPerColor[6] > 0.1) {
//             comboHitsPerColor.red.push(thisAttackIndex);
//             maxHitsPerColor[6] -= hitsPer;
//             continue;
//           }
//         }
//       }
//     });
//   }

//   return [maxHitsPerColor, comboHitsPerColor, sharpnessCapacity];
// }
function hitsPerColorSharp(affinity = 0, everyHitsAttackIndex = listOfAllComboHits()) {
  // array to hold the list of all combo hits per color sharpness
  const comboHitsPerColor = {
    purple: [],
    white: [],
    blue: [],
    green: [],
    yellow: [],
    orange: [],
    red: [],
  };
  // applies sharpness reduction skills...bow does not use sharpness
  const maxHitsPerColor =
    weaponType.value !== "Bow" ? applySharpnessSkills(affinity).reverse() : [0, 0, 0, 1, 0, 0, 0, 0];
  const sharpnessCapacity = Object.values(maxHitsPerColor).reduce((a, b) => a + b);
  if (everyHitsAttackIndex) {
    const attackKeys = Object.keys(getUsedAttacks());
    let sharpnessIndex = 0;
    const colors = Object.keys(comboHitsPerColor);
    const listOfAllAttacks = getAttacks();
    attackLoop: for (let thisAttackIndex of everyHitsAttackIndex) {
      const thisAttackKey = attackKeys[thisAttackIndex];
      let ticsPerAttack = listOfAllAttacks[thisAttackKey].ticsPer + 1;
      let sharpUsedPerTic = getHitsPerTic(listOfAllAttacks[thisAttackKey].hitsOfSharp, thisAttackIndex);
      if (weaponType.value !== "Gunlance" || thisAttackIndex < 27) {
        while (ticsPerAttack--) {
          if (maxHitsPerColor[sharpnessIndex] < 0.1) {
            if (++sharpnessIndex === 7) break attackLoop;
          }
          comboHitsPerColor[colors[sharpnessIndex]].push(thisAttackIndex);
          maxHitsPerColor[sharpnessIndex] -= sharpUsedPerTic;
        }
      }
    }
  }

  return [maxHitsPerColor, comboHitsPerColor, sharpnessCapacity];
}

function getHitsPerTic(hitsOfSharp, index) {
  if (document.getElementById("ProtectivePolish").checked || weaponType.value === "Bow") {
    return 0;
  }
  if (weaponType.value !== "Gunlance" || index > 27) {
    return weaponType.value !== "DualBlades" ? hitsOfSharp : hitsOfSharp / 3;
  }

  return 1;
}

function getRemainingSkills(power, weapon = getWeaponMR()) {
  [power.augEFR, power.augPRM, power.augPEM] = [1, 1, 1];
  power.augPEM *=
    document.getElementById("weaponRampage0").value === "Valstrax Soul" && power.eleType === "Dragon" ? 1.2 : 1;
  // Applies Dulling Strike to Base raw depending on sharpness and if selected
  [power.augEFR, power.augPRM] =
    document.getElementById("weaponRampage0").value === "Dulling Strike" && Sharpness.selectedIndex < 5
      ? [1.02, 1.2]
      : [power.augEFR, power.augPRM];

  // Anti-Species
  const species = Object.values(info.monster[dropMon.value]?.species);
  if (
    species &&
    ((species[1] !== "Invalid" && document.querySelector("#weaponRampage0").value === "Wyvern Exploit") ||
      document.querySelector("#weaponRampage0").value.includes(species[2]) ||
      (species[3] !== "Invalid" && document.querySelector("#weaponRampage0").value === "Fanged Exploit"))
  ) {
    power.PRM *= 1.05;
  }

  if (/blight Exploit/.test(document.getElementById("weaponRampage0").value)) {
    power.PRM *= 1.1;
  }

  if (document.getElementById("weaponRampage0").value === "Magnamalo Soul") {
    power.BR += 12;
  }

  if ((power.type === "IgnoreHZV" && weaponType.value === "LightBowGun") || weaponType.value === "ChargeBlade") {
    power.augEFR *= info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][1];
    power.augPRM *= info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][0];

    if (
      weaponType.value === "SwitchAxe" &&
      /Sword|ZSD|ED/.test(power.attackName) &&
      power.phialType === "Impact Phial"
    ) {
      power.BRM *= 1.15;
    }

    if (
      weaponType.value === "SwitchAxe" &&
      /Sword|Elemental|ED/.test(power.attackName) &&
      power.phialType === "Elemental Phial"
    ) {
      power.BEM *= 1.45;
    }
  }
  // If elemental exploit is selected && power.eleHZV >= 25 applies elemental exploit

  if (power.eleType !== "None") {
    power.PEM *=
      weapon.rampageSlots === 0 &&
      document.getElementById("weaponRampage0").value === "Elemental Exploit" &&
      getEleHZ(power.eleType) >= 25
        ? 1.3
        : 1;
    power.PEM *=
      weapon.rampageSlots !== 0 &&
      document.getElementById("weaponRampage0").value === "Element Exploit" &&
      getEleHZ(power.eleType) >= 25 &&
      lower(power.eleType) !== "none"
        ? 1.15
        : 1;
    power.PEM *=
      getEleHZ(power.eleType) >= 20 && lower(power.eleType) !== "none"
        ? info.skills.ElementExploit[ElementExploit.selectedIndex].PEM
        : 1;
  }

  if (weaponType.value === "ChargeBlade" || weaponType.value === "SwitchAxe") {
    power.BRM *= /Morph Slash|Condensed Spinning|Up Roundslash/.test(power.attackName)
      ? info.skills.RapidMorph[RapidMorph.selectedIndex].BRM
      : 1;
  }
  // Applies Bludgeoner to Base raw depending on sharpness and selectedIndex

  if (Sharpness.selectedIndex > 0 && Bludgeoner.selectedIndex > 0) {
    power.BRM *= Bludgeoner.selectedIndex === 1 && Sharpness.selectedIndex < 4 ? [1.05] : [1];
    power.BRM *= Bludgeoner.selectedIndex === 2 && Sharpness.selectedIndex < 4 ? [1.1] : [1];
    power.BRM *= Bludgeoner.selectedIndex === 3 && Sharpness.selectedIndex < 5 ? [1.1] : [1];
  }

  if (
    !/Wyvern/.test(power.attackName) &&
    Object.keys(info.skills.ChargeMaster).includes(weaponType.value) &&
    power.ChargeMaster === true
  ) {
    power.BEM *= info.skills.ChargeMaster[weaponType.value][ChargeMaster.selectedIndex].BEM;
  } else if (power.ChargeMaster === true && power.NoEleBuff === true) {
    power.baseEle *= /Wyvern/.test(power.attackName)
      ? info.skills.ChargeMaster["HeavyBowGun Wyvern"][ChargeMaster.selectedIndex].BEM
      : info.skills.ChargeMaster[weaponType.value][ChargeMaster.selectedIndex].BEM;
  }
  // Applies sharpnessModifier to sever and blunt type attacks that use at least one hit of sharpness. This makes sure attacks like tackle or Bow skills don't get a sharpness modifier.

  const sharpnessModifier = [];
  [sharpnessModifier.PRM, sharpnessModifier.PEM] =
    power.noSharpMod === false && /sever|blunt/.test(lower(power.type))
      ? [JSON.parse(Sharpness.value).PRM, JSON.parse(Sharpness.value).PEM]
      : [1, 1];
  // Adds minds eye
  power.PRM *=
    ~~(25 / sharpnessModifier.PRM) >= getRawHZ(power.type) ? info.skills.MindsEye[MindsEye.selectedIndex].PRM : 1;

  /*
   * Brutal Strike
   * Converts -Aff to a positive then * chance to proc * dmg modifier then
   * adds the -dps to the +dps gain to find overall dps difference
   */

  if (
    weapon.rampageSlots === 0 &&
    document.getElementById("weaponRampage0").value === "Brutal Strike" &&
    power.aff < 0
  ) {
    power.efrMulti = 1 + power.aff * -1 * 0.2 * 1.5 - power.aff * -1 * 0.8 * 0.75;
    power.critBoost = 1.5;
  } else if (
    weapon.rampageSlots !== 0 &&
    document.getElementById("weaponRampage0").value === "Brutal Strike" &&
    power.aff < 0
  ) {
    power.efrMulti = 1 + power.aff * -1 * 0.25 * 2 - power.aff * -1 * 0.75 * 0.75;
    power.critBoost = 1.5;
  }

  if (power.type === "Shot") {
    power.augPRM *= info.skills.Marksman[Marksman.selectedIndex][0];
    power.augEFR *= info.skills.Marksman[Marksman.selectedIndex][1];
  }

  if (!power.NoSneak) {
    power.augPRM *= info.skills.SneakAttack[SneakAttack.selectedIndex].PRM;
    power.augEFR *= info.skills.SneakAttack[SneakAttack.selectedIndex].PRM;
  }

  return {
    ...power,
  };
}

function getCritEle(affinity, canCrit = true) {
  return canCrit
    ? {
        PEM: info.skills.CriticalElement[CriticalElement.selectedIndex].PEM,
        EFE: 1 + (info.skills.CriticalElement[CriticalElement.selectedIndex].PEM - 1) * affinity,
      }
    : {
        PEM: 1,
        EFE: 1,
      };
}

function getCritBoost(affinity, canCrit = true) {
  return canCrit
    ? {
        PRM: info.skills.CriticalBoost[CriticalBoost.selectedIndex].PRM,
        EFR: 1 + (info.skills.CriticalBoost[CriticalBoost.selectedIndex].PRM - 1) * affinity,
      }
    : {
        PRM: 1,
        EFR: 1,
      };
}

function damageCalculations(power) {
  if (power.Raw === false) {
    [power.raw, power.rawNon, power.efr, power.rawCrit] = [0, 0, 0, 0];
  } else {
    power.raw = Math.min(
      ~~(
        ~~(~~power.baseRaw * power.BRM + power.BR + 0.1) *
        (document.getElementById("HuntingHornAttack").checked ? 1.1 : 1)
      ),
      2600
    );
    const rawFormula = (power.raw * power.PRM * getRawHZ(lower(power.type)) * power.rawMV) / 10000;
    power.rawNon = ~~(0.5 + Math.max(1, rawFormula * power.augPRM));
    power.efr = ~~(0.5 + Math.max(1, rawFormula * power.augEFR * getCritBoost(power.aff, power.Crit).EFR));
    power.rawCrit = ~~(0.5 + Math.max(1, rawFormula * power.augPRM * getCritBoost(power.aff, power.Crit).PRM));
  }

  if (Object.prototype.hasOwnProperty.call(power, "NoEleBuff") && power.NoEleBuff === true) {
    [power.ele, power.eleNon, power.efe, power.eleCrit] = [power.baseEle, power.baseEle, power.baseEle, power.baseEle];
  } else if (power.Ele === false || (power.eleType === "None" && !/BowGun/.test(weaponType.value))) {
    [power.ele, power.eleNon, power.efe, power.eleCrit] = [0, 0, 0, 0];
  } else {
    power.eleAmmo = /BowGun/.test(weaponType.value) && power.eleType !== "None" ? 1 + power.raw / 100 : 1;
    power.ele = ~~(Math.min(power.baseEle * power.BEM + power.BE, 365) * power.eleAmmo + 0.1);
    const eleFormula = power.ele * power.PEM * (getEleHZ(power.eleType) / 100) * power.eleMV * power.augPEM;
    power.eleNon = ~~(0.5 + Math.max(1, eleFormula));
    power.efe = ~~(0.5 + Math.max(1, eleFormula * getCritEle(power.aff, power.Crit).EFE));
    power.eleCrit = ~~(0.5 + Math.max(1, eleFormula * getCritEle(power.aff, power.Crit).PEM));
  }

  return {
    ...power,
  };
}

const sharpnessReduction = (reduction) => 1 / (1 - reduction);

function gunlanceShelling(currentDamage, comboDamage, power, e) {
  const regex = new RegExp(`${getWeaponMR().shellingType} Lv${getWeaponMR().shellingLevel}`);
  let Raw = 1;
  let EFR = 1;
  Object.entries(getAttacks()).forEach((attack, index) => {
    if (regex.test(attack[0])) {
      Raw = ~~(
        attack[1].rawMV *
        info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][0] *
        info.skills.Artillery[Artillery.selectedIndex].BRM
      );
      EFR = ~~(
        attack[1].rawMV *
        info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][1] *
        info.skills.Artillery[Artillery.selectedIndex].BRM
      );
      const final = [
        "replaceME",
        attack[0],
        0,
        `${Raw} / ${Raw}`,
        `${attack[1].baseEle} / ${attack[1].baseEle}`,
        `${(Raw + attack[1].baseEle) * (attack[1].ticsPer + 1)} / ${
          (Raw + attack[1].baseEle) * (attack[1].ticsPer + 1)
        }`,
        EFR,
        attack[1].baseEle,
        (EFR + attack[1].baseEle) * (attack[1].ticsPer + 1),
      ];
      currentDamage.push(final);
      comboDamage[0] += 0;
      comboDamage[1] += Raw * timesUsed(index + 27);
      comboDamage[2] += Raw * timesUsed(index + 27);
      comboDamage[3] += attack[1].baseEle * timesUsed(index + 27);
      comboDamage[4] += attack[1].baseEle * timesUsed(index + 27);
      comboDamage[5] += (Raw + attack[1].baseEle) * (power.ticsPer + 1) * timesUsed(index + 27);
      comboDamage[6] += (Raw + attack[1].baseEle) * (power.ticsPer + 1) * timesUsed(index + 27);
      comboDamage[7] += (EFR + attack[1].baseEle) * (power.ticsPer + 1) * timesUsed(index + 27);
    }
  });
  if (!/Inputs|inputButton/.test(window?.event?.target.className)) {
    buildDamageTable(currentDamage, "dps", e);
  }

  c0.innerHTML = `${formatNumbers(comboDamage[0])}`;
  d0.innerHTML = `${formatNumbers(comboDamage[1])} / ${formatNumbers(comboDamage[2])}`;
  e0.innerHTML = `${formatNumbers(comboDamage[3])} / ${formatNumbers(comboDamage[4])}`;
  f0.innerHTML = `${formatNumbers(comboDamage[5])} / ${formatNumbers(comboDamage[6])}`;
  g0.innerHTML = `${formatNumbers(comboDamage[7])}`;
}
function createTable(stats) {
  let table = document.createElement("table");
  let string = "";
  for (let i = 0; i < stats.length; i++) {
    string += "<tr>";
    for (let j = 0; j < stats[i].length; j++) {
      string += "<td>" + stats[i][j] + "</td>";
    }
    string += "</tr>";
  }
  table.innerHTML = string;
  document.querySelector("#statsTableDiv").replaceChildren(table);
}
function buildDamageTable(myDamage, id) {
  const currentAmmoTableStyle =
    !document.getElementById("ammoTable").classList.contains("augInvis") && !weaponType.value.includes("BowGun");
  const currentDamageTableStyle =
    document.getElementById("dpsTable").classList.contains("augInvis") || !weaponType.value.includes("BowGun");
  const inputs = /gray/.test(document.getElementById("filterCombo").className)
    ? document.querySelectorAll(".a")
    : document.querySelectorAll(".a:not(.gray)");
  let k = 0;
  const myHeader = document.querySelector(`#${id}Head`);
  const myBody = document.querySelector(`#${id}Body`);
  const table = document.createElement("table");
  const tHead = document.createElement("thead");

  if (/BowGun/.test(weaponType.value) && id !== "stats") {
    tHead.className = "tableRowRanged";
  } else if (id !== "stats") {
    tHead.className = "tableRowMelee";
  }
  tHead.id = `${id}Head`;
  const headerRow = document.createElement("tr");
  const tBody = document.createElement("tbody");
  tBody.id = `${id}Body`;

  const myHeaders = myDamage.splice(0, 1);
  myHeaders[0].forEach((headerText) => {
    const header = document.createElement("th");
    const textNode = document.createTextNode(headerText);

    header.appendChild(textNode);
    headerRow.appendChild(header);
  });

  tHead.appendChild(headerRow);
  myHeader.replaceWith(tHead);
  myDamage.forEach((attack) => {
    const row = document.createElement("tr");
    if (/BowGun/.test(weaponType.value) && id !== "stats") {
      row.className = "tableRowRanged";
    } else if (id !== "stats") {
      row.className = "tableRowMelee";
    }
    Object.values(attack).forEach((text) => {
      if (text === "replaceME") {
        if (
          document.getElementById("previousWeaponType").value === weaponType.value &&
          inputs.length > 0 &&
          ((window?.event?.target === dropWeapon && weaponType.value !== "ChargeBlade") ||
            window?.event?.target !== dropWeapon) &&
          window?.event?.target.id !== "BowChargePlus" &&
          ((weaponType.value === "Bow" && document.getElementById("previousWeapon").value === dropWeapon.value) ||
            weaponType.value !== "Bow")
        ) {
          row.appendChild(inputs[k]);
          ++k;
        } else {
          const cell = document.createElement("td");
          const adjuster = document.createElement("input");

          adjuster.type = "Number";
          adjuster.className = `Combo skill ${k}`;
          adjuster.Max = 20;
          if (weaponType.value === "Bow" && document.getElementById("previousWeapon").value !== dropWeapon.value) {
            comboTracker = [];
            updateComboDisplay();
          }

          if (k === 0) {
            adjuster.id = "inputComboRepeat";
            adjuster.Min = 1;
            adjuster.value = 1;
            adjuster.className = "inputComboRepeat hitsOfSharpInputs inputs";
          } else {
            adjuster.id = k;
            adjuster.className = "inputs hitsOfSharpInputs";
            adjuster.Min = 0;
            adjuster.value = 0;
          }

          ++k;
          cell.appendChild(adjuster);
          row.appendChild(cell);
        }
      } else {
        const cell = document.createElement("td");
        const textNode = document.createTextNode(text);

        cell.appendChild(textNode);
        row.appendChild(cell);
      }
    });
    tBody.appendChild(row);
    myBody.replaceWith(tBody);
  });
  table.setAttribute("id", `${id}Table`);

  tBody.className = /(BowGun)/.test(weaponType.value) ? "rangedTable" : "meleeTable";
  document.getElementById("damageContainer").className = /(BowGun)/.test(weaponType.value)
    ? "rangedContainer"
    : "meleeContainer";

  document.getElementById("ammoTable").classList.toggle("augInvis", currentAmmoTableStyle);
  document.getElementById("dpsTable").classList.toggle("augInvis", !currentDamageTableStyle);

  if (id !== "stats" && id !== "ammo") {
    const [len, ...column] = /BowGun/.test(weaponType.value)
      ? [k, "a", "b", "c", "d", "e", "f", "g", "h"]
      : [k, "a", "b", "c", "d", "e", "f", "g"];

    if (/BowGun/.test(weaponType.value) && !/BowGun/.test(document.getElementById("previousWeaponType").value)) {
      document.querySelectorAll("#comboCountContainer").forEach((menu) => (menu.style.display = "none"));
    } else if (!/BowGun/.test(weaponType.value) && /BowGun/.test(document.getElementById("previousWeaponType").value)) {
      document.querySelectorAll("#comboCountContainer").forEach((menu) => (menu.style.display = ""));
    }

    document.getElementById("previousWeapon").value = dropWeapon.value;
    document.getElementById("previousWeaponType").value = weaponType.value;
    for (let i = 0; i < len; ++i) {
      column.forEach((letter, index) => {
        document.getElementById(`${id}Body`).children[i].children[index].id = letter + i;
        document.getElementById(`${id}Body`).children[i].children[index].className = `${letter} ${i}`;
      });
    }

    if (
      !weaponType.value.includes("BowGun") // !window.event?.target?.classList.contains('inputButton')
    ) {
      document.querySelectorAll(`tbody#${id}Body>tr>td:nth-child(2)`).forEach((element, index) => {
        const cell = document.createElement("td");
        cell.innerHTML = `<button type="button" aria-pressed="false" id="${index}" class="inputButton dec"
                    >&#8681</button><button type="button" aria-pressed="false" id="${index}" class="inputButton inc">&#8679</button><output class="label">${element.textContent}</output>`;
        cell.id = `b${index}`;
        cell.className = `b ${index} inputContainer`;
        element.replaceWith(cell);
      });
    }
  }

  if (/blue/.test(filterCombo.className)) {
    document.querySelectorAll(".a").forEach((x, index) => {
      if (document.querySelectorAll(`.${index}`)[0].style.display === "none") {
        document.querySelectorAll(`.${index}`).forEach((menu) => (menu.style.display = "none"));
      }
    });
  }
}
const setSpawn = () => {
  document.querySelectorAll("#spawnArea>output").forEach((x) => x.remove());
  info.quest[dropQuest.value].target.forEach((x) => {
    if (x.name === dropMon.value) {
      x.spawn.forEach((z) => {
        const spawn = document.createElement("output");
        spawn.textContent = `Spawn Area ${z.block} ${z.lot}%`;
        document.getElementById("spawnArea").append(spawn);
      });
    }
  });
};
function monChartold() {
  setSpawn();
  if (dropQuest.value !== "") {
    let mon = [];
    const type = /Bow/.test(weaponType.value) ? "shot" : weaponType.value[0] === "H" ? "blunt" : "sever";

    const headers = ["Hit Zone", "Sever", "Blunt", "Shot", "Fire", "Water", "Thunder", "Ice", "Dragon"];
    const table = document.createElement("table");
    const myTable = document.querySelector("#monTable");
    const headerRow = document.createElement("tr");

    headers.forEach((headerText) => {
      const header = document.createElement("th");
      const textNode = document.createTextNode(headerText);
      header.appendChild(textNode);
      headerRow.appendChild(header);
    });

    table.appendChild(headerRow);
    mon = Object.entries(info.monster[dropMon.value].parts).sort((b, a) => {
      if (
        a[1][type] === b[1][type] &&
        document.querySelector("#statsHead > tr > th:nth-child(4)").textContent !== "none"
      ) {
        return (
          a[1][lower(document.querySelector("#statsHead > tr > th:nth-child(4)").textContent)] -
          b[1][lower(document.querySelector("#statsHead > tr > th:nth-child(4)").textContent)]
        );
      }

      return a[1][type] - b[1][type];
    });
    mon.forEach((element) => {
      const row = document.createElement("tr");
      const HZV = [`${element[1].part} ${element[1].state}`].concat(Object.values(element[1]).splice(3, 8));

      for (let j = 0; j < 9; ++j) {
        const cell = document.createElement("td");
        // Adds demon ammo and water blight to displayed HZV
        if (j !== 0) {
          HZV[j] =
            WaterBlight.checked && /1|2|3/.test(j)
              ? Math.min(100, ~~(Math.max(HZV[j], HZV[j] * 0.63 + 22.2) + 3))
              : +HZV[j];

          if (+HZV[j] < 14) {
            cell.setAttribute("class", "F");
          } else if (+HZV[j] < 15) {
            cell.setAttribute("class", "C");
          } else if (+HZV[j] < 45) {
            cell.setAttribute("class", "B");
          } else if (+HZV[j] < 65) {
            cell.setAttribute("class", "A");
          } else if (+HZV[j] >= 65) {
            cell.setAttribute("class", "S");
          }

          HZV[j] = ~~HZV[j];
        }

        const textNode = document.createTextNode(HZV[j]);
        cell.appendChild(textNode);
        row.appendChild(cell);
      }

      table.appendChild(row);
    });
    table.setAttribute("id", "monTable");
    myTable.replaceWith(table);
    Object.values(document.getElementById("monTableContainer").children).forEach((ele) => {
      Object.values(ele.children).forEach((row) => {
        row.className = "tableRow";
      });
    });
  }
}
function monChart() {
  setSpawn();
  if (dropQuest.value !== "") {
    const type = /Bow/.test(weaponType.value) ? "shot" : weaponType.value[0] === "H" ? "blunt" : "sever";

    const headers = ["Hit Zone", "Sever", "Blunt", "Shot", "Fire", "Water", "Thunder", "Ice", "Dragon"];
    const table = document.createElement("table");
    const myTable = document.querySelector("#monTable");

    let mon = info.monster[dropMon.value].parts.sort((b, a) => {
      if (a[type] === b[type] && getWeaponMR().eleType) {
        return a[getWeaponMR().eleType] - b[getWeaponMR().eleType];
      }

      return a[type] - b[type];
    });

    // Create header row
    const headerRow = document.createElement("tr");
    headers.forEach((headerText) => {
      const header = document.createElement("th");
      const textNode = document.createTextNode(headerText);
      header.appendChild(textNode);
      headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Create data rows

    mon.forEach((monPart) => {
      const row = document.createElement("tr");
      for (let j = 0; j < 9; ++j) {
        let HZV = j === 0 ? `${monPart.part} ${monPart.state}` : monPart[lower(headers[j])];

        const cell = document.createElement("td");
        if (j !== 0) {
          HZV = WaterBlight.checked && j < 4 ? Math.min(100, ~~(Math.max(HZV, HZV * 0.63 + 22.2) + 3)) : +HZV;
          if (+HZV < 14) {
            cell.setAttribute("class", "F");
          } else if (+HZV < 15) {
            cell.setAttribute("class", "C");
          } else if (+HZV < 45) {
            cell.setAttribute("class", "B");
          } else if (+HZV < 65) {
            cell.setAttribute("class", "A");
          } else if (+HZV >= 65) {
            cell.setAttribute("class", "S");
          }

          HZV = ~~HZV;
        }

        const textNode = document.createTextNode(HZV);
        cell.appendChild(textNode);
        row.appendChild(cell);
      }
      table.appendChild(row);
    });
    table.setAttribute("id", "monTable");
    myTable.replaceWith(table);
    // Object.values(document.getElementById("monTableContainer").children).forEach((ele) => {
    // Object.values(ele.children).forEach((row) => {
    // row.className = "tableRow";
    // });
    // });
  }
}
document.querySelectorAll("select.demon").forEach((x) => {
  x.addEventListener("change", (e) => {
    if (e?.target.selectedIndex > 0) {
      document.querySelectorAll(`.demon:not(#${e?.target.id})`)[0].selectedIndex = 0;
      document.querySelectorAll(`.demon:not(#${e?.target.id})`)[1].selectedIndex = 0;
    }
  });
});
document.querySelectorAll(`#${dropWeapon.id}, #${weaponType.id}`).forEach((x) => {
  x.addEventListener("change", (e) => {
    if (e.target === weaponType || weaponType.value === "ChargeBlade") {
      classChange();
    }
  });
});
document.querySelectorAll(`#${dropWeapon.id}, #${weaponType.id}`).forEach((x) => {
  x.addEventListener("change", () => {
    if (weaponType.value === "Bow") {
      document.querySelectorAll("#BowCoating>option").forEach((x) => x.remove());
      const thisArr = [];
      getWeaponMR().coatings.forEach((thisCoating) => {
        const thisOption = document.createElement("option");
        thisOption.textContent = thisCoating;
        document.getElementById("BowCoating").append(thisOption);
        thisArr.push(info.skills[thisCoating]);
      });
      info.skills.BowCoating = thisArr;
    }
  });
});

function classChange() {
  if (!Object.keys(info)) return;

  if (document.getElementsByClassName("inputs").length > 0) comboReset();

  // Changes Burst value depending on weapon
  switch (weaponType.value) {
    case "DualBlades":
      info.skills.Burst = info.skills.BurstDualBlades;
      break;
    case "Bow":
      info.skills.Burst = info.skills.BurstBow;
      break;
    case "LightBowGun":
      info.skills.Burst = info.skills.BurstBowGun;
      break;
    case "HeavyBowGun":
      info.skills.Burst = info.skills.BurstBowGun;
      break;
    default:
      info.skills.Burst = info.skills.BurstStandard;
      break;
  }

  info.skills.Bombardier = /Gun|Charge/.test(weaponType.value) ? info.skills.BombardierSource[weaponType.value] : [];

  document.querySelectorAll(`.skill:not(.${weaponType.value})`).forEach((x) => (x.selectedIndex = 0));
  document.querySelectorAll(".classSpecific").forEach((div) => {
    div.style.display = "";
    div.parentElement.style.display = "";

    if (div.classList.contains(weaponType.value)) {
      if (div.tagName === "BUTTON" || div.tagName === "DIV") {
        div.style.display = "";
      } else {
        div.parentElement.style.display = "";
      }
    } else if (div.tagName === "BUTTON" || div.tagName === "DIV") {
      div.style.display = "none";
    } else {
      div.parentElement.style.display = "none";
    }
  });
  document.querySelectorAll("div").forEach((x) => {
    if (
      Object.values(x.children).some(
        (y) => x.childElementCount <= 3 && y.tagName === "SELECT" && x.style.display !== "none"
      )
    ) {
      x.classList.add("dropContainer");
    }
  });

  // document.getElementById("weaponId").innerHTML = "";
  document.getElementById("weaponId").textContent = weaponType.value;
  if (weaponType.value === "ChargeBlade") meleeElements();
}

function meleeElements() {
  if (getWeaponMR().phialType === "Impact Phial") {
    document.getElementById("impShieldCharge").parentNode.style = 'display:"';
    document.getElementById("eleShieldCharge").parentNode.style = "display:none";
    document.getElementById("eleShieldCharge").selectedIndex = 0;
  } else if (getWeaponMR().phialType === "Element Phial") {
    document.getElementById("impShieldCharge").parentNode.style = "display:none";
    document.getElementById("impShieldCharge").selectedIndex = 0;
    document.getElementById("eleShieldCharge").parentNode.style = 'display:""';
  }
}

document.addEventListener("keypress", (e) => {
  if (e.key === ["b", "u", "i", "l", "d"][Math.min(4, buildKeys)] && ++buildKeys < 4) {
    return;
  } else if (buildKeys < 4) {
    buildKeys = 0;
    return;
  }
  if (/0-9/.test(e.key)) {
    armorCount += +e.key;
  } else if (e.key === "Enter") {
    getSetBuilds(Math.max(Math.min(armorCount === 0 ? 7 : armorCount, 15), 4));
    armorCount = 0;
    buildKeys = 0;
  }
});

document.addEventListener("keypress", (e) => {
  if (e.key === ["t", "e", "s", "t"][Math.min(3, testKeyCount)] && ++testKeyCount < 3) {
    return;
  } else if (e.key === "Enter" && testKeyCount >= 3) {
    build(armorCount === "f" ? false : true);
    armorCount = "";
    testKeyCount = 0;
  } else if (/t|f/.test(e.key) && testKeyCount >= 3) {
    armorCount = e.key;
    return;
  } else if (testKeyCount < 3) {
    testKeyCount = 0;
    return;
  }
});
function resetSkills() {
  document.querySelectorAll("#skillSelect>div").forEach((x) => x.remove());
}

document.getElementById("BowChargePlus").addEventListener("change", () => {
  comboReset();
  updateComboDisplay();
});

document.querySelectorAll(".scroll").forEach((x) => {
  if (x.tagName === "IMG" || x.tagName === "BUTTON") {
    x.addEventListener("mousedown", (e) => {
      Object.values(document.querySelectorAll("img.scroll")).forEach((img) => {
        img.classList.toggle("vis");
        img.classList.toggle("invis");
      });
      if (document.querySelector("img#redScroll")?.classList.contains("invis")) {
        info.skills.MailofHellfire = info.skills.MailofHellfireSource.blue;
        info.skills.Dereliction = info.skills.DerelictionSource.blue;
      } else {
        info.skills.MailofHellfire = info.skills.MailofHellfireSource.red;
        info.skills.Dereliction = info.skills.DerelictionSource.red;
      }

      // dataCompile(e);
    });
  }
});
document.getElementById("weaponFilter").addEventListener("click", (e) => {
  e.target.classList.toggle("blue", "gray");
});
document.querySelectorAll("input.check").forEach((x) =>
  x.addEventListener("mousedown", (e) => {
    if (/DemonDrug/.test(e?.target.id)) {
      e?.target.id === "DemonDrug"
        ? (document.getElementById("MegaDemonDrug").checked = false)
        : (document.getElementById("DemonDrug").checked = false);
      // } else {
      // e?.target.checked = !e?.target.checked;
    }

    // dataCompile();

    if (e?.target.id !== "filterCombo") {
      // dataCompile();
      if (e?.target.id === "WaterBlight") {
        const ugh = dropHZ.selectedIndex;
        monChart();
        dropHZ.selectedIndex = ugh;
      }
    } else if (e?.target === filterCombo) {
      filterTableForComboAttacks();
    }
  })
);

function toggleAmmoTables() {
  let toggle = document.getElementById("dpsTable")?.classList.contains("augInvis");
  document.getElementById("dpsTable")?.classList.toggle("augInvis", !toggle);
  document.getElementById("ammoTable")?.classList.toggle("augInvis", toggle);
}

function calculateAmmoFrames(power) {
  let attackName = /Sub-Lv|Explosion| Procs|\(RF\+\d\)/g.test(power.attackName)
    ? power.attackName.replace(/Sub-| Explosion| \(RF\+\d\) Procs| Procs| \(RF\+\d\)/g, "")
    : power.attackName;
  attackName = /(?<!Lv)\d/.test(attackName)
    ? `${attackName.slice(0, attackName.length - 1)}Lv${attackName.slice(-1)}`
    : attackName;
  const ammo = {};
  ammo.ammoIncrease = info.ammo.AmmoUp[attackName][AmmoUp.selectedIndex];
  // Converts to number to find frames used while staying within possible parameters
  ammo.recoilSpeed =
    info.ammo.recoil[attackName][
      Math.max(
        0,
        Math.min(
          5,
          power.recoil -
            1 +
            document.getElementById("RecoilDown").selectedIndex +
            (info.skills.BowgunBarrel[document.getElementById("BowgunBarrel").selectedIndex ?? 0].Silencer > 0
              ? document.getElementById("Tune-Up").selectedIndex +
                info.skills.BowgunBarrel[document.getElementById("BowgunBarrel").selectedIndex ?? 0].Silencer
              : 0) -
            (document.getElementById("CriticalFirePower").selectedIndex > 0 ? 2 : 0)
        )
      )
    ];
  ammo.recoilSpeed = /\(RF\+\d\)/.test(power.attackName)
    ? `${ammo.recoilSpeed} ${power.attackName.match(/\(RF\+\d\)/)[0]}`
    : ammo.recoilSpeed;
  ammo.recoilFrames = info.ammo.recoil.frames[ammo.recoilSpeed];
  ammo.reloadSpeed =
    info.ammo.reload[attackName][
      Math.max(
        0,
        Math.min(
          8,
          power.reload +
            document.getElementById("ReloadSpeed").selectedIndex +
            info.skills.BowgunBarrel[document.getElementById("BowgunBarrel").selectedIndex ?? 0].reload +
            (document.getElementById("BowgunBarrel")?.selectedIndex === 0 &&
            document.getElementById("Tune-Up").selectedIndex > 0
              ? 1
              : 0) -
            (document.getElementById("ElementalReload").selectedIndex > 0 ? 2 : 0)
        )
      )
    ];
  ammo.reloadFrames = info.ammo.reload.frames[ammo.reloadSpeed];
  ammo.clipSize = power.clipSize[power.isUsed] + ammo.ammoIncrease;
  ammo.spareShot = Math.max(0, info.skills.SpareShot[SpareShot.selectedIndex] + Number(spareAdjust.value));
  if (/(?<!snipe.*)explosion/.test(attackName) && document.getElementById("Bombardier").selectedIndex > 0) {
    ammo.spareShot += info.skills.Bombardier[attackName.match(/Sticky|Wyvern/)[0]][2];
  }

  const shotsPerTimeLimit = 60;
  ammo.shotsPerMinBase = shotsCheck(
    ammo.recoilFrames / 30,
    ammo.reloadFrames / 30,
    power.clipSize[power.isUsed],
    shotsPerTimeLimit
  );
  ammo.shotsPerMin = shotsCheck(
    ammo.recoilFrames / 30,
    ammo.reloadFrames / 30,
    ammo.clipSize,
    shotsPerTimeLimit,
    100 / ammo.spareShot
  );
  ammo.shotsPerGain = `${Number.parseFloat((ammo.shotsPerMin / ammo.shotsPerMinBase - 1) * 100).toFixed(2)}%`;

  ammo.ticsAdjust = power.ticsPer + 1;
  // Reduces total damage from pierce attacks displayed depending on selection
  // top is for piercing attacks, bottom is for elemental piercing attacks(elemental pierce is reduced by a higher percentage)
  if (/Pierce Lv|Pierce [1-3]/.test(attackName)) {
    ammo.ticsAdjust *= JSON.parse(pierceAdjust.value)[0];
  } else if (/Pierc/.test(attackName)) {
    ammo.ticsAdjust *= JSON.parse(pierceAdjust.value)[1];
  }

  return ammo;
}

function comboReset() {
  if (!document.getElementsByClassName("inputs").length) return;
  // Resets the combo inputs to default values
  if (
    !/BowGun/.test(document.getElementById("previousWeaponType").value) &&
    document.getElementById("previousWeaponType").value !== ""
  ) {
    document.querySelectorAll(".comboHits").forEach((x) => x.remove());
    document.querySelectorAll("#dpsBody>tr:nth-child(1)>td:nth-child(n+3)").forEach((x) => (x.value = 0));
    document.querySelectorAll(".inputs").forEach((x) => (x.value = 0));
    document.querySelectorAll(".inputComboRepeat").forEach((x) => (x.value = 1));
    comboTracker = [];
    // dataCompile();
  }
}

function filterTableForComboAttacks() {
  document.querySelectorAll(".inputs").forEach((element, index) => {
    if (/blue/.test(filterCombo.className) && (element.value === "0" || element.style.display.includes("none"))) {
      document.getElementsByClassName([index]).style.display = "none";
    } else {
      document.getElementsByClassName([index]).style.display = "''";
    }
  });
}

// document.addEventListener('change', e => {
// if (e?.target.className.includes('inputs')) dataCompile(e);
// });
document.getElementById("damageTable").addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("inputButton")) {
    e.target?.classList.contains("dec") ? decreaseComboCount(e) : increaseComboCount(e);
    document.getElementById("comboCountContainer")?.classList.remove("augInvis");
  }
});

function increaseComboCount(e) {
  if (Number(document.querySelectorAll(".inputs")[e?.target.id].value) < 20) {
    ++document.querySelectorAll(".inputs")[e?.target.id].value;
    dataCompile();
  }
}

function decreaseComboCount(e) {
  if (
    (e?.target.id === "0" && Number(document.querySelectorAll(".inputs")[e?.target.id].value) > 1) ||
    (Number(e?.target.id) > 0 && Number(document.querySelectorAll(".inputs")[e?.target.id].value) > 0)
  ) {
    --document.querySelectorAll(".inputs")[e?.target.id].value;
    dataCompile();
  }
}

document.querySelectorAll(".augButton").forEach((x) =>
  x.addEventListener("mousedown", (e) => {
    let ugh = 0;
    const label = document.getElementsByClassName(`${e.target.className.split(" ")[0]} augLabel`)[0];
    document.querySelectorAll(".augLabel").forEach((output) => {
      ugh += Number(output.value);
    });
    if (
      e.target.className.includes("inc") &&
      ugh + Number(e?.target.value) <= 8 &&
      ((((Number(label.value) + Number(e?.target.value) <= 8 && !e.target.classList.contains("elementalAug")) ||
        Number(label.value) < 6) &&
        !e.target.classList.contains("rampageAug")) ||
        Number(label.value) !== 4)
    ) {
      document.getElementById("weaponQurious").textContent = `Remaining Augments ${
        8 - ugh - Number(e?.target.value)
      }/8`;
      label.value = Number(label.value) + Number(e?.target.value);
    } else if (e.target.classList.contains("dec") && Number(label.value) > 0) {
      document.getElementById("weaponQurious").textContent = `Remaining Augments ${
        8 - ugh + Number(e?.target.value)
      }/8`;
      label.value = Number(label.value) - Number(e?.target.value);
    }
    if (/ampage/.test(e?.target.className)) {
      rampageSelect();
    }
    if (e.target.classList.contains("sharpnessAug")) getComboHitsAndSetSharpness();
    dataCompile(e);
  })
);

// document.getElementById('taWikiSetBuilder').addEventListener('paste', e => {
// 	e?.preventDefault();
// 	if (!Array.isArray(document.getElementById('taWikiSetBuilder').value[0]))
// 		return;

// 	const pasteurl = (e?.clipboardData || window.clipboardData).getData('text');
// 	document.querySelectorAll('select.skill').forEach(skill => {
// 		lastEvent = skill;
// 		resetSkillDescription(skill);
// 	});
// 	decodeURL(e, pasteurl);
// 	document.getElementById('taWikiSetBuilder').textContent
// 		= document.createTextNode('Paste TA Wiki Set Builder Link Here');

// 	dataCompile(e);
// });

// function decodeURL(e, url = document.getElementById('taWikiSetBuilder').value) {
// 	if (/mhrise\.wiki-'DualBlades'\.com/.test(url)) {
// 		const decode = decodeURIComponent(url);
// 		const skills = decode.match('(?<=skills=)(.*?)(?=&)')[0].split(',');
// 		resetSkills(
// 			document.querySelectorAll(`.thisSkill:not(.${weaponType.value})`),
// 		);
// 		$.each(skills, (_index, value) => {
// 			const thisSkill = value.split('Lv');
// 			thisSkill[0] = thisSkill[0].replace(/(\s)|(\/)/g, '');
// 			thisSkill[0] = thisSkill[0].replace(/'s/g, 's');
// 			thisSkill[0] = /Fire|Water|Wind|Ice|Dragon/.test(thisSkill[0])
// 				? 'ElementalAttack'
// 				: thisSkill[0];
// 			thisSkill[0] = /Kush|Teos|Storm|Thunder|Wind/.test(thisSkill[0])
// 				? 'ElderEssence'
// 				: thisSkill[0];
// 			if (
// 				document.querySelector(`#${thisSkill[0]}`) !== null
// 				&& document.querySelector(`#${thisSkill[0]}`).style.display !== 'none'
// 			) {
// 				document.querySelector(`#${thisSkill[0]}`).selectedIndex = thisSkill[1];
// 			}

// 			resetWikiText();
// 		});
// 	} else if (Array.isArray(JSON.parse(url))) {
// 		loadState(url);
// 		resetWikiText();
// 	}
// }

// document.querySelectorAll('#taWikiSetBuilder').on('keyup', e => {
// 	e?.target.textContent
// 		= (e?.originalEvent.key === 'v' && e?.originalEvent.ctrlKey)
// 		|| e?.originalEvent.metaKey
// 			? e?.target.textContent === 'Build Successfully Decrypted'
// 			: 'Paste TA Wiki Set Builder Link Here';
// });

// function resetWikiText() {
// 	document.getElementById('taWikiSetBuilder').value = '';
// 	document.getElementById('taWikiSetBuilder').value
// 		= 'Paste TA Wiki Set Builder Link Here';
// }

function saveState(ugh = [[], [], [], [], [], []]) {
  document.getElementsByTagName("select").forEach((x) => {
    ugh[0].push(x.selectedIndex);
  });
  document.querySelectorAll("input.check").forEach((x) => {
    ugh[1].push(x.checked);
  });
  document.getElementsByClassName("inputs").forEach((x) => {
    ugh[2].push(x.value);
  });
  ugh[3].push(comboTracker);
  document.getElementsByClassName("scroll").forEach((x) => {
    ugh[4].push(x.className);
  });
  ugh[5] = "";
  document.querySelectorAll("output.augLabel").forEach((x) => (ugh[5] += x.textContent));
  const copyText = document.createElement("input");
  copyText.setAttribute("value", JSON.stringify(ugh));
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  /* For mobile devices */
  navigator.clipboard.writeText(copyText.value);
  return ugh;
}

function loadState(valuesToSet, pass = false, e = window.event) {
  // if (e?.target?.tagName !== 'BODY' && (e || pass)) {
  // valuesToSet = JSON.parse(valuesToSet);
  // }

  const selectElements = document.querySelectorAll("select");

  selectElements[0].selectedIndex = valuesToSet[0][0];
  classChange();
  weaponSelect();
  for (let i = 0; i < valuesToSet[5].length; i++) {
    document.querySelectorAll("output.augLabel")[i].textContent = valuesToSet[5][i];
  }

  selectElements[3].selectedIndex = valuesToSet[0][3];
  rampageSelect();
  selectElements[80].selectedIndex = valuesToSet[0][document.querySelectorAll("select").length - 10];
  document.getElementById("dropQuest").selectedIndex = 1;
  partSelect();
  healthSelect();

  document.querySelectorAll("select").forEach((select, index) => {
    if (index !== 0 && index !== 3 && index !== document.querySelectorAll("select").length - 10) {
      select.selectedIndex = valuesToSet[0][index];
    }
  });
  document.querySelectorAll("input.check").forEach((element, index) => {
    element.checked = valuesToSet[1][index];
  });

  document.querySelectorAll(".inputs").forEach((input, index) => {
    input.value = valuesToSet[2][index];
  });
  document.querySelectorAll(".scroll").forEach((scroll, index) => {
    scroll.className = valuesToSet[4][index];
  });
  info.skills.MailofHellfire = document.querySelectorAll("#redScroll").classList.contains("invis")
    ? info.skills.MailofHellfireSource.blue
    : info.skills.MailofHellfireSource.red;
  info.skills.Dereliction = document.querySelectorAll("#redScroll").classList.contains("invis")
    ? info.skills.DerelictionSource.blue
    : info.skills.DerelictionSource.red;

  [...comboTracker] = valuesToSet[3][0];
  document.querySelectorAll("input:not(comboRepeat)").forEach((thisInput) => {
    if (thisInput.value > 0) {
      let difference = document.querySelectorAll(".inputs")[thisInput.id]?.value ?? 0 - timesUsed(thisInput.id);
      while (difference > 0) {
        comboTracker.push(thisInput.id);
        --difference;
      }

      while (difference < 0) {
        comboTracker.splice(comboTracker.lastIndexOf(thisInput.id), 1);
        ++difference;
      }
    }
  });
  // dataCompile();
  updateComboDisplay();
  // setTimeout(() => {
  // 	document.querySelectorAll('input#taWikiSetBuilder')[0].value
  // 		= 'Paste TA Wiki Set Builder Link Here';
  // }, 2000);
  // document.querySelectorAll('input#taWikiSetBuilder')[0].value = 'Build Succsefully Loaded';
}

function weaponTypeSelect() {
  populateDropDowns(weaponTypes, weaponType);
}

document.getElementById("weaponFilter").addEventListener("click", () => {
  rampageSelect();
});

function weaponSelect() {
  Object.values(dropWeapon.children).forEach((x) => x.remove());
  let weapons = [];
  if (weaponFilter.className.includes("blue")) {
    weapons = Object.entries(info[weaponType.value].weapons).filter(
      (x) => x[1].rampageSlots > 0 && x[1].baseRaw >= 290
    );
  } else {
    weapons = Object.values(info[weaponType.value].weapons);
  }
  weapons.forEach((weapon) => {
    const option = document.createElement("option");
    option.value = weapon[0];
    option.textContent = weapon[1].weapon;
    dropWeapon.append(option);
  });
}

function rampageSelect() {
  const decoArr = [];
  const [...decos] = getWeaponMR().decos;
  decos.forEach((marker, index) => {
    // formats the armors deco array
    if (marker > 0) {
      decoArr.push(index + 1);
      --marker;
    }
    if (decos[index - 1] > 1) {
      decoArr.push(index);
    } else if (decos[index + 1] > 1) {
      decoArr.push(index + 2);
      --decos[index + 1];
    } else if (decos[index - 2] > 2) {
      decoArr.push(index - 1);
      --decos[index - 2];
    } else if (decos[index + 2] > 2) {
      decoArr.push(index + 3);
      --decos[index + 2];
    }
  });

  setDecoDisplay("weapon", decoArr.reverse());

  document.querySelectorAll("#weaponRampage>*").forEach((menu) => (menu.style.display = "none"));
  document.getElementById("weaponRampage0").style.display = "";
  if (getWeaponMR().rampageSlots) {
    const usableDecos = [];
    document.getElementById("rampImg").src = document
      .getElementById("rampImg")
      .src.replace(
        /ramp\d/,
        `ramp${getWeaponMR().rampageSlots + (Number(document.querySelector("output.rampageAug").value) > 0 ? 1 : 0)}`
      );
    Object.keys(info.rampage.rampageDecos).forEach((deco) => {
      if (
        Number(deco.slice(-1)) <=
        getWeaponMR().rampageSlots + (Number(document.querySelector("output.rampageAug").value) > 0 ? 1 : 0)
      ) {
        usableDecos.push(info.rampage.rampageDecos[deco]);
      }
    });
    populateDropDowns(usableDecos, document.getElementById("weaponRampage0"));
  } else {
    document.querySelectorAll("#weaponRampage>*").forEach((x) => (x.selectedIndex = 0));
    document.querySelectorAll("#weaponRampage>*").forEach((menu) => (menu.style.display = "none"));
    document.getElementById("weaponRampage0").style.display = "";
    if (/Rampage/.test(getWeaponMR().weapon)) {
      info.rampage[getWeaponMR().weapon].Rampage.forEach((vals, index) => {
        document.querySelector("#weaponRampage").children[index].style.display = "";
        populateDropDowns(Object.values(vals), document.querySelector("#weaponRampage").children[index]);
      });
    } else {
      getWeaponMR().rampage.forEach((rampSkill) => {
        const option = document.createElement("option");
        option.value = info.rampage.keys2[rampSkill];
        option.textContent = info.rampage.keys2[rampSkill];
        document.getElementById("weaponRampage0").append(option);
      });
    }
  }
}
function populateDropDowns(json, dropDown, value = json) {
  if (dropDown?.childElementCount) {
    Object.values(dropDown.children).forEach((child) => child.remove());
  }
  json.forEach((text, index) => {
    const option = document.createElement("option");
    option.value = value[index];
    option.textContent = text;
    dropDown.append(option);
  });
}
function monsterSelect() {
  populateDropDowns(Object.keys(info.monster), dropMon);
  dropMon.selectedIndex = Object.keys(info.monster).indexOf("Toadversary");
}

const getEleHZ = (eleType) => info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(eleType)];

function getRawHZ(damageType) {
  if (info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(damageType)] === undefined) {
    return 100;
  }

  return WaterBlight.checked
    ? Math.min(
        100,
        ~~(
          Math.max(
            info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(damageType)],
            info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(damageType)] * 0.63 + 22.2
          ) + 3
        )
      )
    : info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(damageType)];
}

const getUsedAttacks = (weapon = weaponType.value) => {
  let attacks = {};
  if (weaponType.value === "InsectGlaive") {
    attacks = Object.fromEntries(
      Object.entries(info.InsectGlaive.attacks).filter((skill) => !/Sever|Blunt|Kinsect|Dust|Powder|Mark/.test(skill))
    );

    return {
      ...attacks,
    };
  }

  if (weaponType.value === "ChargeBlade") {
    const phialType = getWeaponMR().phialType === "Impact Phial" ? "Element Phial|Elemental Phial" : "Impact Phial";
    const regexp = new RegExp(`${phialType}`);

    attacks = Object.fromEntries(Object.entries(info.ChargeBlade.attacks).filter((skill) => !regexp.test(skill)));

    return {
      ...attacks,
    };

    //  Filters bow attacks for only the usable attacks
  }

  if (weaponType.value === "Bow") {
    let usableKeys = "";
    const totalKeys =
      document.getElementById("BowChargePlus").selectedIndex === 1 && getWeaponMR().baseCharge < 4
        ? getWeaponMR().baseCharge + 1
        : getWeaponMR().baseCharge;
    getWeaponMR().bowShot.forEach((element, index) => {
      if (index < totalKeys) {
        usableKeys += `|Lv${element.match("[1-5]")[0]} ${element.match("Normal|Rapid|Pierce|Spread")[0]}`;
      }
    });
    const regex = new RegExp([usableKeys.slice(1)]);
    let ugh = Object.entries(info.Bow.attacks).filter((attack) => regex.test(attack[0]));
    ugh = [].concat(Object.entries(info.Bow.attacks).splice(0, 1), ugh);
    ugh = ugh.concat(Object.entries(info.Bow.attacks).splice(136));
    attacks = Object.fromEntries(ugh);
    return {
      ...attacks,
    };
  }

  if (weaponType.value === "Gunlance") {
    attacks = Object.fromEntries(Object.entries(info.Gunlance.attacks).splice(0, 27));
    return {
      ...attacks,
    };
  }

  if (weaponType.value === "LightBowGun" || weaponType.value === "HeavyBowGun") {
    let usableAmmo = info.ammo.keys
      .map((x, index) =>
        x.filter((y) =>
          weaponType.value === "LightBowGun" && getWeaponMR().isRapidFire.includes(index + 1)
            ? /RF\+/.test(y)
            : getWeaponMR().clipSize[index + 1] > 0 && !/RF\+/.test(y)
        )
      )
      .toString()
      .split(/,+/);
    usableAmmo = usableAmmo.concat(
      Object.keys(info.ammo).filter((x) =>
        weaponType.value === "LightBowGun" ? /lbg|Wyvern Blast(?! before)/.test(x) : /hbg|Wyverns/.test(x)
      )
    );
    attacks = Object.fromEntries(Object.entries(info.ammo).filter((skill) => timesUsed(skill[0], usableAmmo) > 0));
    return {
      ...attacks,
    };
  }

  return {
    ...info[weapon].attacks,
  };
};

const getAttacks = (weapon = weaponType.value) => ({
  ...info[weapon].attacks,
});
const getWeapon = () =>
  info[weaponType.value].weapons[dropWeapon.selectedIndex].rampageSlots > 0 ? getWeaponMR() : getRampageSkills();

function partSelect() {
  document.querySelectorAll("#dropHZ>option").forEach((x) => x.remove());
  const parts = [];
  if (Array.isArray(info.monster[dropMon.value].parts)) {
    info.monster[dropMon.value].parts.forEach((hitzone) => {
      parts.push([`${hitzone.part} ${hitzone.state}`]);
    });
  } else {
  }
  populateDropDowns(parts, dropHZ);
}
function questSelect() {
  document.querySelectorAll("#HR>option").forEach((x) => x.remove());
  document.querySelectorAll("#MR>option").forEach((x) => x.remove());
  const quests = Object.values(info.quest).filter((quest) => {
    if (quest.target.some((mon) => mon.name === dropMon.selectedOptions[0].textContent)) {
      return quest;
    }
  });
  quests.forEach((quest) => {
    quest.target.forEach((x, index) => {
      if (x.name === dropMon.value) {
        const option = document.createElement("option");
        option.value = quest.quest;
        option.textContent = quest.quest;
        document.getElementById(quest.rank).append(option);
      }
    });
  });
  updateQuest(
    document.querySelectorAll("#MR>option")?.length > 0
      ? document.querySelectorAll("#MR>option")[0].textContent
      : document.querySelectorAll("#HR>option")[0].textContent
  );

  if (document.querySelectorAll("MR>option")?.length) {
    document.getElementById("MR")?.classList.remove("augInvis");
  } else {
    document.getElementById("MR")?.classList.add("augInvis");
  }
  if (document.querySelectorAll("HR>option")?.length) {
    document.getElementById("HR")?.classList.remove("augInvis");
  } else {
    document.getElementById("HR")?.classList.add("augInvis");
  }
}

function healthSelect() {
  let modifier = 1;
  switch (document.getElementById("players").selectedOptions[0].value) {
    case "1p":
      modifier = 1;
      break;
    case "2p":
      modifier = 1.35;
      break;
    case "3p":
      modifier = 1.7;
      break;
    case "4p":
      modifier = 2;
      break;
  }
  info.quest[dropQuest.value].target.forEach((x) => {
    if (x.name === dropMon.value) {
      const health = x.hp.map((hp) => hp * modifier);
      populateDropDowns(health, document.getElementById("health"));
    }
  });
}

// document.querySelectorAll('#taWikiSetBuilder').on('mousedown', e => {
// if (document.querySelectorAll(e?.target).val() === 'Paste TA Wiki Set Builder Link Here') {
// document.querySelectorAll(e?.target).val('');
// }
// });

function isUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function showMenu() {
  document.querySelectorAll(".menu").forEach((x) => x.classList.remove("augInvis"));
  let mrToggle = document.querySelectorAll("#MR>option").length > 0;
  document.getElementById("MR").parentElement.classList.toggle("augInvis", !mrToggle);

  let hrToggle = document.querySelectorAll("#HR>option").length > 0;
  document.getElementById("HR").parentElement.classList.toggle("augInvis", !hrToggle);
}

function updateQuest(value) {
  document.getElementById("dropQuest").selectedOptions[0].value = value;
  document.getElementById("dropQuest").selectedOptions[0].textContent = value;
  document.getElementById("questDiv")?.classList.add("augInvis");
}

const capitalAll = (str) => str.replace(/(?<!\w)\w/g, (letter) => letter.toUpperCase());

const capital = (str, index = 0) => str[index].toUpperCase() + str.slice(1);

const lower = (str) => str[0].toLowerCase() + str.slice(1);

function shotsCheck(convertedRecoilFrames, convertedReloadFrames, clipSize, maxTime = 60, spareShot = 0) {
  let spareShotAccumulator = 0;
  spareShotAccumulator += spareShot;
  let timeUsed = 0;
  let totalShots = 0;
  while (timeUsed <= maxTime) {
    for (let i = 0; i < clipSize; ++i) {
      timeUsed += convertedRecoilFrames;
      totalShots += timeUsed <= maxTime ? 1 : 0;
      if (totalShots >= spareShotAccumulator && spareShot !== 0 && spareShot !== Infinity) {
        --i;
        spareShotAccumulator += spareShot;
      }
    }

    timeUsed += convertedReloadFrames;
  }

  return totalShots;
}

function getHealthPools(hp = [[], [], [], []]) {
  quest = info.quest.filter((x) => x.quest === dropQuest.value);
  quest.target[dropMon.value].hp.forEach((health) => {
    hp[0].push(health);
    hp[1].push(~~(health * 1.35));
    hp[2].push(~~(health * 1.7));
    hp[3].push(~~(health * 2));
  });
  return hp;
}

function resetSkillDescription() {
  if (lastEvent !== "") {
    if (lastEvent === document.getElementById("BowCoating") && weaponType.value !== "Bow") {
      return;
    }

    let theseOptions = [];
    if (Object.values(lastEvent.children).some((x) => x.tagName === "OPTGROUP")) {
      theseOptions = document.querySelectorAll(`${lastEvent.id}>*>*`);
      theseOptions.splice(-2);
      theseOptions.splice(0, 0, lastEvent[0]);
    } else {
      theseOptions = Object.values(lastEvent.children);
    }

    theseOptions.forEach((thisOption, index) => {
      let newText = "";
      if (lastEvent === BowCoating) {
        newText = getWeaponMR().coatings[index];
      } else if (lastEvent === document.getElementById("BowgunBarrel")) {
        newText = ["----", "Long", "Power", "Silencer", "Guard-Up"][index];
      } else if (lastEvent === Dereliction) {
        newText = ["----", "Lv-1-1", "Lv-1-2", "Lv-1-3", "Lv-2-1", "Lv-2-2", "Lv-2-3", "Lv-3-1", "Lv-3-2", "Lv-3-3"][
          index
        ];
      } else {
        let skillLvl = index + 0;
        if (lastEvent.children[1].tagName === "OPTGROUP" && index !== 0) {
          if (lastEvent.id === "Burst" && index >= 2) {
            skillLvl = index - 1;
          } else {
            skillLvl = index % 3 === 0 ? 3 : index % 3;
          }
        }

        newText = lastEvent.id === "Burst" && index === 1 ? "Base Bonus" : `Lv-${skillLvl}`;
      }

      thisOption.textContent = index === 0 ? "----" : newText;
    });
    lastEvent = "";
  }
}

document.querySelectorAll(".buildSkills").forEach((x) =>
  x.addEventListener("mousedown", (e) => {
    if (lastEvent !== "" && lastEvent === e?.target && !e.target.className.includes("augment")) return;
    if (lastEvent !== "") {
      resetSkillDescription();
    }

    if (e.target.classList.contains("skill")) {
      setSkillDescriptions(e?.target);
    }
    if (e.target.tagName === "INPUT" && e.target.className.includes("skillInput")) lastEvent = e.target;
  })
);

document.querySelectorAll("select.skill").forEach((x) =>
  x.addEventListener("change", (e) => {
    resetSkillDescription();

    // dataCompile();
    e?.target.blur();
  })
);

function setSkillDescriptions(thisSkill) {
  if (thisSkill.classList.contains("skill")) {
    info.skills[thisSkill.id].forEach((statInc, index) => {
      let option;
      if (index !== 0) {
        if (thisSkill.id === "RecoilDown" || thisSkill.id === "ReloadSpeed") {
          option = `${thisSkill.id.slice(0, 6)} ${thisSkill.id.slice(6)} +${index}`;
        } else if (thisSkill.id === "AmmoUp" || thisSkill.id === "SpareShot") {
          const inc =
            thisSkill.id === "AmmoUp"
              ? ["No Change", "Lv2 & Ele Ammo", "Lv3 & Dragon Ammo"]
              : ["Spare Shot +5%", "Spare Shot +10%", "Spare Shot +20%"];
          option = `${index}: ${inc[index - 1]}`;
        } else if (thisSkill.id === "Marksman") {
          option = `${index}: ${
            [
              "Chance 20% Raw  + 5% EFR +1%",
              "Chance 20% Raw+10% EFR +2%",
              "Chance 60% Raw  + 5% EFR +3% ",
              "Chance 40% Raw+10% EFR +4%",
            ][index - 1]
          }`;
        } else if (thisSkill.id === "Bombardier") {
          if (weaponType.value !== "HeavyBowGun") {
            option = `${index}: Raw +${info.skills.Bombardier[index][0]}% EFR +${info.skills.Bombardier[index][1]}`;
          } else {
            option = [
              "Bombardier",
              "1: Raw + 10% EFR + 10%",
              "2: Sticky+10% Wyvern+15%",
              "3: Raw + 20% EFR + 16%",
              "4: Raw + 25% EFR + 17%",
            ][index];
          }
        } else if (thisSkill.id === "BowgunBarrel") {
          option = ["Barrels", "Long: Raw + 5%", "Power: Raw + 12.5%", "Silencer: Recoil Down +1", "Shield: Guard Up"][
            index
          ];
        } else if (thisSkill.id === "CriticalFirePower") {
          option = ["-", "Normal +30% Spread +20% Pierce +10% Recoil -2"][index];
        } else {
          let raw = "";
          if (statInc.BR > 0 || statInc.PRM > 1 || statInc.BRM > 1) {
            raw = "Raw";
            if (statInc.BR > 0) {
              raw += /\d\.?\d/.test(statInc.BR) ? `+${statInc.BR}` : ` + ${statInc.BR}`;
            }

            if (statInc.BRM > 1) {
              const brm = /\.[1-8]/.test((statInc.BRM - 1) * 100)
                ? ((statInc.BRM - 1) * 100).toFixed(1)
                : ((statInc.BRM - 1) * 100).toFixed(0);
              raw += /\d\.?\d/.test(brm) ? `+${brm}%` : ` + ${brm}%`;
            }

            if (statInc.PRM > 1) {
              const prm = /\.[1-8]/.test((statInc.PRM - 1) * 100)
                ? ((statInc.PRM - 1) * 100).toFixed(1)
                : ((statInc.PRM - 1) * 100).toFixed(0);
              raw +=
                thisSkill.id === "CriticalBoost" && /\d\.?\d/.test(prm - 25)
                  ? `+${prm - 25}%`
                  : thisSkill.id === "CriticalBoost"
                  ? ` + ${prm - 25}%`
                  : /\d\.?\d/.test(prm)
                  ? `+${prm}%`
                  : ` + ${prm}%`;
            }
          }

          let ele = "";
          if (statInc.BE > 0 || statInc.PEM > 1 || statInc.BEM > 1) {
            ele = "Ele";
            if (statInc.BE > 0) {
              ele += /\d\.?\d/.test(statInc.BE) ? `+${statInc.BE}` : ` + ${statInc.BE}`;
            }

            if (statInc.BEM > 1) {
              const bem = /\.[1-8]/.test((statInc.BEM - 1) * 100)
                ? ((statInc.BEM - 1) * 100).toFixed(1)
                : ((statInc.BEM - 1) * 100).toFixed(0);
              ele += /\d\.?\d/.test(bem) ? `+${bem}%` : ` + ${bem}%`;
            }

            if (statInc.PEM > 1) {
              const pem = /\.[1-8]/.test((statInc.PEM - 1) * 100)
                ? ((statInc.PEM - 1) * 100).toFixed(1)
                : ((statInc.PEM - 1) * 100).toFixed(0);
              ele += /\d\.?\d/.test(pem) ? `+${pem}%` : ` + ${pem}%`;
            }
          }

          const aff =
            statInc.aff > 0 && /\d\.?\d/.test(statInc.aff)
              ? `Aff+${statInc.aff}`
              : statInc.aff > 0
              ? `Aff + ${statInc.aff}`
              : "";
          raw =
            Object.prototype.hasOwnProperty.call(statInc, "Sharp") && statInc.Sharp < 1
              ? `Sharp +${statInc.Sharp * 100}%`
              : raw;
          raw =
            Object.prototype.hasOwnProperty.call(statInc, "Sharp") && statInc.Sharp > 1
              ? `Sharp +${statInc.Sharp}`
              : raw;
          raw = raw === "" && ele === "" && aff === "" ? "No Change" : raw;
          if (thisSkill === BowCoating) {
            const text = getWeaponMR().coatings;
            option = `${text[index]}: ${[raw, ele, aff].join(" ")}`;
          } else {
            let skillLvl = index + 0;
            if (thisSkill.children[1].tagName === "OPTGROUP" && index !== 0) {
              if (thisSkill.id === "Burst" && index >= 2) {
                skillLvl = index - 1;
              } else {
                skillLvl = index % 3 === 0 ? 3 : index % 3;
              }
            }

            option = `${skillLvl}: ${[raw, ele, aff].join(" ")}`;
          }
        }
      } else {
        option = thisSkill.id;
      }

      document.getElementById(thisSkill.id)[index].textContent = option;
    });
    lastEvent = thisSkill;
  }

  // if (
  //   (thisSkill.classList.contains("skill") && thisSkill.children[0].textContent === thisSkill.id) ||
  //   !document
  //     .querySelectorAll("select.skill>*")
  //     .some((x) => x.id === thisSkill.id || x.id === thisSkill)
  // ) {
  //   resetSkillDescription(thisSkill);
  // }
}

function getStats(power) {
  power.getSkills.forEach((theseVals) => {
    power.BRM *= +theseVals.BRM;
    power.BR += +theseVals.BR;
    power.PRM *= +theseVals.PRM;
    power.BEM *= +theseVals.BEM;
    power.BE += +theseVals.BE;
    power.PEM *= +theseVals.PEM;
    power.aff += +theseVals.aff;
  });
  return {
    ...power,
  };
}

function partSelector() {
  document.querySelectorAll("dropHZ>*").forEach((part, index) => {
    if (part.textContent === getWeapon().eleType) {
      document.getElementById("dropHZ").selectedIndex = index;
    }
  });
}

function formatNumbers(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const createSkillSelections = (skillName, initialLevel = 0, after = true) => {
  if (skillName === "Skill Selector") return;
  if (document.getElementById(`${skillName}Select`) !== null) {
    document.getElementById("dropSkills").after(document.getElementById(`${skillName}Select`));
    // dataCompile();
    return;
  }
  const cell = document.createElement("div");
  const label = document.createElement("label");
  label.className = `label ${skillName} skillInput`;
  label.textContent = skillName;

  const output = document.createElement("output");
  output.className = `skillInput ${skillName}`;
  output.setAttribute("max", info.types.maxDeco[skillName]);
  output.setAttribute("min", "0");
  output.textContent = `Lv-${initialLevel}`;

  const decButton = document.createElement("button");
  decButton.type = "button";
  decButton.setAttribute("aria-pressed", "false");
  decButton.id = `${skillName}Dec`;
  decButton.className = `skillInput ${skillName} dec`;
  decButton.innerHTML += `&#8681`;

  const incButton = document.createElement("button");
  incButton.type = "button";
  incButton.setAttribute("aria-pressed", "false");
  incButton.id = `${skillName}Inc`;
  incButton.className = `skillInput ${skillName} inc`;
  incButton.innerHTML += "&#8679";

  cell.appendChild(label);
  cell.appendChild(output);
  cell.appendChild(decButton);
  cell.appendChild(incButton);
  cell.id = `${skillName}Select`;
  document.getElementById("dropSkills").after(cell);
};
const getSkillSelects = () => {
  document.querySelectorAll("select.skill").forEach((skill) => {
    if (skill.selectedIndex > 0) {
      createSkillSelections(skill.id, skill.selectedIndex);
    }
  });
  // dataCompile();
};
document.getElementById("dropSkills")?.addEventListener("change", (e) => {
  if (
    document.getElementById(e.target.value)?.className.includes("classSpecific") &&
    !document.getElementById(e.target.value)?.className.includes(weaponType.value)
  )
    return;

  createSkillSelections(e.target.value, info.types.maxDeco[e.target.value]);
  // if (document.getElementById([e.target.value])) {
  // 	document.getElementById([e.target.value]).selectedIndex =
  // 		info.types.maxDeco[e.target.value];
  // }
  // dataCompile();
});
Object.values(document.getElementsByClassName("inc qurious")).forEach((x) =>
  x.addEventListener("mousedown", (e) => {
    document.getElementById(`${e.target.classList[0]}Qurious`).classList.remove("augInvis");
  })
);
Object.values(document.getElementsByClassName("dec qurious")).forEach((x) =>
  x.addEventListener("mousedown", (e) => {
    document.getElementById(`${e.target.classList[0]}Qurious`).classList.add("augInvis");
  })
);
document.querySelector("#weaponSelects > button.weapon.dec").addEventListener("mousedown", () => {
  document.getElementById(`augToggle`).classList.add("augInvis");
});
// updates skill displays used for set builder
document.getElementById("skillSelect").addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("skillInput")) {
    const id = e.target.className.split(" ")[1];
    let input = +document.querySelector(`output.${id}`)?.textContent.match(/(?<=Lv-)\d/)[0];
    if (e.target.tagName === "BUTTON") {
      if (e.target.className.includes("dec")) {
        if (input === 0) {
          e.target.parentElement.remove();
        } else {
          document.querySelector(`output.${id}`).textContent = `Lv-${(input -= 1)}`;
        }
      }
      if (e.target.className.includes("inc")) {
        document.querySelector(`output.${id}`).textContent = `Lv-${
          input < info.types.maxDeco[id] ? (input += 1) : input
        }`;
      }
    }
    document.getElementById("chest")?.childElementCount;
  }
});
const addPoints = ([skillName, skillLevel]) => {
  if (document.querySelector(`output.${skillName}`)) {
    document.querySelector(`output.${skillName}`).textContent = `Lv-${Math.min(
      info.types.maxDeco[skillName],
      document.querySelector(`output.${skillName}`)?.textContent.match(/(?<=Lv-)\d/)[0] + +skillLevel
    )}`;
    // dataCompile();
  } else {
    createSkillSelections(skillName, skillLevel);
  }
};
/* ////////////////////////////////////////////////////////////////////////// */
/* ////////////////////////////////////////////////////////////////////////// */
/* //////////                Qurious augments                 /////////////// */
/* ////////////////////////////////////////////////////////////////////////// */
/* ////////////////////////////////////////////////////////////////////////// */

// const setNext = (previous, check) => {
// 	const augment = previous.nextElementSibling;
// 	const options = augment.querySelectorAll('option');
// 	options.forEach(option => {
// 		// Enable or disable the option based on its value
// 		if (check) {
// 			option.disabled = false;
// 		} else {
// 			option.disabled = true;
// 		}
// 	});
// 	if (check) return;
// 	augment.selectedIndex = 0;
// 	const nextAugType = augment.nextElementSibling;
// 	nextAugType.selectedIndex = -1;
// 	if (nextAugType.nextElementSibling?.className.includes('augmentType'))
// 		setNext(nextAugType, false);
// };

// const restrictMenus = augType => {
// 	// Get the value of the selected option
// 	const selected = augType.selectedIndex > 0;
// 	console.log(`Selected value: ${selected}`);
// 	setNext(augType, selected);
// };
// Object.values(document.querySelectorAll('select.augment')).forEach(x =>
// 	x.addEventListener('blur', e => {
// 		getRemainingPoints(e.target.parentElement);
// 	})
// );
// document.addEventListener('blur', e => {
// 	if (
// 		e.target.className.includes('augment') ||
// 		lastEvent.className.includes('augment')
// 	)
// 		setSkillsDisplay(e.target.parentElement.id.slice(0, -7));
// 	getRemainingPoints(e.target.parentElement);
// });
const getCurrentArmorSkills = (skills = {}) => {
  Object.keys(info.armor).forEach((x) => {
    Object.values(document.querySelectorAll(`#${x}Skills>output`)).forEach((option) => {
      const skill = option.value?.split(" ")[0].split("\n")[0];
      const level = +option.value.slice(-2);
      if (level) {
        if (!skills[skill]) {
          skills[skill] = level;
        } else {
          skills[skill] += level;
        }
      }
    });
  });
  return skills;
};
const getCurrentSelectedSkills = (skills = {}) => {
  Object.values(document.querySelectorAll("select.armorDisplay,select.charm")).map((option) => {
    const skill = option.selectedOptions[0].textContent?.slice(0, -3).trim();
    const level = +option.selectedOptions[0].textContent?.slice(-2);
    if (level > 0) {
      if (!skills[skill]) {
        skills[skill] = level;
      } else {
        skills[skill] += level;
      }
    }
  });
  return skills;
};
const updateSelectedSkills = () => {
  let skills = getCurrentSelectedSkills();
  skills = getCurrentArmorSkills(skills);
  document
    .querySelectorAll("#raw select")
    .forEach(
      (select) =>
        (select.selectedIndex = skills[select.id]
          ? Math.min(
              skills[select.id],
              info.types.maxDeco[select.id] ? info.types.maxDeco[select.id] : info.skills[select.id].length - 1
            )
          : 0)
    );
  // for (let [select.id, skillLevel] of Object.entries(skills)) {
  // select.id = select.id.replace(/'/, "");
  // if (document.getElementById(select.id)) {
  // document.getElementById(select.id).selectedIndex = Math.min(
  // skillLevel,
  // if there isnt a maxDeco entry get max from skills JSON

  // );
  // }
  // }
  return skills;
};
// function armorSelect() {
// if (!info.armor) return;
// Object.entries(info.armor).forEach((type) => {
// type[1].forEach((piece, index) => {
// const select = document.getElementById(type[0]);
// const option = document.createElement("option");
// option.value = index;
// option.textContent = piece.name;
// select.appendChild(option);
// });
// });
// setArmorSkillsDisplay();
// document.querySelectorAll("section.armorDisplay:not(.weapon,.charm)").forEach(async (section) => {
// const type = section.classList[0];
// const qurious = document.createElement("section");
// qurious.className = `armorAugment augInvis`;
// qurious.id = `${section.classList[0]}Qurious`;
// const currentPoints = document.createElement("output");
// currentPoints.className = "currentPoints";
// currentPoints.textContent = `Remaining Points ${
// info.armor[type][document.getElementById(type).value].quriousPoints
// }/${info.armor[type][document.getElementById(type).value].quriousPoints}`;
// qurious.appendChild(currentPoints);
// for (let i = 0; i < 6; i++) {
// const augmentTypeSelect = document.createElement("select");
// augmentTypeSelect.className = "augmentType";
// ["----", "-Def", "-Skill", "+Slots", "+Skill"].forEach((option) => {
// const thisOption = document.createElement("option");
// thisOption.textContent = option;
// augmentTypeSelect.appendChild(thisOption);
// });
// qurious.appendChild(augmentTypeSelect);

// const augmentSelect = document.createElement("select");
// augmentSelect.className = "augment";
// qurious.appendChild(augmentSelect);
// section.append(qurious);
// }
// });
// }
const resetPoints = (parent, startIndex = 0) => {
  // for (let i = 0; i < 6; i++) {
  Object.values(document.querySelectorAll(`#${parent.id}>select`)).forEach((select) => (select.selectedIndex = -1));
  // document.querySelectorAll(`#${parent.id}>select.augmentType`)[
  // i
  // ].selectedIndex = -1;
  // }
  getRemainingPoints(parent);
};
// document
// .querySelectorAll(`#${parent.id}>select:nth-child(n+${startIndex})`)
// .forEach(x => (x.selectedIndex = -1));

const hideShowMenu = (target) => {
  // augment/skill menus
  const id = target.className.split(" ")[0];
  if (target.className.includes("inc")) {
    document.getElementById(`${id}Qurious`)?.classList.remove("augInvis");
  } else {
    document.getElementById(`${id}Qurious`).classList.add("augInvis");
  }
};
const setCharmsAvailableDecoSlots = (target) => {
  const otherSkill = document.getElementById(
    +target.id.slice(-1) === 1 ? `${target.id.slice(0, -1)}2` : `${target.id.slice(0, -1)}1`
  );
  if (target.selectedOptions[0].textContent.slice(0, -3) === otherSkill.selectedOptions[0].textContent.slice(0, -3)) {
    otherSkill.selectedIndex = 0;
  }
  const decoArr = [];
  const grade = getGrade(otherSkill?.value, target.value);

  if (grade === document.getElementById(`${target.id.slice(0, 6)}Decos`).value) return;
  document.getElementById(`${target.id.slice(0, 6)}Decos`).value = grade;
  switch (grade) {
    case "S":
      decoArr.push(2, 1);
      break;
    case "A":
      decoArr.push(3, 1);
      break;
    default:
      decoArr.push(3, 2);
      break;
  }
  setDecoDisplay(target.id.slice(0, 6), decoArr);
};
// const onChangeQurious = target => {
// if (target.className === 'augmentType') {
// 	setAugmentPt1(target);
// 	getRemainingPoints(target.parentElement);
// 	return;
// }

// 	if (target.className.includes('augment')) {
// 		getRemainingPoints(target.parentElement);
// 		setAugmentPt1(target);
// 	}
// };
// document.addEventListener('change', e => {
// 	if (e.target.className === `${e.target.id} armor`) {
// 		setSkillsDisplay(info.armor[e.target.id]);
// 		resetPoints(helm.parentElement.lastElementChild);
// 	}
// });
const getArmor = (type) => {
  for (let i = 0; i < info.armor[type].length; i++) {
    if (info.armor[type][i].name.includes(document.getElementById(type).selectedOptions[0].textContent)) {
      return info.armor[type][i];
    }
  }
};
const getRemainingPoints = (parent, value = 0) => {
  const type = parent.id.slice(0, -7);
  const armor = getArmor(type);

  value += armor.quriousPoints;
  for (let i = 0; i < 6; i++) {
    const thisAugment = document.querySelectorAll(`#${parent.id}>select.augment`)[i];
    if (value + +thisAugment.value < 0) {
      thisAugment.selectedIndex = 0;
      document.querySelectorAll(`#${parent.id}>select.augmentType`)[i].selectedIndex = 0;
    }
    value += +thisAugment.value;
  }
  parent.firstElementChild.textContent = `Remaining Points ${`${value}/${armor.quriousPoints}`}`;
  return value;
};
// sets the Skills displayed for the armors.
const setArmorSkillsDisplay = (armorTypes = Object.keys(info.armor)) => {
  Object.values(armorTypes).forEach((armorType) => {
    if (armorType === "") return;
    const dropArmor = document.getElementById(armorType);
    if (dropArmor) {
      let thisArmor = getArmor(armorType);
      const decoArr = [];
      const [...decos] = thisArmor.decos;
      decos.forEach((marker, index) => {
        // formats the armors deco array
        if (marker > 0) {
          decoArr.push(index + 1);
          --marker;
        }
        if (decos[index - 1] > 1) {
          decoArr.push(index);
        } else if (decos[index + 1] > 1) {
          decoArr.push(index + 2);
          --decos[index + 1];
        } else if (decos[index - 2] > 2) {
          decoArr.push(index - 1);
          --decos[index - 2];
        } else if (decos[index + 2] > 2) {
          decoArr.push(index + 3);
          --decos[index + 2];
        }
      });
      decoArr.reverse();
      const augmentTypeSelects = document.querySelectorAll(`#${armorType}Qurious>select.augmentType`);
      const augmentSelects = document.querySelectorAll(`#${armorType}Qurious>select.augment`);
      const augSkills = JSON.parse(JSON.stringify(thisArmor.skills));
      // parent[i]=== this.augmentType parent[i+1]=== this.augment
      for (let i = 0; i < 6; ++i) {
        if (
          augmentSelects?.length > 1 &&
          augmentSelects[i].selectedIndex > 0 &&
          (augmentTypeSelects[i].selectedIndex === 2 || augmentTypeSelects[i].selectedIndex === 4)
        ) {
          // applies + and - skill augments
          const skillName = augmentSelects[i].selectedOptions[0].textContent.match(/^\S+/)[0];

          if (augSkills[skillName]) {
            // augmentTypeSelects[i].selectedIndex - 3 will -1 if -Skill or +1 if +Skill
            augSkills[skillName] += augmentTypeSelects[i].selectedIndex - 3;
          } else {
            augSkills[skillName] = 1;
          }
        } else if (
          // applies deco augments
          augmentTypeSelects?.length > 1 &&
          augmentSelects[i].selectedIndex > 0 &&
          augmentTypeSelects[i].selectedIndex === 3
        ) {
          let points = augmentSelects[i].selectedIndex;
          for (let k = 0, j = -1; points > 0 && j < 3; ) {
            if (j < 2 && !decoArr[j + 1]) decoArr[j + 1] = 0;
            if (k === 0) {
              if (++j === 3) {
                k = 1;
                j = 0;
              } else if (decoArr[j] === 0) {
                ++decoArr[j];
                --points;
              }
              continue;
            } else if (k === 1 && decoArr[j] < 4) {
              const min = Math.min(points, 4 - decoArr[j]);
              decoArr[j] += min;
              points -= min;
            }
            ++j;
          }
        }
      }
      dropArmor.nextElementSibling.textContent = "";
      Object.entries(augSkills).forEach(
        (skill) =>
          (dropArmor.nextElementSibling.innerHTML += `<img class="armorImg armorDeco rampage" src="./icons/skill.png"><output>${
            skill[0].match(/^\S+/)[0]
          } +${skill[1]}</output>`)
      );
      dropArmor.nextElementSibling.id = `${armorType}Skills`;

      setDecoDisplay(armorType, decoArr);
    }
  });
};
// const setAugmentPt2 = (target, propArr) => {
// 	Object.values(target.children).forEach(child => child.remove());
// 	propArr.forEach(
// 		vals =>
// 			(target.innerHTML += `<option value='${Object.values(
// 				vals
// 			)}'>${Object.keys(vals)}</option>`)
// 	);
// };
// updates available augment selections on change

const ChangeDropdownOptions = (target) => {
  const augmentType = target.classList.contains("augmentType") ? target : target.previousElementSibling;
  const augment = target.classList.contains("augmentType") ? target.nextElementSibling : target;
  const type = target.parentElement.id.slice(0, -7);
  const temp = augment.selectedIndex;
  while (augment.firstChild) {
    augment.removeChild(augment?.firstChild);
  }

  const defaultOption = document.createElement("option");
  defaultOption.value = 0;
  defaultOption.textContent = " ---- ";
  augment.appendChild(defaultOption);
  const budget = getRemainingPoints(target.parentElement);

  switch (augmentType.value) {
    case "-Def":
      for (let i = 1; i <= 5; i += 2) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        augment.appendChild(option);
      }
      break;
    case "-Skill":
      document.querySelectorAll(`#${type}Skills>output`).forEach((skill) => {
        const option = document.createElement("option");
        option.value = 10;
        option.textContent = `${skill.textContent.split("\n")[0].split(" ")[0]} 10`;
        option.classList.toggle("augInvis", +skill.textContent.slice(-2) <= 0);
        augment.appendChild(option);
      });
      break;
    case "+Skill":
      const skillOutputs = document.querySelectorAll(`#${type}Skills>output`);
      Object.entries(info.types.qurious).forEach((x) => {
        const option = document.createElement("option");
        option.value = -x[1];
        option.textContent = `${x[0]} -${x[1]}`;
        option.classList.toggle(
          "augInvis",
          x[1] > budget ||
            (skillOutputs.length >= 5 &&
              !Object.values(skillOutputs).some((skills) => skills.textContent.includes(x[0])))
        );
        augment.appendChild(option);
      });
      break;
    case "+Slots":
      for (let i = 1; i <= 3; i++) {
        const cost = -6 * i;
        const option = document.createElement("option");
        option.value = cost;
        option.textContent = `${i} Slot ${cost}`;
        option.classList.toggle("augInvis", budget < cost);
        augment.appendChild(option);
      }
      break;
    default:
      break;
  }

  if (target.className.includes("Type")) {
    augment.selectedIndex = 0;
  } else {
    augment.selectedIndex = temp;
  }
  // };
  // const option = augment.querySelector(`option[value="${temp}"]`);
  // if (option) {
  // option.selected = true;
  // }
};
// setAugmentPt2(augment, arr);
// };
// //
const updateAugmentOptions = (target) => {
  const augmentType = target.classList.contains("augmentType") ? target : target.previousElementSibling;
  const augment = target.classList.contains("augmentType") ? target.nextElementSibling : target;
  const type = target.parentElement.id.slice(0, -7);
  // target.selectedIndex = 0;
  const budget = getRemainingPoints(augment.parentElement);
  // if (temp !== 0) target.selectedIndex = temp;
  const skillOutputs = Object.values(document.querySelectorAll(`#${type}Skills>output`));

  switch (augmentType.value) {
    case "-Skill":
      skillOutputs.forEach((x, index) => {
        if (!augment.children[index + 1]) return;
        const enabled = +x.textContent.split(" ")[1] <= 0 && index + 1 !== augment.selectedIndex;
        augment.children[index + 1]?.classList.toggle("augInvis", enabled);
        augment.children[index + 1].disabled = enabled;
      });
      break;
    case "+Slots":
      for (let i = 1; i <= 3; i++) {
        let check = budget - (isNaN(+augment.value) ? 0 : +augment.value) < [0, 6, 12, 18][i];
        augment.children[i].classList.toggle("augInvis", check);
        augment.children[i].disabled = check;
      }

      break;
    case "+Skill":
      Object.values(augment.children).forEach((option) => {
        let shouldDisplay =
          +option.value + (budget - (isNaN(+augment.value) ? 0 : +augment.value)) >= 0 &&
          (skillOutputs.length < 5 ||
            skillOutputs.some((skills) => skills.textContent.includes(option.textContent.split(" ")[0])));

        option.classList.toggle("augInvis", !shouldDisplay);
        option.disabled = !shouldDisplay;
      });
      break;
    default:
      break;
  }
};
// document.querySelectorAll(".decoDisplay select").forEach((select) =>
// select.addEventListener("change", (e) => {
// e.target.children.forEach((option) => (option.disabled = option.style.display === "none"));
// })
// );

// const selectElements = document.querySelectorAll("select");
// selectElements.forEach((select) => {
// observer.observe(select, { childList: true });
// });

// const updateAugmentOptions = augment => {
// 	const budget = getRemainingPoints(augment.parentElement);
// 	const skillOutputs =
// 			document.querySelectorAll(`#${augment.parentElement.id.slice(0, -7)}Skills>output`)

// 	switch (augment.previousElementSibling.value) {
// 		case '-Skill':
// 			skillOutputs.forEach(
// 				(x, index) =>
// 					augment.children[index + 1].style.display =
// 						(+x.selectedOptions[0].textContent.slice(-1) > 0 || index+1===augment.selectedIndex)

// 							? ''
// 							: none)

// 			break;
// 		case '+Skill':
// 			Object.values(augment.children).forEach(option => {
// 				option.style.display =
// 					option.value <= budget &&
// 					(skillOutputs.length < 5 ||
// 						skillOutputs.some(skills =>
// 							skills.textContent.includes(option.textContent.slice(0, -5))
// 						))
// 						? ''
// 						: 'none';

// 			});
// 			break;
// 		case '+Slots':
// 			Object.values(augment.children).forEach(option => {
// 				option.style.display = option.value <= budget ? '' : 'none';
// 			});
// 			break;

// 		default:
// 			break;
// 	}
// };
const setDecoDisplay = (id, decos) => {
  const newContain = document.createElement("section");
  newContain.className = "decoDisplay";
  const target = document.querySelector(`#${id}Decos`);
  const startingIndex = Object.values(target?.children).map((x) => x.selectedIndex);

  decos.forEach((deco, index) => {
    const img = document.createElement("img");
    img.classList.add("armorImg", "armorDeco", `lvl${deco}`);
    img.src = `./icons/Lvl${deco}.png`;

    newContain.appendChild(img);

    const newMenu = document.createElement("select");
    newMenu.classList.add("armorDisplay");

    const option = document.createElement("option");
    option.textContent = " ---- ";
    newMenu.appendChild(option);

    let j = 4;
    while (--j > -1) {
      const disabledOption = document.createElement("Option");
      disabledOption.classList.add("optTitle");
      disabledOption.textContent = `Lvl-${j + 1} Decos`;
      if (deco <= j) {
        disabledOption.style.display = "none";
        disabledOption.disabled = true;
      }
      newMenu.appendChild(disabledOption);

      Object.values(info.types.decoLevels[j]).forEach((decoList) => {
        const option = document.createElement("option");
        option.value = `${j + 1}`;
        option.textContent = `${Object.keys(decoList)} +${Object.values(decoList)}`;
        if (deco <= j) {
          option.style.display = "none";
          option.disabled = true;
        }
        newMenu.appendChild(option);
      });
    }
    newContain.appendChild(newMenu);
  });

  target?.replaceWith(newContain);
  newContain.id = `${id}Decos`;
  Object.values(document.querySelector(`#${id}Decos`).children).map((x, i) => {
    if (x.childElementCount && startingIndex[i]) {
      x.selectedIndex = x.children[startingIndex[i]]?.style.display !== "none" ? startingIndex[i] : 0;
    }
  });
};

//   ["lvl1", "lvl2", "lvl3", "lvl4"].forEach((lvl, index1) => {
//     document.querySelectorAll(`.${lvl}+select`).forEach((slot, index2) => {
//       for (let i = 0; i < slot.childElementCount; i++) {
//         if (
//           slot.children[i].value <= index1 + 1 &&
//           slot.children[i].textContent.includes(decos[index1][index2])
//         ) {
//           slot.selectedIndex = i;
//           break;
//         }
//       }
//     });
//   });
// };
// document.addEventListener('click', e => {
// if (
// e.target.className.includes('skillInput inc') ||
// e.target.className.includes('skillInput dec')
// ) {
// const id = e.target.className.slice(16).replace(/\s/g, '');
// const select = document.getElementById(id);
// if (e.target.className.includes('dec')) {
// select.selectedIndex = Math.max(select.selectedIndex - 1, 0);
// } else {
// select.selectedIndex = Math.min(
// select.selectedIndex + 1,
// info.decos.maxDeco[id]
// );
// }
// dataCompile(e);
// }
// });

const getDrugIndex = (target) => Object.values(document.getElementById("comboCountDisplay").children).indexOf(target);
document.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", getDrugIndex(e.target));
});
document.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  const data = e.dataTransfer?.getData("text/plain");
  if (e.target.parentElement.id === "comboCountDisplay") {
    e.target.before(Object.values(document.getElementById("comboCountDisplay")?.children)[+data]);
  }
  comboTracker = Object.values(comboCountDisplay.children).map((x) => x.className.split(" ")[0]);
});
const validator = (parent, value = 0) => {
  // document.querySelectorAll(`#${parent.parentElement.id}>output>output`).forEach(x => {
  // if (+x.selectedOptions[0].textContent.slice(-2) < 0) {
  // let passes = 7
  // while (true) {
  // const  augmentType =document.querySelector(`#${parent.id}>select.
  // mentType:nth-type(--passes)`)
  // // if (augmentType.selectedOptions[0].textContent === '-Skill' && augmentType?.nextElementSibling.selectedOptions[0].textContent.includes(augmentType.textContent.slice(0, -4))){
  // augmentType.selectedIndex = 0;
  // augmentType.nextElementSibling.selectedIndex = 0;
  // break;
  // }
  // }
  //
  //
  // }
  //
  // })
  const armorType = parent.id.slice(0, -7);
  setArmorSkillsDisplay([armorType]);
  const armor = getArmor(armorType);

  const ugh = Object.values(document.querySelectorAll(`#${armorType}Skills>output`)).map((thisOutput) => {
    if (+thisOutput.textContent.slice(-2) < 0) {
      Object.values(document.querySelectorAll(`#${armorType}Qurious>select.augment`)).filter(
        (augSelect) => !augSelect.selectedOptions[0]?.textContent.includes(thisOutput.textContent.slice(0, -4))
      );
    }
  });
  ugh.forEach((x) => {
    if (x) {
      x[x.length - 1].selectedIndex = -1;
      x[x.length - 1].previousSibling.selectedIndex = -1;
      setArmorSkillsDisplay([armorType]);
    }
  });
  value += armor.quriousPoints;
  for (let i = 0; i < 6; i++) {
    const thisAugment = document.querySelectorAll(`#${parent.id}>select.augment`)[i];
    if (value + +thisAugment.value < 0) {
      thisAugment.selectedIndex = -1;
      document.querySelectorAll(`#${parent.id}>select.augmentType`)[i].selectedIndex = -1;
    }
    value += +thisAugment.value;
  }
  parent.firstElementChild.textContent = `Remaining Points ${`${value}/${armor.quriousPoints}`}`;
  return value;
};
// document.addEventListener("click", (e) => {
//   if (e.target.tagName === "Button" || e.target.classList.contains("scroll")) {
//     dataCompile(e);
//   }
// });
Object.values(document.querySelectorAll(".augmentType, .augment")).forEach((x) =>
  x.addEventListener("change", (e) => {
    e.stopPropagation();

    if (e.target?.className.includes("augment")) {
      if (e.target.classList.contains("augmentType")) {
        ChangeDropdownOptions(e.target);
      } else {
        // createAugmentOptions(e.target);
        updateAugmentOptions(e.target);
      }
      validator(e.target.parentElement);
      setArmorSkillsDisplay([e.target.parentElement.id.slice(0, -7)]);
      updateSelectedSkillsDisplay();
      // }
      console.log("augChange");
      // };
    }
  })
);

document.querySelectorAll("button").forEach((element) => element.addEventListener("mousedown", (e) => dataCompile(e)));

document
  .querySelectorAll("select,input")
  .forEach((element) => element.addEventListener("change", (e) => dataCompile(e)));
const resetAugmentSelections = (armorType) => {
  document
    .querySelectorAll(`#${armorType}Qurious select`)
    .forEach((select) => (select.selectedIndex = select.classList.contains("augmentType") ? 0 : -1));
  updateSelectedSkills();
};
document.querySelectorAll("section.armorDisplay").forEach((x) =>
  x.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
      updateSelectedSkillsDisplay();
    }
  })
);
// document.querySelectorAll("section.armorDisplay select").forEach((x) =>
// x.addEventListener("change", (e) => {
// if (e.target?.className.includes("armor")) {
// resetAugmentSelections(e.target.id);
// } else {
// updateSelectedSkills();
// }
// })
// );
document.querySelectorAll("select.augment,select.augmentType").forEach((select) => {
  // updates available augment selections on mousedown
  select.addEventListener("mousedown", (e) => {
    // if (e.target !== window.event?.target) return;
    if (!e.target.classList.contains("augmentType")) {
      // ChangeAugmentOptions(e.target);
      // } else {
      let tempVal = e.target.selectedIndex;

      updateAugmentOptions(e.target);
      if (tempVal > e.target.selectedIndex && e.target.selectedIndex <= 0) {
        // e.target.selectedIndex = tempVal;
        // e.target.selectedOptions[0]?.classList?.remove("augInvis");
        // e.target.selectedOptions[0].disabled = false;
      }
    }
    if (e.target.previousElementSibling?.selectedIndex < 1) {
      Object.values(e.target.children).forEach((x) => (x.disabled = true));
      // if()e.target.nextElementSibling.selectedIndex = 0;
    } else {
      Object.values(e.target.children).forEach((x) => (x.disabled = false));
    }
    updateSelectedSkillsDisplay();
  });
});
// updates available augment selections on change
document.querySelectorAll("select.armor").forEach((select) => {
  select.addEventListener("change", (e) => {
    const type = e.target.className.split(" ")[0];
    const armor = getArmor(type);
    document.querySelector(
      `section#${type}Qurious>output.currentPoints`
    ).textContent = `Remaining Points ${armor.quriousPoints}/${armor.quriousPoints}`;
    setArmorSkillsDisplay([type]);
  });
});

document.querySelectorAll("input, button:not(#setReturn button), select:not(#setReturn select)").forEach((x) => {
  x.addEventListener("change", () => updateSelectedSkills(x));
});

document.querySelector("#weaponSelects>#Qurious")?.addEventListener("mousedown", () => {
  document.getElementById("augToggle")?.classList.remove("augInvis");
});
//
// document
// .querySelectorAll(".armorDisplay button.inc:not(.augButton), .armorDisplay button.dec:not(.augButton)")
// .forEach(async (x) =>
// x.addEventListener("mousedowm", (e) => {
// hideShowMenu(e.target);
// })
// );

// document.querySelectorAll('.augmentType, .augment').forEach(async x =>
// x.addEventListener('mousedown', e => {
// const {target} = e;
// if (target.className.includes('augment')) {
// lastEvent = target;
// if (!target.className.includes('Type')) {
// if (target.previousElementSibling?.selectedIndex < 1) {
// Object.values(target.children).forEach(child => child.remove());
// }
// } else {
// Object.values(target.children).forEach(option => {
// if (
// target.previousElementSibling.selectedIndex === undefined ||
// target.previousElementSibling.selectedIndex >= 1
// ) {
// option.disabled = false;
// } else {
// option.disabled = true;
// }
// });
// }
// }
// })
// );

// if (
// Object.values(document.querySelectorAll('.menu')).every(
// x => x.style.display !== 'none' && !x.contains(target)
// )
// )
// document.querySelector('div.menu').style.display = 'none';
// }
// 	let currentpos = 0;
// 	let droppedpos = 0;
// 	for (let it = 0; it < items.length; it++) {
// 		if (current == items[it]) {
// 			currentpos = it;
// 		}
// 		if (i == items[it]) {
// 			droppedpos = it;
// 		}
// 	}
// 	if (currentpos < droppedpos) {

// 	} else {
// 		i.parentNode.insertBefore(current, i);
// 	}
// }
// };
// Rearrange the list elements here
// });
// document.addEventListener('drag', e => {
// 	if (e.target.className.includes('comboHits')) slist(e.target);
// });

// document.addEventListener('dragstart', e => {
// 	if (e.target.className.includes('comboHits')) slist(e.target);
// });

// document.addEventListener('drag', e => {
// 	if (e.target.className.includes('comboHits')) slist(e.target);
// });

// function slist(target) {
// 	// (A) SET CSS + GET ALL LIST ITEMS
// 	target.classList.add('slist');
// 	const items = target.getElementsByTagName('li');
// 	let current = null;

// 	// (B) MAKE ITEMS DRAGGABLE + SORTABLE
// 	for (const i of items) {
// 		// (B1) ATTACH DRAGGABLE
// 		i.draggable = true;

// 		// (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
// 		i.ondragstart = ev => {
// 			current = i;
// 			for (const it of items) {
// 				if (it != current) {
// 					it.classList.add('hint');
// 				}
// 			}
// 		};

// 		// (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
// 		i.ondragenter = ev => {
// 			if (i != current) {
// 				i.classList.add('active');
// 			}
// 		};

// 		// (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
// 		i.ondragleave = () => {
// 			i.classList.remove('active');
// 		};

// 		// (B5) DRAG END - REMOVE ALL HIGHLIGHTS
// 		i.ondragend = () => {
// 			for (const it of items) {
// 				it.classList.remove('hint');
// 				it.classList.remove('active');
// 			}
// 		};

// 		// (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
// 		i.ondragover = evt => {
// 			evt.preventDefault();
// 		};

// 		// (B7) ON DROP - DO SOMETHING
// 		i.ondrop = evt => {
// 			evt.preventDefault();
// 			if (i != current) {
// 				let currentpos = 0;
// 				let droppedpos = 0;
// 				for (let it = 0; it < items.length; it++) {
// 					if (current == items[it]) {
// 						currentpos = it;
// 					}
// 					if (i == items[it]) {
// 						droppedpos = it;
// 					}
// 				}
// 				if (currentpos < droppedpos) {
// 					i.parentNode.insertBefore(current, i.nextSibling);
// 				} else {
// 					i.parentNode.insertBefore(current, i);
// 				}
// 			}
// 		};
// 	}
// }
// function dragstart_handler(ev) {
// Create an image and then use it for the drag image.
// NOTE: change "example.gif" to a real image URL or the image
// will not be created and the default drag image will be used.
// let img = new Image();
// img.src = 'example.gif';
// ev.dataTransfer.setDragImage(img, 10, 10);
//   }
// function searchMenu() {
// const input = document.getElementById('skillSearch');
// const filter = input.value.toUpperCase();
//
// Loop through all list items, and hide those who don't match the search query
// document.getElementById('dropSkills').childNodes.forEach(x => {
// x.style.display =
// x.outerText.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
// });
// }

// if ('ServiceWorker' in navigator) {
// navigator.serviceWorker.register('/sw.js', {scope: './'}).then(
// registration => {
// console.log('active', registration);
// },
// error => {
// console.log(`fail:${error}`);
// }
// );
// } else {
// console.log('N/A');
// }
/*
aditional qurious skills
dynamic additional skills
offload all work to webworker
add more webworker
add better support for +slots upgrade
make exception to sometimes socket lvl 1 deco in lvl 4 slots



*/

setTimeout(function () {
  document.querySelectorAll("option").forEach((option) => {
    option.disabled = option.style.display === "none";
  });
}, 100);
weaponType.addEventListener("change", () => {
  weaponSelect();
  classChange();
  rampageSelect();
  monChart();
  partSelector();
  comboReset();
});
dropWeapon.addEventListener("change", () => rampageSelect());
document.querySelectorAll("select.menu").forEach((menu) =>
  menu.addEventListener("change", (e) => {
    updateQuest(e.target.selectedOptions[0].value);
    monChart();
    healthSelect();
  })
);
document.getElementById("players")?.addEventListener("change", () => healthSelect());
dropQuest.addEventListener("change", () => {
  monChart();
  healthSelect();
});
dropMon.addEventListener("change", () => {
  partSelect();
  questSelect();
  healthSelect();
  monChart();
});
document.querySelector("#questButton").addEventListener("mousedown", () => showMenu());

Object.values(document.querySelectorAll("#searchAgain, #startSearch")).forEach((menu) =>
  menu.addEventListener("change", () => getSetBuilds(7))
);

Object.values(document.querySelectorAll(".armorImg+.charm")).forEach((menu) =>
  menu.addEventListener("change", (e) => setCharmsAvailableDecoSlots(e.target))
);
document.querySelector(".extraSkills").addEventListener("mousedown", (e) => {
  if (e.target.tagName === "BUTTON") {
    addPoints(e.target.textContent.split(" +"));
  }
});
document.querySelector(".grid").addEventListener("mousedown", (e) => {
  if (e.target.tagName === "BUTTON") {
    let parentIndex = Object.values(document.querySelectorAll("div.grid > div.setResult")).indexOf(
      e.target.parentElement
    );
    let build = GlobalMap.get(parentIndex + 1)[e.target.parentElement.lastElementChild.selectedIndex];
    let charm = GlobalMap.get("charms")[build.charmIndex];
    equipBuild(build, charm);
    const buildTest = {};
    build.usedSkills.forEach((entry) => {
      const points = !entry[3] ? entry[1] : entry[1] * entry[3];
      if (!buildTest[entry[0]]) {
        buildTest[entry[0]] = points;
      } else {
        buildTest[entry[0]] += points;
      }
    });
    console.log({ build, charm, buildTest });
    document.getElementById("setReturn").classList.add("augInvis");
    dataCompile();
    document.querySelectorAll(`.extraSkills>button`).forEach((x) => x.remove());
    document.querySelectorAll(`.grid>div`).forEach((x) => x.remove());
    GlobalMap.clear();
  }
});
let newSkills = {};
let totalCombos = 0;
let timer = 0;
let GlobalMap = new Map();
let workers = [];
let workerCount = 0;
let GlobalFragment = document.createDocumentFragment();
let totalSets = 0;
let setsDisplayed = 0;
const getUsedDecoArr = (usedDecos) => {
  const decos = [[], [], [], []];
  for (let j = 0; j < usedDecos.length; j++) {
    if (usedDecos[j][2] && usedDecos[j][2]?.includes("Slot lvl")) {
      const level = +usedDecos[j][2].slice(-1);
      let limit = usedDecos[j][3];
      while (--limit >= 0) {
        decos[level - 1].push(usedDecos[j][0]);
      }
    }
  }
  return decos;
};
const setAugmentAuto = (armor, augTypeDropdowns) => {
  let dropdownPointer = 0;
  armor.augs.forEach((augment) => {
    let augTypeDropdown = augTypeDropdowns[dropdownPointer];
    let augmentDropdown = augTypeDropdown.nextElementSibling;
    let [augType, aug] = Object.entries(augment)[0];
    if (augType === "-Skill" && armor.points >= 5) {
      // if tue remove 5 points and change augType to -Def as loosing a skills isnt necessary
      armor.points -= 5;
      augType = "-Def";
    } else if (augType === "-Def" && armor.points >= 5) {
      // if tue remove 5 points and continue as the augment was not needed
      armor.points -= 5;
      return;
    }
    let thisIndex = 0;
    Object.values(augmentDropdown.children).forEach((x) => x.remove());
    //clear current augmentDropdown selections and add the default
    augmentDropdown.innerHTML += '<option value="0"> ---- </option>';
    switch (augType) {
      case "-Def":
        augTypeDropdown.selectedIndex = 1;
        for (let i = 3; i <= 5; i += 2) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = `-${i} Def`;
          augmentDropdown.appendChild(option);
        }
        augmentDropdown.selectedIndex = 2;
        break;
      case "-Skill":
        augTypeDropdown.selectedIndex = 2;
        let skillsList = document.querySelectorAll(`#${armor.type}Skills>output`);
        let thisSkill = Object.keys(armor.skills.pop())[0];

        for (let i = 0; i < skillsList.length; i++) {
          if (skillsList[i].textContent.includes(thisSkill)) {
            thisIndex = i;
          }
          const option = document.createElement("option");
          option.value = 10;
          option.textContent = `${skillsList[i].textContent.split("\n")[0].split(" ")[0]} 10`;
          augmentDropdown.appendChild(option);
        }
        augmentDropdown.selectedIndex = thisIndex+1;
        break;
      case "+Skill":
        augTypeDropdown.selectedIndex = 4;
        Object.entries(info.types.qurious).forEach(([skillName, points], i) => {
          if (skillName.includes(aug)) {
            thisIndex = i;
          }
          const option = document.createElement("option");
          option.value = -points;
          option.textContent = `${skillName} -${points}`;
          augmentDropdown.appendChild(option);
        });
        augmentDropdown.selectedIndex = thisIndex+1;
        break;
      case "+Slots":
        augTypeDropdown.selectedIndex = 3;
        for (let i = 1; i <= 3; i++) {
          const cost = -6 * i;
          const option = document.createElement("option");
          option.value = cost;
          option.textContent = `${i} Slot ${cost}`;
          augmentDropdown.appendChild(option);
        }
        augmentDropdown.selectedIndex = aug / -6;
        break;
      default:
        break;
    }
    ++dropdownPointer;
  });
};

const setUsedDecorations = (decos) => {
  document.querySelectorAll(".decoDisplay>img.armorDeco").forEach((slot) => {
    if (!decos[slot.className[22] - 1]) return;
    Object.values(slot.nextElementSibling.children).some((option, index1) => {
      if (+option.value <= slot.className[22] && option.textContent.includes(decos[slot.className[22] - 1][0])) {
        slot.nextElementSibling.selectedIndex = index1;
        return decos[slot.className[22] - 1].shift();
      }
    });
  });
};
const setAugmentDropdown = (select, text) => {
  for (let i = 0; i < select.childElementCount; i++) {
    if (select.children[i].textContent.includes(text)) {
      select.selectedIndex = i;
      setArmorSkillsDisplay([select.id]);
      return;
    }
  }
};
const setCharmSelects = (charm) => {
  let skillArray = [].concat(Object.keys(charm[0]), Object.keys(charm[1]));

  const charmSelects = document.querySelectorAll("select.charm");
  for (let i = 0; i < skillArray.length; i++) {
    const select = charmSelects[i];
    for (let j = 0; j < select.options.length; j++) {
      if (select.options[j].textContent.includes(skillArray[i])) {
        select.selectedIndex = j;
        setCharmsAvailableDecoSlots(select);
        break;
      }
    }
  }
};
const updateSelectedSkillsDisplay = () => {
  const selectedSkills = getCurrentSelectedSkills();
  const currentArmorSkills = getCurrentArmorSkills(selectedSkills);
  const sortedArmorSkills = Object.entries(currentArmorSkills).sort();
  const equipedSkillDisplay = document.querySelector("#EquipedSkillDisplay output");
  let skillsString = "";
  sortedArmorSkills.forEach(([name, value]) => {
    skillsString += `${name}: ${+value}<br>`;
  });
  equipedSkillDisplay.innerHTML = skillsString;
};

const equipBuild = (set, charm) => {
  const { armors: theseArmors, usedSkills: usedSlots } = set;
  // sets both the charms selected Skills, and usable slots
  setCharmSelects(charm);
  for (const [armorName, armorStats] of theseArmors) {
    // sets the selected armors and resets the skills skills and decos
    setAugmentDropdown(document.getElementById(armorStats.type), armorName);
    resetAugmentSelections(armorStats.type);
    setArmorSkillsDisplay([armorStats.type]);
  }
  for (const armor of theseArmors) {
    let augmentTypeDropdown = document.querySelectorAll(`#${armor[1].type}Qurious>select.augmentType`);
    // resets and sets the augmented type dropdown and augment dropdown
    setAugmentAuto(armor[1], augmentTypeDropdown);
    // validate this card and update the skills and points displayed
    validator(document.getElementById(`${armor[1].type}Qurious`));
  }
  // }
  setUsedDecorations(getUsedDecoArr(usedSlots));
  updateSelectedSkillsDisplay();
  // setTimeout(async() => {
};
const appendElements = () => {
  requestIdleCallback(() => document.querySelector(".grid")?.append(GlobalFragment));
};
// const getBuildInfo = (target) => {
// retrieves information for
// const index = Object.values(document.querySelectorAll("div.grid>div")).indexOf(target.parentElement);
// const index2 = document.querySelector(`div.grid>div:nth-child(${index + 1})>div>select`).selectedIndex;
// return {
// setSkills: GlobalMap.get(index).newSkills,
// set: GlobalMap.get(index).sets[index2],
// };
// };

const setUsedDecos = (target) => {
  ["lvl4", "lvl3", "lvl2", "lvl1"].forEach((lvl) => {
    const decosUsed = target.usedSkills.filter((skills) => skills[2].includes(lvl));
    const theseSelects = document.querySelectorAll(`.${lvl}`);
    for (let j = 0; j < decosUsed.length; j++) {
      for (let k = 0; k < theseSelects[j].children.length; k++) {
        if (
          theseSelects[j].children[k].value <= lvl &&
          theseSelects[j].children[k].textContent.includes(decosUsed[j][0])
        )
          theseSelects[j].selectedIndex = k;
        break;
      }
    }
  });
};

const getTotal = (newSkills, skillInfo = info.types) => {
  const skills = getSetRequirements().skills;
  const { armorSkills, remainingSlots, quriousSkills } = newSkills;
  for (let i = 0; i < 4; ++i) {
    if (!remainingSlots[i]) continue;
    skillInfo.decoLevels[i].forEach((skill) => {
      const [skillName, skillLvl] = Object.entries(skill)[0];
      if (skills[skillName]) return;
      if (armorSkills[skillName]) {
        armorSkills[skillName] += +skillLvl * remainingSlots[i];
      } else {
        armorSkills[skillName] = +skillLvl * remainingSlots[i];
      }
    });
  }
  Object.entries(skillInfo.qurious).forEach(([skillName, quriousCost]) => {
    if (quriousSkills[quriousCost / 3 - 1]) {
      if (armorSkills[skillName]) {
        armorSkills[skillName] = armorSkills[skillName] + quriousSkills[quriousCost / 3 - 1];
      } else {
        armorSkills[skillName] = quriousSkills[quriousCost / 3 - 1];
      }
    }
  });
  return Object.entries(armorSkills)
    .map((skill) => [skill[0], Math.min(+skill[1], skillInfo.maxDeco[skill[0]] ?? info.skills[skill[0]].length - 1)])
    .sort();
};

const expandText = (target) => {
  Object.values(target.children).forEach((child) => (child.textContent = child.value));
};
const abbreviateText = (target) => {
  const abbr = (string) => {
    let arg1 = string.replace(/[^A-Z1-9:& /,]/g, "");
    let arg2 = string.substring(0, 3) + ":";
    return string, arg1.length === 2 ? arg2 : arg1;
  };
  Object.values(target.children).forEach((child) => {
    let string = child.value.split(" ");
    for (let i = 0; i < 4; ++i) {
      string[i * 3] = abbr(string[i * 3]);
    }
    child.textContent = string.join(" ");
  });
};
const setOutput = (extraSkills) => {
  extraSkills.forEach((skill) => {
    const thisSkill = document.createElement("button");
    thisSkill.textContent = `${skill[0]} +${+skill[1]}`;
    // thisSkill.setAttribute("onclick", `addPoints(["${skill[0]}", ${+skill[1]}])`);
    document.querySelector(".extraSkills").append(thisSkill);
  });
  console.log((performance.now() - timer) / 1000);
};
const memo = new Map();

const getUsedCharm = (sets) => {
  const abbr = (string) => {
    let arg1 = string.replace(/[^A-Z1-9:& /,]/g, "");
    let arg2 = string.substring(0, 3);
    return string, arg1.length === 1 ? arg2 : arg1;
  };
  const returnVal = [];
  sets.forEach((set) => {
    const getSkills = GlobalMap.get("charms")[set.charmIndex].map((skillSet) => Object.entries(skillSet));
    const key = `${getSkills[0][0][0]} ${getSkills[0][0][1]} ${getSkills[0][1][0]} ${getSkills[0][1][1]} ${getSkills[1][0][0]} ${getSkills[1][0][1]} ${getSkills[1][1][0]} ${getSkills[1][1][1]}`;
    if (memo.has(key)) {
      returnVal.push(memo.get(key));
    } else {
      const skills = [
        `${getSkills[0][0][0]}: ${getSkills[0][0][1]} & ${getSkills[0][1][0]}: ${getSkills[0][1][1]} / ${getSkills[1][0][0]}: ${getSkills[1][0][1]} & ${getSkills[1][1][0]}: ${getSkills[1][1][1]}`.replace(
          /,/g,
          ""
        ),
        `${abbr(getSkills[0][0][0])}: ${getSkills[0][0][1]} & ${abbr(getSkills[0][1][0])}: ${
          getSkills[0][1][1]
        } / ${abbr(getSkills[1][0][0])}: ${getSkills[1][0][1]} & ${abbr(getSkills[1][1][0])}: ${getSkills[1][1][1]}`,
      ];
      memo.set(key, skills);
      returnVal.push(skills);
    }
  });
  return returnVal;
};

// const charmMemo = new Map();
// Object.keys(info.types.maxDeco).forEach((x) => {
// let arg1 = x.replace(/[^A-Z1-9:& /,]/g, "");
// let arg2 = x.substring(0, 3);
// charmMemo.set(x, arg1.length === 1 ? arg2 : arg1);
// });

// const getUsedCharm = (sets) => {
//   const returnVal = [];
//   const full = [];
//   const abbrev = [];
//   sets.forEach((set) => {
//     const getSkills = GlobalMap.get("charms")[set.charmIndex].map((skillSet) => Object.entries(skillSet));
//     full.push(getSkills.map((innerArr) => innerArr.map((item) => `${item[0]}${item[1]}`).join(" & ")).join(" / "));
//     abbrev.push(
//       getSkills
//         .map((innerArr) =>
//           innerArr.map((item) => charmMemo.get(item[0]) || `${item[0].substring(0, 3)}:${item[1]}`).join(" & ")
//         )
//         .join(" / ")
//     );
//   });
//   returnVal.push(full, abbrev);
//   return returnVal;
// };
// console.log(getUsedCharm2(set));

const recieveMessage = (sets,flag) => {
  for (let k = 0; k < sets.length; k++) {
    const set = sets[k];

    // if (totalCombos >= 50000) {
    // workers=[],
    // workerCount = 0}

    GlobalMap.set(GlobalMap.size, set);
    const charms = getUsedCharm(set);
    const fragment = document.createDocumentFragment();
    const button = document.createElement("button");

    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    // button.setAttribute("onmousedown", `setBuild(${GlobalMap.size - 1})`);
    button.classList.add("equipBuild");
    button.textContent = "Equip Build";
    fragment.appendChild(button);
    for (let i = 0; i < 5; i++) {
      // Create elements and append to fragment
      const img = document.createElement("output");
      img.className = `armorImg ${["helm", "chest", "arm", "waist", "leg"][i]}`;
      fragment.appendChild(img);
      const label = document.createElement("span");
      label.textContent = set[0].armors[i][0];
      fragment.appendChild(label);
    }
    const select = document.createElement("select");
    select.classList.add("armorCharm");
    select.setAttribute("title", "charm1Skill1");
    select.onmousedown = () => expandText(select);
    select.onchange = () => abbreviateText(select);
    select.onfocusout = () => abbreviateText(select);
    const img = document.createElement("output");
    img.className = "armorImg charm";
    fragment.appendChild(img);
    charms.forEach((charm) => {
      const option = document.createElement("option");
      option.value = charm[0];
      option.textContent = charm[1];
      select.appendChild(option);
    });
    fragment.appendChild(select);

    // Create a new row for the object
    const card = document.createElement("div");
    card.classList.add("setResult");
    card.appendChild(fragment);
    GlobalFragment.append(card);
    if (!(GlobalMap.size % 20||flag) - 1) {
      document.querySelector(".grid").append(GlobalFragment);
      document.getElementById("setOutput").textContent = `Displayed ${GlobalMap.size - 1} Builds / ${formatNumbers(
        totalCombos
      )} Combinations`;
    }
    // if (e.data[1] && k === select.length - 1) {
    // e.target.terminate();
    // if (--workerCount === 0) {
    // setOutput(getTotal(newSkills));
    // document.getElementById(
    // "setOutput"
    // ).textContent = `Found ${totalSets} Builds / ${totalCombos} Combinations`;

    // console.log(totalCombos, GlobalMap);
    // if (GlobalMap.size < 101) {
    // appendElements();
    // document.getElementById("setOutput").textContent = `Displayed ${
    // GlobalMap.size - 1
    // } Builds / ${totalCombos} Combinations`;
    // document.getElementById("extraOutput").textContent = `Found ${
    // GlobalMap.size - 1
    // } Builds / ${totalCombos} Combinations`;
    // }
    // }
    // }
  }
};
const getSkillReq = (skills = []) => {
  document.querySelectorAll(".buildSkills>div>.skill").forEach((skill) => {
    if (skill.selectedIndex > 0) skills.push([skill.id, skill.selectedIndex]);
  });
  return skills;
};

const getSetRequirements = (types = info.types) => {
  const skills = {};
  const skillInfo = {};

  document.querySelectorAll("#skillSelect>div>output").forEach((skill) => {
    if (+skill.textContent.match(/(?<=Lv-)\d/)[0] > 0) {
      skills[skill.className.split(" ")[1]] = -skill.textContent.match(/(?<=Lv-)\d/)[0];
      skillInfo[skill.className.split(" ")[1]] = {
        lvl: types.decos[skill.className.split(" ")[1]] ?? 5,
        lvl4: types.Lvl4[skill.className.split(" ")[1]] ?? 0,
        max: types.maxDeco[skill.className.split(" ")[1]] - +skill.textContent.match(/(?<=Lv-)\d/)[0],
        qurious: (types.qurious[skill.className.split(" ")[1]] ?? 60) / 3,
      };
    }
  });
  return {
    skills: Object.fromEntries(
      Object.entries(skills).sort(
        (a, b) =>
          skillInfo[b[0]].qurious - skillInfo[a[0]].qurious ||
          skillInfo[b[0]].lvl - skillInfo[a[0]].lvl ||
          skillInfo[a[0]].lvl4 - skillInfo[b[0]].lvl4
      )
    ),
    skillInfo,
  };
};

function applyArmorFilter(skills, skillInfo, maxArmorsPerType) {
  let retrieveArmorData = new Map(Object.entries(JSON.parse(JSON.stringify(info.armor))));
  const armors = {};
  // sets a baseline for deco slot ratings based off the approx aug cost the slot will be used for / 3 for to simplify my life
  const pointsForDecos = [1, 5, 5, 6];
  // Finds how many skills of each level are used
  const skillScore = [0, 0, 0, 0];

  // gives points per level to figure how many slots of each level can be used
  // lvl 2 skills are left out because they are the most used and as such are given a static value
  Object.entries(skills).forEach((skill) => {
    // If skill has a lvl4Deco that gives at least two points and is not a lvl 1 skill adds points
    if (skillInfo[skill[0]].lvl < 3 || skillInfo[skill[0]].lvl === 2) {
      // ~~(pointsNeeded / 2) points are +2 per and odd amounts would be wasted
      skillScore[3] += ~~(skill[1] / 2);
      // if skill is a lvl 4 skill only that also only gives 1 point
    } else if (skillInfo[skill[0]].lvl4 === 4) {
      skillScore[3] += 2;
    }

    if (skillInfo[skill[0]].lvl === 1) {
      skillScore[0] += skill[1];
    } else if (skillInfo[skill[0]].lvl === 3) {
      skillScore[2] += skill[1];
    }
  });
  // skill[1] is are negative values. If a set requires more of a slot then is common to find in almost any combination anyway then it gives extra points to find more.
  //If not they are given as much as a lvl 2 as thats what they will be used for
  pointsForDecos[0] = skillScore[0] < -5 ? 0.75 : 0;
  pointsForDecos[2] = skillScore[2] < -3 ? 6 : 5;
  pointsForDecos[3] = skillScore[3] < -3 ? 8 : 6;
  for (let i = 0; i < 5; i++) {
    const armorType = ["helm", "waist", "chest", "arm", "leg"][i];
    // makes sure only male or female versions are used. doesnt matter which version as they are identical
    retrieveArmorData.set(
      armorType,
      retrieveArmorData.get(armorType).filter((x) => x.sex !== "MaleOnly")
    );
  }

  ["helm", "waist", "chest", "arm", "leg"].forEach((armorType) => {
    armors[armorType] = [];
    retrieveArmorData.get(armorType).forEach((thisPiece) => {
      if (!thisPiece) return;
      thisPiece.fodder = {};
      const theseSkills = thisPiece.skills;
      /* joins deco slot array into a string and for certain combinations that are almost guaranteed
             to be at least an equivelent exchange inceases them to the next lvl 2 slot is obtained  */
      const tester = thisPiece.decos.join("");
      // if case evalueated to tru then apply the augment
      switch (true) {
        // if has 3 lvl 1 slots
        case tester === "3000":
          // add alot lncrease lvl 1 to have 2 lvl 1s and 1 lvl 2 slot
          thisPiece.decos = [2, 1, 0, 0];
          // starts a variable to record augments used
          thisPiece.fodder.augs = [[{ "+Slots": -6 }], []];
          // subtracts qurious cost of the augment from pieces score
          thisPiece.quriousPoints -= 6;
          break;
        case tester === "2001":
          thisPiece.decos = [1, 1, 0, 1];
          thisPiece.fodder.augs = [[{ "+Slots": -6 }], []];
          thisPiece.quriousPoints -= 6;
          break;
        case tester === "1001":
          thisPiece.decos = [1, 1, 0, 1];
          thisPiece.fodder.augs = [[{ "+Slots": -12 }], []];
          thisPiece.quriousPoints -= 12;
          break;
        case tester === "2010":
          thisPiece.decos = [1, 1, 0, 1];
          thisPiece.fodder.augs = [[{ "+Slots": -12 }], []];
          thisPiece.quriousPoints -= 12;
          break;
        case tester === "0002":
          thisPiece.decos = [0, 1, 0, 2];
          thisPiece.fodder.augs = [[{ "+Slots": -12 }], []];
          thisPiece.quriousPoints -= 12;
          break;
        // case tester === "0110":
        // thisPiece.decos = [1, 1, 0, 1];
        // thisPiece.fodder.augs = [[{ "+Slots": -12 }], []];
        // thisPiece.quriousPoints -= 12;
        // break;
        case tester === "1020":
          thisPiece.decos = [0, 1, 0, 2];
          thisPiece.fodder.augs = [[{ "+Slots": -18 }], []];
          thisPiece.quriousPoints -= 18;
          break;
        case tester === "1002":
          thisPiece.decos = [0, 1, 0, 2];
          thisPiece.fodder.augs = [[{ "+Slots": -6 }], []];
          thisPiece.quriousPoints -= 6;
          break;
        // case tester === "0210":
        // thisPiece.decos = [0, 2, 0, 1];
        // thisPiece.fodder.augs = [[{ "+Slots": -6 }], []];
        // thisPiece.quriousPoints -= 6;
        // break;
        case thisPiece.quriousTable === 13:
          thisPiece.decos = [1, 1, 0, 1];
          thisPiece.fodder.augs = [[{ def: 5 }, { def: 5 }, { def: 5 }, { "+Slots": -18 }, { "+Slots": -6 }], []];
          thisPiece.quriousPoints -= 24;
          break;
        // case tester === '1010' || tester === '0001':
        // thisPiece.decos = [1, 1, 0, 1];

        // thisPiece.fodder.augs = [[{slots: -18}], []];
        // thisPiece.quriousPoints -= 18;
        // break;
        default:
          thisPiece.fodder = { points: 0, augCount: 3, augs: [[], []] };
          break;
      }

      // Adds skill points if StormSoul 4/5 is selected
      if (document.getElementById("StormSoul").selectedIndex > 3) {
        const thisBonus = document.getElementById("StormSoul").selectedIndex === 4 ? 1 : 2;

        for (const skill of theseSkills) {
          if (skillInfo[skill].qurious < 6) {
            theseSkills[skill] += thisBonus;
          }
        }
      }

      // Applies and gets the total weighed value for deco slots
      let thisArmorRating =
        thisPiece.decos[0] * pointsForDecos[0] +
        thisPiece.decos[1] * pointsForDecos[1] +
        thisPiece.decos[2] * pointsForDecos[2] +
        thisPiece.decos[3] * pointsForDecos[3];
      let tempForArmorRating = 0;
      // await thisArmorRating;
      for (let j = 0; j < Object.keys(theseSkills).length; j++) {
        /* Checks if skills on the pieces are used in the search and if so applies a value depending on the level of deco slot it uses
            for any skill not used in the search adds to a counter to find the maximum Qurious Points
            */
        // if skill is used
        if (skills[Object.keys(theseSkills)[j]]) {
          if (
            // if skill is a set bonus only obtainable on an armor piece
            skillInfo[Object.keys(theseSkills)[j]].qurious === 20 &&
            skillInfo[Object.keys(theseSkills)[j]].lvl === 5
          ) {
            // keep track of set bunus skills used in the set
            thisPiece.setBonus = {
              [Object.keys(theseSkills)[j]]: Object.values(theseSkills)[j],
            };
            // if the skill can only be gained from the armor piece boost this armors rating to guarantee its included
            thisArmorRating +=
              Math.min(skills[Object.keys(theseSkills)[j]] * -1, theseSkills[Object.keys(theseSkills)[j]]) * 30;
          } else {
            // adds points for skills used
            thisArmorRating +=
              // ensures it only gives points for a maximum of the times needed
              Math.min(skills[Object.keys(theseSkills)[j]] * -1, theseSkills[Object.keys(theseSkills)[j]]) *
                skillInfo[Object.keys(theseSkills)[j]].qurious ===
              20
                ? 4
                : skillInfo[Object.keys(theseSkills)[j]].qurious;
          }
          // special case for ibushi/narwa sets
        } else if (thisPiece.quriousTable !== 13) {
          tempForArmorRating += Object.values(theseSkills)[j];
          if (!thisPiece.fodder.fodderCount) {
            thisPiece.fodder.fodderCount = 0;
          }
          /* adds unused skills to a fodderCount variable so they can be accounted for 
                the extra augment points and extra skills if points not needed  */
          thisPiece.fodder.fodderCount += Object.values(theseSkills)[j];
          if (!thisPiece.fodder.skills) thisPiece.fodder.skills = [];
          for (let l = 0; l < Object.values(theseSkills)[j]; l++) {
            thisPiece.fodder.skills.push({ [Object.keys(theseSkills)[j]]: 1 });
          }
        }
      }
      // Ibushi/Narwa sets again these can not get skill augments
      if (thisPiece.quriousTable === 13) {
        thisPiece.totalQuriousPoints = 15 + thisPiece.quriousPoints;
        thisPiece.armorRating = thisArmorRating;
      } else {
        // assignes augments and extra points depending on how many fodder skills are available
        switch (tempForArmorRating) {
          case 0:
            thisPiece.totalQuriousPoints = 15 + thisPiece.quriousPoints;
            thisPiece.fodder.augs[0] = [{ "-Def": 5 }, { "-Def": 5 }, { "-Def": 5 }].concat(thisPiece.fodder.augs[0]);
            thisPiece.armorRating =
              thisArmorRating + ~~(Math.min(thisPiece.quriousAugs * 15, thisPiece.totalQuriousPoint) / 3);

            break;
          /* adds 10 points per fodderCount and 5 if none left.  Assumes 3 augments will be used to gain points as in 95% 
                of the time 3-4 are used. There is a check that can undo this during the augmentation process as needed the 
                concat is to keep the defence augs before the slot augs so they dont use more points then they should have at that time */
          case 1:
            thisPiece.totalQuriousPoints = 20 + thisPiece.quriousPoints;
            thisPiece.fodder.augs[0] = [{ "-Skill": 10 }, { "-Def": 5 }, { "-Def": 5 }].concat(
              thisPiece.fodder.augs[0]
            );

            thisPiece.armorRating =
              thisArmorRating + ~~(Math.min(thisPiece.quriousAugs * 15, thisPiece.totalQuriousPoints) / 3);

            break;
          case 2:
            thisPiece.totalQuriousPoints = 25 + thisPiece.quriousPoints;
            thisPiece.fodder.augs[0] = [{ "-Skill": 10 }, { "-Skill": 10 }, { "-Def": 5 }].concat(
              thisPiece.fodder.augs[0]
            );

            thisPiece.armorRating =
              thisArmorRating + ~~(Math.min(thisPiece.quriousAugs * 15, thisPiece.totalQuriousPoints) / 3);

            break;
          default:
            thisPiece.totalQuriousPoints = 30 + thisPiece.quriousPoints;
            thisPiece.fodder.augs[0] = [{ "-Skill": 10 }, { "-Skill": 10 }, { "-Skill": 10 }].concat(
              thisPiece.fodder.augs[0]
            );

            thisPiece.armorRating =
              thisArmorRating + ~~(Math.min(thisPiece.quriousAugs * 15, thisPiece.totalQuriousPoints) / 3);

            break;
        }
      }
      const addArmorPiece = (k, remove = true) => {
        if (remove) armors[armorType].pop();
        thisPiece.fodder.type = armorType;
        thisPiece.quriousPoints = thisPiece.totalQuriousPoints + 0;
        thisPiece.totalQuriousPoints = ~~(thisPiece.totalQuriousPoints / 3);
        armors[armorType].splice(k, 0, { ...thisPiece, ...theseSkills });
      };
      // Sets aug count and qurious points on the piece itself to put restrictions on points spent later on
      if (!armors[armorType][0]) {
        thisPiece.fodder.type = armorType;
        thisPiece.quriousPoints = thisPiece.totalQuriousPoints + 0;
        // / 3 to simplify the calculations as all skill costs are in incraments of 3 this was done earlier to the slots and inate skills also
        thisPiece.totalQuriousPoints = ~~(thisPiece.totalQuriousPoints / 3);
        armors[armorType].push({ ...thisPiece, ...theseSkills });
        return;
      }
      // has more relaxed requirents to make sure each type has enough pieces then increases to reduce calculations
      if (
        thisPiece.armorRating >
        (armors[armorType].length === maxArmorsPerType ? armors[armorType][maxArmorsPerType - 1].armorRating : 10)
      ) {
        for (let k = 0; k < armors[armorType].length; k++) {
          if (thisPiece.armorRating > armors[armorType][k].armorRating) {
            addArmorPiece(k);

            return;
          }
        }
        if (armors[armorType].length < maxArmorsPerType) addArmorPiece(armors[armorType].length - 1, false);
      }
    });
  });
  Object.values(armors).forEach((thisArmor) => {
    for (let piece of Object.values(thisArmor)) {
      piece.skillCount = Object.keys(piece.skills).length;
      for (let k = 0; k < 3; k++) {
        if (piece[("id", "quriousTable", "sex")][k]) {
          delete piece[("id", "quriousTable", "sex")][k];
        }
      }
    }
  });
  return armors;
}

const getCharms = (skills, skillInfo, charmList = []) => {
  const { charms, types } = info;
  // filters for so that both skills on charm must be used
  let filteredCharms = Object.values(charms).filter((charm) =>
    Object.keys(charm.skills).every((skillName) => skills[skillName] && types.Lvl4[skillName] < 3)
  );
  let index = -1;
  GlobalMap.set("charms", []);
  filteredCharms.forEach((charm, index2) => {
    // charm1Skill1 charm1Skill2
    // const [c1s1, c1s2] = Object.keys(charm.skills);
    for (let k = index2 + 1; k < Object.keys(filteredCharms).length; k++) {
      // charm2Skill1 charm2Skill2
      const [c2s1, c2s2] = Object.keys(filteredCharms[k].skills);
      // if (c1s1 === c2s1 && c1s2 === c2s2) {
      // continue;
      // }

      const newCombo = { ...charm.skills };
      if (newCombo[c2s1]) {
        newCombo[c2s1] += filteredCharms[k].skills[c2s1];
      } else {
        newCombo[c2s1] = filteredCharms[k].skills[c2s1];
      }
      if (newCombo[c2s2]) {
        newCombo[c2s2] += filteredCharms[k].skills[c2s2];
      } else {
        newCombo[c2s2] = filteredCharms[k].skills[c2s2];
      }
      if (newCombo[c2s2] > info.types.maxDeco[c2s2] || newCombo[c2s1] > info.types.maxDeco[c2s1]) {
        return;
      }
      GlobalMap.get("charms")[++index] = [charm.skills, filteredCharms[k].skills];
      charmList.push(newCombo);
    }
  });
  return [-1, charmList.length, charmList];
};

// const key = Object.keys(charm.skills);
// if (
// skillInfo[key[0]] &&
// Object.values(skills.skills)[0] === 3 &&
// skillInfo[key[0]].lvl > 1 &&
// skillInfo[key[0]].lvl4 < 2 &&
// skillInfo[key[1]] &&
// Object.values(skills.skills)[1] === 2 &&
// skillInfo[key[1]].lvl > 1 &&
// skillInfo[key[1]].lvl4 < 2
// ) {
// charmList.push(skills);
// })
// });
// return charmList;
// };

// const pt1 = await getCharmPt1();
// const charmCombos = await getCharmPt2(await getCharmPt1());

// Const getFodderRequirements=(armorPiece)=>{
// return [].concat(armorPiece.fodder,armorPiece.quriousPoints)
// }
const getCheckedSkills = (stats = []) => {
  document.getElementsByClassName("skillButton").forEach((button) => {
    if (button.checked) stats.push(info.skills[button.id]);
  });

  return stats;
};

const getSetBuilds = (filterLimit = 5) => {
  try {
    timer = performance.now();
    GlobalMap.clear();
    workerCount = 4;
    let workersHome = window.location.hostname.includes(".0.0.") ? "setBuilderWorker.js" : "./ugly/onlineWorker.js";
    for (let j = 0; j < workerCount; j++) {
      workers[j] = new Worker(workersHome);
    }
    workers.forEach((worker) =>
      worker.addEventListener("message", (e) => {
        totalCombos += e.data[2][1];
        totalSets += e.data[2][0];
        if (GlobalMap.size < 102 && e.data[0][0]) {
          recieveMessage(e.data[0],e.data[1]);
        }
        if (e.data[1]) {
          e.target.terminate();
          for (const i in e.data[1].remainingSlots) {
            newSkills.remainingSlots[i] = Math.max(newSkills.remainingSlots[i], e.data[1].remainingSlots[i]);
          }
          for (const i in e.data[1].quriousSkills) {
            newSkills.quriousSkills[i] = Math.max(newSkills.quriousSkills[i], e.data[1].quriousSkills[i]);
          }
          for (const [skill, lvl] of Object.entries(e.data[1].armorSkills)) {
            if (!newSkills.armorSkills[skill]) {
              newSkills.armorSkills[skill] = lvl;
            } else {
              newSkills.armorSkills[skill] = Math.max(newSkills.armorSkills[skill], lvl);
            }
          }

          if (--workerCount === 0) {
            setOutput(getTotal(newSkills));
            document.getElementById("extraOutput").textContent = `Found ${formatNumbers(
              totalSets
            )} Builds / ${formatNumbers(totalCombos)} Combinations`;
            console.log([totalCombos, GlobalMap]);
            if (GlobalMap.size < 101) {
              document.querySelector(".grid").append(GlobalFragment);
              document.getElementById("setOutput").textContent = `Displayed ${GlobalMap.size - 1
                } Builds / ${formatNumbers(totalCombos)} Combinations`;
            }
          }
        }
      })
    );

    const messageObj = getSetRequirements();
    messageObj.thisWeapon = getWeaponMR().decos;
    messageObj.theseCharms = getCharms(messageObj.skills, messageObj.skillInfo);

    messageObj.armors = applyArmorFilter(messageObj.skills, messageObj.skillInfo, filterLimit);
    const requires = {};

    for (let k = 0, j = 0; ; ) {
      if (++j === Object.values(messageObj.armors)[k].length) {
        j = 0;
        if (++k === 5) break;
      }
      const thisArmor = messageObj.armors[Object.keys(messageObj.armors)[k]][j];

      // Locates and stores the index of any pieces containing a set bonus skill that was used
      if (thisArmor.setBonus && messageObj.skills[Object.keys(thisArmor.setBonus)[0]]) {
        // requires[Object.keys(thisArmor.setBonus)[0]] = [messageObj.skills[Object.keys(thisArmor.setBonus)[0]]];

        if (requires[Object.keys(thisArmor.setBonus)[0]]) {
          requires[Object.keys(thisArmor.setBonus)[0]].push(
            Object.keys(messageObj.armors)[k],
            j,
            Object.values(thisArmor.setBonus)[0] * -1
          );
        } else {
          requires[Object.keys(thisArmor.setBonus)[0]] = [
            Object.keys(messageObj.armors)[k],
            j,
            Object.values(thisArmor.setBonus)[0] * -1,
          ];
        }
      }
    }
    const i = {
      helm: -1,
      chest: 0,
      arm: 0,
      waist: 0,
      leg: 0,
      work: [-1, workers.length],
    };
    // messageObj.theseSetSkills = {};
    const armorPermutations = [];
    const divideBuilds = (filterLimit) => {
      // fill array with minimal space to iterate a set amount times
      const pass = Object.keys(requires).length;
      loop: while (true) {
        iterator: {
          if (++i.helm < filterLimit) break iterator;
          i.helm = 0;
          if (++i.chest < filterLimit) break iterator;
          i.chest = 0;
          if (++i.arm < filterLimit) break iterator;
          i.arm = 0;
          if (++i.waist < filterLimit) break iterator;
          i.waist = 0;
          if (++i.leg === filterLimit) break loop;
        }
        if (pass) {
          for (const skillName in requires) {
            let temp = 0;
            let thisSkill = requires[skillName];
            let index = thisSkill.length - 1;
            while (true) {
              if (thisSkill[index - 1] === i[thisSkill[index - 2]]) {
                temp += thisSkill[index];
              }
              if ((index -= 3) < 0) break;
            }
            if (messageObj.skills[skillName] < temp) {
              continue loop;
            }
          }
        }
        armorPermutations.push([i.helm, i.chest, i.arm, i.waist, i.leg]);
      }
    };
    // await workers
    // await Promise.all(ugh);
    divideBuilds(filterLimit);
    for (const skillName in requires) {
      delete messageObj[skillName];
    }
    const total = armorPermutations.length;
    for (let k = 0; k < workers.length; ++k) {
      if (k === workers.length - 1) {
        messageObj.permutations = armorPermutations;
      } else {
        messageObj.permutations = armorPermutations.splice(0, total / workers.length);
      }
      // console.log(messageObj.permutations);
      workers[k].postMessage(messageObj);
    }
    document.getElementById("setReturn").classList.remove("augInvis");
    document.querySelectorAll(".extraSkills>button").forEach((x) => x.remove());
    Object.values(document.getElementsByClassName("grid")[0].children).forEach((x) => x.remove());
    newSkills = { remainingSlots: [0, 0, 0, 0], armorSkills: {}, quriousSkills: [0, 0, 0, 0, 0] };
    totalCombos = 0;
    totalSets = 0;
    setsDisplayed = 0;
  } catch (error) {
    console.error(error);
  }
};
// await Promise.all([ugh])
// console.log(ugh);
// if (
// !requires ||
// ((!requires.Dereliction ||
// i[requires.Dereliction[0]][0] === requires.Dereliction[1] ||
// i[requires.Dereliction[3]][0] === requires.Dereliction[4]) &&
// (!requires.MailofHellfire ||
// i[requires.MailofHellfire[0]][0] === requires.MailofHellfire[1] ||
// i[requires.MailofHellfire[3]][0] === requires.MailofHellfire[4] ||
// i[requires.MailofHellfire[6]][0] === requires.MailofHellfire[7]) &&
// (!requires.StormSoul ||
// i[requires.StormSoul[0]][0] === requires.StormSoul[1] ||
// i[requires.StormSoul[3]][0] === requires.StormSoul[4] ||
// i[requires.StormSoul[6]][0] === requires.StormSoul[7] ||
// i[requires.StormSoul[9]][0] === requires.StormSoul[10] ||
// i[requires.StormSoul[12]][0] === requires.StormSoul[13] ||
// i[requires.StormSoul[15]][0] === requires.StormSoul[16] ||
// i[requires.StormSoul[18]][0] === requires.StormSoul[19] ||
// i[requires.StormSoul[21]][0] === requires.StormSoul[22] ||
// i[requires.StormSoul[24]][0] === requires.StormSoul[25] ||
// i[requires.StormSoul[27]][0] === requires.StormSoul[28]))
// ) {
const build = (buildFlag = true) => {
  // const div = document.createElement("div");
  // div.id = "skillSelect";
  // div.classList.add("dropContainer");
  document.getElementById("skillSelect").innerHTML += `
<div id="SpareShotSelect"><label class="label SpareShot skillInput">SpareShot</label><output class="skillInput SpareShot" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="SpareShotDec" class="skillInput SpareShot dec">⇩</button><button type="button" aria-pressed="false" id="SpareShotInc" class="skillInput SpareShot inc">⇧</button></div><div id="EvadeExtenderSelect"><label class="label EvadeExtender skillInput">EvadeExtender</label><output class="skillInput EvadeExtender" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="EvadeExtenderDec" class="skillInput EvadeExtender dec">⇩</button><button type="button" aria-pressed="false" id="EvadeExtenderInc" class="skillInput EvadeExtender inc">⇧</button></div><div id="RapidFireUpSelect"><label class="label RapidFireUp skillInput">RapidFireUp</label><output class="skillInput RapidFireUp" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="RapidFireUpDec" class="skillInput RapidFireUp dec">⇩</button><button type="button" aria-pressed="false" id="RapidFireUpInc" class="skillInput RapidFireUp inc">⇧</button></div><div id="PierceUpSelect"><label class="label PierceUp skillInput">PierceUp</label><output class="skillInput PierceUp" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="PierceUpDec" class="skillInput PierceUp dec">⇩</button><button type="button" aria-pressed="false" id="PierceUpInc" class="skillInput PierceUp inc">⇧</button></div><div id="ForaySelect"><label class="label Foray skillInput">Foray</label><output class="skillInput Foray" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="ForayDec" class="skillInput Foray dec">⇩</button><button type="button" aria-pressed="false" id="ForayInc" class="skillInput Foray inc">⇧</button></div><div id="DerelictionSelect"><label class="label Dereliction skillInput">Dereliction</label><output class="skillInput Dereliction" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="DerelictionDec" class="skillInput Dereliction dec">⇩</button><button type="button" aria-pressed="false" id="DerelictionInc" class="skillInput Dereliction inc">⇧</button></div><div id="CriticalEyeSelect"><label class="label CriticalEye skillInput">CriticalEye</label><output class="skillInput CriticalEye" max="7" min="0">Lv-7</output><button type="button" aria-pressed="false" id="CriticalEyeDec" class="skillInput CriticalEye dec">⇩</button><button type="button" aria-pressed="false" id="CriticalEyeInc" class="skillInput CriticalEye inc">⇧</button></div><div id="CriticalBoostSelect"><label class="label CriticalBoost skillInput">CriticalBoost</label><output class="skillInput CriticalBoost" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="CriticalBoostDec" class="skillInput CriticalBoost dec">⇩</button><button type="button" aria-pressed="false" id="CriticalBoostInc" class="skillInput CriticalBoost inc">⇧</button></div><div id="CounterstrikeSelect"><label class="label Counterstrike skillInput">Counterstrike</label><output class="skillInput Counterstrike" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="CounterstrikeDec" class="skillInput Counterstrike dec">⇩</button><button type="button" aria-pressed="false" id="CounterstrikeInc" class="skillInput Counterstrike inc">⇧</button></div><div id="CoalescenceSelect"><label class="label Coalescence skillInput">Coalescence</label><output class="skillInput Coalescence" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="CoalescenceDec" class="skillInput Coalescence dec">⇩</button><button type="button" aria-pressed="false" id="CoalescenceInc" class="skillInput Coalescence inc">⇧</button></div><div id="AgitatorSelect"><label class="label Agitator skillInput">Agitator</label><output class="skillInput Agitator" max="5" min="0">Lv-5</output><button type="button" aria-pressed="false" id="AgitatorDec" class="skillInput Agitator dec">⇩</button><button type="button" aria-pressed="false" id="AgitatorInc" class="skillInput Agitator inc">⇧</button></div><div id="AmmoUpSelect"><label class="label AmmoUp skillInput">AmmoUp</label><output class="skillInput AmmoUp" max="3" min="0">Lv-3</output><button type="button" aria-pressed="false" id="AmmoUpDec" class="skillInput AmmoUp dec">⇩</button><button type="button" aria-pressed="false" id="AmmoUpInc" class="skillInput AmmoUp inc">⇧</button></div><div id="AttackBoostSelect"><label class="label AttackBoost skillInput">AttackBoost</label><output class="skillInput AttackBoost" max="7" min="0">Lv-7</output><button type="button" aria-pressed="false" id="AttackBoostDec" class="skillInput AttackBoost dec">⇩</button><button type="button" aria-pressed="false" id="AttackBoostInc" class="skillInput AttackBoost inc">⇧</button></div>
  `;
  // let arg = performance.now();
  if (buildFlag) {
    const ugh = getSetBuilds();
    // console.log(performance.now() - arg);
    return ugh;
  }
};
