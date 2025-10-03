// hooks/useGroupsData.ts
import { useState, useEffect } from 'react';
import { GroupsData } from '../types';

export const useGroupsData = () => {
  const [groupsData, setGroupsData] = useState<GroupsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/all_data.json'); // Путь к вашему JSON файлу
        if (!response.ok) {
          throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }
        const data: GroupsData = await response.json();
        setGroupsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { groupsData, loading, error };
};