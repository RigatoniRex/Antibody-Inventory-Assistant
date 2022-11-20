import { Box, Grid, Paper, TextField } from '@mui/material';
import React from 'react';
import { Antibody } from '../../@types/antibody';
import { CloneSelect } from './CloneSelect';
import { ColorSelect } from './ColorSelect';
import { CompanySelect } from './CompanySelect';
import { MarkerSearch } from './MarkerSearch';

export function SearchForm(props: { antibodies: Antibody[] }) {
    const [markerSelected, setMarkerSelected] = React.useState<string>('');
    const [colorSelected, setColorSelected] = React.useState<string>('');
    const [cloneSelected, setCloneSelected] = React.useState<string>('');
    const [companySelected, setCompanySelected] = React.useState<string>('');

    // Force uniqueness by using a Set
    const markers: string[] = React.useMemo(() => {
        return Array.from(
            new Set(props.antibodies.map((antibody) => antibody.marker))
        );
    }, [props.antibodies]);
    return (
        <Box sx={{ height: 1000, textAlign: 'center' }}>
            <Paper variant="outlined" sx={{ height: 1000 }}>
                <h1>SearchForm</h1>
                <Grid container spacing={2} height={1}>
                    <Grid item xs={2}>
                        <MarkerSearch
                            markers={markers}
                            setMarkerSelected={setMarkerSelected}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ColorSelect colors={[]} />
                    </Grid>
                    <Grid item xs={2}>
                        <CloneSelect clones={[]} />
                        <CompanySelect companies={[]} />
                    </Grid>
                    {/* Output Text Fields */}
                    <Grid item xs={2}>
                        <TextField
                            disabled
                            label="Marker"
                            value={markerSelected}
                        />
                        <TextField
                            disabled
                            label="Color"
                            value={colorSelected}
                        ></TextField>
                        <TextField
                            disabled
                            label="Clone"
                            value={cloneSelected}
                        ></TextField>
                        <TextField
                            disabled
                            label="Company"
                            value={companySelected}
                        ></TextField>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
