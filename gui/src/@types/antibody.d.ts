export class Antibody {
    marker: string = '';
    reactivity: string = '';
    color: string = '';
    clone: string = '';
    company: string = '';
    catalog: string = '';
    isotype: string = '';
    dilutionFactor: DilutionFactor = {
        Cytek: 0,
        Fortessa: 0
    };
    detector: string = '';
    emission_wavelength: string = '';
    placeholder: 'Surface' | 'Intracellular' = 'Surface';
}

export type DilutionFactor = {
    Cytek: number;
    Fortessa: number | null;
};
