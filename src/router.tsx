import { Route, Routes } from 'react-router-dom';
import OAuthCallback from './components/OAuth';
import App from './app';
function Router() {

  return <Routes>   
    <Route path='/' element={<App />} />
    <Route path='/oauth' element={<OAuthCallback />} />
  </Routes>
}

export default Router;