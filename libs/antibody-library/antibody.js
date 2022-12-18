"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntibodyCollection = exports.Antibody = void 0;
class Antibody {
    constructor() {
        this.marker = '';
        this.reactivity = '';
        this.color = '';
        this.clone = '';
        this.company = '';
        this.catalog = '';
        this.isotype = '';
        this.dilutionFactor = {
            Cytek: 0,
            Fortessa: 0
        };
        this.detector = '';
        this.laser = '';
        this.epitopeLocation = 'Surface';
    }
}
exports.Antibody = Antibody;
class AntibodyCollection extends Array {
    constructor(antibodyArray) {
        super();
        if (Array.isArray(antibodyArray)) {
            antibodyArray.forEach((antibody) => this.push(antibody));
        }
    }
    getMarkers() {
        return Array.from(new Set(this.map((antibody) => antibody.marker)));
    }
    getColors() {
        return Array.from(new Set(this.map((antibody) => antibody.color)));
    }
    getClones() {
        return Array.from(new Set(this.map((antibody) => antibody.clone)));
    }
    getCompanies() {
        return Array.from(new Set(this.map((antibody) => antibody.company)));
    }
    filterOnMarker(marker) {
        return this.filter((antibody) => antibody.marker === marker);
    }
    filterOnColor(color) {
        return this.filter((antibody) => antibody.color === color);
    }
    filterOnClone(clone) {
        return this.filter((antibody) => antibody.clone === clone);
    }
    filterOnMarkerAndColor(marker, color) {
        return this.filter((antibody) => antibody.marker === marker && antibody.color === color);
    }
    filterOnMarkerAndColorAndClone(marker, color, clone) {
        return this.filter((antibody) => antibody.marker === marker &&
            antibody.color === color &&
            antibody.clone === clone);
    }
    findSelection(marker, color, clone, company) {
        return this.find((antibody) => antibody.marker === marker &&
            antibody.color === color &&
            antibody.clone === clone &&
            antibody.company === company);
    }
}
exports.AntibodyCollection = AntibodyCollection;
