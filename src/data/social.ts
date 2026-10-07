export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export const socialLinks: SocialLink[] = [
  { id: "whatsapp", label: "WhatsApp", url: "https://wa.me/5575991811094" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/ellendumov?stkn=M2d4Z3l1OW8zcGVn" },
  { id: "behance", label: "Behance", url: "https://www.behance.net/ellendumont" },
];

export const visibleSocialLinks = socialLinks;
