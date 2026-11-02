import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

export default function ScrollTilt({
  children,
  direction = 1,
  className = "",
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rotateY = useTransform(
    scrollYProgress,
    [0, 1],
    [35 * direction, 8 * direction],
  );
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 4]);

  return (
    <div ref={ref} style={{ perspective: 1400 }} className={className}>
      <motion.div
        style={
          reduce
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
