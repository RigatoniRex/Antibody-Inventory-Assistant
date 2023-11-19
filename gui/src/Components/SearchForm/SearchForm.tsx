import {
    Box,
    Button,
    Grid,
    Paper,
    SxProps,
    TextField,
    Theme,
    Tooltip,
    useTheme
} from '@mui/material';
import React from 'react';
import {
    Antibody,
    AntibodyCollection
} from '@rigatonirex/antibody-library/antibody';
import { ComponentPaper } from './Helpers/ComponentPaper';
import { MarkerSearch } from './Helpers/MarkerSearch';
import SearchFormLoader from './SearchFormLoader';
import ManipulateButtons from './Helpers/ManipulateButtons';

export function SearchForm(props: {
    antibodies: AntibodyCollection | null;
    sx?: SxProps<Theme>;
}) {
    const [markerSelected, setMarkerSelected] = React.useState<string>('');
    const [colorSelected, setColorSelected] = React.useState<string>('');
    const [cloneSelected, setCloneSelected] = React.useState<string>('');
    const [companySelected, setCompanySelected] = React.useState<string>('');
    const [antibodySelected, setAntibodySelected] = React.useState<
        Antibody | undefined
    >(undefined);
    const [filteredAntibodies, setFilteredAntibodies] =
        React.useState<AntibodyCollection>(
            props.antibodies ?? new AntibodyCollection([])
        );

    const markers: string[] = React.useMemo(() => {
        if (props.antibodies) return props.antibodies.getMarkers();
        else return [];
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
        if (props.antibodies) {
            setFilteredAntibodies(
                selectedMarker
                    ? props.antibodies.filterOnSelection({
                          marker: selectedMarker
                      })
                    : props.antibodies
            );
            setMarkerSelected(selectedMarker);
        }
    };
    const handleColorChange = (selectedColor: string) => {
        if (props.antibodies && selectedColor) {
            setFilteredAntibodies(
                props.antibodies.filterOnSelection({
                    marker: markerSelected,
                    color: selectedColor
                })
            );
        }
        setColorSelected(selectedColor);
    };
    const handleCloneChange = (selectedClone: string) => {
        if (props.antibodies && selectedClone) {
            setFilteredAntibodies(
                props.antibodies.filterOnSelection({
                    marker: markerSelected,
                    color: colorSelected,
                    clone: selectedClone
                })
            );
        }
        setCloneSelected(selectedClone);
    };
    const handleCompanyChange = (selectedCompany: string) => {
        if (props.antibodies && selectedCompany) {
            setAntibodySelected(
                props.antibodies.findSelection(
                    markerSelected,
                    colorSelected,
                    cloneSelected,
                    selectedCompany
                )
            );
        } else {
            setAntibodySelected(undefined);
        }
        setCompanySelected(selectedCompany);
    };
    return props.antibodies ? (
        <Box
            sx={{
                ...props.sx,
                alignItems: 'center',
                padding: 10,
                display: 'flex',
                flexFlow: 'column'
            }}
        >
            <Paper
                elevation={20}
                sx={{
                    width: { xs: 0.95, md: 0.95, lg: 0.6 },
                    alignItems: 'center',
                    textAlign: 'center',
                    ...props.sx,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                    display: 'flex',
                    flexFlow: 'column',
                    userSelect: 'none'
                }}
            >
                <h1>Bods Manipulate</h1>
                <hr style={{ width: '100%' }} />
                <ManipulateButtons antibodySelected={antibodySelected} />
                <Grid container spacing={2} height={500}>
                    <Grid item xs={2} height={1}>
                        <MarkerSearch
                            markers={markers}
                            setMarkerSelected={handleMarkerChange}
                        />
                    </Grid>
                    <Grid item xs={2} height={1}>
                        <ComponentPaper
                            title="Color"
                            items={markerSelected ? colors : []}
                            setSelectedItem={handleColorChange}
                        />
                    </Grid>
                    <Grid item xs={2} height={1}>
                        <ComponentPaper
                            title="Clone"
                            items={colorSelected ? clones : []}
                            setSelectedItem={handleCloneChange}
                            sx={{ height: 0.5 }}
                        />
                        <ComponentPaper
                            title="Company"
                            items={cloneSelected ? companies : []}
                            setSelectedItem={handleCompanyChange}
                            sx={{ height: 0.5 }}
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
                    <Grid item xs={4}>
                        <TextField
                            margin={'normal'}
                            fullWidth
                            disabled
                            label="Antibody Selected"
                            id="outlined-multiline-static"
                            multiline
                            sx={{ maxHeight: 1, height: 1 }}
                            rows={18}
                            value={
                                antibodySelected
                                    ? JSON.stringify(antibodySelected, null, 4)
                                    : ''
                            }
                        ></TextField>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    ) : (
        <SearchFormLoader />
    );
}
