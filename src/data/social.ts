export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

/**
 * TODO: preencha as URLs reais. Links vazios não aparecem em produção
 * (em desenvolvimento aparecem esmaecidos, para lembrar que faltam).
 * WhatsApp: use "https://wa.me/55DDDNUMERO".
 */
export const socialLinks: SocialLink[] = [
  { id: "whatsapp", label: "WhatsApp", url: "" },
  { id: "instagram", label: "Instagram", url: "" },
  { id: "behance", label: "Behance", url: "" },
  { id: "vimeo", label: "Vimeo", url: "" },
  { id: "linkedin", label: "LinkedIn", url: "" },
];

export const visibleSocialLinks = socialLinks.filter((l) => l.url || import.meta.env.DEV);
