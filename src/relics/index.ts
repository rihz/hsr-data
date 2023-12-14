import * as fs from 'fs';
import * as path from 'path';
import { cleanString, formatHsrString } from '../utils/string';
import { HsrDamageType } from '../models/damage';
import { HsrPath } from '../models/path';
import { downloadCharacterImages, downloadRelicImages } from '../utils/fileDownload';
import { HsrRelic, HsrRelicAbility, HsrRelicModel, HsrRelicPiece, HsrRelicType } from '../models/relic';
import { HsrStat } from '../models/stat';

interface ExtractedRelicAbility {
  useNum: number;
  desc: string;
  params: number[];
};

interface ExtractedRelicPieceAffix {
  propertyName: string;
  isPercent: boolean;
  baseValue: number;
  levelAdd: number;
  stepValue: number;
  maxStep: number;
};

interface ExtractedRelicPieceData {
  maxLevel: number;
  mainAffixes: ExtractedRelicPieceAffix[];
  subAffixes: ExtractedRelicPieceAffix[];
};

interface ExtractedRelicPiece {
  name: string;
  baseTypeText: HsrRelicType;
  iconPath: string;
  loreTitle: string;
  miniLore: string;
  lore: string;
  rarityData: { [key: string]: ExtractedRelicPieceData };
};

interface ExtractedRelic {
  name: string;
  skills: ExtractedRelicAbility[];
  pieces: { [key: string]: ExtractedRelicPiece };
};

const directory = path.resolve(__dirname, '../../raw_data/en/relics');

const extractAbilities = (relic: ExtractedRelic, cleanFamilyName: string): HsrRelicAbility[] => {
  const { skills } = relic;

  return skills.map((skill) => ({
    id: `${cleanFamilyName}_${skill.useNum}`,
    quantity: skill.useNum,
    description: formatHsrString(skill.desc, skill.params)
  }));
};

const formatPropertyName = (affix: ExtractedRelicPieceAffix): HsrStat => (affix.isPercent ? `${affix.propertyName.toLowerCase()}%` : affix.propertyName.toLowerCase()) as HsrStat;

const getStats = (relicRarityData: { [key: string]: ExtractedRelicPieceData }): {
  possibleMainStats: HsrStat[];
  possibleSubStats: HsrStat[];
} => {
  const firstIndex = Object.keys(relicRarityData)[0];
  const { mainAffixes, subAffixes } = relicRarityData[firstIndex];

  const possibleMainStats = mainAffixes.map((affix) => formatPropertyName(affix));
  const possibleSubStats = subAffixes.map((affix) => formatPropertyName(affix));

  return { possibleMainStats, possibleSubStats };
};

const extractRelicPieceInformation = (relic: ExtractedRelic): HsrRelicPiece[] => {
  const { pieces } = relic;

  return Object.keys(pieces).map((key: string) => {
    const { name, baseTypeText, rarityData, iconPath } = pieces[key];
    const cleanName = cleanString(name);
    const type = baseTypeText as HsrRelicType;
    const stats = getStats(rarityData);

    downloadRelicImages({
      iconPath,
      cleanName
    });

    return {
      name,
      cleanName,
      type,
      ...stats
    };
  });
}

export const etlRelics = async () => {
  const relics = fs.readdirSync(directory).map((filename) => {
    const json = require(`${directory}/${filename}`);

    return json;
  });
  const mongoOps: any[] = [];

  for (const relic of relics) {
    const { name: familyName } = relic;
    const cleanFamilyName = cleanString(familyName);
    const abilities = extractAbilities(relic, cleanFamilyName);
    const pieces = extractRelicPieceInformation(relic);

    pieces.forEach((piece: HsrRelicPiece) => {
      const etlRelic: HsrRelic = {
        ...piece,
        familyName,
        cleanFamilyName,
        abilities
      };

      mongoOps.push({
        updateOne: {
          filter: { cleanName: piece.cleanName },
          update: { $set: { ...etlRelic } },
          upsert: true
        }
      });
    });
  }

  await HsrRelicModel.bulkWrite(mongoOps);
}