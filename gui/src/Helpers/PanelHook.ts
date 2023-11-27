import {
    AntibodyRecord,
    AntibodyRecordCollection
} from '@rigatonirex/antibody-library/antibody';
import React from 'react';

class PanelHelper extends AntibodyRecordCollection {
    private readonly setPanel: React.Dispatch<
        React.SetStateAction<AntibodyRecordCollection | undefined>
    >;

    constructor(
        panel: AntibodyRecordCollection | undefined,
        setPanel: React.Dispatch<
            React.SetStateAction<AntibodyRecordCollection | undefined>
        >
    ) {
        super(panel ? panel : []);
        this.setPanel = setPanel;
    }

    public addAntibody(antibody: AntibodyRecord) {
        this.setPanel(
            new AntibodyRecordCollection([...(this ?? []), antibody])
        );
    }
    public removeAntibody(antibody: AntibodyRecord) {
        if (this) {
            this.setPanel(
                new AntibodyRecordCollection(
                    this.filter(
                        (panel_antibody) => antibody.id !== panel_antibody.id
                    )
                )
            );
        }
    }
    public clear() {
        this.setPanel(undefined);
    }
    public update(truth_antibodies: AntibodyRecordCollection) {
        //TODO: Add update mechanic.
        //? It should check each panel item's id against the new truth antibodies
        //? Update the info if the item has changed
        //? OR
        //? Remove the item if it doesn't exist
    }
}

export function usePanel() {
    const [panel, setPanel] = React.useState<
        AntibodyRecordCollection | undefined
    >(undefined);
    return new PanelHelper(panel, setPanel);
}
