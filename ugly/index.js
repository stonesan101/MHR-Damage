let lastEvent = "",
  comboTracker = [],
  testKeyCount = 0,
  armorCount = "";
const dropHZ = document.getElementById("dropHZ"),
  dropWeapon = document.getElementById("dropWeapon"),
  weaponType = document?.getElementById("dropWeaponType"),
  dropMon = document.getElementById("dropMonster"),
  dropQuest = document.getElementById("dropQuest"),
  weaponTypes = [
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
  ],
  getArmorTypes = () => ["helm", "chest", "arm", "waist", "leg"],
  updateSelectedSkillsDisplay = () => {
    var a = getCurrentSelectedSkills();
    a = getCurrentArmorSkills(a);
    a = Object.entries(a).sort();
    const b = document.querySelector("#EquippedSkillDisplay output");
    let c = "";
    a.forEach(([d, e]) => {
      c += `${d}: ${+e}<br>`;
    });
    b.innerHTML = c;
  },
  getGrade = (a, b) => (a.includes("S") || b.includes("S") ? "S" : b <= a ? b : a),
  info = { time: {} };
async function getInfo() {
  try {
    const a = window.location.href.slice(0, window.location.href.lastIndexOf("/"));
    weaponTypeSelect();
    const b = fetch(`${window.location.href.slice(0, window.location.href.lastIndexOf("/"))}/json/monster.json`)
        .then((l) => l.json())
        .then((l) => {
          info.monster = l;
        }),
      c = fetch(`${a}/json/rampage.json`)
        .then((l) => l.json())
        .then((l) => {
          info.rampage = l;
        }),
      d = fetch(`${a}/json/types.json`)
        .then((l) => l.json())
        .then((l) => {
          info.types = l;
        }),
      e = fetch(`${a}/json/skills.json`)
        .then((l) => l.json())
        .then((l) => {
          info.skills = l;
        }),
      g = fetch(`${a}/json/quest.json`)
        .then((l) => l.json())
        .then((l) => {
          info.quest = l;
        }),
      m = fetch(`${a}/json/armor.json`)
        .then((l) => l.json())
        .then((l) => {
          info.armor = l;
        }),
      h = fetch(`${a}/json/LightBowGun.json`)
        .then((l) => l.json())
        .then((l) => {
          info.LightBowGun = l;
        }),
      f = fetch(`${a}/json/ammo.json`)
        .then((l) => l.json())
        .then((l) => {
          info.ammo = l;
        }),
      k = await Promise.all([h, d, c]).then(() => {
        weaponSelect();
        rampageSelect();
      });
    await Promise.all([b, e, g, f, k, m])
      .then(async () => {
        classChange();
        populateDropDowns(
          [].concat(["Select Skills For Set Builder"], Object.keys(info.types.maxLevel).sort()),
          document.getElementById("dropSkills")
        );
        await armorSelect();
        await monsterSelect();
        document.querySelectorAll("#dropMonster>option").forEach((l, n) => {
          "Toadversary" === l.textContent && (document.getElementById("dropMonster").selectedIndex = n);
        });
        setArmorSkillsDisplay();
        partSelect();
        healthSelect();
        monChart();
        dataCompile();
      })
      .then(() => info);
    weaponTypes.push("descriptions");
    Object.values(document.getElementsByTagName("SCRIPT")).some((l) => l.src.includes("backup.js")) &&
      weaponTypes.push("mhrice");
    fetch(`${a}/json/charms.json`)
      .then((l) => l.json())
      .then((l) => {
        l = Object.fromEntries(Object.entries(l).sort((p, r) => p[0].localeCompare(r[0])));
        const n = [];
        let q = '<Option value="c">---</Option>',
          t = '<Option value="c">---</Option>';
        for (let p = 0, r = 0; ; ) {
          0 === p &&
            ((q += `<option value="${Object.values(l)[r][0]?.grade}">${Object.keys(l)[r]} +${
              Object.values(l)[r][1]
            }</option>`),
            (t += `<option value="${Object.values(l)[r][0]?.grade}">${Object.keys(l)[r]} +${
              Object.values(l)[r][2]
            }</option>`));
          if (++r === Object.keys(l).length)
            if (((r = 0), ++p === Object.keys(l).length)) break;
            else
              1 === p &&
                ((document.getElementById("charmSkill1").innerHTML = q),
                (document.getElementById("charmSkill2").innerHTML = t));
          p !== r &&
            "Bludgeoner" !== Object.keys(l)[p] &&
            "Bludgeoner" !== Object.keys(l)[r] &&
            (!info.types.lvl4[Object.keys(l)[p]] ||
              9 <= info.types.qurious[Object.keys(l)[p]] ||
              !info.types.qurious[Object.keys(l)[p]] ||
              2 > info.types.lvl4[Object.keys(l)[p]]) &&
            (null === info.types.lvl4[Object.keys(l)[r]] ||
              9 <= info.types.qurious[Object.keys(l)[r]] ||
              !info.types.qurious[Object.keys(l)[r]] ||
              3 > info.types.lvl4[Object.keys(l)[r]]) &&
            !info.types.decoLevels[0].some((u) => Object.keys(u)[0] === Object.keys(l)[p]) &&
            !info.types.decoLevels[0].some((u) => Object.keys(u)[0] === Object.keys(l)[r]) &&
            3 <= Object.values(l)[p][1] &&
            2 <= Object.values(l)[r][2] &&
            n.push({
              skills: { [Object.keys(l)[p]]: Object.values(l)[p][1], [Object.keys(l)[r]]: Object.values(l)[r][2] },
              grade: getGrade(Object.values(l)[p][0]?.grade, Object.values(l)[r][0]?.grade),
            });
        }
        info.charms = n;
        setDecoDisplay("charm", [3, 2, 1]);
      });
    weaponTypes.slice(1).forEach((l) => {
      fetch(`${a}/json/${l}.json`)
        .then((n) => n.json())
        .then((n) => {
          info[l] = n;
        })
        .then(() => {});
    });
  } catch (a) {
    console.error(a);
  }
}
getInfo();
const timesUsed = (a, b = comboTracker, c = 0) => {
  b.forEach((d) => {
    d == a && ++c;
  });
  return c;
};
function dataCompile(a = window?.event) {
  updateSelectedSkills();
  /BowGun/.test(weaponType.value) ? rangedDPS(a) : meleeDPS(a);
}
const resetTable = (a) => {
  let b = 0,
    c = 2;
  const d = document.querySelectorAll("#dpsBody>tr>td:nth-child(n+3)");
  for (; 7 !== ++c || ((c = 2), ++b !== a.length); ) d[0].textContent = a[b][c];
};
function rangedDPS(a) {
  document.querySelector("output.elementalAug").value = 0;
  document.getElementById("elementalResult").value = "+0";
  document.querySelector("output.sharpnessAug").value = 0;
  document.getElementById("sharpnessResult").value = "+0";
  const b = [],
    c = [];
  let d = {};
  var e = !0;
  const g = getWeaponMR();
  ["Shot", "Sever", "Blunt", "IgnoreHZV"].forEach((f) => {
    g[f] = getInitialStats(g, f);
  });
  const m = getUsedAttacks();
  for (let f = 0; f < Object.keys(m).length; f++) {
    let k = { ...g[Object.values(m)[f].type], ...Object.values(m)[f] };
    k = getDependantSkills(k);
    k = getRemainingSkills(k);
    k = damageCalculations(k);
    /Demon|Armor|Wyvern Blast|Glide|Wyvernsn|Guard/.test(k.attackName)
      ? (d.ticsAdjust = 1)
      : (d = calculateAmmoFrames(k));
    var h = ~~((~~k.efr + ~~k.efe) * d.ticsAdjust);
    const l = ~~(~~k.rawCrit + ~~k.eleCrit),
      n = ~~(~~k.rawNon + ~~k.eleNon),
      q = formatNumbers(~~(0.99 + document.getElementById("health").value / h));
    let t = /Stic|Slic/.test(k.attackName)
      ? 5 + ~~(0.98 + 60 / d.shotsPerMin) * ~~(0.99 + document.getElementById("health").value / h)
      : ~~(0.98 + 60 / d.shotsPerMin) * ~~(0.99 + document.getElementById("health").value / h);
    t = formatNumbers(t);
    h = [
      k.attackName,
      [`${~~k.rawNon} / ${~~k.rawCrit}`],
      [`${~~k.eleNon} / ${~~k.eleCrit}`],
      [`${~~n} / ${~~l}`],
      h,
      "NaN%" === d.shotsPerGain || "0.00%" === d.shotsPerGain ? "No Gain" : d.shotsPerGain,
      /(\d{2},\d{3})/.test(q) ? "N / A" : q,
      /(\d{2},\d{3})/.test(t) ? "N / A" : t,
    ];
    b.push(h);
    h = [
      k.attackName,
      k.rawMV.toFixed(1),
      void 0 === d.reloadSpeed ? " N / A " : d.reloadSpeed,
      void 0 === d.recoilSpeed ? " N / A " : d.recoilSpeed,
      isNaN(d.clipSize) ? "N / A" : d.clipSize,
      k.ticsPer,
      void 0 === d.shotsPerMinBase ? " N / A " : d.shotsPerMinBase,
      void 0 === d.shotsPerMin ? " N / A " : d.shotsPerMin,
    ];
    c.push(h);
    e &&
      ((e = [
        ["Stat", "Raw", "Ele Pierce"],
        ["Base", ~~k.baseRaw, ~~(22 * (1 + k.raw / 100))],
        ["True", ~~k.raw, ~~((22 * k.BEM + k.BE) * (1 + k.raw / 100))],
        [
          "eTrue",
          ~~(k.raw * getCritBoost(k.aff, k.Crit).PRM * k.PRM * k.augPRM),
          ~~((22 * k.BEM + k.BE) * (1 + k.raw / 100) * k.PEM * k.augPEM * getCritEle(k.aff, k.Crit).PEM),
        ],
        [
          "EFR/EFE",
          ~~(k.raw * getCritBoost(k.aff, k.Crit).EFR * k.PRM * k.augPRM),
          ~~((22 * k.BEM + k.BE) * (1 + k.raw / 100) * k.PEM * k.augPEM * getCritEle(k.aff, k.Crit).EFE),
        ],
        ["Critical"].concat(Number(getCritBoost(k.aff).EFR).toFixed(3), Number(getCritEle(k.aff).EFE).toFixed(2)),
        ["Affinity", ~~(100 * k.aff)],
      ]),
      createTable(e),
      (e = !1));
  }
  b.splice(0, 0, [
    "Ammo Type",
    "Raw",
    "Element",
    ["Total", "Combined Damage For a Single Tick"],
    ["Effective", "Sums Every Tick Using EFE/EFR"],
    ["RPM Gain", "The Percentage Increase Of Damage From Both \nAmmo Up And Spare Shot In 60 seconds."],
    ["Shots To Kill", "Use the Pierce Damage Adjust For Accurate Results"],
    [
      "Time To Kill",
      "Can Have Variance Due To FPS,\nBut The Percent Gain Or Loss VS\nOther Ammo Types Should Stay Constant",
    ],
  ]);
  buildDamageTable(b, "dps", a);
  c.splice(0, 0, [
    "Ammo Type",
    "Raw MV",
    "Reload",
    "Recoil",
    "Clip Size",
    ["Procs Per", "Maximum Ticks Per Shot Using Optimal FPS, \nAs Well As The Monsters Smallest Large Gold Crown Size"],
    ["RPM Base", "Shots Per Minuite Including Recoil Down And Reload Speed"],
    ["Current RPM", "Shots Per Minuite With AmmoUp And Spare Shot"],
  ]);
  buildDamageTable(c, "ammo", a);
}
function meleeDPS(a) {
  const b = performance.now(),
    c = ["Combo;Attack Name;MV;Raw;Element;Total;Effective".split(";")];
  let d = [0, 0, 0, 0, 0, 0, 0, 0],
    e = -1,
    g = {};
  document.getElementById("Sharpness");
  const m = getWeaponMR();
  ["Shot", "Sever", "Blunt", "IgnoreHZV"].forEach((h) => {
    m[h] = getInitialStats(m, h);
  });
  Object.values(getUsedAttacks()).forEach((h) => {
    ++e;
    let f = { ...h, ...m[h.type] };
    f = getDependantSkills(f);
    /input/.test(a?.target?.className) &&
      "Combo Damage" === f.attackName &&
      (updateComboTracker(), updateComboDisplay());
    "Combo Damage" === f.attackName &&
      (g = "Bow" === weaponType.value ? hitsPerColorSharp()[1] : getComboHitsAndSetSharpness(f.aff));
    f = getRemainingSkills(f);
    f = damageCalculations(f);
    comboTracker.includes(e.toString()) &&
      Object.entries(g)
        .filter((l) => 0 < l[1].length)
        .forEach((l) => {
          if (timesUsed(e, l[1])) {
            var { PRM: n, PEM: q } = !1 === f.noSharpMod ? info.skills.Sharpness[capital(l[0])] : { PRM: 1, PEM: 1 };
            l = timesUsed(e, l[1]);
            d = [
              (d[0] += Number(~~(f.rawMV * l))),
              (d[1] += Number(~~(f.rawNon * n) * l)),
              (d[2] += Number(~~(f.rawCrit * n) * l)),
              (d[3] += Number(~~(f.eleNon * q) * l)),
              (d[4] += Number(~~(f.eleCrit * q) * l)),
              (d[5] += Number(~~(f.rawNon * n) * l + ~~(f.eleNon * q) * l)),
              (d[6] += Number(~~(f.rawCrit * n) * l + ~~(f.eleCrit * q) * l)),
              (d[7] += Number(~~(f.efr * n) * l + ~~(f.efe * q) * l)),
            ];
          }
        });
    h = info.skills.Sharpness[document.getElementById("Sharpness").selectedOptions[0].textContent.trim()];
    if ("Bow" === weaponType.value && "Shot" !== f.type)
      switch (document.getElementById("BowCoating").selectedOptions[0].textContent) {
        case "Power":
          h = "1.35";
          break;
        case "Close Range":
          h = "1.32";
          break;
        case "Close Range+":
          h = "1.39";
      }
    var k = [
      "replaceME",
      f.attackName,
      f.rawMV.toFixed(1),
      `${formatNumbers(~~(f.rawNon * h.PRM))} / ${formatNumbers(~~(f.rawCrit * h.PRM))}`,
      `${formatNumbers(~~(f.eleNon * h.PEM))} / ${formatNumbers(~~(f.eleCrit * h.PEM))}`,
      `${formatNumbers(~~(f.rawNon * h.PRM) + ~~(f.eleNon * h.PEM))} / ${formatNumbers(
        ~~(f.rawCrit * h.PRM) + ~~(f.eleCrit * h.PEM)
      )}`,
      formatNumbers((~~(f.efe * h.PEM) + ~~(f.efr * h.PRM)) * (f.ticsPer + 1)),
    ];
    c.push(k);
    k = "none" === lower(f.eleType) ? 0 : f.ele;
    h = [
      [["Stat"], ["Raw"], [f.eleType]],
      ["Base", ~~f.baseRaw, f.baseEle],
      ["True", ~~f.raw, ~~k],
      [
        "eTrue",
        ~~(f.raw * getCritBoost(f.aff, f.Crit).PRM * f.PRM * f.augPRM * h.PRM),
        ~~(k * getCritEle(f.aff, f.Crit).PEM * f.PEM * f.augPEM * h.PEM),
      ],
      [
        "EFR/EFE",
        ~~(f.raw * getCritBoost(f.aff, f.Crit).EFR * f.PRM * f.augEFR * h.PRM),
        ~~(k * getCritEle(f.aff, f.Crit).EFE * f.PEM * f.augPEM * f.augEFR * h.PEM),
      ],
      ["Critical"].concat(Number(getCritBoost(f.aff).EFR).toFixed(3), Number(getCritEle(f.aff).EFE).toFixed(2)),
      ["Sharp."].concat(
        Object.values(Object.values(info.skills.Sharpness)[7 - document.getElementById("Sharpness").selectedIndex])
      ),
      ["Affinity", ~~(100 * f.aff)],
    ];
    createTable(h);
  });
  "Gunlance" === weaponType.value
    ? (gunlanceShelling(c, d, a), console.log((performance.now() - b) / 1e3), gunlanceShelling(532))
    : (c.splice(1, 1, [
        "replaceME",
        "Combo Damage",
        `${formatNumbers(d[0])}`,
        `${formatNumbers(d[1])} / ${formatNumbers(d[2])}`,
        `${formatNumbers(d[3])} / ${formatNumbers(d[4])}`,
        `${formatNumbers(d[5])} / ${formatNumbers(d[6])}`,
        `${formatNumbers(d[7])}`,
      ]),
      buildDamageTable(c, "dps", a),
      console.log((performance.now() - b) / 1e3));
}
function getRampageSkills(a = { ...info[weaponType.value].weapons[dropWeapon.value] }) {
  for (let c = 0; 6 > c; c++) {
    var b = document.querySelectorAll("#weaponRampage>select")[c];
    if ("none" === b.style.display) break;
    b = info.rampage["Rampage-Up Skill"][b.value];
    if (void 0 !== b) for (const d of Object.keys(b)) a[d] += b[d];
  }
  /BowGun/.test(weaponType.value) ||
    (a.eleType = /Fire|Water|Thunder|Ice|Dragon|Blase|Sleep|Poison|Para/.test(
      document.getElementById("weaponRampage").children[1].value
    )
      ? document
          .getElementById("weaponRampage")
          .children[1].value.match(/Fire|Water|Thunder|Ice|Dragon|Blase|Sleep|Poison|Para/)[0]
      : a.eleType);
  return { ...a };
}
const getWeaponMR = () => {
    const a = { ...info[weaponType.value].weapons[dropWeapon.value] };
    /Bow/.test(weaponType.value)
      ? "HeavyBowGun" === weaponType.value
        ? (10 === a.rank && document.getElementById("augUpgrades").checked && (a.baseRaw += 15),
          "Power" === document.getElementById("BowgunBarrel")?.selectedOptions[0]?.textContent &&
            (a.baseRaw = ~~(a.baseRaw * (2 > document.getElementById("Tune-Up").selectedIndex ? 1.125 : 1.15))))
        : "LightBowGun" === weaponType.value
        ? (10 === a.rank && document.getElementById("augUpgrades").checked && (a.baseRaw += 7),
          "Long" === document.getElementById("BowgunBarrel")?.selectedOptions[0]?.textContent &&
            (a.baseRaw = ~~(a.baseRaw * (2 > document.getElementById("Tune-Up").selectedIndex ? 1.05 : 1.075))))
        : "Bow" === weaponType.value &&
          10 === a.rank &&
          document.getElementById("augUpgrades").checked &&
          (a.baseRaw += 10)
      : 10 === a.rank &&
        document.getElementById("augUpgrades").checked &&
        !/Water|Ice|Thunder|Fire|Dragon/.test(a.eleType)
      ? (a.baseRaw += 30)
      : 10 === a.rank &&
        document.getElementById("augUpgrades").checked &&
        ((a.baseRaw += 15),
        (a.baseEle =
          "GreatSword" === weaponType.value
            ? a.baseEle + 30
            : "lance" === weaponType.value || "Gunlance" === weaponType.value
            ? a.baseEle + 21
            : a.baseEle + 18));
    a.baseRaw += +document.querySelector("output.attackAug + output").value.slice(-2);
    var b = +document.querySelector("output.affinityAug + output").value.slice(-2);
    a.elementalAug += +document.querySelector("output.elementalAug + output").value.slice(-2);
    a.aff = a.aff ? a.aff + b : b;
    "None" !== a.eleType
      ? ((b =
          "GreatSword" === weaponType.value
            ? [0, 5, 10, 15, 20, 25, 33, 43][info.augIndex.elementalAug]
            : "lance" === weaponType?.value || "Gunlance" === weaponType?.value
            ? [0, 3, 6, 10, 14, 18, 24, 32][info.augIndex.elementalAug]
            : [0, 3, 6, 9, 12, 15, 20, 27][info.augIndex.elementalAug]),
        (a.baseEle += b),
        (document.getElementById("elementalResult").value = `+ ${b}`))
      : (document.querySelector("output.elementalAug").value = 0);
    a.baseAff = a.aff;
    return JSON.parse(JSON.stringify(a));
  },
  getRangedSkills = (a) => {
    /Pierc/.test(a.attackName)
      ? a.getSkills.push(info.skills.PierceUp[document.getElementById("PierceUp").selectedIndex])
      : /Spread/.test(a.attackName)
      ? a.getSkills.push(info.skills.SpreadUp[document.getElementById("SpreadUp").selectedIndex])
      : /Normal|Rapid/.test(a.attackName) &&
        a.getSkills.push(info.skills.NormalRapidUp[document.getElementById("NormalRapidUp").selectedIndex]);
    /RF+/.test(a.attackName) &&
      a.getSkills.push(info.skills.RapidFireUp[document.getElementById("RapidFireUp").selectedIndex]);
    /Wyvern|Dragon Piercer/.test(a.attackName) &&
      a.getSkills.push(info.skills.SpecialAmmoBoost[document.getElementById("SpecialAmmoBoost").selectedIndex]);
    /BowGun/.test(weaponType.value) &&
      ("HeavyBowGun" === weaponType.value &&
        (/Sticky|Wyvern/.test(a.attackName) &&
          ((a.augEFR *=
            info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][
              a.attackName.match("Sticky|Wyvern")[0]
            ][1]),
          (a.augPRM *=
            info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][
              a.attackName.match("Sticky|Wyvern")[0]
            ][0])),
        /snipe|heart|Cluster/.test(a.attackName) ||
          ((a.PRM *= info.skills.ChargeLevel[document.getElementById("ChargeLevel").selectedIndex].PRM),
          a.NoEleBuff
            ? (a.baseEle *= info.skills.ChargeLevel[document.getElementById("ChargeLevel").selectedIndex].PEM)
            : (a.PEM *= info.skills.ChargeLevel[document.getElementById("ChargeLevel").selectedIndex].PEM))),
      "LightBowGun" === weaponType.value &&
        /Pierce|Spread|Normal/.test(a.attackName) &&
        0 < document.getElementById("CriticalFirePower").selectedIndex &&
        (/Normal/.test(a.attackName)
          ? (a.PRM *= 1.3)
          : /Spread/.test(a.attackName)
          ? (a.PRM *= 1.2)
          : /Pierce/.test(a.attackName) && (a.PRM *= 1.1)));
    "Bow" !== weaponType.value ||
      /Stake/.test(a.attackName) ||
      a.getSkills.push(info.skills.BowCoating[document.getElementById("BowCoating").selectedIndex]);
    return getStats(a);
  },
  getMeleeSkills = (a) => {
    "LongSword" !== weaponType.value || /Helm Breaker|Serene/.test(a.attackName)
      ? /Helm Breaker|Serene/.test(a.attackName) &&
        a.getSkills.push(
          /Helm Breaker/.test(a.attackName)
            ? a.getSkills.push(info.skills.Helmbreaker[document.getElementById("Helmbreaker").selectedIndex])
            : a.getSkills.push(info.skills.SerenePose[document.getElementById("SerenePose").selectedIndex])
        )
      : a.getSkills.push(info.skills.SpiritGauge[document.getElementById("SpiritGauge").selectedIndex]);
    if ("GreatSword" === weaponType.value) {
      const b = a.attackName.match(
        /Charged Slash|Rising Slash|Wide Slash|Strong Charged Slash|True Charged Slash|Rage Slash/
      );
      b &&
        0 < document.getElementById("StrongarmStance").selectedIndex &&
        ((a.PRM *= info.skills.StrongarmStance[b][0]), (a.PEM *= info.skills.StrongarmStance[b][1]));
      /(?<!Tackle )Lv[1-3]/.test(a.attackName) && (a.rawMV *= Number(`1.${a.attackName.match(/(?<=Lv)[1-3]/)[0]}`));
    }
    "ChargeBlade" === weaponType.value &&
      (/3rd|(?<!Midair |Axe: )UED|(?<!Charged )Sword(?!.*Shield)/.test(a.attackName) ||
        a.getSkills.push(info.skills.savageAxe[document.getElementById("savageAxe").selectedIndex]),
      "Impact Phial" === a.phialType
        ? a.getSkills.push(info.skills.impShieldCharge[document.getElementById("impShieldCharge").selectedIndex])
        : a.getSkills.push(info.skills.eleShieldCharge[document.getElementById("eleShieldCharge").selectedIndex]));
    return getStats(a);
  };
