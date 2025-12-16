// src/components/Dashboard/components/Overview/DateRangePicker.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Popover,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  addMonths, 
  subMonths,
  addDays,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  subDays,
  startOfYear,
  endOfYear,
  subYears,
} from 'date-fns';

const DateRangePicker = ({ dateRange, onDateRangeChange, tokens }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const [tempStartDate, setTempStartDate] = useState(dateRange.startDate);
  const [tempEndDate, setTempEndDate] = useState(dateRange.endDate);
  const [hoveredDate, setHoveredDate] = useState(null);

  const isMobile = useMediaQuery('(max-width:600px)');
  const open = Boolean(anchorEl);

  const presets = [
    { label: 'Today', getValue: () => ({ startDate: new Date(), endDate: new Date() }) },
    { label: 'Yesterday', getValue: () => ({ startDate: subDays(new Date(), 1), endDate: subDays(new Date(), 1) }) },
    { label: 'Last 7 Days', getValue: () => ({ startDate: subDays(new Date(), 6), endDate: new Date() }) },
    { label: 'Last 30 Days', getValue: () => ({ startDate: subDays(new Date(), 29), endDate: new Date() }) },
    { label: 'This Month', getValue: () => ({ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) }) },
    { label: 'Last Month', getValue: () => ({ startDate: startOfMonth(subMonths(new Date(), 1)), endDate: endOfMonth(subMonths(new Date(), 1)) }) },
    { label: 'This Year', getValue: () => ({ startDate: startOfYear(new Date()), endDate: new Date() }) },
    { label: 'Last Year', getValue: () => ({ startDate: startOfYear(subYears(new Date(), 1)), endDate: endOfYear(subYears(new Date(), 1)) }) },
  ];

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setTempStartDate(dateRange.startDate);
    setTempEndDate(dateRange.endDate);
    setSelectingStart(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoveredDate(null);
  };

  const handlePresetClick = (preset) => {
    const range = preset.getValue();
    onDateRangeChange({ ...range, label: preset.label });
    handleClose();
  };

  const handleDateClick = (date) => {
    if (selectingStart) {
      setTempStartDate(date);
      setTempEndDate(null);
      setSelectingStart(false);
    } else {
      if (date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
      setSelectingStart(true);
    }
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onDateRangeChange({ startDate: tempStartDate, endDate: tempEndDate, label: 'Custom Range' });
      handleClose();
    }
  };

  const renderHeader = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <IconButton 
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        size="small"
        sx={{ color: tokens.textSecondary, '&:hover': { background: tokens.accentMuted, color: tokens.accent } }}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      <Typography sx={{ fontWeight: 600, color: tokens.textPrimary, fontSize: { xs: '0.8rem', sm: '0.875rem' }, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
        {format(currentMonth, 'MMMM yyyy')}
      </Typography>
      <IconButton 
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        size="small"
        sx={{ color: tokens.textSecondary, '&:hover': { background: tokens.accentMuted, color: tokens.accent } }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.25, mb: 0.5 }}>
        {days.map(day => (
          <Typography key={day} sx={{ 
            textAlign: 'center', fontSize: '0.6rem', fontWeight: 600, color: tokens.textTertiary, py: 0.5,
            textTransform: 'uppercase', letterSpacing: '0.03em', fontFamily: '"DM Sans", system-ui, sans-serif',
          }}>
            {day}
          </Typography>
        ))}
      </Box>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isStart = tempStartDate && isSameDay(day, tempStartDate);
        const isEnd = tempEndDate && isSameDay(day, tempEndDate);
        const isInRange = tempStartDate && tempEndDate && isWithinInterval(day, { start: tempStartDate, end: tempEndDate });
        const isHoveredRange = tempStartDate && !tempEndDate && hoveredDate && isWithinInterval(day, { 
          start: day < tempStartDate ? day : tempStartDate, 
          end: day < tempStartDate ? tempStartDate : hoveredDate 
        });
        const isToday = isSameDay(day, new Date());

        days.push(
          <Box
            key={day.toString()}
            onClick={() => isCurrentMonth && handleDateClick(cloneDay)}
            onMouseEnter={() => !selectingStart && setHoveredDate(cloneDay)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: { xs: 30, sm: 32 },
              width: { xs: 30, sm: 32 },
              borderRadius: isStart || isEnd ? '50%' : isInRange || isHoveredRange ? 0 : '50%',
              cursor: isCurrentMonth ? 'pointer' : 'default',
              opacity: isCurrentMonth ? 1 : 0.3,
              background: isStart || isEnd ? tokens.accent : isInRange || isHoveredRange ? tokens.accentMuted : 'transparent',
              color: isStart || isEnd ? '#000' : isToday ? tokens.accent : tokens.textPrimary,
              fontWeight: isToday || isStart || isEnd ? 600 : 400,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              fontFamily: '"DM Sans", system-ui, sans-serif',
              transition: 'all 0.15s ease',
              '&:hover': isCurrentMonth ? { background: isStart || isEnd ? tokens.accent : tokens.accentMuted } : {},
            }}
          >
            {format(day, 'd')}
          </Box>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Box key={day.toString()} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.25 }}>
          {days}
        </Box>
      );
      days = [];
    }
    return rows;
  };

  const formatDisplayRange = () => {
    if (dateRange.label !== 'Custom Range') return dateRange.label;
    const start = format(dateRange.startDate, 'MMM d');
    const end = format(dateRange.endDate, 'MMM d');
    return start === end ? start : `${start} - ${end}`;
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: { xs: 0.75, sm: 1 },
          borderRadius: '10px',
          background: tokens.accentMuted,
          border: `1px solid ${tokens.border}`,
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          transition: 'all 0.15s ease',
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'center', sm: 'flex-start' },
          '&:hover': { borderColor: tokens.accent },
        }}
      >
        <CalendarIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: tokens.accent }} />
        <Typography sx={{ color: tokens.textPrimary, fontSize: { xs: '0.75rem', sm: '0.8125rem' }, fontWeight: 600, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
          {formatDisplayRange()}
        </Typography>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: isMobile ? 'center' : 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            background: '#18181b88',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${tokens.border}`,
            boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            maxWidth: { xs: '95vw', sm: 'none' },
            maxHeight: { xs: '85vh', sm: 'none' },
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, minWidth: { xs: 280, sm: 440 } }}>
          {/* Presets Panel */}
          <Box sx={{ 
            width: { xs: '100%', sm: 130 },
            borderRight: { xs: 'none', sm: `1px solid ${tokens.border}` },
            borderBottom: { xs: `1px solid ${tokens.border}`, sm: 'none' },
            p: { xs: 1.5, sm: 2 },
            background: tokens.bg,
          }}>
            <Typography sx={{ 
              fontSize: '0.5625rem', fontWeight: 600, color: tokens.textTertiary, textTransform: 'uppercase',
              letterSpacing: '0.05em', mb: 1, display: { xs: 'none', sm: 'block' }, fontFamily: '"DM Sans", system-ui, sans-serif',
            }}>
              Quick Select
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, gap: 0.5, flexWrap: { xs: 'wrap', sm: 'nowrap' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  sx={{
                    justifyContent: 'center',
                    px: { xs: 1, sm: 1.5 },
                    py: { xs: 0.5, sm: 0.75 },
                    borderRadius: '6px',
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    fontWeight: dateRange.label === preset.label ? 600 : 400,
                    color: dateRange.label === preset.label ? tokens.accent : tokens.textSecondary,
                    background: dateRange.label === preset.label ? tokens.accentMuted : 'transparent',
                    textTransform: 'none',
                    minWidth: { xs: 'auto', sm: '100%' },
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    '&:hover': { background: tokens.accentMuted, color: tokens.accent },
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Calendar Panel */}
          <Box sx={{ p: { xs: 1.5, sm: 2 }, flex: 1 }}>
            {/* Selected Range Display */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 1.5, borderBottom: `1px solid ${tokens.border}` }}>
              <Box 
                onClick={() => setSelectingStart(true)}
                sx={{ 
                  flex: 1, p: 1, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s ease',
                  background: selectingStart ? tokens.accentMuted : tokens.bg,
                  border: `1px solid ${selectingStart ? tokens.accent : 'transparent'}`,
                }}
              >
                <Typography sx={{ fontSize: '0.5625rem', color: tokens.textTertiary, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                  Start
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, fontWeight: 600, color: tokens.textPrimary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                  {tempStartDate ? format(tempStartDate, 'MMM d, yyyy') : 'Select'}
                </Typography>
              </Box>
              <Box sx={{ color: tokens.textTertiary, fontSize: '0.75rem' }}>→</Box>
              <Box 
                onClick={() => tempStartDate && setSelectingStart(false)}
                sx={{ 
                  flex: 1, p: 1, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s ease',
                  background: !selectingStart ? tokens.accentMuted : tokens.bg,
                  border: `1px solid ${!selectingStart ? tokens.accent : 'transparent'}`,
                }}
              >
                <Typography sx={{ fontSize: '0.5625rem', color: tokens.textTertiary, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                  End
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, fontWeight: 600, color: tokens.textPrimary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                  {tempEndDate ? format(tempEndDate, 'MMM d, yyyy') : 'Select'}
                </Typography>
              </Box>
            </Box>

            {/* Calendar */}
            {renderHeader()}
            {renderDays()}
            <Box sx={{ minHeight: { xs: 170, sm: 190 } }}>{renderCells()}</Box>

            {/* Apply Button */}
            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${tokens.border}` }}>
              <Button
                fullWidth
                onClick={handleApply}
                disabled={!tempStartDate || !tempEndDate}
                sx={{
                  py: 1,
                  borderRadius: '8px',
                  background: tokens.accent,
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  '&:hover': { background: '#0d9668' },
                  '&:disabled': { background: tokens.border, color: tokens.textTertiary },
                }}
              >
                Apply Range
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default DateRangePicker;