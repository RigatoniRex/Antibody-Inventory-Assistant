import axios from 'axios';

/**
 * Converts antibody csv line into an antibody object
 * @param headers
 * @param antibody_line
 */
export function createAntibody(headers: string[], antibody_line: string) {
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

/**
 * Makes a post request with the antibody to the provided url endpoint
 * @param url endpoint url
 * @param antibody antibody data
 * @returns response information
 */
export async function postAntibody(
    url: string,
    antibody: any
): Promise<PostResponseInfo_Success | PostResponseInfo_Error> {
    try {
        const res = await axios.post(
            url,
            {
                lab: 'Keaton',
                antibody: antibody
            },
            {
                headers: {
                    authorization: 'test'
                }
            }
        );
        return {
            antibody: antibody,
            status: res.status,
            data: res.data
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                antibody: antibody,
                status: error.response.status,
                error: error.response.data,
                code: error.code
            };
        } else {
            throw error;
        }
    }
}

export type PostResponseInfo = {
    antibody: any;
    status: number;
};
export type PostResponseInfo_Success = PostResponseInfo & {
    data: any;
};
export type PostResponseInfo_Error = PostResponseInfo & {
    error: any;
    code: string;
};
