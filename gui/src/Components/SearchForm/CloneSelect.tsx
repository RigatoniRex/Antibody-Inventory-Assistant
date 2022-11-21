import React from 'react';
import { Box } from '@mui/system';
import { ComponentPaper } from './ComponentPaper';
import { SelectableList } from './SelectableList';

export function CloneSelect(props: {
    clones: string[];
    setCloneSelected?: any;
}) {
    return (
        <ComponentPaper>
            <h1>Clone</h1>
            <Box display={'flex'} justifyContent={'center'}>
                <SelectableList
                    items={props.clones}
                    setSelectedItem={props.setCloneSelected}
                    text_sx={{
                        textAlign: 'center'
                    }}
                    list_sx={{ height: 200, overflow: 'auto', width: 1 }}
                />
            </Box>
        </ComponentPaper>
    );
}
