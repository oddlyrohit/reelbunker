import Head from 'next/head';
import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { updateReelTags } from '../../lib/db';
import styles from '../../styles/ReelDetails.module.css';

export default function ReelDetails() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reel, setReel] = useState(null);
  const [newTag, setNewTag] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (id) {
          loadReel(id);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, id]);

  async function loadReel(reelId) {
    try {
      const reelDoc = await getDoc(doc(db, 'reels', reelId));
      if (reelDoc.exists()) {
        setReel({ id: reelDoc.id, ...reelDoc.data() });
      }
    } catch (err) {
      console.error('Error loading reel:', err);
    }
  }

  async function handleAddTag(e) {
    e.preventDefault();
    if (!newTag.trim() || !reel) return;

    const updatedTags = [...(reel.tags || []), newTag.trim()];
    try {
      await updateReelTags(reel.id, updatedTags);
      setReel({ ...reel, tags: updatedTags });
      setNewTag('');
    } catch (err) {
      alert('Error adding tag');
    }
  }

  async function handleRemoveTag(tagToRemove) {
    if (!reel) return;

    const updatedTags = reel.tags.filter(tag => tag !== tagToRemove);
    try {
      await updateReelTags(reel.id, updatedTags);
      setReel({ ...reel, tags: updatedTags });
    } catch (err) {
      alert('Error removing tag');
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!reel) {
    return <div className={styles.loading}>Reel not found</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{reel.title} - ReelBunker</title>
      </Head>

      <header className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backBtn}>
          ← Back
        </button>
        <h1>Reel Details</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.reelCard}>
          <div className={styles.platform}>{reel.platform}</div>
          
          <h2 className={styles.title}>{reel.title}</h2>
          <p className={styles.creator}>by {reel.creator}</p>
          
          <div className={styles.info}>
            <p><strong>URL:</strong></p>
            <a href={reel.url} target="_blank" rel="noopener noreferrer" className={styles.url}>
              {reel.url}
            </a>
          </div>

          <div className={styles.info}>
            <p><strong>Saved:</strong> {new Date(reel.createdAt).toLocaleDateString()}</p>
          </div>

          <div className={styles.tagsSection}>
            <h3>Tags</h3>
            <div className={styles.tags}>
              {reel.tags?.map((tag, idx) => (
                <span key={idx} className={styles.tag}>
                  #{tag}
                  <button 
                    onClick={() => handleRemoveTag(tag)}
                    className={styles.removeTagBtn}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddTag} className={styles.addTagForm}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag..."
                className={styles.tagInput}
              />
              <button type="submit" className={styles.addTagBtn}>
                + Add
              </button>
            </form>
          </div>

          <div className={styles.actions}>
            <a 
              href={reel.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.viewBtn}
            >
              🎥 Open Reel
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
