// A small, hand-curated calendar of verified blues-history dates, used by
// the ticker batch builder (sync-worker/src/tickerBatch.ts) for the
// "ON THIS DAY" item kind. Every entry here has an exact day confirmed
// against multiple independent sources -- this is deliberately short
// rather than padded with approximate or disputed dates. Add to it only
// with a real, checkable day; a year alone ("1947", "sometime in 1936")
// is not enough to trigger a day-of-year match.
//
// NOT included, on purpose: W.C. Handy's Tutwiler train-station encounter.
// Every source agrees on "1903" (some hedge "circa 1903-1904"); none gives
// a specific day, so there is nothing to anchor a day-of-year trigger to.
export type OnThisDayEntry = {
  id: string;
  month: number; // 1-12
  day: number;
  href: string;
  text: Record<"en" | "no" | "sv" | "de" | "pl", string>;
};

export const ON_THIS_DAY: OnThisDayEntry[] = [
  {
    id: "aristocrat-founded-1947",
    month: 4,
    day: 10,
    href: "/history",
    text: {
      en: "1947: Charles and Evelyn Aron found Aristocrat Records in Chicago — the label Leonard Chess would later take over and rename.",
      no: "1947: Charles og Evelyn Aron starter Aristocrat Records i Chicago — plateselskapet Leonard Chess senere skulle overta og døpe om.",
      sv: "1947: Charles och Evelyn Aron startar Aristocrat Records i Chicago — skivbolaget Leonard Chess senare skulle ta över och döpa om.",
      de: "1947: Charles und Evelyn Aron gründen Aristocrat Records in Chicago — das Label, das Leonard Chess später übernehmen und umbenennen würde.",
      pl: "1947: Charles i Evelyn Aron zakładają w Chicago wytwórnię Aristocrat Records — tę samą, którą później przejmie i przemianuje Leonard Chess.",
    },
  },
  {
    id: "chess-renamed-1950",
    month: 6,
    day: 3,
    href: "/history",
    text: {
      en: "1950: Leonard and Phil Chess rename Aristocrat to Chess Records — the label that would define Chicago blues.",
      no: "1950: Leonard og Phil Chess døper om Aristocrat til Chess Records — plateselskapet som skulle definere Chicago-bluesen.",
      sv: "1950: Leonard och Phil Chess döper om Aristocrat till Chess Records — skivbolaget som skulle definiera Chicago-bluesen.",
      de: "1950: Leonard und Phil Chess benennen Aristocrat in Chess Records um — das Label, das den Chicago-Blues prägen sollte.",
      pl: "1950: Leonard i Phil Chess zmieniają nazwę Aristocrat na Chess Records — wytwórnię, która zdefiniuje brzmienie Chicago blues.",
    },
  },
  {
    id: "crazy-blues-1920",
    month: 8,
    day: 10,
    href: "/history",
    text: {
      en: "1920: Mamie Smith records \"Crazy Blues\" for Okeh — the first blues record by an African-American artist.",
      no: "1920: Mamie Smith spiller inn \"Crazy Blues\" for Okeh — den første blues-innspillingen av en afroamerikansk artist.",
      sv: "1920: Mamie Smith spelar in \"Crazy Blues\" för Okeh — den första blues-inspelningen av en afroamerikansk artist.",
      de: "1920: Mamie Smith nimmt \"Crazy Blues\" für Okeh auf — die erste Blues-Aufnahme einer afroamerikanischen Künstlerin.",
      pl: "1920: Mamie Smith nagrywa \"Crazy Blues\" dla Okeh — pierwsze nagranie bluesowe afroamerykańskiej artystki.",
    },
  },
  {
    id: "robert-johnson-san-antonio-1936",
    month: 11,
    day: 23,
    href: "/artists/robert-johnson",
    text: {
      en: "1936: Robert Johnson cuts his first-ever recordings at the Gunter Hotel in San Antonio.",
      no: "1936: Robert Johnson spiller inn sine aller første plater på Gunter Hotel i San Antonio.",
      sv: "1936: Robert Johnson spelar in sina allra första skivor på Gunter Hotel i San Antonio.",
      de: "1936: Robert Johnson nimmt im Gunter Hotel in San Antonio seine allerersten Platten auf.",
      pl: "1936: Robert Johnson nagrywa swoje pierwsze płyty w hotelu Gunter w San Antonio.",
    },
  },
  {
    id: "robert-johnson-dallas-1937",
    month: 6,
    day: 20,
    href: "/artists/robert-johnson",
    text: {
      en: "1937: Robert Johnson's final session, in a Dallas office building — the last time he'd ever record.",
      no: "1937: Robert Johnsons siste innspillingssesjon, i en kontorbygning i Dallas — siste gang han noensinne spilte inn.",
      sv: "1937: Robert Johnsons sista inspelningssession, i en kontorsbyggnad i Dallas — sista gången han någonsin spelade in.",
      de: "1937: Robert Johnsons letzte Aufnahmesession, in einem Bürogebäude in Dallas — das letzte Mal, dass er je aufnahm.",
      pl: "1937: Ostatnia sesja nagraniowa Roberta Johnsona, w biurowcu w Dallas — po raz ostatni w życiu nagrywał.",
    },
  },
];
