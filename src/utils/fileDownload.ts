import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

const baseUrl = 'https://cdn.starrailstation.com/assets';
const imageDirectory = path.resolve(__dirname, '../../images');

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