import { Schema, model } from 'mongoose';
import { HsrDamageType } from "./damage";
import { HsrPath } from "./path";

export const enum HsrCharacterAbilityType {
  Basic = 'basic atk',
  Skill = 'skill',
  Ultimate = 'ultimate',
  Talent = 'talent',
  Technique = 'technique'
};

export interface HsrCharacterEidolon {
  rank: number;
  name: string;
  cleanName: string;
  description: string;
}

export interface HsrCharacterAbility {
  descriptions: { [key: number]: string };
  name: string;
  cleanName: string;
  type: HsrCharacterAbilityType;
}

export interface HsrCharacter {
  name: string;
  cleanName: string;
  rarity: number;
  damageType: HsrDamageType;
  path: HsrPath;
  eidolons: HsrCharacterEidolon[];
  abilities: HsrCharacterAbility[];
}

const HsrCharacterEidolonSchema = new Schema<HsrCharacterEidolon>({
  rank: { type: Number, required: true },
  name: { type: String, required: true },
  cleanName: { type: String, required: true },
  description: { type: String, required: true }
});
const HsrCharacterAbilitySchema = new Schema<HsrCharacterAbility>({
  descriptions: { type: Object, required: true },
  name: { type: String, required: true },
  cleanName: { type: String, required: true },
  type: { type: String, required: true }
});
const HsrCharacterSchema = new Schema<HsrCharacter>({
  name: { type: String, required: true },
  cleanName: { type: String, required: true },
  rarity: { type: Number, required: true },
  damageType: { type: String, required: true },
  path: { type: String, required: true },
  eidolons: { type: [HsrCharacterEidolonSchema], required: true },
  abilities: { type: [HsrCharacterAbilitySchema], required: true }
});

export const HsrCharacterModel = model<HsrCharacter>('character', HsrCharacterSchema);