// backend/controllers/twilioUsageController.js
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error('❌ Missing Twilio credentials in .env file');
  console.error('TWILIO_ACCOUNT_SID:', accountSid ? '✅ Present' : '❌ Missing');
  console.error('TWILIO_AUTH_TOKEN:', authToken ? '✅ Present' : '❌ Missing');
}

const client = twilio(accountSid, authToken);

/**
 * ✅ UNIFIED API - Get all usage data in ONE call
 */
export async function getUsageStats(req, res) {
  try {
    console.log('📊 getUsageStats called - UNIFIED VERSION');
    console.log('Query params:', req.query);
    
    const { period = 'monthly' } = req.query;
    const dateRange = calculateDateRange(period);
    
    console.log('📅 Date range:', dateRange);
    
    // ✅ Fetch ALL usage records in ONE call
    const usageRecords = await client.usage.records.list({
      startDate: dateRange.start,
      endDate: dateRange.end,
      limit: 1000
    });
    
    console.log('✅ Received', usageRecords.length, 'usage records');
    
    // ✅ Process ALL data from the SAME response
    const stats = processUsageRecords(usageRecords);
    const costBreakdown = calculateCostBreakdown(usageRecords);
    
    // ✅ Get daily usage separately (but with same date range)
    const dailyUsage = await getDailyUsageData(dateRange);
    
    console.log('📊 Final unified response:');
    console.log('   Stats:', stats);
    console.log('   Cost breakdown:', costBreakdown);
    console.log('   Daily usage days:', dailyUsage.length);
    
    // ✅ Return EVERYTHING in one response
    res.json({
      success: true,
      period: period,
      dateRange: dateRange,
      stats: stats,
      costBreakdown: costBreakdown,
      dailyUsage: dailyUsage
    });
    
  } catch (error) {
    console.error('❌ Error in getUsageStats:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      error: 'Failed to fetch usage statistics',
      details: error.message
    });
  }
}

/**
 * ✅ Helper function to get daily usage
 */
async function getDailyUsageData(dateRange) {
  try {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    console.log('📅 Fetching daily usage from', dateRange.start, 'to', dateRange.end);
    
    const dailyRecords = await client.usage.records.daily.list({
      startDate: startDate,
      endDate: endDate,
      limit: 100
    });
    
    console.log('✅ Received', dailyRecords.length, 'daily records');
    
    if (dailyRecords.length === 0) {
      console.log('⚠️ No daily records found');
      return [];
    }
    
    return formatDailyUsageForCharts(dailyRecords);
  } catch (error) {
    console.error('❌ Error fetching daily usage:', error.message);
    return [];
  }
}

/**
 * DEPRECATED - Use getUsageStats instead
 */
export async function getDailyUsage(req, res) {
  console.warn('⚠️ DEPRECATED: Use getUsageStats instead');
  return getUsageStats(req, res);
}

/**
 * DEPRECATED - Use getUsageStats instead
 */
export async function getCostBreakdown(req, res) {
  console.warn('⚠️ DEPRECATED: Use getUsageStats instead');
  return getUsageStats(req, res);
}

/**
 * 🔍 DEBUG: Show ALL categories Twilio returns
 */
