export interface CalendarEvent {
  title: string;
  startTime: string;
  endTime: string;
  status: "completed" | "in-progress" | "upcoming";
  location?: string;
}

export interface CalendarTask {
  title: string;
  done: boolean;
  priority: "high" | "medium" | "low";
}

export interface CalendarData {
  events: CalendarEvent[];
  tasks: CalendarTask[];
}

export function getMockCalendarData(): CalendarData {
  return {
    events: [
      {
        title: "Morning journaling",
        startTime: "09:00",
        endTime: "09:15",
        status: "completed",
      },
      {
        title: "Standup with eng",
        startTime: "10:30",
        endTime: "11:00",
        status: "completed",
        location: "Zoom",
      },
      {
        title: "Deep work block",
        startTime: "13:00",
        endTime: "15:00",
        status: "in-progress",
      },
      {
        title: "Factory call — Shenzhen",
        startTime: "15:00",
        endTime: "15:45",
        status: "upcoming",
        location: "Zoom",
      },
      {
        title: "Evening walk",
        startTime: "17:00",
        endTime: "17:30",
        status: "upcoming",
      },
    ],
    tasks: [
      { title: "Review KS backer email", done: true, priority: "high" },
      { title: "Update App Store copy", done: true, priority: "medium" },
      { title: "Merge onboarding PR", done: true, priority: "high" },
      { title: "Ship push notif flow", done: false, priority: "high" },
      { title: "Fix tutorial page 3", done: false, priority: "medium" },
      { title: "Write influencer brief", done: false, priority: "low" },
      { title: "Review QC photos", done: false, priority: "medium" },
    ],
  };
}
