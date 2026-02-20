import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type GitHubContributionsProps = {
  username?: string;
};

interface ContributionDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
}

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  level: number | null;
  date: string | null;
  count: number | null;
};

type ContributionsApiResponse = {
  total?: number;
  contributions?: Array<{
    date?: string;
    level?: number;
    count?: number;
  }>;
  weeks?: Array<{
    contributionDays?: Array<{
      date?: string;
      level?: number;
      count?: number;
    }>;
    days?: Array<{
      date?: string;
      level?: number;
      count?: number;
    }>;
  }>;
};

const LEVEL_COLORS = {
  0: 'var(--contrib-0, #161b22)',
  1: 'var(--contrib-1, #0e4429)',
  2: 'var(--contrib-2, #006d32)',
  3: 'var(--contrib-3, #26a641)',
  4: 'var(--contrib-4, #39d353)',
} as const;

const GRID_START_X = 30;
const GRID_START_Y = 30;
const CELL_SIZE = 12;
const CELL_GAP = 3;
const SVG_HEIGHT = 180;

const toIsoDateUtc = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseIsoDateUtc = (value: string): Date => {
  return new Date(`${value}T00:00:00Z`);
};

const normalizeContributionDays = (raw: unknown): ContributionDay[] => {
  const clampLevel = (value: number): ContributionDay['level'] => {
    if (value <= 0) return 0;
    if (value >= 4) return 4;
    return value as ContributionDay['level'];
  };

  const fromItem = (item: {
    date?: string;
    level?: number;
    count?: number;
  }): ContributionDay | null => {
    if (!item.date) return null;
    const count = Math.max(0, item.count ?? 0);
    const level = clampLevel(item.level ?? (count === 0 ? 0 : 1));
    return {
      date: item.date,
      level,
      count,
    };
  };

  if (Array.isArray(raw)) {
    return raw
      .map((item) =>
        fromItem(item as { date?: string; level?: number; count?: number })
      )
      .filter((item): item is ContributionDay => Boolean(item));
  }

  const data = raw as ContributionsApiResponse;
  if (Array.isArray(data?.contributions)) {
    return data.contributions
      .map(fromItem)
      .filter((item): item is ContributionDay => Boolean(item));
  }

  if (Array.isArray(data?.weeks)) {
    const weekDays = data.weeks.flatMap(
      (week) => week.contributionDays ?? week.days ?? []
    );
    return weekDays
      .map(fromItem)
      .filter((item): item is ContributionDay => Boolean(item));
  }

  return [];
};

const buildLastYearSeries = (days: ContributionDay[]): ContributionDay[] => {
  const byDate = new Map(days.map((day) => [day.date, day]));
  const now = new Date();
  const todayUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const series: ContributionDay[] = [];

  for (let i = 364; i >= 0; i -= 1) {
    const date = new Date(todayUtc);
    date.setUTCDate(todayUtc.getUTCDate() - i);
    const dateString = toIsoDateUtc(date);
    const existing = byDate.get(dateString);

    series.push(
      existing ?? {
        date: dateString,
        level: 0,
        count: 0,
      }
    );
  }

  return series;
};

const getWeekStartUtc = (date: Date): Date => {
  const start = new Date(date);
  const day = start.getUTCDay();
  const offset = (day + 6) % 7;
  start.setUTCDate(start.getUTCDate() - offset);
  start.setUTCHours(0, 0, 0, 0);
  return start;
};

const buildWeeks = (days: ContributionDay[]): ContributionDay[][] => {
  const byWeek = new Map<string, Array<ContributionDay | null>>();

  days.forEach((day) => {
    const date = parseIsoDateUtc(day.date);
    const weekStart = getWeekStartUtc(date);
    const weekKey = toIsoDateUtc(weekStart);
    const week = byWeek.get(weekKey) ?? Array(7).fill(null);
    const dayIndex = (date.getUTCDay() + 6) % 7;
    week[dayIndex] = day;
    byWeek.set(weekKey, week);
  });

  const sortedWeeks = Array.from(byWeek.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekKey, week]) => {
      const weekStart = parseIsoDateUtc(weekKey);
      return week.map((item, index) => {
        if (item) return item;
        const dayDate = new Date(weekStart);
        dayDate.setUTCDate(dayDate.getUTCDate() + index);
        return {
          date: toIsoDateUtc(dayDate),
          level: 0 as const,
          count: 0,
        };
      });
    });

  return sortedWeeks.slice(-52);
};

