import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import timezoneData from 'dayjs/plugin/timezone';
import timezonesData from '../data/timezones.json';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(timezoneData);

export interface TimezoneInfo {
    name: string;
    timezone: string;
    offset: string;
    country: string;
    city: string;
}

export interface TimeSlot {
    hour: number;
    formatted: string;
    isBusinessHours: boolean;
    isWeekend: boolean;
    date: string;
    isCurrentTime: boolean;
    isSelected: boolean;
}

export interface TimezoneRow {
    timezone: TimezoneInfo;
    timeSlots: TimeSlot[];
    currentTime: string;
    date: string;
}

export interface MeetingTime {
    time: Date;
    score: number;
    reason: string;
    timezoneTimes: { [timezone: string]: string };
}

export interface TeamMember {
    id: string;
    name: string;
    timezone: string;
    workingHours: {
        start: number; // 0-23
        end: number;   // 0-23
    };
    workingDays: number[]; // 0-6 (Sunday = 0)
}

export interface SavedTeam {
    id: string;
    name: string;
    members: TeamMember[];
    createdAt: Date;
}

export function getAllTimezones(): TimezoneInfo[] {
    return timezonesData as TimezoneInfo[];
}

export function searchTimezones(query: string): TimezoneInfo[] {
    const searchTerm = query.toLowerCase();
    return getAllTimezones().filter(tz =>
        tz.name.toLowerCase().includes(searchTerm) ||
        tz.city.toLowerCase().includes(searchTerm) ||
        tz.country.toLowerCase().includes(searchTerm) ||
        tz.timezone.toLowerCase().includes(searchTerm)
    );
}

export function getTimezoneByName(name: string): TimezoneInfo | undefined {
    return getAllTimezones().find(tz => tz.name === name || tz.timezone === name);
}

export function getCurrentTimeInTimezone(timezone: string): dayjs.Dayjs {
    return dayjs().tz(timezone);
}

export function convertTime(
    time: Date,
    fromTimezone: string,
    toTimezone: string
): Date {
    return dayjs(time).tz(fromTimezone).tz(toTimezone).toDate();
}

export function formatTimeInTimezone(
    time: Date,
    timezone: string,
    format: string = 'h:mm A'
): string {
    return dayjs(time).tz(timezone).format(format);
}

export function getTimezoneOffset(timezone: string): number {
    return dayjs().tz(timezone).utcOffset();
}

export function generateTimeZoneGrid(
    timezones: string[],
    selectedTime: Date,
    currentTime: Date = new Date()
): TimezoneRow[] {
    return timezones.map(tzName => {
        const timezoneInfo = getTimezoneByName(tzName);
        if (!timezoneInfo) {
            throw new Error(`Timezone ${tzName} not found`);
        }

        const timeSlots: TimeSlot[] = Array.from({ length: 24 }, (_, hour) => {
            const time = dayjs(selectedTime).tz(tzName).hour(hour).minute(0);
            const isCurrentTime = dayjs(currentTime).tz(tzName).hour() === hour &&
                dayjs(currentTime).tz(tzName).minute() < 30;
            const isSelected = dayjs(selectedTime).tz(tzName).hour() === hour;

            return {
                hour,
                formatted: time.format('h A'),
                isBusinessHours: hour >= 9 && hour <= 17,
                isWeekend: time.day() === 0 || time.day() === 6,
                date: time.format('MMM D'),
                isCurrentTime,
                isSelected
            };
        });

        const currentTimeInTz = getCurrentTimeInTimezone(tzName);

        return {
            timezone: timezoneInfo,
            timeSlots,
            currentTime: currentTimeInTz.format('h:mm A'),
            date: currentTimeInTz.format('MMM D, YYYY')
        };
    });
}

export function findOverlappingHours(
    timezones: string[],
    workingHours: { start: number; end: number }[] = [],
    excludeWeekends: boolean = true
): MeetingTime[] {
    const meetingTimes: MeetingTime[] = [];
    const now = dayjs();

    // Default working hours if not provided
    const defaultWorkingHours = workingHours.length > 0 ? workingHours :
        timezones.map(() => ({ start: 9, end: 17 }));

    // Check each hour for the next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const checkDate = now.add(dayOffset, 'day');

        // Skip weekends if requested
        if (excludeWeekends && (checkDate.day() === 0 || checkDate.day() === 6)) {
            continue;
        }

        for (let hour = 0; hour < 24; hour++) {
            const testTime = checkDate.hour(hour).minute(0);
            let score = 0;
            let reason = '';
            const timezoneTimes: { [timezone: string]: string } = {};

            // Check if this time works for all timezones
            let allTimezonesWork = true;
            let businessHoursCount = 0;

            timezones.forEach((tz, index) => {
                const timeInTz = testTime.tz(tz);
                timezoneTimes[tz] = timeInTz.format('h:mm A');

                const workingHours = defaultWorkingHours[index] || { start: 9, end: 17 };
                const isBusinessHours = timeInTz.hour() >= workingHours.start &&
                    timeInTz.hour() < workingHours.end;

                if (isBusinessHours) {
                    businessHoursCount++;
                    score += 10;
                } else {
                    allTimezonesWork = false;
                }

                // Bonus for not being too early or late
                if (timeInTz.hour() >= 8 && timeInTz.hour() <= 18) {
                    score += 5;
                }
            });

            if (businessHoursCount === timezones.length) {
                score += 20; // Bonus for all timezones in business hours
                reason = 'All timezones in business hours';
            } else if (businessHoursCount >= timezones.length * 0.8) {
                score += 10; // Most timezones in business hours
                reason = 'Most timezones in business hours';
            } else {
                reason = `${businessHoursCount}/${timezones.length} timezones in business hours`;
            }

            // Bonus for weekdays
            if (checkDate.day() >= 1 && checkDate.day() <= 5) {
                score += 5;
            }

            // Only include times with reasonable scores
            if (score > 0) {
                meetingTimes.push({
                    time: testTime.toDate(),
                    score,
                    reason,
                    timezoneTimes
                });
            }
        }
    }

    // Sort by score (highest first) and return top 10
    return meetingTimes
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}

