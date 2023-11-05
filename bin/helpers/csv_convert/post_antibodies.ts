import { postAntibody } from './utils';
import { readFileSync } from 'fs';

const antibody_json = readFileSync('./antibodies.json', 'utf8');

const antibodies: any[] = JSON.parse(antibody_json);

// const url =
//     'http://127.0.0.1:5000/antibody-inventory-assistant/us-central1/api/antibody';
const url =
    'https://us-central1-antibody-inventory-assistant.cloudfunctions.net/api';

// Generate the request promises
const promises = antibodies
    .slice(undefined, 1)
    .map((antibody) => postAntibody(url, antibody));

Promise.all(promises).then((responses) =>
    console.log(
        JSON.stringify(
            responses.filter((res) => res.status >= 400),
            undefined,
            2
        )
    )
);
