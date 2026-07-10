export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function isPermissionAllowed(
  userPermissions: string[],
  requiredPermission?: string,
): boolean {
  if (!requiredPermission) return true;
  return userPermissions.includes(requiredPermission);
}
