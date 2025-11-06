# 🎬 ReelBunker Web App

Save and organize your favorite social media reels with AI-powered tagging.

## ⚡ Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your OpenAI API Key
Edit `lib/constants.js` and replace `'sk-proj-YOUR-KEY-HERE'` with your actual OpenAI API key.

Get your key here: https://platform.openai.com/api-keys

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser!

---

## ✅ Features

- **Save Reels** - Paste URLs from YouTube, TikTok, Instagram, Facebook, Twitter
- **AI Tagging** - Automatic tag generation using GPT-4o-mini
- **Search & Filter** - Find reels by platform, creator, or tags
- **Tag Management** - Add/remove custom tags
- **Firebase Auth** - Secure email/password authentication
- **Firestore Database** - Real-time sync across devices
- **PWA Ready** - Install on home screen like a native app
- **Mobile Responsive** - Works perfectly on any screen size

---

## 🚀 Deploy to Vercel (2 Minutes)

### Step 1: Prepare for GitHub
```bash
# Make sure you're in the project directory
cd reelbunker-web

# Copy .env.example to .env.local and add your OpenAI key
cp .env.example .env.local
# Then edit .env.local and add your actual OpenAI key

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

### Step 2: Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. **IMPORTANT:** Add environment variable before deploying:
   - Key: `NEXT_PUBLIC_OPENAI_API_KEY`
   - Value: Your OpenAI API key (from https://platform.openai.com/api-keys)
5. Click "Deploy"

Done! Your app is live at `https://your-app.vercel.app`

### Important Notes for Production:
- ✅ Firebase config is SAFE to commit (it's designed for client-side)
- ❌ OpenAI API key should NEVER be in your code
- ✅ Always use environment variables in Vercel for API keys
- ✅ `.env.local` is in `.gitignore` so it won't be pushed

---

## 📱 Use on Mobile

### Install as PWA:
1. Open the app in Chrome/Safari on your phone
2. Tap the menu (⋮ or share icon)
3. Select "Add to Home Screen"
4. Now it works like a native app!

---

## 🏗️ Project Structure

```
reelbunker-web/
├── pages/
│   ├── index.js          # Home page (reel list)
│   ├── login.js          # Login/signup
│   ├── search.js         # Search & filter
│   └── reel/[id].js      # Reel details
├── lib/
│   ├── firebase.js       # Firebase config
│   ├── constants.js      # API keys (EDIT THIS!)
│   ├── metadata.js       # URL extraction
│   ├── ai.js             # AI tagging
│   └── db.js             # Firestore operations
├── styles/               # CSS modules
└── public/
    └── manifest.json     # PWA config
```

---

## 🔧 Configuration

### Firebase (Already Configured)
Your Firebase project is set up and ready:
- Project ID: reelbunker
- Authentication: Email/Password enabled
- Firestore: Database ready

### OpenAI API Key (Required)
**YOU MUST ADD THIS:**
1. Get a key from: https://platform.openai.com/api-keys
2. Edit `lib/constants.js`
3. Replace `'sk-proj-YOUR-KEY-HERE'` with your key

---

## 💻 Development Commands

### Run Locally
```bash
npm run dev
```
App runs at http://localhost:3000

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

---

## 📱 Test on Your Phone

### Option 1: Local Network
1. Run `npm run dev`
2. Find your computer's IP address (e.g., 192.168.1.100)
3. Open `http://192.168.1.100:3000` on your phone
4. Both devices must be on the same WiFi

### Option 2: Deploy to Vercel
1. Follow deployment steps above
2. Access from anywhere
3. Share the link with others

---

## 💰 Costs

- **Vercel Hosting:** FREE (hobby plan)
- **Firebase:** $0-5/month (usage-based, free tier is generous)
- **OpenAI API:** ~$0.002 per reel (about $1 per 500 reels)
- **Domain (optional):** $10-15/year

**Total: $0-10/month for most users**

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase errors
- Check that your Firebase config in `lib/firebase.js` is correct
- Ensure Email/Password auth is enabled in Firebase Console
- Verify Firestore database is created

### OpenAI API errors
- Check your API key in `lib/constants.js`
- Ensure you have credits in your OpenAI account
- Verify the key hasn't been revoked

### Port already in use
```bash
npm run dev -- -p 3001
```

---

## 📚 Supported Platforms

- ✅ YouTube Shorts
- ✅ TikTok
- ✅ Instagram Reels
- ✅ Facebook Videos
- ✅ Twitter/X Videos

---

## 🎯 What's Next?

**Phase 1 (Current):**
- ✅ Save reels
- ✅ AI tagging
- ✅ Search & filter
- ✅ Tag management

**Phase 2 (Future):**
- Collections/folders
- Bulk operations
- Video downloads
- Share with friends
- Advanced analytics

---

## 🔐 Security Notes

- Never commit your OpenAI API key to GitHub
- Keep `lib/constants.js` in .gitignore if sharing code
- Firebase keys are safe to expose (they're client-side keys)
- Use environment variables for production deployments

---

## 📖 Technical Details

**Frontend:**
- Next.js 14 (React framework)
- CSS Modules (scoped styling)
- No external UI libraries (clean, simple)

**Backend:**
- Firebase Authentication
- Firestore Database
- OpenAI GPT-4o-mini API

**Deployment:**
- Vercel (recommended)
- Any Node.js hosting works

---

## ❓ Questions?

**The app doesn't load:**
- Check browser console (F12) for errors
- Verify all dependencies installed: `npm install`
- Clear browser cache and restart dev server

**Tags aren't generating:**
- Check OpenAI API key is correct
- Verify you have API credits
- Check browser console for error messages

**Can't save reels:**
- Check Firebase console for errors
- Verify Firestore rules allow writes
- Check browser console for errors

---

## 🎉 You're Ready!

1. ✅ Install dependencies: `npm install`
2. ✅ Add OpenAI key in `lib/constants.js`
3. ✅ Run: `npm run dev`
4. ✅ Open: http://localhost:3000

**Start saving your favorite reels!** 🚀
