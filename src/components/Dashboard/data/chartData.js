// 3. src/components/Dashboard/data/chartData.js
// ===========================================
export const revenueData = [
  { month: 'Jan', revenue: 18500, target: 20000 },
  { month: 'Feb', revenue: 19800, target: 20000 },
  { month: 'Mar', revenue: 21200, target: 22000 },
  { month: 'Apr', revenue: 20500, target: 22000 },
  { month: 'May', revenue: 23100, target: 24000 },
  { month: 'Jun', revenue: 24580, target: 24000 }
];

export const bookingsData = [
  { day: 'Mon', bookings: 12, cancellations: 2 },
  { day: 'Tue', bookings: 15, cancellations: 1 },
  { day: 'Wed', bookings: 18, cancellations: 3 },
  { day: 'Thu', bookings: 14, cancellations: 0 },
  { day: 'Fri', bookings: 20, cancellations: 2 },
  { day: 'Sat', bookings: 8, cancellations: 1 }
];

export const conversationsData = [
  { channel: 'SMS', count: 145 },
  { channel: 'Call', count: 89 },
  { channel: 'Webchat', count: 108 }
];

export const appointmentTypes = [
  { type: 'Cleaning', count: 28, revenue: 5600 },
  { type: 'Whitening', count: 12, revenue: 6000 },
  { type: 'Filling', count: 15, revenue: 4500 },
  { type: 'Root Canal', count: 8, revenue: 8000 },
  { type: 'Other', count: 5, revenue: 480 }
];

export const popularProcedures = [
  { name: 'Teeth Cleaning', value: 28, percentage: 35 },
  { name: 'Cavity Filling', value: 15, percentage: 19 },
  { name: 'Whitening', value: 12, percentage: 15 },
  { name: 'Crown', value: 10, percentage: 13 },
  { name: 'Root Canal', value: 8, percentage: 10 },
  { name: 'Extraction', value: 6, percentage: 8 }
];

export const insuranceProviders = [
  { provider: 'Delta Dental', count: 145 },
  { provider: 'Aetna', count: 98 },
  { provider: 'Cigna', count: 87 },
  { provider: 'Blue Cross', count: 76 },
  { provider: 'MetLife', count: 65 },
  { provider: 'United', count: 42 }
];

export const appointmentsByGender = [
  { type: 'Cleaning', male: 12, female: 16 },
  { type: 'Whitening', male: 4, female: 8 },
  { type: 'Filling', male: 8, female: 7 },
  { type: 'Root Canal', male: 5, female: 3 },
  { type: 'Crown', male: 6, female: 4 }
];

export const patientTypes = [
  { name: 'New Patients', value: 35, fill: '#3EE4C8' },
  { name: 'Returning Patients', value: 65, fill: '#45B7D1' }
];

export const revenueByType = [
  { name: 'Root Canal', value: 8000, fill: '#3EE4C8' },
  { name: 'Whitening', value: 6000, fill: '#45B7D1' },
  { name: 'Cleaning', value: 5600, fill: '#4ECDC4' },
  { name: 'Filling', value: 4500, fill: '#96CEB4' },
  { name: 'Crown', value: 3200, fill: '#F7B801' },
  { name: 'Other', value: 480, fill: '#DDA77B' }
];

export const patientSatisfaction = [
  { metric: 'Response Time', score: 92, fullMark: 100 },
  { metric: 'Accuracy', score: 88, fullMark: 100 },
  { metric: 'Helpfulness', score: 95, fullMark: 100 },
  { metric: 'Ease of Use', score: 90, fullMark: 100 },
  { metric: 'Resolution Rate', score: 85, fullMark: 100 },
  { metric: 'Overall Experience', score: 91, fullMark: 100 }
];