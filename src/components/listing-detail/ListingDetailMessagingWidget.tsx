import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useAuth'
import { useMyConversations } from '@/hooks/useMessages'
import { useCreateConversation } from '@/hooks/useMessages'
import { ContactSellerDialog } from './ContactSellerDialog'
import { toast } from 'sonner'

interface ListingDetailMessagingWidgetProps {
  listingId: string
  listingTitle: string
  sellerId: string
  sellerName: string | null
  sellerAvatarUrl: string | null
}

/**
 * Renders a CTA to message the seller. If user is logged in, finds or creates
 * a conversation for this listing and navigates to /messages with that thread.
 */
export function ListingDetailMessagingWidget({
  listingId,
  listingTitle,
  sellerId,
  sellerName,
  sellerAvatarUrl,
}: ListingDetailMessagingWidgetProps) {
  const [contactOpen, setContactOpen] = useState(false)
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const { data: conversations } = useMyConversations(user?.id)
  const createConversation = useCreateConversation()

  const existingConversation = conversations?.find(
    (c) => c.listing_id === listingId && (c.buyer_id === user?.id || c.seller_id === user?.id),
  )

  const handleStartConversation = () => {
    if (!user?.id) {
      toast.error('Please sign in to message the seller')
      navigate('/login', { state: { from: `/listings/${listingId}` } })
      return
    }
    if (user.id === sellerId) {
      toast.error('You cannot message yourself')
      return
    }
    if (existingConversation) {
      navigate(`/messages?conversation=${existingConversation.id}`)
      return
    }
    createConversation.mutate(
      {
        buyer_id: user.id,
        seller_id: sellerId,
        listing_id: listingId,
        subject: listingTitle,
      },
      {
        onSuccess: (data) => {
          navigate(`/messages?conversation=${data.id}`)
        },
      },
    )
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => (user?.id ? handleStartConversation() : setContactOpen(true))}
        disabled={createConversation.isPending}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        {user?.id ? 'Message seller' : 'Sign in to message'}
      </Button>
      <ContactSellerDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        sellerName={sellerName}
        sellerAvatarUrl={sellerAvatarUrl}
        listingTitle={listingTitle}
        onStartConversation={() => {
          setContactOpen(false)
          if (!user?.id) navigate('/login', { state: { from: `/listings/${listingId}` } })
          else handleStartConversation()
        }}
        isLoading={createConversation.isPending}
      />
    </>
  )
}
