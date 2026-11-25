export const ATTACK_TYPES = ["scan", "malware", "botnet", "ddos"] as const;
export type AttackType = (typeof ATTACK_TYPES)[number];
export type TypeFilter = Record<AttackType, boolean>;

export const ALL_TYPES: TypeFilter = { scan: true, malware: true, botnet: true, ddos: true };
