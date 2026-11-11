import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import useVariantApprovals, {
  ApprovalStatus,
  ReviewVariant,
  approveVariants,
  rejectVariants,
} from '@/hooks/variants/useVariantApprovals'

const TAB_LABELS: Record<ApprovalStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export default function VariantApprovals() {
  const [status, setStatus] = useState<ApprovalStatus>('PENDING')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [rejecting, setRejecting] = useState<string[] | null>(null)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const { variants, counts, totalPages, loading, refetch } = useVariantApprovals(status, page)

  const countFor = (s: ApprovalStatus) => counts[s.toLowerCase() as keyof typeof counts]

  const changeStatus = (next: string) => {
    setStatus(next as ApprovalStatus)
    setPage(1)
    setSelected(new Set())
  }

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const run = async (action: () => Promise<unknown>, success: string) => {
    setBusy(true)
    try {
      await action()
      toast({ title: success })
      setSelected(new Set())
      setRejecting(null)
      setReason('')
      await refetch()
    } catch (err) {
      toast({ title: 'Something went wrong', description: (err as Error).message, variant: 'destructive' })
    } finally {
      setBusy(false)
    }
  }

  const approve = (ids: string[]) =>
    run(() => approveVariants(ids), ids.length === 1 ? 'Variant approved' : `${ids.length} variants approved`)

  const confirmReject = () => {
    if (!rejecting) return
    run(
      () => rejectVariants(rejecting, reason),
      rejecting.length === 1 ? 'Variant rejected' : `${rejecting.length} variants rejected`,
    )
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Product Approvals</h2>
          <p className='text-muted-foreground'>
            Variants are only listed on the website after you approve them.
          </p>
        </div>

        <Tabs value={status} onValueChange={changeStatus}>
          <TabsList>
            {(Object.keys(TAB_LABELS) as ApprovalStatus[]).map((s) => (
              <TabsTrigger key={s} value={s}>
                {TAB_LABELS[s]} ({countFor(s)})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {selected.size > 0 && (
          <div className='mt-4 flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>{selected.size} selected</span>
            {status !== 'APPROVED' && (
              <Button size='sm' disabled={busy} onClick={() => approve([...selected])}>
                Approve selected
              </Button>
            )}
            {status !== 'REJECTED' && (
              <Button size='sm' variant='destructive' disabled={busy} onClick={() => setRejecting([...selected])}>
                Reject selected
              </Button>
            )}
          </div>
        )}

        <div className='mt-4 space-y-3'>
          {loading && <p className='py-8 text-center text-muted-foreground'>Loading variants...</p>}
          {!loading && variants.length === 0 && (
            <p className='py-8 text-center text-muted-foreground'>No {TAB_LABELS[status].toLowerCase()} variants</p>
          )}
          {!loading &&
            variants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                checked={selected.has(variant.id)}
                busy={busy}
                onToggle={() => toggle(variant.id)}
                onApprove={() => approve([variant.id])}
                onReject={() => setRejecting([variant.id])}
              />
            ))}
        </div>

        {totalPages > 1 && (
          <div className='mt-4 flex items-center justify-end gap-2'>
            <Button size='sm' variant='outline' disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className='text-sm text-muted-foreground'>
              Page {page} of {totalPages}
            </span>
            <Button size='sm' variant='outline' disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        )}
      </Main>

      <Dialog
        open={rejecting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRejecting(null)
            setReason('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {rejecting?.length === 1 ? 'variant' : `${rejecting?.length} variants`}</DialogTitle>
            <DialogDescription>The seller will see this reason on their dashboard.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            maxLength={500}
            placeholder='e.g. Images are blurry or do not match the product'
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant='outline' onClick={() => setRejecting(null)}>
              Cancel
            </Button>
            <Button variant='destructive' disabled={busy || !reason.trim()} onClick={confirmReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function VariantCard({
  variant,
  checked,
  busy,
  onToggle,
  onApprove,
  onReject,
}: {
  variant: ReviewVariant
  checked: boolean
  busy: boolean
  onToggle: () => void
  onApprove: () => void
  onReject: () => void
}) {
  const { product } = variant
  const image = variant.images[0] ?? product.images[0]
  const title = [product.name, variant.name].filter(Boolean).join(' - ')

  return (
    <Card>
      <CardContent className='flex flex-wrap items-start gap-4 p-4'>
        <Checkbox checked={checked} onCheckedChange={onToggle} className='mt-1' aria-label='Select variant' />
        {image ? (
          <img src={image} alt={title} className='h-24 w-24 rounded-md object-cover' />
        ) : (
          <div className='flex h-24 w-24 items-center justify-center rounded-md bg-muted text-xs'>No image</div>
        )}
        <div className='min-w-[220px] flex-1 space-y-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='font-semibold'>{title}</h3>
            {variant.isDefault && <Badge variant='secondary'>Default</Badge>}
          </div>
          <p className='text-sm text-muted-foreground'>
            {[product.brand, product.modelName, product.subCategory?.name ?? product.category?.name]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <p className='text-sm'>
            Seller: {product.seller.name} ({product.seller.email})
          </p>
          <p className='text-sm'>
            Price: {variant.price.toFixed(2)} · Stock: {variant.quantity}
          </p>
          {variant.options.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {variant.options.map((o) => (
                <Badge key={`${o.name}-${o.value}`} variant='outline'>
                  {o.name}: {o.value}
                </Badge>
              ))}
            </div>
          )}
          {(variant.description || product.description) && (
            <p className='line-clamp-2 text-sm text-muted-foreground'>{variant.description || product.description}</p>
          )}
          {variant.images.length > 1 && (
            <div className='flex gap-1 pt-1'>
              {variant.images.slice(1, 5).map((src) => (
                <img key={src} src={src} alt='' className='h-10 w-10 rounded object-cover' />
              ))}
            </div>
          )}
          {variant.approvalStatus === 'REJECTED' && variant.rejectionReason && (
            <p className='text-sm text-destructive'>Reason: {variant.rejectionReason}</p>
          )}
        </div>
        <div className='flex gap-2'>
          {variant.approvalStatus !== 'APPROVED' && (
            <Button size='sm' disabled={busy} onClick={onApprove}>
              Approve
            </Button>
          )}
          {variant.approvalStatus !== 'REJECTED' && (
            <Button size='sm' variant='destructive' disabled={busy} onClick={onReject}>
              Reject
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
