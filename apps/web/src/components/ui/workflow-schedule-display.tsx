"use client";

import { useMemo } from "react";
import { FaClock } from "react-icons/fa";

interface WorkflowScheduleDisplayProps {
  schedule: string | null | undefined;
}

export function WorkflowScheduleDisplay({ schedule }: WorkflowScheduleDisplayProps) {
  const friendlySchedule = useMemo(() => {
    if (!schedule) return "Not scheduled";
    
    try {
      // Parse the cron expression
      const parts = schedule.trim().split(/\s+/);
      if (parts.length !== 5) return schedule;

      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
      
      // Common patterns
      if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
        // Daily at specific time
        return `Daily at ${formatHour(hour)}:${formatMinute(minute)}`;
      } 
      
      if (dayOfMonth === "*" && month === "*" && dayOfWeek !== "*") {
        // Weekly on specific day
        return `Every ${getDayName(dayOfWeek)} at ${formatHour(hour)}:${formatMinute(minute)}`;
      }
      
      if (month === "*" && dayOfWeek === "*" && dayOfMonth !== "*") {
        // Monthly on specific day
        return `Monthly on day ${dayOfMonth} at ${formatHour(hour)}:${formatMinute(minute)}`;
      }
      
      // If we can't recognize the pattern, just return the original
      return schedule;
    } catch {
      // If there's any error parsing, just return the original schedule
      return schedule;
    }
  }, [schedule]);

  return (
    <div className="flex items-center text-gray-500">
      <FaClock className="mr-1.5 h-4 w-4 text-gray-400" />
      {friendlySchedule}
    </div>
  );
}

// Helper functions
function formatHour(hour: string): string {
  // Handle comma-separated values
  if (hour.includes(",")) return "various times";
  
  // Handle ranges
  if (hour.includes("-")) return "various times";
  
  // Handle steps
  if (hour.includes("/")) return "various times";
  
  // Handle wildcard
  if (hour === "*") return "every hour";
  
  // Convert to 12-hour format
  const hourNum = parseInt(hour, 10);
  if (isNaN(hourNum)) return hour;
  
  if (hourNum === 0) return "12 AM";
  if (hourNum === 12) return "12 PM";
  return hourNum > 12 ? `${hourNum - 12} PM` : `${hourNum} AM`;
}

function formatMinute(minute: string): string {
  // Handle comma-separated values
  if (minute.includes(",")) return "various minutes";
  
  // Handle ranges
  if (minute.includes("-")) return "various minutes";
  
  // Handle steps
  if (minute.includes("/")) return "various minutes";
  
  // Handle wildcard
  if (minute === "*") return "every minute";
  
  // Format minute with leading zero
  const minuteNum = parseInt(minute, 10);
  return isNaN(minuteNum) ? minute : minuteNum.toString().padStart(2, "0");
}

function getDayName(dayOfWeek: string): string {
  // Handle comma-separated values
  if (dayOfWeek.includes(",")) return "multiple days";
  
  // Handle ranges
  if (dayOfWeek.includes("-")) return "multiple days";
  
  // Handle steps
  if (dayOfWeek.includes("/")) return "multiple days";
  
  // Map day numbers to names
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNum = parseInt(dayOfWeek, 10);
  
  if (isNaN(dayNum) || dayNum < 0 || dayNum > 6) {
    return dayOfWeek;
  }
  
  return days[dayNum];
} 