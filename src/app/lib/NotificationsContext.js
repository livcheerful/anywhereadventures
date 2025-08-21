// NotificationsContext.js
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("notifications");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  // Whenever notifications change, write to localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((type, id, meta) => {
    setNotifications((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      if (idx !== -1) {
        // replace existing notification
        const updated = [...prev];
        updated[idx] = { type, id, meta };
        return updated;
      }
      return [...prev, { type, id, meta }];
    });
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  });

  const removeAllNotificationsOfType = useCallback((typeToRemove) => {
    setNotifications((prev) =>
      prev.filter((item) => item.type !== typeToRemove)
    );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        removeAllNotificationsOfType,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
