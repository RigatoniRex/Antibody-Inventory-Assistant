import React from 'react';
import { TextField } from '@mui/material';
import { SxProps } from '@mui/system';
import { ComponentPaper } from './ComponentPaper';

export function MarkerSearch(props: {
    markers: string[];
    onItemSelect?: (item: any) => void;
    clearSelected?: boolean;
    sx?: SxProps;
}) {
    const [filteredMarkers, setFilteredMarkers] = React.useState(props.markers);
    const [searchInput, setSearchInput] = React.useState<string>('');
    const handleSearchChange = (event: any) => {
        const input: string = event.target.value;
        setSearchInput(input);
    };

    React.useEffect(() => {
        const inputRegex = new RegExp('^' + searchInput, 'i');
        setFilteredMarkers(
            props.markers.filter((marker) => inputRegex.test(marker))
        );
    }, [searchInput, props.markers]);

    return (
        <ComponentPaper
            title="Marker"
            items={filteredMarkers}
            onItemSelect={props.onItemSelect}
            clearSelected={props.clearSelected}
            sx={props.sx}
        >
            <TextField
                label="Search"
                sx={{ width: 0.8 }}
                onChange={handleSearchChange}
                type={'search'}
            />
        </ComponentPaper>
    );
}
