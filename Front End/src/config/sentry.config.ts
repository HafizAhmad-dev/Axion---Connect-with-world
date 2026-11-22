
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  environment: import.meta.env.MODE,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  // Performance monitoring
  tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,

  // Only propagate tracing to trusted API URLs
 tracePropagationTargets: [
  "localhost",
  /^https:\/\/axion-connect-with-world-production\.up\.railway\.app\/api/,
],

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
