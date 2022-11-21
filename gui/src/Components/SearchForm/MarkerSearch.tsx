import React from 'react';
import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import { ComponentPaper } from './ComponentPaper';
import { SelectableList } from './SelectableList';

export function MarkerSearch(props: {
    markers: string[];
    setMarkerSelected?: any;
}) {
    const [filteredMarkers, setFilteredMarkers] = React.useState(props.markers);
    const handleSearchChange = (event: any) => {
        const input: string = event.target.value;
        const inputRegex = new RegExp('^' + input, 'i');
        setFilteredMarkers(
            props.markers.filter((marker) => inputRegex.test(marker))
        );
    };

    return (
        <ComponentPaper>
            <h1>Marker</h1>
            <TextField label="Search" onChange={handleSearchChange} />
            <Box display={'flex'} justifyContent={'center'}>
                <SelectableList
                    items={filteredMarkers}
                    text_sx={{
                        textAlign: 'center'
                    }}
                    list_sx={{ height: 500, overflow: 'auto', width: 1 }}
                    setSelectedItem={props.setMarkerSelected}
                />
            </Box>
        </ComponentPaper>
    );
}
