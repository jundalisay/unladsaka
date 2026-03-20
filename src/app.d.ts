// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface Locals {}
    interface PageData {}
    interface PageState {}
    interface Platform {
      env: {
        TURSO_DATABASE_URL: string;
        TURSO_AUTH_TOKEN: string;
        ADMIN_PASSWORD: string;
      };
      context: {
        waitUntil(promise: Promise<unknown>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
