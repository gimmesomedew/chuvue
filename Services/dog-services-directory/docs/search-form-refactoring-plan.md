# Search Form Refactoring Plan

## 🔍 Overview

This document outlines the refactoring opportunities for the search form components in the Dog Services Directory application. The current implementation has multiple search forms with duplicated logic, inconsistent state management, and scattered API calls that need consolidation.

## 📊 Current Search Form Landscape

### Existing Search Components

1. **`SearchFormV2`** (`app/homepage-v2/components/SearchFormV2.tsx`)
   - **Purpose**: Simplified V2 homepage form
   - **Features**: Basic text input with search button
   - **State**: Simple useState for query
   - **Status**: New implementation

2. **`SearchForm`** (`components/search/SearchForm.tsx`)
   - **Purpose**: Original complex form with location toggles
   - **Features**: Service type selector, location modes (state/zip/geo), geolocation
   - **State**: Complex form state object with multiple fields
   - **Status**: Feature-rich but complex

3. **`SearchInput`** (`components/search/SearchInput.tsx`)
   - **Purpose**: Simple filter input for search results
   - **Features**: Debounced search with clear button
   - **State**: Single searchTerm state
   - **Status**: Utility component

4. **`AutocompleteSearch`** (`components/search/AutocompleteSearch.tsx`)
   - **Purpose**: Autocomplete with suggestions
   - **Features**: Dynamic suggestions, keyboard navigation
   - **State**: Query + suggestions management
   - **Status**: Advanced feature

5. **`NameSearch`** (`components/search/NameSearch.tsx`)
   - **Purpose**: Simple name-only search
   - **Features**: Basic search with clear function
   - **State**: Single query state
   - **Status**: Simple utility

## 🚨 Critical Issues Requiring Immediate Refactoring

### 1. **HIGHEST PRIORITY: Location Logic Duplication**

**Problem**: Location detection logic is duplicated in **3 places**:

#### Location A: `SearchResultsPage.tsx` (lines 47-90)
```typescript
// Hardcoded state mappings
if (queryLower.includes('illinois') || queryLower.includes('il')) {
  userLocation = {
    lat: 41.8781, // Chicago, IL coordinates
    lng: -87.6298,
    zip: '60601',
    city: 'Chicago',
    state: 'IL'
  };
}
// ... repeated for OH, MI, KY
```

#### Location B: `lib/search/locationProcessor.ts` (lines 254-298)
```typescript
// Same state mappings in different format
if (stateRef.toLowerCase() === 'illinois' || stateRef.toLowerCase() === 'il') {
  return {
    lat: 41.8781, // Chicago, IL coordinates
    lng: -87.6298,
    radius: 50,
    state: 'IL',
    // ...
  };
}
```

#### Location C: `SearchForm.tsx`
- Additional geolocation logic with reverse geocoding
- Different state management approach

**Impact**: 
- ❌ Maintenance nightmare - changes need to be made in 3 places
- ❌ Inconsistent behavior across forms
- ❌ Hard to add new states/locations
- ❌ Risk of bugs when logic gets out of sync

**Solution**: Create **`useLocationResolver`** hook to centralize all location logic.

---

### 2. **STATE MANAGEMENT CHAOS**

**Problem**: Each search form manages state differently:

#### SearchFormV2
```typescript
const [searchQuery, setSearchQuery] = useState(initialValue || '');
const [isVisible, setIsVisible] = useState(false);
```

#### SearchForm
```typescript
const [formState, setFormState] = useState<any>({
  selectedServiceType: initialSelectedServiceType,
  selectedState: '',
  zipCode: '',
  latitude: undefined,
  longitude: undefined,
  radiusMiles: 25,
  cityState: '',
});
```

#### SearchResultsPage
```typescript
// 15+ individual useState hooks
const [searchResults, setSearchResults] = useState<any[]>([]);
const [allSearchResults, setAllSearchResults] = useState<any[]>([]);
const [isSearching, setIsSearching] = useState(false);
const [searchMetadata, setSearchMetadata] = useState<any>(null);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalResults, setTotalResults] = useState(0);
const [selectedServiceType, setSelectedServiceType] = useState('');
const [selectedState, setSelectedState] = useState('');
const [zipCode, setZipCode] = useState('');
// ... 8 more state variables
```

**Impact**:
- ❌ Inconsistent user experience across different search interfaces
- ❌ Difficult to synchronize state between components
- ❌ Props drilling and complex state passing
- ❌ Different validation and error handling approaches

**Solution**: Create **`useSearchState`** hook with centralized state management.

---

### 3. **API CALL DUPLICATION**

