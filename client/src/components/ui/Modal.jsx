import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const stack = []; // open modals, so Esc only closes the top-most one

export default function Modal({
  onClose,
  label,
  size = "max-w-2xl",
  zIndex = "z-50",
  children,
}) {
  const idRef = useRef({});
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const id = idRef.current;
    const previouslyFocused = document.activeElement;

    stack.push(id);
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape" && stack[stack.length - 1] === id) {
        e.preventDefault();
        closeRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      stack.splice(stack.indexOf(id), 1);
      if (stack.length === 0) document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, []);

  return createPortal(
    <div
      className={`fixed inset-0 ${zIndex} grid place-items-center overflow-y-auto bg-canvas/60 p-4 backdrop-blur-sm`}
      onMouseDown={(e) => {
        // mousedown (not click) so dragging a text selection out of the
        // editor never closes it by accident
        if (e.target === e.currentTarget) closeRef.current();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`w-full ${size} animate-pop rounded-2xl border border-white/10 bg-surface shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] motion-reduce:animate-none`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
