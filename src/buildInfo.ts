export const BUILD_INFO = {
  timestamp: new Date().toISOString(),
  version: Date.now().toString(),
  commit: (import.meta as any).env.VERCEL_GIT_COMMIT_SHA || 'local'
};
