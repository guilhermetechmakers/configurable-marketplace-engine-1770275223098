/**
 * Database types for user_notification_preferences table
 * Generated: 2025-02-05T15:00:03Z
 */

export type NotificationChannel = 'email' | 'push' | 'in_app'

export interface UserNotificationPreference {
  id: string
  user_id: string
  channel: NotificationChannel
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface UserNotificationPreferenceInsert {
  id?: string
  user_id: string
  channel: NotificationChannel
  enabled?: boolean
}

export interface UserNotificationPreferenceUpdate {
  enabled?: boolean
}

export type UserNotificationPreferenceRow = UserNotificationPreference
