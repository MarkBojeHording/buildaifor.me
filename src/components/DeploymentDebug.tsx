import React from 'react';
import { BUILD_INFO } from '@/buildInfo';

const DeploymentDebug: React.FC = () => {
  const envInfo = {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    baseUrl: import.meta.env.BASE_URL
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      borderRadius: '5px',
      zIndex: 9999
    }}>
      <div>Build: {BUILD_INFO.timestamp}</div>
      <div>Version: {BUILD_INFO.version}</div>
      <div>Mode: {envInfo.mode}</div>
      <div>Commit: {BUILD_INFO.commit}</div>
    </div>
  );
};

export default DeploymentDebug;
