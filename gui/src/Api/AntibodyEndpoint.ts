import {
    Antibody,
    AntibodyCollection
} from '@rigatonirex/antibody-library/antibody';
import axios, { isAxiosError } from 'axios';
import { dev } from '../public.env';
import berg_antibodies from '../test/berg_antibodies.json';

class AntibodyEndpoint {
    private antibodies: AntibodyCollection | null;
    private setAntibodies: (antibodies: AntibodyCollection) => void;
    constructor(
        antibodies: AntibodyCollection | null,
        setAntibodies: React.Dispatch<
            React.SetStateAction<AntibodyCollection | null>
        >
    ) {
        this.antibodies = antibodies;
        this.setAntibodies = setAntibodies;
    }
    public async getAll(
        lab: string,
        password?: string
    ): Promise<AntibodyCollection> {
        const response = await axios.get<Antibody[]>('/antibody', {
            headers: { Authorization: password },
            params: {
                lab: lab,
                fields: '*'
            },
            withCredentials: true
        });
        return new AntibodyCollection(response.data);
    }
    public async updateAntibodiesState(
        lab: string,
        password?: string
    ): Promise<void> {
        const antibodies = await this.getAll(lab, password);
        this.setAntibodies(antibodies);
    }
    public async deleteAntibody(
        lab: string,
        antibody_id: string,
        password?: string
    ) {
        try {
            const response = await axios.delete<{ msg: string; doc: string }>(
                '/antibody',
                {
                    headers: { Authorization: password },
                    data: { lab: lab },
                    params: {
                        id: antibody_id
                    },
                    withCredentials: true
                }
            );
            if (this.antibodies) {
                //* This operation removes a an element and returns a new array
                //* It is necessary when using a react set state method, since it compares the object GUID
                //? Ref: https://react.dev/learn/updating-arrays-in-state#removing-from-an-array
                this.setAntibodies(
                    new AntibodyCollection(
                        this.antibodies.filter(
                            (antibody) => antibody.id !== antibody_id
                        )
                    )
                );
            }
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