const calculateStreaks = (
  days: ContributionDay[]
): { current: number; longest: number } => {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = toIsoDateUtc(new Date());
  const todayIndex = days.findIndex((day) => day.date === today);

  if (todayIndex !== -1 && days[todayIndex].count > 0) {
    currentStreak = 1;
    for (let i = todayIndex - 1; i >= 0; i -= 1) {
      if (days[i].count > 0) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  for (const day of days) {
    if (day.count > 0) {
      tempStreak += 1;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  return { current: currentStreak, longest: longestStreak };
};

const GitHubContributions = ({
  username = 'uttam-on-git',
}: GitHubContributionsProps) => {
  const graphRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    level: null,
    date: null,
    count: null,
  });
  const [contributionDays, setContributionDays] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    let isActive = true;

    const loadContributions = async () => {
      setLoading(true);
      setLoadError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const localResponse = await fetch(
          `/api/github-contributions?username=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );

        let payload: unknown;
        if (localResponse.ok) {
          payload = (await localResponse.json()) as unknown;
        } else {
          const fallbackResponse = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
            { signal: controller.signal }
          );
          if (!fallbackResponse.ok) {
            throw new Error(`Contribution request failed: ${fallbackResponse.status}`);
          }
          payload = (await fallbackResponse.json()) as unknown;
        }

        if (!isActive) return;

        const normalized = normalizeContributionDays(payload);
        const series = buildLastYearSeries(normalized);
        const streakData = calculateStreaks(series);

        setContributionDays(series);
        setStreak(streakData);
      } catch (error) {
        if (!isActive) return;
        setContributionDays([]);
        setLoadError(
          error instanceof Error ? error.message : 'Failed to load contributions'
        );
      } finally {
        clearTimeout(timeoutId);
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadContributions();

    return () => {
      isActive = false;
    };
  }, [username]);

  const weeks = useMemo(() => buildWeeks(contributionDays), [contributionDays]);
  const svgWidth = useMemo(() => {
    const cols = Math.max(weeks.length, 52);
    return GRID_START_X + cols * (CELL_SIZE + CELL_GAP) + 20;
  }, [weeks.length]);

  const contributionCount = useMemo(() => {
    return contributionDays.reduce((sum, day) => sum + day.count, 0);
  }, [contributionDays]);

  const monthLabels = useMemo(() => {
    const labels: Array<{ label: string; x: number }> = [];
    let previousMonth = '';

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (!firstDay) return;
      const date = parseIsoDateUtc(firstDay.date);
      const month = date.toLocaleDateString('en-US', {
        month: 'short',
        timeZone: 'UTC',
      });
      if (month !== previousMonth) {
        labels.push({
          label: month,
          x: GRID_START_X + weekIndex * (CELL_SIZE + CELL_GAP),
        });
        previousMonth = month;
      }
    });

    return labels;
  }, [weeks]);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<SVGRectElement>, day: ContributionDay | null) => {
      if (!day) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: rect.left + rect.width,
        y: rect.top,
        level: day.level,
        date: day.date,
        count: day.count,
      });
    },
    []
  );

  const handleFocus = useCallback((day: ContributionDay | null) => {
    if (!day) return;
    setTooltip({
      visible: true,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      level: day.level,
      date: day.date,
      count: day.count,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip((current) => ({ ...current, visible: false }));
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = parseIsoDateUtc(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }, []);

  useEffect(() => {
    if (!graphRef.current || loading || loadError) return;
    const container = graphRef.current;
    // Keep latest contribution weeks in view by default.
    container.scrollLeft = container.scrollWidth;
  }, [loading, loadError, weeks.length]);

  return (
    <div className="contribution-container w-full rounded-xl border border-[var(--border)] bg-[var(--theme-card)] p-4 pt-4 overflow-hidden hover:shadow-lg transition-all duration-300">
      <style>{`
        .contribution-tooltip {
          position: fixed;
          background-color: var(--theme-card);
          color: var(--theme-text);
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 50;
          white-space: nowrap;
          pointer-events: none;
          border: 1px solid var(--border);
          backdrop-filter: blur(8px);
        }
        .contribution-cell {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .contribution-cell:hover,
        .contribution-cell:focus-visible {
          transform: scale(1.2);
          filter: brightness(1.2);
        }
      `}</style>
      <div className="contribution-header mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-handwriting-header text-[var(--text-primary)]">
            Coding Activity • @{username}
          </h2>
          {!loading && !loadError && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--text-secondary)]">
                Current: {streak.current} day streak
              </span>
              <span className="text-[var(--text-secondary)]">
                Longest: {streak.longest}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        ref={graphRef}
        className="contribution-graph overflow-x-auto pb-4 min-w-full [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#0d1117] [&::-webkit-scrollbar-thumb]:bg-[#30363d] [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <svg
          className="block"
          width={svgWidth}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT}`}
          preserveAspectRatio="xMinYMin meet"
        >
          <g>
            {monthLabels.map((item) => (
              <text
                key={`${item.label}-${item.x}`}
                x={item.x}
                y="20"
                fontSize="12"
                fill="var(--text-secondary)"
              >
                {item.label}
              </text>
            ))}
          </g>

          <g>
            <text x="0" y="35" fontSize="11" fill="var(--text-secondary)">
              Mon
            </text>
            <text x="0" y="70" fontSize="11" fill="var(--text-secondary)">
              Wed
            </text>
            <text x="0" y="105" fontSize="11" fill="var(--text-secondary)">
              Fri
            </text>
          </g>

          <g transform={`translate(${GRID_START_X}, ${GRID_START_Y})`}>
            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => {
                const level = day?.level ?? 0;
                const x = weekIndex * (CELL_SIZE + CELL_GAP);
                const y = dayIndex * (CELL_SIZE + CELL_GAP);

                return (
                  <rect
                    key={`${weekIndex}-${dayIndex}`}
                    x={x}
                    y={y}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx={2}
                    fill={LEVEL_COLORS[level]}
                    stroke="var(--border)"
                    strokeWidth={1}
                    className="contribution-cell"
                    tabIndex={0}
                    aria-label={
                      day
                        ? `${day.count} contributions on ${formatDate(day.date)}`
                        : 'No contributions'
                    }
                    onMouseEnter={(event) => handleMouseEnter(event, day)}
                    onMouseLeave={handleMouseLeave}
                    onFocus={() => handleFocus(day)}
                    onBlur={handleMouseLeave}
                  />
                );
              })
            )}
          </g>
        </svg>

        {tooltip.visible && (
          <div
            className="contribution-tooltip"
            style={{
              left: tooltip.x + 8,
              top: tooltip.y + 8,
              position: 'fixed',
            }}
          >
            <div className="font-semibold">
              {tooltip.count ?? 0} contribution{tooltip.count !== 1 ? 's' : ''}
            </div>
            <div className="text-xs opacity-75">
              {tooltip.date ? formatDate(tooltip.date) : ''}
            </div>
            <div className="text-xs opacity-60 mt-1">
              Level: {tooltip.level ?? 0}/4
            </div>
          </div>
        )}
      </div>

      <div className="contribution-footer flex items-center justify-between mt-4">
        <span className="contribution-count text-sm text-[var(--text-secondary)]">
          {loading
            ? 'Loading contributions...'
            : loadError
              ? 'Unable to load contributions'
              : `${contributionCount} contributions in the last year`}
        </span>
        <div className="contribution-legend flex items-center gap-2">
          <span className="legend-label text-xs text-[var(--text-secondary)]">
            Less
          </span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="color-box w-3 h-3 rounded-sm transition-transform hover:scale-110"
              style={{ backgroundColor: LEVEL_COLORS[level] }}
            />
          ))}
          <span className="legend-label text-xs text-[var(--text-secondary)]">
            More
          </span>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions;


