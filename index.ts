import { connect, disconnect } from 'mongoose';
import { etlCharacters } from './src/characters';
import { etlLightCones } from './src/cones';
import { etlRelics } from './src/relics';

type Etl = (() => Promise<void>);
// TODO: Add EtlConfig to set things like overwrite. Pass it in line 21
const etls: Etl[] = [
  etlCharacters,
  etlLightCones,
  etlRelics
];

(async () => {
    console.log('Beginning overall ETL process...');
    
    await connect('mongodb+srv://admin:LYDIAjobcz0721@shieldsoft.7achkty.mongodb.net/hsr-data');

    for (const etl of etls) {
      await etl();
    }

    await disconnect();
    console.log('Finished running ETLs.');
})();