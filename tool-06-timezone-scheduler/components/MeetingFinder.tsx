'use client';

import { useState } from 'react';
import {
    Search,
    Clock,
    Users,
    Calendar,
    Star,
    Copy,
    Download,
    ExternalLink,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import {
    findOverlappingHours,
    suggestBestMeetingTime,
    generateICS,
    getGoogleCalendarUrl,
    getOutlookCalendarUrl,
    MeetingTime
} from '../lib/timezones';

interface MeetingFinderProps {
    timezones: string[];
    selectedTime: Date;
    onTimeSelect: (time: Date) => void;
}

export default function MeetingFinder({
    timezones,
    selectedTime,
    onTimeSelect
}: MeetingFinderProps) {
    const [meetingTitle, setMeetingTitle] = useState('');
    const [meetingDescription, setMeetingDescription] = useState('');
    const [meetingDuration, setMeetingDuration] = useState(60);
    const [videoLink, setVideoLink] = useState('');
    const [excludeWeekends, setExcludeWeekends] = useState(true);
    const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening' | 'any'>('any');
    const [suggestions, setSuggestions] = useState<MeetingTime[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleFindMeetingTimes = () => {
        if (timezones.length < 2) return;

        setIsSearching(true);
        setTimeout(() => {
            const results = suggestBestMeetingTime(timezones, {
                excludeWeekends,
                preferredTime: preferredTime === 'any' ? undefined : preferredTime
            });
            setSuggestions(results);
            setIsSearching(false);
        }, 500);
    };

    const handleCopyLink = async (meeting: MeetingTime) => {
        const meetingData = {
            title: meetingTitle || 'Meeting',
            description: meetingDescription,
            datetime: meeting.time,
            timezones,
            duration: meetingDuration,
            videoLink
        };

        const link = `${window.location.origin}/meeting?${new URLSearchParams({
            title: meetingData.title,
            datetime: meetingData.datetime.toISOString(),
            timezones: meetingData.timezones.join(','),
            duration: meetingData.duration.toString(),
            videoLink: meetingData.videoLink
        }).toString()}`;

        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownloadICS = (meeting: MeetingTime) => {
        const icsContent = generateICS({
            title: meetingTitle || 'Meeting',
            description: meetingDescription,
            datetime: meeting.time,
            duration: meetingDuration,
            videoLink
        });

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${meetingTitle || 'meeting'}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
        if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
        return 'bg-red-100 dark:bg-red-900/20';
    };

    const formatMeetingTime = (time: Date) => {
        return time.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Search className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Meeting Time Finder
                </h2>
            </div>

            {/* Meeting Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Meeting Title
                    </label>
                    <input
                        type="text"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        placeholder="Enter meeting title..."
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Duration (minutes)
                    </label>
                    <select
                        value={meetingDuration}
                        onChange={(e) => setMeetingDuration(Number(e.target.value))}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                    </select>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description (optional)
                </label>
                <textarea
                    value={meetingDescription}
                    onChange={(e) => setMeetingDescription(e.target.value)}
                    placeholder="Enter meeting description..."
                    rows={3}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 resize-none"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Video Link (optional)
                </label>
                <input
                    type="url"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
            </div>

            {/* Preferences */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Time
                    </label>
                    <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value as any)}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    >
                        <option value="any">Any time</option>
                        <option value="morning">Morning (8 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                        <option value="evening">Evening (5 PM - 8 PM)</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={excludeWeekends}
                            onChange={(e) => setExcludeWeekends(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                            Exclude weekends
                        </span>
                    </label>
                </div>
            </div>

            {/* Find Button */}
            <button
                onClick={handleFindMeetingTimes}
                disabled={timezones.length < 2 || isSearching}
                className="w-full mb-6 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
                {isSearching ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Finding best times...
                    </>
                ) : (
                    <>
                        <Search className="w-4 h-4" />
                        Find Best Meeting Times
                    </>
                )}
            </button>

            {/* Results */}
            {suggestions.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Suggested Meeting Times
                        </h3>
                    </div>

                    {suggestions.map((meeting, index) => (
                        <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getScoreBgColor(meeting.score)} ${getScoreColor(meeting.score)}`}>
                                            {meeting.score}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                                {formatMeetingTime(meeting.time)}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {meeting.reason}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Timezone Times */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                        {Object.entries(meeting.timezoneTimes).map(([tz, time]) => (
                                            <div key={tz} className="text-sm">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {tz.split('/')[1]?.replace('_', ' ') || tz}:
                                                </span>
                                                <span className="ml-1 text-slate-600 dark:text-slate-400">
                                                    {time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onTimeSelect(meeting.time)}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleCopyLink(meeting)}
                                    className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors"
                                >
                                    <Copy className="w-3 h-3" />
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                                <button
                                    onClick={() => handleDownloadICS(meeting)}
                                    className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors"
                                >
                                    <Download className="w-3 h-3" />
                                    Download ICS
                                </button>
                                <a
                                    href={getGoogleCalendarUrl({
                                        title: meetingTitle || 'Meeting',
                                        description: meetingDescription,
                                        datetime: meeting.time,
                                        duration: meetingDuration,
                                        videoLink
                                    })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Google Calendar
                                </a>
                                <a
                                    href={getOutlookCalendarUrl({
                                        title: meetingTitle || 'Meeting',
                                        description: meetingDescription,
                                        datetime: meeting.time,
                                        duration: meetingDuration,
                                        videoLink
                                    })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Outlook
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Results */}
            {suggestions.length === 0 && timezones.length >= 2 && (
                <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No suitable meeting times found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Try adjusting your preferences or expanding the time range.
                    </p>
                </div>
            )}

            {/* Instructions */}
            {timezones.length < 2 && (
                <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Add more timezones
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Add at least 2 timezones to find overlapping meeting times.
                    </p>
                </div>
            )}
        </div>
    );
}
