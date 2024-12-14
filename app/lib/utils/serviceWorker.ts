'use client';

const getRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration('/firebase-push-notification-scope')
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register(
          '/firebase-messaging-sw.js',
          {
            scope: '/firebase-push-notification-scope',
          },
        );
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};

async function registerServiceWorker(): Promise<void> {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service worker registered successfully.');
    } catch (error) {
      console.error('Error occurred while registering service worker:', error);
    }
  } else {
    console.log('Service workers are not supported in this browser.');
  }
}

async function unregisterServiceWorker(): Promise<void> {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('Service worker unregistered successfully.');
      } else {
        console.log('No service worker found.');
      }
    } catch (error) {
      console.error(
        'Error occurred while unregistering service worker:',
        error,
      );
    }
  } else {
    console.log('Service workers are not supported in this browser.');
  }
}

export {
  getRegisterServiceWorker,
  registerServiceWorker,
  unregisterServiceWorker,
};
