import React from 'react';
import {
    Alert,
    Box,
    Button,
    Snackbar,
    SvgIconTypeMap,
    Tooltip,
    useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Antibody,
    AntibodyRecord
} from '@rigatonirex/antibody-library/antibody';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import AntibodyEndpoint from '../../../Api/AntibodyEndpoint';
import ConfirmDialog from '../../Dialogs/ConfigDialog';
import AddAntibodyDialog from '../../Dialogs/AddAntibodyDialog';
import { isAxiosError } from 'axios';

type ColorType =
    | 'inherit'
    | 'warning'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | undefined;

type Icon = OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
};

function GetButtonStyle(isAntibodySelected: boolean, isDarkTheme: boolean) {
    if (isAntibodySelected) {
        return isDarkTheme ? 'outlined' : 'contained';
    } else {
        return 'text';
    }
}

export default function ManipulateButtons(props: {
    antibodySelected: AntibodyRecord | undefined;
    antibody_endpoint: AntibodyEndpoint;
    doClear: () => void;
}) {
    const isDarkTheme = useTheme().palette.mode === 'dark';
    const [openSnackBar, setOpenSnackBar] = React.useState<boolean>(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
    const [snackBarSeverity, setSnackBarSeverity] = React.useState<
        'error' | 'warning' | 'info' | 'success'
    >('success');
    const [snackBarAutoHideDuration, setSnackBarAutoHideDuration] =
        React.useState<number | undefined>(undefined);
    const [openDeleteConfirm, setOpenDeleteConfirm] =
        React.useState<boolean>(false);
    const [openAddAntibody, setOpenAddAntibody] =
        React.useState<boolean>(false);

    function doOpenSnackBar(
        msg: string,
        severity: 'error' | 'warning' | 'info' | 'success' = 'success',
        autoHideDuration?: number
    ) {
        setSnackBarMessage(msg);
        setOpenSnackBar(true);
        setSnackBarSeverity(severity);
        setSnackBarAutoHideDuration(autoHideDuration);
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'end',
                paddingLeft: 1,
                paddingRight: 1,
                width: 1,
                gap: 2,
                margin: 1
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    width: 1
                }}
            >
                <ManipulateButton
                    tooltipTitle="Add New Antibody"
                    variant={isDarkTheme ? 'outlined' : 'contained'}
                    onClick={() => {
                        setOpenAddAntibody(true);
                    }}
                    icon={AddIcon}
                />
                <AddAntibodyDialog
                    open={openAddAntibody}
                    onConfirm={(antibody: Antibody) => {
                        props.antibody_endpoint
                            .addAntibody(antibody)
                            .then(() => {
                                doOpenSnackBar(
                                    'Antibody Added!',
                                    'success',
                                    2000
                                );
                            })
                            .catch((error) => {
                                if (isAxiosError(error)) {
                                    doOpenSnackBar(
                                        `${
                                            error.response?.statusText ??
                                            'ERROR'
                                        }: ${
                                            error.response?.data.rsn ??
                                            error.message
                                        }`,
                                        'error',
                                        4000
                                    );
                                }
                            });
                        setOpenAddAntibody(false);
                    }}
                    onCancel={() => {
                        setOpenAddAntibody(false);
                    }}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    width: 1,
                    gap: 2
                }}
            >
                <ManipulateButton
                    tooltipTitle="Add Antibody to Panel"
                    // disabled={props.antibodySelected === undefined}
                    disabled
                    disabledTooltipTitle="This feature is coming soon!"
                    color="secondary"
                    variant={GetButtonStyle(
                        props.antibodySelected !== undefined,
                        isDarkTheme
                    )}
                    icon={PlaylistAddIcon}
                />
                <ManipulateButton
                    tooltipTitle="Edit Antibody"
                    // disabled={props.antibodySelected === undefined}
                    disabled
                    disabledTooltipTitle="This feature is coming soon!"
                    color="warning"
                    variant={GetButtonStyle(
                        props.antibodySelected !== undefined,
                        isDarkTheme
                    )}
                    icon={EditIcon}
                    onClick={() => {
                        //TODO: Add Edit Functionality
                        // if (props.antibodySelected) {
                        //     props.antibody_endpoint.modifyAntibody(
                        //         props.antibodySelected.id,
                        //         {
                        //             ...props.antibodySelected,
                        //             reactivity: 'Human'
                        //         }
                        //     );
                        // }
                    }}
                />
                <ManipulateButton
                    tooltipTitle="Delete Antibody"
                    disabled={props.antibodySelected === undefined}
                    disabledTooltipTitle="Select an antibody to delete"
                    color="error"
                    variant={GetButtonStyle(
                        props.antibodySelected !== undefined,
                        isDarkTheme
                    )}
                    icon={DeleteIcon}
                    onClick={() => {
                        setOpenDeleteConfirm(true);
                    }}
                />
                <ConfirmDialog
                    open={openDeleteConfirm}
                    confirmText="Are you sure that you want to delete?"
                    onConfirm={() => {
                        if (props.antibodySelected) {
                            props.antibody_endpoint
                                .deleteAntibody(props.antibodySelected.id)
                                .then(() => {
                                    doOpenSnackBar(
                                        'Antibody Deleted!',
                                        'success',
                                        2000
                                    );
                                })
                                .catch((error) => {
                                    if (isAxiosError(error)) {
                                        doOpenSnackBar(
                                            `${
                                                error.response?.statusText ??
                                                'ERROR'
                                            }: ${
                                                error.response?.data.rsn ??
                                                error.message
                                            }`,
                                            'error',
                                            4000
                                        );
                                    }
                                });
                        }
                        setOpenDeleteConfirm(false);
                        props.doClear();
                    }}
                    onCancel={() => {
                        setOpenDeleteConfirm(false);
                    }}
                />
            </Box>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={snackBarAutoHideDuration}
                onClose={() => {
                    setOpenSnackBar(false);
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    severity={snackBarSeverity}
                    sx={{
                        fontSize: 16,
                        width: '100%'
                    }}
                    variant="filled"
                >
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function ManipulateButton(props: {
    tooltipTitle: string;
    disabledTooltipTitle?: string;
    icon: Icon;
    disabled?: boolean;
    variant?: 'text' | 'outlined' | 'contained' | undefined;
    color?: ColorType;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) {
    return (
        <Tooltip
            title={
                props.disabled ? props.disabledTooltipTitle : props.tooltipTitle
            }
            placement="bottom"
            disableInteractive
            arrow
        >
            <span>
                <Button
                    disabled={props.disabled}
                    color={props.color}
                    variant={props.variant}
                    onClick={props.onClick}
                >
                    <props.icon />
                </Button>
            </span>
        </Tooltip>
    );
}
