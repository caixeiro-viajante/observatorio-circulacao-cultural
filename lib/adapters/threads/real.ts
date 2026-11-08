import type { PlatformAdapter } from '../types'
import { PLATFORM_META } from '../types'

/**
 * Threads Insights adapter — implementation boundary for the central observer.
 *
 * Required env: THREADS_ACCESS_TOKEN, THREADS_USER_ID.
 * Official references:
 * - https://developers.facebook.com/docs/threads
 * - GET /{thread-id}/insights
 * - GET /{threads-user-id}/threads_insights
 *
 * The provider must preserve raw metric names and the observation timestamp.
 * Do not collapse views, likes, replies, reposts, quotes and shares into one
 * number before storing the snapshot.
 */
export function makeThreadsAdapter(): PlatformAdapter {
  const token = process.env.THREADS_ACCESS_TOKEN
  if (!token) throw new Error('THREADS_ACCESS_TOKEN is not set')

  return {
    meta: PLATFORM_META.threads,
    source: 'live',
    async getOverview() {
      throw new Error('Threads Insights adapter not yet implemented — use DEMO_MODE=true until the token and endpoint contract are configured.')
    },
    async getTimeSeries() {
      throw new Error('Threads Insights time series not yet implemented.')
    },
    async getTopContent() {
      throw new Error('Threads Insights top-content query not yet implemented.')
    },
  }
}
