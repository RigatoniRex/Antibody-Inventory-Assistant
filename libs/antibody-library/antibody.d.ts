export declare class Antibody {
    marker: string;
    reactivity: string;
    color: string;
    clone: string;
    company: string;
    catalog: string;
    isotype: string;
    dilutionFactor: DilutionFactor;
    detector: string;
    laser: string;
    epitopeLocation: 'Surface' | 'Intracellular';
}
export declare class AntibodyCollection extends Array<Antibody> {
    constructor(antibodyArray: Antibody[]);
    getMarkers(): string[];
    getColors(): string[];
    getClones(): string[];
    getCompanies(): string[];
    filterOnMarker(marker: string): AntibodyCollection;
    filterOnColor(color: string): AntibodyCollection;
    filterOnClone(clone: string): AntibodyCollection;
    filterOnMarkerAndColor(marker: string, color: string): AntibodyCollection;
    filterOnMarkerAndColorAndClone(marker: string, color: string, clone: string): AntibodyCollection;
    findSelection(marker: string, color: string, clone: string, company: string): Antibody | undefined;
}
export declare type DilutionFactor = {
    Cytek: number;
    Fortessa: number;
};
