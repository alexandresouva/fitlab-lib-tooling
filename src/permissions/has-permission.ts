/**
 * Verifies if a user has a specific permission.
 * Supports exact matches, superuser wildcard (*), and scoped wildcards (resource:*).
 *
 * @param userPermissions Array of permissions the user possesses
 * @param requiredPermission The permission required for the action.
 */
export function hasPermission(
  userPermissions: readonly string[] | undefined,
  requiredPermission: string
): boolean {
  if (!userPermissions) return false;

  return userPermissions.some((perm) => {
    const isSuperUser = perm === '*';
    if (isSuperUser) return true;

    const hasExactPermission = perm === requiredPermission;
    if (hasExactPermission) return true;

    const hasWildcardPermission =
      perm.endsWith(':*') && requiredPermission.startsWith(perm.slice(0, -1));

    if (hasWildcardPermission) return true;

    return false;
  });
}
