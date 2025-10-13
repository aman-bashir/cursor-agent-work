# Tool 6: Meeting Time Zone Scheduler with Link Generator

## 🎯 Overview
**Build Priority:** #6
**Build Time:** 2 weeks
**Complexity:** ⭐⭐⭐ Medium
**Expected Revenue:** $400-800/month

A time zone converter and meeting scheduler that generates shareable links showing meeting times in multiple time zones. Helps remote teams coordinate across the globe.

## 📊 Market Analysis
- **Monthly Searches:** 90,000+
- **Competition:** Medium-Low (World Time Buddy is slow, others lack features)
- **Target Audience:** Remote teams, international businesses, freelancers, global communities
- **User Intent:** Schedule meetings, find overlapping hours, share meeting times
- **Return Rate:** Very High (recurring use case)

## ✨ Core Features

### Must-Have (MVP)
1. **Time Zone Converter**
   - Add multiple time zones (3-10)
   - Visual time slider (24-hour display)
   - Highlight current time
   - Show date changes (tomorrow/yesterday indicators)
   - Drag to select time
   - Business hours indicator (9 AM - 5 PM shading)
   - Weekend highlighting

2. **Meeting Time Finder**
   - Find overlapping business hours
   - Suggest best meeting times
   - Account for working hours per timezone
   - Exclude weekends (optional)
   - Show "sweet spot" times (good for all zones)

3. **Shareable Link Generator**
   - Generate unique URL for meeting times
   - Shows time in receiver's local timezone
   - Add to calendar buttons (Google, Outlook, Apple, ICS)
   - QR code for mobile sharing
   - Link expires in 30 days (or make permanent)

4. **Calendar Integration**
   - One-click add to Google Calendar
   - Download .ics file (works with all calendar apps)
   - Include: title, time, description, video link
   - Recurring meeting support

5. **Team Management**
   - Save team members with their timezones
   - Quick load saved teams
   - Visual team availability grid
   - Local storage (no account needed initially)

### Nice-to-Have (Phase 2)
- User accounts (save teams permanently)
- Email invites with timezone-aware times
- Integration with Zoom/Meet/Teams
- Recurring meeting scheduler
- Time zone database search (by city/country)
- Public holidays calendar
- Daylight saving time warnings
- Meeting poll (like Doodle but timezone-aware)

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Date/Time:** Day.js with timezone plugin
- **Calendar:** react-big-calendar or custom grid
- **Icons:** Lucide React
- **QR Codes:** qrcode.react

### Backend
- **Database:** PostgreSQL (for saved links, optional accounts)
- **Short URL:** Custom short URL generator
- **Calendar:** ical-generator (for .ics files)

### Libraries
```json
{
  "dayjs": "^1.11.10",
  "dayjs-timezone": "^0.1.0",
  "ical-generator": "^7.0.0",
  "qrcode.react": "^3.1.0",
  "@prisma/client": "^5.7.0",
  "nanoid": "^5.0.4"             // For short URLs
}
```

### Deployment
- **Platform:** Your VPS (Nginx + PM2)
- **Port:** 3006
- **Domain:** timezone.yourdomain.com or meet.yourdomain.com
- **Memory:** 1GB

## 💰 Monetization Strategy

### Primary Revenue (45%)
**Affiliate Links**
1. **Calendly** - $10-30 per paid conversion
   - "Need advanced scheduling? Try Calendly"
   - Placement: After using tool
   
2. **Cal.com** - $15-25 per conversion
   - Open-source alternative positioning
   
3. **SavvyCal** - $20-40 per conversion
   - Premium scheduling tool
   
4. **World Time Buddy Premium** - $5-10 per conversion
   - Competitor affiliate (yes, this works!)

5. **Zoom/Teams/Meet** - Business plan referrals
   - $20-50 per conversion

### Secondary Revenue (40%)
**Google AdSense**
- Placement 1: Below time zone grid
- Placement 2: Sidebar
- Placement 3: Bottom of page
- Expected RPM: $8-12

### Tertiary Revenue (15%)
**Premium Features** (Phase 2)
- Free: 3 saved teams, 10 links/month
- Pro ($5/month):
  - Unlimited teams
  - Unlimited links
  - Custom branding
  - No ads
  - Email invites
  - Priority support

## 🎯 SEO Strategy

### Target Keywords
**Primary:**
- "time zone converter" (60k/month)
- "meeting time zone" (15k/month)
- "world time zone converter" (12k/month)
- "time zone scheduler" (8k/month)

**Secondary:**
- "time zone meeting planner"
- "global meeting time"
- "timezone calculator"
- "find meeting time across timezones"
- "time zone comparison"

**Long-tail:**
- "schedule meeting across time zones"
- "find best time for international meeting"
- "meeting time converter"
- "time zone link generator"

### On-Page SEO
**Title:** "Time Zone Meeting Scheduler | Find Best Meeting Times Across Zones"
**Meta Description:** "Schedule meetings across time zones easily. Visual time zone converter with shareable links. Find overlapping hours. Free tool for remote teams."
**H1:** "Time Zone Meeting Scheduler"
**H2s:** "Convert Time Zones", "Find Meeting Times", "Share Your Schedule", "How to Use"

