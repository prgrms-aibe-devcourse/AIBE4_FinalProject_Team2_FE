import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navigation.jsx';
import Home from './pages/Home.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import Correction from "./pages/Correction.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import Signup from './pages/Signup.jsx';
import OAuthCallback from './pages/OAuthCallback.jsx';
import Footer from "./components/Footer.jsx";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/main" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/correction" element={<Correction />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;