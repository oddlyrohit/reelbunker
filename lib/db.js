import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const REELS_COLLECTION = 'reels';

export async function saveReel(userId, reelData) {
  try {
    const docRef = await addDoc(collection(db, REELS_COLLECTION), {
      ...reelData,
      userId,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...reelData };
  } catch (error) {
    console.error('Error saving reel:', error);
    throw error;
  }
}

export async function getUserReels(userId) {
  try {
    const q = query(
      collection(db, REELS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const reels = [];
    querySnapshot.forEach((doc) => {
      reels.push({ id: doc.id, ...doc.data() });
    });
    // Sort in JavaScript instead of Firestore
    return reels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting reels:', error);
    throw error;
  }
}

export async function deleteReel(reelId) {
  try {
    await deleteDoc(doc(db, REELS_COLLECTION, reelId));
  } catch (error) {
    console.error('Error deleting reel:', error);
    throw error;
  }
}

export async function updateReelTags(reelId, tags) {
  try {
    const reelRef = doc(db, REELS_COLLECTION, reelId);
    await updateDoc(reelRef, { tags });
  } catch (error) {
    console.error('Error updating tags:', error);
    throw error;
  }
}

export async function searchReels(userId, searchTerm) {
  try {
    const allReels = await getUserReels(userId);
    const lowerSearch = searchTerm.toLowerCase();
    
    return allReels.filter(reel => 
      reel.title?.toLowerCase().includes(lowerSearch) ||
      reel.creator?.toLowerCase().includes(lowerSearch) ||
      reel.platform?.toLowerCase().includes(lowerSearch) ||
      reel.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
    );
  } catch (error) {
    console.error('Error searching reels:', error);
    throw error;
  }
}
