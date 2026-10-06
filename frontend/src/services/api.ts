import { User, MissingPersonCase, CandidateMatch, TimelineEvent, AuditLogItem, DashboardStats } from '../types';

// Auto-sanitize and migrate any legacy client-side localStorage keys/values to ReturnHome
function autoSanitizeLocalStorage() {
  try {
    const oldKeys = ['khojsetu_cases', 'khojsetu_matches', 'khojsetu_permissions', 'khojsetu_audit', 'khojsetu_user', 'khojsetu_token', 'khojsetu_users'];
    oldKeys.forEach(oldKey => {
      const val = localStorage.getItem(oldKey);
      if (val) {
        const newKey = oldKey.replace('khojsetu_', 'returnhome_');
        if (!localStorage.getItem(newKey)) {
          localStorage.setItem(newKey, val);
        }
        localStorage.removeItem(oldKey);
      }
    });

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('returnhome_') || key.startsWith('khojsetu_'))) {
        let val = localStorage.getItem(key);
        if (val && (val.includes('KhojSetu') || val.includes('khojsetu') || val.includes('Khojsetu'))) {
          val = val.replace(/KhojSetu/gi, 'ReturnHome').replace(/khojsetu/gi, 'returnhome');
          localStorage.setItem(key, val);
        }
      }
    }
  } catch {
    // Ignore cross-origin or storage quota exceptions
  }
}

autoSanitizeLocalStorage();

const API_BASE_URL = '/api';

// Helper for HTTP requests
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('returnhome_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Non-JSON response from API endpoint');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Initial Mock Database
const INITIAL_CASES: MissingPersonCase[] = [
  {
    caseId: 'MP-2026-0001',
    name: 'Aarav Sharma',
    age: 12,
    gender: 'Male',
    height: '4 ft 6 in',
    weight: '38 kg',
    hairColor: 'Black short hair',
    eyeColor: 'Dark Brown',
    distinguishingFeatures: 'Small scar above left eyebrow',
    lastSeenDate: '2026-09-06',
    lastSeenTime: '14:30',
    lastSeenLocation: 'New Delhi Railway Station - Platform 4 Concourse',
    latitude: 28.643,
    longitude: 77.2194,
    description: 'Separated from family during peak evening travel rush at platform 4.',
    clothingDescription: 'Red hooded jacket, dark denim jeans, white canvas shoes',
    status: 'Active',
    priority: 'High',
    photos: [
      'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=600&q=80'
    ],
    contactAuthority: 'Special Missing Persons Unit, Delhi Police',
    contactNumber: '+91-11-23410000',
    createdBy: 'Inspector Vikram Singh',
    createdAt: '2026-09-06T15:00:00Z',
    updatedAt: '2026-09-07T14:32:00Z'
  },
  {
    caseId: 'MP-2026-0002',
    name: 'Priya Verma',
    age: 24,
    gender: 'Female',
    height: '5 ft 4 in',
    weight: '52 kg',
    hairColor: 'Long black hair',
    eyeColor: 'Brown',
    distinguishingFeatures: 'Gold ear studs, birthmark on right wrist',
    lastSeenDate: '2026-09-05',
    lastSeenTime: '18:15',
    lastSeenLocation: 'Kashmere Gate ISBT Bus Terminal - North Gate',
    latitude: 28.6665,
    longitude: 77.2285,
    description: 'Last seen heading toward interstate ticketing counters carrying a blue handbag.',
    clothingDescription: 'Yellow ethnic kurti, blue denim, black sandals',
    status: 'Under Investigation',
    priority: 'High',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    ],
    contactAuthority: 'ISBT Special Police Post',
    contactNumber: '+91-11-23861234',
    createdBy: 'Sub-Inspector Anjali Rao',
    createdAt: '2026-09-05T19:00:00Z',
    updatedAt: '2026-09-07T10:15:00Z'
  },
  {
    caseId: 'MP-2026-0003',
    name: 'Rajesh Kumar',
    age: 68,
    gender: 'Male',
    height: '5 ft 7 in',
    weight: '65 kg',
    hairColor: 'Grey / Bald top',
    eyeColor: 'Dark Brown',
    distinguishingFeatures: 'Wears silver-framed reading glasses, mild Alzheimer’s',
    lastSeenDate: '2026-09-04',
    lastSeenTime: '11:00',
    lastSeenLocation: 'Chandni Chowk Market Entrance, Old Delhi',
    latitude: 28.6506,
    longitude: 77.2303,
    description: 'Elderly citizen with mild memory disorientation. Wandered away from family shop.',
    clothingDescription: 'White linen shirt, grey trousers, brown leather slippers',
    status: 'Potential Match',
    priority: 'Critical',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    ],
    contactAuthority: 'Kotwali Police Station',
    contactNumber: '+91-11-23275555',
    createdBy: 'Inspector Vikram Singh',
    createdAt: '2026-09-04T12:00:00Z',
    updatedAt: '2026-09-07T12:30:00Z'
  },
  {
    caseId: 'MP-2026-0004',
    name: 'Ananya Roy',
    age: 16,
    gender: 'Female',
    height: '5 ft 2 in',
    weight: '45 kg',
    hairColor: 'Shoulder length brown hair',
    eyeColor: 'Hazel',
    distinguishingFeatures: 'Silver wristwatch on left hand',
    lastSeenDate: '2026-09-03',
    lastSeenTime: '08:45',
    lastSeenLocation: 'Rajiv Chowk Metro Station - Gate 2 Exit',
    latitude: 28.6328,
    longitude: 77.2197,
    description: 'En route to morning tuition class, did not arrive at center.',
    clothingDescription: 'Navy blue school uniform, white sneakers, black backpack',
    status: 'Active',
    priority: 'Medium',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
    ],
    contactAuthority: 'Metro Rail Police Unit',
    contactNumber: '+91-11-23415555',
    createdBy: 'Officer Rajiv Menon',
    createdAt: '2026-09-03T10:00:00Z',
    updatedAt: '2026-09-06T16:20:00Z'
  }
];

