import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Mail, Bell, MessageSquare } from 'lucide-react'
import type { UserNotificationPreference } from '@/types/database/user_notification_preference'
import type { NotificationChannel } from '@/types/database/user_notification_preference'
import { cn } from '@/lib/utils'

const CHANNEL_CONFIG: Record<
  NotificationChannel,
  { label: string; icon: React.ElementType; description: string }
> = {
  email: {
    label: 'Email',
    icon: Mail,
    description: 'Receive order and message updates via email',
  },
  push: {
    label: 'Push notifications',
    icon: Bell,
    description: 'Browser or app push notifications',
  },
  in_app: {
    label: 'In-app',
    icon: MessageSquare,
    description: 'Notifications in the app notification center',
  },
}

interface NotificationPreferencesFormProps {
  preferences: UserNotificationPreference[]
  onToggle: (channel: NotificationChannel, enabled: boolean) => void
  isUpdating?: boolean
  className?: string
}

export function NotificationPreferencesForm({
  preferences,
  onToggle,
  isUpdating = false,
  className,
}: NotificationPreferencesFormProps) {
  const byChannel = new Map(preferences.map((p) => [p.channel, p]))

  return (
    <div className={cn('space-y-4', className)}>
      {(Object.keys(CHANNEL_CONFIG) as NotificationChannel[]).map(
        (channel) => {
          const config = CHANNEL_CONFIG[channel]
          const pref = byChannel.get(channel)
          const enabled = pref?.enabled ?? channel === 'email'
          const Icon = config.icon

          return (
            <div
              key={channel}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <Label
                    htmlFor={`notif-${channel}`}
                    className="cursor-pointer font-medium"
                  >
                    {config.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              </div>
              <Switch
                id={`notif-${channel}`}
                checked={enabled}
                onCheckedChange={(checked) => onToggle(channel, checked)}
                disabled={isUpdating}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          )
        },
      )}
    </div>
  )
}
