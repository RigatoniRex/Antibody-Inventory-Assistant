import { AppBar, Box, Toolbar, Switch, FormControlLabel } from '@mui/material';
import { green } from '@mui/material/colors';
import React from 'react';

export function MenuBar(props: {
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Box position={'sticky'} sx={{ flexGrow: 1, zIndex: 1 }}>
            <AppBar sx={{ width: '100%' }}>
                <Toolbar>
                    <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Dark Mode"
                    />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
