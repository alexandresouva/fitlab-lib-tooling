/**
 * Verifies if a user has a specific permission.
 * Framework-agnostic utility for @fitlab/tooling.
 */
export function hasPermission(
  userPermissions: string[] | undefined,
  requiredPermission: string
): boolean {
  if (!userPermissions) return false;

  return userPermissions.some(perm => {
    // 1. Exact match (e.g., "workout:read" === "workout:read")
    if (perm === requiredPermission) return true;

    // 2. Superuser wildcard (e.g., "*")
    if (perm === '*') return true;

    // 3. Scoped wildcard (e.g., "workout:*" matches "workout:delete")
    if (perm.endsWith(':*')) {
      const prefix = perm.slice(0, -2);
      return requiredPermission.startsWith(prefix + ':');
    }

    return false;
  });
}

// Basic health check export
export const TOOLING_VERSION = '1.0.0';
