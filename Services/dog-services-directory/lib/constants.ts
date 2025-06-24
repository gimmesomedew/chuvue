// Search and pagination constants
export const SEARCH_CONSTANTS = {
  RESULTS_PER_PAGE: 30,
  SCROLL_DELAY: 100,
  SEARCH_DEBOUNCE_DELAY: 300,
} as const;

// Animation constants
export const ANIMATION_CONSTANTS = {
  PAGE_TRANSITION_DURATION: 0.6,
  CARD_HOVER_DELAY: 0.1,
  STAGGER_DELAY: 0.1,
} as const;

// UI constants
export const UI_CONSTANTS = {
  MAX_SEARCH_RESULTS: 1000,
  MIN_SEARCH_TERM_LENGTH: 2,
  ZIP_CODE_LENGTH: 5,
} as const;

// API constants
export const API_CONSTANTS = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const; 