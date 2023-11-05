import { url } from './env';
import { postAntibody } from './utils';
import { readFileSync } from 'fs';

const antibody_json = readFileSync('./antibodies.json', 'utf8');

const antibodies: any[] = JSON.parse(antibody_json);

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
