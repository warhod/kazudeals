/**
 * Minimal thenable query builder matching PostgrestFilterBuilder shape used by our API routes.
 * Each `from()` consumes the next queued `{ data, error }` resolution.
 */

export type MockQueryResult = { data: unknown; error: unknown };

function createQueryBuilder(result: MockQueryResult): object {
  const builder: Record<string, unknown> = {};
  const chain = [
    'select',
    'insert',
    'update',
    'delete',
    'upsert',
    'eq',
    'neq',
    'in',
    'or',
    'order',
    'limit',
    'ilike',
    'single',
    'maybeSingle',
  ];
  for (const m of chain) {
    builder[m] = () => builder;
  }
  return Object.assign(builder, {
    then(
      onFulfilled?: (value: MockQueryResult) => unknown,
      onRejected?: (reason: unknown) => unknown,
    ) {
      return Promise.resolve(result).then(onFulfilled as never, onRejected as never);
    },
  });
}

export function createQueuedSupabaseMock(
  authUser: { id: string; email?: string } | null,
  queryQueue: MockQueryResult[],
) {
  return {
    auth: {
      getUser: async () => ({ data: { user: authUser } }),
    },
    from(_table: string) {
      const next = queryQueue.shift();
      if (!next) {
        return createQueryBuilder({
          data: null,
          error: { message: 'mock queue exhausted (unexpected from() call)' },
        });
      }
      return createQueryBuilder(next);
    },
  };
}
