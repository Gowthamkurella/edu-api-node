import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Register from './components/registration';
import Login from './components/login';
import AdminDashboard from './components/admin/admin-dashboard';
import UserDashboard from './components/user-dashboard';
import AddCourse from './components/admin/add-course';
import EditCourse from './components/admin/edit-course';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/register' element={<Register/>} />
          <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
          <Route path='/user-dashboard' element={<UserDashboard/>}/>
          <Route path='/add-course' element={<AddCourse/>}/>
          <Route path='/edit-course' element={<EditCourse/>}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;