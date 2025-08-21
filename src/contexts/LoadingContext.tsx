import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  loadingStates: LoadingState;
  setLoading: (key: string, value: boolean) => void;
  setMultipleLoading: (states: Record<string, boolean>) => void;
  isLoading: (key: string) => boolean;
  isAnyLoading: () => boolean;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = useCallback((key: string, value: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const setMultipleLoading = useCallback((states: Record<string, boolean>) => {
    setLoadingStates(prev => ({
      ...prev,
      ...states
    }));
  }, []);

  const isLoading = useCallback((key: string): boolean => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  const clearLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  const value: LoadingContextType = {
    loadingStates,
    setLoading,
    setMultipleLoading,
    isLoading,
    isAnyLoading,
    clearLoading,
    clearAllLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider');
  }
  return context;
};

// Hook específico para operações de amigos
export const useFriendsLoading = () => {
  const { setLoading, isLoading } = useLoading();
  
  const setFriendsLoading = useCallback((value: boolean) => {
    setLoading('friends', value);
  }, [setLoading]);

  const setFriendRequestLoading = useCallback((requestId: string, value: boolean) => {
    setLoading(`friend_request_${requestId}`, value);
  }, [setLoading]);

  const setAcceptRequestLoading = useCallback((requestId: string, value: boolean) => {
    setLoading(`accept_request_${requestId}`, value);
  }, [setLoading]);

  const setRejectRequestLoading = useCallback((requestId: string, value: boolean) => {
    setLoading(`reject_request_${requestId}`, value);
  }, [setLoading]);

  return {
    friendsLoading: isLoading('friends'),
    friendRequestLoading: (requestId: string) => isLoading(`friend_request_${requestId}`),
    acceptRequestLoading: (requestId: string) => isLoading(`accept_request_${requestId}`),
    rejectRequestLoading: (requestId: string) => isLoading(`reject_request_${requestId}`),
    setFriendsLoading,
    setFriendRequestLoading,
    setAcceptRequestLoading,
    setRejectRequestLoading
  };
};

// Hook específico para operações de grupos
export const useGroupsLoading = () => {
  const { setLoading, isLoading } = useLoading();
  
  const setGroupsLoading = useCallback((value: boolean) => {
    setLoading('groups', value);
  }, [setLoading]);

  const setGroupActionLoading = useCallback((groupId: string, action: string, value: boolean) => {
    setLoading(`group_${action}_${groupId}`, value);
  }, [setLoading]);

  const setCreateGroupLoading = useCallback((value: boolean) => {
    setLoading('create_group', value);
  }, [setLoading]);

  return {
    groupsLoading: isLoading('groups'),
    groupActionLoading: (groupId: string, action: string) => isLoading(`group_${action}_${groupId}`),
    createGroupLoading: isLoading('create_group'),
    setGroupsLoading,
    setGroupActionLoading,
    setCreateGroupLoading
  };
};

// Hook específico para operações de conquistas
export const useAchievementsLoading = () => {
  const { setLoading, isLoading } = useLoading();
  
  const setAchievementsLoading = useCallback((value: boolean) => {
    setLoading('achievements', value);
  }, [setLoading]);

  const setAchievementActionLoading = useCallback((achievementId: string, action: string, value: boolean) => {
    setLoading(`achievement_${action}_${achievementId}`, value);
  }, [setLoading]);

  return {
    achievementsLoading: isLoading('achievements'),
    achievementActionLoading: (achievementId: string, action: string) => isLoading(`achievement_${action}_${achievementId}`),
    setAchievementsLoading,
    setAchievementActionLoading
  };
};
