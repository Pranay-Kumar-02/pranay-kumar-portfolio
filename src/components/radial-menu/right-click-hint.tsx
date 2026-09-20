'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'radial-menu-hint-seen';

export function RightClickHint({ dismissed }: { dismissed: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      // Auto-hide after 6s
      setTimeout(() => {
        setVisible(false);
        localStorage.setItem(STORAGE_KEY, '1');
      }, 6000);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Dismiss permanently when user opens the radial menu
  useEffect(() => {
    if (dismissed && visible) {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, '1');
    }
  }, [dismissed, visible]);

  return (
    <div className='hidden md:flex'>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed top-16 left-1/2 z-[50] pointer-events-none"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 shadow-lg">
              <span className="text-sm text-white/70">Right-click anywhere to react</span>
              <span className="text-xs text-white/40">✨</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
