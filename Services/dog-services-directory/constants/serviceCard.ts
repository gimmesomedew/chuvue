export const ANIMATION_DURATION = 200;
export const DESCRIPTION_MAX_LENGTH = 120;
export const IMAGE_PLACEHOLDER_COLOR = '#e91a7e';
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
  primary: 'primary',
  secondary: 'secondary',
  third: 'third',
  alternate1: 'alternate1',
  alternate2: 'alternate2',
  alternate3: 'alternate3',
  accent: {
    primary: {
      bg: 'bg-primary',
      text: 'text-primary',
      border: 'border-primary',
    },
    secondary: {
      bg: 'bg-secondary',
      text: 'text-secondary',
      border: 'border-secondary',
    },
    third: {
      bg: 'bg-third',
      text: 'text-third',
      border: 'border-third',
    },
    alternate1: {
      bg: 'bg-alternate1',
      text: 'text-alternate1',
      border: 'border-alternate1',
    },
    alternate2: {
      bg: 'bg-alternate2',
      text: 'text-alternate2',
      border: 'border-alternate2',
    },
    alternate3: {
      bg: 'bg-alternate3',
      text: 'text-alternate3',
      border: 'border-alternate3',
    },
  },
}; 