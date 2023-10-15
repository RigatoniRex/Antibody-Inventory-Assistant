import './App.css';
import { SearchForm } from './Components/SearchForm/SearchForm';
import React from 'react';
import { Antibody, AntibodyCollection } from 'antibody-library/antibody';
import dummydata from './test/dummydata.json';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MenuBar } from './Components/MenuBar/MenuBar';
import { CssBaseline } from '@mui/material';
import { Route, HashRouter, Routes } from 'react-router-dom';
import { LoginForm } from './Components/Login/Login';
import { RequireAuth } from './Components/Login/AuthRoute';

import axios from 'axios';
import { baseURL } from './baseurl';

axios.defaults.baseURL = baseURL;
axios.defaults.maxRedirects = 0;
axios.defaults.validateStatus = function (status) {
    return status <= 302; // Reject only if the status code is greater than 302
};

function App() {
    const [darkMode, setDarkMode] = React.useState<boolean>(true);
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
                <MenuBar setDarkMode={setDarkMode} />
                <CssBaseline />
                <HashRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <RequireAuth>
                                    <SearchForm antibodies={antibodies} />
                                </RequireAuth>
                            }
                        />
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
    const antibodiesJSON: {
        marker: string;
        reactivity: string;
        color: string;
        clone: string;
        company: string;
        catalog: string;
        isotype: string;
        DF: {
            Cytek: string;
            Fortessa: string;
        };
        detector: string;
        emission_wavelength: string;
        is_ec: string;
        is_ic: string;
    }[] = dummydata.antibodies;
    const antibodyMapping = antibodiesJSON.map((antibody) => {
        const newAntibody: Antibody = {
            marker: antibody.marker,
            reactivity: antibody.reactivity,
            color: antibody.color,
            clone: antibody.clone,
            company: antibody.company,
            catalog: antibody.catalog,
            isotype: antibody.isotype,
            dilutionFactor: {
                Cytek: Number(antibody.DF.Cytek ?? 0),
                Fortessa: Number(antibody.DF.Fortessa ?? 0)
            },
            detector: antibody.detector,
            laser: antibody.emission_wavelength,
            epitopeLocation: antibody.is_ec ? 'Surface' : 'Intracellular'
        };
        return newAntibody;
    });
    return new AntibodyCollection(antibodyMapping);
}

export default App;
