import React from 'react';
import { SceneData } from '../data/screenplay';

interface SceneSchematicProps {
  scene: SceneData;
}

export const SceneSchematic: React.FC<SceneSchematicProps> = ({ scene }) => {
  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <svg
          viewBox="0 0 360 200"
          className="block h-auto w-full"
          role="img"
          aria-label={`காட்சி ${scene.number}: ${scene.title} காட்சி வரைபடம்`}
        >
          {/* Subtle architectural rooftop grid backdrop */}
          <defs>
            <pattern
              id={`grid-${scene.id}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="var(--line)"
                strokeWidth="0.6"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="360" height="200" fill={`url(#grid-${scene.id})`} />

          {/* Horizon / Concrete rooftop line */}
          <line
            x1="16"
            y1="162"
            x2="344"
            y2="162"
            stroke="var(--line)"
            strokeWidth="1.5"
          />

          {scene.number === 1 && (
            <g>
              {/* Scorched crater depression */}
              <path
                d="M 110 162 Q 180 182 250 162"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.5"
              />
              {/* Angular dormant Core sphere half-buried */}
              <polygon
                points="180,122 204,136 198,162 162,162 156,136"
                fill="var(--surface-subtle)"
                stroke="var(--ink)"
                strokeWidth="1.5"
              />
              {/* Teal-cyan dormant seam glow */}
              <path
                d="M 164 142 L 180 150 L 196 142 M 180 124 L 180 160"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="2"
              />
              {/* Insulated tongs approaching */}
              <path
                d="M 88 112 L 138 134 M 92 124 L 138 138"
                stroke="var(--muted)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Static electric arc */}
              <polyline
                points="141,136 148,132 151,140 157,137"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="1.75"
              />
              {/* Holographic grid rising from tablet */}
              <rect
                x="54"
                y="148"
                width="32"
                height="10"
                rx="1.5"
                fill="var(--surface-subtle)"
                stroke="var(--ink)"
                strokeWidth="1.2"
              />
              <path
                d="M 60 148 L 54 126 L 86 126 L 80 148"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </g>
          )}

          {scene.number === 2 && (
            <g>
              {/* Floating gravel */}
              <circle cx="136" cy="148" r="2" fill="var(--muted)" />
              <circle cx="222" cy="145" r="2.5" fill="var(--muted)" />
              <circle cx="152" cy="154" r="1.8" fill="var(--muted)" />
              <circle cx="208" cy="153" r="1.5" fill="var(--muted)" />

              {/* Hovering unfolded Drone */}
              <polygon
                points="180,62 206,80 198,108 162,108 154,80"
                fill="var(--surface-subtle)"
                stroke="var(--amber)"
                strokeWidth="1.75"
              />
              {/* Spread outer armor plates */}
              <polygon
                points="146,72 128,84 136,104 152,96"
                fill="var(--surface-subtle)"
                stroke="var(--ink)"
                strokeWidth="1.3"
              />
              <polygon
                points="214,72 232,84 224,104 208,96"
                fill="var(--surface-subtle)"
                stroke="var(--ink)"
                strokeWidth="1.3"
              />
              {/* Single red optical eye */}
              <circle
                cx="180"
                cy="86"
                r="8"
                fill="none"
                stroke="var(--crimson)"
                strokeWidth="1.75"
              />
              <circle cx="180" cy="86" r="3.5" fill="var(--crimson)" />
              {/* Three thruster plumes */}
              <path
                d="M 164 110 L 160 132 M 180 110 L 180 138 M 196 110 L 200 132"
                stroke="var(--amber)"
                strokeWidth="1.75"
                strokeDasharray="4 3"
              />
              {/* Dust swirl at base */}
              <ellipse
                cx="180"
                cy="160"
                rx="46"
                ry="5"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1"
                strokeDasharray="6 4"
              />
            </g>
          )}

          {scene.number === 3 && (
            <g>
              {/* Rusted concrete pillar on right */}
              <rect
                x="236"
                y="46"
                width="38"
                height="116"
                fill="var(--surface-subtle)"
                stroke="var(--ink)"
                strokeWidth="1.5"
              />
              {/* Chipped impact edge */}
              <polygon
                points="236,78 248,86 236,98"
                fill="var(--amber)"
                opacity="0.45"
              />
              {/* Drone with dual railguns */}
              <polygon
                points="100,66 122,82 116,108 84,108 78,82"
                fill="var(--surface-subtle)"
                stroke="var(--ink)"
                strokeWidth="1.5"
              />
              <circle cx="100" cy="87" r="4.5" fill="var(--crimson)" />
              {/* Dual railgun barrels */}
              <line
                x1="122"
                y1="82"
                x2="146"
                y2="82"
                stroke="var(--cyan)"
                strokeWidth="3"
              />
              <line
                x1="122"
                y1="94"
                x2="146"
                y2="94"
                stroke="var(--cyan)"
                strokeWidth="3"
              />
              {/* Vertical scan beam & plasma bolt */}
              <line
                x1="148"
                y1="88"
                x2="234"
                y2="88"
                stroke="var(--cyan)"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
              <path
                d="M 108 87 L 234 58 L 234 128 Z"
                fill="var(--crimson)"
                opacity="0.12"
              />
            </g>
          )}

          {scene.number === 4 && (
            <g>
              {/* Concrete pillar */}
              <rect
                x="62"
                y="54"
                width="34"
                height="108"
                fill="var(--surface-subtle)"
                stroke="var(--ink)"
                strokeWidth="1.5"
              />
              {/* Decoy pipe arc to the right */}
              <path
                d="M 96 108 Q 204 28 308 122"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.25"
                strokeDasharray="4 4"
              />
              <rect
                x="306"
                y="120"
                width="22"
                height="32"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.25"
              />
              {/* Hovering Drone above */}
              <polygon
                points="210,72 232,88 226,112 194,112 188,88"
                fill="var(--surface-subtle)"
                stroke="var(--ink)"
                strokeWidth="1.5"
              />
              <circle cx="210" cy="92" r="4.5" fill="var(--crimson)" />
              {/* Sliding overloaded tablet under drone */}
              <rect
                x="194"
                y="151"
                width="32"
                height="8"
                rx="1.5"
                fill="var(--surface-subtle)"
                stroke="var(--crimson)"
                strokeWidth="1.75"
              />
              {/* Sliding trajectory line */}
              <line
                x1="106"
                y1="156"
                x2="188"
                y2="156"
                stroke="var(--amber)"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
            </g>
          )}

          {scene.number === 5 && (
            <g>
              {/* Distant skyline */}
              <path
                d="M 24 162 L 24 122 L 48 122 L 48 134 L 74 134 L 74 114 L 100 114 L 100 162"
                fill="none"
                stroke="var(--line)"
                strokeWidth="1.25"
              />
              <path
                d="M 260 162 L 260 118 L 288 118 L 288 130 L 316 130 L 316 108 L 338 108 L 338 162"
                fill="none"
                stroke="var(--line)"
                strokeWidth="1.25"
              />
              {/* Distant descending amber lights in the clouds */}
              <circle cx="52" cy="48" r="2.2" fill="var(--amber)" />
              <circle cx="76" cy="42" r="2.2" fill="var(--amber)" />
              <circle cx="102" cy="52" r="2.2" fill="var(--amber)" />
              <circle cx="130" cy="38" r="2.2" fill="var(--amber)" />
              <circle cx="236" cy="44" r="2.2" fill="var(--amber)" />
              <circle cx="268" cy="54" r="2.2" fill="var(--amber)" />
              <circle cx="294" cy="40" r="2.2" fill="var(--amber)" />
              <circle cx="318" cy="50" r="2.2" fill="var(--amber)" />

              {/* EMP electrostatic shockwave rings */}
              <circle
                cx="180"
                cy="144"
                r="52"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="1.25"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              <circle
                cx="180"
                cy="144"
                r="76"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="1"
                opacity="0.4"
              />
              {/* Powered-down drone lying on concrete */}
              <polygon
                points="180,138 204,148 198,161 162,161 156,148"
                fill="var(--surface-subtle)"
                stroke="var(--muted)"
                strokeWidth="1.5"
              />
              <circle cx="180" cy="150" r="3" fill="var(--muted)" />
            </g>
          )}
        </svg>
      </div>
      <figcaption className="mt-2.5 flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
        <span>
          படம் {scene.number} · {scene.title}
        </span>
        <span className="font-mono tabular-nums">{scene.timeRange}</span>
      </figcaption>
    </figure>
  );
};
