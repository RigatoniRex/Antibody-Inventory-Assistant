import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    SxProps,
    TextField,
    Theme
} from '@mui/material';
import Slide, { SlideProps } from '@mui/material/Slide';
import { Science, Lock } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import CatFact from './CatFact';
import { useNavigate } from 'react-router-dom';

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionRight(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
}

export function LoginForm(props: {
    setLoggedIn: (loggedIn: boolean) => void;
    sx?: SxProps<Theme>;
}) {
    const navigate = useNavigate();
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
            setSnackbarError(error.message);
            setChecking(false);
        }
    }

    async function onLoginClick() {
        try {
            const login = await axios.post(
                '/login',
                { lab: lab },
                {
                    headers: { Authorization: password }
                }
            );
            if (login.status === 200) {
                props.setLoggedIn(true);
                navigate('/');
            } else {
                throw new Error('Unexpected Login Success Path');
            }
        } catch (error) {
            if (error.response && error.response.status) {
                switch (error.response.status) {
                    case 400: //Invalid body in request
                    case 401: //Invalid password
                    case 404: //Lab not found
                    default:
                        if (error.response.data && error.response.data.rsn) {
                            const response = error.response.data as {
                                msg: string;
                                rsn: string;
                            };
                            setSnackbarError(response.rsn);
                        } else {
                            setSnackbarError('Failed to login');
                        }
                        break;
                }
            }
        }
    }

    async function onCreateClick() {
        const create = await axios.post('/lab', {
            lab: lab,
            password: password
        });
        if (create.status === 200) {
            setSnackbarSuccess(`${lab} Lab Created!`);
            setPassword('');
            setLabAvailable('available');
        } else {
            setSnackbarError(create.data);
        }
    }

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

    function handleLabChange(event: any) {
        setLab(event.target.value);
        setValidLab({
            value: true,
            reason: ''
        });
    }
    function setSnackbarError(errorMessage: string) {
        setOpenSnackBar(true);
        setSnackBarMessage(errorMessage);
        setSnackBarSeverity('error');
    }
    function setSnackbarSuccess(successMessage: string) {
        setOpenSnackBar(true);
        setSnackBarMessage(successMessage);
        setSnackBarSeverity('success');
    }
    function handleCancelClick() {
        setLab('');
        setPassword('');
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
                            value={password}
                        />
                    </Box>
                )}
                {labAvailable === 'not available' && (
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
