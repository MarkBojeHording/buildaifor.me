import { BUILD_INFO } from '@/buildInfo';

export const getDeploymentInfo = () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: (import.meta as any).env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE,
    buildTime: BUILD_INFO.timestamp,
  };
};
