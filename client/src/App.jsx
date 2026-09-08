import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
// Import pages (we will create these next)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseProfiles from './pages/BrowseProfiles';
import ProfileDetail from './pages/ProfileDetail';
import CreateProfile from './pages/CreateProfile';
import MyEnquiries from './pages/MyEnquiries';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="browse" element={<BrowseProfiles />} />
          <Route path="profile/:id" element={<ProfileDetail />} />
          <Route path="my-profile" element={<CreateProfile />} />
          <Route path="enquiries" element={<MyEnquiries />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
