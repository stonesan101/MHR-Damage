/* eslint-disable no-param-reassign */
const URLAttack = 'http://127.0.0.1:5500/json/Attacks.html-data.json';
const URLMonster = 'http://127.0.0.1:5500/json/Monster.html-data.json';
const URLQuest = 'http://127.0.0.1:5500/json/quest.html-data.json';
const URLRampage = 'http://127.0.0.1:5500/json/Rampage.html-data.json';
const URLSharp = 'http://127.0.0.1:5500/json/Sharpness.html-data.json';
const URLType = 'http://127.0.0.1:5500/json/catagory.html-data.json';
const URLWeapon = 'http://127.0.0.1:5500/json/Weapons.html-data.json';
const URLSPM = 'http://127.0.0.1:5500/json/shotsPerMin.html-data.json';
const URLLight = 'http://127.0.0.1:5500/json/AmmoLight.html-data.json';
const URLHeavy = 'http://127.0.0.1:5500/json/AmmoHeavy.html-data.json';
let comboTracker = [];

jQuery(($) => {
	$.getJSON(URLWeapon, (data) => {
		window.weapon = data;
	});

	$.getJSON(URLMonster, (data) => {
		window.monster = data;
	});
	$.getJSON(URLQuest, (data) => {
		window.quest = data;
	});
	$.getJSON(URLType, (data) => {
		window.skillCategories = data;
	});
	$.getJSON(URLAttack, (data) => {
		window.attack = data;
	});
	$.getJSON(URLHeavy, (data) => {
		window.ammoHeavyBowGun = data.HeavyBowGun;
	});
	$.getJSON(URLLight, (data) => {
		window.ammoLightBowGun = data.LightBowGun;
	});
	$.getJSON(URLSPM, (data) => {
		window.spm = data;
	});
	$.getJSON(URLRampage, (data) => {
		window.rampage = data;
	});
	$.getJSON(URLSharp, (data) => {
		window.sharpness = data;
	});
});

const weaponType = $('#dropWeaponType');
const weapon = $('#dropWeapon');
const mon = $('#dropMonster');
const monHZ = $('#dropHZ');
const monEnrage = $('#dropEnraged');
const monHunt = $('#dropQuest');
const monHP = $('#dropHealth');
const weaponRampage0 = $('#weaponRampage0');
const weaponRampage1 = $('#weaponRampage1');
const weaponRampage2 = $('#weaponRampage2');
const weaponRampage3 = $('#weaponRampage3');
const weaponRampage4 = $('#weaponRampage4');
const weaponRampage5 = $('#weaponRampage5');
let check = [0, 0, 0, 0, 0, 0, 0];

function DataCompile() {
	if (check.every((x) => x)) {
		if (MegaDemonDrug.style.background !== 'gray' && DemonDrug.style.background !== 'gray') {
			MegaDemonDrug.style.background = MegaDemonDrug === window.event.path[0] ? '' : 'gray';
			DemonDrug.style.background = DemonDrug === window.event.path[0] ? '' : 'gray';
		}
		if (/BowGun/.test(weaponType.val())) {
			RangedDPS();
		} else {
			MeleeDPS();
		}
	}
}

