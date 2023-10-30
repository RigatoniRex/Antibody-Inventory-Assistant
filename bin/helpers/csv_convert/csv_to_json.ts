import { readFileSync, writeFileSync } from 'fs';
import { createAntibody } from './utils';

const file = __dirname + '/July 2023 Ab inventory.csv';

// Read csv
const csv = readFileSync(file, 'utf8');

// Split into lines
const lines = csv.split('\r\n');

//Get headers
const headers = lines[0].split(',');

//Get antibodies

//Remove headers
let antibodies = lines.slice(1);
//Remove empties
antibodies = antibodies.filter((antibody) => antibody !== '');

console.log(headers);
console.log(antibodies.slice(undefined, 10));

const antibody_objs = [];
antibodies.forEach((antibody) => {
    antibody_objs.push(createAntibody(headers, antibody));
});

console.log(JSON.stringify(antibody_objs[0]));

const output_string = JSON.stringify(antibody_objs, undefined, 2);

writeFileSync('./antibodies.json', output_string, 'utf8');