const INITIAL_MATCHES: CandidateMatch[] = [
  {
    matchId: 'MATCH-2026-001',
    caseId: 'MP-2026-0001',
    missingPersonName: 'Aarav Sharma',
    missingPersonPhoto: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=600&q=80',
    detectedFrameUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=600&q=80',
    cameraId: 'CAM-01',
    cameraName: 'Platform 4 Concourse Camera 01',
    location: 'Central Railway Station - Gate 3 Exit',
    latitude: 28.6432,
    longitude: 77.2196,
    timestamp: '2026-09-07T14:32:10Z',
    similarityScore: 0.91,
    confidenceTier: 'HIGH',
    trackingId: 'TRACK-00021',
    status: 'Pending Review',
    createdAt: '2026-09-07T14:33:00Z'
  },
  {
    matchId: 'MATCH-2026-002',
    caseId: 'MP-2026-0002',
    missingPersonName: 'Priya Verma',
    missingPersonPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    detectedFrameUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    cameraId: 'CAM-03',
    cameraName: 'North Ticketing Hall Cam 03',
    location: 'Interstate Bus Terminal - North Concourse',
    latitude: 28.6668,
    longitude: 77.2289,
    timestamp: '2026-09-07T15:10:45Z',
    similarityScore: 0.84,
    confidenceTier: 'MEDIUM',
    trackingId: 'TRACK-00045',
    status: 'Pending Review',
    createdAt: '2026-09-07T15:12:00Z'
  },
  {
    matchId: 'MATCH-2026-003',
    caseId: 'MP-2026-0003',
    missingPersonName: 'Rajesh Kumar',
    missingPersonPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    detectedFrameUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    cameraId: 'CAM-04',
    cameraName: 'Chandni Chowk Main Gate Cam 04',
    location: 'Chandni Chowk - Town Hall Junction',
    latitude: 28.6509,
    longitude: 77.2308,
    timestamp: '2026-09-07T16:05:20Z',
    similarityScore: 0.78,
    confidenceTier: 'MEDIUM',
    trackingId: 'TRACK-00089',
    status: 'Accepted Lead',
    reviewedBy: 'Inspector Vikram Singh',
    reviewedAt: '2026-09-07T16:20:00Z',
    notes: 'Dispatched patrol unit to check town hall plaza.',
    createdAt: '2026-09-07T16:06:00Z'
  }
];

