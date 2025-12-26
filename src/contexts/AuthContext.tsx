import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { tokenStorage } from '@/utils/token';
import { LoginCredentials, User } from '@/types';
import { handleApiError } from '@/utils/errorHandler';
import { message } from 'antd';

interface AuthContextType {
    user: User | null;
    permissions: string[];
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
            const permissions = tokenStorage.getPermissions();

            if (accessToken && user) {
                // Set user and permissions in cache immediately from localStorage
                queryClient.setQueryData(['user'], user);
                queryClient.setQueryData(['permissions'], permissions);

                // Verify token is still valid by fetching user (silently)
                // Don't block initialization if it fails
                authApi.getCurrentUser()
                    .then((updatedUser) => {
                        tokenStorage.setUser(updatedUser);
                        queryClient.setQueryData(['user'], updatedUser);
                        // If permissions are in user object, update them
                        if (updatedUser.permissions) {
                            const perms = Array.isArray(updatedUser.permissions)
                                ? updatedUser.permissions.map((p: any) =>
                                    typeof p === 'string' ? p : p.code
                                )
                                : [];
                            tokenStorage.setPermissions(perms);
                            queryClient.setQueryData(['permissions'], perms);
                        }
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
            // Extract permissions from response or user object
            const permissions = data.permissions ||
                (Array.isArray(data.user?.permissions)
                    ? data.user.permissions.map((p: any) => typeof p === 'string' ? p : p.code)
                    : []);

            // Store tokens, user, and permissions IMMEDIATELY - this is critical!
            // Backend returns "token" not "accessToken"
            tokenStorage.setAuthData(data.token, data.refreshToken, data.user, permissions);

            // Set in React Query cache
            queryClient.setQueryData(['user'], data.user);
            queryClient.setQueryData(['permissions'], permissions);

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

    // Use locally stored user and permissions (we already set them on login)
    const currentUser = tokenStorage.getUser();
    const currentPermissions = tokenStorage.getPermissions();

    const hasToken = tokenStorage.hasToken();
    const isAuthenticated = hasToken && !!currentUser && !isInitializing;
    const isLoading = isInitializing;

    const refreshAuth = async () => {
        await refreshTokenMutation.mutateAsync();
    };

    const value: AuthContextType = {
        user: currentUser || null,
        permissions: currentPermissions,
        isAuthenticated,
        isLoading,
        isLoggingIn: loginMutation.isPending,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        refreshAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

