import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  genre: string;
  published_year: number;
  rating: number;
  pages: number;
}

export default function BookShelf() {
  const { user, signOut } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching books:', error);
    } else {
      setBooks(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      search === '' ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const uniqueGenres = Array.from(new Set(books.map((b) => b.genre))).sort();

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.logo}>BookShelf</h1>
          <div style={styles.headerRight}>
            <span style={styles.userEmail}>{user?.email}</span>
            <button onClick={signOut} style={styles.signOutBtn}>Sign Out</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>Explore Our Collection</h2>
        <p style={styles.heroSub}>{books.length} books available for you to discover</p>
      </section>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.controlRight}>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={styles.genreSelect}
          >
            <option value="All">All Genres</option>
            {uniqueGenres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <div style={styles.viewToggle}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                ...styles.viewBtn,
                ...(viewMode === 'grid' ? styles.viewBtnActive : {}),
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                ...styles.viewBtn,
                ...(viewMode === 'list' ? styles.viewBtnActive : {}),
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="3" rx="1" />
                <rect x="3" y="10.5" width="18" height="3" rx="1" />
                <rect x="3" y="17" width="18" height="3" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={styles.resultsInfo}>
        <span style={styles.resultsCount}>
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
        </span>
      </div>

      {/* Books */}
      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No books found matching your search.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={styles.grid}>
          {filteredBooks.map((book) => (
            <div key={book.id} style={styles.card}>
              <div style={styles.cardCover}>
                <img src={book.cover_url} alt="" style={styles.coverImg} loading="lazy" />
                <div style={styles.genreBadge}>{book.genre}</div>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{book.title}</h3>
                <p style={styles.cardAuthor}>{book.author}</p>
                <p style={styles.cardDesc}>{book.description}</p>
                <div style={styles.cardMeta}>
                  <span style={styles.metaItem}>{book.published_year}</span>
                  <span style={styles.metaDot}>&middot;</span>
                  <span style={styles.metaItem}>{book.pages} pages</span>
                  <span style={styles.metaDot}>&middot;</span>
                  <span style={styles.rating}>
                    {'★'.repeat(Math.round(book.rating))}
                    <span style={styles.ratingDim}>{'★'.repeat(5 - Math.round(book.rating))}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.list}>
          {filteredBooks.map((book) => (
            <div key={book.id} style={styles.listItem}>
              <img src={book.cover_url} alt="" style={styles.listImg} loading="lazy" />
              <div style={styles.listBody}>
                <div style={styles.listTop}>
                  <div>
                    <h3 style={styles.listTitle}>{book.title}</h3>
                    <p style={styles.listAuthor}>{book.author}</p>
                  </div>
                  <span style={styles.listGenre}>{book.genre}</span>
                </div>
                <p style={styles.listDesc}>{book.description}</p>
                <div style={styles.listMeta}>
                  <span>{book.published_year}</span>
                  <span style={styles.metaDot}>&middot;</span>
                  <span>{book.pages} pages</span>
                  <span style={styles.metaDot}>&middot;</span>
                  <span style={styles.rating}>
                    {'★'.repeat(Math.round(book.rating))}
                    <span style={styles.ratingDim}>{'★'.repeat(5 - Math.round(book.rating))}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0f172a',
    color: '#f8fafc',
  },
  header: {
    background: '#1e293b',
    borderBottom: '1px solid #334155',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userEmail: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  signOutBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #475569',
    background: 'transparent',
    color: '#cbd5e1',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  hero: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '48px 24px 32px',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#f8fafc',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  heroSub: {
    fontSize: '18px',
    color: '#94a3b8',
    margin: 0,
  },
  controls: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px 24px',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchWrap: {
    flex: '1 1 300px',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    borderRadius: '10px',
    border: '1px solid #475569',
    background: '#1e293b',
    color: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  controlRight: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  genreSelect: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #475569',
    background: '#1e293b',
    color: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
  },
  viewToggle: {
    display: 'flex',
    borderRadius: '10px',
    border: '1px solid #475569',
    overflow: 'hidden',
  },
  viewBtn: {
    padding: '10px 12px',
    border: 'none',
    background: '#1e293b',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  viewBtnActive: {
    background: '#3b82f6',
    color: '#fff',
  },
  resultsInfo: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px 16px',
  },
  resultsCount: {
    fontSize: '14px',
    color: '#64748b',
  },
  grid: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px 48px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#1e293b',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #334155',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  cardCover: {
    position: 'relative',
    height: '180px',
    overflow: 'hidden',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  genreBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '4px 10px',
    borderRadius: '6px',
    background: 'rgba(15, 23, 42, 0.85)',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: 500,
    backdropFilter: 'blur(4px)',
  },
  cardBody: {
    padding: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#f8fafc',
    margin: '0 0 6px 0',
    lineHeight: 1.3,
  },
  cardAuthor: {
    fontSize: '14px',
    color: '#3b82f6',
    margin: '0 0 10px 0',
    fontWeight: 500,
  },
  cardDesc: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: '0 0 14px 0',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748b',
    flexWrap: 'wrap',
  },
  metaItem: {},
  metaDot: {
    color: '#475569',
  },
  rating: {
    color: '#f59e0b',
    fontSize: '13px',
  },
  ratingDim: {
    color: '#475569',
  },
  list: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  listItem: {
    display: 'flex',
    gap: '20px',
    background: '#1e293b',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #334155',
    padding: '16px',
  },
  listImg: {
    width: '100px',
    height: '140px',
    borderRadius: '10px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  listBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  listTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#f8fafc',
    margin: 0,
    lineHeight: 1.3,
  },
  listAuthor: {
    fontSize: '14px',
    color: '#3b82f6',
    margin: '4px 0 0 0',
    fontWeight: 500,
  },
  listGenre: {
    padding: '4px 10px',
    borderRadius: '6px',
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
    fontSize: '12px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  listDesc: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.5,
  },
  listMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748b',
    marginTop: 'auto',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #334155',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: '16px',
    margin: 0,
  },
  empty: {
    textAlign: 'center',
    padding: '80px 24px',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: '16px',
    margin: 0,
  },
};
