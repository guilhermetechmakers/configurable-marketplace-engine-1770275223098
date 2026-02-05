/**
 * Database types for user_recommendations table
 * Generated: 2025-02-05
 */

export type RecommendationFeedback = 'like' | 'dislike'

export interface UserRecommendation {
  id: string
  user_id: string
  listing_id: string
  score: number
  feedback: RecommendationFeedback | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface UserRecommendationInsert {
  id?: string
  user_id: string
  listing_id: string
  score?: number
  feedback?: RecommendationFeedback | null
  metadata?: Record<string, unknown>
}

export interface UserRecommendationUpdate {
  score?: number
  feedback?: RecommendationFeedback | null
  metadata?: Record<string, unknown>
}

export type UserRecommendationRow = UserRecommendation
