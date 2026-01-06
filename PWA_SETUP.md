# PWA Setup Guide

## Installation Instructions

### For Users

#### On Mobile (Android):
1. Open ThagavalGPT in Chrome or your preferred browser
2. Tap the menu (⋮) in the top-right corner
3. Select "Install app" or "Add to Home Screen"
4. Follow the prompts to install
5. Launch from your home screen like a native app!

#### On Mobile (iOS):
1. Open ThagavalGPT in Safari
2. Tap the Share button (box with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm
5. Find the app icon on your home screen

#### On Desktop:
1. Open ThagavalGPT in Chrome, Edge, or another Chromium-based browser
2. Look for the install icon (⊕) in the address bar
3. Click it and select "Install"
4. Or: Menu → Install ThagavalGPT

### For Developers

#### Generate PWA Icons:
```bash
cd frontend
npm install canvas --save-dev
node scripts/generateIcons.js
```

This will create all required icon sizes in `public/icons/`.

#### Test PWA Locally:
```bash
cd frontend
npm run build
npm run preview
```

Then open Chrome DevTools → Application → Manifest to verify PWA configuration.

## PWA Features

✅ **Offline Support** - Works without internet after first load
✅ **Install to Home Screen** - Acts like a native app
✅ **Fast Loading** - Service worker caching
✅ **Push Notifications** - Stay updated (coming soon)
✅ **Full Screen** - Immersive experience
✅ **Responsive** - Perfect on mobile and desktop
✅ **Auto Updates** - Seamless app updates

## Testing Checklist

- [ ] Manifest loads correctly (`/manifest.json`)
- [ ] Service worker registers (`/sw.js`)
- [ ] All icons load properly
- [ ] Install prompt appears
- [ ] App installs on mobile/desktop
- [ ] Works offline after first load
- [ ] Updates automatically

## Browser Support

| Browser | Install | Offline | Notifications |
|---------|---------|---------|---------------|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Firefox | ⚠️ | ✅ | ✅ |
| Safari (iOS) | ✅ | ✅ | ❌ |
| Safari (macOS) | ✅ | ✅ | ❌ |

## Troubleshooting

### Install button doesn't appear:
- Make sure you're using HTTPS (or localhost)
- Clear browser cache and reload
- Check Console for errors

### Service worker not registering:
- Verify `sw.js` is in the `public/` folder
- Check browser DevTools → Application → Service Workers
- Make sure you're in production build

### Icons not showing:
- Run the icon generation script
- Verify icons exist in `public/icons/`
- Check manifest.json paths

## Production Deployment

1. Build the app: `npm run build`
2. Deploy to HTTPS-enabled hosting (Netlify, Vercel, Firebase, etc.)
3. Verify manifest and service worker load correctly
4. Test installation on multiple devices

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [PWA Builder](https://www.pwabuilder.com/)
