import * as http from 'http';
import { connect, disconnect } from 'mongoose';
import { etlCharacters } from './src/characters';
import { etlLightCones } from './src/cones';

type Etl = (() => Promise<void>);
const etls: Etl[] = [
  etlCharacters,
  etlLightCones
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