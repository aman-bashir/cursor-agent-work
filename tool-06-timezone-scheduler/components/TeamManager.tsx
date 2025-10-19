'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Clock, 
  MapPin,
  UserPlus
} from 'lucide-react';
import { 
  SavedTeam, 
  TeamMember, 
  saveTeam, 
  getSavedTeams, 
  deleteTeam, 
  createTeam,
  getAllTimezones 
} from '../lib/timezones';

interface TeamManagerProps {
  onTeamLoad: (team: SavedTeam) => void;
}

export default function TeamManager({ onTeamLoad }: TeamManagerProps) {
  const [teams, setTeams] = useState<SavedTeam[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<SavedTeam | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberTimezone, setNewMemberTimezone] = useState('America/New_York');
  const [newMemberStartHour, setNewMemberStartHour] = useState(9);
  const [newMemberEndHour, setNewMemberEndHour] = useState(17);
  const [newMemberWorkingDays, setNewMemberWorkingDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri

  const timezones = getAllTimezones();

  useEffect(() => {
    setTeams(getSavedTeams());
  }, []);

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;

    const team = createTeam(newTeamName, []);
    saveTeam(team);
    setTeams([...teams, team]);
    setNewTeamName('');
    setShowCreateForm(false);
  };

  const handleAddMember = (teamId: string) => {
    if (!newMemberName.trim()) return;

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: newMemberName,
      timezone: newMemberTimezone,
      workingHours: {
        start: newMemberStartHour,
        end: newMemberEndHour
      },
      workingDays: newMemberWorkingDays
    };

    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const updatedTeam = {
          ...team,
          members: [...team.members, newMember]
        };
        saveTeam(updatedTeam);
        return updatedTeam;
      }
      return team;
    });

    setTeams(updatedTeams);
    setNewMemberName('');
    setNewMemberTimezone('America/New_York');
    setNewMemberStartHour(9);
    setNewMemberEndHour(17);
    setNewMemberWorkingDays([1, 2, 3, 4, 5]);
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const updatedTeam = {
          ...team,
          members: team.members.filter(member => member.id !== memberId)
        };
        saveTeam(updatedTeam);
        return updatedTeam;
      }
      return team;
    });

    setTeams(updatedTeams);
  };

  const handleDeleteTeam = (teamId: string) => {
    deleteTeam(teamId);
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const handleLoadTeam = (team: SavedTeam) => {
    onTeamLoad(team);
  };

  const toggleWorkingDay = (day: number) => {
    setNewMemberWorkingDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const getDayName = (day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };

  const formatWorkingHours = (start: number, end: number) => {
    const formatHour = (hour: number) => {
      if (hour === 0) return '12 AM';
      if (hour < 12) return `${hour} AM`;
      if (hour === 12) return '12 PM';
      return `${hour - 12} PM`;
    };
    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Team Manager
          </h2>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Team
        </button>
      </div>

      {/* Create Team Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name..."
              className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleCreateTeam}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Teams List */}
      <div className="space-y-4">
        {teams.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No teams saved yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Create your first team to save timezone configurations.
            </p>
          </div>
        ) : (
          teams.map((team) => (
            <div key={team.id} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
              {/* Team Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {team.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {team.members.length} members • Created {team.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadTeam(team)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-3">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {member.timezone.split('/')[1]?.replace('_', ' ') || member.timezone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatWorkingHours(member.workingHours.start, member.workingHours.end)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(team.id, member.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Add Member Form */}
                <div className="p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <UserPlus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Add Team Member
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Member name..."
                      className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                    <select
                      value={newMemberTimezone}
                      onChange={(e) => setNewMemberTimezone(e.target.value)}
                      className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.timezone} value={tz.timezone}>
                          {tz.name} ({tz.timezone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                        Working Hours
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          value={newMemberStartHour}
                          onChange={(e) => setNewMemberStartHour(Number(e.target.value))}
                          className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                              {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                            </option>
                          ))}
                        </select>
                        <span className="text-slate-600 dark:text-slate-400">to</span>
                        <select
                          value={newMemberEndHour}
                          onChange={(e) => setNewMemberEndHour(Number(e.target.value))}
                          className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                              {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                        Working Days
                      </label>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleWorkingDay(day)}
                            className={`w-8 h-8 text-xs rounded transition-colors ${
                              newMemberWorkingDays.includes(day)
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {getDayName(day)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddMember(team.id)}
                    disabled={!newMemberName.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded transition-colors text-sm"
                  >
                    Add Member
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
              Team Management Tips
            </h4>
            <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
              <li>• Create teams for different projects or departments</li>
              <li>• Set working hours to find optimal meeting times</li>
              <li>• Include working days to avoid weekend meetings</li>
              <li>• Load teams to quickly set up timezone grids</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
