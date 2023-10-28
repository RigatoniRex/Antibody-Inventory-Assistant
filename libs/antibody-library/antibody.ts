export interface Antibody {
    /**Marker */
    marker: string;
    /**Alternate Name */
    alt_name?: string;
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
    detector?: string;
    /**Isotype */
    isotype?: string;
    /**Location */
    location?: string;
    /**Number of tubes in stock */
    num_tubes_in_stock?: number;
    /**Comments */
    comments?: string;
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
    const verify = (
        name: string,
        value: any,
        type: 'string' | 'number',
        required: boolean = true
    ) => {
        // If required, check exists
        if (required && value === undefined) {
            conditions.push(false);
            output.reasons.push(`Missing ${name} value`);
        } else if (value === undefined) {
            conditions.push(true);
        } else {
            const isValidType = isType(value, type);
            conditions.push(isValidType);
            if (!isValidType) output.reasons.push(`Invalid ${name} type`);
        }
    };
    verify('marker', antibody.marker, 'string');
    verify('alt_name', antibody.alt_name, 'string', false);
    verify('reactivity', antibody.reactivity, 'string');
    verify('color', antibody.color, 'string');
    verify('dilution', antibody.dilution, 'string', false);
    verify('detector', antibody.detector, 'string', false);
    verify('clone', antibody.clone, 'string');
    verify('company', antibody.company, 'string');
    verify('catalog', antibody.catalog, 'string');
    verify('location', antibody.location, 'string', false);
    verify('num_tubes_in_stock', antibody.num_tubes_in_stock, 'number', false);
    verify('comments', antibody.comments, 'string', false);
    output.check = conditions.every((condition) => condition);
    return output;
}

export function test(): false {
    return false;
}

function isType(value: any, type: 'string' | 'number') {
    switch (type) {
        case 'string':
            return isString(value);
        case 'number':
            return isNumber(value);
        default:
            throw new Error('Type check not implemented');
    }
}

function isString(value: any) {
    return value === '' || typeof value === 'string';
}
function isNumber(value: any) {
    return value === 0 || typeof value === 'number';
}
