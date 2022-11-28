import React from 'react';
import { TextField } from '@mui/material';
import { SxProps } from '@mui/system';
import { ComponentPaper } from './ComponentPaper';

export function MarkerSearch(props: {
    markers: string[];
    setMarkerSelected?: any;
    sx?: SxProps;
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
        <ComponentPaper
            title="Marker"
            items={filteredMarkers}
            setSelectedItem={props.setMarkerSelected}
            sx={props.sx}
        >
            <TextField
                label="Search"
                sx={{ width: 0.8 }}
                onChange={handleSearchChange}
            />
        </ComponentPaper>
    );
}
