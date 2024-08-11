export type Role = {
  id: string;
  range: [number, number];
};

export function getOsuRole(rank: number, roles: Role[]): Role | undefined {
  return roles.find((role) => rank >= role.range[0] && rank <= role.range[1]);
}
