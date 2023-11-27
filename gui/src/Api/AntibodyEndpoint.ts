import {
    Antibody,
    AntibodyRecord,
    AntibodyRecordCollection
} from '@rigatonirex/antibody-library/antibody';
import axios from 'axios';

export default class AntibodyEndpoint {
    private antibodies: AntibodyRecordCollection | null;
    private setAntibodies: (antibodies: AntibodyRecordCollection) => void;
    public readonly lab: string;
    constructor(
        lab: string,
        antibodies: AntibodyRecordCollection | null,
        setAntibodies: React.Dispatch<
            React.SetStateAction<AntibodyRecordCollection | null>
        >
    ) {
        this.lab = lab;
        this.antibodies = antibodies;
        this.setAntibodies = setAntibodies;
    }
    public async getAll(password?: string): Promise<AntibodyRecordCollection> {
        const response = await axios.get<AntibodyRecord[]>('/antibody', {
            headers: { Authorization: password },
            params: {
                lab: this.lab,
                fields: '*'
            },
            withCredentials: true
        });
        return new AntibodyRecordCollection(response.data);
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
                    new AntibodyRecordCollection(
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
    public async modifyAntibody(
        antibody_id: string,
        newAntibody: AntibodyRecord,
        password?: string
    ) {
        try {
            const response = await axios.put<{ msg: string; doc: string }>(
                `/antibody/${antibody_id}`,
                { lab: this.lab, antibody: newAntibody },
                {
                    headers: { Authorization: password },
                    withCredentials: true
                }
            );
            if (this.antibodies) {
                //* This operation updates a specific object within the array
                //* It is necessary when using a react set state method, since it compares the object GUID
                //? Ref: https://react.dev/learn/updating-arrays-in-state#updating-objects-inside-arrays
                const updatedAntibodies = new AntibodyRecordCollection(
                    this.antibodies.map((antibody) => {
                        if (antibody.id === antibody_id) {
                            return { ...newAntibody };
                        } else {
                            return antibody;
                        }
                    })
                );
                this.setAntibodies(updatedAntibodies);
            }
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async addAntibody(newAntibody: Antibody, password?: string) {
        try {
            const response = await axios.post<{ msg: string; doc: string }>(
                `/antibody`,
                { lab: this.lab, antibody: newAntibody },
                {
                    headers: { Authorization: password },
                    withCredentials: true
                }
            );
            if (this.antibodies) {
                //* This operation adds an object to the array
                //* It is necessary when using a react set state method, since it compares the object GUID
                //? Ref: https://react.dev/learn/updating-arrays-in-state#adding-to-an-array
                const updatedAntibodies = new AntibodyRecordCollection([
                    ...this.antibodies,
                    { ...newAntibody, id: response.data.doc }
                ]);
                this.setAntibodies(updatedAntibodies);
            }
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