function RangedDPS() {
	let rangedDamage = {};
	let ammoFrameData = {};
	let power = {};
	$.each(window[`ammo${weaponType.val()}`][$('#dropWeapon').val()].Ammo, function (key) {
		power = this;
		[power.baseEle, power.eleType] = this.Ele;
		power.recoil = window[`ammo${weaponType.val()}`][$('#dropWeapon').val()].recoil;
		power.reload = window[`ammo${weaponType.val()}`][$('#dropWeapon').val()].reload;
		power.thisAttack = key;

		power = applyRampageSelections(power);
		power = GetSkills(power);

		let [augPRM, augPEM] = [1, 1];
		if (Object.prototype.hasOwnProperty.call(window.skillCategories, weaponRampage0.value)) {
			for (let i = 0; i < window.skillCategories[weaponRampage0.value].Monsters.length; ++i) {
				[augPRM, augPEM] =
					window.skillCategories[weaponRampage0.value].Monsters[i] === mon.val()
						? [window.skillCategories[weaponRampage0.value].PRM, window.skillCategories[weaponRampage0.value].PEM]
						: [1, 1];
			} // Ant-Species-Skills
		}

		power.PEM *= JSON.parse(Barrelid.value).Element; // Elemental Reload
		power.PRM *= JSON.parse(Barrelid.value).Power;

		augPEM = weaponRampage0.value === 'Valstrax Soul' && power.eleType === 'Dragon' ? 1.2 : augPEM;

		augPEM =
			weaponRampage0.value === 'Elemental Exploit' && window.monster[mon.val()].HitZone[monHZ.val()][power.eleType] >= 25
				? 1.3
				: augPEM;

		power.bAFF = power.rawHZV >= 45 ? power.bAFF + JSON.parse($('#Weakness_Exploit').val()) : power.bAFF;
		power.bAFF = Math.min(power.bAFF, 100) / 100;

		let [critBoost, eleCritBoost] = !/(Sever)|(Blunt)|(Shot)/.test(power.type)
			? [1, 1]
			: [JSON.parse($('#Critical_Boost').val()).PRM, JSON.parse($('#Critical_Element').val()).PEM];
		let efrMulti = 1 + (critBoost - 1) * power.bAFF;
		const brutalEFR = (power.bAFF - power.bAFF * 2) * 0.25 * 0.5 + (power.bAFF - power.bAFF * 2) * 0.75 * -0.25;

		[efrMulti, critBoost] =
			weaponRampage0.value === 'Brutal Strike' && power.bAFF < 0 ? [1 + brutalEFR, 1.5] : [efrMulti, critBoost];

		const raw = Math.min(power.baseRaw * power.BRM + power.BR, power.baseRaw * 3);
		const rawFormula = (raw * power.PRM * power.rawHZV * power.enrage * power.rawMV * augPRM) / 10000;
		const rawNon = ~~(0.1 + rawFormula * JSON.parse(felineMarksmanid.value)[0]);
		const efr = ~~(0.1 + rawFormula * efrMulti * JSON.parse(felineMarksmanid.value)[1]);
		const rawCrit = ~~(0.1 + rawFormula * critBoost * JSON.parse(felineMarksmanid.value)[0]);
		const eleAmmo = /(Ice)|(Fire)|(Water)|(Dragon)|(Thunder)/.test(power.eleType) ? 1 + raw / 100 : 1;
		const efeMulti = 1 + (eleCritBoost - 1) * power.bAFF;
		const ele = Math.min(power.baseEle * power.BEM + power.BE, power.baseEle * 3);
		const eleFormula = (ele * power.PEM * power.eleHZV * power.enrage * power.eleMV * eleAmmo * augPEM) / 100;
		const eleNon = eleFormula > 0 && eleFormula < 1 ? 1 : ~~(0.1 + eleFormula);
		const efe = eleFormula * efeMulti > 0 && eleFormula * efeMulti < 1 ? 1 : ~~(0.1 + eleFormula * efeMulti);
		const eleCrit = eleFormula * eleCritBoost > 0 && eleFormula * eleCritBoost < 1 ? 1 : ~~(0.1 + eleFormula * eleCritBoost);
		let ammo = [];

		ammo = calculateAmmoFrames(ammo, power);

		const totalEffective = ~~((0.5 + efr + efe) * ammo.ticsAdjust);
		const totalCrit = ~~((0.5 + rawCrit + eleCrit) * ammo.ticsAdjust);
		const totalNon = ~~((0.5 + rawNon + eleNon) * ammo.ticsAdjust);
		const shotsToKill = ~~(1 + JSON.parse(monHP.val()) / totalEffective);
		const timeToKill = /(Sticky)|(Slicing)/.test(power.thisAttack)
			? 5 + ~~(0.5 + (60 / ammo.shotsPerMin) * shotsToKill) // Adds delay time for stickies/ slicing;
			: ~~(0.5 + (60 / ammo.shotsPerMin) * shotsToKill);

		const rawBoth = [].concat(`${rawNon} / ${rawCrit}`);
		const eleBoth = [].concat(`${eleNon} / ${eleCrit}`);
		const total = [].concat(`${totalNon} / ${totalCrit}`);
		const damage = {
			attack: power.thisAttack,
			rawBoth,
			eleBoth,
			total,
			efr,
			efe,
			totalEffective,
			shotsPerGain: [ammo.shotsPerGain],
			shotsToKill,
			timeToKill,
		};

		rangedDamage = [].concat(rangedDamage, damage);

		const ammoStats = {
			attack: power.thisAttack,
			rawMV: [power.rawMV],
			reloadSpeed: [ammo.reloadSpeed],
			recoilSpeed: [ammo.recoilSpeed],
			clipSize: [ammo.clipSize],
			ticsPer: [power.ticsPer],
			shotsPerMinBase: [ammo.shotsPerMinBase],
			shotsPerMin: [ammo.shotsPerMin],
		};

		ammoFrameData = [].concat(ammoFrameData, ammoStats);

		const stats = [
			['Stat', 'Raw', 'Affinity', 'Ele Ammo'],
			['Base', ~~power.baseRaw, window.weapon[weaponType.val()][$('#dropWeapon').val()].AFF, 11],
			['Cap', ~~raw, ~~(power.bAFF * 100), ~~(0.1 + 11 * power.BEM + power.BE)],
			[
				'Post Cap',
				~~(raw * critBoost * power.PRM * power.enrage * augPRM * JSON.parse(felineMarksmanid.value)[0]),
				~~(power.bAFF * 100),
				~~(0.1 + (11 * power.BEM + power.BE) * power.PEM * power.enrage * eleAmmo * augPEM * eleCrit),
			],
			[
				'Effective',
				~~(raw * efrMulti * power.PRM * power.enrage * augPRM * JSON.parse(felineMarksmanid.value)[1]),
				~~(power.bAFF * 100),
				~~(0.1 + (11 * power.BEM + power.BE) * power.PEM * augPEM * power.enrage * eleAmmo * efeMulti),
			],
		];
		BuildDamageTable(stats, 'stats');
	});
	rangedDamage.splice(0, 0, [
		'Ammo Type',
		'Raw',
		'Elemental',
		'Combined',
		'EFR',
		'EFE',
		'Effective',
		'Shots \n Per Gain',
		'Shots \n To Kill',
		'Seconds \n To Kill',
	]);
	BuildDamageTable(rangedDamage, 'dps');
	ammoFrameData.splice(0, 0, [
		'Ammo Type',
		'rawMV',
		'Reload',
		'Recoil',
		'Clip Size',
		'Tics Per Shot',
		'Shots Per \n Min Base',
		'Shots \n Per Min',
	]);
	BuildDamageTable(ammoFrameData, 'ammo');
}
function MeleeDPS() {
	let meleeDamage = [['Combo', 'Attack Name', 'MV', 'Raw', 'Element', 'Total', 'EFR', 'EFE', 'Effective']];

	const sharpnessModifier = [];

	let comboDamage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let c = 0;
	let hitsOfSharpUsed = {};
	let comboKeyCard = 0;
	let power = {};

	power.baseRaw = window.weapon[weaponType.val()][$('#dropWeapon').val()].baseRaw;
	[power.eleType, power.baseEle] = window.weapon[weaponType.val()][$('#dropWeapon').val()].Ele;
	power = applyRampageSelections(power);
	let attacks =
		weaponType.val() === ('Bow' | 'ChargeBlade' | 'Gunlance')
			? AddDependantSkills(power) //  filters CB Phial Attacks, Gunlance Shelling, Bow Attacks
			: window.attack[weaponType.val()];

	$.each(attacks, function (key, element) {
		power = { ...this };
		power.thisAttack = key;
		power.ticsPer = Object.prototype.hasOwnProperty.call(window.attack[weaponType.val()][power.thisAttack], 'ticsPer')
			? window.attack[weaponType.val()][power.thisAttack].ticsPer
			: 1;
		power = GetSkills(power);
		// Melee

		let [augEFR, augPRM, augPEM] = [1, 1, 1];
		// If an anti-species type skill is selected it gets the list of monsters applicable and checks if the selected monster is in the list. If true, it applies the skill.
		if (Object.prototype.hasOwnProperty.call(window.skillCategories, weaponRampage0.value)) {
			for (let i = 0; i < window.skillCategories[weaponRampage0.value].Monsters.length; ++i) {
				if (window.skillCategories[weaponRampage0.value].Monsters[i] === mon.val()) {
					({ augPEM, augPRM } = window.skillCategories[weaponRampage0.value]);
				}
			}
		}
		if (weaponType.val() === 'BowGun') {
			// Elemental Reload
			power.PEM *= JSON.parse(Barrelid.value).Element;
			// Power Barrel
			power.PRM *= JSON.parse(Barrelid.value).Power;
		}
		// If elemental exploit is selected && power.eleHZV >= 25 applies elemental exploit
		power.PEM *=
			weaponRampage0.value === 'Elemental Exploit' && window.monster[mon.val()].HitZone[monHZ.val()][power.eleType] >= 25 ? 1.3 : 1;
		augPEM = weaponRampage0.value === 'Valstrax Soul' && power.eleType === 'Dragon' ? 1.2 : augPEM;
		// applies Dulling Strike to Base raw depending on sharpness and if selected
		[augEFR, augPRM] = weaponRampage0.value === 'Dulling Strike' && Sharpness.selectedIndex <= 4 ? [1.02, 1.2] : [1, 1];
		// applies Bludgeoner to Base raw depending on sharpness and selectedIndex
		if (Sharpness.selectedIndex > 0) {
			power.BRM *= Bludgeoner.selectedIndex === 1 && Sharpness.selectedIndex <= 3 ? [1.05] : [1];
			power.BRM *= Bludgeoner.selectedIndex === 2 && Sharpness.selectedIndex <= 3 ? [1.1] : [1];
			power.BRM *= Bludgeoner.selectedIndex === 3 && Sharpness.selectedIndex <= 4 ? [1.1] : [1];
		}
		const WEX = JSON.parse($('#Weakness_Exploit').val());
		power.bAFF = power.rawHZV >= 45 ? power.bAFF + WEX : power.bAFF;
		power.bAFF = Math.min(power.bAFF, 100) / 100;

		if (!/BowGun/.test(previousWeaponType.value) && !/BowGun/.test(weaponType.val())) {
			if (c === 0 && !/Bow/.test(weaponType.val())) {
				hitsOfSharpUsed = TotalHitsOfSharpUsed(power.bAFF, comboKeyCard);
			} else if (c === 0) {
				UpdateComboTracker();
				UpdateComboDisplay();
			}
		}

		[sharpnessModifier.PRM, sharpnessModifier.PEM] =
			power.skillType === ('Sever' || 'Blunt') && window.attack[weaponType.val()][power.thisAttack].hitsOfSharp > 0
				? [JSON.parse(Sharpness.value).PRM, JSON.parse(Sharpness.value).PEM]
				: [1, 1];
		power.PRM *=
			~~(0.1 + 25 / sharpnessModifier.PRM) >= window.monster[mon.val()].HitZone[monHZ.val()][power.type]
				? JSON.parse(document.getElementById(['Minds_Eye']).value).PRM
				: 1;
		let critBoost = /('Sever'|'Blunt'|'Shot')/.test(power.type) ? JSON.parse($('#Critical_Boost').val()).PRM : 1;

		let efrMulti = 1 + (critBoost - 1) * power.bAFF;

		/*
		 * Brutal Strike
		 * Converts -Aff to a positive then * chance to proc * dmg modifier then
		 * adds the -dps to the +dps gain to find overall dps difference
		 */
		const brutalEFR = (power.bAFF - power.bAFF * 2) * 0.25 * 0.5 + (power.bAFF - power.bAFF * 2) * -0.25 * 0.75;
		[efrMulti, critBoost] =
			weaponRampage0.value === 'Brutal Strike' && power.bAFF < 0 ? [1 + brutalEFR, 1.5] : [efrMulti, critBoost];

		const eleCritBoost = /(Sever)|(Blunt)|(Shot)/.test(power.type) ? JSON.parse($('#Critical_Element').val()).PEM : 1;
		// Melee;
		// final damage calculations first row limits raw to the 3x attack cap
		const raw = Math.min(power.baseRaw * power.BRM + power.BR, power.baseRaw * 3);
		const rawFormula = (raw * power.PRM * augPRM * power.rawHZV * power.enrage * power.rawMV) / 10000;
		power.rawNon = rawFormula * JSON.parse(felineMarksmanid.value)[0];
		power.efr = rawFormula * efrMulti * JSON.parse(felineMarksmanid.value)[1];
		power.rawCrit = rawFormula * critBoost * JSON.parse(felineMarksmanid.value)[0];
		// limits to the 3x ele cap??? not sure if this cap is correct but it is the cap for the raw and good luck reaching even 2x
		const ele = Math.min(power.baseEle * power.BEM + power.BE, power.baseEle * 3);
		const efeMulti = 1 + (eleCritBoost - 1) * power.bAFF;
		const eleFormula = (ele * power.PEM * power.eleHZV * power.enrage * power.eleMV * augPEM) / 100;
		power.eleNon = eleFormula > 0 && eleFormula < 1 ? 1 : ~~(0.1 + eleFormula);
		power.efe = eleFormula * efeMulti > 0 && eleFormula * efeMulti < 1 ? 1 : ~~(0.1 + eleFormula * efeMulti);
		power.eleCrit = eleFormula * eleCritBoost > 0 && eleFormula * eleCritBoost < 1 ? 1 : ~~(0.1 + eleFormula * eleCritBoost);

		CalculateComboDamage(c, power);
		/* goes through each color sharpness and filters the recorded attacks for the number of times this current attack was used
		 * then applies the given sharpness modifier to the damage if damage type is sever or blunt then multiplies by the times used
		 * saves results in the comboDamage var and += the totals for every sharpness of every attack
		 * to later be used to update the comboDamage in the dpsTable
		 */
		function CalculateComboDamage(ID, final) {
			if (ID > 0 && $('.inputs').length > 0) {
				$(Object.keys(hitsOfSharpUsed)).each(function (index, color) {
					if (TimesUsed(ID, hitsOfSharpUsed[color]) > 0) {
						const [sharpPRM, sharpPEM] =
							final.skillType === ('Sever' || 'Blunt') && window.attack[weaponType.val()][power.thisAttack].hitsOfSharp > 0
								? [window.sharpness.mod[color].PRM, window.sharpness.mod[color].PEM]
								: [1, 1];
						let hitsPerAttackPerSharpness = TimesUsed(ID, hitsOfSharpUsed[color]);
						// combo=[rawMV,rawNon,rawCrit,eleNon,eleCrit,totalNon,TotalCrit,EFR,EFE,totalEffective]
						comboDamage = [
							(comboDamage[0] += Number(~~(0.5 + final.rawMV * hitsPerAttackPerSharpness * power.ticsPer))),
							(comboDamage[1] += Number(~~(0.1 + final.rawNon * sharpPRM) * hitsPerAttackPerSharpness)),
							(comboDamage[2] += Number(~~(0.1 + final.rawCrit * sharpPRM) * hitsPerAttackPerSharpness)),
							(comboDamage[3] += Number(~~(0.1 + final.eleNon * sharpPEM) * hitsPerAttackPerSharpness)),
							(comboDamage[4] += Number(~~(0.1 + final.eleCrit * sharpPEM) * hitsPerAttackPerSharpness)),
							(comboDamage[5] += Number(
								(~~(0.1 + final.rawNon * sharpPRM) * hitsPerAttackPerSharpness +
									~~(0.1 + final.eleNon * sharpPEM) * hitsPerAttackPerSharpness) *
									power.ticsPer,
							)),
							(comboDamage[6] += Number(
								(~~(0.1 + final.rawCrit * sharpPRM) * hitsPerAttackPerSharpness +
									~~(0.1 + final.eleCrit * sharpPEM) * hitsPerAttackPerSharpness) *
									power.ticsPer,
							)),
							(comboDamage[7] += Number(~~(0.1 + final.efr * sharpPRM) * hitsPerAttackPerSharpness)),
							(comboDamage[8] += Number(~~(0.1 + final.efe * sharpPEM) * hitsPerAttackPerSharpness)),
							(comboDamage[9] += Number(
								(~~(0.1 + final.efr * sharpPRM) * hitsPerAttackPerSharpness +
									~~(0.1 + final.efe * sharpPEM) * hitsPerAttackPerSharpness) *
									power.ticsPer,
							)),
						];
						console.log(comboDamage, comboTracker);
					}
				});
			}
		}
		// damage/meleeDamage stores calculations to be used for the damageTable
		const damage = {
			'replaceME': 'replaceME',
			'Attack Name': power.thisAttack,
			'MV': power.rawMV,
			'Raw': `${~~(0.1 + power.rawNon * sharpnessModifier.PRM)} / ${~~(0.1 + power.rawCrit * sharpnessModifier.PRM)}`,
			'Ele': `${~~(0.1 + power.eleNon * sharpnessModifier.PEM)} / ${~~(0.1 + power.eleCrit * sharpnessModifier.PEM)}`,
			'Total': `${
				~~(0.1 + power.rawNon * sharpnessModifier.PRM) * power.ticsPer +
				~~(0.1 + power.eleNon * sharpnessModifier.PEM) * power.ticsPer
			} / ${(~~(0.1 + power.rawCrit * sharpnessModifier.PRM) + ~~(0.1 + power.eleCrit * sharpnessModifier.PEM)) * power.ticsPer}`,
			'EFR': ~~(0.1 + power.efr * sharpnessModifier.PRM),
			'EFE': ~~(0.1 + power.efe * sharpnessModifier.PEM),
			'Effective': (~~(0.1 + power.efe * sharpnessModifier.PEM) + ~~(0.1 + power.efr * sharpnessModifier.PRM)) * power.ticsPer,
		};
		meleeDamage = [].concat(meleeDamage, damage);

		// Melee

		// stats stores calculations to be used for the statsTable
		if (power.thisAttack === 'Combo Damage') {
			const stats = [
				[['Stat'], ['Raw'], ['Affinity'], [power.eleType]],
				['Base', ~~power.baseRaw, +[window.weapon[weaponType.val()][$('#dropWeapon').val()].AFF], power.baseEle],
				['Cap', ~~raw, ~~(power.bAFF * 100), ~~ele],
				[
					'Post Cap',

					~~(raw * critBoost * power.PRM * power.enrage * augPRM * JSON.parse(felineMarksmanid.value)[0] * sharpnessModifier.PRM),
					~~(power.bAFF * 100),
					~~(ele * eleCritBoost * power.PEM * power.enrage * augPEM * sharpnessModifier.PEM),
				],
				[
					'Effective',
					~~(raw * efrMulti * power.PRM * power.enrage * augEFR * JSON.parse(felineMarksmanid.value)[1] * sharpnessModifier.PRM),
					~~(power.bAFF * 100),
					~~(ele * efeMulti * power.PEM * augPEM * power.enrage * augEFR * sharpnessModifier.PEM),
				],
			];

			BuildDamageTable(stats, 'stats');
		}

		++c;
	});

	if (weaponType.val() === 'Gunlance') {
		GunlanceShelling(meleeDamage, comboDamage, c);
	} else {
		if ($('#dropWeaponType').val() === 'Bow') {
			comboDamage = BowComboDamage();
		}
		BuildDamageTable(meleeDamage, 'dps');

		c0.innerHTML = `${[comboDamage[0]]}`;
		d0.innerHTML = `${[comboDamage[1]]} / ${[comboDamage[2]]}`;
		e0.innerHTML = `${[comboDamage[3]]} / ${[comboDamage[4]]}`;
		f0.innerHTML = `${comboDamage[5]} / ${comboDamage[6]}`;
		g0.innerHTML = `${[comboDamage[7]]}`;
		h0.innerHTML = `${[comboDamage[8]]}`;
		i0.innerHTML = `${comboDamage[9]}`;
	}
}
function applyRampageSelections(power) {
	// applies rampage any bonuses that effect base stats
	for (let i = 0; i < 6; ++i) {
		if (weaponRampage.children[i].hidden === false) {
			for (let j = 0; j < Object.values(window.rampage.Keys).length; ++j) {
				if (Object.prototype.hasOwnProperty.call(window.rampage['Rampage-Up Skill'], [weaponRampage.children[i].value])) {
					if (
						Object.prototype.hasOwnProperty.call(
							window.rampage['Rampage-Up Skill'][weaponRampage.children[i].value],
							window.rampage.Keys[j],
						)
					) {
						power[`${window.rampage.Keys[j]}`] +=
							window.rampage['Rampage-Up Skill'][weaponRampage.children[i].value][window.rampage.Keys[j]];
					}
				}
			}
		}
	}
	if (!/BowGun/.test(weaponType.val())) {
		if (/Fire/.test(weaponRampage.children[1].value)) {
			power.eleType = 'Fire';
		} else if (/Water/.test(weaponRampage.children[1].value)) {
			power.eleType = 'Water';
		} else if (/Thunder/.test(weaponRampage.children[1].value)) {
			power.eleType = 'Thunder';
		} else if (/Ice/.test(weaponRampage.children[1].value)) {
			power.eleType = 'Ice';
		} else if (/Dragon/.test(weaponRampage.children[1].value)) {
			power.eleType = 'Dragon';
		}
	}
	return { ...power };
}
function AddDependantSkills() {
	let attacks =
		window.weapon[weaponType.val()][$('#dropWeapon').val()].Phial === 'Impact Phial'
			? Object.keys(window.attack[weaponType.val()]).filter((skill) => !/Element Phial/.test(skill))
			: Object.keys(window.attack[weaponType.val()]).filter((skill) => !/Impact Phial/.test(skill));
	// adds Gunlance Shelling Attacks to attacks array
	if (weaponType.val() === 'Gunlance') {
		$(Object.keys(window.attack.GunlanceShelling[window.weapon.GunlanceShelling[$('#dropWeapon').val()][0]])).each(function (
			index,
			element,
		) {
			attacks.push(element);
		});
	}
	//  filters bow attacks for only the usable attacks
	if (weaponType.val() === 'Bow') {
		let expression = `${window.weapon.BowShotType[$('#dropWeapon').val()].Inate[0]}|${
			window.weapon.BowShotType[$('#dropWeapon').val()].Inate[1]
		}|${window.weapon.BowShotType[$('#dropWeapon').val()].Inate[2]}`;
		if (
			mightyBowId.selectedIndex === 1 &&
			Object.prototype.hasOwnProperty.call(window.weapon.BowShotType[$('#dropWeapon').val()], 'MightyBow')
		) {
			expression += `|${window.weapon.BowShotType[$('#dropWeapon').val()].MightyBow[0]}`;
		} else if (window.weapon.BowShotType[$('#dropWeapon').val()].Inate.length > 3) {
			expression += `|${window.weapon.BowShotType[$('#dropWeapon').val()].Inate[3]}`;
		}
		const regex = new RegExp(expression);

		attacks = [].concat(
			attacks.splice(0, 7),
			attacks.filter((skill) => regex.test(skill)),
			attacks.splice(60),
		);
	}
	return [attacks];
}
function GetSkills(power) {
	power.BR = 0;
	power.BRM = 1;
	power.PRM = 1;
	power.BEM = 1;
	power.BE = 0;
	power.PEM = 1;
	power.bAFF = window.weapon[weaponType.val()][$('#dropWeapon').val()].AFF;
	power.baseRaw = window.weapon[weaponType.val()][$('#dropWeapon').val()].baseRaw;
	power.enrage = monEnrage.val() === 'Enraged' ? window.monster[mon.val()].Enrage / 100 : 1;
	power.eleHZV = power.eleType !== 'non' ? 0 : window.monster[mon.val()].HitZone[monHZ.val()][power.eleType]; // For non ele Weapons
	power.rawHZV =
		power.type !== ('Slicing' | 'Blunt' | 'Shot')
			? (power.rawHZV = 100)
			: window.monster[mon.val()].HitZone[monHZ.val()][power.type];
	// applies Demon Ammo if selected and damage type is sever or blunt
	power.rawHZV *= DemonAmmo.style.background !== 'gray' && /(Sever)|(Blunt)/.test(power.type) ? 1.1 : 1;
	// applies Water Blight if selected appropriate to the hzv
	power.rawHZV +=
		WaterBlight.style.background !== 'gray' && /(Sever)|(Blunt)|(Shot)/.test(power.type) && power.rawHZV < 60 ? 25 : 0;
	power.rawHZV +=
		WaterBlight.style.background !== 'gray' && /(Sever)|(Blunt)|(Shot)/.test(power.type) && power.rawHZV >= 60 ? 3 : 0;

	for (let i = 0; i < $('.skillButton').length; ++i) {
		if (document.getElementsByClassName('skillButton')[i].style.background !== 'gray') {
			const skills = JSON.parse($('.skillButton')[i].value);
			power.BRM *= skills.BRM;
			power.BR += skills.BR;
			power.PRM *= skills.PRM;
			power.BEM *= skills.BEM;
			power.BE += skills.BE;
			power.PEM *= skills.PEM;
			power.bAFF += skills.Affinity;
		}
	}

	switch (power.type) {
		case 'Sever':
		case 'Blunt':
			power.skillType = 'Sever';
			break;
		case 'Shot':
			power.skillType = 'Gunner';
			break;
		case 'None':
		case 'Stickies':
		case 'IMPAED':
		case 'IMPUAED':
			power.skillType = 'Stickies';
			break;
		case 'Cluster':
			power.skillType = 'Clusters';
			break;
		default:
			power.skillType = 'AllSkills';
			break;
	}
	let getSkills = window.skillCategories[power.skillType];
	if (monEnrage.val() === 'Enraged') {
		getSkills.push('Agitator');
	}
	if (Object.prototype.hasOwnProperty.call(window.attack[weaponType.val()][power.thisAttack], 'unique')) {
		getSkills = getSkills.concat(window.attack[weaponType.val()][power.thisAttack].unique);
	}

	getSkills.forEach((skill) => {
		if (document.getElementById([skill]).selectedIndex > 0) {
			const skills = JSON.parse(document.getElementById([skill]).value);

			power.BRM *= skills.BRM;
			power.BR += skills.BR;
			power.PRM *= skills.PRM;
			power.BEM *= skills.BEM;
			power.BE += skills.BE;
			power.PEM *= skills.PEM;
			power.bAFF += skills.Affinity;
		}
	});

	return { ...power };
}

