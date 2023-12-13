import { Schema, model } from "mongoose";
import { HsrPath } from "./path";

export interface HsrLightConeStats {
  [key: number]: {
    atk: number;
    def: number;
    hp: number;
  }
}

export interface HsrLightConeAbility {
  name: string;
  cleanName: string;
  descriptions: { [key: number]: string };
}

export interface HsrLightCone {
  name: string;
  cleanName: string;
  rarity: number;
  description: string;
  path: HsrPath;
  stats: HsrLightConeStats;
  ability: HsrLightConeAbility;
}

const HsrLightConeAbilitySchema = new Schema<HsrLightConeAbility>({
  name: { type: String, required: true },
  cleanName: { type: String, required: true },
  descriptions: { type: Object, required: true }
});
const HsrLightConeSchema = new Schema<HsrLightCone>({
  name: { type: String, required: true },
  cleanName: { type: String, required: true },
  rarity: { type: Number, required: true },
  description: { type: String, required: true },
  path: { type: String, required: true },
  stats: { type: Object, required: true },
  ability: { type: HsrLightConeAbilitySchema, required: true }
});

export const HsrLightConeModel = model<HsrLightCone>('light_cone', HsrLightConeSchema);