export async function debugUsageCategories(req, res) {
  try {
    console.log('🔍 DEBUG: Fetching all usage categories');
    
    const { period = 'monthly' } = req.query;
    const dateRange = calculateDateRange(period);
    
    const usageRecords = await client.usage.records.list({
      startDate: dateRange.start,
      endDate: dateRange.end,
      limit: 1000
    });
    
    // Group by category
    const categorySummary = {};
    usageRecords.forEach(record => {
      const cat = record.category;
      if (!categorySummary[cat]) {
        categorySummary[cat] = {
          count: 0,
          totalCount: 0,
          totalCost: 0,
          records: []
        };
      }
      categorySummary[cat].count++;
      categorySummary[cat].totalCount += parseInt(record.count) || 0;
      categorySummary[cat].totalCost += Math.abs(parseFloat(record.price)) || 0;
      categorySummary[cat].records.push({
        date: record.startDate,
        count: record.count,
        price: record.price
      });
    });
    
    // Filter to only categories with data
    const activeCategories = Object.entries(categorySummary)
      .filter(([_, data]) => data.totalCount > 0 || data.totalCost > 0)
      .sort((a, b) => b[1].totalCost - a[1].totalCost);
    
    res.json({
      success: true,
      period: period,
      dateRange: dateRange,
      totalRecords: usageRecords.length,
      activeCategories: Object.fromEntries(activeCategories),
      allCategories: categorySummary
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch debug data',
      details: error.message
    });
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function calculateDateRange(period, customStart, customEnd) {
  const now = new Date();
  let start, end;
  
  switch (period) {
    case 'today':
      start = new Date();
      start.setDate(start.getDate() - 1);
      end = new Date();
      break;
      
    case 'weekly':
      start = new Date();
      start.setDate(start.getDate() - 7);
      end = new Date();
      break;
      
    case 'monthly':
      start = new Date();
      start.setDate(start.getDate() - 30);
      end = new Date();
      break;
      
    case 'yearly':
      start = new Date();
      start.setDate(start.getDate() - 365);
      end = new Date();
      break;
      
    case 'custom':
      if (customStart && customEnd) {
        start = new Date(customStart);
        end = new Date(customEnd);
      } else {
        start = new Date();
        start.setDate(start.getDate() - 30);
        end = new Date();
      }
      break;
      
    default:
      start = new Date();
      start.setDate(start.getDate() - 30);
      end = new Date();
  }
  
  const formatDate = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    start: formatDate(start),
    end: formatDate(end)
  };
}

function processUsageRecords(records) {
  const stats = {
    totalCalls: 0,
    totalSMS: 0,
    callsInbound: 0,
    callsOutbound: 0,
    smsInbound: 0,
    smsOutbound: 0,
    callDuration: 0,
    totalCost: 0,
    currency: 'USD'
  };
  
  console.log('📊 PROCESSING', records.length, 'USAGE RECORDS');
  
  // ✅ ONLY use the most specific categories to avoid double-counting
  const VALID_CALL_CATEGORIES = [
    'calls-inbound-local',
    'calls-inbound-mobile',
    'calls-inbound-tollfree',
    'calls-outbound',
    'calls-client',
    'calls-sip-inbound',
    'calls-sip-outbound'
  ];
  
  const VALID_SMS_CATEGORIES = [
    'sms-inbound-longcode',
    'sms-inbound-shortcode',
    'sms-outbound-longcode',
    'sms-outbound-shortcode',
    'sms-outbound-tollfree',
    'sms-inbound-tollfree'
  ];
  
  records.forEach(record => {
    const category = record.category || '';
    const count = parseInt(record.count) || 0;
    const price = parseFloat(record.price) || 0;
    const usage = parseInt(record.usage) || 0;
    
    // Skip if no count
    if (count === 0 && price === 0) return;
    
    // ✅ CALLS - Only count specific categories
    if (VALID_CALL_CATEGORIES.includes(category)) {
      if (category.includes('inbound')) {
        stats.callsInbound += count;
      } else if (category.includes('outbound') || category.includes('client')) {
        stats.callsOutbound += count;
      }
      stats.totalCalls += count;
      stats.callDuration += usage;
      
      console.log(`  📞 ${category}: ${count} calls, ${usage}s, $${Math.abs(price).toFixed(4)}`);
    }
    
    // ✅ SMS - Only count specific categories
    else if (VALID_SMS_CATEGORIES.includes(category)) {
      if (category.includes('inbound')) {
        stats.smsInbound += count;
      } else if (category.includes('outbound')) {
        stats.smsOutbound += count;
      }
      stats.totalSMS += count;
      
      console.log(`  💬 ${category}: ${count} messages, $${Math.abs(price).toFixed(4)}`);
    }
    
    // ✅ Track total cost from ALL records
    stats.totalCost += Math.abs(price);
  });
  
  // Convert seconds to minutes
  stats.callDuration = Math.round(stats.callDuration / 60);
  stats.totalCost = Math.round(stats.totalCost * 100) / 100;
  
  console.log('✅ FINAL PROCESSED STATS:', stats);
  
  return stats;
}

function formatDailyUsageForCharts(records) {
  const grouped = {};
  
  const CALL_CATEGORIES = [
    'calls-inbound-local',
    'calls-inbound-mobile',
    'calls-inbound-tollfree',
    'calls-outbound',
    'calls-client',
    'calls-sip-inbound',
    'calls-sip-outbound'
  ];
  
  const SMS_CATEGORIES = [
    'sms-inbound-longcode',
    'sms-inbound-shortcode',
    'sms-outbound-longcode',
    'sms-outbound-shortcode',
    'sms-outbound-tollfree',
    'sms-inbound-tollfree'
  ];
  
  console.log('📊 Processing', records.length, 'daily records');
  
  records.forEach(record => {
    // ✅ Handle both Date objects and strings
    let dateStr;
    if (typeof record.startDate === 'string') {
      dateStr = record.startDate.split('T')[0];
    } else if (record.startDate instanceof Date) {
      dateStr = record.startDate.toISOString().split('T')[0];
    } else {
      console.warn('⚠️ Unknown startDate format:', record.startDate);
      return;
    }
    
    if (!grouped[dateStr]) {
      grouped[dateStr] = {
        date: dateStr,
        calls: 0,
        sms: 0,
        cost: 0
      };
    }
    
    const category = record.category || '';
    const count = parseInt(record.count) || 0;
    const price = Math.abs(parseFloat(record.price)) || 0;
    
    // ✅ Only count specific categories to match main stats
    if (CALL_CATEGORIES.includes(category)) {
      grouped[dateStr].calls += count;
    } else if (SMS_CATEGORIES.includes(category)) {
      grouped[dateStr].sms += count;
    }
    
    // ✅ Add all costs
    grouped[dateStr].cost += price;
  });
  
  // ✅ Convert to array and round costs
  const result = Object.values(grouped).map(day => ({
    ...day,
    cost: Math.round(day.cost * 100) / 100
  }));
  
  // ✅ Sort by date ascending
  result.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  console.log('📊 Formatted', result.length, 'days of usage data');
  console.log('📅 Date range:', result[0]?.date, 'to', result[result.length - 1]?.date);
  
  return result;
}

function calculateCostBreakdown(records) {
  const breakdown = {
    calls: { count: 0, cost: 0 },
    sms: { count: 0, cost: 0 },
    other: { count: 0, cost: 0 },
    totalCost: 0
  };
  
  console.log('💰 CALCULATING COST BREAKDOWN FROM', records.length, 'RECORDS');
  
  // ✅ ONLY use the most specific categories
  const CALL_CATEGORIES = [
    'calls-inbound-local',
    'calls-inbound-mobile',
    'calls-inbound-tollfree',
    'calls-outbound',
    'calls-client',
    'calls-sip-inbound',
    'calls-sip-outbound'
  ];
  
  const SMS_CATEGORIES = [
    'sms-inbound-longcode',
    'sms-inbound-shortcode',
    'sms-outbound-longcode',
    'sms-outbound-shortcode',
    'sms-outbound-tollfree',
    'sms-inbound-tollfree'
  ];
  
  const detailedBreakdown = {};
  
  records.forEach(record => {
    const category = record.category || '';
    const count = parseInt(record.count) || 0;
    const price = Math.abs(parseFloat(record.price)) || 0;
    
    // Skip if no cost
    if (price === 0) return;
    
    // Track detailed breakdown
    if (!detailedBreakdown[category]) {
      detailedBreakdown[category] = { count: 0, cost: 0 };
    }
    detailedBreakdown[category].count += count;
    detailedBreakdown[category].cost += price;
    
    // ✅ Categorize by specific categories only
    if (CALL_CATEGORIES.includes(category)) {
      breakdown.calls.count += count;
      breakdown.calls.cost += price;
    } else if (SMS_CATEGORIES.includes(category)) {
      breakdown.sms.count += count;
      breakdown.sms.cost += price;
    } else {
      // Everything else (phone numbers, A2P fees, etc.)
      breakdown.other.count += count;
      breakdown.other.cost += price;
    }
    
    breakdown.totalCost += price;
  });
  
  // ✅ LOG DETAILED BREAKDOWN (only items with cost)
  const itemsWithCost = Object.entries(detailedBreakdown)
    .filter(([_, data]) => data.cost > 0)
    .sort((a, b) => b[1].cost - a[1].cost);
  
  if (itemsWithCost.length > 0) {
    console.log('📊 DETAILED COST BREAKDOWN (Top 10 items):');
    console.table(Object.fromEntries(itemsWithCost.slice(0, 10)));
  }
  
  // Round costs
  breakdown.calls.cost = Math.round(breakdown.calls.cost * 100) / 100;
  breakdown.sms.cost = Math.round(breakdown.sms.cost * 100) / 100;
  breakdown.other.cost = Math.round(breakdown.other.cost * 100) / 100;
  breakdown.totalCost = Math.round(breakdown.totalCost * 100) / 100;
  
  console.log('✅ FINAL COST BREAKDOWN:', breakdown);
  
  return breakdown;
}