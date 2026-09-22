import { useCallback, useEffect, useState } from 'react'

const categories = ['technology', 'business', 'science', 'sports', 'health', 'entertainment', 'general']
const formatDate = value => value ? new Date(value).toLocaleString() : ''

export default function App() {
  const [category, setCategory] = useState('technology')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNews = useCallback(async selected => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/news?category=${encodeURIComponent(selected)}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to load news.')
      setArticles((data.articles || []).filter(article => article.title !== '[Removed]'))
    } catch (err) {
      setArticles([])
      setError(err.message || 'Unable to load news.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadNews(category) }, [category, loadNews])

  return <main><section className="app">
    <header><small>REACT PROJECT</small><h1>Daily News</h1><p>Choose a category and explore the latest available headlines.</p></header>
    <nav>{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</nav>
    {loading && <div className="message">Loading {category} news...</div>}
    {error && !loading && <div className="message error">{error}</div>}
    {!loading && !error && <section className="grid">{articles.map((article, index) => <article className="article" key={`${article.url}-${index}`}>
      {article.urlToImage ? <img src={article.urlToImage} alt="" loading="lazy" /> : <div className="placeholder">NEWS</div>}
      <div className="body"><small>{article.source?.name || 'Unknown source'}</small><h2>{article.title}</h2><p>{article.description || 'Open the article to read the complete story.'}</p><div className="foot"><span>{formatDate(article.publishedAt)}</span><a href={article.url} target="_blank" rel="noreferrer">Read Article →</a></div></div>
    </article>)}</section>}
    {!loading && !error && articles.length === 0 && <div className="message">No articles were returned for this category.</div>}
    <footer>News supplied through NewsAPI. Add NEWS_API_KEY to Vercel Environment Variables.</footer>
  </section></main>
}
