const fs = require('fs');

const file = './July 2023 Ab inventory.csv';
// const file = "./test.csv";

// Read csv
const csv = fs.readFileSync(file, 'utf8');

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

/**
 * Converts antibody csv line into an antibody object
 * @param {string[]} headers
 * @param {string} antibody_line
 */
function createAntibody(headers, antibody_line) {
    const tokens = antibody_line.split(',');
    const antibody_obj = {};
    tokens.forEach((token, i) => {
        if (headers[i] === 'num_tubes_in_stock') {
            antibody_obj[headers[i]] = token === '' ? undefined : Number(token);
        } else {
            antibody_obj[headers[i]] = token === '' ? undefined : token;
        }
    });
    return antibody_obj;
}

const antibody_objs = [];
antibodies.forEach((antibody) => {
    antibody_objs.push(createAntibody(headers, antibody));
});

console.log(JSON.stringify(antibody_objs[0]));

const output_string = JSON.stringify(antibody_objs, undefined, 2);

fs.writeFileSync('./antibodies.json', output_string, 'utf8');
