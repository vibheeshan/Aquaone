const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function fetchApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API Error [${res.status}]: ${errText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Fetch failed for ${endpoint}:`, error);
    throw error;
  }
}

export interface Stream {
  id: number;
  name: string;
  code?: string;
  location?: string;
  location_name?: string;
  latitude: number;
  longitude: number;
  health_score: number;
  status: "Good" | "Moderate" | "Poor" | "Critical" | string;
  water_quality_index?: number;
  pollution_index?: number;
  biodiversity_index?: number;
  ecosystem_index?: number;
  description?: string;
  updated_at?: string;
}

export interface Observation {
  id: number;
  stream_id: number;
  user_id: number;
  water_clarity: string;
  turbidity_ntu?: number;
  odor: string;
  waste_level: string;
  algae_level: string;
  flow_speed: string;
  wildlife_seen: string;
  water_temp_c?: number;
  ph_level?: number;
  dissolved_oxygen?: number;
  rainfall_mm: number;
  latitude: number;
  longitude: number;
  image_url?: string;
  notes?: string;
  status: string;
  is_demo: boolean;
  created_at: string;
}

export interface Alert {
  id: number;
  stream_id: number;
  severity: string;
  title: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

export interface LeaderboardUser {
  id: number;
  name: string;
  avatar?: string;
  points: number;
  level: string;
  badge_count: number;
  rank: number;
}

export interface Story {
  id: number;
  stream_id: number;
  title: string;
  summary: string;
  content_md: string;
  key_changes?: string[];
  one_health_impact?: string;
  created_at: string;
}

export interface OneHealthInsight {
  id: number;
  stream_id: number;
  title: string;
  ecosystem_link: string;
  human_health_risk: string;
  animal_health_risk: string;
  recommended_intervention: string;
  created_at: string;
}
