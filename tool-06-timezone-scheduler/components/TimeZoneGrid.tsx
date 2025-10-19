'use client';

import { useState } from 'react';
import { Clock, Calendar, MapPin, Users, Plus, X } from 'lucide-react';
import {
    TimezoneRow,
    TimezoneInfo,
    generateTimeZoneGrid,
    getAllTimezones,
    searchTimezones
} from '../lib/timezones';

interface TimeZoneGridProps {
    selectedTime: Date;
    onTimeChange: (time: Date) => void;
    onTimezoneAdd: (timezone: string) => void;
    onTimezoneRemove: (timezone: string) => void;
}

export default function TimeZoneGrid({
    selectedTime,
    onTimeChange,
    onTimezoneAdd,
    onTimezoneRemove
}: TimeZoneGridProps) {
    const [timezones, setTimezones] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Tokyo']);
    const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [draggedHour, setDraggedHour] = useState<number | null>(null);

    const timezoneRows = generateTimeZoneGrid(timezones, selectedTime);
    const searchResults = searchQuery ? searchTimezones(searchQuery) : getAllTimezones().slice(0, 20);

    const handleTimezoneAdd = (timezone: string) => {
        if (!timezones.includes(timezone)) {
            setTimezones([...timezones, timezone]);
            onTimezoneAdd(timezone);
        }
        setShowTimezoneSelector(false);
        setSearchQuery('');
    };

    const handleTimezoneRemove = (timezone: string) => {
        setTimezones(timezones.filter(tz => tz !== timezone));
        onTimezoneRemove(timezone);
    };

    const handleHourClick = (hour: number) => {
        const newTime = new Date(selectedTime);
        newTime.setHours(hour, 0, 0, 0);
        onTimeChange(newTime);
    };

    const handleHourDrag = (hour: number) => {
        setDraggedHour(hour);
    };

    const handleHourDrop = (targetHour: number) => {
        if (draggedHour !== null) {
            const newTime = new Date(selectedTime);
            newTime.setHours(targetHour, 0, 0, 0);
            onTimeChange(newTime);
        }
        setDraggedHour(null);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Time Zone Grid
                    </h2>
                </div>
                <button
                    onClick={() => setShowTimezoneSelector(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Timezone
                </button>
            </div>

            {/* Selected Time Display */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Selected Time:</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {formatTime(selectedTime)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {/* Timezone Grid */}
            <div className="space-y-4">
                {timezoneRows.map((row, index) => (
                    <div key={row.timezone.timezone} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                        {/* Timezone Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        {row.timezone.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {row.timezone.timezone} • {row.currentTime} • {row.date}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleTimezoneRemove(row.timezone.timezone)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* 24-Hour Grid */}
                        <div className="grid grid-cols-12 gap-1">
                            {row.timeSlots.map((slot) => (
                                <button
                                    key={slot.hour}
                                    onClick={() => handleHourClick(slot.hour)}
                                    onMouseDown={() => handleHourDrag(slot.hour)}
                                    onMouseUp={() => handleHourDrop(slot.hour)}
                                    className={`
                    relative p-2 text-xs rounded transition-all duration-200
                    ${slot.isSelected
                                            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                            : slot.isCurrentTime
                                                ? 'bg-green-500 text-white'
                                                : slot.isBusinessHours
                                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                                                    : slot.isWeekend
                                                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }
                    ${draggedHour === slot.hour ? 'opacity-50' : ''}
                  `}
                                >
                                    <div className="text-center">
                                        <div className="font-medium">{slot.hour}</div>
                                        <div className="text-xs opacity-75">{slot.formatted}</div>
                                    </div>

                                    {/* Visual indicators */}
                                    {slot.isSelected && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full"></div>
                                    )}
                                    {slot.isCurrentTime && (
                                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex flex-wrap gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900 rounded"></div>
                                <span className="text-slate-600 dark:text-slate-400">Business Hours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-100 dark:bg-red-900 rounded"></div>
                                <span className="text-slate-600 dark:text-slate-400">Weekend</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span className="text-slate-600 dark:text-slate-400">Current Time</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                                <span className="text-slate-600 dark:text-slate-400">Selected</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Timezone Selector Modal */}
            {showTimezoneSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Add Timezone
                            </h3>
                            <button
                                onClick={() => setShowTimezoneSelector(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search cities or countries..."
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Results */}
                        <div className="max-h-96 overflow-y-auto">
                            <div className="space-y-2">
                                {searchResults.map((tz) => (
                                    <button
                                        key={tz.timezone}
                                        onClick={() => handleTimezoneAdd(tz.timezone)}
                                        disabled={timezones.includes(tz.timezone)}
                                        className={`
                      w-full p-3 text-left rounded-lg transition-colors
                      ${timezones.includes(tz.timezone)
                                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                                : 'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600'
                                            }
                    `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{tz.name}</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    {tz.city}, {tz.country} • {tz.timezone}
                                                </div>
                                            </div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {tz.offset}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                            How to Use
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Click any hour to select that time</li>
                            <li>• Green dot shows current time in each timezone</li>
                            <li>• Blue shading indicates business hours (9 AM - 5 PM)</li>
                            <li>• Red shading indicates weekends</li>
                            <li>• Add more timezones using the "Add Timezone" button</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