function BuildDamageTable(myDamage, id) {
	const currentAmmoTableStyle = ammoTable.style.display;
	const currentDamageTableStyle = dpsTable.style.display;
	const inputs = document.querySelectorAll('.a');
	let k = 0;
	const myHeader = document.querySelector(`#${id}Head`);
	const myBody = document.querySelector(`#${id}Body`);
	const table = document.createElement('table');
	const tHead = document.createElement('thead');
	const headerRow = document.createElement('tr');
	const tBody = document.createElement('tbody');

	const myHeaders = myDamage.splice(0, 1);
	myHeaders[0].forEach((headerText) => {
		const header = document.createElement('th');
		const textNode = document.createTextNode(headerText);

		header.appendChild(textNode);
		headerRow.appendChild(header);
	});

	tHead.appendChild(headerRow);
	myHeader.replaceWith(tHead);
	myDamage.forEach((Attack) => {
		const row = document.createElement('tr');

		Object.values(Attack).forEach((text) => {
			if (text === 'replaceME') {
				if (
					$('#previousWeaponType').val() === weaponType.val() &&
					inputs.length > 0 &&
					event.target.id !== 'mightyBowId' &&
					((weaponType.val() === 'Bow' && previousWeapon.value === $('#dropWeapon').val()) || weaponType.val() !== 'Bow')
				) {
					row.appendChild(inputs[k]);
					++k;
				} else {
					const cell = document.createElement('td');
					const adjuster = document.createElement('input');

					adjuster.setAttribute('type', 'Number');
					adjuster.setAttribute('class', 'Combo skill');
					adjuster.setAttribute('Max', 20);
					if (weaponType.val() === 'Bow' && previousWeapon.value !== $('#dropWeapon').val()) {
						comboTracker = [];
						UpdateComboDisplay();
					}
					if (k === 0) {
						adjuster.setAttribute('id', 'inputComboRepeat');
						adjuster.setAttribute('Min', 1);
						adjuster.setAttribute('value', 1);
						adjuster.setAttribute('class', 'inputComboRepeat hitsOfSharpInputs');
					} else {
						adjuster.setAttribute('id', k);
						adjuster.setAttribute('class', 'inputs hitsOfSharpInputs');
						adjuster.setAttribute('Min', 0);
						adjuster.setAttribute('value', 0);
					}
					++k;
					adjuster.setAttribute('onChange', 'DataCompile(event)');
					cell.appendChild(adjuster);
					row.appendChild(cell);
				}
			} else {
				const cell = document.createElement('td');
				const textNode = document.createTextNode(text);

				cell.appendChild(textNode);
				row.appendChild(cell);
			}
		});
		tBody.appendChild(row);
		myBody.replaceWith(tBody);
	});
	table.setAttribute('id', `${id}Table`);
	tHead.setAttribute('id', `${id}Head`);
	tBody.setAttribute('id', `${id}Body`);
	tBody.className = /(BowGun)/.test(weaponType.val()) ? 'rangedTable' : 'meleeTable';

	ammoTable.style.display = currentAmmoTableStyle;
	dpsTable.style.display = currentDamageTableStyle;

	if (id !== 'stats' && id !== 'ammo') {
		const [len, ...column] = /BowGun/.test(weaponType.val())
			? [k, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
			: [k, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

		$('#previousWeapon').val($('#dropWeapon').val());
		$('#previousWeaponType').val(weaponType.val());
		for (let i = 0; i < len; ++i) {
			let j = 0;

			column.forEach((letter) => {
				$(`#${id}Body`)[0].children[i].children[j].className = `${letter} ${i}`;
				$(`#${id}Body`)[0].children[i].children[j].id = letter + i;
				++j;
			});
		}
	}
}

function HideAndRevealTypeSpecificElements(redKeyCard = false) {
	if (check.every((x) => x) && (redKeyCard || window.event.path[0] === weaponType[0])) {
		comboTracker = [];
		// hides all weaponType specific elements and sets selected index to 0
		for (let i = 0; i < $('.classSpecific').length; ++i) {
			$('.classSpecific')[i].parentNode.style = 'display:none';
			$('.classSpecific')[i].selectedIndex = 0;
			$('#divComboAttacks')[0].style = 'display:grid';
			weaponId.innerHTML = '';
		}
		if (/(Bow)/.test(weaponType.val())) {
			$('#sharpnessContainer').hide();
			RangedElements();
			UniqueColumnsDisplay();
		} else {
			MeleeElements();
			UniqueColumnsDisplay();
		}
	}
	function RangedElements() {
		// shows type specific common to Bow and BowGun

		$('#sharpnessContainer').style = 'display:none';
		ammoTable.style.display = 'none';

		weaponId.append(weaponType.val());
		weaponId.style = 'display:grid';
		for (let i = 0; i < $(`.${weaponType.val()}`).length; ++i) {
			$(`.${weaponType.val()}`)[i].parentNode.style = 'display:grid';
		}
		for (let i = 0; i < $('.Shot').length; ++i) {
			$('.Shot')[i].parentNode.style = 'display:grid';
		}
		if (/(BowGun)/.test(weaponType.val())) {
			// shows all type specific related to BowGun
			$('#divComboAttacks')[0].style = 'display:none';
			ammoChange.style = 'display:grid';
			resetCombo.style = 'display:none';
		} else {
			// shows all type specific related to Bow

			mightyBowId.parentNode.style = 'display:grid';
			ammoChange.style = 'display:none';
			resetCombo.style = 'display:grid';
		}
	}
	function MeleeElements() {
		if (/(InsectGlaive)|(ChargeBlade)|(LongSword)/.test(weaponType.val())) {
			ammoTable.style.display = 'none';

			$('.sharpness').parent()[0].style = 'display:grid';
			weaponId.style.display = 'grid';
			weaponId.innerHTML = weaponType.val();
			ammoChange.style = 'display:none';
			resetCombo.style = 'display:grid';

			for (let i = 0; i < $(`.${weaponType.val()}`).length; ++i) {
				$(`.${weaponType.val()}`)[i].parentNode.style = 'display:grid';
			}
			for (let i = 0; i < $('.melee').length; ++i) {
				$('.melee')[i].parentNode.style = 'display:grid';
			}
		} else {
			$('.sharpness').parent()[0].style = 'display:grid';
			ammoChange.style = 'display:none';
			resetCombo.style = 'display:grid';
			weaponId.style.display = 'none';
			for (let i = 0; i < $('.melee').length; ++i) {
				$('.melee')[i].parentNode.style = 'display:grid';
			}
		}
		if (weaponType.val() === 'ChargeBlade' && window.weapon[weaponType.val()][$('#dropWeapon').val()].Phial === 'Impact Phial') {
			shieldChargeEleid.parentNode.style = 'display:none';
			shieldChargeIMPid.parentNode.style = 'display:grid';
		} else if (
			weaponType.val() === 'ChargeBlade' &&
			window.weapon[weaponType.val()][$('#dropWeapon').val()].Phial === 'Element Phial'
		) {
			shieldChargeIMPid.parentNode.style = 'display:none';
			shieldChargeEleid.parentNode.style = 'display:grid';
		}
	}

	function UniqueColumnsDisplay() {
		let uniqueColumns = 0;

		$.each($('#unique').children(), (data) => {
			if ($('#unique').children()[data].style.display === 'grid') {
				++uniqueColumns;
			}
		});
		if (uniqueColumns === 2 || uniqueColumns === 3) {
			$('#unique')[0].style = 'grid-area: 5 / 3 / 6 / 4;';
		} else if (uniqueColumns === 4) {
			$('#unique')[0].style = 'grid-area: 2 / 3 / 3 / 6; grid-template-columns: repeat(3, auto)';
		} else if (uniqueColumns > 4) {
			$('#unique')[0].style = 'grid-template-columns:repeat(4, 1fr); grid-area: 6 / 1 / 7 / 6;';
		}
	}
}

function MaxSkills() {
	if (check.every((x) => x)) {
		for (let i = 0; i < $('.skill').length; ++i) {
			$('.skill')[i].selectedIndex = $('.skill')[i].hidden ? 0 : Object.values($('.skill')[i]).length - 1;
		}
	}
}

function ResetSkills() {
	if (check.every((x) => x)) {
		for (let i = 0; i < $('.skill').length; ++i) {
			$('.skill')[i].selectedIndex = 0;
		}
	}
}

function MonChart() {
	if (Object.prototype.hasOwnProperty.call(window, 'monster')) {
		const headers = [`${mon.val()}`, 'Sever', 'Blunt', 'Shot', 'Fire', 'Water', 'Thunder', 'Ice', 'Dragon'];
		const table = document.createElement('table');
		const mons = window.monster[mon.val()].HitZone;
		const myTable = document.querySelector('#monTable');
		const headerRow = document.createElement('tr');

		headers.forEach((headerText) => {
			const header = document.createElement('th');
			const textNode = document.createTextNode(headerText);

			header.appendChild(textNode);
			headerRow.appendChild(header);
		});

		table.appendChild(headerRow);
		for (let i = 0; i < Object.keys(mons).length; ++i) {
			const row = document.createElement('tr');
			const HZV = [].concat(Object.keys(mons)[i], Object.values(mons[Object.keys(mons)[i]]));

			for (let j = 0; j < 9; ++j) {
				const cell = document.createElement('td');
				// adds demon ammo and waterblight to displayed HZV
				HZV[j] = DemonAmmo.style.background !== 'gray' && (j === 1 || j === 2) ? ~~(HZV[j] *= 1.1) : HZV[j];
				if (WaterBlight.style.background !== 'gray' && (j === 1 || j === 2 || j === 3) && HZV[j] < 60) {
					HZV[j] += 25;
				} else if (WaterBlight.style.background !== 'gray' && (j === 1 || j === 2 || j === 3) && HZV[j] >= 60) {
					HZV[j] += 3;
				}

				const textNode = document.createTextNode(HZV[j]);

				if (HZV[j] < 14) {
					cell.setAttribute('class', 'F');
				} else if (HZV[j] < 25) {
					cell.setAttribute('class', 'C');
				} else if (HZV[j] < 45) {
					cell.setAttribute('class', 'B');
				} else if (HZV[j] < 70) {
					cell.setAttribute('class', 'A');
				} else if (HZV[j] >= 70) {
					cell.setAttribute('class', 'S');
				}
				cell.appendChild(textNode);
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
		table.setAttribute('id', 'monTable');
		myTable.replaceWith(table);
		$('#monTable > tr:nth-child(1) > th:nth-child(1)').replaceWith(mon);
	}
}

function SkillButtonToggle() {
	if (window.event.target.style.background !== 'gray') {
		window.event.target.style.background = 'gray';
		window.event.target.style.color = 'midnightblue';
	} else {
		window.event.target.style.background = '';
		window.event.target.style.color = '';
	}
}
function ToggleAmmoTables() {
	dpsTable.style = dpsTable.style.display === 'block' ? 'display:none' : 'display:block';

	ammoTable.style = dpsTable.style.display === 'block' ? 'display:none' : 'display:block';
}
function calculateAmmoFrames(ammo, power) {
	ammo.ammoIncrease = window.spm.AmmoUp[power.thisAttack][AmmoUPid.value];
	// converts to number to find frames used while staying within possible parameters
	ammo.recoilSpeed =
		window.spm.recoil[power.thisAttack][
			Math.max(0, Math.min(5, power.recoil - Recoilid.value - JSON.parse(Barrelid.value).Silencer))
		];
	ammo.recoilFrames = window.spm.recoil.frames[ammo.recoilSpeed];
	ammo.reloadSpeed =
		window.spm.reload[power.thisAttack][
			Math.max(0, Math.min(8, power.reload - Reloadid.value + JSON.parse(Barrelid.value).reload))
		];
	ammo.reloadFrames = window.spm.reload.frames[ammo.reloadSpeed];
	ammo.clipSize = power.clip + ammo.ammoIncrease;
	ammo.spareShot = +SpareShotid.value + +spareAdjust.value;
	// uses time needed to shoot 100 shots for calculations
	// 60 seconds /
	// ( ( ( ( ( 100 shots / clip size) -1  for times needed to reload) * frames needed to reload) = total reload frames
	// + (100 * recoil frames) = total recoil frames ) / 30 frames per second)
	ammo.shotsPerMinBase = ~~(60 / (((100 / power.clip - 1) * ammo.reloadFrames + 100 * ammo.recoilFrames) / 30 / 100));
	ammo.shotsPerMin = ~~(
		60 /
		((((100 - ammo.spareShot) / ammo.clipSize - 1) * ammo.reloadFrames + 100 * ammo.recoilFrames) / 30 / 100)
	);
	ammo.shotsPerGain = `${Number.parseFloat((ammo.shotsPerMin / ammo.shotsPerMinBase - 1) * 100).toFixed(2)}%`;

	ammo.ticsAdjust = power.ticsPer > 0 ? Number(power.ticsPer) : 1;

	if (/Pierce/.test(power.thisAttack)) {
		ammo.ticsAdjust = power.ticsPer * JSON.parse(pierceAdjust.value)[0];
	} else if (/Pierc/.test(power.thisAttack)) {
		ammo.ticsAdjust = power.ticsPer * JSON.parse(pierceAdjust.value)[1];
	} // Reduces total damage from pierce attacks displayed depending on selection
	// top is for piercing attacks, bottom is for elemental piercing attacks(elemental pierce is reduced by a higher percentage)
	return ammo;
}

function ComboReset(redKeyCard = false) {
	// resets the combo inputs to default values
	if (redKeyCard && !/BowGun/.test(previousWeaponType.value)) {
		comboTracker = [];

		$('.inputs').val(0);
		inputComboRepeat.value = 1;
		d0.innerHTML = `${0}/${0}`;
		e0.innerHTML = `${0}/${0}`;
		f0.innerHTML = `${0}/${0}`;
		[c0.innerHTML, g0.innerHTML, h0.innerHTML, i0.innerHTML] = [0, 0, 0, 0];
	}
}
function UpdateComboTracker() {
	// if value entered in the e.target combo input > amount stored in comboTracker global adds attack id to the end of the comboTracker until they are ===
	let difference = event.target.value - TimesUsed(event.target.id);
	if (event.target.id > 0) {
		if (difference > 0) {
			for (let i = 0; i < difference; i++) {
				comboTracker.push(event.target.id);
			}
			// if value entered in the e.target combo input < amount stored in comboTracker global removes the last attack id from the comboTracker until they are ===
		} else if (difference < 0) {
			difference -= difference * 2;
			for (let i = 0; i < difference; i++) {
				const undo = comboTracker.lastIndexOf(event.target.id);
				comboTracker.splice(undo, 1);
			}
		}
	}
}
function UpdateComboDisplay() {
	// Updates the Listed Combo Attacks
	$('.comboAttack').hide();

	$(comboTracker).each(function (index, element) {
		$(`#b${[element]}`).text();
		$('.comboAttack')[index].style = 'display:grid';
		$('.comboAttack')[index].textContent = $(`#b${[element]}`).text();
	});
}

// finds HitsOfSharpness per color as well as the total modifier to be used for the combo damage calculation
function TotalHitsOfSharpUsed(affinity, comboKeyCard) {
	// all Sharpness values are currently stored at 20% of actual value. hence +2s and *5s
	if (comboKeyCard === 0) {
		if (comboTracker !== []) {
			let listOfEachAttack = [];
			const hitsOfSharpPerColor = {};
			hitsOfSharpPerColor.white = [];
			hitsOfSharpPerColor.blue = [];
			hitsOfSharpPerColor.green = [];
			hitsOfSharpPerColor.yellow = [];
			hitsOfSharpPerColor.orange = [];
			hitsOfSharpPerColor.red = [];

			const total = {};
			let [whiteMin, whiteMax] = window.sharpness[weaponType.val()][$('#dropWeapon').val()].white;
			let [blueMin, blueMax] = window.sharpness[weaponType.val()][$('#dropWeapon').val()].blue;
			let [greenMin, greenMax] = window.sharpness[weaponType.val()][$('#dropWeapon').val()].green;
			let [yellowMin, yellowMax] = window.sharpness[weaponType.val()][$('#dropWeapon').val()].yellow;
			let [orangeMin, orangeMax] = window.sharpness[weaponType.val()][$('#dropWeapon').val()].orange;
			let [redMin, redMax] = window.sharpness[weaponType.val()][$('#dropWeapon').val()].red;

			for (let i = 0; i < handicraft.selectedIndex; ++i) {
				if (redMin < redMax) {
					yellowMin += 2;
				} else if (orangeMin < orangeMax) {
					greenMin += 2;
				} else if (yellowMin < yellowMax) {
					yellowMin += 2;
				} else if (greenMin < greenMax) {
					greenMin += 2;
				} else if (blueMin < blueMax) {
					blueMin += 2;
				} else if (whiteMin < whiteMax) {
					whiteMin += 2;
				}
			}
			const mTBonus = affinity > 0 ? 5 * (1 + +mastersTouch.value * affinity) : 5;
			total.white = ~~(mTBonus * whiteMin);
			total.blue = ~~(mTBonus * blueMin);
			total.green = ~~(mTBonus * greenMin);
			total.yellow = ~~(mTBonus * yellowMin);
			total.orange = ~~(mTBonus * orangeMin);
			total.red = ~~(mTBonus * redMin);

			UpdateComboTracker();
			UpdateComboDisplay();

			const comboMulti = $('.inputComboRepeat').length > 0 ? $('.inputComboRepeat').val() : 1;

			for (let i = 0; i < comboMulti; i++) {
				listOfEachAttack = listOfEachAttack.concat(comboTracker);
			}
			let totalHitsOfSharpnessUsed = 0;

			$(listOfEachAttack).each(function (index, eachAttack) {
				let ticsPerComboHit = 1;
				if (weaponType.val() !== 'Gunlance' || (weaponType.val() === 'Gunlance' && eachAttack < 14)) {
					ticsPerComboHit = Object.prototype.hasOwnProperty.call(
						window.attack[weaponType.val()][$(`#b${[eachAttack]}`).text()],
						'ticsPer',
					)
						? window.attack[weaponType.val()][$(`#b${[eachAttack]}`).text()].ticsPer
						: 1;
					for (let i = 0; i < ticsPerComboHit; i++) {
						if (window.attack[weaponType.val()][$(`#b${[eachAttack]}`).text()].hitsOfSharp > 0) {
							++totalHitsOfSharpnessUsed;
						}
					}
				} else if (weaponType.val() === 'Gunlance' && eachAttack >= 14) {
					++totalHitsOfSharpnessUsed;
				}
				if (totalHitsOfSharpnessUsed <= total.white) {
					hitsOfSharpPerColor.white = [].concat(hitsOfSharpPerColor.white, [eachAttack]);
				} else if (totalHitsOfSharpnessUsed <= total.blue + total.white) {
					hitsOfSharpPerColor.blue = [].concat(hitsOfSharpPerColor.blue, [eachAttack]);
				} else if (totalHitsOfSharpnessUsed <= total.green + total.blue + total.white) {
					hitsOfSharpPerColor.green = [].concat(hitsOfSharpPerColor.green, [eachAttack]);
				} else if (totalHitsOfSharpnessUsed <= total.yellow + total.green + total.blue + total.white) {
					hitsOfSharpPerColor.yellow = [].concat(hitsOfSharpPerColor.yellow, [eachAttack]);
				} else if (totalHitsOfSharpnessUsed <= total.orange + total.yellow + total.green + total.blue + total.white) {
					hitsOfSharpPerColor.orange = [].concat(hitsOfSharpPerColor.orange, [eachAttack]);
				} else if (totalHitsOfSharpnessUsed <= total.red + total.orange + total.yellow + total.green + total.blue + total.white) {
					hitsOfSharpPerColor.red = [].concat(hitsOfSharpPerColor.red, [eachAttack]);
				}
			});

			console.log(hitsOfSharpPerColor);

			let hits = totalHitsOfSharpnessUsed;
			[whiteMin, hits] = hits - total.white > 0 ? [0, hits - total.white] : [total.white - hits, 0];
			[blueMin, hits] = hits > 0 && hits - total.blue > 0 ? [0, hits - total.blue] : [total.blue - hits, 0];
			[greenMin, hits] = hits > 0 && hits - total.green > 0 ? [0, hits - total.green] : [total.green - hits, 0];
			[yellowMin, hits] = hits > 0 && hits - total.yellow > 0 ? [0, hits - total.yellow] : [total.yellow - hits, 0];
			[orangeMin, hits] = hits > 0 && hits - total.orange > 0 ? [0, hits - total.orange] : [total.orange - hits, 0];
			[redMin, hits] = hits > 0 && hits - total.red > 0 ? [0, hits - total.red] : [total.red - hits, 0];

			white.parentNode.style = `display:grid; width:${
				mTBonus * 0.8 * (whiteMax + blueMax + greenMax + yellowMax + orangeMax + redMax)
			}px`;
			white.style.width = `${whiteMin * 0.8}px`;
			blue.style.width = `${blueMin * 0.8}px`;
			green.style.width = `${greenMin * 0.8}px`;
			yellow.style.width = `${yellowMin * 0.8}px`;
			orange.style.width = `${orangeMin * 0.8}px`;
			red.style.width = `${redMin * 0.8}px`;

			white.innerHTML = whiteMin > 0 ? whiteMin : '';
			blue.innerHTML = blueMin > 0 ? blueMin : '';
			green.innerHTML = greenMin > 0 ? greenMin : '';
			yellow.innerHTML = yellowMin > 0 ? yellowMin : '';
			orange.innerHTML = orangeMin > 0 ? orangeMin : '';
			red.innerHTML = redMin > 0 ? redMin : '';

			if (whiteMin > 0) {
				Sharpness.selectedIndex = 6;
			} else if (blueMin > 0) {
				Sharpness.selectedIndex = 5;
			} else if (greenMin > 0) {
				Sharpness.selectedIndex = 4;
			} else if (yellowMin > 0) {
				Sharpness.selectedIndex = 3;
			} else if (orangeMin > 0) {
				Sharpness.selectedIndex = 2;
			} else if (redMin >= 0) {
				Sharpness.selectedIndex = 1;
			}

			return { ...hitsOfSharpPerColor };
		}
		if (event.target.path.length !== 0) {
			comboTracker = [event.target.id];
		}
	}
}

function BowComboDamage() {
	const tableCell = ['c', 'd', 'e', 'f', 'g', 'h', 'i'];
	let comboDamage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$('.inputs').each(function (index, input) {
		let eachAttacksDamage = [];
		if (input.value > 0) {
			$(tableCell).each(function (index, letter) {
				eachAttacksDamage = eachAttacksDamage.concat(`${$(`#${[letter + input.id]}`).text()}`.match(/\d+/g));
			});
			eachAttacksDamage = eachAttacksDamage.map((damage) => +damage * input.value * $('.inputComboRepeat ').val());
			$(eachAttacksDamage).each(function (index) {
				comboDamage[index] += +eachAttacksDamage[index];
			});
		}
	});
	return comboDamage;
}
function GunlanceShelling(currentDamage, comboDamage, ID) {
	const shellingType = window.weapon.GunlanceShelling[$('#dropWeapon').val()][0];
	const shellingLevel = window.weapon.GunlanceShelling[$('#dropWeapon').val()][1];
	console.log(shellingType, shellingLevel);
	$(Object.keys(window.attack.GunlanceShelling[shellingType])).each(function (index, element) {
		let ticsPer = Object.prototype.hasOwnProperty.call(window.attack.GunlanceShelling[shellingType][element], 'ticsPer')
			? window.attack.GunlanceShelling[shellingType][element].ticsPer
			: 1;
		const raw = window.attack.GunlanceShelling[shellingType][element].rawMV[shellingLevel];
		const ele = window.attack.GunlanceShelling[shellingType][element].eleMV[shellingLevel];
		const final = {
			'replaceME': 'replaceME',
			'Attack Name': element,
			'MV': 0,
			'Raw': `${raw} / ${raw}`,
			'Ele': `${ele} / ${ele}`,
			'Total': `${(raw + ele) * ticsPer} / ${(raw + ele) * ticsPer}`,
			'EFR': raw,
			'EFE': ele,
			'Effective': (raw + ele) * ticsPer,
		};

		for (let i = 0; i < TimesUsed(ID); ++i) {
			comboDamage[0] += 0;
			comboDamage[1] += raw;
			comboDamage[2] += raw;
			comboDamage[3] += ele;
			comboDamage[4] += ele;
			comboDamage[5] += (raw + ele) * ticsPer;
			comboDamage[6] += (raw + ele) * ticsPer;
			comboDamage[7] += raw;
			comboDamage[8] += ele;
			comboDamage[9] += (raw + ele) * ticsPer;
		}
		currentDamage.push(final);
		++ID;
	});

	BuildDamageTable(currentDamage, 'dps');

	c0.innerHTML = `${[comboDamage[0]]}`;
	d0.innerHTML = `${[comboDamage[1]]} / ${[comboDamage[2]]}`;
	e0.innerHTML = `${[comboDamage[3]]} / ${[comboDamage[4]]}`;
	f0.innerHTML = `${comboDamage[5]} / ${comboDamage[6]}`;
	g0.innerHTML = `${[comboDamage[7]]}`;
	h0.innerHTML = `${[comboDamage[8]]}`;
	i0.innerHTML = `${comboDamage[9]}`;
}
// Event to fire when quest and monster data loaded successfully.
function TimesUsed(ID, arr = comboTracker) {
	return arr.filter((attackId) => attackId == ID).length;
}
$(document).ajaxSuccess(() => {
	if (check.some((x) => !x)) {
		check[0] = window.event.target.responseURL === URLAttack || check[0];
		check[1] = window.event.target.responseURL === URLMonster || check[1];
		check[2] = window.event.target.responseURL === URLQuest || check[2];
		check[3] = window.event.target.responseURL === URLRampage || check[3];
		check[4] = window.event.target.responseURL === URLSharp || check[4];
		check[5] = window.event.target.responseURL === URLType || check[5];
		check[6] = window.event.target.responseURL === URLWeapon || check[6];
		if (check.every((x) => x)) {
			WeaponSelect();
			RampageSelect();
			PartSelect();
			QuestSelect();
			HealthSelect();
			MonChart();
			HideAndRevealTypeSpecificElements(true);
			DataCompile();
			ComboReset(true);
		}
	}
});
// set event listeners to buttons that on click events will fire DataCompile() and SkillButtonToggle() and pass e as the event.
$(document).ready(() => {
	$(`.skillButton `).on(`click`, (e) => {
		SkillButtonToggle(e);
		DataCompile(e);
		MonChart(e);
	});
});
// for (const weapon in window.attack) {
// 	const option = document.createElement('option');
// 	option.value = weapon;
// 	option.text = weapon;
// 	weaponType[0].appendChild(option);
// }
function WeaponSelect() {
	if (check.every((x) => x)) {
		weapon.empty();
		$.each(window.weapon[weaponType.val()], (key) => {
			weapon.append($('<option></option>').attr('value', key).text(key));
		});
	}
}

function RampageSelect() {
	if (check.every((x) => x)) {
		weaponRampage0.textContent = '';
		weaponRampage1.textContent = '';
		weaponRampage2.textContent = '';
		weaponRampage3.textContent = '';
		weaponRampage4.textContent = '';
		weaponRampage5.textContent = '';
		weaponRampage1.style = 'display:none';
		weaponRampage2.style = 'display:none';
		weaponRampage3.style = 'display:none';
		weaponRampage4.style = 'display:none';
		weaponRampage5.style = 'display:none';
		if (/Rampage/.test($('#dropWeapon').val())) {
			$.each(weaponRampage.children, (plusPlus, item) => {
				if (Object.prototype.hasOwnProperty.call(window.rampage[$('#dropWeapon').val()], [plusPlus])) {
					$.each(window.rampage[$('#dropWeapon').val()][plusPlus], (key, entry) => {
						weaponRampage.children[plusPlus].style = 'display:grid';
						$(weaponRampage.children[plusPlus]).append($('<option></option>').attr('value', entry).text(entry));
					});
				} else {
					weaponRampage.children[plusPlus].style = 'display:none';
				}
			});
		} else {
			$.each(weaponRampage.children, (key) => {
				$(weaponRampage.children[key]).empty();
				weaponRampage.children[key].style = key !== 0 ? 'display:none' : 'display:grid';
			});
			$.each(window.weapon[weaponType.val()][$('#dropWeapon').val()].Rampage, (key, entry) => {
				weaponRampage0.append($('<option></option>').attr('value', entry.key).text(entry));
			});
		}
	}
}
function PartSelect() {
	if (check.every((x) => x)) {
		monHZ.empty();
		$.each(window.monster[mon.val()].HitZone, (key) => {
			monHZ.append($('<option></option>').attr('value', key).text(key));
		});
	}
}
function QuestSelect() {
	monHunt.empty();
	$.each(window.quest, (key) => {
		if (Object.prototype.hasOwnProperty.call(window.quest[key], [mon.val()])) {
			monHunt.append($('<option></option>').attr('value', key).text(key));
		}
	});
}
function HealthSelect() {
	monHP.empty();
	$.each(window.quest[monHunt.val()][mon.val()], (key, value) => {
		monHP.append($('<option></option>').attr('value', value).text(value));
	});
}
