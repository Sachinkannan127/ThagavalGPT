// PWA Installation and Service Worker utilities

let deferredPrompt = null;

// Check if app is installed
export const isAppInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Register service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('Service Worker registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available, show update notification
            if (window.confirm('New version available! Reload to update?')) {
              window.location.reload();
            }
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Capture install prompt
export const captureInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('Install prompt captured');
  });
};

// Show install prompt
export const showInstallPrompt = async () => {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return { outcome: 'not-available' };
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response to install prompt: ${outcome}`);
  deferredPrompt = null;
  
  return { outcome };
};

// Check if install prompt is available
export const isInstallPromptAvailable = () => {
  return deferredPrompt !== null;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show notification
export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const defaultOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
    };
    
    new Notification(title, { ...defaultOptions, ...options });
  }
};

// Check if device is mobile
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Check if device is iOS
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// Get install instructions based on device
export const getInstallInstructions = () => {
  if (isIOS()) {
    return {
      title: 'Install on iOS',
      steps: [
        'Tap the Share button',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to confirm',
      ],
    };
  }
  
  if (isMobileDevice()) {
    return {
      title: 'Install on Android',
      steps: [
        'Tap the menu button (⋮)',
        'Tap "Install app" or "Add to Home Screen"',
        'Follow the prompts to install',
      ],
    };
  }
  
  return {
    title: 'Install on Desktop',
    steps: [
      'Click the install icon in the address bar',
      'Or use the browser menu: Settings → Install ThagavalGPT',
      'Follow the prompts to install',
    ],
  };
};
