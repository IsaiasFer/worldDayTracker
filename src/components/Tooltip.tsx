"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: React.ReactNode;
  x: number;
  y: number;
  visible: boolean;
}

export default function Tooltip({ content, x, y, visible }: TooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: "absolute",
            top: y,
            left: x,
            transform: "translate(-50%, -120%)",
            background: "rgba(0, 0, 0, 0.8)",
            border: "1px solid var(--neon-cyan)",
            boxShadow: "0 0 15px rgba(0, 243, 255, 0.2)",
            padding: "8px 12px",
            borderRadius: "8px",
            pointerEvents: "none",
            zIndex: 1000,
            backdropFilter: "blur(4px)"
          }}
        >
          {content}
          {/* Triangle Pointer */}
          <div style={{
            position: "absolute",
            bottom: "-6px",
            left: "50%",
            marginLeft: "-6px",
            width: "0",
            height: "0",
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid var(--neon-cyan)"
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
