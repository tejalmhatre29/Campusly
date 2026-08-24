import { useState } from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';

function App() {
    const [showLogin, setShowLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('access_token')
    );

    if (isLoggedIn) {
    return <Home />;
}

    return (
        <div>
            {showLogin ? (
                <Login onLogin={() => setIsLoggedIn(true)} />
            ) : (
                <Register />
            )}

            <button onClick={() => setShowLogin(!showLogin)}>
                {showLogin
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
            </button>
        </div>
    );
}

export default App;