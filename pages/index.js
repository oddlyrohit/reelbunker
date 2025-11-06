import Head from 'next/head';
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { getUserReels, deleteReel, saveReel } from '../lib/db';
import { extractPlatform, extractCreator, extractTitle, extractThumbnail, isValidUrl } from '../lib/metadata';
import { generateTags } from '../lib/ai';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState([]);
  const [filteredReels, setFilteredReels] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadReels(currentUser.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Filter reels when platform changes
    if (selectedPlatform === 'all') {
      setFilteredReels(reels);
    } else {
      setFilteredReels(reels.filter(reel => reel.platform === selectedPlatform));
    }
  }, [selectedPlatform, reels]);

  async function loadReels(userId) {
    try {
      const userReels = await getUserReels(userId);
      setReels(userReels);
      setFilteredReels(userReels);
    } catch (err) {
      console.error('Error loading reels:', err);
    }
  }

  async function handleSaveReel(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!isValidUrl(newUrl)) {
        throw new Error('Please enter a valid URL');
      }

      const platform = extractPlatform(newUrl);
      if (platform === 'unknown') {
        throw new Error('Unsupported platform. Use YouTube, TikTok, Instagram, Facebook, or Twitter');
      }

      const creator = extractCreator(newUrl);
      const title = extractTitle(newUrl);
      const thumbnail = extractThumbnail(newUrl);
      
      // Generate AI tags
      const tags = await generateTags(title, newUrl, platform, creator);

      const reelData = {
        url: newUrl,
        title,
        platform,
        creator,
        thumbnail,
        tags
      };

      const savedReel = await saveReel(user.uid, reelData);
      setReels([savedReel, ...reels]);
      setNewUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteReel(reelId) {
    if (confirm('Delete this reel?')) {
      try {
        await deleteReel(reelId);
        setReels(reels.filter(r => r.id !== reelId));
      } catch (err) {
        alert('Error deleting reel');
      }
    }
  }

  function handleCopyLink(reelUrl, reelId) {
    navigator.clipboard.writeText(reelUrl);
    setCopiedId(reelId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleLogout() {
    signOut(auth);
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const platforms = ['all', 'youtube', 'tiktok', 'instagram', 'facebook', 'twitter'];
  const platformCounts = {
    all: reels.length,
    youtube: reels.filter(r => r.platform === 'youtube').length,
    tiktok: reels.filter(r => r.platform === 'tiktok').length,
    instagram: reels.filter(r => r.platform === 'instagram').length,
    facebook: reels.filter(r => r.platform === 'facebook').length,
    twitter: reels.filter(r => r.platform === 'twitter').length,
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>ReelBunker - Save Your Favorite Reels</title>
        <meta name="description" content="Save and organize your favorite social media reels" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>🎬 ReelBunker</h1>
        <div className={styles.headerActions}>
          <button onClick={() => router.push('/search')} className={styles.searchBtn}>
            🔍 Search
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSaveReel} className={styles.saveForm}>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Paste reel URL here..."
            className={styles.urlInput}
            disabled={saving}
          />
          <button type="submit" disabled={saving} className={styles.saveBtn}>
            {saving ? '⏳ Saving...' : '💾 Save Reel'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.filterSection}>
          <div className={styles.filterButtons}>
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`${styles.filterBtn} ${selectedPlatform === platform ? styles.filterBtnActive : ''}`}
              >
                {platform === 'all' ? '🌐' : platform === 'youtube' ? '▶️' : platform === 'tiktok' ? '🎵' : platform === 'instagram' ? '📷' : platform === 'facebook' ? '📘' : '🐦'}
                {' '}
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                {' '}
                <span className={styles.filterCount}>({platformCounts[platform]})</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.stats}>
          <p>Showing {filteredReels.length} of {reels.length} reels</p>
        </div>

        <div className={styles.reelsGrid}>
          {filteredReels.map((reel) => (
            <div key={reel.id} className={styles.reelCard}>
              {reel.thumbnail && (
                <div className={styles.thumbnailContainer}>
                  <img 
                    src={reel.thumbnail} 
                    alt={reel.title}
                    className={styles.thumbnail}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/320x180/8b5cf6/FFFFFF?text=Video';
                    }}
                  />
                </div>
              )}
              
              <div className={styles.reelContent}>
                <div className={styles.reelHeader}>
                  <span className={styles.platform}>{reel.platform}</span>
                  <button 
                    onClick={() => handleDeleteReel(reel.id)}
                    className={styles.deleteBtn}
                  >
                    🗑️
                  </button>
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
                    🎥 View
                  </a>
                  <button 
                    onClick={() => handleCopyLink(reel.url, reel.id)}
                    className={styles.copyBtn}
                  >
                    {copiedId === reel.id ? '✓ Copied!' : '🔗 Copy'}
                  </button>
                  <button 
                    onClick={() => router.push(`/reel/${reel.id}`)}
                    className={styles.detailsBtn}
                  >
                    📝 Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReels.length === 0 && reels.length > 0 && (
          <div className={styles.empty}>
            <p>No {selectedPlatform} reels found. Try a different filter.</p>
          </div>
        )}

        {reels.length === 0 && (
          <div className={styles.empty}>
            <p>No reels saved yet! Paste a URL above to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
}
