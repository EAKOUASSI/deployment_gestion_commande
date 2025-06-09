/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF2F0',
          100: '#FCE6E1',
          200: '#F9CDC3',
          300: '#F5B4A5',
          400: '#F29B87',
          500: '#E07A5F',
          600: '#D96A4C',
          700: '#B85239',
          800: '#973A26',
          900: '#762213',
        },
        secondary: {
          50: '#FEFCF7',
          100: '#FDF9EF',
          200: '#FBF3DF',
          300: '#F9EDCF',
          400: '#F7E7BF',
          500: '#F2CC8F',
          600: '#EDB75F',
          700: '#E8A22F',
          800: '#B8821F',
          900: '#88620F',
        },
        accent: {
          50: '#F0F5F3',
          100: '#E1EBE7',
          200: '#C3D7CF',
          300: '#A5C3B7',
          400: '#87AF9F',
          500: '#81B29A',
          600: '#6FA088',
          700: '#5D8D76',
          800: '#4B7B64',
          900: '#396952',
        },
        neutral: {
          50: '#F7F7F8',
          100: '#EEEFF1',
          200: '#DDDFE3',
          300: '#CCCFD5',
          400: '#BBBFC7',
          500: '#3D405B',
          600: '#363952',
          700: '#2F3249',
          800: '#282B40',
          900: '#212437',
        }
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};