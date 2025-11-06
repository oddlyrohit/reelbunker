import Head from 'next/head';
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { searchReels } from '../lib/db';
import styles from '../styles/Search.module.css';

export default function Search() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm.trim() || !user) return;

    setSearching(true);
    try {
      const searchResults = await searchReels(user.uid, searchTerm);
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Search Reels - ReelBunker</title>
      </Head>

      <header className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backBtn}>
          ← Back
        </button>
        <h1>🔍 Search Reels</h1>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, creator, platform, or tag..."
            className={styles.searchInput}
          />
          <button type="submit" disabled={searching} className={styles.searchBtn}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {results.length > 0 && (
          <div className={styles.resultsHeader}>
            <p>{results.length} results found</p>
          </div>
        )}

        <div className={styles.resultsGrid}>
          {results.map((reel) => (
            <div key={reel.id} className={styles.reelCard}>
              <div className={styles.reelHeader}>
                <span className={styles.platform}>{reel.platform}</span>
              </div>
              
              <h3 className={styles.reelTitle}>{reel.title}</h3>
              <p className={styles.creator}>by {reel.creator}</p>
              
              <div className={styles.tags}>
                {reel.tags?.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>#{tag}</span>
                ))}
              </div>
              
              <div className={styles.reelActions}>
                <a 
                  href={reel.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.viewBtn}
                >
                  🎥 View Reel
                </a>
                <button 
                  onClick={() => router.push(`/reel/${reel.id}`)}
                  className={styles.detailsBtn}
                >
                  📝 Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && searchTerm && !searching && (
          <div className={styles.empty}>
            <p>No reels found matching "{searchTerm}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