**Problem**: Search API calls are scattered and inconsistent:

#### SearchResultsPage Implementation
```typescript
const response = await fetch('/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestBody),
});
```
- Complex pagination logic
- Extensive debugging logs
- Manual error handling

#### Potential Issues
- ❌ Inconsistent error handling across components
- ❌ Different loading states and UX patterns
- ❌ No centralized caching or request deduplication
- ❌ Difficult to implement global search features (history, analytics)

**Solution**: Create **`useSearchAPI`** hook for all search operations.

---

### 4. **COMPONENT PROLIFERATION**

**Problem**: Too many similar search components with overlapping functionality:

| Component | Text Input | Service Filter | Location | Autocomplete | Use Case |
|-----------|------------|----------------|----------|--------------|----------|
| SearchFormV2 | ✅ | ❌ | ❌ | ❌ | Homepage V2 |
| SearchForm | ❌ | ✅ | ✅ | ❌ | Original complex search |
| SearchInput | ✅ | ❌ | ❌ | ❌ | Results filtering |
| AutocompleteSearch | ✅ | ❌ | ❌ | ✅ | Advanced search |
| NameSearch | ✅ | ❌ | ❌ | ❌ | Simple name search |

**Impact**:
- ❌ Code maintenance overhead
- ❌ Inconsistent UI/UX patterns
- ❌ Feature fragmentation
- ❌ Developer confusion about which component to use

**Solution**: Create unified **`SearchForm`** component with configurable modes.

## 📋 Refactoring Priority Order

### 🥇 **PHASE 1: Foundation (Start Here)**

#### 1. **Extract Location Constants** ⚡ *Quick Win - 30 minutes* ✅ **COMPLETED**

**Goal**: Eliminate hardcoded location data duplication

**Implementation**:
```typescript
// lib/constants/locations.ts
export const STATE_COORDINATES = {
  IN: { 
    lat: 39.9568, 
    lng: -86.0075, 
    city: 'Fishers', 
    zip: '46037',
    name: 'Indiana',
    abbreviation: 'IN'
  },
  IL: { 
    lat: 41.8781, 
    lng: -87.6298, 
    city: 'Chicago', 
    zip: '60601',
    name: 'Illinois',
    abbreviation: 'IL'
  },
  OH: { 
    lat: 39.9612, 
    lng: -82.9988, 
    city: 'Columbus', 
    zip: '43215',
    name: 'Ohio',
    abbreviation: 'OH'
  },
  MI: { 
    lat: 42.3314, 
    lng: -83.0458, 
    city: 'Detroit', 
    zip: '48201',
    name: 'Michigan',
    abbreviation: 'MI'
  },
  KY: { 
    lat: 38.2527, 
    lng: -85.7585, 
    city: 'Louisville', 
    zip: '40202',
    name: 'Kentucky',
    abbreviation: 'KY'
  }
};

export const DEFAULT_SEARCH_RADIUS = 50;
export const GEOLOCATION_TIMEOUT = 10000;
```

**Files to Update**:
- `app/search-results/components/SearchResultsPage.tsx`
- `lib/search/locationProcessor.ts`
- Any other files with hardcoded coordinates

---

#### 2. **Create `useLocationResolver` Hook** 🔥 *High Impact - 2-3 hours* ✅ **COMPLETED**

**Goal**: Centralize all location detection and resolution logic

**Implementation**:
```typescript
// hooks/useLocationResolver.ts
export interface LocationResult {
  lat: number;
  lng: number;
  city: string;
  state: string;
  zip: string;
  radius: number;
  source: 'query' | 'geolocation' | 'default';
}

export function useLocationResolver() {
  const resolveLocationFromQuery = (query: string): LocationResult | null => {
    // Extract state keywords from query
    // Return coordinates from STATE_COORDINATES
  };

  const resolveLocationFromGeolocation = (): Promise<LocationResult> => {
    // Handle geolocation API
    // Reverse geocode to get address
  };

  const resolveLocationFromZip = (zipCode: string): Promise<LocationResult> => {
    // Geocode zip code to coordinates
  };

  return {
    resolveLocationFromQuery,
    resolveLocationFromGeolocation,
    resolveLocationFromZip
  };
}
```

**Benefits**:
- ✅ Single source of truth for location logic
- ✅ Consistent behavior across all forms
- ✅ Easy to add new states/locations
- ✅ Centralized error handling

---

### 🥈 **PHASE 2: State Management**

#### 3. **Create `useSearchState` Hook** 📊 *Medium Impact - 1-2 hours*

**Goal**: Centralized search form state management

