import type { Metadata, Viewport } from "next";
import "./gold.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0a08",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://edwardjuma.dev"),
  title: {
    default: "Edward Juma — IT Support, Networking & Full Stack Development",
    template: "%s — Edward Juma",
  },
  description:
    "Edward Juma is an IT Support Technician, Network Engineer and Full Stack Developer in Nairobi, building secure digital solutions and reliable infrastructure.",
  keywords: [
    "Edward Juma",
    "IT Support Technician Kenya",
    "Network Engineer Nairobi",
    "Full Stack Developer",
    "Aspiring Cybersecurity Engineer",
    "Nairobi Kenya",
    "Kodovoz Labs",
    "LumaBridge",
  ],
  authors: [{ name: "Edward Juma", url: "https://edwardjuma.dev" }],
  creator: "Edward Juma",
  alternates: { canonical: "https://edwardjuma.dev" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://edwardjuma.dev",
    siteName: "Edward Juma",
    title: "Edward Juma — IT Support, Networks & Software",
    description:
      "Secure digital solutions, modern applications and reliable IT infrastructure.",
    images: [
      { url: "/profile.png", width: 1200, height: 630, alt: "Edward Juma — IT Support and Software Developer" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edward Juma — IT Support & Cybersecurity",
    description: "IT Support · Networking · Full Stack Development",
    images: ["/profile.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Edward Juma",
  url: "https://edwardjuma.dev",
  image: "https://edwardjuma.dev/profile.png",
  jobTitle: "IT Support Technician, Network Engineer and Full Stack Developer",
  description: "Edward Juma builds secure digital solutions, modern web applications and reliable IT infrastructure.",
  email: "ejuma670@gmail.com",
  telephone: "+254799514830",
  address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
  alumniOf: { "@type": "EducationalOrganization", name: "Diploma in Computer Science" },
  sameAs: ["https://linkedin.com/in/edward-juma", "https://github.com/Edward-Juma"],
  knowsAbout: ["IT Support","Computer Networking","Full Stack Development","Active Directory","Linux","Cybersecurity"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}
