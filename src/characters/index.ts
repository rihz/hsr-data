import * as fs from 'fs';
import * as path from 'path';
import { cleanString, formatHsrString } from '../utils/string';
import { HsrDamageType } from '../models/damage';
import { HsrPath } from '../models/path';
import { HsrCharacter, HsrCharacterAbility, HsrCharacterAbilityType, HsrCharacterEidolon, HsrCharacterModel } from '../models/character';
import { downloadCharacterImages } from '../utils/fileDownload';

const directory = path.resolve(__dirname, '../../raw_data/en/characters');

const extractEidolons = (character: any): HsrCharacterEidolon[] => {
  const { ranks } = character;
  const eidolons: HsrCharacterEidolon[] = [];
  
  ranks.forEach((eidolon: { id: any; name: any; descHash: any; params: any; }) => {
    const { id: rank, name, descHash, params } = eidolon;
    const cleanName = cleanString(name);
    const description = formatHsrString(descHash, params);

    eidolons.push({
      rank,
      name,
      cleanName,
      description
    });
  });

  return eidolons;
}

const extractAbilities = (character: any): HsrCharacterAbility[] => {
  const { skills } = character;
  const abilities: HsrCharacterAbility[] = [];

  skills.forEach((ability: { name: any; descHash: any; typeDescHash: any; levelData: [ { params: number[], level: number } ]; }) => {
    const { name, descHash, typeDescHash, levelData } = ability;
    const cleanName = cleanString(name);
    const type = typeDescHash as HsrCharacterAbilityType;
    const descriptions = levelData.reduce((prev, curr) => ({
      ...prev,
      [curr.level]: formatHsrString(descHash, curr.params)
    }), {});

    abilities.push({
      name,
      cleanName,
      descriptions,
      type
    });
  });

  return abilities;
}

export const etlCharacters = async () => {
  const characters = fs.readdirSync(directory).map((filename) => {
      const json = require(`${directory}/${filename}`);
  
      return json;
  });

  for (const character of characters) {
    const { name, rarity, damageType: dType, baseType } = character;
    const cleanName = cleanString(name);
    const damageType = dType.name as HsrDamageType;
    const path = baseType.name.toLowerCase().replace('The ', '') as HsrPath;
    const eidolons = extractEidolons(character);
    const abilities = extractAbilities(character);

    downloadCharacterImages(character, cleanName, false);

    const etlCharacter: HsrCharacter = {
      name,
      cleanName,
      rarity,
      damageType,
      path,
      eidolons,
      abilities
    };

    // Update this to a bulk write
    await HsrCharacterModel.findOneAndUpdate(
      { cleanName },
      etlCharacter,
      { upsert: true }
    );
  }
}