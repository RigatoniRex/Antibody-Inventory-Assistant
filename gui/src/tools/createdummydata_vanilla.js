import fs from "graceful-fs";
import path from 'path';

const splitChar = '\t';

let data = ''
let lines = ['']
let antibodies = [];
data = fs.readFileSync(path.resolve("gui/src/test/Antibody_Lookup_V1.0.txt"), { 'encoding': "utf8" });

lines = data.split('\r\n').slice(1); //split on new line feed, skip first line.

lines.forEach(line=>{
    const tokens = line.split(splitChar);
    const antibody = {
        "marker": tokens[0],
        "reactivity": tokens[1],
        "color": tokens[2],
        "clone": tokens[3],
        "company": tokens[4],
        "catalog": tokens[5],
        "isotype": tokens[6],
        "DF": {
          "Cytek": tokens[7],
          "Fortessa": tokens[8]
        },
        "detector": tokens[9],
        "emission_wavelength": tokens[10],
        "is_ec": tokens[11],
        "is_ic": tokens[12]
      }
      antibodies.push(antibody);
});

const jsonOut = JSON.stringify({antibodies}, null, 2);
console.log(jsonOut);

fs.writeFileSync(path.resolve("gui/src/test/dummyData.json"), jsonOut);