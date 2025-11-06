import { OPENAI_API_KEY } from './constants';

export async function generateTags(title, url, platform, creator) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates relevant tags for social media content. Return 3-5 short, relevant tags as a comma-separated list.'
          },
          {
            role: 'user',
            content: `Generate tags for this ${platform} reel by ${creator}. Title: ${title}. URL: ${url}`
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const tagsText = data.choices[0].message.content.trim();
    
    // Parse comma-separated tags
    const tags = tagsText
      .split(',')
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(tag => tag.length > 0)
      .slice(0, 5);

    return tags;
  } catch (error) {
    console.error('Error generating tags:', error);
    // Return default tags based on platform
    return [platform, creator, 'video'];
  }
}
