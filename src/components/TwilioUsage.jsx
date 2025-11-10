// src/components/TwilioUsage.jsx
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsageStats, setPeriod } from "../redux/slices/twilioUsageSlice";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

const TwilioUsage = () => {
  const dispatch = useDispatch();
  const fetchedPeriodsRef = useRef(new Set());

  const { stats, dailyUsage, costBreakdown, period, loading, error } =
    useSelector((state) => state.twilioUsage);

  console.log("🎨 TwilioUsage state:", {
    stats,
    costBreakdown,
    dailyUsage: dailyUsage?.length,
    loading,
    error,
  });

  useEffect(() => {
    if (fetchedPeriodsRef.current.has(period)) {
      console.log("⏭️ Skipping - already fetched for period:", period);
      return;
    }

    console.log("📊 Fetching usage for period:", period);
    fetchedPeriodsRef.current.add(period);

    dispatch(fetchUsageStats(period));

    setTimeout(() => {
      fetchedPeriodsRef.current.delete(period);
    }, 2000);
  }, [dispatch, period]);

  const handlePeriodChange = (newPeriod) => {
    console.log("🔄 Period changed:", newPeriod);
    fetchedPeriodsRef.current.clear();
    dispatch(setPeriod(newPeriod));
  };

  // LOADING STATE
  if (loading && !stats) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading usage data...
        </p>
      </div>
    );
  }

  // ERROR STATE
  if (error && !stats) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <p className="font-bold">Error loading usage data</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={() => {
              fetchedPeriodsRef.current.clear();
              dispatch(fetchUsageStats(period));
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // NO DATA STATE
  if (!stats || !costBreakdown) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p>No usage data available</p>
        <button
          onClick={() => {
            fetchedPeriodsRef.current.clear();
            dispatch(fetchUsageStats(period));
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // NO USAGE FOUND STATE (only fees, no actual usage)
  if (
    stats.totalCalls === 0 &&
    stats.totalSMS === 0 &&
    costBreakdown.totalCost > 0
  ) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Usage & Billing
          </h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            📊 No Usage Found
          </h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            No calls or SMS found in the selected time period.
          </p>

          <div className="bg-white dark:bg-gray-800 p-4 rounded border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <strong>Current charges:</strong> $
              {costBreakdown.totalCost.toFixed(2)} USD
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              This includes phone number rental and other Twilio fees
            </p>
          </div>

          <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>To see usage data:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Make some test calls or send SMS from your CRM</li>
              <li>Try selecting a different time period</li>
              <li>Wait 5-10 minutes after making calls for data to appear</li>
            </ul>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex gap-2">
          {["today", "weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // NORMAL STATE - SHOW FULL DASHBOARD
  const pieData = [
    { name: "Calls", value: costBreakdown.calls.cost },
    { name: "SMS", value: costBreakdown.sms.cost },
    { name: "Other", value: costBreakdown.other.cost },
  ].filter((item) => item.value > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Usage & Billing
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Period: <span className="font-semibold capitalize">{period}</span>
            {loading && <span className="ml-2 text-blue-500">Loading...</span>}
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {["today", "weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Calls
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            {stats.totalCalls}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Outbound: {stats.callsOutbound} | Inbound: {stats.callsInbound}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total SMS
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            {stats.totalSMS}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Sent: {stats.smsOutbound} | Received: {stats.smsInbound}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Call Duration
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            {stats.callDuration}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            minutes
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Cost
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            ${costBreakdown.totalCost.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            USD
          </div>
        </div>
      </div>

      {/* Charts Row 1: Bar Chart */}
      {dailyUsage && dailyUsage.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Daily Usage (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls" fill="#3b82f6" name="Calls" />
              <Bar dataKey="sms" fill="#10b981" name="SMS" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
          No daily usage data available
        </div>
      )}

      {/* Charts Row 2: Line Chart + Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        {dailyUsage && dailyUsage.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Cost Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#f59e0b"
                  name="Cost ($)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
            No cost trend data available
          </div>
        )}

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Cost Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) => {
                  // ✅ Show actual dollar amount for small percentages
                  if (percent < 0.01) {
                    return `${name} $${value.toFixed(2)}`;
                  }
                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Cost Breakdown Table */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Calls:</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                ${costBreakdown.calls.cost.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">SMS:</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                ${costBreakdown.sms.cost.toFixed(2)}
              </span>
            </div>
            {costBreakdown.other.cost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Other:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  ${costBreakdown.other.cost.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-2 border-t dark:border-gray-700">
              <span className="text-gray-800 dark:text-white font-semibold">
                Total:
              </span>
              <span className="font-bold text-lg text-gray-800 dark:text-white">
                ${costBreakdown.totalCost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Info Note */}
          {costBreakdown.other.cost >
            costBreakdown.calls.cost + costBreakdown.sms.cost && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> "Other" includes phone number rental
              ($1.15/month), A2P 10DLC registration fees, and other Twilio
              platform charges.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwilioUsage;
