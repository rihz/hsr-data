import * as fs from 'fs';
import * as path from 'path';
import { cleanString, formatHsrString } from '../utils/string';
import { HsrPath } from '../models/path';
import { HsrLightCone, HsrLightConeAbility, HsrLightConeModel, HsrLightConeStats } from '../models/cone';
import { downloadLightConeImages } from '../utils/fileDownload';

const directory = path.resolve(__dirname, '../../raw_data/en/lightcones');
const MAX_LC_LEVEL = 80;

interface ExtractedLightConeLevelData { attackBase: number; hpBase: number; defenseBase: number; attackAdd: number; hpAdd: number; defenseAdd: number; maxLevel: number };
interface ExtractedLightConeSkill { name: string; descHash: string; levelData: { params: number[]; level: number; }[] };
interface ExtractedLightCone { skill: ExtractedLightConeSkill; levelData: ExtractedLightConeLevelData[] };

const extractAbility = (cone: ExtractedLightCone): HsrLightConeAbility => {
  const { skill } = cone;
  const { name, descHash, levelData } = skill;
  const cleanName = cleanString(name);
  const descriptions = levelData.reduce((prev, curr) => ({
    ...prev,
    [curr.level]: formatHsrString(descHash, curr.params)
  }), {});


  return {
    name,
    cleanName,
    descriptions
  };
}

const calculateLightConeStats = (cone: ExtractedLightCone): HsrLightConeStats => {
  const { levelData } = cone;
  let { attackBase: atk, hpBase: hp, defenseBase: def, attackAdd, hpAdd, defenseAdd } = levelData[0];
  let level = 2;
  let stats: HsrLightConeStats = {
    1: {
      atk,
      def,
      hp
    }
  };
  
  for (level; level < 20; level++) {
    stats[level] = {
      atk: atk + attackAdd,
      def: def + defenseAdd,
      hp: hp + hpAdd
    }
  }

  levelData.shift();
  levelData.forEach((data: ExtractedLightConeLevelData) => {
    const { attackBase, hpBase, defenseBase, attackAdd: atkAdd, hpAdd: hAdd, defenseAdd: defAdd, maxLevel } = data;

    if (attackAdd !== atkAdd) attackAdd = atkAdd;
    if (defenseAdd !== defAdd) defenseAdd = defAdd;
    if (hpAdd !== hAdd) hpAdd = hAdd;

    let baseAtk = attackBase + (attackAdd * (maxLevel - 1));
    let baseHp = hpBase + (hpAdd * (maxLevel - 1));
    let baseDef = defenseBase + (defenseAdd * (maxLevel - 1));

    stats[level] = {
      atk: baseAtk,
      def: baseDef,
      hp: baseHp
    };
    level++;

    const limit = maxLevel !== MAX_LC_LEVEL ? maxLevel : maxLevel + 1;
    for (level; level < limit; level++) {
      stats[level] = {
        atk: baseAtk += attackAdd,
        def: baseDef += defenseAdd,
        hp: baseHp += hpAdd
      }
    }
  });

  return stats;
}

export const etlLightCones = async () => {
  const cones = fs.readdirSync(directory).map((filename) => {
    const json = require(`${directory}/${filename}`);

    return json;
  });
  const mongoOps: any[] = [];

  for (const cone of cones) {
    const { name, rarity, descHash: description, baseType } = cone;
    const cleanName = cleanString(name);
    const path = baseType.name.toLowerCase().replace('The ', '') as HsrPath;
    const stats = calculateLightConeStats(cone);
    const ability = extractAbility(cone);

    downloadLightConeImages(cone, cleanName, true);

    const etlCone: HsrLightCone = {
      name,
      cleanName,
      description,
      rarity,
      path,
      stats,
      ability
    };

    mongoOps.push({
      updateOne: {
        filter: { cleanName },
        update: { $set: { etlCone } },
        upsert: true
      }
    });
  }

  await HsrLightConeModel.bulkWrite(mongoOps);
}