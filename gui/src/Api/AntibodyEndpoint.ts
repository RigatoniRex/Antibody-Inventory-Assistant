import {
    Antibody,
    AntibodyCollection
} from '@rigatonirex/antibody-library/antibody';
import axios from 'axios';

export default class AntibodyEndpoint {
    private antibodies: AntibodyCollection | null;
    private setAntibodies: (antibodies: AntibodyCollection) => void;
    public readonly lab: string;
    constructor(
        lab: string,
        antibodies: AntibodyCollection | null,
        setAntibodies: React.Dispatch<
            React.SetStateAction<AntibodyCollection | null>
        >
    ) {
        this.lab = lab;
        this.antibodies = antibodies;
        this.setAntibodies = setAntibodies;
    }
    public async getAll(password?: string): Promise<AntibodyCollection> {
        const response = await axios.get<Antibody[]>('/antibody', {
            headers: { Authorization: password },
            params: {
                lab: this.lab,
                fields: '*'
            },
            withCredentials: true
        });
        return new AntibodyCollection(response.data);
    }
    public async updateAntibodiesState(password?: string): Promise<void> {
        try {
            const antibodies = await this.getAll(password);
            if (antibodies) {
                this.setAntibodies(antibodies);
            }
        } catch (error) {}
    }
    public async deleteAntibody(antibody_id: string, password?: string) {
        try {
            const response = await axios.delete<{ msg: string; doc: string }>(
                `/antibody/${antibody_id}`,
                {
                    headers: { Authorization: password },
                    data: { lab: this.lab },
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
