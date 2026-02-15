export function mustBeRole(role: string, allowed: string[]) {
  return allowed.includes(role);
}
