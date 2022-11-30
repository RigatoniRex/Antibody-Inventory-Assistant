import './App.css';
import { SearchForm } from './Components/SearchForm/SearchForm';
import React from 'react';
import { Antibody, AntibodyCollection } from './@types/antibody';
import dummydata from './test/dummydata.json';
// import { reactLogo } from './assets/assests';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MenuBar } from './Components/MenuBar/MenuBar';
import { CssBaseline } from '@mui/material';

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
                <SearchForm antibodies={antibodies} />
            </ThemeProvider>
            {/* <div className="App">
                <header className="App-header">
                    <img src={reactLogo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div> */}
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
        const newAntibody = new Antibody();
        newAntibody.marker = antibody.marker;
        newAntibody.reactivity = antibody.reactivity;
        newAntibody.color = antibody.color;
        newAntibody.clone = antibody.clone;
        newAntibody.company = antibody.company;
        newAntibody.catalog = antibody.catalog;
        newAntibody.isotype = antibody.isotype;
        newAntibody.dilutionFactor.Cytek = Number(antibody.DF.Cytek ?? 0);
        newAntibody.dilutionFactor.Fortessa = Number(antibody.DF.Fortessa ?? 0);
        newAntibody.detector = antibody.detector;
        newAntibody.laser = antibody.emission_wavelength;
        newAntibody.epitopeLocation = antibody.is_ec
            ? 'Surface'
            : 'Intracellular';
        return newAntibody;
    });
    return new AntibodyCollection(antibodyMapping);
}

export default App;
