import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Snackbar,
    SxProps,
    TextField,
    Theme
} from '@mui/material';
import Slide, { SlideProps } from '@mui/material/Slide';
import { Science, Lock, Close } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect } from 'react';
import CatFact from './CatFact';

type TransitionProps = Omit<SlideProps, 'direction'>;

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
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState('');
    const [snackBarSeverity, setSnackBarSeverity] = React.useState<
        'error' | 'warning' | 'info' | 'success'
    >('info');

    useEffect(() => {
        setFirstRender(false);
    }, []);

    async function onSubmitLabClick() {
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
        try {
            const response = await axios.get('/lab', { timeout: 5000 });
            const labs = response.data as { id: string; lab: string }[];
            console.log(labs);
            const matches = labs.find((labResponse) => labResponse.lab === lab);
            if (matches) {
                setLabAvailable('available');
            } else {
                setLabAvailable('not available');
            }
            setChecking(false);
        } catch (error) {
            setOpenSnackBar(true);
            setSnackBarMessage(error.message);
            setSnackBarSeverity('error');
            setChecking(false);
        }
    }

    async function onLoginClick() {}

    async function onCreateClick() {}

    function chooseClickHandler() {
        switch (labAvailable) {
            case 'not set':
                return onSubmitLabClick;
            case 'available':
                return onLoginClick;
            case 'not available':
                return onCreateClick;
        }
    }

    function TransitionRight(props: TransitionProps) {
        return <Slide {...props} direction="left" />;
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
    function handleSnackbarClose() {
        setOpenSnackBar(false);
    }
    return (
        <Box
            sx={{
                ...props.sx,
                minHeight: 800,
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
                {labAvailable == 'not available' && (
                    <Box sx={{ color: 'green' }}>
                        <p>Lab doesn't exist, enter a password to create.</p>
                    </Box>
                )}
                <Box sx={{ display: 'flex', flexFlow: 'column', gap: 2 }}>
                    {checking ? (
                        <CircularProgress />
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={chooseClickHandler()}
                        >
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
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                TransitionComponent={TransitionRight}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackBarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