function getDependantSkills(a) {
  a.getSkills = [];
  "FireWaterIceThunderDragon".includes(a.eleType) &&
    document.querySelectorAll(`.${lower(a.eleType)}`).forEach((b) => {
      0 < b.selectedIndex && a.getSkills.push(info.skills[b.id][b.selectedIndex]);
    });
  return weaponType.value.includes("Bow") ? getRangedSkills(a) : getMeleeSkills(a);
}
function getEnrage() {
  return "Enraged" === document.getElementById("dropEnraged").value ? info.monster[dropMon.value]?.anger_data : 1;
}
const getWeaknessExploit = (a) =>
  45 <= a ? info.skills.WeaknessExploit[Math.min(0, document.getElementById("WeaknessExploit").selectedIndex)].aff : 0;
function getInitialStats(a, b) {
  null === comboTracker[0] && (comboTracker = []);
  a.baseRaw += !0 === a.Draw ? Number(document.getElementById("PunishingDraw").value) : 0;
  a.BR = 0;
  a.BRM = 1;
  a.PRM = 1;
  a.BEM = 1;
  a.BE = 0;
  a.PEM = 1;
  const c = {};
  let d = [];
  a.getSkills = [];
  Object.values(info.types[b]).forEach((e) => {
    document.getElementById([e])?.style.display.includes("none") ||
      !document.getElementById([e]).selectedIndex ||
      c[e] ||
      a.getSkills.push(info.skills[e][document.getElementById([e]).selectedIndex]);
    c[e] = 1;
  });
  a.PRM *= document.getElementById("DemonAmmo").checked && /(Sever|Blunt)/.test(a.type) ? 1.1 : 1;
  document.querySelectorAll("input.skillButton").forEach((e) => {
    e.checked && info.skills[e.id] && !c[e.id]
      ? (a.getSkills.push(info.skills[e.id]), (c[e.id] = 1))
      : info.skills[e.id] || console.log(e.id);
  });
  document.getElementById("enrageDisplay").textContent = `${~~(100 * getEnrage())}%`;
  "Enraged" === document.getElementById("dropEnraged").value &&
    (d.push("Agitator"), (a.PEM *= getEnrage()), (a.PRM *= getEnrage()));
  "DualBlades" === weaponType.value &&
    ((a.BEM *= info.skills.ArchdemonMode[document.getElementById("ArchdemonMode").selectedIndex].BEM),
    (a.BEM *= /\[Feral Demon Mode\]/.test(a.attackName)
      ? 1
      : info.skills.DemonMode[document.getElementById("DemonMode").selectedIndex].BEM),
    (a.BRM *= /\[Demon Mode\]/.test(a.attackName)
      ? 1
      : info.skills.FeralDemonMode[document.getElementById("FeralDemonMode").selectedIndex].BRM),
    (a.aff += "Hellion Mode" === document.getElementById("weaponRampage0").value ? 20 : 0));
  "Bow" === weaponType.value && (d = d.concat("UpperCrit", "HerculesDraw"));
  d.forEach((e) => {
    !c[e] &&
      document.getElementById([e]).selectedIndex &&
      ((c[e] = 1), a.getSkills.push(info.skills[e][document.getElementById([e]).selectedIndex]));
  });
  getStats(a);
  "Kushala Daora Soul" === document.getElementById("weaponRampage0").value && (a.aff += 15);
  a.aff += getWeaknessExploit(getRawHZ(b));
  a.aff = Math.min(a.aff, 100) / 100;
  return { ...a };
}
function updateComboTracker() {
  if (
    document.getElementsByClassName("inputs")?.length &&
    !Number.isNaN(Number(window?.event?.target.id)) &&
    "0" !== window?.event?.target.id
  ) {
    let a = document.querySelectorAll(".inputs")[window?.event?.target.id].value - timesUsed(window?.event?.target.id);
    for (; 0 < a; ) comboTracker.push(window.event.target.id), --a;
    for (; 0 > a; ) comboTracker.splice(comboTracker.lastIndexOf(window?.event?.target.id), 1), ++a;
  }
}
function updateComboDisplay() {
  document.querySelectorAll("li.comboHits").forEach((b) => b.remove());
  let a;
  comboTracker.forEach((b) => {
    a = document.createElement("li");
    a.className = `${b} comboHits`;
    a.setAttribute("draggable", "true");
    a.textContent = document.querySelector(`td#b${[b]}>output`).textContent;
    document.getElementById("comboCountDisplay").append(a);
  });
}
const getInitialSharpness = () => {
  let a = 10 * document.getElementById("Handicraft").selectedIndex;
  const { sharpness: b, handicraft: c, rank: d } = getWeaponMR();
  var e = 10 * (info.augIndex.sharpnessAug + (10 === d && document.getElementById("augUpgrades").checked ? 1 : 0));
  b.orange -= Math.max(0, e - (b.red - 10));
  b.red = Math.max(10, b.red - e);
  let g =
    -1 === Object.values(document.getElementById("Sharpness")).indexOf(0)
      ? 6
      : Object.values(document.getElementById("Sharpness")).indexOf(0) - 1;
  for (0 !== b[Object.keys(b)[g]] ? (b[Object.keys(b)[g]] += e) : (b[Object.keys(b)[g - 1]] += e); a; )
    (e = Math.min(a, c.shift())), (b[Object.keys(b)[g]] += e), ++g, (a -= e);
  return b;
};
function applySharpnessSkills(a, b = { ...getInitialSharpness() }) {
  var c = [];
  c = info.skills.RazorSharp[document.getElementById("RazorSharp").selectedIndex].Sharp;
  const d = info.skills.MastersTouch[document.getElementById("MastersTouch").selectedIndex].Sharp * a,
    e =
      0 < a && 0 < document.getElementById("MastersTouch").selectedIndex
        ? sharpnessReduction(d) * sharpnessReduction(c)
        : sharpnessReduction(c);
  return (c = Object.entries(b).map((g) => ~~(Number(g[1]) * Number(e))));
}
function listOfAllComboHits() {
  let [...a] = comboTracker;
  if (void 0 !== comboTracker[0] && null !== comboTracker[0]) {
    let b = document.getElementsByClassName("inputComboRepeat")[0].value;
    for (; 1 < b; ) (a = a.concat(comboTracker)), --b;
    return a;
  }
}
function getComboHitsAndSetSharpness(a = 0) {
  const [b, c, d] = hitsPerColorSharp(a);
  document.getElementById("Sharpness").selectedIndex = 6 - b.lastIndexOf(0);
  b.forEach((e, g) => {
    document.querySelector("#sharpnessContainer").children[6 - g].style.width = `${(e / d) * 90}%`;
    document.querySelector("#sharpnessContainer").children[6 - g].textContent = 0.1 > e ? "" : ~~e;
  });
  return c;
}
function hitsPerColorSharp(a = 0, b = listOfAllComboHits()) {
  const c = { purple: [], white: [], blue: [], green: [], yellow: [], orange: [], red: [] };
  a = "Bow" !== weaponType.value ? applySharpnessSkills(a).reverse() : [0, 0, 0, 1, 0, 0, 0, 0];
  const d = Object.values(a).reduce((g, m) => g + m);
  if (b) {
    const g = Object.keys(getUsedAttacks());
    let m = 0;
    const h = Object.keys(c),
      f = getAttacks();
    a: for (let k of b) {
      var e = g[k];
      b = f[e].ticsPer + 1;
      e = getHitsPerTick(f[e].hitsOfSharp, k);
      if ("Gunlance" !== weaponType.value || 27 > k)
        for (; b--; ) {
          if (0.1 > a[m] && 7 === ++m) break a;
          c[h[m]].push(k);
          a[m] -= e;
        }
    }
  }
  return [a, c, d];
}
function getHitsPerTick(a, b) {
  return document.getElementById("ProtectivePolish").checked || "Bow" === weaponType.value
    ? 0
    : "Gunlance" !== weaponType.value || 27 < b
    ? "DualBlades" !== weaponType.value
      ? a
      : a / 3
    : 1;
}
function getRemainingSkills(a, b = getWeaponMR()) {
  [a.augEFR, a.augPRM, a.augPEM] = [1, 1, 1];
  a.augPEM *= "Valstrax Soul" === document.getElementById("weaponRampage0").value && "Dragon" === a.eleType ? 1.2 : 1;
  [a.augEFR, a.augPRM] =
    "Dulling Strike" === document.getElementById("weaponRampage0").value &&
    5 > document.getElementById("Sharpness").selectedIndex
      ? [1.02, 1.2]
      : [a.augEFR, a.augPRM];
  var c = Object.values(info.monster[dropMon.value]?.species);
  c &&
    (("Invalid" !== c[1] && "Wyvern Exploit" === document.querySelector("#weaponRampage0").value) ||
      document.querySelector("#weaponRampage0").value.includes(c[2]) ||
      ("Invalid" !== c[3] && "Fanged Exploit" === document.querySelector("#weaponRampage0").value)) &&
    (a.PRM *= 1.05);
  /blight Exploit/.test(document.getElementById("weaponRampage0").value) && (a.PRM *= 1.1);
  "Magnamalo Soul" === document.getElementById("weaponRampage0").value && (a.BR += 12);
  if (("IgnoreHZV" === a.type && "LightBowGun" === weaponType.value) || "ChargeBlade" === weaponType.value)
    (a.augEFR *= info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][1]),
      (a.augPRM *= info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][0]),
      "SwitchAxe" === weaponType.value &&
        /Sword|ZSD|ED/.test(a.attackName) &&
        "Impact Phial" === a.phialType &&
        (a.BRM *= 1.15),
      "SwitchAxe" === weaponType.value &&
        /Sword|Elemental|ED/.test(a.attackName) &&
        "Elemental Phial" === a.phialType &&
        (a.BEM *= 1.45);
  "None" !== a.eleType &&
    ((a.PEM *=
      0 === b.rampageSlots &&
      "Elemental Exploit" === document.getElementById("weaponRampage0").value &&
      25 <= getEleHZ(a.eleType)
        ? 1.3
        : 1),
    (a.PEM *=
      0 !== b.rampageSlots &&
      "Element Exploit" === document.getElementById("weaponRampage0").value &&
      25 <= getEleHZ(a.eleType) &&
      "none" !== lower(a.eleType)
        ? 1.15
        : 1),
    (a.PEM *=
      20 <= getEleHZ(a.eleType) && "none" !== lower(a.eleType)
        ? info.skills.ElementExploit[document.getElementById("ElementExploit").selectedIndex].PEM
        : 1));
  if ("ChargeBlade" === weaponType.value || "SwitchAxe" === weaponType.value)
    a.BRM *= /Morph Slash|Condensed Spinning|Up Roundslash/.test(a.attackName)
      ? info.skills.RapidMorph[document.getElementById("RapidMorph").selectedIndex].BRM
      : 1;
  0 < document.getElementById("Sharpness").selectedIndex &&
    0 < document.getElementById("Bludgeoner").selectedIndex &&
    ((a.BRM *=
      1 === document.getElementById("Bludgeoner").selectedIndex &&
      4 > document.getElementById("Sharpness").selectedIndex
        ? 1.05
        : 1),
    (a.BRM *=
      2 === document.getElementById("Bludgeoner").selectedIndex &&
      4 > document.getElementById("Sharpness").selectedIndex
        ? 1.1
        : 1),
    (a.BRM *=
      3 === document.getElementById("Bludgeoner").selectedIndex &&
      5 > document.getElementById("Sharpness").selectedIndex
        ? 1.1
        : 1));
  !/Wyvern/.test(a.attackName) &&
  Object.keys(info.skills.ChargeMaster).includes(weaponType.value) &&
  !0 === a.ChargeMaster
    ? (a.BEM *= info.skills.ChargeMaster[weaponType.value][document.getElementById("ChargeMaster").selectedIndex].BEM)
    : !0 === a.ChargeMaster &&
      !0 === a.NoEleBuff &&
      (a.baseEle *= /Wyvern/.test(a.attackName)
        ? info.skills.ChargeMaster["HeavyBowGun Wyvern"][document.getElementById("ChargeMaster").selectedIndex].BEM
        : info.skills.ChargeMaster[weaponType.value][document.getElementById("ChargeMaster").selectedIndex].BEM);
  c = {};
  [c.PRM, c.PEM] =
    !1 === a.noSharpMod && /sever|blunt/.test(lower(a.type))
      ? [
          JSON.parse(document.getElementById("Sharpness").value).PRM,
          JSON.parse(document.getElementById("Sharpness").value).PEM,
        ]
      : [1, 1];
  a.PRM *=
    ~~(25 / c.PRM) >= getRawHZ(a.type)
      ? info.skills.MindsEye[document.getElementById("MindsEye").selectedIndex].PRM
      : 1;
  0 === b.rampageSlots && "Brutal Strike" === document.getElementById("weaponRampage0").value && 0 > a.aff
    ? ((a.efrMulti = 1 + -0.2 * a.aff * 1.5 - -0.8 * a.aff * 0.75), (a.critBoost = 1.5))
    : 0 !== b.rampageSlots &&
      "Brutal Strike" === document.getElementById("weaponRampage0").value &&
      0 > a.aff &&
      ((a.efrMulti = 1 + -0.5 * a.aff - -0.5625 * a.aff), (a.critBoost = 1.5));
  "Shot" === a.type &&
    ((a.augPRM *= info.skills.Marksman[document.getElementById("Marksman").selectedIndex][0]),
    (a.augEFR *= info.skills.Marksman[document.getElementById("Marksman").selectedIndex][1]));
  a.NoSneak ||
    ((a.augPRM *= info.skills.SneakAttack[document.getElementById("SneakAttack").selectedIndex].PRM),
    (a.augEFR *= info.skills.SneakAttack[document.getElementById("SneakAttack").selectedIndex].PRM));
  return { ...a };
}
function getCritEle(a, b = !0) {
  return b
    ? {
        PEM: info.skills.CriticalElement[document.getElementById("CriticalElement").selectedIndex].PEM,
        EFE: 1 + (info.skills.CriticalElement[document.getElementById("CriticalElement").selectedIndex].PEM - 1) * a,
      }
    : { PEM: 1, EFE: 1 };
}
function getCritBoost(a, b = !0) {
  return b
    ? {
        PRM: info.skills.CriticalBoost[document.getElementById("CriticalBoost").selectedIndex].PRM,
        EFR: 1 + (info.skills.CriticalBoost[document.getElementById("CriticalBoost").selectedIndex].PRM - 1) * a,
      }
    : { PRM: 1, EFR: 1 };
}
function damageCalculations(a) {
  if (!1 === a.Raw) [a.raw, a.rawNon, a.efr, a.rawCrit] = [0, 0, 0, 0];
  else {
    a.raw = Math.min(
      ~~(~~(~~a.baseRaw * a.BRM + a.BR + 0.1) * (document.getElementById("HuntingHornAttack").checked ? 1.1 : 1)),
      2600
    );
    var b = (a.raw * a.PRM * getRawHZ(lower(a.type)) * a.rawMV) / 1e4;
    a.rawNon = ~~(0.5 + Math.max(1, b * a.augPRM));
    a.efr = ~~(0.5 + Math.max(1, b * a.augEFR * getCritBoost(a.aff, a.Crit).EFR));
    a.rawCrit = ~~(0.5 + Math.max(1, b * a.augPRM * getCritBoost(a.aff, a.Crit).PRM));
  }
  Object.prototype.hasOwnProperty.call(a, "NoEleBuff") && !0 === a.NoEleBuff
    ? ([a.ele, a.eleNon, a.efe, a.eleCrit] = [a.baseEle, a.baseEle, a.baseEle, a.baseEle])
    : ((a.eleAmmo = /BowGun/.test(weaponType.value) && "None" !== a.eleType ? 1 + a.raw / 100 : 1),
      (a.ele = ~~(Math.min(a.baseEle * a.BEM + a.BE, 365) * a.eleAmmo + 0.1)),
      (b = a.ele * a.PEM * (getEleHZ(a.eleType) / 100) * a.eleMV * a.augPEM),
      (a.eleNon = ~~(0.5 + Math.max(1, b))),
      (a.efe = ~~(0.5 + Math.max(1, b * getCritEle(a.aff, a.Crit).EFE))),
      (a.eleCrit = ~~(0.5 + Math.max(1, b * getCritEle(a.aff, a.Crit).PEM))));
  return { ...a };
}
const sharpnessReduction = (a) => 1 / (1 - a);
function gunlanceShelling(a, b, c, d) {
  const e = new RegExp(`${getWeaponMR().shellingType} Lv${getWeaponMR().shellingLevel}`);
  let g = 1,
    m = 1;
  Object.entries(getAttacks()).forEach((h, f) => {
    e.test(h[0]) &&
      ((g = ~~(
        h[1].rawMV *
        info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][0] *
        info.skills.Artillery[document.getElementById("Artillery").selectedIndex].BRM
      )),
      (m = ~~(
        h[1].rawMV *
        info.skills.Bombardier[document.getElementById("Bombardier").selectedIndex][1] *
        info.skills.Artillery[document.getElementById("Artillery").selectedIndex].BRM
      )),
      a.push([
        "replaceME",
        h[0],
        0,
        `${g} / ${g}`,
        `${h[1].baseEle} / ${h[1].baseEle}`,
        `${(g + h[1].baseEle) * (h[1].ticsPer + 1)} / ${(g + h[1].baseEle) * (h[1].ticsPer + 1)}`,
        m,
        h[1].baseEle,
        (m + h[1].baseEle) * (h[1].ticsPer + 1),
      ]),
      (b[0] += 0),
      (b[1] += g * timesUsed(f + 27)),
      (b[2] += g * timesUsed(f + 27)),
      (b[3] += h[1].baseEle * timesUsed(f + 27)),
      (b[4] += h[1].baseEle * timesUsed(f + 27)),
      (b[5] += (g + h[1].baseEle) * (c.ticsPer + 1) * timesUsed(f + 27)),
      (b[6] += (g + h[1].baseEle) * (c.ticsPer + 1) * timesUsed(f + 27)),
      (b[7] += (m + h[1].baseEle) * (c.ticsPer + 1) * timesUsed(f + 27)));
  });
  /Inputs|inputButton/.test(window?.event?.target.className) || buildDamageTable(a, "dps", d);
  document.getElementById("c0").innerHTML = `${formatNumbers(b[0])}`;
  document.getElementById("d0").innerHTML = `${formatNumbers(b[1])} / ${formatNumbers(b[2])}`;
  document.getElementById("e0").innerHTML = `${formatNumbers(b[3])} / ${formatNumbers(b[4])}`;
  document.getElementById("f0").innerHTML = `${formatNumbers(b[5])} / ${formatNumbers(b[6])}`;
  document.getElementById("g0").innerHTML = `${formatNumbers(b[7])}`;
}
function createTable(a) {
  let b = document.createElement("table"),
    c = "";
  for (let d = 0; d < a.length; d++) {
    c += "<tr>";
    for (let e = 0; e < a[d].length; e++)
      c =
        1 == d
          ? c + ("<td data-tooltip='Base Stats + Augments'>" + a[d][e] + "</td>")
          : 2 == d
          ? c + ("<td data-tooltip='Value Seen In Game'>" + a[d][e] + "</td>")
          : 3 == d
          ? c + ("<td data-tooltip='Total Damage Output If Critical'>" + a[d][e] + "</td>")
          : 4 == d
          ? c + ("<td data-tooltip='Averaged Damage Output'>" + a[d][e] + "</td>")
          : 5 == d
          ? c + ("<td data-tooltip='Critical Damage Increase'>" + a[d][e] + "</td>")
          : 6 != d || weaponType.value.includes("Bow")
          ? 7 == d || (6 == d && weaponType.value.includes("Bow"))
            ? c + ("<td data-tooltip='Total Affinity'>" + a[d][e] + "</td>")
            : c + ("<td>" + a[d][e] + "</td>")
          : c + ("<td data-tooltip='Sharpness Modifier'>" + a[d][e] + "</td>");
    c += "</tr>";
  }
  b.innerHTML = c;
  document.querySelector("#statsTableDiv").replaceChildren(b);
}
function buildDamageTable(a, b) {
  const c = !document.getElementById("ammoTable").classList.contains("augInvis") && weaponType.value.includes("BowGun"),
    d = document.getElementById("dpsTable").classList.contains("augInvis") || !weaponType.value.includes("BowGun"),
    e = /gray/.test(document.getElementById("filterCombo").className)
      ? document.querySelectorAll(".a")
      : document.querySelectorAll(".a:not(.gray)");
  let g = 0;
  const m = document.querySelector(`#${b}Head`),
    h = document.querySelector(`#${b}Body`),
    f = document.createElement("table"),
    k = document.createElement("thead");
  /BowGun/.test(weaponType.value) && "stats" !== b
    ? (k.className = "tableRowRanged")
    : "stats" !== b && (k.className = "tableRowMelee");
  k.id = `${b}Head`;
  const l = document.createElement("tr"),
    n = document.createElement("tbody");
  n.id = `${b}Body`;
  a.splice(0, 1)[0].forEach((q) => {
    const t = document.createElement("th");
    let p;
    Array.isArray(q)
      ? ((p = document.createTextNode(q[0])), (t.dataset.tooltip = q[1]))
      : (p = document.createTextNode(q));
    t.appendChild(p);
    l.appendChild(t);
  });
  k.appendChild(l);
  m.replaceWith(k);
  a.forEach((q) => {
    const t = document.createElement("tr");
    /BowGun/.test(weaponType.value) && "stats" !== b
      ? (t.className = "tableRowRanged")
      : "stats" !== b && (t.className = "tableRowMelee");
    Object.values(q).forEach((p) => {
      if ("replaceME" === p)
        if (
          document.getElementById("previousWeaponType").value === weaponType.value &&
          0 < e.length &&
          ((window?.event?.target === dropWeapon && "ChargeBlade" !== weaponType.value) ||
            window?.event?.target !== dropWeapon) &&
          "BowChargePlus" !== window?.event?.target.id &&
          (("Bow" === weaponType.value && document.getElementById("previousWeapon").value === dropWeapon.value) ||
            "Bow" !== weaponType.value)
        )
          t.appendChild(e[g]), ++g;
        else {
          var r = document.createElement("td");
          p = document.createElement("input");
          p.type = "Number";
          p.className = `Combo skill ${g}`;
          p.Max = 20;
          "Bow" === weaponType.value &&
            document.getElementById("previousWeapon").value !== dropWeapon.value &&
            ((comboTracker = []), updateComboDisplay());
          0 === g
            ? ((p.id = "inputComboRepeat"),
              (p.Min = 1),
              (p.value = 1),
              (p.className = "inputComboRepeat hitsOfSharpInputs inputs"))
            : ((p.id = g), (p.className = "inputs hitsOfSharpInputs"), (p.Min = 0), (p.value = 0));
          ++g;
          r.appendChild(p);
          t.appendChild(r);
        }
      else (r = document.createElement("td")), (p = document.createTextNode(p)), r.appendChild(p), t.appendChild(r);
    });
    n.appendChild(t);
    h.replaceWith(n);
  });
  f.setAttribute("id", `${b}Table`);
  n.className = /(BowGun)/.test(weaponType.value) ? "rangedTable" : "meleeTable";
  document.getElementById("damageContainer").className = /(BowGun)/.test(weaponType.value)
    ? "rangedContainer"
    : "meleeContainer";
  document.getElementById("ammoTable").classList.toggle("augInvis", c);
  document.getElementById("dpsTable").classList.toggle("augInvis", !d);
  /BowGun/.test(weaponType.value) || document.getElementById("ammoTable").classList.add("augInvis");
  if ("stats" !== b && "ammo" !== b) {
    const [q, ...t] = /BowGun/.test(weaponType.value)
      ? [g, "a", "b", "c", "d", "e", "f", "g", "h"]
      : [g, "a", "b", "c", "d", "e", "f", "g"];
    /BowGun/.test(weaponType.value) && !/BowGun/.test(document.getElementById("previousWeaponType").value)
      ? document.querySelectorAll("#comboCountContainer").forEach((p) => (p.style.display = "none"))
      : !/BowGun/.test(weaponType.value) &&
        /BowGun/.test(document.getElementById("previousWeaponType").value) &&
        document.querySelectorAll("#comboCountContainer").forEach((p) => (p.style.display = ""));
    document.getElementById("previousWeapon").value = dropWeapon.value;
    document.getElementById("previousWeaponType").value = weaponType.value;
    for (let p = 0; p < q; ++p)
      t.forEach((r, u) => {
        document.getElementById(`${b}Body`).children[p].children[u].id = r + p;
        document.getElementById(`${b}Body`).children[p].children[u].className = `${r} ${p}`;
      });
    weaponType.value.includes("BowGun") ||
      document.querySelectorAll(`tbody#${b}Body>tr>td:nth-child(2)`).forEach((p, r) => {
        const u = document.createElement("td");
        u.innerHTML = `<button type="button" aria-pressed="false" id="${r}" class="inputButton dec"
                    >&#8681</button><button type="button" aria-pressed="false" id="${r}" class="inputButton inc">&#8679</button><output class="label">${p.textContent}</output>`;
        u.id = `b${r}`;
        u.className = `b ${r} inputContainer`;
        p.replaceWith(u);
      });
  }
  /blue/.test(document.getElementById("filterCombo").className) &&
    document.querySelectorAll(".a").forEach((q, t) => {
      "none" === document.querySelectorAll(`.${t}`)[0].style.display &&
        document.querySelectorAll(`.${t}`).forEach((p) => (p.style.display = "none"));
    });
}
const setSpawn = () => {
  document.querySelectorAll("#spawnArea>output").forEach((a) => a.remove());
  info.quest[dropQuest.value].target.forEach((a) => {
    a.name === dropMon.value &&
      a.spawn.forEach((b) => {
        const c = document.createElement("output");
        c.textContent = `Spawn Area ${b.block} ${b.lot}%`;
        document.getElementById("spawnArea").append(c);
      });
  });
};
function monChart() {
  setSpawn();
  if ("" !== dropQuest.value) {
    const a = /Bow/.test(weaponType.value) ? "shot" : "H" === weaponType.value[0] ? "blunt" : "sever",
      b = "Hit Zone;Sever;Blunt;Shot;Fire;Water;Thunder;Ice;Dragon".split(";"),
      c = document.createElement("table"),
      d = document.querySelector("#monTable");
    let e = info.monster[dropMon.value].parts.sort((m, h) =>
      h[a] === m[a] && getWeaponMR().eleType ? h[getWeaponMR().eleType] - m[getWeaponMR().eleType] : h[a] - m[a]
    );
    const g = document.createElement("tr");
    b.forEach((m) => {
      const h = document.createElement("th");
      m = document.createTextNode(m);
      h.appendChild(m);
      g.appendChild(h);
    });
    c.appendChild(g);
    e.forEach((m) => {
      const h = document.createElement("tr");
      for (let k = 0; 9 > k; ++k) {
        var f = 0 === k ? `${m.part} ${m.state}` : m[lower(b[k])];
        const l = document.createElement("td");
        0 !== k &&
          ((f =
            document.getElementById("WaterBlight").checked && 4 > k
              ? Math.min(100, ~~(Math.max(f, 0.63 * f + 22.2) + 3))
              : +f),
          14 > +f
            ? l.setAttribute("class", "F")
            : 15 > +f
            ? l.setAttribute("class", "C")
            : 45 > +f
            ? l.setAttribute("class", "B")
            : 65 > +f
            ? l.setAttribute("class", "A")
            : 65 <= +f && l.setAttribute("class", "S"),
          (f = ~~f));
        f = document.createTextNode(f);
        l.appendChild(f);
        h.appendChild(l);
      }
      c.appendChild(h);
    });
    c.setAttribute("id", "monTable");
    d.replaceWith(c);
  }
}
document.querySelectorAll("select.demon").forEach((a) => {
  a.addEventListener("change", (b) => {
    0 < b?.target.selectedIndex &&
      ((document.querySelectorAll(`.demon:not(#${b?.target.id})`)[0].selectedIndex = 0),
      (document.querySelectorAll(`.demon:not(#${b?.target.id})`)[1].selectedIndex = 0));
  });
});
document.querySelectorAll(`#${dropWeapon.id}, #${weaponType.id}`).forEach((a) => {
  a.addEventListener("change", (b) => {
    (b.target !== weaponType && "ChargeBlade" !== weaponType.value) || classChange();
  });
});
document.querySelectorAll(`#${dropWeapon.id}, #${weaponType.id}`).forEach((a) => {
  a.addEventListener("change", () => {
    if ("Bow" === weaponType.value) {
      document.querySelectorAll("#BowCoating>option").forEach((c) => c.remove());
      const b = [];
      getWeaponMR().coatings.forEach((c) => {
        const d = document.createElement("option");
        d.textContent = c;
        document.getElementById("BowCoating").append(d);
        b.push(info.skills[c]);
      });
      info.skills.BowCoating = b;
    }
  });
});
function classChange() {
  if (info) {
    weaponType.value.includes("Bow") && (document.getElementById("Sharpness").selectedIndex = 0);
    0 < document.getElementsByClassName("inputs").length && comboReset();
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
    }
    info.skills.Bombardier = /Gun|Charge/.test(weaponType.value) ? info.skills.BombardierSource[weaponType.value] : [];
    document.querySelectorAll(`.skill:not(.${weaponType.value})`).forEach((a) => (a.selectedIndex = 0));
    document.querySelectorAll(".classSpecific").forEach((a) => {
      a.style.display = "";
      a.parentElement.style.display = "";
      a.classList.contains(weaponType.value)
        ? "BUTTON" === a.tagName || "DIV" === a.tagName
          ? (a.style.display = "")
          : (a.parentElement.style.display = "")
        : "BUTTON" === a.tagName || "DIV" === a.tagName
        ? (a.style.display = "none")
        : (a.parentElement.style.display = "none");
    });
    document.querySelectorAll("div").forEach((a) => {
      Object.values(a.children).some(
        (b) => 3 >= a.childElementCount && "SELECT" === b.tagName && "none" !== a.style.display
      ) && a.classList.add("dropContainer");
    });
    document.getElementById("weaponId").textContent = weaponType.value;
    "ChargeBlade" === weaponType.value && meleeElements();
  }
}
function meleeElements() {
  "Impact Phial" === getWeaponMR().phialType
    ? ((document.getElementById("impShieldCharge").parentNode.style = 'display:"'),
      (document.getElementById("eleShieldCharge").parentNode.style = "display:none"),
      (document.getElementById("eleShieldCharge").selectedIndex = 0))
    : "Element Phial" === getWeaponMR().phialType &&
      ((document.getElementById("impShieldCharge").parentNode.style = "display:none"),
      (document.getElementById("impShieldCharge").selectedIndex = 0),
      (document.getElementById("eleShieldCharge").parentNode.style = 'display:""'));
}
document.addEventListener("keypress", (a) => {
  (a.key === ["t", "e", "s", "t"][Math.min(3, testKeyCount)] && 3 > ++testKeyCount) ||
    ("Enter" === a.key && 3 <= testKeyCount
      ? (build("f" === armorCount ? !1 : !0), (armorCount = ""), (testKeyCount = 0))
      : /t|f/.test(a.key) && 3 <= testKeyCount
      ? (armorCount = a.key)
      : 3 > testKeyCount && (testKeyCount = 0));
});
function resetSkills() {
  document.querySelectorAll("div#setSearcher>div#skillSelect>div").forEach((a) => a.remove());
}
document.getElementById("BowChargePlus").addEventListener("change", () => {
  comboReset();
  updateComboDisplay();
});
document.querySelectorAll(".scroll").forEach((a) => {
  ("IMG" !== a.tagName && "BUTTON" !== a.tagName) ||
    a.addEventListener("mousedown", () => {
      Object.values(document.querySelectorAll("img.scroll")).forEach((b) => {
        b.classList.toggle("vis");
        b.classList.toggle("invis");
      });
      document.querySelector("img#redScroll")?.classList.contains("invis")
        ? ((info.skills.MailofHellfire = info.skills.MailofHellfireSource.blue),
          (info.skills.Dereliction = info.skills.DerelictionSource.blue))
        : ((info.skills.MailofHellfire = info.skills.MailofHellfireSource.red),
          (info.skills.Dereliction = info.skills.DerelictionSource.red));
    });
});
weaponType.addEventListener("change", () => {
  weaponSelect();
});
document.getElementById("weaponFilter").addEventListener("click", (a) => {
  a.target.classList.toggle("blue");
  a.target.classList.toggle("gray");
  weaponSelect();
});
document.querySelectorAll("input.check").forEach((a) =>
  a.addEventListener("mousedown", (b) => {
    /DemonDrug/.test(b?.target.id) &&
      ("DemonDrug" === b?.target.id
        ? (document.getElementById("MegaDemonDrug").checked = !1)
        : (document.getElementById("DemonDrug").checked = !1));
    "filterCombo" !== b?.target.id
      ? "WaterBlight" === b?.target.id && ((b = dropHZ.selectedIndex), monChart(), (dropHZ.selectedIndex = b))
      : b?.target === filterCombo && filterTableForComboAttacks();
  })
);
function toggleAmmoTables() {
  let a = document.getElementById("dpsTable").classList.contains("augInvis");
  document.getElementById("dpsTable").classList.toggle("augInvis", !a);
  document.getElementById("ammoTable").classList.toggle("augInvis", a);
}
function calculateAmmoFrames(a) {
  let b = /Sub-Lv|Explosion| Procs|\(RF\+\d\)/g.test(a.attackName)
    ? a.attackName.replace(/Sub-| Explosion| \(RF\+\d\) Procs| Procs| \(RF\+\d\)/g, "")
    : a.attackName;
  b = /(?<!Lv)\d/.test(b) ? `${b.slice(0, b.length - 1)}Lv${b.slice(-1)}` : b;
  const c = {};
  c.ammoIncrease = info.ammo.AmmoUp[b][document.getElementById("AmmoUp").selectedIndex];
  c.recoilSpeed =
    info.ammo.recoil[b][
      Math.max(
        0,
        Math.min(
          5,
          a.recoil -
            1 +
            document.getElementById("RecoilDown").selectedIndex +
            (0 < info.skills.BowgunBarrel[document.getElementById("BowgunBarrel").selectedIndex ?? 0].Silencer
              ? document.getElementById("Tune-Up").selectedIndex +
                info.skills.BowgunBarrel[document.getElementById("BowgunBarrel").selectedIndex ?? 0].Silencer
              : 0) -
            (0 < document.getElementById("CriticalFirePower").selectedIndex ? 2 : 0)
        )
      )
    ];
  c.recoilSpeed = /\(RF\+\d\)/.test(a.attackName)
    ? `${c.recoilSpeed} ${a.attackName.match(/\(RF\+\d\)/)[0]}`
    : c.recoilSpeed;
  c.recoilFrames = info.ammo.recoil.frames[c.recoilSpeed];
  c.reloadSpeed =
    info.ammo.reload[b][
      Math.max(
        0,
        Math.min(
          8,
          a.reload +
            document.getElementById("ReloadSpeed").selectedIndex +
            info.skills.BowgunBarrel[document.getElementById("BowgunBarrel").selectedIndex ?? 0].reload +
            (0 === document.getElementById("BowgunBarrel")?.selectedIndex &&
            0 < document.getElementById("Tune-Up").selectedIndex
              ? 1
              : 0) -
            (0 < document.getElementById("ElementalReload").selectedIndex ? 2 : 0)
        )
      )
    ];
  c.reloadFrames = info.ammo.reload.frames[c.reloadSpeed];
  c.clipSize = a.clipSize[a.isUsed] + c.ammoIncrease;
  c.spareShot = Math.max(
    0,
    info.skills.SpareShot[document.getElementById("SpareShot").selectedIndex] +
      Number(document.getElementById("spareAdjust").value)
  );
  /(?<!snipe.*)explosion/.test(b) &&
    0 < document.getElementById("Bombardier").selectedIndex &&
    (c.spareShot += info.skills.Bombardier[b.match(/Sticky|Wyvern/)[0]][2]);
  c.shotsPerMinBase = shotsCheck(c.recoilFrames / 30, c.reloadFrames / 30, a.clipSize[a.isUsed], 60);
  c.shotsPerMin = shotsCheck(c.recoilFrames / 30, c.reloadFrames / 30, c.clipSize, 60, 100 / c.spareShot);
  c.shotsPerGain = `${Number.parseFloat(100 * (c.shotsPerMin / c.shotsPerMinBase - 1)).toFixed(2)}%`;
  let d = { PierceEle: 3, Pierce1: 1.5, Pierce2: 1.1, Pierce3: 1 };
  b = b.replace(/ Lv/, "");
  c.ticsAdjust = a.ticsPer += 1;
  /Pierc/.test(b) &&
    "Toadversary" !== dropMon.value &&
    (a.ticsPer = Math.min(
      a.ticsPer,
      Math.ceil(
        (info.monster[dropMon.value].size.base_size * info.monster[dropMon.value].size.king_boarder) /
          100 /
          d[/Pierce[1-3]/.test(b) ? b : "PierceEle"]
      ) * (a.attackName.includes("RF+") ? +a.attackName.trim().slice(-2, -1) : 1)
    ));
  return c;
}
function comboReset() {
  document.getElementsByClassName("inputs").length &&
    !/BowGun/.test(document.getElementById("previousWeaponType").value) &&
    "" !== document.getElementById("previousWeaponType").value &&
    (document.querySelectorAll(".comboHits").forEach((a) => a.remove()),
    document.querySelectorAll("#dpsBody>tr:nth-child(1)>td:nth-child(n+3)").forEach((a) => (a.value = 0)),
    document.querySelectorAll(".inputs").forEach((a) => (a.value = 0)),
    document.querySelectorAll(".inputComboRepeat").forEach((a) => (a.value = 1)),
    (comboTracker = []));
}
function filterTableForComboAttacks() {
  document.querySelectorAll(".inputs").forEach((a, b) => {
    /blue/.test(document.getElementById("filterCombo").className) && (0 == a.value || a.style.display.includes("none"))
      ? (document.getElementsByClassName([b]).style.display = "none")
      : (document.getElementsByClassName([b]).style.display = "");
  });
}
info.augs = {
  attackAug: [
    [0, 0],
    [2, 5],
    [4, 10],
    [6, 15],
    [8, 20],
  ],
  affinityAug: [
    [0, 0],
    [3, 5],
    [6, 10],
    [8, 15],
  ],
  elementalAug: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
  ],
  rampageAug: [
    [0, 0],
    [3, 1],
    [7, 2],
  ],
  sharpnessAug: [
    [0, 0],
    [3, 1],
    [5, 2],
    [7, 3],
  ],
};
info.augIndex = { attackAug: 0, affinityAug: 0, elementalAug: 0, rampageAug: 0, sharpnessAug: 0 };
document.addEventListener("click", (a) => {
  "BUTTON" === a?.target.tagName && dataCompile(a);
});
document.getElementById("setBuilder").addEventListener("change", (a) => {
  "SELECT" === a?.target.tagName && dataCompile(a);
});
document.getElementById("damageTable").addEventListener("mousedown", (a) => {
  a.target.classList.contains("inputButton") &&
    (a.target?.classList.contains("dec") ? decreaseComboCount(a) : increaseComboCount(a),
    document.getElementById("comboCountContainer")?.classList.remove("augInvis"));
});
function increaseComboCount(a) {
  20 > Number(document.querySelectorAll(".inputs")[a?.target.id].value) &&
    (++document.querySelectorAll(".inputs")[a?.target.id].value, dataCompile());
}
function decreaseComboCount(a) {
  if (
    ("0" === a?.target.id && 1 < Number(document.querySelectorAll(".inputs")[a?.target.id].value)) ||
    (0 < Number(a?.target.id) && 0 < Number(document.querySelectorAll(".inputs")[a?.target.id].value))
  )
    --document.querySelectorAll(".inputs")[a?.target.id].value, dataCompile();
}
const quriousAugsDec = (a) => {
    var b = +document.getElementById("weaponQurious").value.slice(-3, -2);
    let c = a.parentElement.querySelector("output.label"),
      d = info.augIndex[a.className.match(/\w+Aug/)[0]];
    0 !== d &&
      ((b -= info.augs[a.className.match(/\w+Aug/)[0]][d - 1][0] - info.augs[a.className.match(/\w+Aug/)[0]][d][0]),
      (d = --info.augIndex[a.className.match(/\w+Aug/)[0]]),
      (c.textContent = info.augs[a.className.match(/\w+Aug/)[0]][d][0]),
      (c.nextElementSibling.textContent = "+" + info.augs[a.className.match(/\w+Aug/)[0]][d][1]),
      (document.getElementById("weaponQurious").textContent = `Remaining Augments ${9 - b}/9`));
  },
  quriousAugsInc = (a) => {
    let b = info.augIndex[a.className.match(/\w+Aug/)[0]];
    if (
      info.augs[a.className.match(/\w+Aug/)[0]] &&
      !("rampageAug" === a.className.match(/\w+Aug/)[0] && 2 < +document.querySelector("#rampImg").src.slice(-5, -4))
    ) {
      var c = 0;
      Object.entries(info.augs).forEach(([g, m]) => (c += m[info.augIndex[g]][0]));
      var d =
        c + (info.augs[a.className.match(/\w+Aug/)[0]][b + 1][0] - info.augs[a.className.match(/\w+Aug/)[0]][b][0]);
      if (!(9 < d)) {
        var e = a.parentElement.querySelector("output.label");
        b = ++info.augIndex[a.className.match(/\w+Aug/)[0]];
        e.textContent = info.augs[a.className.match(/\w+Aug/)[0]][b][0];
        e.nextElementSibling.textContent = "+" + info.augs[a.className.match(/\w+Aug/)[0]][b][1];
        document.getElementById("weaponQurious").textContent = `Remaining Augments ${9 - d}/9`;
      }
    }
  };
