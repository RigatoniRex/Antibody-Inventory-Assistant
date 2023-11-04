import './App.css';
import { SearchForm } from './Components/SearchForm/SearchForm';
import React from 'react';
import {
    Antibody,
    AntibodyCollection
} from '@rigatonirex/antibody-library/antibody';
import berg_antibodies from './test/berg_antibodies.json';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MenuBar } from './Components/MenuBar/MenuBar';
import { CssBaseline } from '@mui/material';
import { Route, HashRouter, Routes } from 'react-router-dom';
import { LoginForm } from './Components/Login/Login';
import { RequireAuth } from './Components/Login/AuthRoute';

import axios from 'axios';
import { baseURL } from './baseurl';
import SessionHelper from './Auth/SessionHelper';

axios.defaults.baseURL = baseURL;
axios.defaults.maxRedirects = 0;
axios.defaults.validateStatus = function (status) {
    return status <= 302; // Reject only if the status code is greater than 302
};

function App() {
    const [darkMode, setDarkMode] = React.useState<boolean>(true);
    const [authorized, setAuthorized] = React.useState<boolean>(false);
    const sessionHelper = new SessionHelper(setAuthorized);
    const antibodies: AntibodyCollection = React.useMemo(() => {
        return getAntibodies();
    }, []);
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light'
                }
            }),
        [darkMode]
    );
    return (
        <>
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
                                        <RequireAuth
                                            sessionHelper={sessionHelper}
                                        >
                                            <SearchForm
                                                antibodies={antibodies}
                                            />
                                        </RequireAuth>
                                    }
                                />
                            );
                        })}
                        <Route path="login" element={<LoginForm />} />
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
        </>
    );
}

function getAntibodies(): AntibodyCollection {
    const antibodiesJSON: Antibody[] = berg_antibodies;
    const antibodyMapping = antibodiesJSON.map((antibody) => {
        const newAntibody: Antibody = JSON.parse(
            JSON.stringify(antibody)
        ) as Antibody;
        return newAntibody;
    });
    return new AntibodyCollection(antibodyMapping);
}

export default App;
