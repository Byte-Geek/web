import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, usePathname, useRouter, getPathname, redirect } = createNavigation(routing);

export type Href = Parameters<typeof getPathname>[0]["href"];
