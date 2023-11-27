import React from 'react';
import { Box, Button, Dialog, DialogTitle } from '@mui/material';

export default function ConfirmDialog(props: {
    open: boolean;
    confirmText: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <Dialog open={props.open}>
            <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column' }}>
                <DialogTitle>{props.confirmText}</DialogTitle>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'end',
                        gap: 2,
                        marginRight: 2
                    }}
                >
                    <Button
                        variant="contained"
                        color="success"
                        onClick={props.onConfirm}
                    >
                        Yes
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={props.onCancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