### Content Structure
```
1. Tool interface (above fold)
2. Quick example (3 timezones shown)
3. "How It Works" (3 steps)
4. "Perfect for Remote Teams" section
5. "Features" breakdown
6. "Time Zone Guide" (tips for global teams)
7. FAQ (15 questions)
8. Recommended scheduling tools (affiliate)
```

## 📈 Marketing Channels

### Launch Strategy
1. **Reddit** (Day 1-5)
   - r/remotework (100k+ members)
   - r/digitalnomad
   - r/freelance
   - r/startups
   - r/entrepreneur
   
2. **Product Hunt** (Week 2)
   - Position: "Time zone scheduling made simple"
   - Target: Remote work community
   
3. **Remote Work Communities** (Week 2-3)
   - Remote.co forums
   - Nomad List community
   - We Work Remotely
   - Slack/Discord remote work groups

4. **LinkedIn** (Ongoing)
   - Post about remote work challenges
   - Target: HR, team leads, remote workers
   - Very effective for B2B tools

### Ongoing
- Answer Quora questions about remote work
- Comment on remote work blogs
- Partner with remote work influencers
- Twitter threads about timezone struggles
- YouTube video: "Remote work tips"

## 🔧 Technical Implementation

### File Structure
```
tool-06-timezone-scheduler/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── meeting/
│   │   └── [linkId]/page.tsx   // Shared link view
│   └── api/
│       ├── generate-link/route.ts
│       ├── calendar/route.ts
│       └── validate-link/route.ts
├── components/
│   ├── TimeZoneGrid.tsx
│   ├── TimeZoneSelector.tsx
│   ├── TimeSlider.tsx
│   ├── MeetingFinder.tsx
│   ├── LinkGenerator.tsx
│   ├── CalendarButtons.tsx
│   ├── TeamManager.tsx
│   └── QRCodeDisplay.tsx
├── lib/
│   ├── timezones.ts
│   ├── calendar.ts
│   ├── linkGenerator.ts
│   └── meetingFinder.ts
├── prisma/
│   └── schema.prisma
└── data/
    └── timezones.json
```

### Database Schema

```prisma
// prisma/schema.prisma
model MeetingLink {
  id          String   @id @default(cuid())
  shortId     String   @unique  // For URL: meet.tz/abc123
  title       String?
  description String?
  datetime    DateTime
  timezones   Json     // Array of timezone objects
  duration    Int?     // Minutes
  videoLink   String?
  expiresAt   DateTime
  views       Int      @default(0)
  createdAt   DateTime @default(now())
}

model SavedTeam {
  id        String   @id @default(cuid())
  userId    String   // Session ID or user ID
  name      String
  members   Json     // Array of {name, timezone, workingHours}
  createdAt DateTime @default(now())
}
```

### Key Functions

```typescript
// lib/meetingFinder.ts
export function findOverlappingHours(
  timezones: string[],
  workingHours: { start: number; end: number }[] = []
): OverlapResult[] {
  // Find hours that work for all timezones
  // Consider working hours (9-5)
  // Exclude weekends if specified
}

export function suggestBestMeetingTime(
  timezones: string[],
  preferences: MeetingPreferences
): SuggestionResult {
  // Score each hour based on:
  // - Within working hours for all
  // - Not too early/late for anyone
  // - Weekday preferred
}

// lib/linkGenerator.ts
export async function generateMeetingLink(
  meeting: MeetingData
): Promise<{ shortId: string; url: string; qrCode: string }> {
  // Generate short ID
  // Store in database
  // Generate QR code
  // Return shareable URL
}

// lib/calendar.ts
export function generateICS(meeting: MeetingData): string {
  // Generate .ics file content
  // Include all timezone conversions
  // Add video link
}

export function getGoogleCalendarUrl(meeting: MeetingData): string {
  // Generate Google Calendar add URL
}

// lib/timezones.ts
export function convertTime(
  time: Date,
  fromZone: string,
  toZone: string
): Date

export function getTimezoneOffset(timezone: string): number

export function formatTimeInZone(
  time: Date,
  timezone: string,
  format: string
): string
```

### Time Zone Grid Algorithm

```typescript
// Display 24-hour grid for multiple timezones
function renderTimeZoneGrid(zones: string[], selectedTime: Date) {
  return zones.map(zone => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const time = dayjs(selectedTime).tz(zone).hour(i);
      return {
        hour: i,
        formatted: time.format('h A'),
        isBusinessHours: i >= 9 && i <= 17,
        isWeekend: time.day() === 0 || time.day() === 6,
        date: time.format('MMM D')
      };
    });
    return { zone, hours };
  });
}
```

## 📱 UI/UX Requirements

