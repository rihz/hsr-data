import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { HsrDamageType, HsrPath } from '../models';

const baseUrl = 'https://cdn.starrailstation.com/assets';
const imageDirectory = path.resolve(__dirname, '../../images');

const paths = [
  { name: HsrPath.Abundance, id: '81e58cfdc0c8a9a026c2c3111a6bdf663d572fa71524907b004fc5eb7f34fade' },
  { name: HsrPath.Destruction, id: '673136d8ba64c836e77a0084380bccea317250a93f866ddfcb0d64682b543970' },
  { name: HsrPath.Erudition, id: 'a1916e75aa6a99295aa01786a946ae601da457b578603446740cbe30bc5fba5a' },
  { name: HsrPath.Harmony, id: 'fd3dc153082117a49b1d8eb7d166dd32d65d636463e15c604b583d5945a4ca69' },
  { name: HsrPath.Hunt, id: '948d90296adc5203a105a16be892d9e4d5e83c93df11abf59a8ad4321e37fbb8' },
  { name: HsrPath.Nihility, id: '96c3b8dd457b98955d440531986a23d509f705c13d7aa794d1e97bcfd03d5701' },
  { name: HsrPath.Preservation, id: '861828026682b63234f31903ec91d9fd670122ea792feb297a8c59c5e7686ea1' }
];

const damageTypes = [
  { name: HsrDamageType.Fire, id: 'bd8329d02d7ecfee2a1f565e89cf3bf7bf6aaa60bea29cec2b4f7192626a0311' },
  { name: HsrDamageType.Ice, id: 'c7ca3cbdcd5d26fbfad374f97d58d9152b5a398a5e5bf6d441a29041251fa779' },
  { name: HsrDamageType.Imaginary, id: '91b47b558df75f608b0a8aa93f35fd2063ed789ec25cbcc7bee926c60fba7ab1' },
  { name: HsrDamageType.Lightning, id: 'aec46e1b5be764fe83cac85e30f5832729012baa6a30bb8d91c82348d8a1b4d6' },
  { name: HsrDamageType.Physical, id: '9b77aa4b13a80228e6db8023c086a6dd43ffe89e318aa52e790528beb4e5ea20' },
  { name: HsrDamageType.Quantum, id: 'ddae115334fb14959c5e24b70a5b165c431afc32f9fcf84d4b50e5e0e15bcc1f' },
  { name: HsrDamageType.Wind, id: '2f3d2fba0ee9442f1c51cf42a91af6f9ece3f19168237fd3963d352e508791c7' },
]

const downloadWebpFile = (sourcePath: string, destPath: string): void => {
  https.get(
    sourcePath,
    response => response.pipe(
      fs.createWriteStream(destPath)
    )
  );
}

export const downloadCharacterImages = (character: any, cleanName: string, override = false): void => {
  const {
    iconPath,
    figPath,
  } = character;

  const iconUrl = `${baseUrl}/${iconPath}.webp`;
  const figUrl = `${baseUrl}/${figPath}.webp`;
  const iconFilePath = `${imageDirectory}/${cleanName}_icon.webp`;
  const fullCharacterFilePath = `${imageDirectory}/${cleanName}_full.webp`;
  let downloadCount = 0;

  if (!fs.existsSync(iconFilePath) || override) {
    downloadWebpFile(iconUrl, iconFilePath);
    downloadCount++;
  }

  if (!fs.existsSync(fullCharacterFilePath) || override) {
    downloadWebpFile(figUrl, fullCharacterFilePath);
    downloadCount++;
  }

  console.log(`Finished downloading ${downloadCount} images for ${cleanName}`);
};

export const downloadLightConeImages = (cone: any, cleanName: string, override = false): void => {
  const { artPath } = cone;

  const artUrl = `${baseUrl}/${artPath}.webp`;
  const artFilePath = `${imageDirectory}/${cleanName}_art.webp`;
  let downloadCount = 0;

  if (!fs.existsSync(artFilePath) || override) {
    downloadWebpFile(artUrl, artFilePath);
    downloadCount++;
  }

  console.log(`Finished downloading ${downloadCount} images for ${cleanName}`);
};

export const downloadRelicImages = (relicPiece: any, override = false): void => {
  const { iconPath, cleanName } = relicPiece;

  const iconUrl = `${baseUrl}/${iconPath}.webp`;
  const iconFilePath = `${imageDirectory}/${cleanName}_art.webp`;
  let downloadCount = 0;

  if (!fs.existsSync(iconFilePath) || override) {
    downloadWebpFile(iconUrl, iconFilePath);
    downloadCount++;
  }

  console.log(`Finished downloading ${downloadCount} images for ${cleanName}`);
}

export const downloadPathImages = (): void => {
  for (const path of paths) {
    const downloadUrl = `${baseUrl}/${path.id}.webp`;
    const filePath = `${imageDirectory}/${path.name}_path.webp`;
    
    if (!fs.existsSync(filePath)) {
      downloadWebpFile(downloadUrl, filePath);
    }
  }
}

export const downloadDamageTypeImages = (): void => {
  for (const type of damageTypes) {
    const downloadUrl = `${baseUrl}/${type.id}.webp`;
    const filePath = `${imageDirectory}/${type.name}_path.webp`;
    
    if (!fs.existsSync(filePath)) {
      downloadWebpFile(downloadUrl, filePath);
    }
  }
}