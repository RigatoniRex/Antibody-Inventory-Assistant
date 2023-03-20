import { AppBar, Toolbar, Switch, FormControlLabel } from '@mui/material';
import React from 'react';

export function MenuBar(props: {
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    function onSwitchChange(
        _: React.ChangeEvent<HTMLElement>,
        checked: boolean
    ) {
        props.setDarkMode(checked);
    }

    return (
        <AppBar position="sticky" sx={{ width: '100%' }}>
            <Toolbar>
                <FormControlLabel
                    control={
                        <Switch defaultChecked onChange={onSwitchChange} />
                    }
                    label="Dark Mode"
                />
            </Toolbar>
        </AppBar>
    );
}
