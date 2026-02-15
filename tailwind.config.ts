import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#1A1F28',
        surface: '#11161D',
        card: '#171C23',
        hover: '#1F2630',

        text: {
          primary: '#E6EDF3',
          secondary: '#9AA4B2',
          muted: '#6B7280',
          disabled: '#4B5563',
        },

        accent: {
          DEFAULT: '#7C5CFF',
          hover: '#6A4BFF',
          glow: '#A594FF'
        },

        rating: {
          good: '#22C55E',
          mid: '#EAB308',
          bad: '#EF4444'
        },

        imdb: '#F5C518'
      }
    }
  }
}
