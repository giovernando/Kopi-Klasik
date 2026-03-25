import { motion } from 'framer-motion';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const faqs = [
  {
    question: "Bagaimana cara memesan kopi?",
    answer: "Anda dapat memesan kopi melalui aplikasi Kopi Klasik dengan memilih menu yang diinginkan, menambahkannya ke keranjang, dan melakukan checkout. Pesanan Anda akan segera diproses oleh tim kami."
  },
  {
    question: "Apakah ada minimum order?",
    answer: "Ya, minimum order untuk delivery adalah Rp 50.000. Untuk pemesanan di bawah nominal tersebut, Anda tetap dapat melakukan pickup langsung di outlet kami."
  },
  {
    question: "Berapa lama waktu pengiriman?",
    answer: "Waktu pengiriman biasanya 15-30 menit tergantung lokasi dan kondisi lalu lintas. Anda dapat melacak pesanan secara real-time melalui aplikasi."
  },
  {
    question: "Apakah bisa mengubah pesanan setelah checkout?",
    answer: "Pesanan yang sudah dikonfirmasi tidak dapat diubah. Namun, Anda dapat membatalkan pesanan dalam waktu 2 menit setelah checkout jika pesanan belum diproses."
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer: "Kami menerima pembayaran via transfer bank, e-wallet (GoPay, OVO, DANA, LinkAja), kartu kredit/debit, dan tunai saat pickup."
  },
  {
    question: "Bagaimana cara menggunakan voucher?",
    answer: "Masukkan kode voucher Anda di halaman checkout sebelum melakukan pembayaran. Diskon akan otomatis diterapkan jika voucher valid dan memenuhi syarat."
  },
  {
    question: "Apakah ada program loyalty?",
    answer: "Ya! Setiap pembelian Anda akan mendapatkan poin yang dapat dikumpulkan dan ditukarkan dengan diskon atau menu gratis. Cek halaman Offers untuk promo terbaru."
  },
  {
    question: "Bagaimana cara komplain jika ada masalah?",
    answer: "Anda dapat menghubungi customer service kami melalui menu Help & Support di aplikasi, atau langsung email ke hello@kopiklasik.id. Kami akan merespons dalam 24 jam."
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[hsl(43,20%,90%)] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-[hsl(355,73%,21%)] pr-4">{question}</span>
        <ChevronDown 
          className={`h-5 w-5 text-[hsl(355,73%,21%/0.5)] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-[hsl(355,73%,21%/0.7)] leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function FAQPage() {
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
          <h1 className="text-lg font-semibold font-display">FAQ</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-6 font-display">
            Pertanyaan yang Sering Diajukan
          </h2>
          
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-[hsl(355,73%,21%/0.6)] mb-3">
            Masih punya pertanyaan?
          </p>
          <button
            onClick={() => navigate('/help-support')}
            className="text-[hsl(355,73%,21%)] font-medium underline hover:no-underline"
          >
            Hubungi Customer Service
          </button>
        </motion.div>
      </div>
    </div>
  );
}
