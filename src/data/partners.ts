export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  description: string;
  descriptionNo: string;
  descriptionDe: string;
  descriptionSv: string;
  accentColor: string;
  active: boolean;
  productIds: string[];
  collectionHandle?: string;
}

export const partners: Partner[] = [
  // Empty — populate when first partner signs.
  // {
  //   id: 'example-festival',
  //   name: 'Example Blues Festival',
  //   logoUrl: '/images/partners/example-festival.png',
  //   website: 'https://example.com',
  //   description: "Norway's premier blues festival",
  //   descriptionNo: 'Norges fremste bluesfestival',
  //   descriptionDe: 'Norwegens führendes Blues-Festival',
  //   descriptionSv: 'Norges främsta bluesfestival',
  //   accentColor: '#c9a84c',
  //   active: true,
  //   productIds: ['slowblues-oversized-hoodie', 'slowblues-organic-cotton-apron'],
  //   collectionHandle: 'partner-editions',
  // },
];

export const activePartners = (): Partner[] => partners.filter((p) => p.active);

export const partnerForProduct = (slug: string): Partner | null => {
  return activePartners().find((p) => p.productIds.includes(slug)) ?? null;
};

export const partnerDescription = (
  p: Partner,
  lang: "en" | "no" | "de" | "sv" | string,
): string => {
  switch (lang) {
    case "no":
      return p.descriptionNo;
    case "de":
      return p.descriptionDe;
    case "sv":
      return p.descriptionSv;
    default:
      return p.description;
  }
};
