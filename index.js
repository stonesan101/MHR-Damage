const baseURL = /localhost/.test(window.location.host) ? 'http://localhost:5500' : 'https://stonesan101.github.io/MHR-Damage';
let check = { GreatSword: 0, rampage: 0, quest: 0, monster: 0, types: 0, ammo: 0, skills: 0 };
let count = 0;
let keyUp = 0;
let keyDown = 0;
let lastEvent = '';
let comboTracker = [];
const info = {};
const gs = 'GreatSword';
const sa = 'SwitchAxe';
const cb = 'ChargeBlade';
const ig = 'InsectGlaive';
const hbg = 'HeavyBowGun';
const lbg = 'LightBowGun';
const bow = 'Bow';
const sns = 'SwordNShield';
const db = 'DualBlades';
const ls = 'LongSword';
const lance = 'Lance';
const hh = 'HuntingHorn';
const gl = 'Gunlance';
const ham = 'Hammer';
const weaponType = document.getElementById('dropWeaponType');
const sharpnessMod = {
	purple: {
		PRM: 1.39,
		PEM: 1.25,
	},
	white: {
		PRM: 1.32,
		PEM: 1.15,
	},
	blue: {
		PRM: 1.2,
		PEM: 1.0625,
	},
	green: {
		PRM: 1.05,
		PEM: 1,
	},
	yellow: {
		PRM: 1,
		PEM: 0.75,
	},
	orange: {
		PRM: 0.75,
		PEM: 0.5,
	},
	red: {
		PRM: 0.5,
		PEM: 0.25,
	},
};
const weaponTypes = [
	['GreatSword'],
	['SwitchAxe'],
	['ChargeBlade'],
	['InsectGlaive'],
	['HeavyBowGun'],
	['LightBowGun'],
	['Bow'],
	['SwordNShield'],
	['DualBlades'],
	['LongSword'],
	['Lance'],
	['HuntingHorn'],
	['Gunlance'],
	['Hammer'],
];
const jsons = [['monster'], ['types'], ['rampage'], ['ammo'], ['quest'], ['skills']];
$([].concat(jsons, weaponTypes)).each(function () {
	$.getJSON(`${baseURL}/json/${this}.json`, data => {
		info[this] = data;
		if (/monster|types|rampage|quest|GreatSword|ammo|skills/.test(this)) {
			++check[this];
			jsonsLoaded();
		}
	});
});
document.createElement('tagName');
function DataCompile() {
	if (/BowGun/.test($(weaponType).val())) {
		RangedDPS();
	} else {
		MeleeDPS();
	}
}

function RangedDPS() {
	let rangedDamage = [];
	let ammoFrameData = [];
	let power = {};
	let ammo = {};
	let pass1 = true;
	$(
		Object.keys(
			Object.fromEntries(
				Object.entries(info.ammo).filter(
					eachAmmo => (getWeapon().usableAmmo[eachAmmo[1].isUsed] > 0 && !/RF\+/.test(eachAmmo[0])) || (/Wyvernblast/.test(eachAmmo[0]) && weaponType.value === lbg),
				),
			),
		),
	).each(function (index, skill) {
		let ammoID = skill;
		if ($(weaponType).val() === 'LightBowGun') {
			getWeapon().isRapidFire.forEach(ammoType => {
				if (ammoType === info.ammo[ammoID].isUsed) {
					ammoID = info.ammo.keys[info.ammo[ammoID].isUsed - 1][1];
				}
			});
		}
		power = { ...getWeapon(), ...info.ammo[ammoID] };
		power = ApplyRampageSelections(power);
		power = GetSkills(power);
		power = GetRemainingSkills(power);
		power = DamageCalculations(power);
		if (!/Wyvern|explosion|sub-Lv/.test(power.attackName)) {
			ammo = calculateAmmoFrames(power, ammoID);
		}
		if (/(?<!snipe.*)explosion|sub-Lv/.test(power.attackName)) {
			[power.efe, power.eleCrit, power.eleNon] = [power.baseEle, power.baseEle, power.baseEle];
		}
		const totalEffective = ~~(~~(0.1 + power.efr + power.efe) * ammo.ticsAdjust);
		const totalCrit = ~~(~~(0.1 + power.rawCrit + power.eleCrit) * ammo.ticsAdjust);
		const totalNon = ~~(~~(0.1 + power.rawNon + power.eleNon) * ammo.ticsAdjust);

		const shotsToKill = ~~(0.999 + $('#health').val() / totalEffective);
		// const timeToKill = /(Sticky|Slicing)/.test(power.attackName)
		// ? 5 + ~~(0.1 + (60 / ammo.shotsPerMin) * shotsToKill) // Adds delay time for stickies/ slicing;
		// : ~~(0.1 + (60 / ammo.shotsPerMin) * shotsToKill);
		const timeToKill = /Stic|Slic/.test(power.attackName)
			? 5 + ~~(0.999 + (60 / ammo.shotsPerMin) * shotsToKill)
			: ~~(0.999 + (60 / ammo.shotsPerMin) * shotsToKill);
		const rawBoth = [`${~~power.rawNon} / ${~~power.rawCrit}`];
		const eleBoth = [`${~~power.eleNon} / ${~~power.eleCrit}`];
		const total = [`${totalNon} / ${totalCrit}`];
		const damage = [power.attackName, rawBoth, eleBoth, total, ~~power.efr, ~~power.efe, totalEffective, ammo.shotsPerGain, shotsToKill, timeToKill];

		rangedDamage.push(damage);

		const ammoStats = [
			power.attackName,
			power.rawMV,
			ammo.reloadSpeed,
			ammo.recoilSpeed,
			ammo.clipSize,
			power.ticsPer + 1,
			ammo.shotsPerMinBase,
			ammo.shotsPerMin,
		];

		ammoFrameData.push(ammoStats);
		if (pass1) {
			const stats = [
				['Stat', 'Raw', 'Affinity', 'Ele Ammo'],
				['Base', ~~power.baseRaw, ~~power.baseAff, ~~(0.1 + 11 * power.eleAmmo)],
				['Total Attack', ~~power.raw, ~~(0.1 + power.aff * 100), ~~(0.1 + (11 * power.BEM + power.BE) * power.eleAmmo)],
				[
					'Total Damage',
					~~(power.raw * power.critBoost * power.PRM * power.enrage * power.augPRM * JSON.parse(Marksman.value)[0]),
					~~(power.aff * 100),
					~~(0.1 + (11 * power.BEM + power.BE) * power.eleAmmo * power.PEM * power.enrage * power.augPEM * power.eleCritBoost),
				],
				[
					'Effective',
					~~(power.raw * power.efrMulti * power.PRM * power.enrage * power.augPRM * JSON.parse(Marksman.value)[1]),
					~~(power.aff * 100),
					~~(0.1 + (11 * power.BEM + power.BE) * power.eleAmmo * power.PEM * power.enrage * power.augPEM * power.efeMulti),
				],
			];
			BuildDamageTable(stats, 'stats');
			pass1 = false;

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
		}
	});

	BuildDamageTable(rangedDamage, 'dps');
	ammoFrameData.splice(0, 0, ['Ammo Type', 'rawMV', 'Reload', 'Recoil', 'Clip Size', 'Tics Per Shot', 'Shots Per \n Min Base', 'Shots \n Per Min']);
	BuildDamageTable(ammoFrameData, 'ammo');
}

function MeleeDPS() {
	let meleeDamage = [['Combo', 'Attack Name', 'MV', 'Raw', 'Element', 'Total', 'EFR', 'EFE', 'Effective']];
	let comboDamage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let power = {};
	let firstRun = true;
	//  filters CB Phial Attacks, Gunlance Shelling, Bow Attacks
	//
	if ($(weaponType).val() === 'Bow' || $(weaponType).val() === 'ChargeBlade' || $(weaponType).val() === 'InsectGlaive' || $(weaponType).val() === 'Gunlance') {
		power.attacks = { ...AddDependantSkills(power) };
	} else {
		power.attacks = { ...getAttacks() };
	}
	$(Object.keys(power.attacks)).each(function (attackID, eachAttack) {
		power = { ...power, ...info[$(weaponType).val()].attacks[eachAttack], ...getWeapon() };
		power = { ...ApplyRampageSelections(power) };
		//
		power = GetSkills(power);
		//

		if (/inputs|inputButton/.test(window.event.target.className) && firstRun && !/BowGun/.test($(weaponType).val())) {
			UpdateComboTracker();
			UpdateComboDisplay();
		}

		if (firstRun && power.comboHitsPerColor === undefined && $(weaponType).val() !== 'Bow') {
			power = TotalHitsOfSharpUsed(power);
		}
		power = GetRemainingSkills(power);

		power = DamageCalculations(power);

		if (!/Bow/.test($(weaponType).val()) && comboTracker.length > 0) {
			/* goes through each color sharpness and filters the recorded attacks for the number of times this current attack was used
			 * then applies the given sharpness modifier to the damage if damage type is sever or blunt then multiplies by the times used
			 * saves results in the comboDamage var and += the totals for every sharpness of every attack
			 * to later be used to update the comboDamage in the dpsTable
			 */
			if ($('.inputs').length > 0) {
				$(Object.keys(power.comboHitsPerColor)).each(function (index, color) {
					if (TimesUsed(attackID, power.comboHitsPerColor[color]) > 0) {
						const [sharpPRM, sharpPEM] = power.noSharpMod === false ? [sharpnessMod[color].PRM, sharpnessMod[color].PEM] : [1, 1];
						let hitsPerAttackPerSharpness = TimesUsed(attackID, power.comboHitsPerColor[color]);
						// combo=[rawMV,rawNon,rawCrit,eleNon,eleCrit,totalNon,TotalCrit,EFR,EFE,totalEffective]
						comboDamage = [
							(comboDamage[0] += Number(~~(0.1 + power.rawMV * hitsPerAttackPerSharpness * (power.ticsPer + 1)))),
							(comboDamage[1] += Number(~~(0.1 + power.rawNon * sharpPRM) * hitsPerAttackPerSharpness)),
							(comboDamage[2] += Number(~~(0.1 + power.rawCrit * sharpPRM) * hitsPerAttackPerSharpness)),
							(comboDamage[3] += Number(~~(0.1 + power.eleNon * sharpPEM) * hitsPerAttackPerSharpness)),
							(comboDamage[4] += Number(~~(0.1 + power.eleCrit * sharpPEM) * hitsPerAttackPerSharpness)),
							(comboDamage[5] += Number(
								(~~(0.1 + power.rawNon * sharpPRM) * hitsPerAttackPerSharpness + ~~(0.1 + power.eleNon * sharpPEM) * hitsPerAttackPerSharpness) * (power.ticsPer + 1),
							)),
							(comboDamage[6] += Number(
								(~~(0.1 + power.rawCrit * sharpPRM) * hitsPerAttackPerSharpness + ~~(0.1 + power.eleCrit * sharpPEM) * hitsPerAttackPerSharpness) * (power.ticsPer + 1),
							)),
							(comboDamage[7] += Number(~~(0.1 + power.efr * sharpPRM) * hitsPerAttackPerSharpness)),
							(comboDamage[8] += Number(~~(0.1 + power.efe * sharpPEM) * hitsPerAttackPerSharpness)),
							(comboDamage[9] += Number(
								(~~(0.1 + power.efr * sharpPRM) * hitsPerAttackPerSharpness + ~~(0.1 + power.efe * sharpPEM) * hitsPerAttackPerSharpness) * (power.ticsPer + 1),
							)),
						];
					}
				});
			}
		}
		// damage/meleeDamage adds sharpness to the calculations and arranges them in the array to be used for the damageTable
		let sharpnessModifier = power.noSharpMod === false ? JSON.parse(Sharpness.value) : { PRM: 1, PEM: 1 };
		sharpnessModifier = weaponType.value === 'Bow' && bowCoating[bowCoating.selectedIndex].text === 'Power' ? 1.35 : sharpnessModifier;
		sharpnessModifier = weaponType.value === 'Bow' && bowCoating[bowCoating.selectedIndex].text === 'Close Range' ? 1.32 : sharpnessModifier;
		sharpnessModifier = weaponType.value === 'Bow' && bowCoating[bowCoating.selectedIndex].text === 'Close Range+' ? 1.39 : sharpnessModifier;
		const damage = [
			'replaceME',
			power.attackName,
			power.rawMV,
			`${~~(0.1 + power.rawNon * sharpnessModifier.PRM)} / ${~~(0.1 + power.rawCrit * sharpnessModifier.PRM)}`,

			`${~~(0.1 + power.eleNon * sharpnessModifier.PEM)} / ${~~(0.1 + power.eleCrit * sharpnessModifier.PEM)}`,

			`${(~~(0.1 + power.rawNon * sharpnessModifier.PRM) + ~~(0.1 + power.eleNon * sharpnessModifier.PEM)) * (power.ticsPer + 1)} / ${
				(~~(0.1 + power.rawCrit * sharpnessModifier.PRM) + ~~(0.1 + power.eleCrit * sharpnessModifier.PEM)) * (power.ticsPer + 1)
			}`,

			~~(0.1 + power.efr * sharpnessModifier.PRM),

			~~(0.1 + power.efe * sharpnessModifier.PEM),

			(~~(0.1 + power.efe * sharpnessModifier.PEM) + ~~(0.1 + power.efr * sharpnessModifier.PRM)) * (power.ticsPer + 1),
		];

		meleeDamage.push(damage);
		// stats stores calculations to be used for the statsTable
		if (firstRun) {
			const ele = lower(power.eleType) === 'none' ? 0 : power.ele;
			const stats = [
				[['Stat'], ['Raw'], ['Affinity'], [power.eleType]],
				['Base', ~~power.baseRaw, power.baseAff, power.baseEle],
				['Total Attack', ~~power.raw, ~~(power.aff * 100), ~~ele],
				[
					'Total Damage',
					~~(power.raw * power.critBoost * power.PRM * power.enrage * power.augPRM * JSON.parse(Marksman.value)[0] * sharpnessModifier.PRM),
					~~(power.aff * 100),
					~~(ele * power.eleCritBoost * power.PEM * power.enrage * power.augPEM * sharpnessModifier.PEM),
				],
				[
					'Effective',
					~~(power.raw * power.efrMulti * power.PRM * power.enrage * power.augEFR * JSON.parse(Marksman.value)[1] * sharpnessModifier.PRM),
					~~(power.aff * 100),
					~~(ele * power.efeMulti * power.PEM * power.augPEM * power.enrage * power.augEFR * sharpnessModifier.PEM),
				],
			];
			BuildDamageTable(stats, 'stats');
			firstRun = false;
		}
	});
	if ($('#dropWeaponType').val() === 'Gunlance') {
		GunlanceShelling(meleeDamage, comboDamage, power);
	} else {
		if ($('#dropWeaponType').val() === 'Bow') {
			comboDamage = BowComboDamage();
		}
		if (!/Inputs/.test(window.event.target.className)) {
			meleeDamage.splice(1, 1, [
				'replaceME',
				'Combo Damage',
				comboDamage[0],
				`${comboDamage[1]} / ${comboDamage[2]}`,
				`${comboDamage[3]} / ${comboDamage[4]}`,
				`${comboDamage[5]} / ${comboDamage[6]}`,
				comboDamage[7],
				comboDamage[8],
				comboDamage[9],
			]);
			BuildDamageTable(meleeDamage, 'dps');
		} else {
			document.getElementById('c0').textContent = `${[comboDamage[0]]}`;
			document.getElementById('d0').textContent = `${[comboDamage[1]]} / ${[comboDamage[2]]}`;
			document.getElementById('e0').textContent = `${[comboDamage[3]]} / ${[comboDamage[4]]}`;
			document.getElementById('f0').textContent = `${comboDamage[5]} / ${comboDamage[6]}`;
			document.getElementById('g0').textContent = `${[comboDamage[7]]}`;
			document.getElementById('h0').textContent = `${[comboDamage[8]]}`;
			document.getElementById('i0').textContent = `${comboDamage[9]}`;
		}
	}
}

