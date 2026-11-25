import type { SVGProps } from "react";
import { ICONS, type IconName } from "./icon-set";

const DEFAULT_VIEWBOX = "0 0 24 24";
const STROKE = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function IconSprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      {Object.entries(ICONS).map(([name, icon]) => {
        const viewBox = "viewBox" in icon ? icon.viewBox : DEFAULT_VIEWBOX;
        const paint = "filled" in icon ? { fill: "currentColor" } : { ...STROKE, strokeWidth: viewBox === DEFAULT_VIEWBOX ? 1.6 : 1.8 };
        return <symbol key={name} id={`i-${name}`} viewBox={viewBox} {...paint} dangerouslySetInnerHTML={{ __html: icon.markup }} />;
      })}
    </svg>
  );
}

const isIconName = (name: string): name is IconName => name in ICONS;

type IconProps = { name?: string | null } & Omit<SVGProps<SVGSVGElement>, "name">;

export function Icon({ name, className = "icon", ...rest }: IconProps) {
  const resolved = name && isIconName(name) ? name : "shield";
  return (
    <svg className={className} aria-hidden="true" focusable="false" {...rest}>
      <use href={`#i-${resolved}`} />
    </svg>
  );
}

export function IconBox({ name }: { name?: string | null }) {
  return (
    <span className="icon-box">
      <Icon name={name} />
    </span>
  );
}
