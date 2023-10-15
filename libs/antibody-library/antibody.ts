export interface Antibody {
    /**Marker */
    marker: string;
    /**Alternate Name */
    alt_name: string;
    /**Species Reactivity */
    reactivity: string;
    /**Fluorophore Color */
    color: string;
    /**Clone */
    clone: string;
    /**Company */
    company: string;
    /**Catalog Number */
    catalog: string;
    /**Dilution */
    dilution?: string;
    /**Peak Detector */
    detector: string;
    /**Isotype */
    isotype?: string;
    /**Location */
    location?: string;
    /**Number of tubes in stock */
    num_tubes_in_stock?: number;
    /**Comments */
    comments: string;
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
    filterOnSelection(filters: {
        marker?: string;
        color?: string;
        clone?: string;
    }): AntibodyCollection {
        return this.filter(
            (antibody) =>
                (filters.marker ? antibody.marker === filters.marker : true) &&
                (filters.color ? antibody.color === filters.color : true) &&
                (filters.clone ? antibody.clone === filters.clone : true)
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
