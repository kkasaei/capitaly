"use client";

import { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";

type ScheduleType = "once" | "daily" | "weekly" | "monthly" | "custom";

interface ScheduleBuilderProps {
  value?: string;
  onChange: (value: string) => void;
  timezone?: string;
  onTimezoneChange?: (timezone: string) => void;
}

export function ScheduleBuilder({ 
  value = "", 
  onChange, 
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  onTimezoneChange
}: ScheduleBuilderProps) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>("once");
  const [hour, setHour] = useState<number>(9);
  const [minute, setMinute] = useState<number>(0);
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Monday
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [customCron, setCustomCron] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState<string>(timezone);
  const [previousCronExpression, setPreviousCronExpression] = useState<string>(value);

  // Get browser timezone
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Parse initial value if it's a cron expression
  useEffect(() => {
    if (!value) {
      setScheduleType("once");
      return;
    }

    // Only parse if value has changed from what we know
    if (value === previousCronExpression) {
      return;
    }
    
    setPreviousCronExpression(value);

    // Try to parse the cron expression
    const parts = value.trim().split(/\s+/);
    if (parts.length === 5) {
      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

      // Handle different schedule types
      if (minute === "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
        // This would be every minute, but we don't support that in the UI
        setScheduleType("custom");
        setCustomCron(value);
      } else if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
        // Daily at specific time
        setScheduleType("daily");
        setMinute(parseInt(minute, 10) || 0);
        setHour(parseInt(hour, 10) || 0);
      } else if (dayOfMonth === "*" && month === "*" && !isNaN(parseInt(dayOfWeek, 10))) {
        // Weekly on specific day
        setScheduleType("weekly");
        setMinute(parseInt(minute, 10) || 0);
        setHour(parseInt(hour, 10) || 0);
        setDayOfWeek(parseInt(dayOfWeek, 10) || 1);
      } else if (month === "*" && dayOfWeek === "*" && !isNaN(parseInt(dayOfMonth, 10))) {
        // Monthly on specific day
        setScheduleType("monthly");
        setMinute(parseInt(minute, 10) || 0);
        setHour(parseInt(hour, 10) || 0);
        setDayOfMonth(parseInt(dayOfMonth, 10) || 1);
      } else {
        // Custom or complex schedule
        setScheduleType("custom");
        setCustomCron(value);
      }
    } else {
      // Invalid cron expression or empty - default to once
      setScheduleType("once");
    }
  }, [value, previousCronExpression]);

  // Update the cron expression when settings change
  useEffect(() => {
    let cronExpression = "";

    switch (scheduleType) {
      case "once":
        // No cron expression for one-time
        cronExpression = "";
        break;
      case "daily":
        // Run daily at specified time
        cronExpression = `${minute} ${hour} * * *`;
        break;
      case "weekly":
        // Run weekly on specified day and time
        cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;
        break;
      case "monthly":
        // Run monthly on specified day and time
        cronExpression = `${minute} ${hour} ${dayOfMonth} * *`;
        break;
      case "custom":
        // Use custom cron expression
        cronExpression = customCron;
        break;
    }

    // Only update if the expression has changed and we're not in custom mode
    // (to prevent overwriting manual edits)
    if (cronExpression !== previousCronExpression && 
        (scheduleType !== "custom" || !value)) {
      setPreviousCronExpression(cronExpression);
      onChange(cronExpression);
    }
  }, [scheduleType, hour, minute, dayOfWeek, dayOfMonth, customCron, onChange, value, previousCronExpression]);

  // Handle timezone changes
  useEffect(() => {
    if (onTimezoneChange && selectedTimezone !== timezone) {
      onTimezoneChange(selectedTimezone);
    }
  }, [selectedTimezone, timezone, onTimezoneChange]);

  // Handle custom cron changes
  const handleCustomCronChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomCron(newValue);
    
    // Only call onChange if the value is different from previous
    if (newValue !== previousCronExpression) {
      setPreviousCronExpression(newValue);
      onChange(newValue);
    }
  };

  // Handle timezone changes
  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimezone(e.target.value);
  };

  // Generate time options
  const hourOptions = Array.from({ length: 24 }, (_, i) => (
    <option key={`hour-${i}`} value={i}>
      {i.toString().padStart(2, '0')}:00
    </option>
  ));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => (
    <option key={`minute-${i}`} value={i}>
      {i.toString().padStart(2, '0')}
    </option>
  ));

  // Generate day of week options
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeekOptions = daysOfWeek.map((day, index) => (
    <option key={`dow-${index}`} value={index === 0 ? 0 : index}>
      {day}
    </option>
  ));

  // Generate day of month options
  const dayOfMonthOptions = Array.from({ length: 31 }, (_, i) => (
    <option key={`dom-${i + 1}`} value={i + 1}>
      {i + 1}
    </option>
  ));

  // Get popular timezones
  const popularTimezones = [
    { name: "UTC (Coordinated Universal Time)", value: "UTC" },
    { name: "America/New_York (Eastern Time)", value: "America/New_York" },
    { name: "America/Chicago (Central Time)", value: "America/Chicago" },
    { name: "America/Denver (Mountain Time)", value: "America/Denver" },
    { name: "America/Los_Angeles (Pacific Time)", value: "America/Los_Angeles" },
    { name: "Europe/London (GMT)", value: "Europe/London" },
    { name: "Europe/Paris (Central European Time)", value: "Europe/Paris" },
    { name: "Asia/Tokyo (Japan Standard Time)", value: "Asia/Tokyo" },
    { name: "Asia/Shanghai (China Standard Time)", value: "Asia/Shanghai" },
    { name: "Australia/Sydney (Australian Eastern Time)", value: "Australia/Sydney" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Run Schedule</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
        >
          <option value="once">Run manually only</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom cron expression</option>
        </select>
      </div>

      {scheduleType !== "once" && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={selectedTimezone}
              onChange={handleTimezoneChange}
            >
              {browserTimezone !== selectedTimezone && (
                <option value={browserTimezone}>{browserTimezone} (Browser Timezone)</option>
              )}
              {popularTimezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Schedules will run according to this timezone
            </p>
          </div>

          {scheduleType !== "custom" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hour</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={hour}
                  onChange={(e) => setHour(Number(e.target.value))}
                >
                  {hourOptions}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Minute</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={minute}
                  onChange={(e) => setMinute(Number(e.target.value))}
                >
                  {minuteOptions}
                </select>
              </div>
            </div>
          )}

          {scheduleType === "weekly" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Day of Week</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
              >
                {dayOfWeekOptions}
              </select>
            </div>
          )}

          {scheduleType === "monthly" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Day of Month</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(Number(e.target.value))}
              >
                {dayOfMonthOptions}
              </select>
            </div>
          )}
        </div>
      )}

      {scheduleType === "custom" && (
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">Custom Cron Expression</label>
            <div className="relative group">
              <FaQuestionCircle className="h-4 w-4 text-gray-400" />
              <div className="absolute z-10 hidden group-hover:block bg-black text-white p-2 rounded text-xs w-64 top-full left-0">
                Cron format: minute hour day-of-month month day-of-week<br />
                Example: 0 9 * * 1 (Every Monday at 9 AM)<br />
                Example: 30 14 1 * * (1st day of each month at 2:30 PM)
              </div>
            </div>
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0 9 * * 1"
            value={customCron}
            onChange={handleCustomCronChange}
          />
          <p className="text-xs text-gray-500">
            Format: minute hour day-of-month month day-of-week
          </p>
        </div>
      )}

      {scheduleType !== "once" && scheduleType !== "custom" && (
        <div className="text-sm text-gray-500 flex items-center space-x-2">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
            {scheduleType === "daily" && `${minute} ${hour} * * *`}
            {scheduleType === "weekly" && `${minute} ${hour} * * ${dayOfWeek}`}
            {scheduleType === "monthly" && `${minute} ${hour} ${dayOfMonth} * *`}
          </div>
          <span>is the cron expression that will be used</span>
        </div>
      )}

      {scheduleType === "once" && (
        <p className="text-sm text-gray-500">
          Workflow will only run when triggered manually.
        </p>
      )}
    </div>
  );
} 