import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { UserKycDocument } from '@/types/database/user_kyc_document'
import type { KycDocumentType } from '@/types/database/user_kyc_document'
import { cn } from '@/lib/utils'

const DOCUMENT_TYPE_LABELS: Record<KycDocumentType, string> = {
  id_front: 'ID (front)',
  id_back: 'ID (back)',
  proof_of_address: 'Proof of address',
  other: 'Other document',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  uploaded: 'Uploaded',
  failed: 'Failed',
  approved: 'Approved',
  rejected: 'Rejected',
}

interface KycDocumentUploadSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documents: UserKycDocument[]
  isLoading?: boolean
  onUpload: (documentType: KycDocumentType) => void
  onRemove?: (id: string) => void
}

export function KycDocumentUploadSheet({
  open,
  onOpenChange,
  documents,
  isLoading = false,
  onUpload,
  onRemove,
}: KycDocumentUploadSheetProps) {
  const byType = new Map(documents.map((d) => [d.document_type, d]))
  const types: KycDocumentType[] = [
    'id_front',
    'id_back',
    'proof_of_address',
    'other',
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] rounded-2xl border-border bg-card shadow-card sm:max-w-lg"
        showClose
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            KYC documents
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload and manage verification documents. Required for seller
            payouts.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-4">
            {types.map((docType) => {
              const doc = byType.get(docType)

              return (
                <div
                  key={docType}
                  className={cn(
                    'flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-shadow hover:shadow-sm',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">
                        {DOCUMENT_TYPE_LABELS[docType]}
                      </span>
                    </div>
                    {doc && (
                      <Badge
                        variant={
                          doc.verification_status === 'approved'
                            ? 'default'
                            : doc.verification_status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="shrink-0"
                      >
                        {doc.verification_status === 'approved' ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : doc.verification_status === 'rejected' ? (
                          <XCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        )}
                        {STATUS_LABELS[doc.verification_status] ??
                          STATUS_LABELS[doc.upload_status] ??
                          'Pending'}
                      </Badge>
                    )}
                  </div>
                  {doc?.rejection_reason && (
                    <p className="text-sm text-destructive">
                      {doc.rejection_reason}
                    </p>
                  )}
                  <div className="flex gap-2">
                    {!doc || doc.upload_status !== 'uploaded' ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => onUpload(docType)}
                        disabled={isLoading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {doc ? 'Re-upload' : 'Upload'}
                      </Button>
                    ) : null}
                    {doc && onRemove && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-muted-foreground"
                        onClick={() => onRemove(doc.id)}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        <p className="text-xs text-muted-foreground">
          Supported: PDF, JPG, PNG. Max 5MB per file. Documents are verified by
          our team; you will be notified of the result.
        </p>
      </DialogContent>
    </Dialog>
  )
}
