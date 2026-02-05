import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useKycDocuments, useCreateKycDocument, useDeleteKycDocument } from '@/hooks/useKyc'
import { usePaymentMethods, useAddPaymentMethod, useUpdatePaymentMethod, useRemovePaymentMethod } from '@/hooks/usePaymentMethods'
import { useNotificationPreferences, useUpdateNotificationPreference } from '@/hooks/useNotificationPreferences'
import { useSellerSettings, useUpdateSellerSettings } from '@/hooks/useSellerSettings'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { AddEditPaymentDialog } from '@/components/profile/AddEditPaymentDialog'
import { KycDocumentUploadSheet } from '@/components/profile/KycDocumentUploadSheet'
import { NotificationPreferencesForm } from '@/components/profile/NotificationPreferencesForm'
import { AccountDeletionDialog } from '@/components/profile/AccountDeletionDialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Settings,
  Store,
  CreditCard,
  Bell,
  AlertTriangle,
  ChevronRight,
  Pencil,
  Plus,
  FileCheck,
  Calendar,
  Truck,
} from 'lucide-react'
import type { ProfileUpdate } from '@/types/database/profile'
import type { KycDocumentType } from '@/types/database/user_kyc_document'
import type { UserPaymentMethod } from '@/types/database/user_payment_method'
import type { PayoutSchedule } from '@/types/database/seller_settings'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function Profile() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const userId = user?.id
  const { data: profile, isLoading: profileLoading } = useProfile(userId)
  const { data: kycDocuments = [], isLoading: kycLoading } = useKycDocuments(userId)
  const { data: paymentMethods = [], isLoading: paymentMethodsLoading } = usePaymentMethods(userId)
  const { data: notificationPreferences = [], isLoading: notifLoading } = useNotificationPreferences(userId)
  const { data: sellerSettings, isLoading: sellerSettingsLoading } = useSellerSettings(
    user?.role === 'seller' ? userId : undefined,
  )

  const updateProfile = useUpdateProfile(userId)
  const createKyc = useCreateKycDocument(userId)
  const deleteKyc = useDeleteKycDocument(userId)
  const addPayment = useAddPaymentMethod(userId)
  const updatePayment = useUpdatePaymentMethod(userId)
  const removePayment = useRemovePaymentMethod(userId)
  const updateNotif = useUpdateNotificationPreference(userId)
  const updateSellerSettings = useUpdateSellerSettings(userId)

  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<UserPaymentMethod | null>(null)
  const [kycSheetOpen, setKycSheetOpen] = useState(false)
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const displayProfile = profile ?? (user ? {
    id: user.id,
    user_id: user.id,
    full_name: user.full_name ?? null,
    role: user.role,
    company: null,
    avatar_url: user.avatar_url ?? null,
    bio: null,
    verification_status: 'none' as const,
    created_at: '',
    updated_at: '',
  } : null)

  const handleEditProfileSubmit = (values: ProfileUpdate) => {
    if (!userId) return
    updateProfile.mutate(values, {
      onSuccess: () => setEditProfileOpen(false),
    })
  }

  const handlePaymentSubmit = (values: {
    payment_type: 'card' | 'bank_account'
    display_name: string
    last_four?: string
    brand?: string
    is_default?: boolean
  }) => {
    if (!userId) return
    if (editingPaymentMethod) {
      updatePayment.mutate(
        {
          id: editingPaymentMethod.id,
          updates: {
            display_name: values.display_name,
            is_default: values.is_default ?? false,
          },
        },
        {
          onSuccess: () => {
            setEditingPaymentMethod(null)
            setPaymentDialogOpen(false)
          },
        },
      )
    } else {
      addPayment.mutate(
        {
          user_id: userId,
          payment_type: values.payment_type,
          display_name: values.display_name,
          last_four: values.last_four || null,
          brand: values.brand || null,
          is_default: values.is_default ?? false,
        },
        {
          onSuccess: () => setPaymentDialogOpen(false),
        },
      )
    }
  }

  const handleKycUpload = (documentType: KycDocumentType) => {
    if (!userId) return
    createKyc.mutate(
      { user_id: userId, document_type: documentType },
      { onSuccess: () => toast.info('In a full implementation, file picker would open and upload to storage.') },
    )
  }

  const handleDeleteAccount = () => {
    setIsDeletingAccount(true)
    toast.error('Account deletion must be implemented via your backend or Supabase Auth admin.')
    setIsDeletingAccount(false)
    setDeleteAccountOpen(false)
  }

  if (userLoading || !user) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-3xl px-6 py-12">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-8 h-24 w-full rounded-2xl" />
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </AnimatedPage>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-3xl px-6 py-8 md:px-8">
        {/* Header: breadcrumbs + settings icon */}
        <header className="mb-8 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="font-medium text-foreground">Profile</span>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
            asChild
          >
            <Link to="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </header>

        {/* Profile Overview */}
        <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-card transition-shadow hover:shadow-md">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Avatar className="h-20 w-20 shrink-0 rounded-2xl border-2 border-border">
                <AvatarImage src={displayProfile?.avatar_url ?? user.avatar_url} alt={displayProfile?.full_name ?? undefined} />
                <AvatarFallback className="rounded-2xl text-xl font-semibold text-primary">
                  {(displayProfile?.full_name ?? user.email).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                {profileLoading ? (
                  <Skeleton className="h-8 w-48" />
                ) : (
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {displayProfile?.full_name ?? 'No name'}
                  </CardTitle>
                )}
                <CardDescription className="mt-1">{user.email}</CardDescription>
                {displayProfile?.bio && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {displayProfile.bio}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="rounded-lg bg-primary/10 text-primary">
                    {displayProfile?.role ?? user.role}
                  </Badge>
                  {(displayProfile?.verification_status === 'approved' || user.kyc_status === 'approved') && (
                    <Badge variant="secondary" className="rounded-lg">
                      Verified
                    </Badge>
                  )}
                  {(displayProfile?.verification_status === 'pending' || user.kyc_status === 'pending') && (
                    <Badge variant="secondary" className="rounded-lg">
                      Verification pending
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl"
                  onClick={() => setEditProfileOpen(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit profile
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <EditProfileModal
          open={editProfileOpen}
          onOpenChange={setEditProfileOpen}
          profile={displayProfile}
          onSubmit={handleEditProfileSubmit}
          isSubmitting={updateProfile.isPending}
        />

        <div className="mt-8 space-y-8">
          {/* KYC / Verification */}
          {(user.role === 'seller' || displayProfile?.role === 'seller') && (
            <>
              <Card className="rounded-2xl border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <FileCheck className="h-5 w-5 text-primary" />
                    KYC / Verification
                  </CardTitle>
                  <CardDescription>
                    Complete verification to receive payouts. Upload ID and proof of address.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {kycLoading ? (
                    <Skeleton className="h-12 w-full rounded-xl" />
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl sm:w-auto"
                      onClick={() => setKycSheetOpen(true)}
                    >
                      {kycDocuments.length > 0 ? 'Manage documents' : 'Start verification'}
                    </Button>
                  )}
                </CardContent>
              </Card>
              <KycDocumentUploadSheet
                open={kycSheetOpen}
                onOpenChange={setKycSheetOpen}
                documents={kycDocuments}
                isLoading={createKyc.isPending}
                onUpload={handleKycUpload}
                onRemove={(id) => deleteKyc.mutate(id)}
              />
              <Separator className="bg-border" />
            </>
          )}

          {/* Payment methods */}
          <Card className="rounded-2xl border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment methods
              </CardTitle>
              <CardDescription>
                Manage cards and bank accounts for checkout and payouts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethodsLoading ? (
                <Skeleton className="h-20 w-full rounded-xl" />
              ) : paymentMethods.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No payment methods yet. Add one to checkout or receive payouts.
                </p>
              ) : (
                <ul className="space-y-2">
                  {paymentMethods.map((pm) => (
                    <li
                      key={pm.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3"
                    >
                      <div>
                        <span className="font-medium">{pm.display_name ?? `${pm.payment_type} •••• ${pm.last_four ?? '****'}`}</span>
                        {pm.is_default && (
                          <Badge variant="secondary" className="ml-2 rounded-lg text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => {
                            setEditingPaymentMethod(pm)
                            setPaymentDialogOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg text-destructive hover:text-destructive"
                          onClick={() => removePayment.mutate(pm.id)}
                          disabled={removePayment.isPending}
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                variant="outline"
                className="w-full rounded-xl sm:w-auto"
                onClick={() => {
                  setEditingPaymentMethod(null)
                  setPaymentDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add payment method
              </Button>
            </CardContent>
          </Card>

          <AddEditPaymentDialog
            open={paymentDialogOpen}
            onOpenChange={(open) => {
              if (!open) setEditingPaymentMethod(null)
              setPaymentDialogOpen(open)
            }}
            paymentMethod={editingPaymentMethod}
            onSubmit={handlePaymentSubmit}
            isSubmitting={addPayment.isPending || updatePayment.isPending}
          />

          <Separator className="bg-border" />

          {/* Notification preferences */}
          <Card className="rounded-2xl border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Bell className="h-5 w-5 text-primary" />
                Notification preferences
              </CardTitle>
              <CardDescription>
                Choose how you receive order and message updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifLoading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : (
                <NotificationPreferencesForm
                  preferences={notificationPreferences}
                  onToggle={(channel, enabled) =>
                    updateNotif.mutate({ channel, enabled })
                  }
                  isUpdating={updateNotif.isPending}
                />
              )}
            </CardContent>
          </Card>

          {/* Seller tools (conditional) */}
          {(user.role === 'seller' || displayProfile?.role === 'seller') && (
            <>
              <Separator className="bg-border" />
              <Card className="rounded-2xl border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <Store className="h-5 w-5 text-primary" />
                    Seller tools
                  </CardTitle>
                  <CardDescription>
                    Storefront and payout settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sellerSettingsLoading ? (
                    <Skeleton className="h-20 w-full rounded-xl" />
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="payout-schedule">Payout schedule</Label>
                        <Select
                          value={sellerSettings?.payout_schedule ?? 'weekly'}
                          onValueChange={(value: PayoutSchedule) =>
                            updateSellerSettings.mutate({
                              payout_schedule: value,
                            })
                          }
                        >
                          <SelectTrigger id="payout-schedule" className="w-full max-w-xs rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Payouts are sent according to the schedule above.
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Truck className="h-4 w-4" />
                        Shipping settings can be configured per listing.
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Danger zone */}
          <Card className={cn(
            'rounded-2xl border-2 border-destructive/30 bg-destructive/5 shadow-card',
          )}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger zone
              </CardTitle>
              <CardDescription>
                Deleting your account is permanent and cannot be undone. An audit log entry will be created.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="rounded-xl"
                onClick={() => setDeleteAccountOpen(true)}
              >
                Delete account
              </Button>
            </CardContent>
          </Card>
        </div>

        <AccountDeletionDialog
          open={deleteAccountOpen}
          onOpenChange={setDeleteAccountOpen}
          onConfirm={handleDeleteAccount}
          isDeleting={isDeletingAccount}
        />
      </AnimatedPage>
    </MainLayout>
  )
}
