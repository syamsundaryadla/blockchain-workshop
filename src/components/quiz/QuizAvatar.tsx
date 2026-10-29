const ANIMALS = [
  "Fox",
  "Panda",
  "Cat",
  "Frog",
  "Owl",
  "Bear",
  "Bunny",
  "Tiger",
  "Penguin",
  "Koala",
  "Dog",
  "Lion",
];
const BACKGROUNDS = [
  "#d9eeef",
  "#e9e0f7",
  "#fae6cf",
  "#dce9fa",
  "#f8dfe4",
  "#e3efd9",
];
const FUR = [
  "#ef9c55",
  "#f7f7f2",
  "#d6a0a5",
  "#83bf88",
  "#b3a0cd",
  "#b89174",
  "#f5e8df",
  "#f2ad51",
  "#52677d",
  "#b0bac4",
  "#cda47d",
  "#eab45c",
];

export function QuizAvatar({
  seed,
  size = 36,
}: {
  seed: string;
  size?: number;
}) {
  let hash = 2166136261;
  for (const character of seed)
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
  const kind = hash % ANIMALS.length,
    fur = FUR[kind],
    ink = "#243746";
  const triangular = [0, 2, 4, 7].includes(kind),
    round = [1, 5, 9, 11].includes(kind);
  return (
    <svg
      className="quiz-avatar"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={`${ANIMALS[kind]} avatar`}
    >
      <circle
        cx="32"
        cy="32"
        r="32"
        fill={BACKGROUNDS[Math.floor(hash / 12) % BACKGROUNDS.length]}
      />
      {kind === 11 && <circle cx="32" cy="34" r="27" fill="#be7845" />}
      {triangular && (
        <>
          <path
            d="M13 27 14 9 29 21M35 21 50 9 51 27"
            fill={fur}
            stroke={ink}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="m17 21 0-7 7 7m16 0 7-7v7" fill="#e5b2a2" />
        </>
      )}
      {round && (
        <>
          <circle
            cx="15"
            cy="18"
            r={kind === 9 ? 11 : 9}
            fill={kind === 1 ? ink : fur}
          />
          <circle
            cx="49"
            cy="18"
            r={kind === 9 ? 11 : 9}
            fill={kind === 1 ? ink : fur}
          />
          <circle cx="15" cy="18" r="5" fill="#d8b3a6" />
          <circle cx="49" cy="18" r="5" fill="#d8b3a6" />
        </>
      )}
      {kind === 6 && (
        <>
          <ellipse cx="23" cy="16" rx="6" ry="15" fill={fur} />
          <ellipse cx="41" cy="16" rx="6" ry="15" fill={fur} />
          <path
            d="M23 5v17m18-17v17"
            stroke="#d59caa"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}
      {kind === 10 && (
        <>
          <ellipse
            cx="14"
            cy="31"
            rx="8"
            ry="17"
            fill="#8b6753"
            transform="rotate(14 14 31)"
          />
          <ellipse
            cx="50"
            cy="31"
            rx="8"
            ry="17"
            fill="#8b6753"
            transform="rotate(-14 50 31)"
          />
        </>
      )}
      <ellipse
        cx="32"
        cy="35"
        rx={kind === 3 ? 24 : 21}
        ry={kind === 8 ? 25 : 21}
        fill={fur}
      />
      {kind === 3 && (
        <>
          <circle cx="19" cy="19" r="10" fill={fur} />
          <circle cx="45" cy="19" r="10" fill={fur} />
          <circle cx="19" cy="19" r="6" fill="#fff" />
          <circle cx="45" cy="19" r="6" fill="#fff" />
          <circle cx="20" cy="19" r="2.5" fill={ink} />
          <circle cx="44" cy="19" r="2.5" fill={ink} />
        </>
      )}
      {[0, 8].includes(kind) && (
        <path
          d="M12 30q10 2 20 14 10-12 20-14v14q-7 15-20 13-13 2-20-13Z"
          fill="#fbf4e7"
        />
      )}
      {kind === 4 && (
        <>
          <ellipse cx="23" cy="32" rx="10" ry="12" fill="#f6eddf" />
          <ellipse cx="41" cy="32" rx="10" ry="12" fill="#f6eddf" />
        </>
      )}
      {kind === 1 && (
        <>
          <ellipse
            cx="23"
            cy="31"
            rx="8"
            ry="10"
            fill={ink}
            transform="rotate(25 23 31)"
          />
          <ellipse
            cx="41"
            cy="31"
            rx="8"
            ry="10"
            fill={ink}
            transform="rotate(-25 41 31)"
          />
        </>
      )}
      {kind === 7 && (
        <g stroke="#80532c" strokeWidth="3" strokeLinecap="round">
          <path d="m26 16 3 6m9-6-3 6M12 32l7 3m-6 7 6-1m33-9-7 3m6 7-6-1" />
        </g>
      )}
      {kind !== 3 && (
        <g>
          <circle
            cx="24"
            cy="32"
            r={kind === 4 ? 4 : 3}
            fill={kind === 1 ? "#fff" : ink}
          />
          <circle
            cx="40"
            cy="32"
            r={kind === 4 ? 4 : 3}
            fill={kind === 1 ? "#fff" : ink}
          />
          {kind !== 1 && (
            <>
              <circle cx="25" cy="31" r="1" fill="#fff" />
              <circle cx="41" cy="31" r="1" fill="#fff" />
            </>
          )}
        </g>
      )}
      {kind === 3 ? (
        <path
          d="M20 41q12 11 24 0"
          fill="none"
          stroke={ink}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          {kind === 9 ? (
            <ellipse cx="32" cy="40" rx="5" ry="7" fill={ink} />
          ) : (
            <path
              d="m28 39 4 5 4-5Z"
              fill={kind === 8 || kind === 4 ? "#de9145" : ink}
              strokeLinejoin="round"
            />
          )}
          {kind !== 8 && kind !== 4 && (
            <path
              d="M32 44v3m-5 0q5 5 10 0"
              fill="none"
              stroke={ink}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}
        </>
      )}
      {[2, 7].includes(kind) && (
        <path
          d="m11 41 10 1m-9 5 9-2m22-3 10-1m-10 4 9 2"
          stroke={ink}
          strokeWidth="1"
          strokeLinecap="round"
        />
      )}
      <path
        d="M22 57q10 7 20 0"
        stroke={
          ["#087f83", "#7254a2", "#b05f3c", "#345e9a"][
            Math.floor(hash / 72) % 4
          ]
        }
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