document
  .querySelectorAll(".augButton.inc")
  .forEach((a) => a.addEventListener("mousedown", (b) => quriousAugsInc(b.target)));
document
  .querySelectorAll(".augButton.dec")
  .forEach((a) => a.addEventListener("mousedown", (b) => quriousAugsDec(b.target)));
let toClipboardNoFocus = (a) => {
  let b = document.createElement("textarea");
  b.value = a;
  document.body.appendChild(b);
  b.select();
  document.execCommand("copy");
  document.body.removeChild(b);
};
const toClipboard = (a) => {
  a = JSON.stringify(a);
  navigator.clipboard.writeText(a);
};
let saveState = () => {
    let a = [dropWeapon.selectedIndex, weaponType.selectedIndex];
    document.querySelectorAll("#skillSelect label").forEach((b) => {
      a.push([b.textContent, +b.nextElementSibling.textContent.slice(-1)]);
    });
    toClipboardNoFocus(
      JSON.stringify([
        [a],
        Object.values(document.querySelectorAll("section.armorDisplay")).map((b) =>
          [].concat(
            Object.values(b.querySelectorAll(".armor,select.augmentType,select.augment")).map((c) => c.selectedIndex),
            Object.values(b.querySelectorAll("select.armorDisplay")).map((c) => c.selectedIndex)
          )
        ),
      ])
    );
  },
  loadState = () => {
    navigator.clipboard.readText().then(async (a) => {
      a = await JSON.parse(a).shift()[0];
      dropWeapon.selectedIndex = await a.shift();
      weaponType.selectedIndex = await a.shift();
      await rampageSelect();
      await a.forEach((b) => createSkillSelections(b[0], b[1]));
      getSetBuilds(15);
    });
  };
