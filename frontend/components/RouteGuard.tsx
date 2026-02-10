"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/contexts/UserRoleContext";
import { UserRole } from "@/lib/permissions";
import Loading from "@/components/Loading";

interface RouteGuardProps {
  children: React.ReactNode;
  /** If true, this route requires authentication */
  requireAuth?: boolean;
  /** Minimum role required to access this route */
  requiredRole?: UserRole;
  /** If true, authenticated users cannot access this route (e.g., login page) */
  authOnly?: boolean;
  /** Custom redirect path for unauthorized access */
  redirectTo?: string;
  /** Fallback component while checking auth state */
  fallback?: React.ReactNode;
}

/**
 * RouteGuard component that enforces authentication and role-based access control
 * at the component level. Redirects users based on their auth state and permissions.
 */
export default function RouteGuard({
  children,
  requireAuth = false,
  requiredRole,
  authOnly = false,
  redirectTo,
  fallback,
}: RouteGuardProps) {
  const { isAuthenticated, role } = useUserRole();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulate auth state resolution (in real app, this would check tokens, etc.)
    const timer = setTimeout(() => setIsChecking(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isChecking) return;

    // Auth-only routes (login, register) - redirect authenticated users
    if (authOnly && isAuthenticated) {
      router.push(redirectTo || "/dashboard");
      return;
    }

    // Protected routes - require authentication
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || "/login");
      return;
    }

    // Role-based access control
    if (requiredRole && isAuthenticated) {
      const roleHierarchy: Record<UserRole, number> = {
        viewer: 1,
        editor: 2,
        admin: 3,
      };

      if (roleHierarchy[role] < roleHierarchy[requiredRole]) {
        router.push(redirectTo || "/dashboard");
        return;
      }
    }
  }, [isAuthenticated, role, requireAuth, requiredRole, authOnly, redirectTo, router, isChecking]);

  // Show loading state while checking auth
  if (isChecking) {
    return fallback || <Loading />;
  }

  // If auth-only route and user is authenticated, don't render (will redirect)
  if (authOnly && isAuthenticated) {
    return fallback || <Loading />;
  }

  // If protected route and user is not authenticated, don't render (will redirect)
  if (requireAuth && !isAuthenticated) {
    return fallback || <Loading />;
  }

  // If role check fails, don't render (will redirect)
  if (requiredRole && isAuthenticated) {
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      editor: 2,
      admin: 3,
    };

    if (roleHierarchy[role] < roleHierarchy[requiredRole]) {
      return fallback || <Loading />;
    }
  }

  // All checks passed, render the protected content
  return <>{children}</>;
}
