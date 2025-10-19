'use client';

import { useState } from 'react';
import { Clock, Users, Calendar, Share2, Globe } from 'lucide-react';
import TimeZoneGrid from '../components/TimeZoneGrid';
import MeetingFinder from '../components/MeetingFinder';
import TeamManager from '../components/TeamManager';
import { SavedTeam } from '../lib/timezones';

export default function Home() {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'converter' | 'meeting' | 'teams'>('converter');
  const [timezones, setTimezones] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Tokyo']);

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
  };

  const handleTimezoneAdd = (timezone: string) => {
    setTimezones(prev => [...prev, timezone]);
  };

  const handleTimezoneRemove = (timezone: string) => {
    setTimezones(prev => prev.filter(tz => tz !== timezone));
  };

  const handleTeamLoad = (team: SavedTeam) => {
    const teamTimezones = team.members.map(member => member.timezone);
    setTimezones(teamTimezones);
    setActiveTab('converter');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Time Zone Meeting{' '}
            <span className="text-blue-600 dark:text-blue-400">Scheduler</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Schedule meetings across time zones easily. Visual time zone converter with shareable links. 
            Find overlapping hours for remote teams.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('converter')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'converter'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Globe className="w-4 h-4" />
              Time Zone Converter
            </button>
            <button
              onClick={() => setActiveTab('meeting')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'meeting'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Meeting Finder
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'teams'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              Team Manager
            </button>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'converter' && (
          <TimeZoneGrid
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
            onTimezoneAdd={handleTimezoneAdd}
            onTimezoneRemove={handleTimezoneRemove}
          />
        )}

        {activeTab === 'meeting' && (
          <MeetingFinder
            timezones={timezones}
            selectedTime={selectedTime}
            onTimeSelect={handleTimeChange}
          />
        )}

        {activeTab === 'teams' && (
          <TeamManager onTeamLoad={handleTeamLoad} />
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {timezones.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Timezones
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              24/7
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Coverage
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              100%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Free
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              Global
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Teams
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Add Timezones</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Add the timezones of your team members to see all times at once
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Find Meeting Times</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Use the meeting finder to discover optimal times for all participants
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Share & Schedule</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Copy meeting links, add to calendar, or save team configurations
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How accurate are the timezone conversions?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our tool uses the official IANA timezone database and automatically handles daylight saving time changes. 
                All conversions are accurate to the minute.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can I save my team configurations?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes! Use the Team Manager to save team members with their timezones and working hours. 
                This data is stored locally in your browser.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How does the meeting finder work?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                The meeting finder analyzes all timezones and finds overlapping business hours. 
                It scores each time slot based on how many people are available during business hours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can I add the meeting to my calendar?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes! You can download .ics files, add to Google Calendar, or add to Outlook directly from the meeting finder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}