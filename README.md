# Firebase-Starter-Kit
 Firebase-Starter-Kit is a lightweight, reusable repository that simplifies Firebase integration for your projects. It includes essential features like authentication, real-time data fetching, cloud messaging, storage management, and analytics. Perfect for quickly setting up scalable web or mobile apps with Firebase.

## Folder Structure

```bash
.
├── app
│   ├── client-notification.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── lib
│   │   ├── constants
│   │   │   ├── firebase-path.ts
│   │   │   ├── index.ts
│   │   │   └── Routes.ts
│   │   ├── firebase
│   │   │   ├── auth.ts
│   │   │   ├── clientApp.ts
│   │   │   ├── config.ts
│   │   │   ├── firestore.ts
│   │   │   ├── notification.ts
│   │   │   └── storage.ts
│   │   ├── _modules
│   │   │   ├── auth
│   │   │   │   ├── controllers
│   │   │   │   │   └── AuthControllers.ts
│   │   │   │   ├── models
│   │   │   │   │   └── AuthModel.ts
│   │   │   │   └── services
│   │   │   │       └── AuthService.ts
│   │   │   └── Users
│   │   │       ├── controllers
│   │   │       │   └── UserControllers.ts
│   │   │       ├── models
│   │   │       │   └── UserModel.ts
│   │   │       └── services
│   │   │           └── UserService.ts
│   │   └── utils
│   │       ├── deleteIndexedFirebaseDBToken.ts
│   │       ├── detectBrowser.tsx
│   │       ├── getFirebaseAuthErrorMessage.ts
│   │       ├── indexDB.ts
│   │       └── serviceWorker.ts
│   └── page.tsx
├── context
│   ├── AuthContext.tsx
│   ├── Provider.tsx
│   └── StateContext.tsx
├── eslint.config.mjs
├── hooks
│   ├── useAuth.tsx
│   ├── useEffectAfterMount.tsx
│   ├── useFCM.tsx
│   └── useRTDBPagination.ts
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── firebase-messaging-sw.js
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── tailwind.config.ts
└── tsconfig.json
``` 