import axios from 'axios';
import React from 'react';
import SessionHelper from '../../Auth/SessionHelper';
import { Navigate, useLocation } from 'react-router-dom';

async function tryLogin(): Promise<
    { success: true; lab: string } | { success: false }
> {
    try {
        const response = await axios.post('/login', undefined, {
            withCredentials: true
        });
        return { success: response.status === 200, lab: response.data.lab };
    } catch (error) {
        return { success: false };
    }
}

export function RequireAuth({
    sessionHelper,
    children
}: {
    sessionHelper: SessionHelper;
    children?: JSX.Element;
}) {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [attemptingLogin, setAttemptingLogin] = React.useState(true);
    let location = useLocation();

    React.useEffect(() => {
        if (attemptingLogin) {
            tryLogin().then((loggedIn) => {
                setLoggedIn(loggedIn.success);
                if (loggedIn.success) sessionHelper.login(loggedIn.lab);
                else sessionHelper.logout();
                setAttemptingLogin(false);
            });
        }
    }, [attemptingLogin, sessionHelper]);

    if (SessionHelper.getCookie('session')) {
        setAttemptingLogin(true);
    }
    function loggedInComponent() {
        if (attemptingLogin) {
            console.log('checking session');
            return <div>Checking Session! 🧐</div>;
        } else if (loggedIn) {
            // console.log('logged in');
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
