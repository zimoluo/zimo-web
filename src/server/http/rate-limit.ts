import { AppError } from "../../lib/errors";

export type WindowPolicy = {
  readonly name: string;
  readonly limit: number;
  readonly windowMs: number;
};

export const SUSTAINED_WRITES: WindowPolicy = {
  name: "sustained",
  limit: 10,
  windowMs: 5 * 60_000,
};

export const BURST_WRITES: WindowPolicy = {
  name: "burst",
  limit: 3,
  windowMs: 30_000,
};

export const WRITE_POLICIES: readonly WindowPolicy[] = [
  SUSTAINED_WRITES,
  BURST_WRITES,
];

export type Clock = () => number;

export type Decision =
  | { readonly allowed: true; readonly remaining: number }
  | {
      readonly allowed: false;
      readonly retryAfterMs: number;
      readonly policy: string;
    };

export type Limiter = {
  readonly check: (key: string) => Decision;
  readonly take: (key: string) => Decision;
  readonly require: (key: string) => void;
  readonly reset: (key?: string) => void;
  readonly size: () => number;
};

export function createLimiter(
  policies: readonly WindowPolicy[],
  now: Clock = () => Date.now(),
): Limiter {
  const history = new Map<string, number[]>();
  const longest = Math.max(...policies.map((policy) => policy.windowMs));
  const capacity = Math.max(...policies.map((policy) => policy.limit));

  const prune = (at: number): void => {
    for (const [key, stamps] of history) {
      const live = stamps.filter((stamp) => at - stamp < longest);
      if (live.length === 0) history.delete(key);
      else history.set(key, live);
    }
  };

  const decide = (key: string, spend: boolean): Decision => {
    const at = now();
    prune(at);

    const stamps = history.get(key) ?? [];

    const breaches = policies
      .map((policy) => ({
        policy,
        within: stamps.filter((stamp) => at - stamp < policy.windowMs),
      }))
      .filter(({ policy, within }) => within.length >= policy.limit);

    if (breaches.length > 0) {
      const worst = breaches.reduce((slowest, candidate) => {
        const wait = waitFor(candidate.within, candidate.policy, at);
        return wait > waitFor(slowest.within, slowest.policy, at)
          ? candidate
          : slowest;
      });

      return {
        allowed: false,
        retryAfterMs: waitFor(worst.within, worst.policy, at),
        policy: worst.policy.name,
      };
    }

    const remaining = Math.min(
      ...policies.map(
        (policy) =>
          policy.limit -
          stamps.filter((stamp) => at - stamp < policy.windowMs).length,
      ),
    );

    if (spend) {
      history.set(key, [...stamps, at].slice(-capacity));
    }

    return { allowed: true, remaining: spend ? remaining - 1 : remaining };
  };

  const waitFor = (
    within: readonly number[],
    policy: WindowPolicy,
    at: number,
  ): number => {
    const releasing = within[within.length - policy.limit];
    if (releasing === undefined) return policy.windowMs;
    return Math.max(1, releasing + policy.windowMs - at);
  };

  return {
    check: (key) => decide(key, false),
    take: (key) => decide(key, true),

    require: (key) => {
      const decision = decide(key, true);
      if (decision.allowed) return;
      throw new AppError(
        "rate-limited",
        "You are doing that too quickly. Try again shortly.",
        {
          retryAfter: decision.retryAfterMs / 1000,
          policy: decision.policy,
        },
      );
    },

    reset: (key) => {
      if (key === undefined) history.clear();
      else history.delete(key);
    },

    size: () => history.size,
  };
}

export const writeLimiter = createLimiter(WRITE_POLICIES);

export const clientIp = (request: Request): string =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  request.headers.get("x-real-ip") ??
  "unknown";
