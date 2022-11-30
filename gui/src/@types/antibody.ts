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
    laser: string = '';
    epitopeLocation: 'Surface' | 'Intracellular' = 'Surface';
}

export class AntibodyCollection extends Array<Antibody> {
    constructor(antibodyArray: Antibody[]) {
        super();
        if (Array.isArray(antibodyArray)) {
            antibodyArray.forEach((antibody) => this.push(antibody));
        }
    }
    getMarkers(): string[] {
        return Array.from(new Set(this.map((antibody) => antibody.marker)));
    }
    getColors(): string[] {
        return Array.from(new Set(this.map((antibody) => antibody.color)));
    }
    getClones(): string[] {
        return Array.from(new Set(this.map((antibody) => antibody.clone)));
    }
    getCompanies(): string[] {
        return Array.from(new Set(this.map((antibody) => antibody.company)));
    }
    filterOnMarker(marker: string): AntibodyCollection {
        return this.filter(
            (antibody) => antibody.marker === marker
        ) as AntibodyCollection;
    }
    filterOnColor(color: string): AntibodyCollection {
        return this.filter(
            (antibody) => antibody.color === color
        ) as AntibodyCollection;
    }
    filterOnClone(clone: string): AntibodyCollection {
        return this.filter(
            (antibody) => antibody.clone === clone
        ) as AntibodyCollection;
    }
    filterOnMarkerAndColor(marker: string, color: string): AntibodyCollection {
        return this.filter(
            (antibody) => antibody.marker === marker && antibody.color === color
        ) as AntibodyCollection;
    }
    filterOnMarkerAndColorAndClone(
        marker: string,
        color: string,
        clone: string
    ): AntibodyCollection {
        return this.filter(
            (antibody) =>
                antibody.marker === marker &&
                antibody.color === color &&
                antibody.clone === clone
        ) as AntibodyCollection;
    }
    findSelection(
        marker: string,
        color: string,
        clone: string,
        company: string
    ): Antibody | undefined {
        return this.find(
            (antibody) =>
                antibody.marker === marker &&
                antibody.color === color &&
                antibody.clone === clone &&
                antibody.company === company
        );
    }
}

export type DilutionFactor = {
    Cytek: number;
    Fortessa: number;
};
