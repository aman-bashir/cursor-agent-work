import { Poll, Vote, PollResults } from './types';

// Mock poll management - in a real implementation, this would use a database
const polls = new Map<string, Poll>();
const votes = new Map<string, Vote[]>();

export async function createPoll(
  thumbnails: string[],
  title?: string
): Promise<{ pollId: string; url: string }> {
  const pollId = generateShortId();
  const shortId = pollId;
  
  const poll: Poll = {
    id: pollId,
    shortId,
    title: title || 'Thumbnail Comparison',
    thumbnails,
    votes: [],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    createdAt: new Date().toISOString()
  };

  polls.set(pollId, poll);
  votes.set(pollId, []);

  return {
    pollId,
    url: `${window.location.origin}/poll/${shortId}`
  };
}

export async function recordVote(
  pollId: string,
  thumbnailIndex: number,
  voterId: string
): Promise<void> {
  const poll = polls.get(pollId);
  if (!poll) {
    throw new Error('Poll not found');
  }

  // Check if user already voted
  const existingVotes = votes.get(pollId) || [];
  const existingVote = existingVotes.find(vote => vote.voterId === voterId);
  
  if (existingVote) {
    // Update existing vote
    existingVote.thumbnailIndex = thumbnailIndex;
  } else {
    // Create new vote
    const vote: Vote = {
      id: Date.now().toString(),
      pollId,
      thumbnailIndex,
      voterId,
      createdAt: new Date().toISOString()
    };
    existingVotes.push(vote);
  }

  votes.set(pollId, existingVotes);
}

export async function getPollResults(pollId: string): Promise<PollResults> {
  const poll = polls.get(pollId);
  if (!poll) {
    throw new Error('Poll not found');
  }

  const pollVotes = votes.get(pollId) || [];
  const totalVotes = pollVotes.length;

  // Count votes per thumbnail
  const voteCounts = new Map<number, number>();
  pollVotes.forEach(vote => {
    const count = voteCounts.get(vote.thumbnailIndex) || 0;
    voteCounts.set(vote.thumbnailIndex, count + 1);
  });

  // Calculate results
  const results = poll.thumbnails.map((_, index) => {
    const votes = voteCounts.get(index) || 0;
    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
    
    return {
      thumbnailIndex: index,
      votes,
      percentage: Math.round(percentage * 100) / 100
    };
  });

  return {
    pollId,
    totalVotes,
    results
  };
}

export async function getPoll(pollId: string): Promise<Poll | null> {
  return polls.get(pollId) || null;
}

export async function getPollByShortId(shortId: string): Promise<Poll | null> {
  for (const poll of polls.values()) {
    if (poll.shortId === shortId) {
      return poll;
    }
  }
  return null;
}

function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateVoterId(): string {
  // Generate a simple voter ID based on browser fingerprint
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('voter-id', 10, 10);
  const fingerprint = canvas.toDataURL();
  
  // Combine with timestamp for uniqueness
  return btoa(fingerprint + Date.now().toString()).slice(0, 16);
}
