// src/components/TwilioUsage.jsx
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsageStats, setPeriod } from "../redux/slices/twilioUsageSlice";
import { useTheme } from "../context/ThemeContext";
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
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

const COLORS = ["#3EE4C8", "#45B7D1", "#F7B801", "#FF6B6B"];

const TwilioUsage = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const fetchedPeriodsRef = useRef(new Set());

  const { stats, dailyUsage, costBreakdown, period, loading, error } =
    useSelector((state) => state.twilioUsage);

  // Theme-aware styles
  const paperStyles = {
    p: 3,
    background: isDarkMode
      ? "rgba(17, 24, 39, 0.5)"
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: isDarkMode
      ? "1px solid rgba(100, 255, 218, 0.2)"
      : "1px solid rgba(62, 228, 200, 0.3)",
    borderRadius: 2,
    boxShadow: isDarkMode
      ? "0 4px 20px rgba(0, 0, 0, 0.2)"
      : "0 4px 20px rgba(62, 228, 200, 0.15)",
  };

  const axisColor = isDarkMode ? "rgba(255, 255, 255, 0.7)" : "#0B1929";
  const gridColor = isDarkMode
    ? "rgba(100, 255, 218, 0.1)"
    : "rgba(62, 228, 200, 0.2)";

  const tooltipStyle = {
    backgroundColor: isDarkMode
      ? "rgba(17, 24, 39, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
    border: isDarkMode
      ? "1px solid rgba(100, 255, 218, 0.3)"
      : "1px solid rgba(62, 228, 200, 0.3)",
    borderRadius: 8,
    color: isDarkMode ? "#ffffff" : "#0B1929",
  };

  const legendFormatter = (value) => (
    <span style={{ color: isDarkMode ? "#ffffff" : "#0B1929", fontSize: "12px" }}>
      {value}
    </span>
  );

  useEffect(() => {
    if (fetchedPeriodsRef.current.has(period)) {
      return;
    }

    fetchedPeriodsRef.current.add(period);
    dispatch(fetchUsageStats(period));

    setTimeout(() => {
      fetchedPeriodsRef.current.delete(period);
    }, 2000);
  }, [dispatch, period]);

  const handlePeriodChange = (newPeriod) => {
    fetchedPeriodsRef.current.clear();
    dispatch(setPeriod(newPeriod));
  };

  const handleRetry = () => {
    fetchedPeriodsRef.current.clear();
    dispatch(fetchUsageStats(period));
  };

  // Period Selector Component
  const PeriodSelector = () => (
    <ButtonGroup
      variant="outlined"
      size="small"
      sx={{
        "& .MuiButton-root": {
          borderColor: isDarkMode
            ? "rgba(100, 255, 218, 0.3)"
            : "rgba(62, 228, 200, 0.3)",
          color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "#0B1929",
          textTransform: "capitalize",
          px: { xs: 1.5, sm: 2 },
          py: 0.75,
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          "&:hover": {
            borderColor: isDarkMode ? "#64ffda" : "#3EE4C8",
            backgroundColor: isDarkMode
              ? "rgba(100, 255, 218, 0.1)"
              : "rgba(62, 228, 200, 0.1)",
          },
          "&.active": {
            backgroundColor: isDarkMode ? "#64ffda" : "#3EE4C8",
            color: isDarkMode ? "#0B1929" : "#ffffff",
            borderColor: isDarkMode ? "#64ffda" : "#3EE4C8",
            "&:hover": {
              backgroundColor: isDarkMode ? "#52d4c2" : "#2BC4A8",
            },
          },
        },
      }}
    >
      {["today", "weekly", "monthly", "yearly"].map((p) => (
        <Button
          key={p}
          onClick={() => handlePeriodChange(p)}
          disabled={loading}
          className={period === p ? "active" : ""}
        >
          {p}
        </Button>
      ))}
    </ButtonGroup>
  );

  // Stat Card Component
  const StatCard = ({ title, value, subtitle, borderColor }) => (
    <Paper
      elevation={0}
      sx={{
        ...paperStyles,
        borderLeft: `4px solid ${borderColor}`,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isDarkMode
            ? "0 8px 30px rgba(100, 255, 218, 0.15)"
            : "0 8px 30px rgba(62, 228, 200, 0.2)",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(11, 25, 41, 0.6)",
          fontWeight: 500,
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: isDarkMode ? "#ffffff" : "#0B1929",
          mb: 0.5,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(11, 25, 41, 0.5)",
        }}
      >
        {subtitle}
      </Typography>
    </Paper>
  );

  // LOADING STATE
  if (loading && !stats) {
    return (
      <Paper elevation={0} sx={{ ...paperStyles, mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "#3EE4C8" }} />
          <Typography
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(11, 25, 41, 0.6)",
            }}
          >
            Loading usage data...
          </Typography>
        </Box>
      </Paper>
    );
  }

  // ERROR STATE
  if (error && !stats) {
    return (
      <Paper elevation={0} sx={{ ...paperStyles, mt: 3 }}>
        <Alert
          severity="error"
          sx={{
            backgroundColor: isDarkMode
              ? "rgba(239, 68, 68, 0.1)"
              : "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            mb: 2,
          }}
        >
          <Typography fontWeight={600}>Error loading usage data</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        </Alert>
        <Button
          variant="contained"
          onClick={handleRetry}
          sx={{
            backgroundColor: isDarkMode ? "#64ffda" : "#3EE4C8",
            color: isDarkMode ? "#0B1929" : "#ffffff",
            "&:hover": {
              backgroundColor: isDarkMode ? "#52d4c2" : "#2BC4A8",
            },
          }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  // NO DATA STATE
  if (!stats || !costBreakdown) {
    return (
      <Paper elevation={0} sx={{ ...paperStyles, mt: 3, textAlign: "center" }}>
        <Typography
          sx={{
            color: isDarkMode
              ? "rgba(255, 255, 255, 0.6)"
              : "rgba(11, 25, 41, 0.6)",
            mb: 2,
          }}
        >
          No usage data available
        </Typography>
        <Button
          variant="contained"
          onClick={handleRetry}
          sx={{
            backgroundColor: isDarkMode ? "#64ffda" : "#3EE4C8",
            color: isDarkMode ? "#0B1929" : "#ffffff",
            "&:hover": {
              backgroundColor: isDarkMode ? "#52d4c2" : "#2BC4A8",
            },
          }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  // NO USAGE FOUND STATE
  if (
    stats.totalCalls === 0 &&
    stats.totalSMS === 0 &&
    costBreakdown.totalCost > 0
  ) {
    return (
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: isDarkMode ? "#ffffff" : "#0B1929",
            }}
          >
            Usage & Billing
          </Typography>
          <PeriodSelector />
        </Box>

        <Paper elevation={0} sx={paperStyles}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: isDarkMode ? "#64ffda" : "#3EE4C8",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📊 No Usage Found
          </Typography>
          <Typography
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(11, 25, 41, 0.7)",
              mb: 3,
            }}
          >
            No calls or SMS found in the selected time period.
          </Typography>

          <Box
            sx={{
              p: 2,
              bgcolor: isDarkMode
                ? "rgba(100, 255, 218, 0.05)"
                : "rgba(62, 228, 200, 0.08)",
              borderRadius: 2,
              border: isDarkMode
                ? "1px solid rgba(100, 255, 218, 0.1)"
                : "1px solid rgba(62, 228, 200, 0.2)",
              mb: 3,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: isDarkMode ? "#ffffff" : "#0B1929", mb: 1 }}
            >
              <strong>Current charges:</strong> ${costBreakdown.totalCost.toFixed(2)} USD
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(11, 25, 41, 0.5)",
              }}
            >
              This includes phone number rental and other Twilio fees
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? "#ffffff" : "#0B1929",
              fontWeight: 600,
              mb: 1,
            }}
          >
            To see usage data:
          </Typography>
          <Box
            component="ul"
            sx={{
              pl: 2,
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(11, 25, 41, 0.7)",
              "& li": { mb: 0.5 },
            }}
          >
            <li>Make some test calls or send SMS from your CRM</li>
            <li>Try selecting a different time period</li>
            <li>Wait 5-10 minutes after making calls for data to appear</li>
          </Box>
        </Paper>
      </Box>
    );
  }

  // NORMAL STATE - SHOW FULL DASHBOARD
  const pieData = [
    { name: "Calls", value: costBreakdown.calls.cost },
    { name: "SMS", value: costBreakdown.sms.cost },
    { name: "Other", value: costBreakdown.other.cost },
  ].filter((item) => item.value > 0);

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: isDarkMode ? "#ffffff" : "#0B1929",
            }}
          >
            Usage & Billing
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(11, 25, 41, 0.6)",
              mt: 0.5,
            }}
          >
            Period:{" "}
            <Box
              component="span"
              sx={{
                fontWeight: 600,
                textTransform: "capitalize",
                color: isDarkMode ? "#64ffda" : "#3EE4C8",
              }}
            >
              {period}
            </Box>
            {loading && (
              <Box
                component="span"
                sx={{ ml: 1, color: isDarkMode ? "#64ffda" : "#3EE4C8" }}
              >
                Loading...
              </Box>
            )}
          </Typography>
        </Box>
        <PeriodSelector />
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title="Total Calls"
          value={stats.totalCalls}
          subtitle={`Outbound: ${stats.callsOutbound} | Inbound: ${stats.callsInbound}`}
          borderColor="#45B7D1"
        />
        <StatCard
          title="Total SMS"
          value={stats.totalSMS}
          subtitle={`Sent: ${stats.smsOutbound} | Received: ${stats.smsInbound}`}
          borderColor="#3EE4C8"
        />
        <StatCard
          title="Call Duration"
          value={stats.callDuration}
          subtitle="minutes"
          borderColor="#9B59B6"
        />
        <StatCard
          title="Total Cost"
          value={`$${costBreakdown.totalCost.toFixed(2)}`}
          subtitle="USD"
          borderColor="#F7B801"
        />
      </Box>

      {/* Daily Usage Bar Chart */}
      <Paper elevation={0} sx={{ ...paperStyles, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: isDarkMode ? "#ffffff" : "#0B1929",
            mb: 2,
          }}
        >
          Daily Usage (Last 30 Days)
        </Typography>
        {dailyUsage && dailyUsage.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                stroke={axisColor}
                tick={{ fontSize: 12, fill: axisColor }}
              />
              <YAxis stroke={axisColor} tick={{ fontSize: 12, fill: axisColor }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={legendFormatter} />
              <Bar dataKey="calls" fill="#45B7D1" name="Calls" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sms" fill="#3EE4C8" name="SMS" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(11, 25, 41, 0.5)",
            }}
          >
            No daily usage data available
          </Box>
        )}
      </Paper>

      {/* Charts Row 2 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Cost Trends Line Chart */}
        <Paper elevation={0} sx={paperStyles}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: isDarkMode ? "#ffffff" : "#0B1929",
              mb: 2,
            }}
          >
            Cost Trends
          </Typography>
          {dailyUsage && dailyUsage.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  stroke={axisColor}
                  tick={{ fontSize: 12, fill: axisColor }}
                />
                <YAxis stroke={axisColor} tick={{ fontSize: 12, fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend formatter={legendFormatter} />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#F7B801"
                  name="Cost ($)"
                  strokeWidth={3}
                  dot={{ fill: "#F7B801", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(11, 25, 41, 0.5)",
              }}
            >
              No cost trend data available
            </Box>
          )}
        </Paper>

        {/* Cost Distribution Pie Chart */}
        <Paper elevation={0} sx={paperStyles}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: isDarkMode ? "#ffffff" : "#0B1929",
              mb: 2,
            }}
          >
            Cost Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `$${value.toFixed(2)}`}
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={legendFormatter} />
            </PieChart>
          </ResponsiveContainer>

          {/* Cost Breakdown */}
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: isDarkMode
                ? "1px solid rgba(100, 255, 218, 0.1)"
                : "1px solid rgba(62, 228, 200, 0.2)",
            }}
          >
            {[
              { label: "Calls", value: costBreakdown.calls.cost },
              { label: "SMS", value: costBreakdown.sms.cost },
              ...(costBreakdown.other.cost > 0
                ? [{ label: "Other", value: costBreakdown.other.cost }]
                : []),
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.6)"
                      : "rgba(11, 25, 41, 0.6)",
                  }}
                >
                  {item.label}:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDarkMode ? "#ffffff" : "#0B1929",
                  }}
                >
                  ${item.value.toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: 1,
                mt: 1,
                borderTop: isDarkMode
                  ? "1px solid rgba(100, 255, 218, 0.1)"
                  : "1px solid rgba(62, 228, 200, 0.2)",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? "#ffffff" : "#0B1929",
                }}
              >
                Total:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: isDarkMode ? "#64ffda" : "#3EE4C8",
                }}
              >
                ${costBreakdown.totalCost.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Info Note */}
          {costBreakdown.other.cost >
            costBreakdown.calls.cost + costBreakdown.sms.cost && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: isDarkMode
                  ? "rgba(100, 255, 218, 0.05)"
                  : "rgba(62, 228, 200, 0.08)",
                borderRadius: 1,
                border: isDarkMode
                  ? "1px solid rgba(100, 255, 218, 0.1)"
                  : "1px solid rgba(62, 228, 200, 0.2)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(11, 25, 41, 0.7)",
                }}
              >
                <strong>Note:</strong> "Other" includes phone number rental
                ($1.15/month), A2P 10DLC registration fees, and other Twilio
                platform charges.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default TwilioUsage;