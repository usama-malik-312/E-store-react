import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { tokenStorage } from '@/utils/token';
import { LoginCredentials, User } from '@/types';
import { handleApiError } from '@/utils/errorHandler';
import { message } from 'antd';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoggingIn: boolean;
    login: (credentials: LoginCredentials) => void;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isInitializing, setIsInitializing] = useState(true);
    const queryClient = useQueryClient();

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = tokenStorage.getAccessToken();
            const user = tokenStorage.getUser();

            if (accessToken && user) {
                // Set user in cache immediately from localStorage
                queryClient.setQueryData(['user'], user);

                // Verify token is still valid by fetching user (silently)
                // Don't block initialization if it fails
                authApi.getCurrentUser()
                    .then((updatedUser) => {
                        tokenStorage.setUser(updatedUser);
                        queryClient.setQueryData(['user'], updatedUser);
                    })
                    .catch(() => {
                        // Token might be expired, but don't clear it yet
                        // Let the axios interceptor handle refresh
                    });
            }

            setIsInitializing(false);
        };

        initializeAuth();
    }, [queryClient]);

    // Refresh token mutation
    const refreshTokenMutation = useMutation({
        mutationFn: authApi.refreshToken,
        onSuccess: (data) => {
            // Update tokens - backend might return "token" or "accessToken"
            const newToken = data.accessToken || (data as any).token;
            tokenStorage.updateTokens(newToken, data.refreshToken);
        },
        onError: () => {
            tokenStorage.remove();
            queryClient.clear();
            // Navigation will be handled by ProtectedRoute
            window.location.href = '/login';
        },
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            // Store tokens and user IMMEDIATELY - this is critical!
            // Backend returns "token" not "accessToken"
            tokenStorage.setAuthData(data.token, data.refreshToken, data.user);

            // Set in React Query cache
            queryClient.setQueryData(['user'], data.user);

            message.success('Login successful!');

            // Navigation will be handled by the Login component after state updates
        },
        onError: handleApiError,
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            tokenStorage.remove();
            queryClient.clear();
            window.location.href = '/login';
        },
        onError: () => {
            // Even if logout fails on backend, clear local state
            tokenStorage.remove();
            queryClient.clear();
            window.location.href = '/login';
        },
    });

    // Get current user query
    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['user'],
        queryFn: authApi.getCurrentUser,
        enabled: tokenStorage.hasToken() && !isInitializing,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Get user from localStorage as fallback
    const storedUser = tokenStorage.getUser();
    const currentUser = user || storedUser;

    const hasToken = tokenStorage.hasToken();
    const isAuthenticated = hasToken && !!currentUser && !isInitializing;
    const isLoading = isInitializing || (hasToken && isLoadingUser && !storedUser);

    const refreshAuth = async () => {
        await refreshTokenMutation.mutateAsync();
    };

    const value: AuthContextType = {
        user: currentUser || null,
        isAuthenticated,
        isLoading,
        isLoggingIn: loginMutation.isPending,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        refreshAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

