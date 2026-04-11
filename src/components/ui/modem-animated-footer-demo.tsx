import { Footer } from './modem-animated-footer'
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  NotepadTextDashed,
} from "lucide-react";

export function ModemAnimatedFooterDemo() {
  const socialLinks = [
    {
      icon: <Twitter className="w-6 h-6" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: <Github className="w-6 h-6" />,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:kopiklasik@example.com",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Terms", href: "/terms" },
  ];

  return (
    <Footer
      brandName="Kopi Klasik"
      brandDescription="Kopi Klasik sejak 2019. Mengutamakan kualitas & rasa dalam setiap cangkir."
      socialLinks={socialLinks}
      navLinks={navLinks}
      creatorName="Developer"
      creatorUrl="https://github.com"
      brandIcon={<NotepadTextDashed className="w-6 h-6 text-background" />}
      className="w-full"
    />
  );
}
