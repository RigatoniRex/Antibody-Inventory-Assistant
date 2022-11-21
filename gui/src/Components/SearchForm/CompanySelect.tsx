import React from 'react';
import { Box } from '@mui/system';
import { ComponentPaper } from './ComponentPaper';
import { SelectableList } from './SelectableList';

export function CompanySelect(props: {
    companies: string[];
    setCompanySelected?: any;
}) {
    return (
        <ComponentPaper>
            <h1>Company</h1>
            <Box display={'flex'} justifyContent={'center'}>
                <SelectableList
                    items={props.companies}
                    setSelectedItem={props.setCompanySelected}
                    text_sx={{
                        textAlign: 'center'
                    }}
                    list_sx={{ height: 200, overflow: 'auto', width: 1 }}
                />
            </Box>
        </ComponentPaper>
    );
}
