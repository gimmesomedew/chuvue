import { supabase } from './supabase';

export interface AnalyticsEvent {
  id?: string;
  event_type: string;
  event_data: Record<string, any>;
  user_id?: string;
  session_id?: string;
  page_url: string;
  user_agent?: string;
  ip_address?: string;
  created_at?: string;
}

export interface SearchAnalytics {
  search_term: string;
  service_type?: string;
  state?: string;
  zip_code?: string;
  results_count: number;
  page_number: number;
  user_id?: string;
  session_id?: string;
  created_at?: string;
}

export interface PageViewAnalytics {
  page_url: string;
  page_title: string;
  time_spent: number;
  user_id?: string;
  session_id?: string;
  created_at?: string;
}

export interface UserInteractionAnalytics {
  interaction_type: 'click' | 'favorite' | 'contact' | 'website_visit' | 'map_view';
  target_id: string;
  target_type: 'service' | 'profile' | 'button' | 'link';
  user_id?: string;
  session_id?: string;
  created_at?: string;
}

// Analytics tracking functions
export class Analytics {
  private static sessionId = this.generateSessionId();
  private static userId: string | null = null;

  static setUserId(userId: string | null) {
    this.userId = userId;
  }

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async trackEvent(event: Omit<AnalyticsEvent, 'session_id' | 'user_id' | 'created_at'>) {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          ...event,
          session_id: this.sessionId,
          user_id: this.userId,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }

  static async trackSearch(searchData: Omit<SearchAnalytics, 'session_id' | 'user_id' | 'created_at'>) {
    try {
      const { error } = await supabase
        .from('search_analytics')
        .insert({
          ...searchData,
          session_id: this.sessionId,
          user_id: this.userId,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Search analytics error:', error);
      }
    } catch (error) {
      console.error('Failed to track search analytics:', error);
    }
  }

  static async trackPageView(pageData: Omit<PageViewAnalytics, 'session_id' | 'user_id' | 'created_at'>) {
    try {
      const { error } = await supabase
        .from('page_view_analytics')
        .insert({
          ...pageData,
          session_id: this.sessionId,
          user_id: this.userId,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Page view analytics error:', error);
      }
    } catch (error) {
      console.error('Failed to track page view analytics:', error);
    }
  }

  static async trackUserInteraction(interactionData: Omit<UserInteractionAnalytics, 'session_id' | 'user_id' | 'created_at'>) {
    try {
      const { error } = await supabase
        .from('user_interaction_analytics')
        .insert({
          ...interactionData,
          session_id: this.sessionId,
          user_id: this.userId,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('User interaction analytics error:', error);
      }
    } catch (error) {
      console.error('Failed to track user interaction analytics:', error);
    }
  }

  // Convenience methods for common events
  static async trackSearchEvent(searchTerm: string, serviceType?: string, state?: string, zipCode?: string, resultsCount: number = 0, pageNumber: number = 1) {
    await this.trackSearch({
      search_term: searchTerm,
      service_type: serviceType,
      state,
      zip_code: zipCode,
      results_count: resultsCount,
      page_number: pageNumber,
    });

    await this.trackEvent({
      event_type: 'search',
      event_data: {
        search_term: searchTerm,
        service_type: serviceType,
        state,
        zip_code: zipCode,
        results_count: resultsCount,
        page_number: pageNumber,
      },
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    });
  }

  static async trackServiceClick(serviceId: string, serviceName: string) {
    await this.trackUserInteraction({
      interaction_type: 'click',
      target_id: serviceId,
      target_type: 'service',
    });

    await this.trackEvent({
      event_type: 'service_click',
      event_data: {
        service_id: serviceId,
        service_name: serviceName,
      },
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    });
  }

  static async trackFavoriteToggle(serviceId: string, isFavorited: boolean) {
    await this.trackUserInteraction({
      interaction_type: 'favorite',
      target_id: serviceId,
      target_type: 'service',
    });

    await this.trackEvent({
      event_type: 'favorite_toggle',
      event_data: {
        service_id: serviceId,
        is_favorited: isFavorited,
      },
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    });
  }

  static async trackWebsiteVisit(serviceId: string, websiteUrl: string) {
    await this.trackUserInteraction({
      interaction_type: 'website_visit',
      target_id: serviceId,
      target_type: 'service',
    });

    await this.trackEvent({
      event_type: 'website_visit',
      event_data: {
        service_id: serviceId,
        website_url: websiteUrl,
      },
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    });
  }
}

// Analytics data retrieval functions for admin dashboard
export async function getAnalyticsSummary(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const safeCount = async (table: string) => {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());
      if (error) {
        if (error.code?.startsWith('PGRST')) {
          console.warn(`Table ${table} not found, skipping count`);
          return { count: 0, error } as const;
        }
        throw error;
      }
      return { count: data?.length || 0, error: null } as const;
    };

    const { count: totalSearches, error: searchError } = await safeCount('search_analytics');
    const { count: totalPageViews, error: pageViewError } = await safeCount('page_view_analytics');
    const { count: totalInteractions, error: interactionError } = await safeCount('user_interaction_analytics');

    // Skip detailed queries if search_analytics table may not exist
    const topSearches: any[] = [];
    const topServiceTypes: any[] = [];
    const topSearchesError = null;
    const topServiceTypesError = null;

    return {
      summary: {
        totalSearches,
        totalPageViews,
        totalInteractions,
      },
      topSearches,
      topServiceTypes,
      errors: [searchError, pageViewError, interactionError].filter(Boolean),
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return {
      summary: { totalSearches: 0, totalPageViews: 0, totalInteractions: 0 },
      topSearches: [],
      topServiceTypes: [],
      errors: [error],
    };
  }
}

export async function getAnalyticsByDateRange(startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching analytics by date range:', error);
    return [];
  }
} 