document.getElementById("saveState")?.addEventListener("click", () => saveState());
document.getElementById("loadState")?.addEventListener("click", () => loadState());
updateComboDisplay();
function weaponTypeSelect() {
  populateDropDowns(weaponTypes, weaponType);
}
document.querySelectorAll("#weaponFilter,button.rampageAug").forEach((a) =>
  a.addEventListener("click", () => {
    rampageSelect();
  })
);
function weaponSelect() {
  Object.values(dropWeapon.children).forEach((b) => b.remove());
  let a = [];
  a = document.getElementById("weaponFilter").className.includes("blue")
    ? Object.entries(info[weaponType.value].weapons).filter((b) => 10 === b[1].rank)
    : Object.entries(info[weaponType.value].weapons);
  a.forEach((b) => {
    const c = document.createElement("option");
    c.value = b[0];
    c.textContent = b[1].weapon;
    dropWeapon.append(c);
  });
}
function rampageSelect() {
  const a = [],
    [...b] = info[weaponType.value].weapons[dropWeapon.value].decos;
  b.forEach((c, d) => {
    0 < c && a.push(d + 1);
    1 < b[d - 1]
      ? a.push(d)
      : 1 < b[d + 1]
      ? (a.push(d + 2), --b[d + 1])
      : 2 < b[d - 2]
      ? (a.push(d - 1), --b[d - 2])
      : 2 < b[d + 2] && (a.push(d + 3), --b[d + 2]);
  });
  setDecoDisplay("weapon", a.reverse());
  document.querySelectorAll("#weaponRampage>*").forEach((c) => (c.style.display = "none"));
  document.getElementById("weaponRampage0").style.display = "";
  if (getWeaponMR().rampageSlots) {
    const c = [];
    document.getElementById("rampImg").src = document
      .getElementById("rampImg")
      .src.replace(/ramp\d/, `ramp${Math.min(3, getWeaponMR().rampageSlots + info.augIndex.rampageAug)}`);
    Object.keys(info.rampage.rampageDecos).forEach((d) => {
      Number(d.slice(-1)) <= Math.min(3, getWeaponMR().rampageSlots + info.augIndex.rampageAug) &&
        c.push(info.rampage.rampageDecos[d]);
    });
    populateDropDowns(c, document.getElementById("weaponRampage0"));
  } else
    document.querySelectorAll("#weaponRampage>*").forEach((c) => {
      c.selectedIndex = 0;
      c.style.display = "none";
    }),
      (document.getElementById("weaponRampage0").style.display = ""),
      /Rampage/.test(getWeaponMR().weapon)
        ? info.rampage[getWeaponMR().weapon].Rampage.forEach((c, d) => {
            document.querySelector("#weaponRampage").children[d].style.display = "";
            populateDropDowns(Object.values(c), document.querySelector("#weaponRampage").children[d]);
          })
        : getWeaponMR().rampage.forEach((c) => {
            const d = document.createElement("option");
            d.value = info.rampage.keys2[c];
            d.textContent = info.rampage.keys2[c];
            document.getElementById("weaponRampage0").append(d);
          });
}
function populateDropDowns(a, b, c = a) {
  b?.childElementCount && Object.values(b.children).forEach((d) => d.remove());
  a.forEach((d, e) => {
    const g = document.createElement("option");
    g.value = c[e];
    g.textContent = d;
    b.append(g);
  });
}
function monsterSelect() {
  populateDropDowns(Object.keys(info.monster), dropMon);
  dropMon.selectedIndex = Object.keys(info.monster).indexOf("Toadversary");
}
const getEleHZ = (a) => info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(a)];
function getRawHZ(a) {
  return void 0 === info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(a)]
    ? 100
    : document.getElementById("WaterBlight").checked
    ? Math.min(
        100,
        ~~(
          Math.max(
            info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(a)],
            0.63 * info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(a)] + 22.2
          ) + 3
        )
      )
    : info.monster[dropMon.value].parts[dropHZ.selectedIndex][lower(a)];
}
const getUsedAttacks = (a = weaponType.value) => {
    let b = {};
    if ("InsectGlaive" === weaponType.value)
      return (
        (b = Object.fromEntries(
          Object.entries(info.InsectGlaive.attacks).filter((d) => !/Sever|Blunt|Kinsect|Dust|Powder|Mark/.test(d))
        )),
        { ...b }
      );
    if ("ChargeBlade" === weaponType.value) {
      var c = "Impact Phial" === getWeaponMR().phialType ? "Element Phial|Elemental Phial" : "Impact Phial";
      const d = new RegExp(`${c}`);
      b = Object.fromEntries(Object.entries(info.ChargeBlade.attacks).filter((e) => !d.test(e)));
      return { ...b };
    }
    if ("Bow" === weaponType.value) {
      let d = "";
      const e =
        1 === document.getElementById("BowChargePlus").selectedIndex && 4 > getWeaponMR().baseCharge
          ? getWeaponMR().baseCharge + 1
          : getWeaponMR().baseCharge;
      getWeaponMR().bowShot.forEach((m, h) => {
        h < e && (d += `|Lv${m.match("[1-5]")[0]} ${m.match("Normal|Rapid|Pierce|Spread")[0]}`);
      });
      const g = new RegExp([d.slice(1)]);
      c = Object.entries(info.Bow.attacks).filter((m) => g.test(m[0]));
      c = [].concat(Object.entries(info.Bow.attacks).splice(0, 1), c);
      c = c.concat(Object.entries(info.Bow.attacks).splice(136));
      b = Object.fromEntries(c);
      return { ...b };
    }
    if ("Gunlance" === weaponType.value)
      return (b = Object.fromEntries(Object.entries(info.Gunlance.attacks).splice(0, 27))), { ...b };
    if ("LightBowGun" === weaponType.value || "HeavyBowGun" === weaponType.value) {
      let { isRapidFire: d, clipSize: e } = info[weaponType.value].weapons[dropWeapon.value],
        g = [];
      a = 0;
      for (c of info.ammo.keys) e[++a] && g.push(0 <= d?.indexOf(c[0]) ? c[1] : c[0]);
      g = g.concat(
        Object.keys(info.ammo).filter((m) =>
          "LightBowGun" === weaponType.value ? /lbg|Wyvern Blast(?! before)/.test(m) : /hbg|Wyverns/.test(m)
        )
      );
      b = Object.fromEntries(Object.entries(info.ammo).filter((m) => 0 < timesUsed(m[0], g)));
      return { ...b };
    }
    return { ...info[a].attacks };
  },
  getAttacks = (a = weaponType.value) => ({ ...info[a].attacks }),
  getWeapon = () =>
    0 < info[weaponType.value].weapons[dropWeapon.selectedIndex].rampageSlots ? getWeaponMR() : getRampageSkills();
