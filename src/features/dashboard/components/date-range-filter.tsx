import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import {
  endOfMonth,
  endOfQuarter,
  format,
  startOfMonth,
  startOfQuarter,
  subMonths,
  subQuarters,
} from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type RangePreset =
  | 'this-month'
  | 'last-month'
  | 'this-quarter'
  | 'last-quarter'
  | 'custom'

export interface DayRange {
  from: Date
  to: Date
}

// "This month" and "This quarter" run up to today, so they never include future days.
export function presetRange(preset: Exclude<RangePreset, 'custom'>): DayRange {
  const today = new Date()
  switch (preset) {
    case 'this-month':
      return { from: startOfMonth(today), to: today }
    case 'last-month': {
      const last = subMonths(today, 1)
      return { from: startOfMonth(last), to: endOfMonth(last) }
    }
    case 'this-quarter':
      return { from: startOfQuarter(today), to: today }
    case 'last-quarter': {
      const last = subQuarters(today, 1)
      return { from: startOfQuarter(last), to: endOfQuarter(last) }
    }
  }
}

interface Props {
  preset: RangePreset
  range: DayRange
  onChange: (preset: RangePreset, range: DayRange) => void
}

export function DateRangeFilter({ preset, range, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>(range)

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Select
        value={preset}
        onValueChange={(value) => {
          const next = value as RangePreset
          if (next === 'custom') {
            setDraft(range)
            setOpen(true)
            onChange('custom', range)
          } else {
            onChange(next, presetRange(next))
          }
        }}
      >
        <SelectTrigger className='w-[150px]'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='this-month'>This month</SelectItem>
          <SelectItem value='last-month'>Last month</SelectItem>
          <SelectItem value='this-quarter'>This quarter</SelectItem>
          <SelectItem value='last-quarter'>Last quarter</SelectItem>
          <SelectItem value='custom'>Custom range</SelectItem>
        </SelectContent>
      </Select>

      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (next) setDraft(range)
        }}
      >
        <PopoverTrigger asChild>
          <Button variant='outline' className='justify-start text-left font-normal'>
            <CalendarIcon className='mr-2 h-4 w-4' />
            {format(range.from, 'LLL dd, y')} - {format(range.to, 'LLL dd, y')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='end'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={draft?.from ?? range.from}
            selected={draft}
            onSelect={(selected) => {
              setDraft(selected)
              if (selected?.from && selected?.to) {
                onChange('custom', { from: selected.from, to: selected.to })
                setOpen(false)
              }
            }}
            disabled={{ after: new Date() }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
