import { Box, Grid, Paper, SxProps, TextField, Theme } from '@mui/material';
import React from 'react';
import {
    AntibodyRecord,
    AntibodyRecordCollection
} from '@rigatonirex/antibody-library/antibody';
import { ComponentPaper } from './Helpers/ComponentPaper';
import { MarkerSearch } from './Helpers/MarkerSearch';
import SearchFormLoader from './SearchFormLoader';
import ManipulateButtons from './Helpers/ManipulateButtons';
import AntibodyEndpoint from '../../Api/AntibodyEndpoint';

export function SearchForm(props: {
    antibodies: AntibodyRecordCollection | null;
    antibody_endpoint: AntibodyEndpoint;
    sx?: SxProps<Theme>;
}) {
    const [markerSelected, setMarkerSelected] = React.useState<string>('');
    const [colorSelected, setColorSelected] = React.useState<string>('');
    const [cloneSelected, setCloneSelected] = React.useState<string>('');
    const [companySelected, setCompanySelected] = React.useState<string>('');
    const [antibodySelected, setAntibodySelected] = React.useState<
        AntibodyRecord | undefined
    >(undefined);
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
    //Reset state if antibodies change.
    // React.useEffect(() => {
    //     setMarkerSelected('');
    //     setColorSelected('');
    //     setCloneSelected('');
    //     setCompanySelected('');
    //     setAntibodySelected(undefined);
    // }, [props.antibodies]);
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
                    width: { xs: 700, md: 0.98, lg: 0.98, xl: 1400 },
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
                <ManipulateButtons
                    antibodySelected={antibodySelected}
                    antibody_endpoint={props.antibody_endpoint}
                    doClear={() => {
                        setMarkerSelected('');
                        setColorSelected('');
                        setCloneSelected('');
                        setCompanySelected('');
                        setAntibodySelected(undefined);
                    }}
                />
                <Grid container spacing={2} height={500}>
                    <Grid item xs={3} height={1}>
                        <MarkerSearch
                            markers={props.antibodies?.getMarkers() ?? []}
                            onItemSelect={(marker: string) => {
                                setMarkerSelected(marker);
                                setColorSelected('');
                                setCloneSelected('');
                                setCompanySelected('');
                                setAntibodySelected(undefined);
                            }}
                            clearSelected={!markerSelected}
                        />
                    </Grid>
                    <Grid item xs={3} height={1}>
                        <ComponentPaper
                            title="Color"
                            items={
                                markerSelected
                                    ? props.antibodies
                                          ?.filterOnSelection({
                                              marker:
                                                  markerSelected ?? undefined
                                          })
                                          .getColors() ?? []
                                    : []
                            }
                            onItemSelect={(color: string) => {
                                setColorSelected(color);
                                setCloneSelected('');
                                setCompanySelected('');
                                setAntibodySelected(undefined);
                            }}
                            clearSelected={!colorSelected}
                        />
                    </Grid>
                    <Grid item xs={2} height={1}>
                        <ComponentPaper
                            title="Clone"
                            items={
                                colorSelected
                                    ? props.antibodies
                                          ?.filterOnSelection({
                                              marker:
                                                  markerSelected ?? undefined,
                                              color: colorSelected ?? undefined
                                          })
                                          .getClones() ?? []
                                    : []
                            }
                            onItemSelect={(clone: string) => {
                                setCloneSelected(clone);
                                setCompanySelected('');
                                setAntibodySelected(undefined);
                            }}
                            clearSelected={!cloneSelected}
                            sx={{ height: 0.5 }}
                        />
                        <ComponentPaper
                            title="Company"
                            items={
                                cloneSelected
                                    ? props.antibodies
                                          ?.filterOnSelection({
                                              marker:
                                                  markerSelected ?? undefined,
                                              color: colorSelected ?? undefined,
                                              clone: cloneSelected ?? undefined
                                          })
                                          .getCompanies() ?? []
                                    : []
                            }
                            onItemSelect={handleCompanyChange}
                            clearSelected={!companySelected}
                            sx={{ height: 0.5 }}
                        />
                    </Grid>
                    {/* Output Text Fields */}
                    {/* <Grid item xs={2}>
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
                    </Grid> */}
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