function partSelect() {
  document.querySelectorAll("#dropHZ>option").forEach((b) => b.remove());
  const a = [];
  info.monster[dropMon.value].parts.forEach((b) => {
    a.push([`${b.part} ${b.state}`]);
  });
  populateDropDowns(a, dropHZ);
}
function questSelect() {
  document.querySelectorAll("#HR>option").forEach((a) => a.remove());
  document.querySelectorAll("#MR>option").forEach((a) => a.remove());
  Object.values(info.quest)
    .filter((a) => {
      if (a.target.some((b) => b.name === dropMon.selectedOptions[0].textContent)) return a;
    })
    .forEach((a) => {
      a.target.forEach((b, c) => {
        b.name === dropMon.value &&
          ((b = document.createElement("option")),
          (b.value = a.quest),
          (b.textContent = a.quest),
          document.getElementById(a.rank).append(b));
      });
    });
  updateQuest(
    0 < document.querySelectorAll("#MR>option")?.length
      ? document.querySelectorAll("#MR>option")[0].textContent
      : document.querySelectorAll("#HR>option")[0].textContent
  );
  document.querySelectorAll("MR>option")?.length
    ? document.getElementById("MR")?.classList.remove("augInvis")
    : document.getElementById("MR")?.classList.add("augInvis");
  document.querySelectorAll("HR>option")?.length
    ? document.getElementById("HR")?.classList.remove("augInvis")
    : document.getElementById("HR")?.classList.add("augInvis");
}
function healthSelect() {
  let a = 1;
  switch (document.getElementById("players").selectedOptions[0].value) {
    case "1p":
      a = 1;
      break;
    case "2p":
      a = 1.35;
      break;
    case "3p":
      a = 1.7;
      break;
    case "4p":
      a = 2;
  }
  info.quest[dropQuest.value].target.forEach((b) => {
    b.name === dropMon.value && ((b = b.hp.map((c) => c * a)), populateDropDowns(b, document.getElementById("health")));
  });
}
function isUnique(a, b, c) {
  return c.indexOf(a) === b;
}
function showMenu() {
  document.querySelectorAll(".menu").forEach((b) => b.classList.remove("augInvis"));
  var a = 0 < document.querySelectorAll("#MR>option").length;
  document.getElementById("MR").parentElement.classList.toggle("augInvis", !a);
  a = 0 < document.querySelectorAll("#HR>option").length;
  document.getElementById("HR").parentElement.classList.toggle("augInvis", !a);
}
function updateQuest(a) {
  document.getElementById("dropQuest").selectedOptions[0].value = a;
  document.getElementById("dropQuest").selectedOptions[0].textContent = a;
  document.getElementById("questDiv")?.classList.add("augInvis");
}
const capitalAll = (a) => a.replace(/(?<!\w)\w/g, (b) => b.toUpperCase()),
  capital = (a, b = 0) => a[b].toUpperCase() + a.slice(1),
  lower = (a) => a[0].toLowerCase() + a.slice(1);
