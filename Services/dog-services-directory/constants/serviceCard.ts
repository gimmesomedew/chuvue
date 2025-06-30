export const ANIMATION_DURATION = 200;
export const DESCRIPTION_MAX_LENGTH = 120;
export const IMAGE_PLACEHOLDER_COLOR = '#E91A7E';
export const CARD_DIMENSIONS = {
  maxWidth: '400px',
  imageHeight: '225px', // 16:9 ratio for maxWidth
};

export const HOVER_STYLES = {
  scale: 1.02,
  tap: 0.98,
  shadow: {
    default: '0 8px 30px rgba(0,0,0,0.12)',
    hover: '0 20px 40px rgba(0,0,0,0.18)',
  },
};

export const ICON_SIZES = {
  SMALL: {
    height: 3,
    width: 3,
  },
  MEDIUM: {
    height: 4,
    width: 4,
  },
  LARGE: {
    height: 5,
    width: 5,
  },
  XLARGE: {
    height: 24,
    width: 24,
  }
} as const;

export const COLORS = {
  primary: 'emerald',
  secondary: 'gray',
  accent: {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
    },
  },
}; 