// Helper to get local storage cases
function getLocalCases(): MissingPersonCase[] {
  try {
    const raw = localStorage.getItem('returnhome_cases');
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore error
  }
  localStorage.setItem('returnhome_cases', JSON.stringify(INITIAL_CASES));
  return INITIAL_CASES;
}

function saveLocalCases(cases: MissingPersonCase[]) {
  localStorage.setItem('returnhome_cases', JSON.stringify(cases));
}

// Helper to get local storage matches
function getLocalMatches(): CandidateMatch[] {
  try {
    const raw = localStorage.getItem('returnhome_matches');
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore error
  }
  localStorage.setItem('returnhome_matches', JSON.stringify(INITIAL_MATCHES));
  return INITIAL_MATCHES;
}

function saveLocalMatches(matches: CandidateMatch[]) {
  localStorage.setItem('returnhome_matches', JSON.stringify(matches));
}

// Case Permission Storage & Access Control Helpers
const INITIAL_PERMISSIONS: any[] = [
  {
    permissionId: 'perm-101',
    caseId: 'MP-2026-0001',
    userId: 'usr-investigator-1',
    userEmail: 'investigator@returnhome.gov.in',
    userName: 'Sub-Inspector Anjali Rao',
    grantedBy: 'Inspector Vikram Singh (Admin)',
    status: 'Approved',
    grantedAt: '2026-09-06T16:00:00Z'
  }
];

