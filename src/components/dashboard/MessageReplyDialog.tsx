import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSendMessage } from '@/hooks/useMessages'
import type { ConversationWithLastMessage } from '@/api/messages'
import { MessageSquare, Send, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface MessageReplyDialogProps {
  conversation: ConversationWithLastMessage | null
  currentUserId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSent?: () => void
}

export function MessageReplyDialog({
  conversation,
  currentUserId,
  open,
  onOpenChange,
  onSent,
}: MessageReplyDialogProps) {
  const [content, setContent] = useState('')
  const sendMessage = useSendMessage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!conversation || !content.trim()) return
    sendMessage.mutate(
      {
        conversation_id: conversation.id,
        sender_id: currentUserId,
        content: content.trim(),
      },
      {
        onSuccess: () => {
          setContent('')
          onSent?.()
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] flex flex-col rounded-2xl border-border bg-card shadow-card sm:max-w-md"
        showClose
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Quick reply
          </DialogTitle>
          <DialogDescription>
            {conversation?.subject
              ? `Re: ${conversation.subject}`
              : 'Reply to this conversation.'}
          </DialogDescription>
        </DialogHeader>

        {conversation && (
          <ScrollArea className="max-h-32 rounded-lg border border-border bg-muted/30 p-3 text-sm">
            {conversation.last_message && (
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  Last message {formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })}
                </p>
                <p className="text-foreground">{conversation.last_message.content}</p>
              </div>
            )}
          </ScrollArea>
        )}

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
          <Textarea
            placeholder="Type your reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none rounded-xl border-border focus:ring-2 focus:ring-primary/20"
            disabled={!conversation}
            maxLength={2000}
          />
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || sendMessage.isPending}
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Send
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
