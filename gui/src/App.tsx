import './App.css';
import { SearchForm } from './Components/SearchForm/SearchForm';
import React from 'react';
import { AntibodyRecordCollection } from '@rigatonirex/antibody-library/antibody';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MenuBar } from './Components/MenuBar/MenuBar';
import { CssBaseline } from '@mui/material';
import { Route, HashRouter, Routes } from 'react-router-dom';
import { LoginForm } from './Components/Login/Login';
import { RequireAuth } from './Components/Login/AuthRoute';

import axios from 'axios';
import { baseURL } from './public.env';
import SessionHelper from './Auth/SessionHelper';
import AntibodyEndpoint from './Api/AntibodyEndpoint';
import { usePanel } from './Helpers/PanelHook';

axios.defaults.baseURL = baseURL;
axios.defaults.maxRedirects = 0;
axios.defaults.validateStatus = function (status) {
    return status <= 302; // Reject only if the status code is greater than 302
};

function App() {
    const [darkMode, setDarkMode] = React.useState<boolean>(true);
    const [authorized, setAuthorized] = React.useState<boolean>(false);
    const [lab, setLab] = React.useState<string>('');
    const sessionHelper = new SessionHelper(setAuthorized, setLab);
    const [antibodies, setAntibodies] =
        React.useState<AntibodyRecordCollection | null>(null);
    const panel = usePanel();
    const antibody_endpoint = new AntibodyEndpoint(
        lab,
        antibodies,
        setAntibodies
    );
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light'
                }
            }),
        [darkMode]
    );
    React.useEffect(() => {
        if (authorized && lab) {
            antibody_endpoint.updateAntibodiesState();
        }
        // eslint-disable-next-line
    }, [lab, authorized]);

    React.useEffect(() => {
        if (antibodies) {
            panel.update(antibodies);
        }
    }, [panel, antibodies]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter>
                <MenuBar
                    setDarkMode={setDarkMode}
                    authorized={authorized}
                    sessionHelper={sessionHelper}
                />
                <Routes>
                    {['/', '/home'].map((path) => {
                        return (
                            <Route
                                path={path}
                                key={path}
                                element={
                                    <RequireAuth sessionHelper={sessionHelper}>
                                        <SearchForm
                                            antibodies={antibodies}
                                            antibody_endpoint={
                                                antibody_endpoint
                                            }
                                        />
                                    </RequireAuth>
                                }
                            />
                        );
                    })}
                    <Route
                        path="login"
                        element={<LoginForm lab={lab} setLab={setLab} />}
                    />
                    <Route
                        path="about"
                        element={
                            <h1
                                style={{
                                    position: 'absolute',
                                    top: 200
                                }}
                            >
                                ToDo: Build About Page
                            </h1>
                        }
                    />
                    <Route
                        path="docs"
                        element={
                            <h1
                                style={{
                                    position: 'absolute',
                                    top: 200
                                }}
                            >
                                ToDo: Build Docs Page
                            </h1>
                        }
                    />
                </Routes>
            </HashRouter>
        </ThemeProvider>
    );
}

export default App;