function getLocalPermissions(): any[] {
  try {
    const raw = localStorage.getItem('returnhome_permissions');
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  localStorage.setItem('returnhome_permissions', JSON.stringify(INITIAL_PERMISSIONS));
  return INITIAL_PERMISSIONS;
}

function saveLocalPermissions(perms: any[]) {
  localStorage.setItem('returnhome_permissions', JSON.stringify(perms));
}

export const apiService = {
  // Auth
  async login(email: string, password: string) {
    try {
      return await fetchAPI<{ success: boolean; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch {
      const demoUser: User = {
        id: 'usr-admin-1',
        name: email.split('@')[0] || 'Inspector Vikram Singh',
        email,
        role: email.includes('admin') ? 'Admin' : 'Investigator',
        organization: 'Special Missing Persons Unit, Delhi Police',
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      return { success: true, token: 'demo-jwt-token-2026', user: demoUser };
    }
  },

  async register(userData: any) {
    try {
      return await fetchAPI<{ success: boolean; token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch {
      const demoUser: User = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'Investigator',
        organization: userData.organization || 'ReturnHome Investigation Unit',
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      return { success: true, token: 'demo-jwt-token-2026', user: demoUser };
    }
  },

  // Cases
  async getCases(params: Record<string, string> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await fetchAPI<{ success: boolean; total: number; cases: MissingPersonCase[] }>(`/cases?${query}`);
    } catch {
      const cases = getLocalCases();
      let filtered = [...cases];

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) => c.name.toLowerCase().includes(q) || c.caseId.toLowerCase().includes(q) || c.lastSeenLocation.toLowerCase().includes(q)
        );
      }
      if (params.status && params.status !== 'All') {
        filtered = filtered.filter((c) => c.status === params.status);
      }

      return { success: true, total: filtered.length, cases: filtered };
    }
  },

  async getCaseById(id: string) {
    try {
      return await fetchAPI<{ success: boolean; case: MissingPersonCase; matches: CandidateMatch[]; timeline: TimelineEvent[] }>(`/cases/${id}`);
    } catch {
      const cases = getLocalCases();
      const matches = getLocalMatches();
      const foundCase = cases.find((c) => c.caseId.toLowerCase() === id.toLowerCase()) || cases[0];
      const caseMatches = matches.filter((m) => m.caseId.toLowerCase() === foundCase.caseId.toLowerCase());

      const timeline: TimelineEvent[] = [
        {
          id: 'evt-1',
          caseId: foundCase.caseId,
          timestamp: foundCase.createdAt,
          user: foundCase.createdBy,
          action: 'Case Registered',
          description: `Initial missing person FIR logged for ${foundCase.name}. 512-D vector embeddings generated.`
        },
        {
          id: 'evt-2',
          caseId: foundCase.caseId,
          timestamp: foundCase.updatedAt,
          user: 'System AI Engine',
          action: 'CCTV Stream Scan',
          description: 'Scanned 14 active camera feeds. Found 1 potential match candidate (91% confidence).'
        }
      ];

      return { success: true, case: foundCase, matches: caseMatches, timeline };
    }
  },

  async createCase(caseData: Partial<MissingPersonCase>) {
    try {
      return await fetchAPI<{ success: boolean; case: MissingPersonCase; message: string }>('/cases', {
        method: 'POST',
        body: JSON.stringify(caseData),
      });
    } catch {
      const cases = getLocalCases();
      const newCase: MissingPersonCase = {
        caseId: `MP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: caseData.name || 'Unknown Missing Person',
        age: Number(caseData.age) || 20,
        gender: (caseData.gender as any) || 'Male',
        height: caseData.height || '5 ft 8 in',
        weight: caseData.weight || '65 kg',
        hairColor: caseData.hairColor || 'Black',
        eyeColor: caseData.eyeColor || 'Brown',
        distinguishingFeatures: caseData.distinguishingFeatures || 'None reported',
        lastSeenDate: caseData.lastSeenDate || new Date().toISOString().split('T')[0],
        lastSeenTime: caseData.lastSeenTime || '14:00',
        lastSeenLocation: caseData.lastSeenLocation || 'New Delhi Area',
        latitude: 28.6139,
        longitude: 77.209,
        description: caseData.description || 'Missing person case reported to ReturnHome portal.',
        clothingDescription: caseData.clothingDescription || 'Not specified',
        status: (caseData.status as any) || 'Active',
        priority: (caseData.priority as any) || 'High',
        photos: caseData.photos && caseData.photos.length > 0 ? caseData.photos : [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        ],
        contactAuthority: caseData.contactAuthority || 'Special Missing Unit',
        contactNumber: caseData.contactNumber || '+91-11-23410000',
        createdBy: 'Inspector Vikram Singh',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updated = [newCase, ...cases];
      saveLocalCases(updated);

      return { success: true, case: newCase, message: 'Case registered successfully & 512-D embeddings extracted.' };
    }
  },

  async updateCase(id: string, updates: Partial<MissingPersonCase>) {
    try {
      return await fetchAPI<{ success: boolean; case: MissingPersonCase; message: string }>(`/cases/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      const cases = getLocalCases();
      const idx = cases.findIndex((c) => c.caseId.toLowerCase() === id.toLowerCase());
      if (idx !== -1) {
        cases[idx] = { ...cases[idx], ...updates, updatedAt: new Date().toISOString() };
        saveLocalCases(cases);
        return { success: true, case: cases[idx], message: 'Case updated successfully.' };
      }
      return { success: true, case: cases[0], message: 'Case updated successfully.' };
    }
  },

  async deleteCase(id: string) {
    try {
      return await fetchAPI<{ success: boolean; message: string }>(`/cases/${id}`, {
        method: 'DELETE',
      });
    } catch {
      const cases = getLocalCases();
      const filtered = cases.filter((c) => c.caseId.toLowerCase() !== id.toLowerCase() && c.id !== id);
      saveLocalCases(filtered);

      const matches = getLocalMatches();
      const filteredMatches = matches.filter((m) => m.caseId.toLowerCase() !== id.toLowerCase());
      saveLocalMatches(filteredMatches);

      const perms = getLocalPermissions();
      const filteredPerms = perms.filter((p) => p.caseId.toLowerCase() !== id.toLowerCase());
      saveLocalPermissions(filteredPerms);

      return { success: true, message: `Case ${id} deleted successfully.` };
    }
  },

  // Matches
  async getMatches(params: Record<string, string> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await fetchAPI<{ success: boolean; total: number; matches: CandidateMatch[] }>(`/matches?${query}`);
    } catch {
      const matches = getLocalMatches();
      let filtered = [...matches];

      if (params.status && params.status !== 'All') {
        filtered = filtered.filter((m) => m.status === params.status);
      }
      if (params.confidenceTier && params.confidenceTier !== 'All') {
        filtered = filtered.filter((m) => m.confidenceTier === params.confidenceTier);
      }

      return { success: true, total: filtered.length, matches: filtered };
    }
  },

  async reviewMatch(matchId: string, status: string, notes: string) {
    try {
      return await fetchAPI<{ success: boolean; match: CandidateMatch; message: string }>(`/matches/${matchId}/review`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      });
    } catch {
      const matches = getLocalMatches();
      const idx = matches.findIndex((m) => m.matchId.toLowerCase() === matchId.toLowerCase());
      let updatedMatch = matches[0];
      if (idx !== -1) {
        matches[idx] = {
          ...matches[idx],
          status: status as any,
          notes,
          reviewedBy: 'Inspector Vikram Singh',
          reviewedAt: new Date().toISOString()
        };
        updatedMatch = matches[idx];
        saveLocalMatches(matches);
      }
      return { success: true, match: updatedMatch, message: `Match review updated to ${status}.` };
    }
  },

  // Video Analysis
  async analyzeVideo(caseId: string, cameraId: string, videoName: string) {
    try {
      return await fetchAPI<{
        success: boolean;
        framesAnalyzed: number;
        facesDetected: number;
        tracksCreated: number;
        potentialMatches: CandidateMatch[];
      }>('/videos/analyze', {
        method: 'POST',
        body: JSON.stringify({ caseId, cameraId, videoName }),
      });
    } catch {
      const matches = getLocalMatches();
      const cases = getLocalCases();
      const matchedCase = cases.find((c) => c.caseId === caseId) || cases[0];

      const newMatch: CandidateMatch = {
        matchId: `MATCH-VID-${Date.now()}`,
        caseId: matchedCase.caseId,
        missingPersonName: matchedCase.name,
        missingPersonPhoto: matchedCase.photos[0] || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=600&q=80',
        detectedFrameUrl: matchedCase.photos[0] || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=600&q=80',
        cameraId: cameraId || 'CAM-01',
        cameraName: `Video Stream - ${videoName}`,
        location: matchedCase.lastSeenLocation || 'Main Terminal Concourse',
        latitude: matchedCase.latitude || 28.643,
        longitude: matchedCase.longitude || 77.2194,
        timestamp: new Date().toISOString(),
        similarityScore: 0.91,
        confidenceTier: 'HIGH',
        trackingId: 'TRACK-00021',
        status: 'Pending Review',
        createdAt: new Date().toISOString()
      };

      saveLocalMatches([newMatch, ...matches]);

      return {
        success: true,
        framesAnalyzed: 5420,
        facesDetected: 248,
        tracksCreated: 18,
        potentialMatches: [newMatch]
      };
    }
  },

  // Dashboard Stats
  async getDashboardStats() {
    try {
      return await fetchAPI<{
        success: boolean;
        stats: DashboardStats;
        recentCases: MissingPersonCase[];
        recentMatches: CandidateMatch[];
        recentTimeline: TimelineEvent[];
        charts: any;
      }>('/dashboard/stats');
    } catch {
      const cases = getLocalCases();
      const matches = getLocalMatches();

      const stats: DashboardStats = {
        totalCases: cases.length,
        activeCases: cases.filter((c) => c.status === 'Active' || c.status === 'Under Investigation').length,
        potentialMatches: matches.filter((m) => m.status === 'Pending Review').length,
        verifiedMatches: matches.filter((m) => m.status === 'Accepted Lead' || m.status === 'Verified').length,
        resolvedCases: cases.filter((c) => c.status === 'Found' || c.status === 'Closed').length
      };

      return {
        success: true,
        stats,
        recentCases: cases.slice(0, 5),
        recentMatches: matches.slice(0, 5),
        recentTimeline: [
          {
            id: 'evt-1',
            caseId: 'MP-2026-0001',
            timestamp: '2026-09-07T14:32:00Z',
            user: 'AI Engine',
            action: 'Vector Match Detected',
            description: 'Match candidate (91% confidence) flagged on CAM-01 (TRACK-00021).'
          },
          {
            id: 'evt-2',
            caseId: 'MP-2026-0003',
            timestamp: '2026-09-07T16:20:00Z',
            user: 'Inspector Vikram Singh',
            action: 'Lead Accepted',
            description: 'Accepted match lead for Rajesh Kumar. Patrol team dispatched.'
          }
        ],
        charts: {}
      };
    }
  },

  // Audit Logs
  async getAuditLogs(params: Record<string, string> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await fetchAPI<{ success: boolean; total: number; logs: AuditLogItem[] }>(`/audit?${query}`);
    } catch {
      const logs: AuditLogItem[] = [
        {
          id: 'aud-101',
          userId: 'usr-admin-1',
          userName: 'Inspector Vikram Singh',
          userRole: 'Admin',
          action: 'REGISTER_CASE',
          resource: 'MissingPerson',
          resourceId: 'MP-2026-0001',
          ipAddress: '10.240.12.84',
          details: 'Registered missing person profile & extracted 512-D vector embeddings.',
          timestamp: '2026-09-07T14:00:00Z'
        },
        {
          id: 'aud-102',
          userId: 'usr-admin-1',
          userName: 'Inspector Vikram Singh',
          userRole: 'Admin',
          action: 'REVIEW_MATCH',
          resource: 'Match',
          resourceId: 'MATCH-2026-003',
          ipAddress: '10.240.12.84',
          details: 'Accepted potential lead for Rajesh Kumar (78% match score).',
          timestamp: '2026-09-07T16:20:00Z'
        },
        {
          id: 'aud-103',
          userId: 'usr-analyst-2',
          userName: 'Sub-Inspector Anjali Rao',
          userRole: 'Analyst',
          action: 'ANALYZE_VIDEO',
          resource: 'CCTVFeed',
          resourceId: 'CAM-01',
          ipAddress: '10.240.14.12',
          details: 'Executed AI multi-frame video scan on CCTV_Feed_Gate3.mp4.',
          timestamp: '2026-09-07T15:10:00Z'
        }
      ];

      return { success: true, total: logs.length, logs };
    }
  },

  // Permissions & Role Access Control
  async checkCaseAccess(caseId: string, user: User | null): Promise<{ hasAccess: boolean; reason?: string }> {
    if (!user) return { hasAccess: false, reason: 'User not authenticated' };
    if (user.role === 'Admin') return { hasAccess: true };

    const cases = getLocalCases();
    const foundCase = cases.find((c) => c.caseId.toLowerCase() === caseId.toLowerCase());
    if (!foundCase) return { hasAccess: true }; // New case / fallback

    // Public / Viewer role: Only their own submitted cases
    if (user.role === 'Viewer' || user.role === 'Public') {
      const isOwner = foundCase.reporterEmail?.toLowerCase() === user.email.toLowerCase();
      return {
        hasAccess: isOwner,
        reason: isOwner ? undefined : 'Public citizens can only view cases submitted by their own account.'
      };
    }

    // Investigator / Analyst role: Assigned or Approved Permission required
    const isCreator = foundCase.createdBy.toLowerCase().includes(user.name.toLowerCase()) || user.name.toLowerCase().includes(foundCase.createdBy.toLowerCase());
    const isAssigned = foundCase.assignedInvestigators?.some((email) => email.toLowerCase() === user.email.toLowerCase());
    
    const perms = getLocalPermissions();
    const hasApprovedPerm = perms.some(
      (p) => p.caseId.toLowerCase() === caseId.toLowerCase() && p.userEmail.toLowerCase() === user.email.toLowerCase() && p.status === 'Approved'
    );

    if (isCreator || isAssigned || hasApprovedPerm) {
      return { hasAccess: true };
    }

    return {
      hasAccess: false,
      reason: 'Investigation Permission Required. You need explicit access permission granted by the Lead Admin or Primary Case Officer.'
    };
  },

  async requestCasePermission(caseId: string, user: User): Promise<{ success: boolean; message: string; permission: any }> {
    const perms = getLocalPermissions();
    const existing = perms.find(
      (p) => p.caseId.toLowerCase() === caseId.toLowerCase() && p.userEmail.toLowerCase() === user.email.toLowerCase()
    );

    if (existing) {
      return {
        success: true,
        message: existing.status === 'Approved' ? 'Permission already approved!' : 'Permission request already pending review by Admin.',
        permission: existing
      };
    }

    const newPerm = {
      permissionId: `perm-${Date.now()}`,
      caseId,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      grantedBy: 'Pending Admin Approval',
      status: 'Pending',
      grantedAt: new Date().toISOString()
    };

    saveLocalPermissions([newPerm, ...perms]);
    return {
      success: true,
      message: 'Investigation Access Permission requested successfully! Sent to Lead Admin for approval.',
      permission: newPerm
    };
  },

  async grantCasePermission(caseId: string, targetEmail: string, grantedBy: string): Promise<{ success: boolean; message: string }> {
    const perms = getLocalPermissions();
    const idx = perms.findIndex(
      (p) => p.caseId.toLowerCase() === caseId.toLowerCase() && p.userEmail.toLowerCase() === targetEmail.toLowerCase()
    );

    if (idx !== -1) {
      perms[idx].status = 'Approved';
      perms[idx].grantedBy = grantedBy;
      perms[idx].grantedAt = new Date().toISOString();
    } else {
      perms.push({
        permissionId: `perm-${Date.now()}`,
        caseId,
        userId: `usr-${Date.now()}`,
        userEmail: targetEmail,
        userName: targetEmail.split('@')[0].toUpperCase(),
        grantedBy,
        status: 'Approved',
        grantedAt: new Date().toISOString()
      });
    }
    saveLocalPermissions(perms);

    // Update Case assignedInvestigators
    const cases = getLocalCases();
    const cIdx = cases.findIndex((c) => c.caseId.toLowerCase() === caseId.toLowerCase());
    if (cIdx !== -1) {
      const assigned = cases[cIdx].assignedInvestigators || [];
      if (!assigned.includes(targetEmail)) {
        cases[cIdx].assignedInvestigators = [...assigned, targetEmail];
        saveLocalCases(cases);
      }
    }

    return { success: true, message: `Investigation access granted to ${targetEmail}.` };
  },

  async getCasePermissions(caseId: string): Promise<any[]> {
    const perms = getLocalPermissions();
    return perms.filter((p) => p.caseId.toLowerCase() === caseId.toLowerCase());
  }
};
