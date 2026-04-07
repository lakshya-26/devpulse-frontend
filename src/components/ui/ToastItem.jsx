import { useEffect } from 'react';
import { motion } from 'framer-motion';

const styles = {
  success: 'border-[#238636] bg-[#161b22] text-[#3fb950]',
  error: 'border-[#f85149] bg-[#161b22] text-[#f85149]',
  info: 'border-[#58a6ff] bg-[#161b22] text-[#58a6ff]',
};

export default function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const cls = styles[toast.type] || styles.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      className={`min-w-[200px] rounded-lg border px-4 py-3 text-sm shadow-lg ${cls}`}
      role="status"
    >
      {toast.message}
    </motion.div>
  );
}
