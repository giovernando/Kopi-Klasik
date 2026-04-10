import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { haptics } from '@/utils/haptics';

export function SearchBar() {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        haptics.light();
        navigate('/search');
      }}
      className="w-full bg-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border border-border/50"
    >
      <Search className="h-5 w-5 text-muted-foreground" />
      <span className="text-muted-foreground text-sm">Search coffee, food, drinks...</span>
    </motion.button>
  );
}
