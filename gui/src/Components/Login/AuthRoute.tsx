import axios from 'axios';
import React from 'react';
import CookieHelper from '../../Utils/CookieHelper';
import { Navigate, useLocation } from 'react-router-dom';

async function tryLogin() {
    try {
        const response = await axios.post(
            '/login',
            {},
            { withCredentials: true }
        );
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

export function RequireAuth({ children }: { children?: JSX.Element }) {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [attemptingLogin, setAttemptingLogin] = React.useState(true);
    let location = useLocation();

    React.useEffect(() => {
        if (attemptingLogin) {
            tryLogin().then((loggedIn) => {
                setLoggedIn(loggedIn);
                setAttemptingLogin(false);
            });
        }
    }, [attemptingLogin]);

    if (CookieHelper.getCookie('session')) {
        setAttemptingLogin(true);
    }
    function loggedInComponent() {
        if (attemptingLogin) {
            console.log('checking session');
            return <div>Checking Session! 🧐</div>;
        } else if (loggedIn) {
            console.log('logged in');
            return children ?? null;
        } else {
            console.log('navigate');
            console.log(attemptingLogin);
            console.log(loggedIn);
            return <Navigate to="/login" state={{ from: location }} />;
        }
    }
    return loggedInComponent();
}
