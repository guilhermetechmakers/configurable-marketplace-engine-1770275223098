import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  UserNotificationPreference,
  NotificationChannel,
} from '@/types/database/user_notification_preference'

const DEFAULT_CHANNELS: NotificationChannel[] = ['email', 'push', 'in_app']

export const notificationPreferencesApi = {
  listByUserId: async (
    userId: string,
  ): Promise<UserNotificationPreference[]> => {
    if (!isSupabaseConfigured() || !supabase) {
      return DEFAULT_CHANNELS.map((channel) => ({
        id: `${userId}-${channel}`,
        user_id: userId,
        channel,
        enabled: channel === 'email',
        created_at: '',
        updated_at: '',
      }))
    }
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
    const list = (data ?? []) as UserNotificationPreference[]
    const byChannel = new Map(list.map((p) => [p.channel, p]))
    return DEFAULT_CHANNELS.map((channel) => byChannel.get(channel) ?? {
      id: '',
      user_id: userId,
      channel,
      enabled: channel === 'email',
      created_at: '',
      updated_at: '',
    })
  },

  upsert: async (
    userId: string,
    channel: NotificationChannel,
    enabled: boolean,
  ): Promise<UserNotificationPreference> => {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        id: `${userId}-${channel}`,
        user_id: userId,
        channel,
        enabled,
        created_at: '',
        updated_at: '',
      }
    }
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .upsert(
        { user_id: userId, channel, enabled },
        { onConflict: 'user_id,channel' },
      )
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as UserNotificationPreference
  },
}
