// FILE 1: src/components/Dashboard/hooks/useDashboard.js
// ===========================================
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../../../redux/slices/authSlice";
import { fetchPatients } from "../../../redux/slices/patientSlice";

export const useDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from Redux store
  const { user: currentUser } = useSelector((state) => state.auth);
  const { list: patients, status: patientsStatus } = useSelector((state) => state.patients);
  
  // Fetch patients when component mounts or user changes
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchPatients());
    }
  }, [dispatch, currentUser?.id]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  // Transform real patients to match the expected format with dummy messages
  // In a real app, you'd fetch messages from your backend
  const transformedPatients = patients.map(patient => ({
    id: patient.id,
    firstName: patient.first_name,
    lastName: patient.last_name,
    unreadCount: Math.floor(Math.random() * 5), // Random unread count for demo
    messages: [
      // Add some default messages for demo purposes
      // In reality, you'd fetch these from your messages table
      {
        id: 1,
        sender: 'patient',
        channel: 'SMS',
        message: `Hi, this is ${patient.first_name}. I need some assistance.`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      }
    ]
  }));

  const handleSendMessage = (patientId, message, channel = 'SMS') => {
    // In a real application, you would:
    // 1. Send the message to your backend API
    // 2. Update the messages in your Redux store
    // 3. Possibly send real SMS/notifications
    
    const newMessage = {
      id: Date.now(),
      sender: 'staff',
      channel: channel,
      message: message,
      timestamp: new Date().toISOString()
    };

    // For now, we'll just log this since we don't have a messages system yet
    console.log('Sending message:', { patientId, message: newMessage });
    
    // TODO: Implement actual message sending logic
    // dispatch(sendMessage({ patientId, message: newMessage }));
  };

  return {
    mobileOpen,
    selectedIndex,
    setSelectedIndex,
    anchorEl,
    selectedPatient,
    setSelectedPatient,
    isMobile,
    patients: transformedPatients,
    currentUser,
    patientsStatus,
    handleDrawerToggle,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
    handleSendMessage,
    setMobileOpen
  };
};
