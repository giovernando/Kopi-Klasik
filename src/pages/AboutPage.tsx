import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(43,47%,97%)]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[hsl(355,73%,21%)] text-[hsl(50,75%,76%)] px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[hsl(50,75%,76%/0.2)] rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold font-display">Tentang Kami</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-[hsl(355,73%,21%)] mb-4 font-display">
            Kopi Klasik
          </h2>
          
          <p className="text-[hsl(355,73%,21%/0.7)] leading-relaxed mb-4">
            Kopi Klasik hadir sejak 2019 dengan komitmen untuk menghadirkan kopi artisan berkualitas premium. Setiap biji kopi kami pilih dengan cermat dari petani lokal terbaik di Indonesia.
          </p>
          
          <p className="text-[hsl(355,73%,21%/0.7)] leading-relaxed mb-4">
            Kami percaya bahwa secangkir kopi yang sempurna adalah hasil dari proses yang penuh dedikasi—mulai dari pemilihan biji, penyangraian, hingga penyeduhan oleh barista berpengalaman.
          </p>
          
          <div className="border-t border-[hsl(43,20%,90%)] pt-4 mt-4">
            <h3 className="font-semibold text-[hsl(355,73%,21%)] mb-2">Visi Kami</h3>
            <p className="text-[hsl(355,73%,21%/0.7)] leading-relaxed">
              Menjadi destinasi kopi artisan terdepan yang menghubungkan pecinta kopi dengan pengalaman kopi terbaik Indonesia.
            </p>
          </div>
          
          <div className="border-t border-[hsl(43,20%,90%)] pt-4 mt-4">
            <h3 className="font-semibold text-[hsl(355,73%,21%)] mb-2">Misi Kami</h3>
            <ul className="text-[hsl(355,73%,21%/0.7)] space-y-2">
              <li>• Menyajikan kopi berkualitas premium dengan harga terjangkau</li>
              <li>• Mendukung petani kopi lokal Indonesia</li>
              <li>• Menciptakan pengalaman ngopi yang nyaman dan berkesan</li>
              <li>• Terus berinovasi dalam setiap cangkir yang kami sajikan</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
