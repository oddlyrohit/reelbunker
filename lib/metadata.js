import { PLATFORMS } from './constants';

export function extractPlatform(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return PLATFORMS.YOUTUBE;
  }
  if (url.includes('tiktok.com')) {
    return PLATFORMS.TIKTOK;
  }
  if (url.includes('instagram.com')) {
    return PLATFORMS.INSTAGRAM;
  }
  if (url.includes('facebook.com')) {
    return PLATFORMS.FACEBOOK;
  }
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return PLATFORMS.TWITTER;
  }
  return 'unknown';
}

export function extractCreator(url) {
  try {
    if (url.includes('youtube.com')) {
      const match = url.match(/@([^/?]+)/);
      return match ? match[1] : 'Unknown';
    }
    if (url.includes('tiktok.com')) {
      const match = url.match(/@([^/?]+)/);
      return match ? match[1] : 'Unknown';
    }
    if (url.includes('instagram.com')) {
      const match = url.match(/instagram\.com\/([^/?]+)/);
      return match ? match[1] : 'Unknown';
    }
    return 'Unknown';
  } catch (e) {
    return 'Unknown';
  }
}

export function extractTitle(url) {
  const platform = extractPlatform(url);
  const creator = extractCreator(url);
  return `${platform.charAt(0).toUpperCase() + platform.slice(1)} Reel by ${creator}`;
}

export function extractThumbnail(url) {
  try {
    // YouTube thumbnail
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = null;
      
      if (url.includes('youtube.com/shorts/')) {
        videoId = url.split('shorts/')[1]?.split('?')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      }
      
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }
    
    // Instagram - use placeholder (Instagram doesn't allow direct thumbnail access)
    if (url.includes('instagram.com')) {
      return 'https://via.placeholder.com/320x180/E4405F/FFFFFF?text=Instagram+Reel';
    }
    
    // TikTok - use placeholder (TikTok doesn't allow direct thumbnail access)
    if (url.includes('tiktok.com')) {
      return 'https://via.placeholder.com/320x180/000000/FFFFFF?text=TikTok';
    }
    
    // Default placeholder
    return 'https://via.placeholder.com/320x180/8b5cf6/FFFFFF?text=Video';
  } catch (e) {
    return 'https://via.placeholder.com/320x180/8b5cf6/FFFFFF?text=Video';
  }
}

export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}
