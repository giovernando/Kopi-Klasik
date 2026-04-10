import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
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
          <h1 className="text-lg font-semibold font-display">Hubungi Kami</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Contact Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-4 font-display">
              Informasi Kontak
            </h2>
            
            <div className="space-y-4">
              <a 
                href="mailto:hello@kopiklasik.id" 
                className="flex items-center gap-3 text-[hsl(355,73%,21%/0.8)] hover:text-[hsl(355,73%,21%)]"
              >
                <div className="w-10 h-10 rounded-full bg-[hsl(43,47%,93%)] flex items-center justify-center">
                  <Mail className="h-5 w-5 text-[hsl(355,73%,21%)]" />
                </div>
                <span>hello@kopiklasik.id</span>
              </a>
              
              <a 
                href="tel:+6281234567890" 
                className="flex items-center gap-3 text-[hsl(355,73%,21%/0.8)] hover:text-[hsl(355,73%,21%)]"
              >
                <div className="w-10 h-10 rounded-full bg-[hsl(43,47%,93%)] flex items-center justify-center">
                  <Phone className="h-5 w-5 text-[hsl(355,73%,21%)]" />
                </div>
                <span>+62 812-3456-7890</span>
              </a>
              
              <div className="flex items-start gap-3 text-[hsl(355,73%,21%/0.8)]">
                <div className="w-10 h-10 rounded-full bg-[hsl(43,47%,93%)] flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-[hsl(355,73%,21%)]" />
                </div>
                <span>Jl. Kopi No. 19, Jakarta Selatan, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-4 font-display">
              Media Sosial
            </h2>
            
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/kopiklasik" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(355,73%,21%)] to-[hsl(355,65%,30%)] flex items-center justify-center text-[hsl(50,75%,76%)] hover:scale-105 transition-transform"
              >
                <Instagram className="h-6 w-6" />
              </a>
              
              <a 
                href="https://facebook.com/kopiklasik" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(355,73%,21%)] to-[hsl(355,65%,30%)] flex items-center justify-center text-[hsl(50,75%,76%)] hover:scale-105 transition-transform"
              >
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[hsl(355,73%,21%)] mb-4 font-display">
              Jam Operasional
            </h2>
            
            <div className="space-y-2 text-[hsl(355,73%,21%/0.8)]">
              <div className="flex justify-between">
                <span>Senin - Jumat</span>
                <span className="font-medium">07:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu - Minggu</span>
                <span className="font-medium">08:00 - 23:00</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
