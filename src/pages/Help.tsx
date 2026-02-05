import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { HelpCircle, BookOpen } from 'lucide-react'

export function Help() {
  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Help & support</h1>
        <p className="mt-1 text-muted-foreground">
          Search FAQs, contact support, or read developer docs.
        </p>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="relative">
              <HelpCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search help articles..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Documentation
            </CardTitle>
            <CardDescription>API reference and integration guides</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link to="#">Developer docs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Send a message or attach files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
                rows={4}
                placeholder="Describe your issue..."
              />
            </div>
            <Button>Send message</Button>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
