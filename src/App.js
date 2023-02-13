import './App.scss';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return (
    // <>
    //   <BrowserRouter>
    //     <Routes>
    //       
    //     </Routes>
    //   </BrowserRouter>
    // </>

    code ? <Dashboard code={code} /> : <Login />
  );
}

export default App;
