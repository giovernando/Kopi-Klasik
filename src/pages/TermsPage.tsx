import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
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
          <h1 className="text-lg font-semibold font-display">Syarat & Ketentuan</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm space-y-6"
        >
          <div>
            <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-3 font-display">
              1. Ketentuan Umum
            </h2>
            <p className="text-[hsl(355,73%,21%/0.7)] leading-relaxed">
              Dengan menggunakan aplikasi Kopi Klasik, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui sebagian atau seluruh ketentuan, harap tidak menggunakan layanan kami.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-3 font-display">
              2. Penggunaan Layanan
            </h2>
            <p className="text-[hsl(355,73%,21%/0.7)] leading-relaxed mb-2">
              Anda setuju untuk menggunakan layanan Kopi Klasik hanya untuk tujuan yang sah dan sesuai dengan ketentuan ini. Dilarang menggunakan layanan untuk:
            </p>
            <ul className="text-[hsl(355,73%,21%/0.7)] space-y-1 ml-4">
              <li>• Melanggar hukum atau peraturan yang berlaku</li>
              <li>• Mengirim spam atau konten yang tidak diinginkan</li>
              <li>• Mengganggu pengguna lain</li>
              <li>• Memalsukan identitas atau memberikan informasi palsu</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-3 font-display">
              3. Pemesanan dan Pembayaran
            </h2>
            <p className="text-[hsl(355,73%,21%/0.7)] leading-relaxed">
              Semua pesanan tunduk pada ketersediaan. Harga yang ditampilkan sudah termasuk pajak. Pembayaran harus dilakukan sebelum pesanan diproses. Kami berhak membatalkan pesanan jika terjadi kesalahan harga atau ketersediaan produk.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-3 font-display">
              4. Pengiriman
            </h2>
            <p className="text-[hsl(355,73%,21%/0.7)] leading-relaxed">
              Waktu pengiriman adalah estimasi dan dapat berubah tergantung kondisi. Kopi Klasik tidak bertanggung jawab atas keterlambatan yang disebabkan oleh faktor di luar kendali kami seperti cuaca buruk atau kondisi lalu lintas.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-3 font-display">
              5. Kebijakan Privasi
            </h2>
            <p className="text-[hsl(355,73%,21%/0.7)] leading-relaxed">
              Data pribadi Anda akan dilindungi sesuai dengan Kebijakan Privasi kami. Kami tidak akan membagikan informasi Anda kepada pihak ketiga tanpa persetujuan, kecuali diwajibkan oleh hukum.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-3 font-display">
              6. Perubahan Ketentuan
            </h2>
            <p className="text-[hsl(355,73%,21%/0.7)] leading-relaxed">
              Kopi Klasik berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan efektif segera setelah diposting di aplikasi. Penggunaan berkelanjutan atas layanan kami setelah perubahan merupakan penerimaan Anda terhadap ketentuan yang telah diubah.
            </p>
          </div>

          <div className="border-t border-[hsl(43,20%,90%)] pt-4 mt-4">
            <p className="text-sm text-[hsl(355,73%,21%/0.5)]">
              Terakhir diperbarui: Maret 2025
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
