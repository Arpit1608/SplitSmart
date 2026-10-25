import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { analyticsApi, groupsApi, personalApi, settlementsApi } from '../api';
import { currentMonth } from '../utils/format';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

/** Holds everything the logged-in user can see. Call refresh() after any change. */
export function DataProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const [groups, setGroups] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [month, setMonth] = useState(currentMonth());
  const [loaded, setLoaded] = useState(false);

  const loadCore = useCallback(async () => {
    try {
      const [g, s, p] = await Promise.all([groupsApi.list(), settlementsApi.list(), personalApi.list()]);
      setGroups(g.groups);
      setSettlements(s.settlements);
      setPersonal(p.expenses);
    } catch (e) {
      toast(e.message, true);
    } finally {
      setLoaded(true);
    }
  }, [toast]);

  const loadAnalytics = useCallback(async () => {
    try {
      setAnalytics(await analyticsApi.month(month));
    } catch (e) {
      toast(e.message, true);
    }
  }, [month, toast]);

  useEffect(() => {
    if (user) loadCore();
  }, [user, loadCore]);

  useEffect(() => {
    if (user) loadAnalytics();
  }, [user, loadAnalytics]);

  const refresh = useCallback(() => Promise.all([loadCore(), loadAnalytics()]), [loadCore, loadAnalytics]);

  // Look up any user that shares a group with me (used to show names next to payers etc.)
  const userById = useCallback(
    (id) =>
      groups.flatMap((g) => g.members).find((u) => u.id === id) || { id, name: 'Unknown', username: 'unknown' },
    [groups]
  );

  const value = { groups, settlements, personal, analytics, month, setMonth, loaded, refresh, userById };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
