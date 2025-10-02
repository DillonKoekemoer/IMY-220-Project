
module.exports = {
  content: [
    "./frontend/src/**/*.{js,jsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'forge-orange': '#FF6B35',
        'forge-red': '#E63946',
        'forge-yellow': '#FFD60A',
        'steel-blue': '#457B9D',
        'steel-dark': '#1D3557',
        'steel-light': '#A8DADC',
        'iron-dark': '#0F1419',
        'iron-gray': '#1C2128',
        'iron-light': '#2D333B',
        'coal-black': '#0D1117',
        'ash-gray': '#6E7681',
        'silver': '#F0F6FC',
        'charcoal': '#333333',
        'warm-red': '#E63946',
        'primary-cream': '#FCD0A1',
        'primary-brown': '#6B4F2A',
        'dark-brown': '#4A361F',
        'light-brown': '#8D6A3F',
        'light-gray': '#A8DADC',
      },
      fontFamily: {
        'display': ['Poppins'],
        'heading': ['Cinzel', 'serif'],
        'mono': ['JetBrains Mono'],
        'sans': ['Inter'],
      },
      boxShadow: {
        'forge': '0 4px 16px rgba(0,0,0,0.3)',
        'forge-hover': '0 8px 32px rgba(255,107,53,0.2)',
        'forge-glow': '0 0 20px rgba(255,214,10,0.4)',
        'forge-inset': 'inset 0 2px 4px rgba(0,0,0,0.2)',
      },
      backgroundImage: {
        'gradient-fire': 'linear-gradient(135deg, #FF6B35 0%, #E63946 50%, #FFD60A 100%)',
        'gradient-steel': 'linear-gradient(135deg, #1D3557 0%, #2D333B 100%)',
        'gradient-metal': 'linear-gradient(135deg, #1C2128 0%, #2D333B 100%)',
        'forge-sparks': 'radial-gradient(circle at 20% 80%, rgba(255,107,53,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(69,123,157,0.06) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(255,214,10,0.04) 0%, transparent 70%)',
      },
      animation: {
        'slide-down': 'slideDown 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'modal-slide-in': 'modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        slideDown: {
          'from': { transform: 'translateY(-100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        modalSlideIn: {
          'from': { opacity: '0', transform: 'translateY(-50px) scale(0.9)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255,215,0,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255,215,0,0.6), 0 0 30px rgba(255,107,53,0.3)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}