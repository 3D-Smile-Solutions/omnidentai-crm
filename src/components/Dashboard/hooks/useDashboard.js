//src/components/Dashboard/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../../../redux/slices/authSlice";
import { fetchPatients } from "../../../redux/slices/patientSlice";
import { 
  fetchUnreadCounts, 
  setCurrentPatient, 
  clearCurrentPatient,
  sendMessage,
  fetchMessagesWithPatient,
  markMessagesAsRead
} from "../../../redux/slices/messageSlice";

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
  const { 
    messagesByPatient, 
    currentMessages, 
    unreadCounts,
    fetchStatus: messagesFetchStatus,
    sendStatus: messageSendStatus 
  } = useSelector((state) => state.messages);
  
  // Fetch patients and unread counts when component mounts or user changes
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchPatients());
      dispatch(fetchUnreadCounts());
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

  // Transform real patients to include message data
  const transformedPatients = patients.map(patient => {
    const patientMessages = messagesByPatient[patient.id]?.messages || [];
    const unreadCount = unreadCounts[patient.id] || 0;
    
    return {
      id: patient.id,
      firstName: patient.first_name,
      lastName: patient.last_name,
      unreadCount,
      messages: patientMessages
    };
  });

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    dispatch(setCurrentPatient(patient.id));
    
    // Fetch messages for this patient if not already loaded
    if (!messagesByPatient[patient.id] || messagesByPatient[patient.id].messages.length === 0) {
      dispatch(fetchMessagesWithPatient(patient.id));
    }
    
    // Mark messages as read when patient is selected
    if (unreadCounts[patient.id] > 0) {
      dispatch(markMessagesAsRead(patient.id));
    }
  };

  const handleSendMessage = async (patientId, message, channel = 'webchat') => {
    try {
      await dispatch(sendMessage({ 
        patientId, 
        content: message, 
        channelType: channel 
      })).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return {
    mobileOpen,
    selectedIndex,
    setSelectedIndex,
    anchorEl,
    selectedPatient,
    setSelectedPatient: handleSelectPatient,
    isMobile,
    patients: transformedPatients,
    currentUser,
    patientsStatus,
    messagesFetchStatus,
    messageSendStatus,
    handleDrawerToggle,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
    handleSendMessage,
    setMobileOpen
  };
};
