import { Box, Paper, SxProps } from '@mui/material';
import React from 'react';

export function ComponentPaper(props: { children: any; sx?: SxProps }) {
    return (
        <Box m={1} sx={props.sx}>
            <Paper variant="outlined">{props.children}</Paper>
        </Box>
    );
}
