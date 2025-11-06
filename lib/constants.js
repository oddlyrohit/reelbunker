// OpenAI API key - set this in Vercel environment variables
export const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

// Supported platforms
export const PLATFORMS = {
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter'
};
