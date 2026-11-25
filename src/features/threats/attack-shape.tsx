import type { AttackType } from "./attack-types";

export function AttackShape({ type }: { type: AttackType }) {
  return <i className={`shape shape-${type}`} aria-hidden="true" />;
}