**Implementation**:
```typescript
// hooks/useSearchState.ts
export interface SearchState {
  // Query
  query: string;
  
  // Service filtering
  selectedServiceType: string;
  
  // Location
  location: LocationResult | null;
  locationType: 'state' | 'zip' | 'geo' | 'query';
  
  // Results
  results: Service[];
  allResults: Service[];
  isSearching: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalResults: number;
  itemsPerPage: number;
  
  // Metadata
  searchMetadata: any;
  searchHistory: string[];
}

export function useSearchState(initialState?: Partial<SearchState>) {
  // Centralized state management with actions
  const updateQuery = (query: string) => { /* ... */ };
  const updateLocation = (location: LocationResult) => { /* ... */ };
  const setResults = (results: Service[]) => { /* ... */ };
  // ... other actions
  
  return {
    state,
    actions: {
      updateQuery,
      updateLocation,
      setResults,
      // ...
    }
  };
}
```

---

#### 4. **Create `useSearchAPI` Hook** 🌐 *Medium Impact - 1-2 hours*

**Goal**: Centralized API calls with caching and error handling

**Implementation**:
```typescript
// hooks/useSearchAPI.ts
export function useSearchAPI() {
  const [cache, setCache] = useState<Map<string, any>>(new Map());
  
  const search = async (params: SearchParams): Promise<SearchResponse> => {
    const cacheKey = JSON.stringify(params);
    
    // Check cache first
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    // Make API call
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    setCache(prev => new Map(prev).set(cacheKey, data));
    
    return data;
  };
  
  const getSuggestions = async (query: string): Promise<string[]> => {
    // Implement search suggestions
  };
  
  return {
    search,
    getSuggestions,
    clearCache: () => setCache(new Map())
  };
}
```

---

### 🥉 **PHASE 3: Component Unification**

#### 5. **Create Unified `SearchForm` Component** 🎯 *High Impact - 3-4 hours*

**Goal**: Single component that handles all search scenarios

**Implementation**:
```typescript
// components/search/UnifiedSearchForm.tsx
interface UnifiedSearchFormProps {
  mode: 'simple' | 'advanced' | 'filter' | 'autocomplete';
  onSearch: (params: SearchParams) => void;
  initialValues?: Partial<SearchState>;
  showServiceFilter?: boolean;
  showLocationFilter?: boolean;
  showAdvancedOptions?: boolean;
  placeholder?: string;
  className?: string;
}

export function UnifiedSearchForm({
  mode = 'simple',
  onSearch,
  initialValues,
  showServiceFilter = false,
  showLocationFilter = false,
  showAdvancedOptions = false,
  placeholder = 'Search...',
  className = ''
}: UnifiedSearchFormProps) {
  const { state, actions } = useSearchState(initialValues);
  const locationResolver = useLocationResolver();
  
  // Render different UI based on mode
  const renderSimpleMode = () => (
    <div className="flex gap-4">
      <input 
        type="text"
        value={state.query}
        onChange={(e) => actions.updateQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 border rounded-lg"
      />
      <button 
        onClick={handleSubmit}
        className="px-6 py-3 bg-pink-500 text-white rounded-lg"
      >
        Search
      </button>
    </div>
  );
  
  const renderAdvancedMode = () => (
    <div className="space-y-4">
      {renderSimpleMode()}
      {showServiceFilter && <ServiceTypeSelector />}
      {showLocationFilter && <LocationSelector />}
      {showAdvancedOptions && <AdvancedOptions />}
    </div>
  );
  
  const renderFilterMode = () => (
    <div className="relative">
      <input 
        type="text"
        value={state.query}
        onChange={(e) => actions.updateQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-md"
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    </div>
  );
  
  const renderAutocompleteMode = () => (
    <AutocompleteSearchInternal
      query={state.query}
      onQueryChange={actions.updateQuery}
      onSearch={handleSubmit}
      suggestions={suggestions}
    />
  );
  
  // Component mode routing
  const renderContent = () => {
    switch (mode) {
      case 'simple': return renderSimpleMode();
      case 'advanced': return renderAdvancedMode();
      case 'filter': return renderFilterMode();
      case 'autocomplete': return renderAutocompleteMode();
      default: return renderSimpleMode();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      {renderContent()}
    </form>
  );
}
```

**Usage Examples**:
```typescript
// Replace SearchFormV2
<UnifiedSearchForm 
  mode="simple" 
  onSearch={handleSearch}
  placeholder="Search products, services, dog parks..."
/>

// Replace SearchForm
<UnifiedSearchForm 
  mode="advanced"
  showServiceFilter={true}
  showLocationFilter={true}
  onSearch={handleSearch}
/>

// Replace SearchInput
<UnifiedSearchForm 
  mode="filter"
  onSearch={handleFilter}
  placeholder="Filter results..."
/>

// Replace AutocompleteSearch
<UnifiedSearchForm 
  mode="autocomplete"
  onSearch={handleSearch}
/>
```

