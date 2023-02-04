import './App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return (

    code ? <Dashboard code={code} /> : <Login />
  );
}

export default App;
