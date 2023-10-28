const fs = require("fs");
const axios = require("axios");

const antibody_json = fs.readFileSync("./antibodies.json", "utf8");

const antibodies = JSON.parse(antibody_json);

// console.log(antibodies);

const url =
  "http://127.0.0.1:5000/antibody-inventory-assistant/us-central1/api/antibody";

const promises = [];

function postAntibody(antibody) {
  return axios
    .post(
      url,
      {
        lab: "Keaton",
        antibody: antibody,
      },
      {
        headers: {
          authorization: "test",
        },
      }
    )
    .then((res) => {
      return {
        antibody: antibody,
        status: res.status,
        data: res.data,
      };
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return {
          antibody: antibody,
          status: error.response.status,
          error: error.response.data,
          code: error.code,
        };
      } else {
        throw error;
      }
    });
}

// postAntibody(antibodies[0]).then((response) => console.log(response));

antibodies.forEach((antibody) => {
  promises.push(postAntibody(antibody));
});

Promise.all(promises).then((responses) =>
  console.log(
    JSON.stringify(
      responses.filter((res) => res.status >= 400),
      undefined,
      2
    )
  )
);
