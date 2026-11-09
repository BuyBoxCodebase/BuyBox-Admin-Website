const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatUsd(value: number) {
  return usd.format(value)
}

// "+20.1% from previous period", or a plain sentence when there is nothing to compare with.
export function formatChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 'No change from previous period' : 'None in previous period'
  }
  const pct = ((current - previous) / previous) * 100
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}% from previous period`
}
