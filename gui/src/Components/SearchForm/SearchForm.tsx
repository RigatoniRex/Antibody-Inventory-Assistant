import { Box, Grid, Paper, TextField } from '@mui/material';
import React from 'react';
import { Antibody, AntibodyCollection } from '../../@types/antibody';
import { CloneSelect } from './CloneSelect';
import { ColorSelect } from './ColorSelect';
import { CompanySelect } from './CompanySelect';
import { MarkerSearch } from './MarkerSearch';

export function SearchForm(props: { antibodies: AntibodyCollection }) {
    const [markerSelected, setMarkerSelected] = React.useState<string>('');
    const [colorSelected, setColorSelected] = React.useState<string>('');
    const [cloneSelected, setCloneSelected] = React.useState<string>('');
    const [companySelected, setCompanySelected] = React.useState<string>('');
    const [antibodySelected, setAntibodySelected] = React.useState<
        Antibody | undefined
    >(undefined);
    const [filteredAntibodies, setFilteredAntibodies] =
        React.useState<AntibodyCollection>(props.antibodies);

    const markers: string[] = React.useMemo(() => {
        return filteredAntibodies.getMarkers();
    }, [props.antibodies]);
    const colors: string[] = React.useMemo(() => {
        return filteredAntibodies.getColors();
    }, [markerSelected]);
    const clones: string[] = React.useMemo(() => {
        return filteredAntibodies.getClones();
    }, [colorSelected]);
    const companies: string[] = React.useMemo(() => {
        return filteredAntibodies.getCompanies();
    }, [cloneSelected]);
    const handleMarkerChange = (selectedMarker: string) => {
        setFilteredAntibodies(
            selectedMarker
                ? props.antibodies.filterOnMarker(selectedMarker)
                : props.antibodies
        );
        setMarkerSelected(selectedMarker);
    };
    const handleColorChange = (selectedColor: string) => {
        if (selectedColor) {
            setFilteredAntibodies(
                props.antibodies.filterOnMarkerAndColor(
                    markerSelected,
                    selectedColor
                )
            );
        }
        setColorSelected(selectedColor);
    };
    const handleCloneChange = (selectedClone: string) => {
        if (selectedClone) {
            setFilteredAntibodies(
                props.antibodies.filterOnMarkerAndColorAndClone(
                    markerSelected,
                    colorSelected,
                    selectedClone
                )
            );
        }
        setCloneSelected(selectedClone);
    };
    const handleCompanyChange = (selectedCompany: string) => {
        setCompanySelected(selectedCompany);
        setAntibodySelected(
            props.antibodies.findSelection(
                markerSelected,
                colorSelected,
                cloneSelected,
                selectedCompany
            )
        );
    };
    return (
        <Box sx={{ height: 1000, textAlign: 'center' }}>
            <Paper variant="outlined" sx={{ height: 1000 }}>
                <h1>SearchForm</h1>
                <Grid container spacing={2} height={1}>
                    <Grid item xs={2}>
                        <MarkerSearch
                            markers={markers}
                            setMarkerSelected={handleMarkerChange}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ColorSelect
                            colors={markerSelected ? colors : []}
                            setColorSelected={handleColorChange}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <CloneSelect
                            clones={colorSelected ? clones : []}
                            setCloneSelected={handleCloneChange}
                        />
                        <CompanySelect
                            companies={cloneSelected ? companies : []}
                            setCompanySelected={handleCompanyChange}
                        />
                    </Grid>
                    {/* Output Text Fields */}
                    <Grid item xs={2}>
                        <TextField
                            margin={'normal'}
                            disabled
                            label="Marker"
                            value={markerSelected}
                        />
                        <TextField
                            margin={'normal'}
                            disabled
                            label="Color"
                            value={colorSelected}
                        ></TextField>
                        <TextField
                            margin={'normal'}
                            disabled
                            label="Clone"
                            value={cloneSelected}
                        ></TextField>
                        <TextField
                            margin={'normal'}
                            disabled
                            label="Company"
                            value={companySelected}
                        ></TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            margin={'normal'}
                            fullWidth
                            disabled
                            label="Antibody Selected"
                            id="outlined-multiline-static"
                            multiline
                            rows={20}
                            defaultValue="Default Value"
                            value={
                                antibodySelected
                                    ? JSON.stringify(antibodySelected, null, 2)
                                    : ''
                            }
                        ></TextField>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