### Desktop Layout
```
┌─────────────────────────────────────────┐
│  Time Zone Meeting Scheduler            │
├─────────────────────────────────────────┤
│  Add timezone: [Search cities... ▼]     │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ New York (EST)  [-]             │  │
│  │ 12 1 2 3 4 5 6 7 8 9 10 11 12...│  │
│  │ AM └─┴─┴─┴─██████████─┴─┴─┴ PM  │  │
│  │                ↑ Selected: 9 AM   │  │
│  │ London (GMT)   [-]               │  │
│  │ 12 1 2 3 4 5 6 7 8 9 10 11 12...│  │
│  │    └─┴─┴─┴─████████─┴─┴─┴─ PM   │  │
│  │              2 PM (Same day)     │  │
│  │ Tokyo (JST)    [-]               │  │
│  │ 12 1 2 3 4 5 6 7 8 9 10 11 12...│  │
│  │             ████─┴─┴─┴─┴─┴─ AM   │  │
│  │        11 PM (Next day)          │  │
│  └─────────────────────────────────┘  │
│                                         │
│  💡 Best meeting time: 9 AM EST        │
│     (All within business hours)        │
│                                         │
│  [Share This Time] [Add to Calendar]   │
└─────────────────────────────────────────┘
```

### Shared Link View
- Receiver sees time in THEIR timezone automatically
- Show time in all original timezones
- Add to calendar button
- Join meeting button (if video link included)

## ⚡ Performance Requirements
- **Timezone Conversion:** < 50ms
- **Grid Rendering:** < 200ms
- **Link Generation:** < 500ms
- **Page Load:** < 1.5 seconds
- **Lighthouse Score:** 90+

## 🧪 Testing Checklist
- [ ] Test DST (Daylight Saving Time) transitions
- [ ] Test all major timezones
- [ ] Test date boundary (tomorrow/yesterday)
- [ ] Verify calendar .ics file works
- [ ] Test Google Calendar integration
- [ ] Verify link sharing works
- [ ] Test QR code generation
- [ ] Mobile responsive
- [ ] Test with 10+ timezones

## 📊 Success Metrics (Track Weekly)

### Traffic Metrics
- Unique visitors
- Return visitor rate (target: >60%)
- Bounce rate (target: <30%)
- Session duration (target: >3 minutes)

### Engagement Metrics
- Timezones added per session
- Links generated
- Calendar exports
- Link views (people clicking shared links)
- Teams saved

### Revenue Metrics
- Calendly affiliate conversions
- Ad revenue
- Premium signups (Phase 2)

## 🚀 Launch Checklist

### Pre-Launch
- [ ] All major timezones working
- [ ] DST handling correct
- [ ] Link generation functional
- [ ] Calendar exports working
- [ ] QR codes generating
- [ ] Mobile responsive
- [ ] Analytics implemented
- [ ] Affiliate links setup
- [ ] SEO content written
- [ ] Demo video created

### Launch Day
- [ ] Deploy to VPS
- [ ] Post on r/remotework
- [ ] Post on r/digitalnomad
- [ ] Launch on Product Hunt
- [ ] Share on LinkedIn
- [ ] Post in remote work communities
- [ ] Tweet about tool
- [ ] Submit to tool directories

### Post-Launch (Week 1-2)
- [ ] Monitor link generation usage
- [ ] Track popular timezone combinations
- [ ] Optimize slow features
- [ ] Gather feedback
- [ ] Write blog: "Remote work timezone tips"

## 💡 Tips for Success

1. **Automatic Detection:** Detect user's timezone automatically
2. **Visual Clarity:** Color-code business hours, weekends, etc.
3. **Mobile-First:** Teams use this on the go
4. **Quick Actions:** One-click to add calendar, share, etc.
5. **Smart Suggestions:** Highlight best meeting times
6. **DST Warnings:** Alert when daylight saving changes
7. **Recurring Meetings:** Many teams have weekly syncs

## 🔗 Useful Resources
- Day.js timezone: https://day.js.org/docs/en/timezone/timezone
- ical-generator: https://github.com/sebbo2002/ical-generator
- Time zone database: https://www.iana.org/time-zones

## 🎓 Educational Content to Add

### "Remote Work Time Zone Guide"
- Best practices for global teams
- Communication tips
- Async vs sync work
- Meeting scheduling etiquette
- Tools for remote collaboration

### "Understanding Time Zones"
- What are time zones
- DST explained
- Common mistakes
- Business hours by region

## 📅 Development Timeline

**Day 1-3:** Setup, timezone conversion logic
**Day 4-5:** Build visual time zone grid
**Day 6-7:** Meeting finder algorithm
**Day 8-9:** Link generation & sharing
**Day 10-11:** Calendar integration (.ics, Google)
**Day 12-13:** Team management, QR codes
**Day 13-14:** UI polish, testing, deployment

**Total:** 2 weeks to launch

---

## Next Steps After This Tool
Move to **Tool #7: LinkedIn Post Formatter** (fast build, growing niche, B2B audience).

This time zone tool will bring consistent recurring traffic and has good affiliate potential with Calendly.

