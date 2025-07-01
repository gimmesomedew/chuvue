import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { servicesApi, SearchResponse } from '@/lib/api/services';
import { SEARCH_CONSTANTS } from '@/lib/constants';
import { Analytics } from '@/lib/analytics';

export interface SearchState {
  selectedServiceType: string;
  selectedState: string;
  zipCode: string;
  page: number;
}

export function useServicesQuery(searchState: SearchState) {
  const queryClient = useQueryClient();

  // Define query key
  const queryKey = ['services', searchState] as const;

  // Define the query
  const query = useQuery<SearchResponse, Error>({
    queryKey,
    queryFn: () => servicesApi.search({
      serviceType: searchState.selectedServiceType,
      state: searchState.selectedState,
      zipCode: searchState.zipCode,
      page: searchState.page,
      perPage: SEARCH_CONSTANTS.RESULTS_PER_PAGE,
    }),
    // Only fetch when search params are provided
    enabled: Boolean(searchState.selectedServiceType || searchState.selectedState || searchState.zipCode),
  });

  // Track analytics on successful searches
  if (query.data) {
    Analytics.trackSearchEvent(
      `${searchState.selectedServiceType || 'all'} ${searchState.selectedState || searchState.zipCode || 'all locations'}`,
      searchState.selectedServiceType,
      searchState.selectedState,
      searchState.zipCode,
      query.data.total,
      searchState.page
    );
  }

  // Prefetch next page
  const prefetchNextPage = () => {
    if (query.data && searchState.page < query.data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['services', { ...searchState, page: searchState.page + 1 }] as const,
        queryFn: () => servicesApi.search({
          serviceType: searchState.selectedServiceType,
          state: searchState.selectedState,
          zipCode: searchState.zipCode,
          page: searchState.page + 1,
          perPage: SEARCH_CONSTANTS.RESULTS_PER_PAGE,
        }),
      });
    }
  };

  return {
    ...query,
    prefetchNextPage,
  };
} 