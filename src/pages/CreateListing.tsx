import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { useListingCategories, useCreateListing } from '@/hooks/useListings'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export function CreateListing() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: categories, isLoading: categoriesLoading } = useListingCategories()
  const createListing = useCreateListing()

  if (userLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-2xl px-6 py-12">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-8 h-96 w-full" />
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">Please log in to create a listing.</p>
          <Button asChild className="mt-4">
            <Link to="/login">Log in</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create listing</h1>
          <p className="mt-1 text-muted-foreground">
            Complete the steps below. You can save as draft and publish later.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Category drives the form fields. Add title, summary, and media.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Category</Label>
              {categoriesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Listing title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" placeholder="Short description" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Media</Label>
              <div className="rounded-xl border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Drag and drop images here, or click to upload.
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Cancel</Link>
              </Button>
              <Button variant="outline">Save draft</Button>
              <Button
                disabled={createListing.isPending}
                onClick={() => {
                  // In real app: submit form data
                }}
              >
                {createListing.isPending ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
