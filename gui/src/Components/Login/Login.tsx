import {
    Box,
    Button,
    CircularProgress,
    Paper,
    SxProps,
    TextField,
    Theme
} from '@mui/material';
import { Science, Lock } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect } from 'react';
import CatFact from './CatFact';

export function LoginForm(props: { sx?: SxProps<Theme> }) {
    const [firstRender, setFirstRender] = React.useState(true);
    const [labAvailable, setLabAvailable] = React.useState<
        'available' | 'not available' | 'not set'
    >('not set');
    const [lab, setLab] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [checking, setChecking] = React.useState(false);
    const [validLab, setValidLab] = React.useState({
        value: true,
        reason: ''
    });
    const [validPassword, setValidPassword] = React.useState({
        value: true,
        reason: ''
    });

    useEffect(() => {
        setFirstRender(false);
    }, []);

    async function onSubmitClick() {
        const invalidLab = !lab;
        const invalidPassword = !password && labAvailable !== 'not set';
        if (invalidLab || invalidPassword) {
            if (invalidLab) {
                setLabAvailable('not set');
                setValidLab({
                    value: false,
                    reason: 'Lab cannot be empty'
                });
            }
            if (invalidPassword) {
                setValidPassword({
                    value: false,
                    reason: 'Password cannot be empty'
                });
            }
            return;
        }
        setChecking(true);
        const response = await axios.get('/lab', {});
        const labs = response.data as { id: string; lab: string }[];
        console.log(labs);
        const matches = labs.find((labResponse) => labResponse.lab === lab);
        if (matches) {
            setLabAvailable('available');
        } else {
            setLabAvailable('not available');
        }
        setChecking(false);
    }

    function handleLabChange(event: any) {
        setLab(event.target.value);
        setValidLab({
            value: true,
            reason: ''
        });
    }

    function handleCancelClick() {
        setLab('');
        setLabAvailable('not set');
    }

    return (
        <Box
            sx={{
                ...props.sx,
                minHeight: 800,
                marginTop: 20,
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexFlow: 'column',
                gap: 4
            }}
        >
            <Paper
                elevation={20}
                sx={{
                    maxWidth: 500,
                    width: '80vw',
                    alignItems: 'center',
                    textAlign: 'center',
                    ...props.sx,
                    padding: 10,
                    display: 'flex',
                    flexFlow: 'column',
                    gap: 2
                }}
            >
                <h1>Welcome to Bods</h1>
                <Box
                    sx={{
                        display: 'flex',
                        width: 250,
                        flexFlow: 'row',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Science />
                    <TextField
                        id="Lab"
                        onChange={handleLabChange}
                        label="Lab"
                        autoComplete="off"
                        type={'search'}
                        value={lab}
                        sx={{ width: 250 }}
                        error={!validLab.value}
                        helperText={validLab.value ? '' : validLab.reason}
                        disabled={labAvailable !== 'not set'}
                    />
                </Box>
                {labAvailable !== 'not set' && (
                    <Box
                        sx={{
                            display: 'flex',
                            width: 250,
                            flexFlow: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <Lock />
                        <TextField
                            label="Password"
                            type={'password'}
                            sx={{ width: 250 }}
                            error={!validPassword.value}
                            helperText={
                                validPassword.value ? '' : validPassword.reason
                            }
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Box>
                )}
                <Box sx={{ display: 'flex', flexFlow: 'column', gap: 2 }}>
                    {checking ? (
                        <CircularProgress />
                    ) : (
                        <Button variant="outlined" onClick={onSubmitClick}>
                            {labAvailable === 'not available'
                                ? 'Create'
                                : 'Login'}
                        </Button>
                    )}
                    {labAvailable !== 'not set' && (
                        <Button variant="outlined" onClick={handleCancelClick}>
                            Cancel
                        </Button>
                    )}
                </Box>
            </Paper>
            <CatFact update={checking || firstRender} />
        </Box>
    );
}
