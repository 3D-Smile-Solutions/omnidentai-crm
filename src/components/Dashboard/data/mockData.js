export const INITIAL_PATIENTS = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Johnson',
    unreadCount: 2,
    messages: [
      { id: 1, sender: 'patient', channel: 'SMS', message: 'Hi, I need to reschedule my appointment for next week', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 2, sender: 'staff', channel: 'SMS', message: 'Of course! What day works best for you?', timestamp: new Date(Date.now() - 85000000).toISOString() },
      { id: 3, sender: 'patient', channel: 'SMS', message: 'Tuesday or Thursday afternoon would be perfect', timestamp: new Date(Date.now() - 84000000).toISOString() },
      { id: 4, sender: 'staff', channel: 'Webchat', message: 'I have an opening on Tuesday at 2:30 PM. Does that work?', timestamp: new Date(Date.now() - 83000000).toISOString() },
      { id: 5, sender: 'patient', channel: 'Webchat', message: 'Yes, that works great! Thank you', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ]
  },
  {
    id: 2,
    firstName: 'Michael',
    lastName: 'Chen',
    unreadCount: 0,
    messages: [
      { id: 1, sender: 'staff', channel: 'Call', message: 'Called patient regarding insurance verification', timestamp: new Date(Date.now() - 172800000).toISOString() },
      { id: 2, sender: 'patient', channel: 'SMS', message: 'Thanks for the call. I\'ll send the insurance card photo', timestamp: new Date(Date.now() - 172000000).toISOString() },
      { id: 3, sender: 'staff', channel: 'SMS', message: 'Perfect! We received your insurance information and everything looks good', timestamp: new Date(Date.now() - 170000000).toISOString() }
    ]
  },
  {
    id: 3,
    firstName: 'Emily',
    lastName: 'Davis',
    unreadCount: 3,
    messages: [
      { id: 1, sender: 'patient', channel: 'Webchat', message: 'Is teeth whitening covered by my dental plan?', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 2, sender: 'staff', channel: 'Webchat', message: 'Let me check your coverage details', timestamp: new Date(Date.now() - 7100000).toISOString() },
      { id: 3, sender: 'staff', channel: 'Webchat', message: 'Unfortunately, cosmetic procedures like teeth whitening are not covered by your current plan', timestamp: new Date(Date.now() - 7000000).toISOString() },
      { id: 4, sender: 'patient', channel: 'SMS', message: 'What would be the out-of-pocket cost?', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: 5, sender: 'patient', channel: 'SMS', message: 'Also, how long does the procedure take?', timestamp: new Date(Date.now() - 900000).toISOString() },
      { id: 6, sender: 'patient', channel: 'Call', message: 'And are there any side effects I should know about?', timestamp: new Date(Date.now() - 300000).toISOString() }
    ]
  },
  {
    id: 4,
    firstName: 'Robert',
    lastName: 'Williams',
    unreadCount: 1,
    messages: [
      { id: 1, sender: 'staff', channel: 'SMS', message: 'Reminder: Your cleaning appointment is tomorrow at 10 AM', timestamp: new Date(Date.now() - 14400000).toISOString() },
      { id: 2, sender: 'patient', channel: 'SMS', message: 'Thank you for the reminder! See you tomorrow', timestamp: new Date(Date.now() - 14000000).toISOString() },
      { id: 3, sender: 'patient', channel: 'Webchat', message: 'Quick question - should I avoid eating before the appointment?', timestamp: new Date(Date.now() - 600000).toISOString() }
    ]
  },
  {
    id: 5,
    firstName: 'Jessica',
    lastName: 'Martinez',
    unreadCount: 0,
    messages: [
      { id: 1, sender: 'patient', channel: 'Webchat', message: 'My tooth has been hurting for the past two days', timestamp: new Date(Date.now() - 259200000).toISOString() },
      { id: 2, sender: 'staff', channel: 'Webchat', message: 'I\'m sorry to hear that. Can you describe the pain? Is it sharp or throbbing?', timestamp: new Date(Date.now() - 258000000).toISOString() },
      { id: 3, sender: 'patient', channel: 'Call', message: 'It\'s a sharp pain when I eat something cold or sweet', timestamp: new Date(Date.now() - 257000000).toISOString() },
      { id: 4, sender: 'staff', channel: 'Call', message: 'That sounds like tooth sensitivity. Let\'s schedule an examination. We have an opening tomorrow at 3 PM', timestamp: new Date(Date.now() - 256000000).toISOString() },
      { id: 5, sender: 'patient', channel: 'SMS', message: 'I\'ll take it. Thank you!', timestamp: new Date(Date.now() - 255000000).toISOString() }
    ]
  }
];