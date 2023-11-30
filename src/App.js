import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import About from './Components/About'
import Training from './Components/Training';

function App() {
    return (
        <Router>
            <div>
                <Navbar key="navbar" />

                <Routes>
                    <Route exact path='/' element={<Home key="home" />} />
                    <Route exact path='/about' element={<About key="about" />} />
                    <Route exact path='/train' element={<Training key="train" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
