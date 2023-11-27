import React, { ReactNode } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    MenuItem,
    SxProps,
    TextField,
    Theme,
    Tooltip
} from '@mui/material';
import { Antibody } from '@rigatonirex/antibody-library/antibody';

function FormRowBox(props: { sx?: SxProps<Theme>; children: ReactNode[] }) {
    return (
        <Box sx={{ ...props.sx, display: 'flex', gap: 2 }}>
            {props.children}
        </Box>
    );
}

function FormButtons(props: {
    antibody: Antibody;
    validated: boolean;
    onConfirm: (antibody: Antibody) => void;
    onCancel: () => void;
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
                gap: 2
            }}
        >
            <Button
                variant="contained"
                color="success"
                onClick={() => {
                    props.onConfirm(props.antibody);
                }}
                disabled={!props.validated}
            >
                Add
            </Button>
            <Button variant="contained" color="error" onClick={props.onCancel}>
                Cancel
            </Button>
        </Box>
    );
}

export default function AddAntibodyDialog(props: {
    open: boolean;
    onConfirm: (antibody: Antibody) => void;
    onCancel: () => void;
}) {
    const [antibody, setAntibody] = React.useState<Antibody>({
        marker: '',
        catalog: '',
        clone: '',
        color: '',
        company: '',
        reactivity: ''
    });
    const validated: boolean =
        antibody.marker !== '' &&
        antibody.catalog !== '' &&
        antibody.clone !== '' &&
        antibody.color !== '' &&
        antibody.company !== '' &&
        antibody.reactivity !== '';

    function clearAntibody() {
        setAntibody({
            marker: '',
            catalog: '',
            clone: '',
            color: '',
            company: '',
            reactivity: ''
        });
    }
    return (
        <Dialog open={props.open}>
            <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        marginBottom: 2
                    }}
                >
                    <DialogTitle>Add Antibody Form</DialogTitle>
                    <hr style={{ width: '100%' }}></hr>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        marginBottom: 2
                    }}
                >
                    <FormRowBox>
                        <Tooltip
                            title="Antibody Marker Name"
                            arrow
                            disableInteractive
                        >
                            <TextField
                                label="Marker"
                                required
                                error={antibody.marker === ''}
                                onChange={(event) => {
                                    setAntibody({
                                        ...antibody,
                                        marker: event.target.value
                                    });
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            title="Alternate Antibody Name"
                            arrow
                            disableInteractive
                        >
                            <TextField
                                label="Alternate Name"
                                onChange={(event) => {
                                    setAntibody({
                                        ...antibody,
                                        alt_name: event.target.value
                                    });
                                }}
                            />
                        </Tooltip>
                    </FormRowBox>
                    <FormRowBox>
                        <Tooltip
                            title="Fluorophore Color"
                            arrow
                            disableInteractive
                        >
                            <TextField
                                label="Color"
                                required
                                error={antibody.color === ''}
                                onChange={(event) => {
                                    setAntibody({
                                        ...antibody,
                                        color: event.target.value
                                    });
                                }}
                            />
                        </Tooltip>
                        <TextField
                            label="Clone"
                            required
                            error={antibody.clone === ''}
                            onChange={(event) => {
                                setAntibody({
                                    ...antibody,
                                    clone: event.target.value
                                });
                            }}
                        />
                    </FormRowBox>
                    <FormRowBox>
                        <TextField
                            label="Company"
                            required
                            error={antibody.company === ''}
                            onChange={(event) => {
                                setAntibody({
                                    ...antibody,
                                    company: event.target.value
                                });
                            }}
                        />
                        <TextField
                            label="Reactivity"
                            required
                            select
                            sx={{ width: 223 }}
                            error={antibody.reactivity === ''}
                            onChange={(event) => {
                                setAntibody({
                                    ...antibody,
                                    reactivity: event.target.value
                                });
                            }}
                        >
                            <MenuItem value={'Mouse'}>Mouse</MenuItem>
                            <MenuItem value={'Human'}>Human</MenuItem>
                        </TextField>
                    </FormRowBox>
                    <FormRowBox>
                        <Tooltip
                            title="Catalog Number"
                            arrow
                            disableInteractive
                        >
                            <TextField
                                label="Catalog"
                                required
                                error={antibody.catalog === ''}
                                onChange={(event) => {
                                    setAntibody({
                                        ...antibody,
                                        catalog: event.target.value
                                    });
                                }}
                            />
                        </Tooltip>
                        <TextField
                            label="Dilution"
                            onChange={(event) => {
                                setAntibody({
                                    ...antibody,
                                    dilution: event.target.value
                                });
                            }}
                        />
                    </FormRowBox>
                    <FormRowBox>
                        <Tooltip title="Peak Detector" arrow disableInteractive>
                            <TextField
                                label="Detector"
                                onChange={(event) => {
                                    setAntibody({
                                        ...antibody,
                                        detector: event.target.value
                                    });
                                }}
                            />
                        </Tooltip>
                        <TextField
                            label="Isotype"
                            onChange={(event) => {
                                setAntibody({
                                    ...antibody,
                                    isotype: event.target.value
                                });
                            }}
                        />
                    </FormRowBox>
                    <FormRowBox>
                        <TextField
                            label="Location"
                            onChange={(event) => {
                                setAntibody({
                                    ...antibody,
                                    location: event.target.value
                                });
                            }}
                        />
                        <Tooltip
                            title="Number of tubes in stock"
                            arrow
                            disableInteractive
                        >
                            <TextField
                                label="Stock"
                                inputProps={{ type: 'number' }}
                                onChange={(event) => {
                                    setAntibody({
                                        ...antibody,
                                        num_tubes_in_stock: Number(
                                            event.target.value
                                        )
                                    });
                                }}
                            />
                        </Tooltip>
                    </FormRowBox>
                    <TextField
                        label="Comments"
                        multiline
                        rows={3}
                        fullWidth
                        onChange={(event) => {
                            setAntibody({
                                ...antibody,
                                comments: event.target.value
                            });
                        }}
                    />
                </Box>
                <FormButtons
                    antibody={antibody}
                    onConfirm={(antibody: Antibody) => {
                        props.onConfirm(antibody);
                        clearAntibody();
                    }}
                    onCancel={() => {
                        props.onCancel();
                        clearAntibody();
                    }}
                    validated={validated}
                />
            </Box>
        </Dialog>
    );
}
