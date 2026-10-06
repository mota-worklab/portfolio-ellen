import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { gsap } from "../../lib/gsap";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useScrollLock } from "../SmoothScroll/SmoothScroll";

interface OverlayProps {
  label: string;
  onClose: () => void;
  children: (close: () => void) => ReactNode;
}

/**
 * Camada fullscreen (lightbox / página de projeto).
 * Entra com um "wipe" vertical, como um corte com transição, e sai pelo mesmo caminho.
 */
export function Overlay({ label, onClose, children }: OverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const reduced = useReducedMotion();

  useScrollLock(true);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.from(rootRef.current, { opacity: 0, duration: 0.2, ease: "none" });
        return;
      }
      gsap
        .timeline()
        .fromTo(rootRef.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "expo.inOut" })
        .from("[data-overlay-content]", { y: 40, opacity: 0, duration: 0.8 }, "-=0.3");
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    gsap.to(rootRef.current, {
      ...(reduced ? { opacity: 0, duration: 0.2 } : { clipPath: "inset(0 0 100% 0)", duration: 0.7 }),
      ease: "expo.inOut",
      onComplete: onClose,
    });
  }, [onClose, reduced]);

  useFocusTrap(rootRef, true, close);

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-ink"
      data-lenis-prevent
    >
      <div data-overlay-content>{children(close)}</div>
    </div>,
    document.body,
  );
}
