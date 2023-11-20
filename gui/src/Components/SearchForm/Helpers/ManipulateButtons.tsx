import React from 'react';
import { Box, Button, SvgIconTypeMap, Tooltip, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import { Antibody } from '@rigatonirex/antibody-library/antibody';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import AntibodyEndpoint from '../../../api/AntibodyEndpoint';
import ConfirmDialog from '../../ConfirmDialog/ConfigDialog';

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
    antibodySelected: Antibody | undefined;
    antibody_endpoint: AntibodyEndpoint;
}) {
    const isDarkTheme = useTheme().palette.mode === 'dark';
    const [openDeleteConfirm, setOpenDeleteConfirm] =
        React.useState<boolean>(false);
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
                    icon={AddIcon}
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
                    disabled={props.antibodySelected === undefined}
                    color="secondary"
                    variant={GetButtonStyle(
                        props.antibodySelected !== undefined,
                        isDarkTheme
                    )}
                    icon={PlaylistAddIcon}
                />
                <ManipulateButton
                    tooltipTitle="Edit Antibody"
                    disabled={props.antibodySelected === undefined}
                    color="warning"
                    variant={GetButtonStyle(
                        props.antibodySelected !== undefined,
                        isDarkTheme
                    )}
                    icon={EditIcon}
                />
                <ManipulateButton
                    tooltipTitle="Delete Antibody"
                    disabled={props.antibodySelected === undefined}
                    color="error"
                    variant={GetButtonStyle(
                        props.antibodySelected !== undefined,
                        isDarkTheme
                    )}
                    icon={RemoveIcon}
                    onClick={() => {
                        setOpenDeleteConfirm(true);
                    }}
                />
                <ConfirmDialog
                    open={openDeleteConfirm}
                    confirmText="Are you sure that you want to delete?"
                    onConfirm={() => {
                        if (props.antibodySelected) {
                            props.antibody_endpoint.deleteAntibody(
                                props.antibodySelected.id
                            );
                        }
                        setOpenDeleteConfirm(false);
                    }}
                    onCancel={() => {
                        setOpenDeleteConfirm(false);
                    }}
                />
            </Box>
        </Box>
    );
}

function ManipulateButton(props: {
    tooltipTitle: string;
    icon: Icon;
    disabled?: boolean;
    variant?: 'text' | 'outlined' | 'contained' | undefined;
    color?: ColorType;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) {
    return (
        <Tooltip
            title={props.tooltipTitle}
            placement="bottom"
            disableInteractive
            arrow
        >
            <Button
                disabled={props.disabled}
                color={props.color}
                variant={props.variant}
                onClick={props.onClick}
            >
                <props.icon />
            </Button>
        </Tooltip>
    );
}
