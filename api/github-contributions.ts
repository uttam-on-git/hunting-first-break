type ContributionLevel =
  | 'NONE'
  | 'FIRST_QUARTILE'
  | 'SECOND_QUARTILE'
  | 'THIRD_QUARTILE'
  | 'FOURTH_QUARTILE';

type GitHubContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
};

type GitHubGraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions?: number;
          weeks?: Array<{
            contributionDays?: GitHubContributionDay[];
          }>;
        };
      };
    };
  };
  errors?: Array<{ message?: string }>;
};

const levelToNumber = (level: ContributionLevel): number => {
  switch (level) {
    case 'NONE':
      return 0;
    case 'FIRST_QUARTILE':
      return 1;
    case 'SECOND_QUARTILE':
      return 2;
    case 'THIRD_QUARTILE':
      return 3;
    case 'FOURTH_QUARTILE':
      return 4;
    default:
      return 0;
  }
};

const toUtcIsoDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'Missing GITHUB_TOKEN' });
    return;
  }

  const username = typeof req.query?.username === 'string'
    ? req.query.username
    : 'uttam-on-git';

  const today = new Date();
  const toDate = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    23,
    59,
    59
  ));
  const fromDate = new Date(toDate);
  fromDate.setUTCDate(fromDate.getUTCDate() - 365);

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          login: username,
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
      }),
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'GitHub GraphQL request failed' });
      return;
    }

    const payload = (await response.json()) as GitHubGraphQLResponse;

    if (payload.errors?.length) {
      const message = payload.errors[0]?.message || 'GitHub GraphQL error';
      res.status(502).json({ error: message });
      return;
    }

    const weeks =
      payload.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

    const contributions = weeks.flatMap((week) =>
      (week.contributionDays ?? []).map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: levelToNumber(day.contributionLevel),
      }))
    );

    const total =
      payload.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ??
      contributions.reduce((sum, day) => sum + day.count, 0);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({
      total,
      from: toUtcIsoDate(fromDate),
      to: toUtcIsoDate(toDate),
      contributions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load GitHub contributions' });
  }
}
