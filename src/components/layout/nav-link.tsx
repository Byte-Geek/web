"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";

export function NavLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const target = typeof href === "string" ? href : String(href.pathname);
  const isActive = pathname === target || (target !== "/" && pathname.startsWith(`${target}/`));
  return <Link href={href} aria-current={isActive ? "page" : undefined} {...rest} />;
}
