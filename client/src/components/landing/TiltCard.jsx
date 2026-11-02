import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

export default function TiltCard({ children, className = "", intensity = 10 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const spring = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(
    useTransform(y, [0, 1], [intensity, -intensity]),
    spring,
  );
  const rotateY = useSpring(
    useTransform(x, [0, 1], [-intensity, intensity]),
    spring,
  );

  if (reduce) return <div className={className}>{children}</div>;

  const handleMove = (e) => {
    if (e.pointerType === "touch") return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileHover={{ scale: 1.02 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
