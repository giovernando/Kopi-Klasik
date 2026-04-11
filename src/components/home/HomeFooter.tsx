import { Footer } from '@/components/ui/modem-animated-footer';
import {
  Instagram,
  Mail,
} from "lucide-react";

export function HomeFooter() {
  return (
    <Footer
      brandName="Kopi Klasik"
      brandDescription="Kopi Klasik sejak 2019. Mengutamakan kualitas & rasa dalam setiap cangkir."
      socialLinks={[
        {
          icon: <Instagram className="w-6 h-6" />,
          href: "https://instagram.com/kopiklasik",
          label: "Instagram",
        },
        {
          icon: <Mail className="w-6 h-6" />,
          href: "mailto:hello@kopiklasik.com",
          label: "Email",
        },
      ]}
      navLinks={[
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Terms", href: "/terms" },
      ]}
      creatorName="vrnan"
      creatorUrl="https://vrnan.vercel.app/"
    />
  );
}
