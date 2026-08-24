import Navbar from './Navbar';

function Home() {
    return (
        <div>
            <Navbar />

            <main>
                <h1>Welcome to Campusly 🎓</h1>
                <p>Your college community, all in one place.</p>

                <div>
                    <button>📚 Resources</button>
                    <button>📅 Events</button>
                    <button>🔎 Lost & Found</button>
                    <button>📝 Share Resource</button>
                </div>
            </main>
        </div>
    );
}

export default Home;