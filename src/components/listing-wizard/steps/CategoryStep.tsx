import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ListingCategory } from '@/types/listing'

interface CategoryStepProps {
  categories: ListingCategory[]
  value: string
  onChange: (categoryId: string) => void
  isLoading?: boolean
}

export function CategoryStep({
  categories,
  value,
  onChange,
  isLoading,
}: CategoryStepProps) {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground">
          Choose a category
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          The category determines which fields appear in the next steps.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="listing-category">Category</Label>
          <Select
            value={value || undefined}
            onValueChange={onChange}
            disabled={isLoading}
          >
            <SelectTrigger
              id="listing-category"
              className="rounded-xl border-border focus-visible:ring-primary"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