function ApplyRampageSelections(power) {
	if (getWeapon().rampageSlots === 0) {
		// applies rampage any bonuses that effect base stats
		$(weaponRampage.children).each(function (index, element) {
			const rampageSkill = info.rampage['Rampage-Up Skill'][element.value];
			if (rampageSkill !== undefined) {
				for (let i = 0; i < Object.keys(rampageSkill).length; i++) {
					const stat = Object.keys(rampageSkill)[i];
					power[stat] += rampageSkill[stat];
				}
			}
		});
		// for skills that change the base element
		if (!/BowGun/.test($('#dropWeaponType').val())) {
			power.eleType = /Fire|Water|Thunder|Ice|Dragon|Blase|Sleep|Poison|Para/.test(weaponRampage.children[1].value)
				? weaponRampage.children[1].value.match(/Fire|Water|Thunder|Ice|Dragon|Blase|Sleep|Poison|Para/)[0]
				: power.eleType;
		}
	}
	power.baseAff = power.aff;

	return { ...power };
}

function AddDependantSkills() {
	if ($(weaponType).val() === 'InsectGlaive') {
		let attacks = Object.fromEntries(Object.entries(info.InsectGlaive.attacks).filter(skill => !/Kinsect|Dust|Powder|Mark/.test(skill)));

		return attacks;
	} else if ($(weaponType).val() === 'ChargeBlade') {
		const phialType = getWeapon().phialType === 'Impact Phial' ? 'Element Phial| Elemental Phial|Element D' : 'Impact Phial';
		const regexp = new RegExp(`${phialType}`);

		let attacks = Object.fromEntries(Object.entries(getAttacks()).filter(skill => !regexp.test(skill)));

		return attacks;

		//  filters bow attacks for only the usable attacks
	} else if ($('#dropWeaponType').val() === 'Bow') {
		// let attacksTemp = getAttacks();

		let usableKeys = '';
		const totalKeys =
			document.getElementById('BowChargePlus').selectedIndex === 1 && getWeapon().baseCharge < 4 ? getWeapon().baseCharge + 1 : getWeapon().baseCharge;
		$(getWeapon().bowShot).each(function (index, element) {
			if (index < totalKeys) {
				usableKeys += `|Lv${element.match('[1-5]')[0]} ${element.match('Normal|Rapid|Pierce|Spread')[0]}`;
			}
		});
		let regex = new RegExp([usableKeys.slice(1)]);

		return {
			...Object.fromEntries(Object.entries(getAttacks()).splice(0, 1)),
			...Object.fromEntries(Object.entries(getAttacks()).filter(skill => regex.test(skill))),
			...Object.fromEntries(Object.entries(getAttacks()).splice(137)),
		};
	} else if ($(weaponType).val() === 'Gunlance') {
		return Object.fromEntries(Object.entries(getAttacks()).splice(0, 28));
	}
}
function GetSkills(power) {
	power.baseRaw += power.Draw === true ? +document.getElementById('PunishingDraw').value : 0;
	power.BR = 0;
	power.BRM = 1;
	power.PRM = 1;
	power.BEM = 1;
	power.BE = 0;
	power.PEM = 1;
	power.enrage = $('#dropEnraged').val() === 'Enraged' ? info.monster.enrage[document.getElementById('dropMonster').selectedIndex]['Player Dmg'] : 1;
	// For non ele Weapons
	power.eleHZV =
		lower(power.eleType) === undefined ||
		lower(power.eleType) === 'ignorehzv' ||
		lower(power.eleType) === 'non' ||
		lower(power.eleType) === 'none' ||
		Number.isNaN(power.baseEle) ||
		lower(power.eleType) === undefined
			? 0
			: info.monster.hzv[dropMonster.value][dropHZ.selectedIndex][lower(power.eleType)];
	// removes HZV for attacks like stickies and phials
	power.rawHZV = /(None|ignore|Stick|Clust|IgnoreHZV)/.test(power.type) ? 100 : info.monster.hzv[dropMonster.value][dropHZ.selectedIndex][lower(power.type)];
	// applies Demon Ammo if selected and damage type is sever or blunt
	power.PRM *= $(DemonAmmo).hasClass('blue') && /(sever|blunt)/.test(power.type) ? 1.1 : 1;
	1;
	let skills = [];
	$('.skillButton:not(button#ProtectivePolish)').each(function () {
		if ($(this).hasClass('blue')) {
			skills.push(JSON.parse(this.value));
		}
	});
	power.getSkills = [];
	switch (power.type) {
		case 'Sever':
		case 'Blunt':
		case 'sever':
		case 'blunt':
			power.skillType = 'Sever';
			break;
		case 'Shot':
			power.skillType = 'Gunner';
			break;
		case 'ignore':
		case 'IgnoreHZV':
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
	// adds agitator to getSkills if enraged
	power.getSkills = [].concat(info.types[power.skillType]);
	if ($('#dropEnraged').val() === 'Enraged') {
		power.getSkills.push('Agitator');
		enrageDisplay.textContent = ~~(info.monster.enrage[dropMonster.selectedIndex]['Player Dmg'] * 100) + '%';
	}

	// applies RF/Normal/Pierce/Spread up bonuses to bow and bowgun
	if (/Bow/.test($(weaponType).val())) {
		if (/Pierc/.test(power.attackName)) {
			power.getSkills.push('PierceUp');
		} else if (/Spread/.test(power.attackName)) {
			power.getSkills.push('SpreadUp');
		} else if (/Normal/.test(power.attackName)) {
			power.getSkills.push('NormalRapidUp');
		}
		if (/RF+|Rapid/.test(power.attackName)) {
			power.getSkills.push('RapidFireUp');
		}
		if (/Wyvern|Dragon Piercer/.test(power.attackName)) {
			power.getSkills.push('SpecialAmmoBoost');
		}
	}
	// power.getSkills.push('dropDereliction');
	if ($(weaponType).val() === 'LongSword' && !/Helm Breaker|Serene/.test(power.attackName)) {
		power.getSkills.push('spiritGauge');
	} else if ($(weaponType).val() === 'LongSword') {
		power.getSkills.push('Helmbreaker');
	}
	// applies GreatSwords Charge Level Bonus
	if ($(weaponType).val() === 'GreatSword' && /(?<=Lv)1|2|3/.test(power.attackName)) {
		power.rawMV *= Number('1.' + power.attackName.match('(?<=Lv)1|2|3')[0]);
		power.rawMV = power.rawMV.toFixed(1);
	}
	//applies ChargeBlade specific abilities
	if ($(weaponType).val() === 'ChargeBlade') {
		if (!/3rd|(?<!Midair |Axe: )UED|(?<!Charged )Sword(?!.*Shield)/.test(power.attackName)) {
			power.getSkills.push('savageAxe');
		}
		getWeapon().phialType === 'Impact Phial' ? power.getSkills.push('impShieldCharge') : power.getSkills.push('eleShieldCharge');
	}
	power.aff += weaponRampage0.value === 'Hellion Mode' && weaponType.value === 'DualBlades' ? 20 : 0;
	if (weaponType.value === 'Bow' && /Stake/.test(power.attackName)) {
		power.getSkills = power.getSkills.filter((/** @type {string} */ skill) => skill !== 'bowCoating');
	}
	$(power.getSkills).each(function () {
		if (this == 'Dereliction') {
			skills.push(JSON.parse(Dereliction.value));
		} else {
			skills.push(info.skills[this][$(`#${this}`)[0].selectedIndex]);
		}
	});

	// skills.push(JSON.parse(MailofHellfire.value));

	getStats(power, skills);
	// applies Water Blight if selected appropriate to the hzv
	power.rawHZV = $(WaterBlight).hasClass('blue') ? Math.min(100, ~~(Math.max(power.rawHZV, power.rawHZV * 0.63 + 22.2) + 3)) : power.rawHZV;
	if (weaponRampage0.value === 'Kushala Daora Soul') {
		power.aff += 15;
	}
	// adds Weakness Exploit
	power.aff = power.rawHZV >= 45 ? power.aff + JSON.parse($('#WeaknessExploit').val()) : power.aff;
	power.aff = Math.min(power.aff, 100) / 100;

	return { ...power };
}
function UpdateComboTracker() {
	if (!Number.isNaN(+window.event.target.id) && window.event.target.id !== '0') {
		// if value entered in the e.target combo input > amount stored in comboTracker [] adds attack id to the end of the comboTracker until they are ===
		let difference = $('.inputs')[window.event.target.id].value - TimesUsed(window.event.target.id);
		while (difference > 0) {
			comboTracker.push(window.event.target.id);
			--difference;
		}
		// if value entered in the e.target combo input < amount stored in comboTracker [] removes the last instance of this attack id from the comboTracker until they are ===
		while (difference < 0) {
			comboTracker.splice(comboTracker.lastIndexOf(window.event.target.id), 1);
			++difference;
		}
	}
}

function UpdateComboDisplay() {
	$('.comboHits').remove();
	let comboHit;
	$(comboTracker).each(function (index, element) {
		comboHit = document.createElement('output');
		comboHit.className = 'comboHits';
		comboHit.textContent = $(`td#b${[element]}>output`).text();
		$(comboCountDisplay).after(comboHit);
	});
}

// finds HitsOfSharpness current sharpness as well as what combo hits were used how many times per color
function TotalHitsOfSharpUsed(power) {
	power.listOfEachAttack = [].concat(comboTracker);
	let totalHitsOfSharpnessUsed = 0;
	let increase = [];
	const total = {};
	power.hitsOfSharpness = [];
	power.hitsOfSharpness.purple = power.sharpness.purple;
	power.hitsOfSharpness.white = power.sharpness.white;
	power.hitsOfSharpness.blue = power.sharpness.blue;
	power.hitsOfSharpness.green = power.sharpness.green;
	power.hitsOfSharpness.yellow = power.sharpness.yellow;
	power.hitsOfSharpness.orange = power.sharpness.orange;
	power.hitsOfSharpness.red = power.sharpness.red;

	// gets handicraft.selectedIndex & figures out which color power.handicraft actually applies to then add the extra points appropriately.
	if (Handicraft.selectedIndex > 0) {
		if (power.hitsOfSharpness.purple > 0) {
			increase = ['purple'];
		} else if (power.hitsOfSharpness.white > 0) {
			increase = ['white', 'purple'];
		} else if (power.hitsOfSharpness.blue > 0) {
			increase = ['blue', 'white', 'purple'];
		} else if (power.hitsOfSharpness.green > 0) {
			increase = ['green', 'blue', 'white', 'purple'];
		} else if (power.hitsOfSharpness.yellow > 0) {
			increase = ['yellow', 'green', 'blue', 'white'];
		}
		let pointsOfHandicraft = Handicraft.selectedIndex;
		$(power.handicraft).each(function (index, element) {
			while (element > 0 && pointsOfHandicraft > 0) {
				power.hitsOfSharpness[increase[index]] += 10;
				--pointsOfHandicraft;
				element -= 10;
			}
		});
	}
	let razorSharp = info.skills.RazorSharp[RazorSharp.selectedIndex].Sharp;
	let MT = info.skills.MastersTouch[MastersTouch.selectedIndex].Sharp;
	MT *= power.aff;
	// applies the extra hits of sharpness from the Masters Touch skill;
	const mTBonus = power.aff > 0 && MastersTouch.selectedIndex > 0 ? sharpnessReduction(MT) * sharpnessReduction(razorSharp) : sharpnessReduction(razorSharp);
	total.purple = ~~(mTBonus * power.hitsOfSharpness.purple);
	total.white = ~~(mTBonus * power.hitsOfSharpness.white);
	total.blue = ~~(mTBonus * power.hitsOfSharpness.blue);
	total.green = ~~(mTBonus * power.hitsOfSharpness.green);
	total.yellow = ~~(mTBonus * power.hitsOfSharpness.yellow);
	total.orange = ~~(mTBonus * power.hitsOfSharpness.orange);
	total.red = ~~(mTBonus * power.hitsOfSharpness.red);

	let comboMulti = $('.inputComboRepeat').val();
	// for each pont in the comboMultiplier input, adds another comboTracker [] to the listOfEachAttack
	while (comboMulti > 1) {
		power.listOfEachAttack = power.listOfEachAttack.concat(comboTracker);
		--comboMulti;
	}
	power.comboHitsPerColor = [];
	power.comboHitsPerColor.purple = [];
	power.comboHitsPerColor.white = [];
	power.comboHitsPerColor.blue = [];
	power.comboHitsPerColor.green = [];
	power.comboHitsPerColor.yellow = [];
	power.comboHitsPerColor.orange = [];
	power.comboHitsPerColor.red = [];

	$(power.listOfEachAttack).each(function () {
		const eachAttack = this;
		let attackKeys = Object.keys(power.attacks);
		if ($(ProtectivePolish).hasClass('gray')) {
			if ($('#dropWeaponType').val() !== 'Gunlance' || ($('#dropWeaponType').val() === 'Gunlance' && eachAttack < 28)) {
				for (let i = 0; i < power.ticsPer + 1; i++) {
					// applies DualBlades Sharpness Reduction
					if ($(weaponType).val() === 'DualBlades') {
						totalHitsOfSharpnessUsed += info[$(weaponType).val()].attacks[attackKeys[eachAttack]].hitsOfSharp / 3;
					} else {
						totalHitsOfSharpnessUsed += info[$(weaponType).val()].attacks[attackKeys[eachAttack]].hitsOfSharp;
					}
				}
			} else if ($('#dropWeaponType').val() === 'Gunlance' && eachAttack > 27) {
				++totalHitsOfSharpnessUsed;
			}
		}
		let totalHits = 0;
		if (totalHitsOfSharpnessUsed <= (totalHits += total.purple) && power.hitsOfSharpness.purple > 0) {
			power.comboHitsPerColor.purple.push(eachAttack);
		} else if (totalHitsOfSharpnessUsed <= (totalHits += total.blue) && power.hitsOfSharpness.white > 0) {
			power.comboHitsPerColor.white.push(eachAttack);
		} else if (totalHitsOfSharpnessUsed <= (totalHits += total.blue) && power.hitsOfSharpness.blue > 0) {
			power.comboHitsPerColor.blue.push(eachAttack);
		} else if (totalHitsOfSharpnessUsed <= (totalHits += total.green) && power.hitsOfSharpness.green > 0) {
			power.comboHitsPerColor.green.push(eachAttack);
		} else if (totalHitsOfSharpnessUsed <= (totalHits += total.yellow) && power.hitsOfSharpness.yellow > 0) {
			power.comboHitsPerColor.yellow.push(eachAttack);
		} else if (totalHitsOfSharpnessUsed <= (totalHits += total.orange)) {
			power.comboHitsPerColor.orange.push(eachAttack);
		} else if (totalHitsOfSharpnessUsed <= (totalHits += total.red)) {
			power.comboHitsPerColor.red.push(eachAttack);
		}
	});
	let hits = totalHitsOfSharpnessUsed;
	[power.hitsOfSharpness.purple, hits] = hits - total.purple > 0 ? [0, hits - total.purple] : [total.purple - hits, 0];
	[power.hitsOfSharpness.white, hits] = hits - total.white > 0 ? [0, hits - total.white] : [total.white - hits, 0];
	[power.hitsOfSharpness.blue, hits] = hits > 0 && hits - total.blue > 0 ? [0, hits - total.blue] : [total.blue - hits, 0];
	[power.hitsOfSharpness.green, hits] = hits > 0 && hits - total.green > 0 ? [0, hits - total.green] : [total.green - hits, 0];
	[power.hitsOfSharpness.yellow, hits] = hits > 0 && hits - total.yellow > 0 ? [0, hits - total.yellow] : [total.yellow - hits, 0];
	[power.hitsOfSharpness.orange, hits] = hits > 0 && hits - total.orange > 0 ? [0, hits - total.orange] : [total.orange - hits, 0];
	[power.hitsOfSharpness.red, hits] = hits > 0 && hits - total.red > 0 ? [0, hits - total.red] : [total.red - hits, 0];
	let width = total.purple + total.white + total.blue + total.green + total.yellow + total.orange + total.red;

	let finalWidth = Math.min(width, $(section2).width());

	$('#white').parent().css('width', `${finalWidth}px`);
	purple.style.width = `${(power.hitsOfSharpness.purple / width) * finalWidth}px`;
	white.style.width = `${(power.hitsOfSharpness.white / width) * finalWidth}px`;
	blue.style.width = `${(power.hitsOfSharpness.blue / width) * finalWidth}px`;
	green.style.width = `${(power.hitsOfSharpness.green / width) * finalWidth}px`;
	yellow.style.width = `${(power.hitsOfSharpness.yellow / width) * finalWidth}px`;
	orange.style.width = `${(power.hitsOfSharpness.orange / width) * finalWidth}px`;
	red.style.width = `${(power.hitsOfSharpness.red / width) * finalWidth}px`;

	purple.innerHTML = power.hitsOfSharpness.purple > 0 ? ~~(power.hitsOfSharpness.purple + 0.7) : '';
	white.innerHTML = power.hitsOfSharpness.white > 0 ? ~~(power.hitsOfSharpness.white + 0.7) : '';
	blue.innerHTML = power.hitsOfSharpness.blue > 0 ? ~~(power.hitsOfSharpness.blue + 0.7) : '';
	green.innerHTML = power.hitsOfSharpness.green > 0 ? ~~(power.hitsOfSharpness.green + 0.7) : '';
	yellow.innerHTML = power.hitsOfSharpness.yellow > 0 ? ~~(power.hitsOfSharpness.yellow + 0.7) : '';
	orange.innerHTML = power.hitsOfSharpness.orange > 0 ? ~~(power.hitsOfSharpness.orange + 0.7) : '';
	red.innerHTML = power.hitsOfSharpness.red > 0 ? ~~(power.hitsOfSharpness.red + 0.7) : '';

	if (power.hitsOfSharpness.purple > 0) {
		Sharpness.selectedIndex = 7;
	} else if (power.hitsOfSharpness.white > 0) {
		Sharpness.selectedIndex = 6;
	} else if (power.hitsOfSharpness.blue > 0) {
		Sharpness.selectedIndex = 5;
	} else if (power.hitsOfSharpness.green > 0) {
		Sharpness.selectedIndex = 4;
	} else if (power.hitsOfSharpness.yellow > 0) {
		Sharpness.selectedIndex = 3;
	} else if (power.hitsOfSharpness.orange > 0) {
		Sharpness.selectedIndex = 2;
	} else if (power.hitsOfSharpness.red >= 0) {
		Sharpness.selectedIndex = 1;
	}

	return { ...power };
}
function GetRemainingSkills(power) {
	[power.augEFR, power.augPRM, power.augPEM] = [1, 1, 1];

	/*
	 * If an anti species type skill is selected it gets the list of monsters applicable and checks
	 *if the selected monster is in the list.If true, it applies the skill.
	 */
	if (
		getWeapon().rampageSlots === 0 &&
		Object.prototype.hasOwnProperty.call(info.types, $('#weaponRampage0').val()) &&
		Object.prototype.hasOwnProperty.call(info.types[$('#weaponRampage0').val()].Monsters, $('#dropMonster').val())
	) {
		[power.augPRM, power.augPEM] = info.types[$('#weaponRampage0').val()];
	} else if (
		dropMonster.value !== 'Toadversary' &&
		getWeapon().rampageSlots > 0 &&
		Object.entries(info.types[dropMonster.value]).filter(isSpecies => isSpecies[1] && weaponRampage0.value.match(isSpecies[0])).length > 0
	) {
		power.PRM *= 1.05;
		power.PEM *= 1.05;
	}
	if (/blight Exploit/.test(weaponRampage0.value)) {
		power.PRM *= 1.1;
		power.PEM *= 1.1;
	}
	if (weaponRampage0.value === 'Magnamalo Soul') {
		power.BR += 12;
	}
	if (/BowGun/.test(weaponType.value)) {
		if (dropWeaponType.value === 'LightBowGun' && /Pierce|Spread|Normal/.test(power.attackName) && $(CriticalFirePower).hasClass('blue')) {
			if (/Normal/.test(power.attackName)) {
				power.PRM *= 1.3;
				power.augEFR *= 1.3;
			} else if (/Spread/.test(power.attackName)) {
				power.PRM *= 1.2;
				power.augEFR *= 1.2;
			} else if (/Pierce/.test(power.attackName)) {
				power.PRM *= 1.1;
				power.augEFR *= 1.1;
			}
		}
		// Elemental Reload
		power.BEM *= JSON.parse(BarrelId.value).Element;
		// Power Barrel
		if ((TuneUp.selectedIndex === 0 || TuneUp.selectedIndex === 1) && BarrelId.options[BarrelId.selectedIndex].text === 'Power Barrel') {
			power.baseRaw = ~~(power.baseRaw * 1.125);
		} else if (TuneUp.selectedIndex === 2 && BarrelId.options[BarrelId.selectedIndex].text === 'Power Barrel') {
			power.baseRaw = ~~(power.baseRaw * 1.15);
		}
		if ((TuneUp.selectedIndex === 0 || TuneUp.selectedIndex === 1) && BarrelId.options[BarrelId.selectedIndex].text === 'Long Barrel') {
			power.baseRaw = ~~(power.baseRaw * 1.05);
		} else if (TuneUp.selectedIndex === 2 && BarrelId.options[BarrelId.selectedIndex].text === 'Long Barrel') {
			power.baseRaw = ~~(power.baseRaw * 1.075);
		}
	}
	if (weaponType.value === 'ChargeBlade' && power.skillType === 'Stickies' && power.phialType === 'Impact Phial') {
		power.augEFR *= JSON.parse(Bombardier.value)[1];
		power.augPRM *= JSON.parse(Bombardier.value)[0];
	}
	if (/(?<!snipe.*)explosion/.test(power.attackName)) {
		power.augEFR *= JSON.parse(Bombardier.value)[lower(power.attackName).match(/sticky|wyvern/)[0]][1];
		power.augPRM *= JSON.parse($(Bombardier).val())[lower(power.attackName).match(/sticky|wyvern/)[0]][0];
	}
	// If elemental exploit is selected && power.eleHZV >= 25 applies elemental exploit
	power.PEM *=
		getWeapon().rampageSlots === 0 && $('#weaponRampage0').val() === 'Elemental Exploit' && getHZ()[lower(getWeapon().eleType)] >= 25
			? 1.3
			: (power.PEM *= getWeapon().rampageSlots !== 0 && $('#weaponRampage0').val() === 'Element Exploit' && getHZ()[lower(getWeapon().eleType)] >= 25 ? 1.15 : 1);
	power.augPEM = $('#weaponRampage0').val() === 'Valstrax Soul' && power.eleType === 'Dragon' ? 1.2 : power.augPEM;
	// applies Dulling Strike to Base raw depending on sharpness and if selected
	[power.augEFR, power.augPRM] = $('#weaponRampage0').val() === 'Dulling Strike' && Sharpness.selectedIndex < 5 ? [1.02, 1.2] : [power.augEFR, power.augPRM];
	// applies Bludgeoner to Base raw depending on sharpness and selectedIndex

	if (Sharpness.selectedIndex > 0) {
		power.BRM *= Bludgeoner.selectedIndex === 1 && Sharpness.selectedIndex < 4 ? [1.05] : [1];
		power.BRM *= Bludgeoner.selectedIndex === 2 && Sharpness.selectedIndex < 4 ? [1.1] : [1];
		power.BRM *= Bludgeoner.selectedIndex === 3 && Sharpness.selectedIndex < 5 ? [1.1] : [1];
	}
	// applies sharpnessModifier to sever and blunt type attacks that use at least one hit of sharpness. This makes sure attacks like tackle or Bow skills don't get a sharpness modifier.

	const sharpnessModifier = [];
	[sharpnessModifier.PRM, sharpnessModifier.PEM] = power.noSharpMod === false ? [JSON.parse(Sharpness.value).PRM, JSON.parse(Sharpness.value).PEM] : [1, 1];
	power.PRM *=
		~~(0.1 + 25 / sharpnessModifier.PRM) >= info.monster.hzv[$('#dropMonster').val()][dropHZ.selectedIndex][power.type]
			? JSON.parse(document.getElementById([`MindsEye`]).value).PRM
			: 1;
	power.critBoost = power.Crit === true ? JSON.parse($('#CriticalBoost').val()).PRM : 1;

	power.efrMulti = 1 + (power.critBoost - 1) * power.aff;

	/*
	 * Brutal Strike
	 * Converts -Aff to a positive then * chance to proc * dmg modifier then
	 * adds the -dps to the +dps gain to find overall dps difference
	 */

	if (getWeapon().rampageSlots === 0 && $('#weaponRampage0').val() === 'Brutal Strike' && power.aff < 0) {
		power.efrMulti = 1 + power.aff * -1 * 0.2 * 1.5 - power.aff * -1 * 0.8 * 0.75;
		power.critBoost = 1.5;
	} else if (getWeapon().rampageSlots !== 0 && $('#weaponRampage0').val() === 'Brutal Strike' && power.aff < 0) {
		power.efrMulti = 1 + power.aff * -1 * 0.25 * 2 - power.aff * -1 * 0.75 * 0.75;
		power.critBoost = 1.5;
	}
	power.eleCritBoost = power.Crit === true ? JSON.parse($('#CriticalElement').val()).PEM : 1;

	return { ...power };
}

function DamageCalculations(power) {
	if (power.Crit === false) {
		[power.critBoost, power.eleCritBoost] = [1, 1];
	}
	if (power.Raw === false) {
		[power.raw, power.rawNon, power.efr, power.rawCrit] = [0, 0, 0, 0];
	} else {
		power.raw = Math.min(power.baseRaw * power.BRM + power.BR, 2600);
		const rawFormula = (power.raw * power.PRM * power.rawHZV * power.enrage * power.rawMV) / 10000;
		power.rawNon = rawFormula * power.augPRM * JSON.parse(Marksman.value)[0];
		power.efr = rawFormula * power.efrMulti * power.augEFR * JSON.parse(Marksman.value)[1];
		power.rawCrit = rawFormula * power.critBoost * power.augPRM * JSON.parse(Marksman.value)[0];
	}
	power.eleAmmo =
		power.Ele === false ? 0 : /BowGun/.test($('#dropWeaponType').val()) && /(Ice|Fire|Water|Dragon|Thunder)/.test(power.eleType) ? 1 + power.raw / 100 : 1;
	power.ele = power.Ele === false ? 0 : Math.min(power.baseEle * power.BEM + power.BE, 365) * power.eleAmmo;
	power.efeMulti = power.Ele === false ? 0 : 1 + (power.eleCritBoost - 1) * power.aff;
	const eleFormula =
		power.NoEleBuff === true ? power.baseEle : power.Ele === false ? 0 : power.ele * power.PEM * (power.eleHZV / 100) * power.enrage * power.eleMV * power.augPEM;

	power.eleNon = power.NoEleBuff === true ? power.baseEle : power.Ele === false ? 0 : eleFormula > 0 && eleFormula < 1 ? 1 : ~~(0.1 + eleFormula);
	power.efe =
		power.NoEleBuff === true
			? power.baseEle
			: power.Ele === false
			? 0
			: eleFormula * power.efeMulti > 0 && eleFormula * power.efeMulti < 1
			? 1
			: ~~(0.1 + eleFormula * power.efeMulti);
	power.eleCrit =
		power.NoEleBuff === true
			? power.baseEle
			: power.Ele === false
			? 0
			: eleFormula * power.eleCritBoost > 0 && eleFormula * power.eleCritBoost < 1
			? 1
			: ~~(0.1 + eleFormula * power.eleCritBoost);

	return { ...power };
}
function BowComboDamage() {
	/*
	 * for each combo input > 0 takes the damage listed for that skill * the number entered into the input field
	 * += for every skill used then updates the Combo Damage field
	 */
	const tableCell = ['c', 'd', 'e', 'f', 'g', 'h', 'i'];
	let comboDamage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$('.inputs').each(function (index, input) {
		let eachAttacksDamage = [];
		if (input.value > 0) {
			$(tableCell).each(function (index, letter) {
				eachAttacksDamage = eachAttacksDamage.concat(`${$(`#${[letter + input.id]}`).text()}`.match(/\d+/g));
			});
			eachAttacksDamage = eachAttacksDamage.map(damage => +damage * input.value * $('.inputComboRepeat ').val());
			$(eachAttacksDamage).each(function (index) {
				comboDamage[index] += +eachAttacksDamage[index];
			});
		}
	});

	return comboDamage;
}

function sharpnessReduction(reduction) {
	let total = 0;
	let hits = 1;
	while (hits >= 0.0001) {
		total += hits;
		hits *= reduction;
	}
	return total / 1 + 0.001;
}
function GunlanceShelling(currentDamage, comboDamage, power) {
	let regex = new RegExp(`${getWeapon().shellingType} ${getWeapon().shellingLevel}`);
	let Raw = 1;
	let EFR = 1;
	$(Object.entries(getAttacks()).filter(attack => regex.test(attack))).each(function (index) {
		Raw = ~~(this[1].rawMV * JSON.parse(Bombardier.value)[0] * JSON.parse(Artillery.value).BRM);
		EFR = ~~(this[1].rawMV * JSON.parse(Bombardier.value)[1] * JSON.parse(Artillery.value).BRM);
		const final = [
			'replaceME',
			this[0],
			0,
			`${Raw} / ${Raw}`,
			`${this[1].baseEle} / ${this[1].baseEle}`,
			`${(Raw + this[1].baseEle) * (this[1].ticsPer + 1)} / ${(Raw + this[1].baseEle) * (this[1].ticsPer + 1)}`,
			EFR,
			this[1].baseEle,
			(EFR + this[1].baseEle) * (this[1].ticsPer + 1),
		];
		currentDamage.push(final);
		comboDamage[0] += 0;
		comboDamage[1] += Raw * TimesUsed(index + 28);
		comboDamage[2] += Raw * TimesUsed(index + 28);
		comboDamage[3] += this[1].baseEle * TimesUsed(index + 28);
		comboDamage[4] += this[1].baseEle * TimesUsed(index + 28);
		comboDamage[5] += (Raw + this[1].baseEle) * (power.ticsPer + 1) * TimesUsed(index + 28);
		comboDamage[6] += (Raw + this[1].baseEle) * (power.ticsPer + 1) * TimesUsed(index + 28);
		comboDamage[7] += EFR * TimesUsed(index + 28);
		comboDamage[8] += this[1].baseEle * TimesUsed(index + 28);
		comboDamage[9] += (EFR + this[1].baseEle) * (power.ticsPer + 1) * TimesUsed(index + 28);
	});
	if (!/Inputs/.test(window.event.target.className)) {
		BuildDamageTable(currentDamage, 'dps');
	}
	c0.innerHTML = `${[comboDamage[0]]}`;
	d0.innerHTML = `${[comboDamage[1]]} / ${[comboDamage[2]]}`;
	e0.innerHTML = `${[comboDamage[3]]} / ${[comboDamage[4]]}`;
	f0.innerHTML = `${comboDamage[5]} / ${comboDamage[6]}`;
	g0.innerHTML = `${[comboDamage[7]]}`;
	h0.innerHTML = `${[comboDamage[8]]}`;
	i0.innerHTML = `${comboDamage[9]}`;
}

function BuildDamageTable(myDamage, id) {
	const currentAmmoTableStyle = ammoTable.style.display;
	const currentDamageTableStyle = dpsTable.style.display;
	const inputs = /gray/.test(filterCombo.className) ? document.querySelectorAll('.a') : document.querySelectorAll('.a:not(.gray)');
	let k = 0;
	const myHeader = document.querySelector(`#${id}Head`);
	const myBody = document.querySelector(`#${id}Body`);
	const table = document.createElement('table');
	const tHead = document.createElement('thead');
	const headerRow = document.createElement('tr');
	const tBody = document.createElement('tbody');

	const myHeaders = myDamage.splice(0, 1);
	myHeaders[0].forEach(headerText => {
		const header = document.createElement('th');
		const textNode = document.createTextNode(headerText);

		header.appendChild(textNode);
		headerRow.appendChild(header);
	});

	tHead.appendChild(headerRow);
	myHeader.replaceWith(tHead);
	myDamage.forEach(attack => {
		const row = document.createElement('tr');

		Object.values(attack).forEach(text => {
			if (text === 'replaceME') {
				if (
					$(previousWeaponType).val() === $(weaponType).val() &&
					inputs.length > 0 &&
					window.event.target.id !== 'BowChargePlus' &&
					(($(weaponType).val() === 'Bow' && previousWeapon.value === dropWeapon.value) || $(weaponType).val() !== 'Bow')
				) {
					row.appendChild(inputs[k]);
					++k;
				} else {
					const cell = document.createElement('td');
					const adjuster = document.createElement('input');

					adjuster.setAttribute('type', 'Number');
					adjuster.setAttribute('class', `Combo skill, k`);
					adjuster.setAttribute('Max', 20);
					if ($(weaponType).val() === 'Bow' && previousWeapon.value !== dropWeapon.value) {
						comboTracker = [];
						UpdateComboDisplay();
					}
					if (k === 0) {
						adjuster.setAttribute('id', 'inputComboRepeat');
						adjuster.setAttribute('Min', 1);
						adjuster.setAttribute('value', 1);
						adjuster.setAttribute('class', 'inputComboRepeat hitsOfSharpInputs inputs');
					} else {
						adjuster.setAttribute('id', k);
						adjuster.setAttribute('class', 'inputs hitsOfSharpInputs');
						adjuster.setAttribute('Min', 0);
						adjuster.setAttribute('value', 0);
					}
					++k;
					adjuster.setAttribute('onChange', 'DataCompile()');
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
	tBody.className = /(BowGun)/.test($('#dropWeaponType').val()) ? 'rangedTable' : 'meleeTable';
	damageTable.className = /(BowGun)/.test($('#dropWeaponType').val()) ? 'rangedContainer' : 'meleeContainer';

	ammoTable.style.display = currentAmmoTableStyle;
	dpsTable.style.display = currentDamageTableStyle;

	if (id !== 'stats' && id !== 'ammo') {
		const [len, ...column] = /BowGun/.test($('#dropWeaponType').val())
			? [k, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
			: [k, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

		if (/BowGun/.test($(weaponType).val()) && !/BowGun/.test($(previousWeaponType).val())) {
			$('#comboCountContainer').hide();
		} else if (!/BowGun/.test($(weaponType).val()) && /BowGun/.test($(previousWeaponType).val())) {
			$('#comboCountContainer').show();
		}
		$('#previousWeapon').val($('#dropWeapon').val());
		$('#previousWeaponType').val($('#dropWeaponType').val());
		for (let i = 0; i < len; ++i) {
			let j = 0;
			column.forEach(letter => {
				$(`#${id}Body`)[0].children[i].children[j].id = letter + i;
				$(`#${id}Body`)[0].children[i].children[j].className = `${letter} ${i}`;
				++j;
			});
		}

		if (!/BowGun/.test($(weaponType).val())) {
			$(`tbody#${id}Body>tr>td:nth-child(2)`).each(function (index, element) {
				const cell = document.createElement('td');
				cell.innerHTML = `<button type="button" aria-pressed="false" id="${index}" class="inputButton dec"
				onclick="DecreaseComboCount(); DataCompile();">&#8681</button><button type="button" aria-pressed="false" id="${index}" class="inputButton inc" onclick="IncreaseComboCount(); DataCompile();">&#8679</button><output id="label">${element.textContent}</output>`;
				$(cell).addClass(`b ${index} inputContainer`);
				cell.id = `b${index}`;
				this.replaceWith(cell);
			});
		}
	}
	if (/blue/.test(filterCombo.className)) {
		$('.a').each(function (index) {
			if ($(`.${index}`)[0].style.display === 'none') {
				$(`.${index}`).hide();
			}
		});
	}
}
function MonChart() {
	if (Object.prototype.hasOwnProperty.call(info, 'monster')) {
		const headers = [`Spawn Area ${info.quest[dropQuest.value].spawn}`, 'Sever', 'Blunt', 'Shot', 'Fire', 'Water', 'Thunder', 'Ice', 'Dragon'];
		const table = document.createElement('table');
		const myTable = document.querySelector('#monTable');
		const headerRow = document.createElement('tr');

		headers.forEach(headerText => {
			const header = document.createElement('th');
			const textNode = document.createTextNode(headerText);
			header.appendChild(textNode);
			headerRow.appendChild(header);
		});

		table.appendChild(headerRow);

		Object.entries(info.monster.hzv[dropMonster.value]).forEach(element => {
			const row = document.createElement('tr');
			let HZV = [`${element[1].part} ${element[1].state}`].concat(Object.values(element[1]).splice(3, 8));

			for (let j = 0; j < 9; ++j) {
				const cell = document.createElement('td');
				// adds demon ammo and water blight to displayed HZV
				if (j !== 0) {
					HZV[j] = $(WaterBlight).hasClass('blue') && /1|2|3/.test(j) ? Math.min(100, ~~(Math.max(HZV[j], HZV[j] * 0.63 + 22.2) + 3)) : HZV[j];

					if (HZV[j] < 14) {
						cell.setAttribute('class', 'F');
					} else if (HZV[j] < 15) {
						cell.setAttribute('class', 'C');
					} else if (HZV[j] < 45) {
						cell.setAttribute('class', 'B');
					} else if (HZV[j] < 65) {
						cell.setAttribute('class', 'A');
					} else if (HZV[j] >= 65) {
						cell.setAttribute('class', 'S');
					}
					HZV[j] = ~~HZV[j];
				}
				const textNode = document.createTextNode(HZV[j]);
				cell.appendChild(textNode);
				row.appendChild(cell);
			}
			table.appendChild(row);
		});
		table.setAttribute('id', 'monTable');
		myTable.replaceWith(table);
	}
}
function classChange() {
	if (Object.values(check).every(keyCard => keyCard)) {
		if (previousWeaponType.textContent !== '') {
			if ($(window).width() > 850) {
				setHeight();
			}
			ComboReset();
		}
		let ugh = [];
		if (weaponType.value === db) {
			ugh = [
				{ BRM: 1, BR: 0, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 5, PRM: 1, BEM: 1, BE: 5, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 10, PRM: 1, BEM: 1, BE: 6, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 12, PRM: 1, BEM: 1, BE: 8, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 15, PRM: 1, BEM: 1, BE: 12, PEM: 1, aff: 0 },
			];
		} else if (weaponType.value === bow) {
			ugh = [
				{ BRM: 1, BR: 0, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 5, PRM: 1, BEM: 1, BE: 5, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 8, PRM: 1, BEM: 1, BE: 6, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 9, PRM: 1, BEM: 1, BE: 8, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 10, PRM: 1, BEM: 1, BE: 10, PEM: 1, aff: 0 },
			];
		} else if (weaponType.value === lbg || weaponType.value === hbg) {
			ugh = [
				{ BRM: 1, BR: 0, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 5, PRM: 1, BEM: 1, BE: 5, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 8, PRM: 1, BEM: 1, BE: 6, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 9, PRM: 1, BEM: 1, BE: 7, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 10, PRM: 1, BEM: 1, BE: 8, PEM: 1, aff: 0 },
			];
		} else {
			ugh = [
				{ BRM: 1, BR: 0, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 5, PRM: 1, BEM: 1, BE: 5, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 10, PRM: 1, BEM: 1, BE: 8, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 12, PRM: 1, BEM: 1, BE: 10, PEM: 1, aff: 0 },
				{ BRM: 1, BR: 15, PRM: 1, BEM: 1, BE: 15, PEM: 1, aff: 0 },
			];
		}
		info.skills.ChainCrit = ugh;
		$(ugh).each(function (index) {
			ChainCrit[index].value = JSON.stringify(this);
		});
	}
	let bomb = [];
	if (weaponType.value === cb) {
		bomb = ['[1,1]', '[1.1,1.15]', '[1.15,1.15]', '[1.2,1.16]', '[1.25,1.17]'];
	} else if (weaponType.value === gl) {
		bomb = ['[1,1]', '[1.05,1.05]', '[1.1,1.1]', '[1.15,1.11]', '[1.2,1.12]'];
	} else if (weaponType.value === lbg || weaponType.value === hbg) {
		bomb = [
			'{"wyvern":[1,1,1],"sticky":[1,1,1]}',
			'{"wyvern":[1.1,1.1,1],"sticky":[1.1,1.1,1]}',
			'{"wyvern":[1.15,1.15,1],"sticky":[1.1,1.1,1]}',
			'{"wyvern":[1.20,1.16,1],"sticky":[1.2,1.16,1]}',
			'{"wyvern":[1.25,1.17,1.1],"sticky":[1.25,1.17,1.1]}',
		];
	}
	info.skills.Bombardier = bomb;
	$(bomb).each(function (index) {
		Bombardier[index].value = this;
	});

	$('.classSpecific').attr('selectedIndex', 0);
	$('.classSpecific').hide();
	$('.classSpecific').parent().hide();
	weaponId.innerHTML = '';
	weaponId.innerHTML = $('#dropWeaponType').val();
	$(`.${$(weaponType).val()}`).
		parent().
		show();
	$(`.${$(weaponType).val()}`).show();

	if (/Bow/.test($(weaponType).val())) {
		$('.Shot').parent().show();
		$('.Shot').show();
		$(ammoTable).hide();
		UniqueColumnsDisplay();
	} else {
		MeleeElements();
		UniqueColumnsDisplay();
	}
}
function MeleeElements() {
	$('.melee').parent().show();
	$('.melee').show();
	if ($('#dropWeaponType').val() === 'ChargeBlade') {
		if (getWeapon().phialType === 'Impact Phial') {
			impShieldCharge.parentNode.style = "display:''";
			eleShieldCharge.parentNode.style = 'display:none';
			eleShieldCharge.selectedIndex = 0;
		} else if (getWeapon().phialType === 'Element Phial') {
			impShieldCharge.parentNode.style = 'display:none';
			impShieldCharge.selectedIndex = 0;
			eleShieldCharge.parentNode.style = "display:''";
		}
	}
}
$(window).on('keypress', function (e) {
	keyDown = e.originalEvent.key === '-' ? ++keyDown : 0;
	if (keyDown === 3) {
		ResetAllSkills();
		DataCompile();
		keyDown = 0;
	}
});
// $(window).on('mousedown',function (e) {
// 	console.log(e)
// })
$(window).on('keypress', function (e) {
	keyUp = e.originalEvent.key === '+' ? ++keyUp : 0;
	if (keyUp === 3) {
		MaxSkills();
		DataCompile();
		keyUp = 0;
	}
});
function UniqueColumnsDisplay() {
	$('#unique')[0].style = /Bow/.test($(weaponType).val()) ? 'grid-template-columns:repeat(4, 1fr); grid-area: 9 / 1 / 10 / 6;' : 'grid-area: 8 / 3 / 9 / 4;';
	forButtons.style = /BowGun/.test($(weaponType).val()) ? 'grid-template-columns: repeat(10. 1fr)' : 'grid-template-columns: repeat(6, 1fr)';
}
function MaxSkills() {
	$('.skill').each(function (index, element) {
		this.selectedIndex = this.style.display === 'none' ? 0 : [this.options.length - 1];
	});
}
function ResetAllSkills(element = '.skill') {
	for (let i = 0; i < $(element).length; ++i) {
		$(element)[i].selectedIndex = 0;
	}
	$('button').each(function () {
		if (/blue/.test(this.className)) {
			$(this);
		}
	});
}
function ResetSkills(element = '.skill') {
	for (let i = 0; i < $(element).length; ++i) {
		$(element)[i].selectedIndex = 0;
	}
}
$(window).on('resize', function () {
	if ($(window).width() > 850) {
		setHeight();
		// } else {
		// for (let i = 0; i < 37; i++) {
		// const element = $('#raw').children('label')[i];
		// element.style = `width:${$('.thisWidth').width() * 1.05}px; max-width:${$('.thisWidth').width() * 1.05}px`
		// }
		// for (let i = 0; i < 37; i++) {
		// const element = $('#raw').children('div')[i];
		// element.style = `width:${$('.thisWidth').width() * 1.05}px; min-width:${$('.thisWidth').width() * 1.05}px; max-width:max-content`
		// }
		section1.style = `width:${$('.thisWidth').width() * 5.6}px; max-width:${$('.thisWidth').width() * 5.6}px`;
	}
});
$('#BowChargePlus').change(function () {
	ComboReset();
	UpdateComboDisplay();
});

$('.scroll').on('click', function () {
	scrollChange();
});
function scrollChange() {
	if (Object.values(check).every(keyCard => keyCard)) {
		$('.scroll').toggleClass('vis invis');
		info.skills.MailofHellfire = $(redScroll).hasClass('invis') ? info.skills.MailofHellfireSourse.blue : info.skills.MailofHellfireSourse.red;

		let newValues = $(redScroll).hasClass('invis')
			? [
					[{ BRM: 1, BR: 15, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 }, 'Lv-1'],
					[{ BRM: 1, BR: 20, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 }, 'Lv-2'],
					[{ BRM: 1, BR: 25, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 }, 'Lv-3'],
					[{ BRM: 1, BR: 20, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 }, 'Lv-1'],
					[{ BRM: 1, BR: 25, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 }, 'Lv-2'],
					[{ BRM: 1, BR: 30, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 }, 'Lv-3'],
					[{ BRM: 1, BR: 25, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 }, 'Lv-1'],
					[{ BRM: 1, BR: 30, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 }, 'Lv-2'],
					[{ BRM: 1, BR: 35, PRM: 1, BEM: 1, BE: 0, PEM: 1, aff: 0 }, 'Lv-3'],
			  ]
			: [
					[{ BRM: 1, BR: 15, PRM: 1, BEM: 1, BE: 5, PEM: 1, aff: 0 }, 'Lv-1'],
					[{ BRM: 1, BR: 20, PRM: 1, BEM: 1, BE: 8, PEM: 1, aff: 0 }, 'Lv-2'],
					[{ BRM: 1, BR: 25, PRM: 1, BEM: 1, BE: 12, PEM: 1, aff: 0 }, 'Lv-3'],
					[{ BRM: 1, BR: 20, PRM: 1, BEM: 1, BE: 7, PEM: 1, aff: 0 }, 'Lv-1'],
					[{ BRM: 1, BR: 25, PRM: 1, BEM: 1, BE: 12, PEM: 1, aff: 0 }, 'Lv-2'],
					[{ BRM: 1, BR: 30, PRM: 1, BEM: 1, BE: 15, PEM: 1, aff: 0 }, 'Lv-3'],
					[{ BRM: 1, BR: 25, PRM: 1, BEM: 1, BE: 10, PEM: 1, aff: 0 }, 'Lv-1'],
					[{ BRM: 1, BR: 30, PRM: 1, BEM: 1, BE: 15, PEM: 1, aff: 0 }, 'Lv-2'],
					[{ BRM: 1, BR: 35, PRM: 1, BEM: 1, BE: 20, PEM: 1, aff: 0 }, 'Lv-3'],
			  ];
		let index = 0;
		$('select#Dereliction').
			children().
			each(function () {
				$(this).
					children().
					each(function () {
						this.textContent = newValues[index][1];
						this.value = JSON.stringify(newValues[index][0]);
						++index;
					});
			});
	}
	DataCompile();
}

$('.toggle').on('click', function (e) {
	if (/DemonDrug/.test(e.target.id) && /gray/.test(e.target.className) && [DemonDrug.className, MegaDemonDrug.className].some(x => /blue/.test(x))) {
		$('#DemonDrug').toggleClass('gray blue');

		$('#MegaDemonDrug').toggleClass('gray blue');
	} else {
		$(e.target).toggleClass('gray blue');
	}
	if (this !== filterCombo) {
		DataCompile();
		MonChart();
	} else if (this === filterCombo) {
		FilterTableForComboAttacks();
	}
});

function ToggleAmmoTables() {
	dpsTable.style = dpsTable.style.display !== 'none' ? 'display:none' : "display:''";

	ammoTable.style = dpsTable.style.display !== 'none' ? 'display:none' : "display:''";
}
function calculateAmmoFrames(power, ammoID) {
	const ammo = {};
	ammo.ammoIncrease = info.ammo.AmmoUp[power.attackName][AmmoUp.selectedIndex];
	// converts to number to find frames used while staying within possible parameters
	ammo.recoilSpeed =
		info.ammo.recoil[power.attackName][
			Math.max(
				0,
				Math.min(
					5,
					power.recoil -
						RecoilDown.selectedIndex -
						(JSON.parse(BarrelId.value).Silencer > 0 ? TuneUp.selectedIndex - JSON.parse(BarrelId.value).Silencer : 0) +
						($(CriticalFirePower).hasClass('blue') ? 2 : 0),
				),
			)
		];
	ammo.recoilFrames = info.ammo.recoil.frames[ammo.recoilSpeed];
	ammo.reloadSpeed =
		info.ammo.reload[power.attackName][
			Math.max(
				0,
				Math.min(
					8,
					power.reload -
						2 -
						ReloadSpeed.selectedIndex -
						JSON.parse(BarrelId.value).reload -
						[BarrelId.options[BarrelId.selectedIndex].text === 'None' && TuneUp.selectedIndex > 0 ? 1 : 0][0],
				),
			)
		];
	ammo.reloadFrames = info.ammo.reload.frames[ammo.reloadSpeed];
	ammo.clipSize = power.clipSize[power.isUsed] + ammo.ammoIncrease;
	ammo.spareShot = +SpareShot.value + +spareAdjust.value;
	if (/(?<!snipe.*)explosion/.test(power.attackName) && Bombardier.selectedIndex > 0) {
		ammo.spareShot += JSON.parse(Bombardier.value)[lower(power.attackName).match(/sticky|wyvern/)[0]][2];
	}

	/*
			* finds time needed to shoot 100 shots as a base for calculations
			*                  ( (        actual shots consumed    times reloaded    for total frames spent reloading) + (total recoil frames) for total frames used / 30 frames for total second / 100 shots = seconds per shot)
				60 seconds / ( ( ( ( ( 100 shots-Spare Shot percent) / clip size -1 for inital clip) * frames per reload ) + (100 * recoil frames )) / 30 frames per second / 100 shots )
			*/

	let shotsPerTimeLimit = 60;
	ammo.shotsPerMinBase = shotsCheck(ammo.recoilFrames / 30, ammo.reloadFrames / 30, power.clipSize[power.isUsed], shotsPerTimeLimit);
	ammo.shotsPerMin = shotsCheck(ammo.recoilFrames / 30, ammo.reloadFrames / 30, ammo.clipSize, shotsPerTimeLimit, 100 / ammo.spareShot);
	ammo.shotsPerGain = `${Number.parseFloat((ammo.shotsPerMin / ammo.shotsPerMinBase - 1) * 100).toFixed(2)}%`;

	ammo.ticsAdjust = power.ticsPer + 1 > 0 ? Number(power.ticsPer + 1) : 1;
	// Reduces total damage from pierce attacks displayed depending on selection
	// top is for piercing attacks, bottom is for elemental piercing attacks(elemental pierce is reduced by a higher percentage)
	if (/Pierce Lv|Pierce [1-3]/.test(power.attackName)) {
		ammo.ticsAdjust = (power.ticsPer + 1) * JSON.parse(pierceAdjust.value)[0];
	} else if (/Pierc/.test(power.attackName)) {
		ammo.ticsAdjust = (power.ticsPer + 1) * JSON.parse(pierceAdjust.value)[1];
	}
	return ammo;
}

function ComboReset() {
	// resets the combo inputs to default values
	if (!/BowGun/.test($(previousWeaponType).val()) && $(previousWeaponType).val() !== '') {
		$('.comboHits').remove();
		$('.0:nth-child(n+ 3)').val(0);
		$('.inputs').val(0);
		$('.inputComboRepeat').val(1);
		comboTracker = [];
		DataCompile();
	}
}
function FilterTableForComboAttacks() {
	$('.inputs').each((index, element) => {
		if (/blue/.test(filterCombo.className) && (element.value === '0' || element.style === 'display: none;')) {
			$(`.${index}`).hide();
		} else {
			$(`.${index}`).show();
		}
	});
}

function TimesUsed(ID, arr = comboTracker) {
	return arr.filter(attackId => attackId == ID).length;
}

function IncreaseComboCount() {
	if ($('.inputs')[window.event.target.id].value !== '20') {
		++$('.inputs')[window.event.target.id].value;
	}
}
function DecreaseComboCount() {
	if (window.event.target.id === '0' && $('.inputs')[window.event.target.id].value !== '1') {
		--$('.inputs')[window.event.target.id].value;
	} else if (window.event.target.id !== '0' && $('.inputs')[window.event.target.id].value !== '0') {
		--$('.inputs')[window.event.target.id].value;
	}
}
function jsonsLoaded() {
	if (Object.values(check).every(keyCard => keyCard)) {
		WeaponTypeSelect();
		WeaponSelect();
		RampageSelect();
		MonsterSelect();
		PartSelect();
		QuestSelect();
		HealthSelect();
		MonChart();
		classChange();
		scrollChange();
		DataCompile();
		setHeight();
	}
}
function paste(event) {
	let pasteurl = (event.clipboardData || window.clipboardData).getData('text');
	decodeURL(pasteurl);
	$(taWikiSetBuilder).text(document.createTextNode('Paste TA Wiki Set Builder Link Here'));
	DataCompile();
}
function decodeURL(url = taWikiSetBuilder.value) {
	if (/mhrise\.wiki-db\.com/.test(url)) {
		let decode = decodeURIComponent(url);
		let skills = decode.match('(?<=skills=)(.*?)(?=&)')[0].split(',');
		ResetSkills(document.querySelectorAll(`.thisSkill:not(.${$(weaponType).val()})`));
		$.each(skills, function (index, value) {
			let thisSkill = value.split('Lv');
			thisSkill[0] = thisSkill[0].replace(/(\s)|(\/)/g, '');
			thisSkill[0] = thisSkill[0].replace(/'s/g, 's');
			thisSkill[0] = /Fire|Water|Wind|Ice|Dragon/.test(thisSkill[0]) ? 'ElementalAttack' : thisSkill[0];
			thisSkill[0] = /Kush|Teos|Storm|Thunder|Wind/.test(thisSkill[0]) ? 'ElderEssence' : thisSkill[0];
			if (document.querySelector(`#${thisSkill[0]}`) !== null && document.querySelector(`#${thisSkill[0]}`).style.display !== 'none') {
				document.querySelector(`#${thisSkill[0]}`).selectedIndex = thisSkill[1];
			}
		});
	} else if (JSON.parse(url).length === 4) {
		loadState(url);
	}
}
function resetWikiText() {
	$('input#taWikiSetBuilder')[0].value = '';
	$('input#taWikiSetBuilder')[0].value = 'Paste TA Wiki Set Builder Link Here';
}

function PopulateDropDowns(json, dropDown) {
	$(dropDown).empty();
	$.each(json, (key, value) => {
		$(dropDown).append($('<option></option>').attr('value', value).text(value));
	});
	return;
}

function WeaponTypeSelect() {
	PopulateDropDowns(weaponTypes, weaponType);
}

function WeaponSelect() {
	$(dropWeapon).empty();
	$(info[$(weaponType).val()].weapons).each((index, weapon) => {
		$('#dropWeapon').append($('<option></option>').attr('value', index).text(weapon.weapon));
	});
}
function RampageSelect() {
	$(weaponRampage.children).hide();
	$(weaponRampage0).show();
	if (getWeapon().rampageSlots !== 0) {
		let usableDecos = [];
		$(Object.keys(info.rampage.rampageDecos)).each(function (index, element) {
			// element == this
			let deco = element;
			if (+deco.slice(-1) <= getWeapon().rampageSlots) {
				usableDecos.push(info.rampage.rampageDecos[deco]);
			}
		});
		PopulateDropDowns(usableDecos, weaponRampage0);
	} else {
		$(weaponRampage.children).html('');
		$(weaponRampage.children).hide();
		$(weaponRampage0).show();
		if (/Rampage/.test(getWeapon().weapon)) {
			$(info.rampage[getWeapon().weapon].Rampage).each(function (index, rampageSection) {
				$(weaponRampage.children[index]).show();
				PopulateDropDowns(Object.values(this), weaponRampage.children[index]);
			});
		} else {
			$(getWeapon().rampage).each(function (index, rampageSkill) {
				$(weaponRampage0).append($('<option></option>').attr('value', info.rampage.keys2[this]).text(info.rampage.keys2[this]));
			});
		}
	}
}

function MonsterSelect() {
	PopulateDropDowns(Object.keys(info.monster.hzv), dropMonster);
	dropMonster.selectedIndex = Object.keys(info.monster.hzv).indexOf('Toadversary');
}
function getHZ(part = dropHZ.value.slice(-1) === ' ' ? dropHZ.value.slice(0, dropHZ.value.length - 1) : dropHZ.value) {
	return info.monster.hzv[dropMonster.value].filter(hitzone => hitzone.part === part)[0];
}

function getAttacks() {
	let attacks = { ...info[weaponType.value].attacks };

	return { ...attacks };
}
function getWeapon() {
	let weapon = { ...info[weaponType.value].weapons[dropWeapon.value] };
	return { ...weapon };
}

function PartSelect() {
	let parts = [];
	info.monster.hzv[dropMonster.value].forEach(hitzone => {
		parts.push([`${hitzone.part} ${hitzone.state}`]);
	});
	PopulateDropDowns(parts, dropHZ);
}

function QuestSelect() {
	$('#HR').empty();
	$('#MR').empty();
	$('#dropQuest').empty();
	let questMR = Object.entries(info.quest).filter(x => x[1].monster === dropMonster.value && x[1].rank === 'MR');
	let questHR = Object.entries(info.quest).filter(x => x[1].monster === dropMonster.value && x[1].rank === 'HR');
	questHR.forEach(quest => {
		$('#HR').append($('<option></option>').attr('value', quest[0]).text(quest[1].quest));
	});
	questMR.forEach(quest => {
		$('#MR').append($('<option></option>').attr('value', quest[0]).text(quest[1].quest));
	});
	if (questMR.length > 0) {
		$('#dropQuest').append($('<option></option>').attr('value', questMR[0][0]).text(questMR[0][1].quest));
	} else {
		$('#dropQuest').append($('<option></option>').attr('value', questHR[0][0]).text(questHR[0][1].quest));
		$('#MR').hide();
	}
	('select#dropQuest>option');
}
function HealthSelect() {
	$(health).empty();
	$.each(getHealthPools(), (key, value) => {
		$(health).append($('<option></option>').attr('value', value).text(value));
	});
}
// $('div.menu>select.players>option').on("click",function (e) {
// PopulateDropDowns([event.target.value], $('#players'));
// $('div.menu').hide();
// });
// function showHideMenu() {
// $('#1pHealth');
// $('.menu')[0].style.display == 'none' ? $('.menu').show() : $('.menu').hide();
// }
function emptyContainer(event) {
	if ($(event.target).val() == 'Paste TA Wiki Set Builder Link Here') {
		$(event.target).val('');
	}
}
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}
// $(document).ready(function () {
// var touch = $('#resp-menu');
// var menu = $('.menu');
//
// $(touch).on('click', function (e) {
// e.preventDefault();
// menu.slideToggle();
// });

// $(window).resize(function () {
// var w = $(window).width();
// if (w > 767 && menu.is(':hidden')) {
// menu.removeAttr('style');
// }
// });
// 1;
// });
function showMenu() {
	$('.menu').show();
	document.querySelector('#MR').children.length > 0 ? $('#divMR').show() : $('#divMR').hide();
	if (document.querySelector('#HR').children.length > 0) {
		$('#divHR').show();
		$('div.menu').css('top', '-46%');
	}
	if (document.querySelector('#HR').children.length === 0) {
		$('#divHR').hide();
		$('div.menu').css('top', '-93%');
	}
}
// function updateDereliction(e) {
// let ugh = document.createElement('option');
// $('select#dropDereliction').children()[0].outerHTML = e.target[e.target.selectedIndex].outerHTML;
// $('div#scrollDiv').hide();
// DataCompile();
// }

function updateQuest(event) {
	let ugh = document.createElement('option');
	$('select#dropQuest').children()[0].outerHTML = window.event.path[0][window.event.path[0].selectedIndex].outerHTML;
	$('div.menu').hide();
	DataCompile();
}
// $(document).on('click', function (event) {
// var $target = $(event.target);
// if (
// !$target.closest(DerelictionButton).length &&
// !$target.closest('.derelictionMenu').length &&
// !$target.closest(dropDereliction).length &&
// $('#scrollDiv').is(':visible')
// ) {
// $('#scrollDiv').hide();
// }
// });

$(document).on('click', function (event) {
	var $target = $(event.target);
	if (!$target.closest(questButton).length && !$target.closest('.menu').length && !$target.closest(dropQuest).length && $('.menu').is(':visible')) {
		$('.menu').hide();
	}
});
function capital(str) {
	return str[0].toUpperCase() + str.slice(1);
}
function lower(str) {
	return str[0].toLowerCase() + str.slice(1);
}
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

function getHealthPools() {
	const healthMod =
		~~(0.1 + info.quest[dropQuest.value][players.value] * ((info.quest[dropQuest.value].min / info.quest[dropQuest.value]['1p'] - 1) * -1)) /
		info.quest[dropQuest.value].HPScale;
	let healthPool = [info.quest[dropQuest.value][$('#players').val()]];
	if (info.quest[dropQuest.value].HPScale === 0) {
		return healthPool;
	} else if (info.quest[dropQuest.value].HPScale === 1) {
		healthPool = [[healthPool[0] - healthMod], [healthPool[0]], [healthPool[0] + healthMod]];

		return healthPool;
	} else {
		healthPool = [[healthPool[0] - healthMod * 2], [healthPool[0] - healthMod], [healthPool[0]], [healthPool[0] + healthMod], [healthPool[0] + healthMod * 2]];

		return healthPool;
	}
}
function json(arr) {
	let headers = arr.splice(0, 1);
	let newjson = {};
	let i = 0;
	let ugh = [];
	let check = '';
	arr.forEach(function (part, index) {
		if (check !== '' && check !== part[0]) {
			newjson[arr[index - 1][0]] = ugh;

			ugh = [];
			i = 0;
		}
		ugh[i] = {};
		$(part).each(function (index, element) {
			if (index > 0) {
				if (/[1-9]/.test(element)) {
					ugh[i][headers[0][index]] = Number(element);
				} else {
					ugh[i][headers[0][index]] = element;
				}
			}
		});
		++i;
		check = part[0];
	});
	console.log(newjson);
}
function setHeight() {
	const height =
		+$(section1).
			css('row-gap').
			match(/\d.\d+?/)[0] *
			4 +
		$('.title').height() +
		$(boxes).height() +
		$(weaponSelect).height() +
		$(raw).height();
	$('#section2').height(height);
	// $('#section2').width($('#damageTable').width());
	$('#monTableContainer').height(height * 0.2);
	// $('#monTableContainer').width($('#damageTable').width());
	$('#damageTable').height(height * 0.59);
	$(comboCountContainer).css('height', +getComputedStyle(document.querySelector('#section2')).height.match(/\d.\d+?/)[0]);
	$('#monDropDowns').height($('#dropHeight').height());
	// for (let i = 0; i < 37; i++) {
	// const selects = $('#raw>').children('select')[i];
	// selects.style = `width:${$('.thisWidth').width() * 1.05}px`
	// const labels = $('#raw>').children('label')[i];
	// // labels.style = `width:${$('.thisWidth').width() * 1.05}px; max-width:${$('.thisWidth').width() * 1.05}px;min-width:${$('.thisWidth').width() * 1.05}px`
	// const divs = $('#raw').children('div:not(#derelictionMenu)')[i];
	// divs.style = `width:${$('.thisWidth').width() * 1.05}px; min-width:${$('.thisWidth').width() * 1.05}px; max-width:max-content`
	// }
	// }
	section1.style = `width:${$('.thisWidth').width() * 5.4}px; max-width:${$('.thisWidth').width() * 5.4}px`;
}
function saveState() {
	let ugh = [[], [], [], []];

	$('select').each(function (index, element) {
		ugh[0].push($(this)[0].selectedIndex);
	});
	$('button.skillButton').each(function (index, element) {
		ugh[1].push($(element).hasClass('blue'));
	});
	$('.inputs').each(function () {
		ugh[2].push(this.value);
	});
	ugh[3].push(comboTracker[0]);
	let copyText = document.createElement('input');
	copyText.setAttribute('value', JSON.stringify(ugh));
	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */
	navigator.clipboard.writeText(copyText.value);
	return ugh;
}
function loadState(ugh) {
	ugh = JSON.parse(ugh);

	comboTracker = ugh[3];
	let ugh2 = document.querySelectorAll('select');

	ugh2[0].selectedIndex = ugh[0][0];
	WeaponSelect();

	ugh2[3].selectedIndex = ugh[0][3];
	RampageSelect();
	$('select').each(function (index) {
		this.selectedIndex = ugh[0][index];
	});
	$('button.skillButton').each((index, element) => {
		if (ugh[1][index]) {
			$(element).toggleClass('blue gray');
		}
	});
	$('.inputs').each((index, input) => {
		input.value = ugh[2][index];
	});
	QuestSelect();
	PartSelect();
	HealthSelect();
	DataCompile();
	// $('input#taWikiSetBuilder')[0].value = '';
	// $('input#taWikiSetBuilder')[0].value = 'Paste TA Wiki Set Builder Link Here';
}
/**function getMenu() {
			if (Object.values(check).every(keyCard => keyCard)) {
				// $(weaponTypes).each(function (index, weaponType) {
				const weaponList = [];
				$(info.ChargeBlade.weapons).each (function (index, element) {
					weaponList.push(this.weapon);
				});
				let { ...myJSON } = weaponList;
				var myTarget = document.getElementById('target');
				myTarget.replaceWith(renderList(myJSON));
				//
				function renderList(obj) {
					// cosmetic utility function for capitalizing text
					function capitalize(str) {
						console.log(power,this);
	return str[0].toUpperCase() + str.slice(1);
					}
					// cosmetic utility for formatting the price
					// function formatPrice(str) {
					// if (parseFloat(str) < 1) result += '0';
					// console.log(power,this);
	return result + str;
					// }
					// for every level of our JSON object, we create a ul element
					var result = document.createElement('ul');
					// for every key in the object
					Object.values(myJSON).each(function (index, weapon) {


						// create a li element and create/add a capitalized copy of the key
						var list = document.createElement('li');
						var textnode = document.createTextNode(capitalize(weapon));
						list.appendChild(textnode);
						// if there's another level to the object, recursively call our function
						// this will create a new ul which we'll add after our text
						// if (typeof obj[key] === 'object') {
						list.appendChild(renderList(obj[weapon]));
						// } else {
						// otherwise it must be a price. add ': ' and the value to the text
						// textnode.textContent += ': ' + formatPrice(obj[key]);
						// }
						// add our completed li to the ul
						result.appendChild(list);
					}
					console.log(power,this);
	return result;
				}
			}
		}

		// weaps = [
		// ['GreatSword'],
		// ['SwitchAxe'],
		// ['ChargeBlade'],
		// ['InsectGlaive'],
		// ['HeavyBowGun'],
		//
		// ['SwordNShield'],
		// ['DualBlades'],
		// ['LongSword'],
		// ['Lance'],
		// ['HuntingHorn'],
		// ['Gunlance'],
		// ['Hammer'],
		// ];
		// i = 1;
		//
		// contain = document.createElement('ul');
		// $(contain).css('id:main-menu class:sm sm-blue');
		// $(weaps).each(function (index, element) {
		// thisWeapon = element;
		// catagories = document.createElement('ul');
		// ugh1 = document.createElement('li');
		// ugh1.innerHTML = `<a href="#">${thisWeapon}</a>`;
		// $(catagories).append(ugh1);
		// console.log(this);
		// ugh2 = [];
		// $(info.Hammer.weapons).each(function (index, element) {
		// ugh2 = document.createElement('li');
		// ugh2.innerHTML = `<a href="#">${element.weapon}</a>`;
		// $(catagories).append(ugh2);
		// });
		// console.log(catagories);
		// $(contain).append(catagories);
		// });
		//
		**/
// $(Object.entries(info.skills)).each(function () {
// $('select.skill').on('change', function resetSelectOptions(e) {});
// if (lastEvent !== e.target && lastEvent !== undefined && lastEvent !== dropDereliction) {
// 	if (lastEvent === MailofHellfire) {
// 		$('#MailofHellfire>optgroup').each(function (index, option) {
// 			$(this)
// 				.children()
// 				.each(function (index) {
// 					this.textContent = `Lv${index}`;
// 				});
// 		});
// 	} else {
// 		$(lastEvent.children).each(function (index) {
// 			this.textContent = index === 0 ? '---' : `Lv${index}`;
// 		});
// 		lastEvent='';
// 	}
// }

$(document).on('change', function (e) {
	if (Object.values($('select.skill')).some(x => x === e.target)) {
		if (lastEvent === Dereliction) {
			$('select#Dereliction').
				children().
				each(function () {
					$(this).
						children().
						each(function (index) {
							this.textContent = `Lv-${index + 1}`;
						});
				});
			Dereliction[0].text = '--- ';
			lastEvent = '';
		} else {
			$(e.target).
				children().
				each(function (index) {
					this.textContent = index === 0 ? '---' : `Lv${index}`;
				});
			lastEvent = '';
		}
	}
});

$(document).on('mousedown', function display(e) {
	// $(`#${e.target.id}`)[0].style = 'position:fixed';
	// if (lastEvent === 'done') {
	// 	lastEvent = '';
	// 	return;

	if (lastEvent !== '') {
		if (lastEvent === Dereliction) {
			$('select#Dereliction').
				children().
				each(function () {
					$(this).
						children().
						each(function (index) {
							this.textContent = `Lv-${index + 1}`;
						});
				});
			Dereliction[0].text = '--- ';
			lastEvent = '';
		} else {
			// $(`#${lastEvent.id}`)[0].style = 'position:fixed';
			$(lastEvent).
				children().
				each(function (index) {
					this.textContent = index === 0 ? '---' : `Lv-${index}`;
				});
			// $(`#${lastEvent}>option`).show();
			// $(`#${lastEvent.id}`)[0].style = 'position:unset';
			lastEvent = '';
		}
	}
	if (Object.values($('select.skill')).some(x => x.id === e.target.id)) {
		// $(`#${e.target.id}:focus`).hide();
		let ugh2 = e.target.id;
		if (ugh2 !== 'Dereliction') {
			$(info.skills[ugh2]).each(function (index) {
				let option;
				if (index !== 0) {
					if (ugh2 === 'RecoilDown' || ugh2 === 'ReloadSpeed') {
						option =/Reload/.test(ugh2)?ugh2.slice(0,6)+" "+ugh2.slice(6)+" +"+index: ugh2.slice(0,6)+" "+ugh2.slice(6)+" -"+index
					} else if(ugh2 === 'AmmoUp' || ugh2 === 'SpareShot') {
						let inc = ugh2 === 'AmmoUp' ? ['No Change','+1 Lvl 2 & Ele Ammo','+1 Lvl 3 & Dragon Ammo'] : ['Spare Shot +5%','Spare Shot +10%','Spare Shot +20%'];
						option=index+': '+inc[index-1]
					} else if (ugh2 === 'Marksman') {
						let inc = [
							[
								"Chance 20% Raw +5% EFR +1%"
							],
							[
								"Chance 20% Raw +10% EFR +2%"
							],
							[
								"Chance 60% Raw +5% EFR +3%"
							],
							[
								"Chance 40% Raw +10% EFR +4%"
							]
						];
		option=index+': '+inc[index-1]

					} else {
						let raw = '';
						if (this.BR > 0 || this.PRM > 1 || this.BRM > 1) {
							raw = 'Raw';
							if (this.BR > 0) {
								raw += ' +' + this.BR;
							}
							if (this.BRM > 1) {
								let brm = /\.[1-8]/.test((this.BRM - 1) * 100) ? ((this.BRM - 1) * 100).toFixed(1) : ((this.BRM - 1) * 100).toFixed(0);
								raw += ' +' + brm + '%';
							}
							if (this.PRM > 1) {
								let prm = /\.[1-8]/.test((this.PRM - 1) * 100) ? ((this.PRM - 1) * 100).toFixed(1) : ((this.PRM - 1) * 100).toFixed(0);
								raw += ugh2 === 'CriticalBoost' ? ` +${prm - 25}%` : ` +${prm}%`;
							}
						}
						let ele = '';
						if (this.BE > 0 || this.PEM > 1 || this.BEM > 1) {
							ele = 'Ele';
							if (this.BE > 0) {
								ele += ' +' + this.BE;
							}
							if (this.BEM > 1) {
								let bem = /\.[1-8]/.test((this.BEM - 1) * 100) ? ((this.BEM - 1) * 100).toFixed(1) : ((this.BEM - 1) * 100).toFixed(0);
								ele += ' +' + bem + '%';
							}
							if (this.PEM > 1) {
								let pem = /\.[1-8]/.test((this.PEM - 1) * 100) ? ((this.PEM - 1) * 100).toFixed(1) : ((this.PEM - 1) * 100).toFixed(0);
								ele += ' +' + pem + '%';
							}
						}
						const aff = this.aff > 0 ? 'Aff +' + this.aff + '%' : '';
						raw = Object.prototype.hasOwnProperty.call(this,'Sharp') && this.Sharp < 1 ? `Sharp +${this.Sharp * 100}%` : raw;
						raw = Object.prototype.hasOwnProperty.call(this,'Sharp') && this.Sharp > 1 ? `Sharp +${this.Sharp}` : raw;
						raw = raw === '' && ele === '' && aff === '' ? 'No Change' : raw;
						option = index + ': ' + [raw,ele,aff].join(' ');
					}
} else {
					option = ugh2;
				}
				$(`#${ugh2}`)[0][index].textContent = option;
			});
			lastEvent = e.target;
		} else if (e.target === Dereliction) {
			let text = $(redScroll).hasClass('invis')
				? [['1:Raw +15'], ['2:Raw +20'], ['3:Raw +25'], ['1:Raw +20'], ['2:Raw +25'], ['3:Raw +30'], ['1:Raw +25'], ['2:Raw +30'], ['3:Raw +35']]
				: [['1:Ele +5'], ['2:Ele +8'], ['3:Ele +12'], ['1:Ele +7'], ['2:Ele +12'], ['3:Ele +15'], ['1:Ele +10'], ['2:Ele +15'], ['3:Ele +20']];
			let index = 0;
			$('select#Dereliction').
				children().
				each(function () {
					$(this).
						children().
						each(function () {
							this.textContent = text[index];
							++index;
						});
				});
			Dereliction[0].textContent = 'Dereliction';
			lastEvent = e.target;
		} else if (
			(Object.values($('select.skill').children()).some(x => x.id === e.target.id) && e.target.children[0].textContent === e.target.id) ||
			!Object.values($('select.skill').children()).some(x => x.id === e.target.id || e.target)
		) {
			if (e.target === Dereliction) {
				$('select#Dereliction').
					children().
					each(function () {
						$(this).
							children().
							each(function (index) {
								this.textContent = `Lv-${index + 1}`;
							});
					});
				Dereliction[0].text = '--- ';
				lastEvent = '';
			}
			// if (lastEvent === MailofHellfire) {
			// $('#MailofHellfire>optgroup').each(function (index,option) {
			// $(this)
			// .children()
			// .each(function (index) {
			// this.textContent = index === 0 ? '---' : `Lv${index}`;
			// });
			// lastEvent = '';
			// });
		} else {
			$(e.target).
				children().
				each(function (index) {
					this.textContent = index === 0 ? '---' : `Lv-${index}`;
				});
			lastEvent = '';
		}
	}
});
// $(`#${e.target.id}`)[0].style = 'position:unset';
// });
// $('select.skill').on('change', function (e) {
// 	e.stopPropagation();
// 	resetOptions(e);
// });
// $(document).on('click', function (e) {
// 	e.stopPropagation();
// 	if (!e.target.closest(lastEvent).length) {
// 		resetOptions(e);
// 	}
// });
// function resetOptions(e) {
// 	if (Object.values(check).every(keyCard => keyCard) && e !== undefined) {
// 		if (e.type === 'click' && lastEvent === e.target) {
// 			return;
// 		}
// 		if (e.type === 'change' || (lastEvent !== e.target && lastEvent !== dropDereliction))
// 	}
// }
function getStats(power, skills) {
	$(skills).each(function (index, skill) {
		power.BRM *= skill.BRM;
		power.BR += skill.BR;
		power.PRM *= skill.PRM;
		power.BEM *= skill.BEM;
		power.BE += skill.BE;
		power.PEM *= skill.PEM;
		power.aff += skill.aff;
	});
	return power;
}

// function populateSelectOptions() {
// if (Object.values(check).every(keyCard => keyCard)) {
// $(Object.entries(info.skills)).each(function (index2) {
// let ugh2 = this[0];
// if (ugh2 !== 'dropDereliction' && ugh2 !== 'DangoMarksman') {
// let ugh15 = `<div><label for="${ugh2}">${ugh2}</label><select id="${ugh2}" name="${ugh2}" onchange="DataCompile()" class="skill">`;

// $(this[1]).each(function (index) {
// let option = '';
// if (index !== 0) {
// let raw = '';
// if (this.BR > 0 || this.PRM > 1 || this.BRM > 1) {
// raw = 'Raw';
// if (this.BR > 0) {
// raw += ' +' + this.BR;
// }
// if (this.BRM > 1) {
// let brm = /\.[1-8]/.test((this.BRM - 1) * 100) ? ((this.BRM - 1) * 100).toFixed(1) : ((this.BRM - 1) * 100).toFixed(0);
// raw += ' +' + brm + '%';
// }
// if (this.PRM > 1) {
// let prm = /\.[1-8]/.test((this.PRM - 1) * 100) ? ((this.PRM - 1) * 100).toFixed(1) : ((this.PRM - 1) * 100).toFixed(0);
// raw += ' +' + prm + '%';
// }
// }
// let ele = '';
// if (this.BE > 0 || this.PEM > 1 || this.BEM > 1) {
// ele = 'Ele';
// if (this.BE > 0) {
// ele += ' +' + this.BE;
// }
// if (this.BEM > 1) {
// let bem = /\.[1-8]/.test((this.BEM - 1) * 100) ? ((this.BEM - 1) * 100).toFixed(1) : ((this.BEM - 1) * 100).toFixed(0);
// ele += ' +' + bem + '%';
// }
// if (this.PEM > 1) {
// let pem = /\.[1-8]/.test((this.PEM - 1) * 100) ? ((this.PEM - 1) * 100).toFixed(1) : ((this.PEM - 1) * 100).toFixed(0);
// ele += ' +' + pem + '%';
// }
// }
// const aff = this.aff > 0 ? 'Aff +' + this.aff + '%' : '';
// raw = Object.prototype.hasOwnProperty.call(this, 'Sharp') && this.Sharp < 1 ? `Sharp +${this.Sharp * 100}%` : raw;
// raw = Object.prototype.hasOwnProperty.call(this, 'Sharp') && this.Sharp > 1 ? `Sharp +${this.Sharp}` : raw;
// raw = raw === '' && ele === '' && aff === '' ? 'No Change' : raw;
// option = index + ': ' + [raw, ele, aff].join(' ');
// } else {
// option = ugh2;
// }
// $(`#${ugh2}`)[0][index].textContent = option;
// });
// }
// });
// }
// }
// });
// if (ugh2 === 'MailofHellfire') {
// 			$(`#${ugh2}`)[0][0].textContent = 'MailofHellfire';
// 			$('#MailofHellfire>optgroup').each(function (index, option) {
// 				$(this)
// 					.children()
// 					.each(function (index) {
// 						let thisValue = JSON.parse(this.value);
// 						let newHTML = '';

// 						let raw = '';
// 						if (thisValue.BR > 0 || thisValue.PRM > 1 || thisValue.BRM > 1) {
// 							raw = 'Raw';
// 							if (thisValue.BR > 0) {
// 								raw += ' +' + thisValue.BR;
// 							}
// 							if (thisValue.BRM > 1) {
// 								let brm = /\.[1-8]/.test((thisValue.BRM - 1) * 100) ? ((thisValue.BRM - 1) * 100).toFixed(1) : ((thisValue.BRM - 1) * 100).toFixed(0);
// 								raw += ' +' + brm + '%';
// 							}
// 							if (thisValue.PRM > 1) {
// 								let prm = /\.[1-8]/.test((thisValue.PRM - 1) * 100) ? ((thisValue.PRM - 1) * 100).toFixed(1) : ((thisValue.PRM - 1) * 100).toFixed(0);
// 								raw += ' +' + prm + '%';
// 							}
// 						}
// 						let ele = '';
// 						if (thisValue.BE > 0 || thisValue.PEM > 1 || thisValue.BEM > 1) {
// 							ele = 'Ele';
// 							if (thisValue.BE > 0) {
// 								ele += ' +' + thisValue.BE;
// 							}
// 							if (thisValue.BEM > 1) {
// 								let bem = /\.[1-8]/.test((thisValue.BEM - 1) * 100) ? ((thisValue.BEM - 1) * 100).toFixed(1) : ((thisValue.BEM - 1) * 100).toFixed(0);
// 								ele += ' +' + bem + '%';
// 							}
// 							if (thisValue.PEM > 1) {
// 								let pem = /\.[1-8]/.test((thisValue.PEM - 1) * 100) ? ((thisValue.PEM - 1) * 100).toFixed(1) : ((thisValue.PEM - 1) * 100).toFixed(0);
// 								ele += ' +' + pem + '%';
// 							}
// 						}
// 						const aff = thisValue.aff > 0 ? 'Aff +' + thisValue.aff + '%' : '';
// 						raw = Object.prototype.hasOwnProperty.call(thisValue, 'Sharp') && thisValue.Sharp < 1 ? `Sharp +${thisValue.Sharp * 100}%` : raw;
// 						raw = Object.prototype.hasOwnProperty.call(thisValue, 'Sharp') && thisValue.Sharp > 1 ? `Sharp +${thisValue.Sharp}` : raw;
// 						raw = raw === '' && ele === '' && aff === '' ? 'No Change' : raw;
// 						let text = raw !== '' ? raw : '';
// 						text = aff !== '' ? text.push(aff) : text;
// 						text = ele !== '' ? text.push(ele) : text;

// 						newHTML = index + ': ' + [raw, ele, aff].join(' ');

// 						this.textContent = newHTML;
// 					});
// 			});
// 			lastEvent = e.target;
// 		} else {
