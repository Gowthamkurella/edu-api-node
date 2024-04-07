import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomAppBar from './admin-appbar'; // Adjust the import path according to your project structure
import axios from 'axios'; // Assuming axios is used for API requests

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
  
    useEffect(() => {
      // Fetch courses on component mount
      fetchCourses();
    }, []);
  
    const fetchCourses = async () => {
      // Placeholder for fetching courses logic
      // Replace URL with your actual endpoint
      const response = await axios.get('/api/courses');
      setCourses(response.data);
      setFilteredCourses(response.data);
    };
  
    const handleSearch = (event) => {
      const value = event.target.value.toLowerCase();
      setSearchInput(value);
      const filtered = courses.filter(course => 
        Object.values(course).some(val => 
          String(val).toLowerCase().includes(value)
        )
      );
      setFilteredCourses(filtered);
    };
  
    const handleDelete = async (courseId) => {
      // Placeholder for delete course logic
      // Replace URL with your actual endpoint
      await axios.delete(`/api/courses/${courseId}`);
      fetchCourses(); // Refresh the courses list after deletion
    };
  
    return (
      <div>
        <CustomAppBar username="Admin Name" /> {/* Pass the actual admin name if available */}
        <Container maxWidth="lg" sx={{ mt: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              placeholder="Search courses..."
              value={searchInput}
              onChange={handleSearch}
              sx={{ minWidth: '300px' }}
            />
            <Button variant="contained" onClick={() => {/* Navigate to Add Course page */}}>Add Course</Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Level</TableCell>
                {/* Add more columns as needed */}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map(course => (
                <TableRow key={course.courseid}>
                  <TableCell>{course.coursename}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  {/* Add more cells as needed */}
                  <TableCell>
                    <IconButton onClick={() => handleDelete(course.courseid)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </div>
    );
  };
  

export default AdminDashboard;
