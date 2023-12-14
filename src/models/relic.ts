import { Schema, model } from "mongoose";
import { HsrStat } from "./stat";

export enum HsrRelicType {
  Head = 'head',
  Hands = 'hands',
  Body = 'body',
  Feet = 'feet',
  PlanarSphere = 'planar_sphere',
  LinkRope = 'link_rope'
};

export interface HsrRelicAbility {
  id: string;
  quantity: number;
  description: string;
}

export interface HsrRelicPiece {
  name: string;
  cleanName: string;
  type: HsrRelicType;
  possibleMainStats: HsrStat[];
  possibleSubStats: HsrStat[];
}

export interface HsrRelic {
  name: string;
  familyName: string;
  cleanName: string;
  cleanFamilyName: string;
  abilities: HsrRelicAbility[];
  type: HsrRelicType;
  possibleMainStats: HsrStat[];
  possibleSubStats: HsrStat[];
}

const HsrRelicAbilitySchema = new Schema<HsrRelicAbility>({
  id: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true }
});
const HsrRelicSchema = new Schema<HsrRelic>({
  name: { type: String, required: true },
  cleanName: { type: String, required: true },
  familyName: { type: String, required: true },
  cleanFamilyName: { type: String, required: true },
  abilities: { type: [HsrRelicAbilitySchema], required: true },
  type: { type: String, required: true },
  possibleMainStats: { type: [String], required: true },
  possibleSubStats: { type: [String], required: true }
});

export const HsrRelicModel = model<HsrRelic>('relic', HsrRelicSchema);