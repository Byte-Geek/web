"use client";

import { Link, usePathname } from "@/i18n/navigation";

export function Wordmark({ label }: { label: string }) {
  const pathname = usePathname();
  // Already on the home page: a link to itself does nothing, so go back to the top instead.
  const scrollTopOnHome = (event: React.MouseEvent) => {
    if (pathname !== "/") return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <Link className="flex flex-none items-center gap-2.5 no-underline" href="/" aria-label={label} onClick={scrollTopOnHome}>
      <span className="wordmark-slash" aria-hidden="true">
        {"//"}
      </span>
      <b className="text-base font-extrabold tracking-wide sm:text-[19px]">INTELLECT</b>
    </Link>
  );
}
