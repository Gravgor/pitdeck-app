export function PitDeckLogo({ className = "w-40 h-10", variant = "default" }: { 
    className?: string;
    variant?: "default" | "simple" | "monochrome";
  }) {
    return (
      <svg 
        className={className} 
        viewBox="0 0 800 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background racing circuit element */}
        <path
          d="M50 100 C 150 100, 200 60, 400 60 S 650 100, 750 100"
          stroke="url(#raceLineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-dash"
          fill="none"
        />
  
        {/* Main Logo Container */}
        <g className="transform -translate-y-2">
          {/* PIT Text with Glow */}
          <g transform="skewX(-12)">
            <text
              x="180"
              y="125"
              className="font-orbitron font-black tracking-wider"
              fill="white"
              fontSize="100"
              filter="url(#glow)"
            >
              PIT
            </text>
          </g>
  
          {/* Card Stack */}
          <g transform="translate(380, 45)">
            <rect
              x="2"
              y="2"
              width="45"
              height="65"
              rx="4"
              fill="url(#cardGradient2)"
              className="transform rotate-3"
            />
            <rect
              x="0"
              y="0"
              width="45"
              height="65"
              rx="4"
              fill="url(#cardGradient1)"
              className="transform -rotate-3"
            />
          </g>
  
          {/* DECK Text with Glow */}
          <g transform="skewX(-12)">
            <text
              x="450"
              y="125"
              className="font-orbitron font-black tracking-wider"
              fill="white"
              fontSize="100"
              filter="url(#glow)"
            >
              DECK
            </text>
          </g>
        </g>
  
        {/* Speed Lines */}
        {variant !== "simple" && (
          <g className="animate-speedLines opacity-20">
            <line x1="200" y1="40" x2="180" y2="160" stroke="url(#speedLineGradient)" strokeWidth="1" />
            <line x1="600" y1="40" x2="620" y2="160" stroke="url(#speedLineGradient)" strokeWidth="1" />
          </g>
        )}
  
        {/* Definitions */}
        <defs>
          {/* Main Gradient */}
          <linearGradient id="raceLineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
  
          {/* Card Gradients */}
          <linearGradient id="cardGradient1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
  
          <linearGradient id="cardGradient2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
  
          <linearGradient id="speedLineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
  
          {/* Text Glow Effect */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
  
        {/* Animations */}
        <style>{`
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
          .animate-dash {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: dash 2s ease-out forwards;
          }
          @keyframes speedLines {
            0% { opacity: 0; transform: translateX(5px); }
            50% { opacity: 0.2; }
            100% { opacity: 0; transform: translateX(-5px); }
          }
          .animate-speedLines {
            animation: speedLines 3s linear infinite;
          }
        `}</style>
      </svg>
    );
  }