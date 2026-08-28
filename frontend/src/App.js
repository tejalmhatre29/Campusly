import { useState } from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import Resources from './Components/Resources';
import Events from './Components/Events';
import LostFound from './Components/LostFound';

import './App.css';

function App() {
    const [showLogin, setShowLogin] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('access_token')
    );

    const [currentPage, setCurrentPage] = useState('home');

    if (!isLoggedIn) {
        return (
            <div>
                {showLogin ? (
                    <Login
                        onLogin={() => setIsLoggedIn(true)}
                        onRegister={() => setShowLogin(false)}
                    />
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

   if (currentPage === 'resources') {
    return (
        <Resources
            onNavigate={(page) => setCurrentPage(page)}
        />
    );
}

if (currentPage === 'events') {
    return (
        <Events
            onNavigate={(page) => setCurrentPage(page)}
        />
    );
}

if (currentPage === 'lostfound') {
    return (
        <LostFound
            onNavigate={(page) => setCurrentPage(page)}
        />
    );
}

    return (
        <Home
            onNavigate={(page) => setCurrentPage(page)}
        />
    );
}

export default App;