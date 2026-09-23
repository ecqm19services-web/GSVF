import { useState, useEffect } from 'react';

interface MaintenanceStatus {
  enabled: boolean;
  message: string;
}

const API_URL = '/api/maintenance-mode/';

export function useMaintenance() {
  const [status, setStatus] = useState<MaintenanceStatus>({ enabled: false, message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(API_URL);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch {
        // Silencieux : si l'API ne répond pas, on considère que la maintenance est désactivée
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { ...status, loading };
}