---

#### 6. **Remove Duplicate Components** 🧹 *Low Risk - 1-2 hours*

**Goal**: Clean up codebase by removing redundant components

**Components to Remove**:
- `SearchFormV2.tsx` → Replace with `UnifiedSearchForm mode="simple"`
- Individual search components → Replace with appropriate modes
- Update all import statements
- Remove unused files

**Components to Keep**:
- `UnifiedSearchForm.tsx` (new)
- `SearchResultsDisplay.tsx` (results display)
- `ServiceCard.tsx` (individual result cards)

---

## ⚡ Immediate Quick Wins (< 30 minutes each)

### A. **Fix React Warning**
**Issue**: FilterTagBar component has missing keys
**Fix**: Add unique `key` props to mapped elements

### B. **Remove Debug Console Logs**
**Issue**: Excessive console.log statements in production code
**Files**: 
- `SearchResultsPage.tsx`
- `lib/search/` files
**Fix**: Remove or wrap in `if (process.env.NODE_ENV === 'development')`

### C. **Extract Magic Numbers**
**Issue**: Hardcoded values scattered throughout
**Examples**:
- Pagination: `25` items per page
- Radius: `50` mile default
- Timeout: `300ms` debounce
**Fix**: Move to constants file

---

## 🧪 Testing Strategy

### Unit Tests
- `useLocationResolver` hook tests
- `useSearchState` hook tests  
- `useSearchAPI` hook tests
- `UnifiedSearchForm` component tests

### Integration Tests
- Search flow end-to-end
- Location detection scenarios
- API error handling
- State synchronization

### Manual Testing Checklist
- [ ] Simple search works from homepage
- [ ] Advanced search with filters
- [ ] Location detection (geo, zip, state)
- [ ] Pagination and results display
- [ ] Error states and loading indicators
- [ ] Mobile responsiveness

---

## 📈 Success Metrics

### Code Quality
- **Lines of Code**: Reduce by ~30% through deduplication
- **Cyclomatic Complexity**: Reduce component complexity
- **Test Coverage**: Increase to >80% for search functionality

### Developer Experience
- **Build Time**: No significant impact expected
- **Bundle Size**: Slight reduction from code elimination
- **Maintainability**: Significantly improved

### User Experience
- **Performance**: Potential improvement from optimized API calls
- **Consistency**: Unified behavior across all search interfaces
- **Reliability**: Better error handling and edge case coverage

---

## 🎯 Implementation Timeline

### Week 1: Foundation
- [ ] Extract location constants
- [ ] Create `useLocationResolver` hook
- [ ] Update existing components to use new hook

### Week 2: State & API
- [ ] Create `useSearchState` hook
- [ ] Create `useSearchAPI` hook  
- [ ] Refactor SearchResultsPage to use new hooks

### Week 3: Unification
- [ ] Create `UnifiedSearchForm` component
- [ ] Replace SearchFormV2 usage
- [ ] Replace other search component usage

### Week 4: Cleanup & Testing
- [ ] Remove duplicate components
- [ ] Add comprehensive tests
- [ ] Documentation updates
- [ ] Performance optimization

---

## 🚀 Getting Started

### Recommended Starting Point

**Start with extracting location constants** because:
1. ✅ Immediate impact on maintainability
2. ✅ Quick to implement (< 30 minutes)
3. ✅ Required foundation for all subsequent refactoring
4. ✅ Reduces technical debt immediately
5. ✅ Low risk of breaking existing functionality

### Next Steps

1. **Create the constants file** with all state coordinates
2. **Update locationProcessor.ts** to use constants
3. **Update SearchResultsPage.tsx** to use constants
4. **Test that search still works correctly**
5. **Move to Phase 1, Step 2** (useLocationResolver hook)

---

## 📚 Additional Resources

### Related Documentation
- [Search Functionality Analysis](./search-functionality-analysis.md)
- [Search Form Enhancements](./search-form-enhancements.md)

### External References
- [React Hooks Best Practices](https://reactjs.org/docs/hooks-rules.html)
- [Custom Hook Patterns](https://usehooks.com/)
- [Component Composition Patterns](https://kentcdodds.com/blog/compound-components-with-react-hooks)

---

*Last Updated: January 2025*
*Status: Ready for Implementation*
