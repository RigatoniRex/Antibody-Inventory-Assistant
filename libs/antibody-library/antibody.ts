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

export function verifyAntibody(antibody: any): {
    check: boolean;
    reasons: string[];
} {
    const output: { check: boolean; reasons: string[] } = {
        check: false,
        reasons: []
    };
    if (!antibody) {
        output.reasons.push('Null or undefined object');
    }
    const conditions: boolean[] = [];
    if (antibody.marker && isString(antibody.marker)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid marker type');
    }
    if (antibody.alt_name && isString(antibody.alt_name)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid alt_name type');
    }
    if (antibody.reactivity && isString(antibody.reactivity)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid reactivity type');
    }
    if (antibody.color && isString(antibody.color)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid color type');
    }
    if (antibody.clone && isString(antibody.clone)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid clone type');
    }
    if (antibody.company && isString(antibody.company)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid company type');
    }
    if (antibody.catalog && isString(antibody.catalog)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid catalog type');
    }
    if (antibody.dilution && isString(antibody.dilution)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid dilution type');
    }
    if (antibody.detector && isString(antibody.detector)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid detector type');
    }
    if (antibody.dilution === undefined ? true : isString(antibody.dilution)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid dilution type');
    }
    if (antibody.isotype === undefined ? true : isString(antibody.isotype)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid isotype type');
    }
    if (antibody.location === undefined ? true : isString(antibody.location)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid location type');
    }
    if (antibody.num_tubes_in_stock && isNumber(antibody.num_tubes_in_stock)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid num_tubes_in_stock type');
    }
    if (antibody.comments && isString(antibody.comments)) {
        conditions.push(true);
    } else {
        conditions.push(false);
        output.reasons.push('Invalid comments type');
    }
    output.check = conditions.every((condition) => condition);
    return output;
}

export function test(): false {
    return false;
}

function isString(value: any) {
    return typeof value === 'string';
}
function isNumber(value: any) {
    return typeof value === 'number';
}
