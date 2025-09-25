// 4. src/components/Dashboard/hooks/useDashboard.js
// ===========================================
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../../../redux/slices/authSlice";
import { INITIAL_PATIENTS } from '../data/mockData';

export const useDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

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

  const handleSendMessage = (patientId, message, channel = 'SMS') => {
    const newMessage = {
      id: Date.now(),
      sender: 'staff',
      channel: channel,
      message: message,
      timestamp: new Date().toISOString()
    };

    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === patientId 
          ? { ...patient, messages: [...patient.messages, newMessage] }
          : patient
      )
    );
  };

  return {
    mobileOpen,
    selectedIndex,
    setSelectedIndex,
    anchorEl,
    selectedPatient,
    setSelectedPatient,
    isMobile,
    patients,
    currentUser,
    handleDrawerToggle,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
    handleSendMessage,
    setMobileOpen
  };
};
