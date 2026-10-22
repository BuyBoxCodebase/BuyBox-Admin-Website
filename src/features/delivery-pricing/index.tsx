import { useEffect, useState } from 'react'
import axios from 'axios'
import { IconPlus, IconTrash, IconTruckDelivery } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { toast } from '@/hooks/use-toast'

interface Hub {
  id: string
  name: string
  address: string
  coordinates: { latitude: number; longitude: number } | null
  handlingFee: number
}

interface TransferFee {
  hubAId: string
  hubBId: string
  fee: number
}

interface DistanceBand {
  maxKm: number
  fee: number
}

interface Settings {
  hubs: Hub[]
  config: {
    transferFees: TransferFee[]
    distanceBands: DistanceBand[]
    beyondLastBandFee: number
  } | null
}

// Form state keeps raw strings so admins can type freely; numbers are parsed on save.
interface HubForm {
  latitude: string
  longitude: string
  handlingFee: string
}

const API_URL = `${import.meta.env.VITE_BASE_URL}/admin/delivery-pricing`
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

export default function DeliveryPricing() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [hubForms, setHubForms] = useState<Record<string, HubForm>>({})
  const [transferForms, setTransferForms] = useState<Record<string, string>>({})
  const [bandForms, setBandForms] = useState<{ maxKm: string; fee: string }[]>([])
  const [beyondLastBandFee, setBeyondLastBandFee] = useState('')

  useEffect(() => {
    axios
      .get<Settings>(API_URL, { headers: authHeaders() })
      .then((response) => applySettings(response.data))
      .catch((error) => showError(error, 'Failed to load delivery pricing'))
      .finally(() => setIsLoading(false))
  }, [])

  const applySettings = (data: Settings) => {
    setSettings(data)
    setHubForms(
      Object.fromEntries(
        data.hubs.map((hub) => [
          hub.id,
          {
            latitude: hub.coordinates?.latitude?.toString() ?? '',
            longitude: hub.coordinates?.longitude?.toString() ?? '',
            handlingFee: hub.handlingFee.toString(),
          },
        ])
      )
    )
    setTransferForms(
      Object.fromEntries(
        hubPairs(data.hubs).map(([a, b]) => {
          const route = data.config?.transferFees.find(
            (t) => (t.hubAId === a.id && t.hubBId === b.id) || (t.hubAId === b.id && t.hubBId === a.id)
          )
          return [pairKey(a.id, b.id), route ? route.fee.toString() : '']
        })
      )
    )
    setBandForms(
      (data.config?.distanceBands ?? []).map((band) => ({
        maxKm: band.maxKm.toString(),
        fee: band.fee.toString(),
      }))
    )
    setBeyondLastBandFee(data.config?.beyondLastBandFee?.toString() ?? '')
  }

  const saveHub = async (hub: Hub) => {
    const form = hubForms[hub.id]
    setIsSaving(true)
    try {
      const response = await axios.patch<Settings>(
        `${API_URL}/hubs/${hub.id}`,
        {
          handlingFee: Number(form.handlingFee),
          coordinates: { latitude: Number(form.latitude), longitude: Number(form.longitude) },
        },
        { headers: authHeaders() }
      )
      applySettings(response.data)
      toast({ title: `${hub.name} hub saved` })
    } catch (error) {
      showError(error, 'Failed to save hub')
    } finally {
      setIsSaving(false)
    }
  }

  const saveConfig = async () => {
    if (!settings) return
    setIsSaving(true)
    try {
      const response = await axios.put<Settings>(
        `${API_URL}/config`,
        {
          transferFees: hubPairs(settings.hubs).map(([a, b]) => ({
            hubAId: a.id,
            hubBId: b.id,
            fee: Number(transferForms[pairKey(a.id, b.id)]),
          })),
          distanceBands: bandForms.map((band) => ({ maxKm: Number(band.maxKm), fee: Number(band.fee) })),
          beyondLastBandFee: Number(beyondLastBandFee),
        },
        { headers: authHeaders() }
      )
      applySettings(response.data)
      toast({ title: 'Delivery prices saved' })
    } catch (error) {
      showError(error, 'Failed to save delivery prices')
    } finally {
      setIsSaving(false)
    }
  }

  const updateBand = (index: number, field: 'maxKm' | 'fee', value: string) => {
    setBandForms((bands) => bands.map((band, i) => (i === index ? { ...band, [field]: value } : band)))
  }

  const hubs = settings?.hubs ?? []
  const hubName = (id: string) => hubs.find((hub) => hub.id === id)?.name ?? 'Unknown hub'

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-4 flex items-center gap-2'>
          <IconTruckDelivery size={24} className='text-muted-foreground' />
          <h1 className='text-2xl font-bold tracking-tight'>Delivery Pricing</h1>
        </div>

        {isLoading ? (
          <p className='text-muted-foreground'>Loading delivery pricing...</p>
        ) : (
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Hubs</CardTitle>
                <CardDescription>
                  Hub location is used to measure home delivery distance and to find each seller&apos;s hub. The
                  handling fee is charged once per order at the hub the customer chooses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hub</TableHead>
                      <TableHead>Latitude</TableHead>
                      <TableHead>Longitude</TableHead>
                      <TableHead>Handling fee ($)</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hubs.map((hub) => (
                      <TableRow key={hub.id}>
                        <TableCell>
                          <div className='font-medium'>{hub.name}</div>
                          <div className='text-xs text-muted-foreground'>{hub.address}</div>
                        </TableCell>
                        {(['latitude', 'longitude', 'handlingFee'] as const).map((field) => (
                          <TableCell key={field}>
                            <Input
                              type='number'
                              step='any'
                              value={hubForms[hub.id]?.[field] ?? ''}
                              onChange={(e) =>
                                setHubForms((forms) => ({
                                  ...forms,
                                  [hub.id]: { ...forms[hub.id], [field]: e.target.value },
                                }))
                              }
                            />
                          </TableCell>
                        ))}
                        <TableCell className='text-right'>
                          <Button size='sm' variant='outline' disabled={isSaving} onClick={() => saveHub(hub)}>
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inter-hub transfer fees</CardTitle>
                <CardDescription>
                  Charged once for each seller hub that differs from the customer&apos;s chosen hub. Applies in both
                  directions. Sellers without a location are charged the cheapest of these.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                {hubPairs(hubs).map(([a, b]) => (
                  <div key={pairKey(a.id, b.id)} className='flex items-center gap-4'>
                    <span className='w-56 text-sm font-medium'>
                      {hubName(a.id)} ↔ {hubName(b.id)}
                    </span>
                    <Input
                      className='w-32'
                      type='number'
                      step='any'
                      min={0}
                      placeholder='$'
                      value={transferForms[pairKey(a.id, b.id)] ?? ''}
                      onChange={(e) =>
                        setTransferForms((forms) => ({ ...forms, [pairKey(a.id, b.id)]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Home delivery distance bands</CardTitle>
                <CardDescription>
                  Straight-line distance from the chosen hub to the customer. Each band starts where the previous one
                  ends, so bands cannot overlap or leave gaps.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                {bandForms.map((band, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <span className='w-24 text-sm text-muted-foreground'>
                      {index === 0 ? '0' : `Over ${bandForms[index - 1].maxKm || '?'}`} –
                    </span>
                    <Input
                      className='w-28'
                      type='number'
                      step='any'
                      min={0}
                      value={band.maxKm}
                      onChange={(e) => updateBand(index, 'maxKm', e.target.value)}
                    />
                    <span className='text-sm text-muted-foreground'>km</span>
                    <Input
                      className='w-28'
                      type='number'
                      step='any'
                      min={0}
                      placeholder='$'
                      value={band.fee}
                      onChange={(e) => updateBand(index, 'fee', e.target.value)}
                    />
                    <Button
                      size='icon'
                      variant='ghost'
                      aria-label='Remove band'
                      onClick={() => setBandForms((bands) => bands.filter((_, i) => i !== index))}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  size='sm'
                  variant='outline'
                  className='gap-2'
                  onClick={() => setBandForms((bands) => [...bands, { maxKm: '', fee: '' }])}
                >
                  <IconPlus size={16} />
                  Add band
                </Button>

                <div className='flex items-center gap-3 border-t pt-4'>
                  <span className='w-56 text-sm font-medium'>
                    Over {bandForms[bandForms.length - 1]?.maxKm || '?'} km (any distance)
                  </span>
                  <Input
                    className='w-28'
                    type='number'
                    step='any'
                    min={0}
                    placeholder='$'
                    value={beyondLastBandFee}
                    onChange={(e) => setBeyondLastBandFee(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className='flex justify-end'>
              <Button disabled={isSaving || hubs.length === 0} onClick={saveConfig}>
                {isSaving ? 'Saving...' : 'Save delivery prices'}
              </Button>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}

// Every unordered pair of hubs, so each route has exactly one fee.
function hubPairs(hubs: Hub[]): [Hub, Hub][] {
  const pairs: [Hub, Hub][] = []
  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      pairs.push([hubs[i], hubs[j]])
    }
  }
  return pairs
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('-')
}

function showError(error: unknown, fallback: string) {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined
  toast({
    variant: 'destructive',
    title: fallback,
    description: Array.isArray(message) ? message.join('. ') : (message ?? undefined),
  })
}