function shotsCheck(a, b, c, d = 60, e = 0) {
  let g;
  g = 0 + e;
  let m = 0,
    h = 0;
  for (; m <= d; ) {
    for (let f = 0; f < c; ++f)
      (m += a), (h += h + m <= d ? 1 : 0), h >= g && 0 !== e && Infinity !== e && (--f, (g += e));
    m += b;
  }
  return h;
}
function getHealthPools(a = [[], [], [], []]) {
  info.quest
    .filter((b) => b.quest === dropQuest.value)
    .target[dropMon.value].hp.forEach((b) => {
      a[0].push(b);
      a[1].push(~~(1.35 * b));
      a[2].push(~~(1.7 * b));
      a[3].push(~~(2 * b));
    });
  return a;
}
function resetSkillDescription() {
  if ("" !== lastEvent && (lastEvent !== document.getElementById("BowCoating") || "Bow" === weaponType.value)) {
    var a = [];
    Object.values(lastEvent.children).some((b) => "OPTGROUP" === b.tagName)
      ? ((a = document.querySelectorAll(`${lastEvent.id}>*>*`)), a.splice(-2), a.splice(0, 0, lastEvent[0]))
      : (a = Object.values(lastEvent.children));
    a.forEach((b, c) => {
      if (lastEvent === document.getElementById("BowCoating")) var d = getWeaponMR().coatings[c];
      else
        lastEvent === document.getElementById("BowgunBarrel")
          ? (d = ["----", "Long", "Power", "Silencer", "Guard-Up"][c])
          : lastEvent === document.getElementById("Dereliction")
          ? (d = "---- Lv-1-1 Lv-1-2 Lv-1-3 Lv-2-1 Lv-2-2 Lv-2-3 Lv-3-1 Lv-3-2 Lv-3-3".split(" ")[c])
          : ((d = c + 0),
            "OPTGROUP" === lastEvent.children[1].tagName &&
              0 !== c &&
              (d = "Burst" === lastEvent.id && 2 <= c ? c - 1 : 0 === c % 3 ? 3 : c % 3),
            (d = "Burst" === lastEvent.id && 1 === c ? "Base Bonus" : `Lv-${d}`));
      b.textContent = 0 === c ? "----" : d;
    });
    lastEvent = "";
  }
}
document.querySelectorAll(".buildSkills").forEach((a) =>
  a.addEventListener("mousedown", (b) => {
    if ("" === lastEvent || lastEvent !== b?.target || b.target.className.includes("augment"))
      "" !== lastEvent && resetSkillDescription(),
        b.target.classList.contains("skill") && setSkillDescriptions(b?.target),
        "INPUT" === b.target.tagName && b.target.className.includes("skillInput") && (lastEvent = b.target);
  })
);
document.querySelectorAll("select.skill").forEach((a) =>
  a.addEventListener("change", (b) => {
    resetSkillDescription();
    b?.target.blur();
  })
);
function setSkillDescriptions(a) {
  a.classList.contains("skill") &&
    Array.isArray(info.skills[a.id]) &&
    (info.skills[a.id].forEach((b, c) => {
      if (0 !== c)
        if ("RecoilDown" === a.id || "ReloadSpeed" === a.id) var d = `${a.id.slice(0, 6)} ${a.id.slice(6)} +${c}`;
        else if ("AmmoUp" === a.id || "SpareShot" === a.id)
          d = `${c}: ${
            ("AmmoUp" === a.id
              ? ["No Change", "Lv2 & Ele Ammo", "Lv3 & Dragon Ammo"]
              : ["Spare Shot +5%", "Spare Shot +10%", "Spare Shot +20%"])[c - 1]
          }`;
        else if ("Marksman" === a.id)
          d = `${c}: ${
            [
              "Chance 20% Raw  + 5% EFR +1%",
              "Chance 20% Raw+10% EFR +2%",
              "Chance 60% Raw  + 5% EFR +3% ",
              "Chance 40% Raw+10% EFR +4%",
            ][c - 1]
          }`;
        else if ("Bombardier" === a.id)
          d =
            "HeavyBowGun" !== weaponType.value
              ? `${c}: Raw +${info.skills.Bombardier[c][0]}% EFR +${info.skills.Bombardier[c][1]}`
              : [
                  "Bombardier",
                  "1: Raw + 10% EFR + 10%",
                  "2: Sticky+10% Wyvern+15%",
                  "3: Raw + 20% EFR + 16%",
                  "4: Raw + 25% EFR + 17%",
                ][c];
        else if ("BowgunBarrel" === a.id)
          d = ["Barrels", "Long: Raw + 5%", "Power: Raw + 12.5%", "Silencer: Recoil Down +1", "Shield: Guard Up"][c];
        else if ("CriticalFirePower" === a.id) d = ["-", "Normal +30% Spread +20% Pierce +10% Recoil -2"][c];
        else {
          d = "";
          if (0 < b.BR || 1 < b.PRM || 1 < b.BRM) {
            d = "Raw";
            0 < b.BR && (d += /\d\.?\d/.test(b.BR) ? `+${b.BR}` : ` + ${b.BR}`);
            if (1 < b.BRM) {
              var e = /\.[1-8]/.test(100 * (b.BRM - 1))
                ? (100 * (b.BRM - 1)).toFixed(1)
                : (100 * (b.BRM - 1)).toFixed(0);
              d += /\d\.?\d/.test(e) ? `+${e}%` : ` + ${e}%`;
            }
            1 < b.PRM &&
              ((e = /\.[1-8]/.test(100 * (b.PRM - 1))
                ? (100 * (b.PRM - 1)).toFixed(1)
                : (100 * (b.PRM - 1)).toFixed(0)),
              (d +=
                "CriticalBoost" === a.id && /\d\.?\d/.test(e - 25)
                  ? `+${e - 25}%`
                  : "CriticalBoost" === a.id
                  ? ` + ${e - 25}%`
                  : /\d\.?\d/.test(e)
                  ? `+${e}%`
                  : ` + ${e}%`));
          }
          e = "";
          if (0 < b.BE || 1 < b.PEM || 1 < b.BEM) {
            e = "Ele";
            0 < b.BE && (e += /\d\.?\d/.test(b.BE) ? `+${b.BE}` : ` + ${b.BE}`);
            if (1 < b.BEM) {
              var g = /\.[1-8]/.test(100 * (b.BEM - 1))
                ? (100 * (b.BEM - 1)).toFixed(1)
                : (100 * (b.BEM - 1)).toFixed(0);
              e += /\d\.?\d/.test(g) ? `+${g}%` : ` + ${g}%`;
            }
            1 < b.PEM &&
              ((g = /\.[1-8]/.test(100 * (b.PEM - 1))
                ? (100 * (b.PEM - 1)).toFixed(1)
                : (100 * (b.PEM - 1)).toFixed(0)),
              (e += /\d\.?\d/.test(g) ? `+${g}%` : ` + ${g}%`));
          }
          g = 0 < b.aff && /\d\.?\d/.test(b.aff) ? `Aff+${b.aff}` : 0 < b.aff ? `Aff + ${b.aff}` : "";
          d = Object.prototype.hasOwnProperty.call(b, "Sharp") && 1 > b.Sharp ? `Sharp +${100 * b.Sharp}%` : d;
          d = Object.prototype.hasOwnProperty.call(b, "Sharp") && 1 < b.Sharp ? `Sharp +${b.Sharp}` : d;
          d = "" === d && "" === e && "" === g ? "No Change" : d;
          a === document.getElementById("BowCoating")
            ? (d = `${getWeaponMR().coatings[c]}: ${[d, e, g].join(" ")}`)
            : ((b = c + 0),
              "OPTGROUP" === a.children[1].tagName &&
                0 !== c &&
                (b = "Burst" === a.id && 2 <= c ? c - 1 : 0 === c % 3 ? 3 : c % 3),
              (d = `${b}: ${[d, e, g].join(" ")}`));
        }
      else d = a.id;
      info.description || (info.description = {});
      info.description[a.id] || (info.description[a.id] = []);
      info.description[a.id].push(d);
      document.getElementById(a.id)[c].textContent = d;
    }),
    (lastEvent = a));
}
function getStats(a) {
  a.getSkills.forEach((b) => {
    a.BRM *= +b.BRM;
    a.BR += +b.BR;
    a.PRM *= +b.PRM;
    a.BEM *= +b.BEM;
    a.BE += +b.BE;
    a.PEM *= +b.PEM;
    a.aff += +b.aff;
  });
  return { ...a };
}
function partSelector() {
  document.querySelectorAll("dropHZ>*").forEach((a, b) => {
    a.textContent === getWeapon().eleType && (document.getElementById("dropHZ").selectedIndex = b);
  });
}
function formatNumbers(a) {
  return a.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
const createSkillSelections = (a, b = 0, c) => {
    if ("Skill Selector" !== a)
      if (null !== document.getElementById(`${a}Select`))
        document.getElementById("dropSkills").after(document.getElementById(`${a}Select`));
      else {
        c = document.createElement("div");
        var d = document.createElement("label");
        d.className = `label ${a} skillInput`;
        d.textContent = a;
        var e = document.createElement("output");
        e.className = `skillInput ${a}`;
        e.setAttribute("max", info.types.maxLevel[a]);
        e.setAttribute("min", "0");
        e.textContent = `Lv-${b}`;
        b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.id = `${a}Dec`;
        b.className = `skillInput ${a} dec`;
        b.dataset.tooltip = "Decrease Skill Level";
        b.innerHTML += "&#8681";
        var g = document.createElement("button");
        g.type = "button";
        g.setAttribute("aria-pressed", "false");
        g.id = `${a}Inc`;
        g.className = `skillInput ${a} inc`;
        g.dataset.tooltip = "Increase Skill Level";
        g.innerHTML += "&#8679";
        c.appendChild(d);
        c.appendChild(e);
        c.appendChild(b);
        c.appendChild(g);
        c.id = `${a}Select`;
        document.getElementById("dropSkills").after(c);
      }
  },
  getSkillSelects = () => {
    document.querySelectorAll("select.skill").forEach((a) => {
      0 < a.selectedIndex && createSkillSelections(a.id, a.selectedIndex);
    });
  };
document.getElementById("dropSkills")?.addEventListener("change", (a) => {
  (document.getElementById(a.target.value)?.className.includes("classSpecific") &&
    !document.getElementById(a.target.value)?.className.includes(weaponType.value)) ||
    createSkillSelections(a.target.value, info.types.maxLevel[a.target.value]);
});
document.getElementById("otherButton").addEventListener("click", () => {
  document.getElementById("boxes").classList.toggle("augInvis");
});
document.querySelector(".boxes.close").addEventListener("click", () => {
  document.getElementById("boxes").classList.add("augInvis");
  document.getElementById("otherButton").checked = "";
});
document.getElementById("dangoSkillsButton").addEventListener("click", () => {
  document.getElementById("dango").classList.toggle("augInvis");
});
document.querySelector(".dango.close").addEventListener("click", () => {
  document.getElementById("dango")?.classList.add("augInvis");
  document.getElementById("dangoSkillsButton").checked = "";
});
document.getElementById("uniqueSkillsButton").addEventListener("click", () => {
  document.getElementById("unique").classList.toggle("augInvis");
});
document.querySelector(".unique.close").addEventListener("click", () => {
  document.getElementById("unique").classList.add("augInvis");
  document.getElementById("uniqueSkillsButton").checked = "";
});
document.getElementById("quriousButton").addEventListener("click", () => {
  document.querySelectorAll(".armorAugment").forEach((a) => a.classList.toggle("augInvis"));
});
document.getElementById("extraCharmDeco").addEventListener("click", () => {
  document.querySelector("select.charmSlot3").classList.toggle("armorDisplay");
  document.querySelector("select.charmSlot3").selectedIndex =
    (document.querySelector("select.charmSlot3").classList.contains("armorDisplay"), 0);
  document.querySelectorAll(".charmSlot3").forEach((a) => a.classList.toggle("augInvis"));
});
document.getElementById("skillSelect").addEventListener("mousedown", (a) => {
  if (a.target.classList.contains("skillInput")) {
    const b = a.target.className.split(" ")[1];
    let c = +document.querySelector(`output.${b}`)?.textContent.match(/(?<=Lv-)\d/)[0];
    "BUTTON" === a.target.tagName &&
      (a.target.classList.contains("dec")
        ? 0 === c
          ? a.target.parentElement.remove()
          : (document.querySelector(`output.${b}`).textContent = `Lv-${c - 1}`)
        : a.target.classList.contains("inc") &&
          (document.querySelector(`output.${b}`).textContent = `Lv-${c < info.types.maxLevel[b] ? c + 1 : c}`));
    document.getElementById("chest");
  }
});
const addPoints = ([a, b]) => {
    const c = document.querySelector(`output.${a}`);
    c
      ? (c.textContent = `Lv-${Math.min(
          info.types.maxLevel[a] || info.skills[a].length - 1,
          c.textContent.slice(-1) + +b
        )}`)
      : createSkillSelections(a, b);
  },
  getCurrentArmorSkills = (a = {}) => {
    Object.keys(info.armor).forEach((b) => {
      Object.values(document.querySelectorAll(`#${b}Skills>output`)).forEach((c) => {
        const d = c.value?.split(" ")[0].split("\n")[0];
        (c = +c.value.slice(-2)) && (a[d] = a[d] ? a[d] + c : c);
      });
    });
    return a;
  },
  getCurrentSelectedSkills = (a = {}) => {
    Object.values(document.querySelectorAll("select.armorDisplay,select.charm")).map((b) => {
      if (b.selectedOptions[0]) {
        var c = b.selectedOptions[0].textContent?.slice(0, -3).trim();
        b = +b.selectedOptions[0].textContent?.slice(-2);
        0 < b && (a[c] = a[c] ? a[c] + b : b);
      }
    });
    return a;
  },
  updateSelectedSkills = () => {
    if (info.armor) {
      var a = getCurrentSelectedSkills();
      a = getCurrentArmorSkills(a);
      document
        .querySelectorAll("#raw select")
        .forEach(
          (b) =>
            (b.selectedIndex = a[b.id]
              ? Math.min(a[b.id], info.types.maxLevel[b.id] ? info.types.maxLevel[b.id] : info.skills[b.id].length - 1)
              : 0)
        );
      return a;
    }
  };
function armorSelect() {
  info.armor &&
    Object.entries(info.armor).forEach((a) => {
      let b = "";
      const c = document.getElementById(a[0]);
      a[1].forEach((d, e) => (b += `<option value=${e}>${d.name}</option>`));
      c.innerHTML = b;
    });
}
const resetPoints = (a, b) => {
    Object.values(document.querySelectorAll(`#${a.id}>select`)).forEach((c) => (c.selectedIndex = -1));
    getRemainingPoints(a);
  },
  hideShowMenu = (a) => {
    const b = a.className.split(" ")[0];
    a.className.includes("inc")
      ? document.getElementById(`${b}Qurious`)?.classList.remove("augInvis")
      : document.getElementById(`${b}Qurious`).classList.add("augInvis");
  },
  setCharmsAvailableDecoSlots = (a) => {
    var b = document.getElementById(1 === +a.id.slice(-1) ? `${a.id.slice(0, -1)}2` : `${a.id.slice(0, -1)}1`);
    a.selectedOptions[0].textContent.slice(0, -3) === b.selectedOptions[0].textContent.slice(0, -3) &&
      (b.selectedIndex = 0);
    const c = [];
    b = getGrade(b?.value, a.value);
    if (b !== document.getElementById(`${a.id.slice(0, 5)}Decos`).value) {
      document.getElementById(`${a.id.slice(0, 5)}Decos`).value = b;
      switch (b) {
        case "S":
          c.push(2, 1, 1);
          break;
        case "A":
          c.push(3, 1, 1);
          break;
        default:
          c.push(3, 2, 1);
      }
      setDecoDisplay(a.id.slice(0, 5), c);
    }
  },
  getArmor = (a) => ({ ...info.armor[a][document.getElementById(a).value] }),
  getRemainingPoints = (a, b = 0) => {
    var c = a.id.slice(0, -7);
    c = getArmor(c);
    b += c.quriousPoints;
    for (let d = 0; 6 > d; d++) {
      const e = document.querySelectorAll(`#${a.id}>select.augment`)[d];
      0 > b + +e.value &&
        ((e.selectedIndex = 0), (document.querySelectorAll(`#${a.id}>select.augmentType`)[d].selectedIndex = 0));
      b += +e.value;
    }
    a.firstElementChild.textContent = `Remaining Points ${`${b}/${c.quriousPoints}`}`;
    return b;
  },
  setArmorSkillsDisplay = (a = getArmorTypes()) => {
    let b = [0, 0, 0];
    Object.values(a).forEach((c) => {
      if ("" !== c) {
        var d = document.getElementById(c);
        if (d) {
          for (var e = getArmor(c), g = 5, m = 0; 4 > m && g--; )
            for (var h = e.decos[g]; 0 <= --h; ) (b[m] = g + 1), ++m;
          g = document.querySelectorAll(`#${c}Qurious>select.augmentType`);
          m = document.querySelectorAll(`#${c}Qurious>select.augment`);
          e = JSON.parse(JSON.stringify(e.skills));
          for (h = 0; 6 > h; ++h)
            if (1 < m?.length && 0 < m[h].selectedIndex && (2 === g[h].selectedIndex || 4 === g[h].selectedIndex)) {
              var f = m[h].selectedOptions[0].textContent.match(/^\S+/)[0];
              e[f] = e[f] ? e[f] + (g[h].selectedIndex - 3) : 1;
            } else if (1 < g?.length && 0 < m[h].selectedIndex && 3 === g[h].selectedIndex) {
              f = m[h].selectedIndex;
              for (var k = 0; 3 > k && f; ++k) 0 === b[k] && (++b[k], --f);
              for (k = 0; 3 > k && f; ++k) {
                let l = Math.min(f, 4 - b[k]);
                0 < l && ((b[k] += l), (f -= l));
                if (!f) break;
              }
              for (let l = 0, n = -1; 0 < f && 3 > n; )
                2 > n && !b[n + 1] && (b[n + 1] = 0),
                  0 === l
                    ? 3 === ++n
                      ? ((l = 1), (n = 0))
                      : 0 === b[n] && (++b[n], --f)
                    : (1 === l && 4 > b[n] && ((k = Math.min(f, 4 - b[n])), (b[n] += k), (f -= k)), ++n);
            }
          d.nextElementSibling.textContent = "";
          Object.entries(e).forEach(
            (l) =>
              (d.nextElementSibling.innerHTML += `<img class="armorImg armorDeco rampage" src="./icons/skill.png"><output>${
                l[0].match(/^\S+/)[0]
              } +${l[1]}</output>`)
          );
          d.nextElementSibling.id = `${c}Skills`;
        }
        setDecoDisplay(c, b);
      }
    });
  },
  ChangeDropdownOptions = (a) => {
    var b = a.classList.contains("augmentType") ? a : a.previousElementSibling;
    const c = a.classList.contains("augmentType") ? a.nextElementSibling : a;
    var d = a.parentElement.id.slice(0, -7);
    const e = c.selectedIndex;
    for (; c.firstChild; ) c.removeChild(c?.firstChild);
    var g = document.createElement("option");
    g.value = 0;
    g.textContent = " ---- ";
    c.appendChild(g);
    const m = getRemainingPoints(a.parentElement);
    switch (b.value) {
      case "-Def":
        for (b = 0; 2 >= b; ++b)
          (d = document.createElement("option")),
            (d.value = [3, 5][b]),
            (d.textContent = ["-6 Def +3 Pts", "-12 Def +5 Pts"][b]),
            c.appendChild(d);
        break;
      case "-Skill":
        document.querySelectorAll(`#${d}Skills>output`).forEach((f) => {
          const k = document.createElement("option");
          k.value = 10;
          k.textContent = `${f.textContent.split("\n")[0].split(" ")[0]} 10`;
          k.classList.toggle("augInvis", 0 >= +f.textContent.slice(-2));
          c.appendChild(k);
        });
        break;
      case "+Skill":
        const h = document.querySelectorAll(`#${d}Skills>output`);
        Object.entries(info.types.qurious).forEach((f) => {
          const k = document.createElement("option");
          k.value = -f[1];
          k.textContent = `${f[0]} -${f[1]}`;
          k.classList.toggle(
            "augInvis",
            f[1] > m || (5 <= h.length && !Object.values(h).some((l) => l.textContent.includes(f[0])))
          );
          c.appendChild(k);
        });
        break;
      case "+Slots":
        for (b = 1; 3 >= b; b++)
          (d = -6 * b),
            (g = document.createElement("option")),
            (g.value = d),
            (g.textContent = `+${b} Slot${1 !== b ? "s" : ""} ${d}Pts`),
            g.classList.toggle("augInvis", m < d),
            c.appendChild(g);
    }
    a.className.includes("Type") ? (c.selectedIndex = 0) : (c.selectedIndex = e);
  },
  updateAugmentOptions = (a) => {
    var b = a.classList.contains("augmentType") ? a : a.previousElementSibling;
    const c = a.classList.contains("augmentType") ? a.nextElementSibling : a;
    a = a.parentElement.id.slice(0, -7);
    const d = getRemainingPoints(c.parentElement),
      e = Object.values(document.querySelectorAll(`#${a}Skills>output`));
    switch (b.value) {
      case "-Skill":
        e.forEach((g, m) => {
          c.children[m + 1] &&
            ((g = 0 >= +g.textContent.split(" ")[1] && m + 1 !== c.selectedIndex),
            c.children[m + 1]?.classList.toggle("augInvis", g),
            (c.children[m + 1].disabled = g));
        });
        break;
      case "+Slots":
        for (b = 1; 3 >= b; b++)
          (a = d - (isNaN(+c.value) ? 0 : +c.value) < [0, 6, 12, 18][b]),
            c.children[b].classList.toggle("augInvis", a),
            (c.children[b].disabled = a);
        break;
      case "+Skill":
        Object.values(c.children).forEach((g) => {
          let m =
            0 <= +g.value + (d - (isNaN(+c.value) ? 0 : +c.value)) &&
            (5 > e.length || e.some((h) => h.textContent.includes(g.textContent.split(" ")[0])));
          g.classList.toggle("augInvis", !m);
          g.disabled = !m;
        });
    }
  },
  setDecoDisplay = (a, b) => {
    document.querySelectorAll(`section.${a} .decoDisplay img`).forEach((c, d) => {
      const e = b[d];
      d = c.nextElementSibling;
      d.classList.toggle("augInvis", !e);
      c.classList.toggle("augInvis", !e);
      if (e && (0 === d.options.length || !c.classList.contains(`lvl${e}`)))
        if (
          ((c.className = c.className.replace(/(?<=lvl)\d/, e)),
          (c.src = `./icons/lvl${e}.png`),
          d.options.length && "charm" !== a)
        )
          Object.values(d.children).forEach((g) => {
            g.value &&
              (g.value > e
                ? ((g.style.display = "none"), (g.disabled = !0))
                : ((g.style.display = "block"), (g.disabled = !1)));
          });
        else {
          let g = "<option value=0>---</option>",
            m = "charm" !== a ? 4 : e;
          for (; m--; )
            (g += `<option class="optTitle" value="${m + 1}" disabled ${e <= m ? 'style="display:none"' : ""}>lvl-${
              m + 1
            } Decos</option>`),
              info.types.decoLevels[m].forEach((h) => {
                [h] = Object.entries(h);
                g += `<option value="${m + 1}" ${e <= m ? 'style="display:none"' : ""}>${h[0]} +${h[1]}</option>`;
              });
          d.innerHTML = g;
        }
    });
  },
  validator = (a, b = 0) => {
    const c = a.id.slice(0, -7),
      d = getArmor(c);
    Object.values(document.querySelectorAll(`#${c}Skills>output`))
      .map((e) => {
        0 > +e.textContent.slice(-2) &&
          Object.values(document.querySelectorAll(`#${c}Qurious>select.augment`)).filter(
            (g) => !g.selectedOptions[0]?.textContent.includes(e.textContent.slice(0, -4))
          );
      })
      .forEach((e) => {
        e && ((e[e.length - 1].selectedIndex = -1), (e[e.length - 1].previousSibling.selectedIndex = -1));
      });
    b += d.quriousPoints;
    for (let e = 0; 6 > e; e++) {
      const g = document.querySelectorAll(`#${a.id}>select.augment`)[e];
      0 > b + +g.value &&
        ((g.selectedIndex = -1), (document.querySelectorAll(`#${a.id}>select.augmentType`)[e].selectedIndex = -1));
      b += +g.value;
    }
    a.firstElementChild.textContent = `Remaining Points ${`${b}/${d.quriousPoints}`}`;
    setArmorSkillsDisplay([c]);
    return b;
  };
Object.values(document.querySelectorAll(".augmentType, .augment")).forEach((a) =>
  a.addEventListener("change", (b) => {
    0.1 < info.time?.augments - performance.now()
      ? (info.time.augments = performance.now())
      : ((info.time.augments = performance.now()),
        b.target?.className.includes("augment") &&
          (b.target.classList.contains("augmentType")
            ? ChangeDropdownOptions(b.target)
            : updateAugmentOptions(b.target),
          validator(b.target.parentElement)));
  })
);
document.querySelectorAll("button").forEach((a) =>
  a.addEventListener("click", (b) => {
    "startSearch" !== b.target.id &&
      "searchAgain" !== b.target.id &&
      "extendedSearch" !== b.target.id &&
      dataCompile(b);
  })
);
document.querySelectorAll("select,input").forEach((a) => a.addEventListener("change", (b) => dataCompile(b)));
const resetAugmentSelections = (a) => {
  document
    .querySelectorAll(`#${a}Qurious select`)
    .forEach((b) => (b.selectedIndex = b.classList.contains("augmentType") ? 0 : -1));
  updateSelectedSkills();
};
document.querySelectorAll("section.armorDisplay").forEach((a) =>
  a.addEventListener("change", (b) => {
    "SELECT" === b.target.tagName && updateSelectedSkillsDisplay();
  })
);
document.querySelectorAll("select.augment,select.augmentType").forEach((a) => {
  a.addEventListener("mousedown", (b) => {
    b.target.classList.contains("augmentType") || updateAugmentOptions(b.target);
    1 > b.target.previousElementSibling?.selectedIndex
      ? Object.values(b.target.children).forEach((c) => (c.disabled = !0))
      : Object.values(b.target.children).forEach((c) => (c.disabled = !1));
    updateSelectedSkillsDisplay();
  });
});
document.querySelectorAll("select.armor").forEach((a) => {
  a.addEventListener("change", (b) => {
    b = b.target.className.split(" ")[0];
    const c = getArmor(b);
    document.querySelector(
      `section#${b}Qurious>output.currentPoints`
    ).textContent = `Remaining Points ${c.quriousPoints}/${c.quriousPoints}`;
    setArmorSkillsDisplay([b]);
  });
});
const getDrugIndex = (a) => Object.values(document.getElementById("comboCountDisplay").children).indexOf(a);
document.addEventListener("dragstart", (a) => {
  a.dataTransfer.setData("text/plain", getDrugIndex(a.target));
});
document.addEventListener("dragover", (a) => {
  a.preventDefault();
  a.dataTransfer.dropEffect = "move";
});
document.addEventListener("drop", (a) => {
  a.preventDefault();
  const b = a.dataTransfer?.getData("text/plain");
  "comboCountDisplay" === a.target.parentElement.id &&
    a.target.before(Object.values(a.target.parentElement.children)[+b]);
  comboTracker = Object.values(document.getElementById("comboCountDisplay").children).map(
    (c) => c.className.split(" ")[0]
  );
});
document.querySelectorAll("input, button:not(#setReturn button), select:not(#setReturn select)").forEach((a) => {
  a.addEventListener("change", () => updateSelectedSkills(a));
});
document.querySelector("#weaponSelects>#Qurious")?.addEventListener("mousedown", () => {
  document.getElementById("augToggle")?.classList.remove("augInvis");
});
weaponType.addEventListener("change", () => {
  weaponSelect();
  classChange();
  rampageSelect();
  monChart();
  partSelector();
  comboReset();
});
dropWeapon.addEventListener("change", () => rampageSelect());
document.querySelectorAll("select.menu").forEach((a) =>
  a.addEventListener("change", (b) => {
    updateQuest(b.target.selectedOptions[0].value);
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
Object.values(document.querySelectorAll("#searchAgain, #startSearch")).forEach((a) =>
  a.addEventListener("click", () => getSetBuilds(12))
);
Object.values(document.querySelectorAll(".armorImg.charm")).forEach((a) =>
  a.addEventListener("change", (b) => setCharmsAvailableDecoSlots(b.target))
);
document.querySelector(".extraSkills").addEventListener("mousedown", (a) => {
  "BUTTON" === a.target.tagName && (addPoints(a.target.textContent.split(" +")), a.target.remove());
});
document.getElementById("setSearcher").addEventListener("mouseover", (a) => {
  "OUTPUT" === a.target.tagName &&
    info.descriptions[a.target.classList[1]] &&
    !a.target.dataset.tooltip &&
    (a.target.dataset.tooltip = info.descriptions[a.target.classList[1]].join("\n"));
});
document.getElementById("setReturn").addEventListener("mouseover", (a) => {
  "BUTTON" === a.target.tagName &&
    info.descriptions[a.target.textContent.split(" ")[0]] &&
    !a.target.dataset.tooltip &&
    (a.target.dataset.tooltip = info.descriptions[a.target.textContent.split(" ")[0]].join("\n"));
});
document.querySelector(".grid").addEventListener("mousedown", (a) => {
  if ("BUTTON" === a.target.tagName) {
    let b = Object.values(document.querySelectorAll("div.grid > div.setResult")).indexOf(a.target.parentElement);
    a = GlobalMap.get(b)[a.target.parentElement.lastElementChild.selectedIndex];
    let c = {};
    a.usedSkills.slice(-2).forEach((e) => (c[e[0]] = e[1]));
    equipBuild(a, c);
    const d = {};
    a.usedSkills.forEach((e) => {
      const g = e[3] ? e[1] * e[3] : e[1];
      d[e[0]] = d[e[0]] ? d[e[0]] + g : g;
    });
    console.log({ build: a, charm: c, buildTest: d });
    document.getElementById("setReturn").classList.add("augInvis");
    dataCompile();
    document.querySelectorAll(".extraSkills>button").forEach((e) => e.remove());
    document.querySelectorAll(".grid>div").forEach((e) => e.remove());
    GlobalMap.clear();
  }
});
let newSkills = {},
  totalCombos = 0,
  timer = 0,
  GlobalMap = new Map(),
  workers = [],
  workerCount = 0,
  GlobalFragment = document.createDocumentFragment(),
  totalSets = 0;
const getUsedDecoArr = (a) => {
    const b = [[], [], [], []];
    for (let c = 0; c < a.length; c++)
      if (a[c][2] && a[c][2]?.includes("Slot lvl")) {
        const d = +a[c][2].slice(-1);
        let e = a[c][3];
        for (; e--; ) b[d - 1].push(a[c][0]);
      }
    return b;
  },
  setAugmentAuto = (a, b) => {
    let c = 0;
    a.augs.forEach((d) => {
      var e = b[c];
      let g = e.nextElementSibling,
        [m, h] = Object.entries(d)[0],
        f = 0;
      Object.values(g.children).forEach((k) => k.remove());
      g.innerHTML += '<option value="0"> ---- </option>';
      switch (m) {
        case "-Def":
          e.selectedIndex = 1;
          for (d = 3; 5 >= d; d += 2)
            (e = document.createElement("option")),
              (e.value = d),
              (e.textContent = 3 === d ? "-6 Def +3 Pts" : "-12 Def +5 Pts"),
              g.appendChild(e);
          g.selectedIndex = 2;
          break;
        case "-Skill":
          e.selectedIndex = 2;
          for (let k = 0, l = document.querySelectorAll(`#${a.type}Skills>output`); k < l.length; k++)
            l[k].textContent.includes(h) && (f = k),
              (d = document.createElement("option")),
              (d.value = 10),
              (d.textContent = `${h} +10Pts`),
              g.appendChild(d);
          g.selectedIndex = f + 1;
          break;
        case "+Skill":
          e.selectedIndex = 4;
          Object.entries(info.types.qurious).forEach(([k, l], n) => {
            k.includes(h) && (f = n);
            n = document.createElement("option");
            n.value = -l;
            n.title = `${k} +1 -${l}Pts`;
            n.textContent = `${k} ${l}Pts`;
            g.appendChild(n);
          });
          g.selectedIndex = f + 1;
          break;
        case "+Slots":
          e.selectedIndex = 3;
          for (d = 1; 3 >= d; d++) {
            e = -6 * d;
            const k = document.createElement("option");
            k.value = e;
            k.textContent = `+${d} Slot${1 === d ? "s" : ""} ${e}`;
            g.appendChild(k);
          }
          g.selectedIndex = h / -6;
      }
      ++c;
    });
  },
  setUsedDecorations = (a) => {
    document.querySelectorAll(".decoDisplay>img:not(.augInvis)").forEach((b) => {
      let c = b.nextElementSibling;
      b = b.className.match(/(?<=lvl)\d/)[0] - 1;
      for (let d = 0; d < c.childElementCount; ++d)
        if (c.options[d].textContent.includes(a[b][0])) {
          c.selectedIndex = d;
          a[b].shift();
          break;
        }
    });
  },
  setAugmentDropdown = (a, b) => {
    if (null !== a)
      for (let c = 0; c < a.childElementCount; c++)
        if (a.children[c].textContent.includes(b)) {
          a.selectedIndex = c;
          setArmorSkillsDisplay([a.id]);
          break;
        }
  },
  setCharmSelects = (a) => {
    a = Object.keys(a);
    const b = document.querySelectorAll("select.charm");
    for (let c = 0; c < a.length; c++) {
      const d = b[c];
      for (let e = 0; e < d.options.length; e++)
        if (d.options[e].textContent.includes(a[c])) {
          d.selectedIndex = e;
          setCharmsAvailableDecoSlots(d);
          break;
        }
    }
  },
  equipBuild = (a, b) => {
    const { armors: c, usedSkills: d } = a;
    setCharmSelects(b);
    for (const [e, g] of c)
      0 > e ||
        (setAugmentDropdown(document.getElementById(g.type), e),
        resetAugmentSelections(g.type),
        setArmorSkillsDisplay([g.type]));
    for (const e of c)
      (a = document.querySelectorAll(`#${e[1].type}Qurious>select.augmentType`)),
        setAugmentAuto(e[1], a),
        validator(document.getElementById(`${e[1].type}Qurious`));
    document.getElementById("damage").classList.remove("augInvis");
    setUsedDecorations(getUsedDecoArr(d));
    updateSelectedSkillsDisplay();
  },
  appendElements = () => {
    requestIdleCallback(() => document.querySelector(".grid")?.append(GlobalFragment));
  },
  setUsedDecos = (a) => {
    ["lvl4", "lvl3", "lvl2", "lvl1"].forEach((b) => {
      const c = a.usedSkills.filter((e) => e[2].includes(b)),
        d = document.querySelectorAll(`.${b}:not(".augInvis")`);
      for (let e = 0; e < c.length; e++)
        for (let g = 0; g < Object.values(d[e].children).length; )
          if (d[e].children[g].value <= b && d[e].children[g].textContent.includes(c[e][0])) {
            d[e].selectedIndex = g;
            break;
          }
    });
  },
  getTotal = (a = info.types) => {
    const b = getSetRequirements().skills,
      { armorSkills: c, remainingSlots: d, quriousSkills: e } = newSkills;
    for (let m = 0; 4 > m; ++m)
      if (d[m]) for (let [h, f] of Object.entries(a.decoLevels[m])) c[h] = (c[h] || 0) + f * d[m];
    Object.entries(a.qurious).forEach(([m, h]) => {
      e[~~(h / 3) - 1] && (c[m] = (c[m] || 0) + e[h / 3 - 1]);
    });
    let g = [];
    Object.entries(c).forEach(([m, h]) => {
      isNaN(m) &&
        (b[m] &&
        ((a.maxLevel[m] && 0 < a.maxLevel[m] + b[m]) || (info.skills[m] && 0 < info.skills[m].length - 1 + b[m]))
          ? g.push([m, Math.min(+h, (a.maxLevel[m] || info.skills[m].length - 1) + b[m])])
          : b[m] || g.push([m, Math.min(+h, a.maxLevel[m] || info.skills[m].length - 1)]));
    });
    return g.sort();
  },
  setOutput = (a) => {
    let b = "";
    a.forEach((c) => {
      0 != c[1] && (b += `<button>${c[0]} +${+c[1]}</button>`);
    });
    document.getElementById("temp").remove();
    document.querySelector(".extraSkills").innerHTML += b;
    document.getElementById("extraOutput").textContent = `Found ${formatNumbers(totalSets)} Builds / ${formatNumbers(
      totalCombos
    )} Combinations`;
    console.log((performance.now() - timer) / 1e3);
  },
  getUsedCharm = (a) =>
    a.map((b) => {
      b = b.usedSkills.slice(-2);
      return `${b[0][0]}: ${b[0][1]} & ${b[1][0]}: ${b[1][1]}`;
    }),
  receiveMessage = (a, b) => {
    for (b = 0; b < a.length; b++) {
      var c = a[b];
      if (100 > GlobalMap.size) {
        GlobalMap.set(GlobalMap.size, c);
        var d = getUsedCharm(c),
          e = document.createDocumentFragment(),
          g = document.createElement("button");
        g.type = "button";
        g.setAttribute("aria-pressed", "false");
        g.classList.add("equipBuild");
        g.textContent = "Equip Build";
        e.appendChild(g);
        for (g = 0; 5 > g; g++) {
          var m = document.createElement("output");
          m.className = `armorImg ${["helm", "chest", "arm", "waist", "leg"][g]}`;
          e.appendChild(m);
          m = document.createElement("span");
          m.textContent = c[0].armors[g][0];
          e.appendChild(m);
        }
        const h = document.createElement("select");
        h.classList.add("armorCharm");
        h.setAttribute("title", "charmSkill1");
        c = document.createElement("output");
        c.className = "armorImg charm";
        e.appendChild(c);
        d.forEach((f) => {
          const k = document.createElement("option");
          k.value = f;
          k.textContent = f;
          h.appendChild(k);
        });
        e.appendChild(h);
        d = document.createElement("div");
        d.classList.add("setResult");
        d.appendChild(e);
        GlobalFragment.append(d);
      }
      if (100 === GlobalMap.size) {
        e = 0;
        for (d = 0; 100 >= d && GlobalMap.has(d); d++) e += GlobalMap.get(d).length;
        document.querySelector(".grid").append(GlobalFragment);
        GlobalFragment = document.createDocumentFragment();
        document.getElementById("setOutput").textContent = `Displayed ${Math.min(
          100,
          GlobalMap.size
        )} Builds / ${formatNumbers(e)} Combinations`;
        GlobalMap.set("finished", !0);
      }
    }
  },
  getSkillReq = (a = []) => {
    document.querySelectorAll(".buildSkills>div>.skill").forEach((b) => {
      0 < b.selectedIndex && a.push([b.id, b.selectedIndex]);
    });
    return a;
  },
  getSetRequirements = (a = info.types) => {
    const b = {},
      c = {};
    document.querySelectorAll("#skillSelect>div>output").forEach((d) => {
      0 < +d.textContent.match(/(?<=Lv-)\d/)[0] &&
        ((b[d.className.split(" ")[1]] = -d.textContent.match(/(?<=Lv-)\d/)[0]),
        (c[d.className.split(" ")[1]] = {
          lvl: a.decos[d.className.split(" ")[1]] ?? 5,
          lvl4: a.lvl4[d.className.split(" ")[1]] ?? 0,
          max: a.maxLevel[d.className.split(" ")[1]] - +d.textContent.match(/(?<=Lv-)\d/)[0],
          qurious: ~~((a.qurious[d.className.split(" ")[1]] ?? 60) / 3),
        }));
    });
    return {
      skills: Object.fromEntries(
        Object.entries(b).sort(
          (d, e) =>
            c[e[0]].qurious - c[d[0]].qurious ||
            c[e[0]].lvl - c[d[0]].lvl ||
            c[d[0]].lvl4 * c[d[0]].qurious - c[e[0]].lvl4 * c[e[0]].qurious
        )
      ),
      skillInfo: c,
    };
  };
function applyArmorFilter(a, b, c) {
  let d = new Map(Object.entries(JSON.parse(JSON.stringify(info.armor))));
  const e = {},
    g = [1.25, 8.5, 8.5, 9];
  for (let m = 0; 5 > m; m++) {
    const h = ["helm", "waist", "chest", "arm", "leg"][m];
    d.set(
      h,
      d.get(h).filter((f) => "MaleOnly" !== f.sex)
    );
  }
  ["helm", "waist", "chest", "arm", "leg"].forEach((m) => {
    e[m] = [];
    d.get(m).forEach((h) => {
      if (h) {
        var f = {},
          k = h.skills;
        if (13 !== h.quriousTable) {
          var l = Object.entries(h.decoAugments)
            .filter((q) => 3 >= +q[0] && 2 == q[1][0])
            .pop();
          if (l) {
            let [q, [, t]] = l;
            f.decos = t;
            f.augs = [{ "+Slots": -6 * +q }];
            f.quriousPoints = h.quriousPoints - 6 * +q;
            f.decoAugments = h.decoAugments;
          }
        } else
          13 === h.quriousTable &&
            ((f.decos = [1, 1, 0, 1]),
            (f.quriousPoints = 0),
            (f.augs = [{ def: 5 }, { def: 5 }, { def: 5 }, { def: 5 }, { "+Slots": -18 }, { "+Slots": -12 }]));
        f.augs ||
          ((f.decos = h.decos), (f.augs = []), (f.quriousPoints = h.quriousPoints), (f.decoAugments = h.decoAugments));
        if (3 < document.getElementById("StormSoul").selectedIndex) {
          l = 4 === document.getElementById("StormSoul").selectedIndex ? 1 : 2;
          for (var n of k) 6 > b[n].qurious && (k[n] += l);
        }
        f.fodderSkills = [];
        f.fodderCount = 0;
        n = f.decos[0] * g[0] + f.decos[1] * g[1] + f.decos[2] * g[2] + f.decos[3] * g[3];
        for (const [q, t] of Object.entries(k))
          if (a[q])
            a[q]
              ? (5 < b[q].qurious && 4 < b[q].lvl && ((f.setBonus = { [q]: t }), (n += 30 * Math.min(-1 * a[q], k[q]))),
                (n += Math.min(-1 * a[q], k[q]) * (20 === b[q].qurious ? 4 : b[q].qurious / 3)))
              : 13 != h.quriousTable || f.fodderCount || (f.fodderCount = 0);
          else for (f.fodderCount += t, l = 0; l < t; l++) f.fodderSkills.push(q);
        if (13 === h.quriousTable) (f.unBloatedPoints = 0), (f.armorRating = n);
        else
          switch (f.fodderCount) {
            case 0:
              f.quriousPoints += 15;
              f.unBloatedPoints = ~~(f.quriousPoints / 3);
              f.augs = f.augs[0]
                ? [{ "-Def": 5 }, { "-Def": 5 }, { "-Def": 5 }].concat(f.augs)
                : [{ "-Def": 5 }, { "-Def": 5 }, { "-Def": 5 }];
              f.armorRating = n + f.unBloatedPoints;
              break;
            case 1:
              f.quriousPoints += 20;
              f.unBloatedPoints = ~~(f.quriousPoints / 3);
              f.augs = f.augs
                ? [{ "-Skill": f.fodderSkills.pop() }, { "-Def": 5 }, { "-Def": 5 }].concat(f.augs)
                : [{ "-Skill": f.fodderSkills.pop() }, { "-Def": 5 }, { "-Def": 5 }];
              f.armorRating = n + f.unBloatedPoints;
              break;
            case 2:
              f.quriousPoints += 25;
              f.unBloatedPoints = ~~(f.quriousPoints / 3);
              f.augs = f.augs
                ? [{ "-Skill": f.fodderSkills.pop() }, { "-Skill": f.fodderSkills.pop() }, { "-Def": 5 }].concat(f.augs)
                : [{ "-Skill": f.fodderSkills.pop() }, { "-Skill": f.fodderSkills.pop() }, { "-Def": 5 }];
              f.armorRating = n + f.unBloatedPoints;
              break;
            default:
              (f.quriousPoints += 30),
                (f.unBloatedPoints = ~~(f.quriousPoints / 3)),
                (f.augs = f.augs
                  ? [
                      { "-Skill": f.fodderSkills.pop() },
                      { "-Skill": f.fodderSkills.pop() },
                      { "-Skill": f.fodderSkills.pop() },
                    ].concat(f.augs)
                  : [
                      { "-Skill": f.fodderSkills.pop() },
                      { "-Skill": f.fodderSkills.pop() },
                      { "-Skill": f.fodderSkills.pop() },
                    ]),
                (f.armorRating = n + f.unBloatedPoints);
          }
        k = (q, t = !0) => {
          t && e[m].pop();
          f.name = h.name;
          f.type = m;
          f.skills = h.skills;
          e[m].splice(q, 0, f);
        };
        if (!e[m][0]) (f.name = h.name), (f.type = m), (f.skills = h.skills), e[m].push(f);
        else if (f.armorRating > (e[m].length === c ? e[m][c - 1].armorRating : 10)) {
          for (n = 0; n < e[m].length; n++)
            if (f.armorRating > e[m][n].armorRating) {
              k(n);
              return;
            }
          e[m].length < c && k(e[m].length - 1, !1);
        }
      }
    });
  });
  return e;
}
const getCharms = (a, b, c = []) => {
    const { charms: d, types: e } = info;
    Object.values(d)
      .filter((g) => Object.entries(g.skills).every(([m, h]) => 0 >= a[m] + h && 3 > e.lvl4[m]))
      .forEach((g) => {
        c.push({ ...g.skills });
      });
    return c;
  },
  getCheckedSkills = (a = []) => {
    document.getElementsByClassName("skillButton").forEach((b) => {
      b.checked && a.push(info.skills[b.id]);
    });
    return a;
  },
  getSetBuilds = (a = 15) => {
    try {
      timer = performance.now();
      workerCount = 5;
      let b = Object.values(document.getElementsByTagName("SCRIPT")).some((h) => h.src.includes("backup.js"))
        ? "./setBuilderWorker.js"
        : "./ugly/onlineWorker.js";
      for (let h = 0; h < workerCount; h++) workers[h] = new Worker(b);
      workers.forEach((h) =>
        h.addEventListener("message", (f) => {
          totalCombos += f.data[2][1];
          totalSets += f.data[2][0];
          ((100 > GlobalMap.size && f.data[0][0]) || f.data[1]) && receiveMessage(f.data[0], f.data[1]);
          if (
            f.data[1] &&
            (f.target.terminate(),
            --workerCount,
            ((k) => {
              for (var l = 0; 4 > l; l++) {
                var n = newSkills.remainingSlots[l],
                  q = k.remainingSlots[l];
                newSkills.remainingSlots[l] = n >= q ? n : q;
              }
              for (l = 0; 5 > l; l++)
                (n = newSkills.quriousSkills[l]),
                  (q = k.quriousSkills[l]),
                  (newSkills.quriousSkills[l] = n >= q ? n : q);
              for (const [t, p] of Object.entries(k.armorSkills))
                (k = newSkills.armorSkills[t]), (newSkills.armorSkills[t] = k >= p ? k : p);
            })(f.data[1]),
            0 === workerCount)
          )
            if ((setOutput(getTotal()), 100 > GlobalMap.size)) {
              f = 0;
              for (let k = 0; 100 >= k && GlobalMap.has(k); k++) f += GlobalMap.get(k).length;
              document.querySelector(".grid").append(GlobalFragment);
              GlobalFragment = document.createDocumentFragment();
              document.getElementById("setOutput").textContent = `Displayed ${Math.min(
                100,
                GlobalMap.size
              )} Builds / ${formatNumbers(f)} Combinations`;
              GlobalMap.set("finished", !0);
            } else
              0 === GlobalMap.size &&
                ((document.getElementById("setOutput").textContent = "No Results Found"),
                document.querySelectorAll(".grid>div").forEach((k) => k.remove()));
        })
      );
      const c = getSetRequirements();
      c.charmSlots = document.getElementById("extraCharmDeco").checked ? [1, 0, 1, 0] : [2, 0, 1, 0];
      c.thisWeapon = info[weaponType.value].weapons[dropWeapon.value].decos;
      c.theseCharms = getCharms(c.skills, c.skillInfo);
      c.armors = applyArmorFilter(c.skills, c.skillInfo, a);
      const d = {};
      for (const [h, f] of Object.entries(c.armors))
        for (const [k, l] of Object.entries(f)) {
          if (!l.setBonus || !c.skills[Object.keys(l.setBonus)[0]]) continue;
          let n = Object.keys(l.setBonus)[0];
          d[n] || (d[n] = []);
          d[n].push(h, +k, -1 * l.setBonus[n]);
        }
      const e = { helm: -1, chest: 0, arm: 0, waist: 0, leg: 0, workers: 0 },
        g = [];
      ((h) => {
        const f = Object.keys(d).length;
        a: for (;;) {
          if (
            !(
              ++e.helm < h ||
              ((e.helm = 0),
              ++e.chest < h ||
                ((e.chest = 0), ++e.arm < h || ((e.arm = 0), ++e.waist < h || ((e.waist = 0), ++e.leg !== h))))
            )
          )
            break a;
          if (f)
            for (const k in d) {
              let l = 0,
                n = d[k],
                q = n.length - 1;
              for (; !(n[q - 1] === e[n[q - 2]] && (l += n[q]), 0 > (q -= 3)); );
              if (c.skills[k] < l) continue a;
            }
          g.push([e.helm, e.chest, e.arm, e.waist, e.leg]);
        }
      })(a);
      for (const h in d) delete c.skills[h];
      GlobalMap.clear();
      const m = g.length;
      for (a = 0; a < workers.length; ++a)
        (c.permutations = a === workers.length - 1 ? g : g.splice(0, m / workers.length)), workers[a].postMessage(c);
      GlobalFragment = document.createDocumentFragment();
      document.getElementById("setReturn").classList.remove("augInvis");
      document.getElementById("damage").classList.add("augInvis");
      document.querySelectorAll(".extraSkills>button").forEach((h) => h.remove());
      document.getElementById("temp") && document.getElementById("temp").remove();
      document.querySelector(".extraSkills").innerHTML +=
        "<P2 id='temp' style='font-size:18px !important; height:15em !important;'>Searching...</P2>";
      document.getElementsByClassName("grid")[0].innerHTML = "";
      newSkills = { remainingSlots: [0, 0, 0, 0], armorSkills: {}, quriousSkills: [0, 0, 0, 0, 0] };
      totalSets = totalCombos = 0;
    } catch (b) {
      console.error(b);
    }
  },
  build = (a) => {
    "Dereliction CriticalEye CriticalBoost MaximumMight RecoilDown ReloadSpeed RapidFireUp PierceUp Burst Agitator AttackBoost"
      .split(" ")
      .forEach((b) => createSkillSelections(b, info.types.maxLevel[b]));
    getSetBuilds(15);
    return GlobalMap;
  };
