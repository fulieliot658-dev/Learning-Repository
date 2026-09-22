import { useCallback, useEffect, useMemo, useState } from 'react'

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,cardano,ripple,dogecoin,polkadot&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h'

const money = value => value == null ? '—' : new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: value < 1 ? 6 : 2
}).format(value)

export default function App() {
  const [coins, setCoins] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updated, setUpdated] = useState(null)

  const loadCoins = useCallback(async () => {
    setError('')
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error()
      setCoins(await response.json())
      setUpdated(new Date())
    } catch {
      setError('Unable to load market data. The API may be rate-limited or temporarily unavailable.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCoins()
    const timer = setInterval(loadCoins, 30000)
    return () => clearInterval(timer)
  }, [loadCoins])

  const filtered = useMemo(() => coins.filter(coin => {
    const q = query.toLowerCase().trim()
    return !q || coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q)
  }), [coins, query])

  return <main><section className="app">
    <header><div><small>REACT PROJECT</small><h1>Crypto Tracker</h1><p>Current cryptocurrency market data with 24-hour price changes.</p></div><button onClick={loadCoins}>Refresh</button></header>
    <div className="bar"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Bitcoin, ETH, Solana..." /><span>{updated ? `Updated ${updated.toLocaleTimeString()}` : 'Loading market...'}</span></div>
    {error && <div className="message error">{error}</div>}
    {loading ? <div className="message">Loading cryptocurrency data...</div> : <div className="grid">{filtered.map(coin => <article className="card" key={coin.id}>
      <div className="top"><img src={coin.image} alt="" /><div><h2>{coin.name}</h2><small>{coin.symbol.toUpperCase()}</small></div></div>
      <strong className="price">{money(coin.current_price)}</strong>
      <div className={coin.price_change_percentage_24h >= 0 ? 'up' : 'down'}>{coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}% <small>24h</small></div>
      <dl><div><dt>Market Cap</dt><dd>{money(coin.market_cap)}</dd></div><div><dt>24h Volume</dt><dd>{money(coin.total_volume)}</dd></div><div><dt>Rank</dt><dd>#{coin.market_cap_rank}</dd></div><div><dt>Circulating</dt><dd>{coin.circulating_supply ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(coin.circulating_supply) : '—'}</dd></div></dl>
    </article>)}</div>}
    <footer>Market data provided by CoinGecko. Refreshes automatically every 30 seconds.</footer>
  </section></main>
}
