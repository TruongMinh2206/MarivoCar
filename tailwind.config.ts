import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Horizon Elite - Deep Navy */
        navy: {
          DEFAULT: '#000D22',
          50: '#e6e8ec',
          100: '#b3b9c6',
          200: '#808a9f',
          300: '#4d5b79',
          400: '#263552',
          500: '#000D22',
          600: '#000b1e',
          700: '#000919',
          800: '#000614',
          900: '#00030a',
        },
        /* Horizon Elite - Warm Gold CTA */
        gold: {
          DEFAULT: '#FFB700',
          50: '#fff9e6',
          100: '#ffefb3',
          200: '#ffe580',
          300: '#ffdb4d',
          400: '#ffd11a',
          500: '#FFB700',
          600: '#e6a300',
          700: '#cc9300',
          800: '#b38200',
          900: '#996d00',
        },
        /* Horizon Elite - Travel Blue */
        travel: {
          DEFAULT: '#006CE4',
          50: '#e6f0fd',
          100: '#b3d3f8',
          200: '#80b6f3',
          300: '#4d99ee',
          400: '#1a7ce9',
          500: '#006CE4',
          600: '#0060cc',
          700: '#0054b3',
          800: '#00489a',
          900: '#003c80',
        },
        'travel-blue': '#006CE4',
        /* Horizon Elite - Semantic */
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        'error-container': '#ffdad6',
        /* Horizon Elite - Surfaces */
        surface: {
          DEFAULT: '#f6f9ff',
          dim: '#d4dbe3',
          bright: '#f6f9ff',
          tint: '#455f88',
          container: '#e8eef7',
          'container-low': '#eef4fd',
          'container-lowest': '#ffffff',
          'container-high': '#e2e9f1',
          'container-highest': '#dce3ec',
        },
        'surface-alt': '#F8F9FA',
        'surface-variant': '#dce3ec',
        /* Horizon Elite - Background & Surface */
        background: '#f6f9ff',
        /* Horizon Elite - Text */
        ink: {
          dark: '#151c22',
          variant: '#43474e',
          outline: '#74777f',
          subtle: '#ADB5BD',
        },
        'ink-dark': '#212529',
        /* Material Design 3 - Primary */
        primary: {
          DEFAULT: '#000d22',
          container: '#002349',
          fixed: '#d5e3ff',
          'fixed-dim': '#adc8f6',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#718bb7',
        'on-primary-fixed': '#001b3c',
        'on-primary-fixed-variant': '#2c476f',
        /* Material Design 3 - Secondary */
        secondary: {
          DEFAULT: '#7d5800',
          container: '#ffb700',
          fixed: '#ffdea9',
          'fixed-dim': '#ffba26',
        },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#6b4b00',
        'on-secondary-fixed': '#271900',
        'on-secondary-fixed-variant': '#5e4100',
        /* Material Design 3 - Tertiary */
        tertiary: {
          DEFAULT: '#000c26',
          container: '#00214f',
          fixed: '#d8e2ff',
          'fixed-dim': '#adc6ff',
        },
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#3b87ff',
        'on-tertiary-fixed': '#001a41',
        'on-tertiary-fixed-variant': '#004494',
        /* Material Design 3 - On Colors */
        'on-surface': '#151c22',
        'on-surface-variant': '#43474e',
        'on-background': '#151c22',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        /* Material Design 3 - Inverse */
        'inverse-surface': '#2a3138',
        'inverse-on-surface': '#ebf1fa',
        'inverse-primary': '#adc8f6',
        /* Material Design 3 - Outline */
        outline: {
          DEFAULT: '#74777f',
          variant: '#c4c6cf',
        },
        /* Material Design 3 - Border */
        'border-subtle': '#ADB5BD',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        'label-md': ['Inter'],
        'headline-md': ['Montserrat'],
        'body-md': ['Inter'],
        'display-lg-mobile': ['Montserrat'],
        'display-lg': ['Montserrat'],
        'headline-sm': ['Montserrat'],
        'headline-lg': ['Montserrat'],
        'body-lg': ['Inter'],
        'body-xl': ['Inter'],
        'label-sm': ['Inter'],
      },
      fontSize: {
        'label-md': ['14px', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '600' }],
        'headline-md': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'display-lg-mobile': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-sm': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'headline-lg': ['30px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-xl': ['20px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '1.2', fontWeight: '500' }],
      },
      spacing: {
        'margin-mobile': '20px',
        'gutter': '24px',
        'margin-desktop': '64px',
        'base': '8px',
        'container-max': '1280px',
      },
      borderRadius: {
        'btn': '0.5rem',      /* 8px - buttons */
        'card': '1rem',       /* 16px - cards */
        'input': '0.5rem',    /* 8px - form fields */
        'modal': '1rem',      /* 16px - modals */
        'tag': '0.75rem',     /* 12px - tags */
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0px 4px 20px rgba(0, 35, 73, 0.08)',
        'card-hover': '0px 8px 24px rgba(0, 13, 34, 0.12)',
        'dropdown': '0px 8px 24px rgba(0, 13, 34, 0.12)',
        'modal': '0px 16px 48px rgba(0, 13, 34, 0.16)',
        'sticky': '0px 2px 12px rgba(0, 13, 34, 0.06)',
        'ambient': '0px 4px 20px rgba(0, 35, 73, 0.08)',
        'hover': '0px 8px 32px rgba(0, 35, 73, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config