export function suggestBestMeetingTime(
    timezones: string[],
    preferences: {
        excludeWeekends?: boolean;
        workingHours?: { start: number; end: number }[];
        preferredTime?: 'morning' | 'afternoon' | 'evening';
    } = {}
): MeetingTime[] {
    const overlappingTimes = findOverlappingHours(
        timezones,
        preferences.workingHours,
        preferences.excludeWeekends
    );

    // Apply additional preferences
    return overlappingTimes.map(meetingTime => {
        let adjustedScore = meetingTime.score;

        if (preferences.preferredTime) {
            const hour = dayjs(meetingTime.time).hour();

            switch (preferences.preferredTime) {
                case 'morning':
                    if (hour >= 8 && hour <= 11) adjustedScore += 10;
                    break;
                case 'afternoon':
                    if (hour >= 12 && hour <= 16) adjustedScore += 10;
                    break;
                case 'evening':
                    if (hour >= 17 && hour <= 19) adjustedScore += 10;
                    break;
            }
        }

        return {
            ...meetingTime,
            score: adjustedScore
        };
    }).sort((a, b) => b.score - a.score);
}

export function generateMeetingLink(
    meeting: {
        title: string;
        description?: string;
        datetime: Date;
        timezones: string[];
        duration?: number;
        videoLink?: string;
    }
): string {
    const params = new URLSearchParams({
        title: meeting.title,
        datetime: meeting.datetime.toISOString(),
        timezones: meeting.timezones.join(','),
        duration: meeting.duration?.toString() || '60',
        videoLink: meeting.videoLink || ''
    });

    if (meeting.description) {
        params.set('description', meeting.description);
    }

    return `${window.location.origin}/meeting?${params.toString()}`;
}

export function generateICS(
    meeting: {
        title: string;
        description?: string;
        datetime: Date;
        duration?: number;
        videoLink?: string;
    }
): string {
    const startTime = dayjs(meeting.datetime);
    const endTime = startTime.add(meeting.duration || 60, 'minutes');

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Timezone Scheduler//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@timezone-scheduler.com`,
        `DTSTART:${startTime.utc().format('YYYYMMDDTHHmmss')}Z`,
        `DTEND:${endTime.utc().format('YYYYMMDDTHHmmss')}Z`,
        `SUMMARY:${meeting.title}`,
        meeting.description ? `DESCRIPTION:${meeting.description}` : '',
        meeting.videoLink ? `URL:${meeting.videoLink}` : '',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
    ].filter(line => line).join('\r\n');

    return icsContent;
}

export function getGoogleCalendarUrl(
    meeting: {
        title: string;
        description?: string;
        datetime: Date;
        duration?: number;
        videoLink?: string;
    }
): string {
    const startTime = dayjs(meeting.datetime);
    const endTime = startTime.add(meeting.duration || 60, 'minutes');

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: meeting.title,
        dates: `${startTime.utc().format('YYYYMMDDTHHmmss')}Z/${endTime.utc().format('YYYYMMDDTHHmmss')}Z`,
        details: meeting.description || '',
        location: meeting.videoLink || ''
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(
    meeting: {
        title: string;
        description?: string;
        datetime: Date;
        duration?: number;
        videoLink?: string;
    }
): string {
    const startTime = dayjs(meeting.datetime);
    const endTime = startTime.add(meeting.duration || 60, 'minutes');

    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: meeting.title,
        startdt: startTime.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
        enddt: endTime.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
        body: meeting.description || '',
        location: meeting.videoLink || ''
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// Local Storage helpers for teams
export function saveTeam(team: SavedTeam): void {
    const teams = getSavedTeams();
    const existingIndex = teams.findIndex(t => t.id === team.id);

    if (existingIndex >= 0) {
        teams[existingIndex] = team;
    } else {
        teams.push(team);
    }

    localStorage.setItem('timezone-teams', JSON.stringify(teams));
}

export function getSavedTeams(): SavedTeam[] {
    try {
        const teams = localStorage.getItem('timezone-teams');
        return teams ? JSON.parse(teams) : [];
    } catch {
        return [];
    }
}

export function deleteTeam(teamId: string): void {
    const teams = getSavedTeams();
    const filteredTeams = teams.filter(t => t.id !== teamId);
    localStorage.setItem('timezone-teams', JSON.stringify(filteredTeams));
}

export function createTeam(name: string, members: TeamMember[]): SavedTeam {
    return {
        id: `team-${Date.now()}`,
        name,
        members,
        createdAt: new Date()
    };
}
