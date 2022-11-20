import React from 'react';
import { Box } from '@mui/system';
import { ComponentPaper } from './ComponentPaper';
import { SelectableList } from './SelectableList';

export function ColorSelect(props: { colors: string[] }) {
    return (
        <ComponentPaper>
            <h1>Color</h1>
            <Box display={'flex'} justifyContent={'center'}>
                <SelectableList
                    items={props.colors}
                    text_sx={{
                        textAlign: 'center'
                    }}
                    list_sx={{ height: 500, overflow: 'auto' }}
                />
            </Box>
        </ComponentPaper>
    );
}
