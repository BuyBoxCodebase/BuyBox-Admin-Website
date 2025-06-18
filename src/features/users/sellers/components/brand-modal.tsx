import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Seller } from '@/hooks/users/schema'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, Hash, InfoIcon, User } from 'lucide-react'

interface BrandModalProps {
  children: ReactNode
  brand: Seller['brand']
}

const BrandModal = ({
  children,
  brand,
}: BrandModalProps) => {
  if (!brand) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-full max-w-lg p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold">Brand Information</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              No brand information available
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center text-center">
              <InfoIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Brand data not found</p>
              <p className="text-sm text-muted-foreground">Please check seller settings or create a brand first</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const formattedDate = new Date(brand.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-xl p-6">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{brand.name}</DialogTitle>
          </div>
        </DialogHeader>
        <Separator className="my-4" />
        
        <div className="space-y-6">
          {brand.brandPic ? (
            <div className="flex justify-center">
              <div className="relative rounded-xl overflow-hidden h-40 w-40 border bg-background shadow-sm">
                <img
                  src={brand.brandPic}
                  alt={`${brand.name} logo`}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-xl border bg-muted">
                <User className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
          )}
          
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Hash className="mr-1.5 h-3.5 w-3.5" />
                    ID
                  </div>
                  <p className="font-medium">{brand.id.length > 8 ? `${brand.id.substring(0, 8)}...` : brand.id}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-1.5 h-3.5 w-3.5" />
                    Brand Name
                  </div>
                  <p className="font-medium">{brand.name}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    Created
                  </div>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {brand.description && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <div className="rounded-lg border bg-card p-4 text-sm text-card-foreground shadow-sm">
                <p className="whitespace-pre-wrap leading-relaxed">{brand.description}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BrandModal