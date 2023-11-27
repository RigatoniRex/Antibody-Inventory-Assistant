import { Box, Paper, SxProps } from '@mui/material';
import React from 'react';
import { SelectableList } from './SelectableList';

export function ComponentPaper(props: {
    children?: any;
    sx?: SxProps;
    items: any[];
    onItemSelect?: (item: any) => void;
    clearSelected?: boolean;
    title: string;
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexFlow: 'column',
                height: 1,
                ...props.sx
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    margin: 1,
                    height: 1,
                    maxHeight: '97%',
                    paddingTop: 1,
                    alignItems: 'center',
                    display: 'flex',
                    flexFlow: 'column'
                }}
            >
                <h2>{props.title}</h2>
                <hr style={{ width: '75%' }} />
                {props.children}
                <SelectableList
                    items={props.items}
                    onItemSelect={props.onItemSelect}
                    clearSelected={props.clearSelected}
                />
            </Paper>
        </Box>
    );
}
