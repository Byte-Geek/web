"use client";

import { type RefObject, useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

export function useDismiss(
  isOpen: boolean,
  close: () => void,
  { container, trigger }: { container: RefObject<HTMLElement | null>; trigger: RefObject<HTMLElement | null> },
) {
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState(pathname);

  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    close();
  }

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      trigger.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!container.current?.contains(target) && !trigger.current?.contains(target)) close();
    };
    // Close on any link click, also when the link points to the page we are already on.
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element).closest("a")) close();
    };
    const panel = container.current;
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    panel?.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      panel?.removeEventListener("click", onClick);
    };
  }, [isOpen, close, container, trigger]);
}
