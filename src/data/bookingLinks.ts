// Booking / Contact links for living artists across all databases
// Only includes artists who are alive and active as of 2026
// Deceased artists are deliberately excluded

export interface BookingInfo {
  url: string;
  labelEn: string;
  labelNo: string;
}

export const bookingLinks: Record<string, BookingInfo> = {
  // ==================== AMERICAN ARTISTS ====================
  'buddy-guy': {
    url: 'https://www.buddyguy.net/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'eric-clapton': {
    url: 'https://www.ericclapton.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'joe-bonamassa': {
    url: 'https://jbonamassa.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'kenny-wayne-shepherd': {
    url: 'https://www.kennywayneshepherd.net/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'christone-kingfish-ingram': {
    url: 'https://www.christonekingfishingram.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'billy-gibbons': {
    url: 'https://billygibbons.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'shemekia-copeland': {
    url: 'https://www.shemekiacopeland.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },

  // ==================== CANADIAN ARTISTS ====================
  'sue-foley': {
    url: 'https://www.suefoley.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'colin-james': {
    url: 'https://www.colinjames.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'steve-strongman': {
    url: 'https://www.stevestrongman.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },

  // ==================== BRITISH ARTISTS ====================
  'joanne-shaw-taylor': {
    url: 'https://www.joanneshawtaylor.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'paul-lamb': {
    url: 'https://www.facebook.com/PaulLambKingSnakes/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },

  // ==================== EUROPEAN ARTISTS ====================
  'inga-rumpf': {
    url: 'https://www.ingarumpf.de/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'paul-personne': {
    url: 'https://www.facebook.com/paulpersonneofficiel/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'bill-deraime': {
    url: 'https://www.facebook.com/BillDeraimeOfficiel/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'irek-dudek': {
    url: 'https://www.facebook.com/IrekDudekOfficial/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },

  // ==================== SCANDINAVIAN – NORWAY ====================
  'rita-engedalen': {
    url: 'https://www.facebook.com/rita.engedalen',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'vidar-busk': {
    url: 'https://www.facebook.com/vidarbusk',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'billy-t-band': {
    url: 'https://www.facebook.com/billytband/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'amund-maarud': {
    url: 'https://www.amundmaarud.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'tor-einar-daumann-jacobsen': {
    url: 'https://www.facebook.com/DaumannBand/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'johnny-augland': {
    url: 'https://www.facebook.com/johnny.augland',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'kurt-slevigen': {
    url: 'https://www.facebook.com/kurt.slevigen',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'joakim-tinderholt': {
    url: 'https://joakimtinderholt.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'reidar-larsen': {
    url: 'https://open.spotify.com/artist/4p9iYU5RkxWxWPd8JTJiio',
    labelEn: 'Contact via Spotify',
    labelNo: 'Kontakt via Spotify',
  },
  'hard-luck-blues-band': {
    url: 'https://www.facebook.com/hardluckbluesband/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'jolly-jumper-big-moe': {
    url: 'https://www.facebook.com/JollyJumperBigMoe/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'joe-rusi': {
    url: 'https://www.facebook.com/profile.php?id=1271197916',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'spoonful-of-blues': {
    url: 'https://www.facebook.com/profile.php?id=100048109427107',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },

  // ==================== SCANDINAVIAN – SWEDEN ====================
  'bror-gunnar-jansson': {
    url: 'https://www.facebook.com/brorgunnarjansson/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'elin-larsson': {
    url: 'https://www.facebook.com/ElinLarssonMusic/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'sven-zetterberg': {
    url: 'https://www.facebook.com/svenzetterbergbluesband/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },

  // ==================== SCANDINAVIAN – DENMARK ====================
  'thorbjorn-risager': {
    url: 'https://www.risager.info/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'big-creek-slim': {
    url: 'https://www.facebook.com/bigcreekslim/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  // ==================== SCANDINAVIAN – FINLAND ====================
  'erja-lyytinen': {
    url: 'https://www.erjalyytinen.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'wentus-blues-band': {
    url: 'https://www.facebook.com/wentusbluesband/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'ben-granfelt': {
    url: 'https://www.bengranfelt.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'ina-forsman': {
    url: 'https://www.inaforsman.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },

  // ==================== AFRICAN ARTISTS ====================
  'vusi-mahlasela': {
    url: 'https://www.facebook.com/vusimahlaselamusic/',
    labelEn: 'Booking via Facebook',
    labelNo: 'Booking via Facebook',
  },
  'dan-patlansky': {
    url: 'https://danpatlansky.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },

  // ==================== AUSTRALIAN ARTISTS ====================
  'kevin-borich': {
    url: 'https://kevinborich.com.au/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'jeff-lang': {
    url: 'https://www.jefflang.com.au/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'ash-grunwald': {
    url: 'https://www.ashgrunwald.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'lloyd-spiegel': {
    url: 'https://www.lloydspiegel.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'mavis-staples': {
    url: 'https://www.mavisstaples.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'delbert-mcclinton': {
    url: 'https://www.delbertmcclinton.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'walter-trout': {
    url: 'https://www.waltertrout.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'samantha-fish': {
    url: 'https://www.samanthafish.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
  'tab-benoit': {
    url: 'https://www.tabbenoit.com/',
    labelEn: 'Booking / Contact',
    labelNo: 'Booking / Kontakt',
  },
};

/**
 * Get booking info for an artist by their ID.
 * Returns undefined for deceased artists or artists without booking links.
 */
export const getBookingLink = (artistId: string): BookingInfo | undefined => {
  return bookingLinks[artistId];
};
