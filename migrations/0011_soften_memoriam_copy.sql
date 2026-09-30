-- Softens three artist short_* fields that fed the news ticker's IN
-- MEMORIAM lines with overly absolute/precise phrasing ("is still studied
-- note for note", "The godfather of Polish blues" stated as flat fact,
-- "fifty years after Dr. Feelgood" read as an exact figure). Reworded to
-- the site's warm/positive-not-poetic voice, already applied by hand
-- against the live D1 database on 2026-09-30 -- this migration exists so a
-- fresh database built from 0001..0010 ends up in the same corrected state.

UPDATE artists SET
  short_en = 'Passed away December 8, 1981, at around 60. People still put on "Walking By Myself" to hear that harmonica solo.',
  short_no = 'Gikk bort 8. desember 1981, rundt 60 år gammel. Folk setter fortsatt på «Walking By Myself» for å høre den munnspillsoloen.',
  short_sv = 'Gick bort den 8 december 1981, omkring 60 år gammal. Folk sätter fortfarande på "Walking By Myself" för att höra det munspelssolot.',
  short_de = 'Verstarb am 8. Dezember 1981 im Alter von etwa 60 Jahren. Die Leute legen "Walking By Myself" bis heute auf, nur um dieses Mundharmonika-Solo zu hören.',
  short_pl = 'Zmarł 8 grudnia 1981 roku w wieku około 60 lat. Ludzie wciąż wracają do "Walking By Myself", żeby posłuchać tej solówki na harmonijce.'
WHERE slug = 'big-walter-horton';

UPDATE artists SET
  short_en = 'Passed away March 4, 2007, at 63. Many still call him the godfather of Polish blues -- the 1971 album Blues remains a cornerstone of Polish rock.',
  short_no = 'Gikk bort 4. mars 2007, 63 år gammel. Mange kaller ham fortsatt gudfaren for polsk blues — «Blues»-albumet fra 1971 er fortsatt en grunnstein i polsk rock.',
  short_sv = 'Gick bort den 4 mars 2007, 63 år gammal. Många kallar honom fortfarande polska bluesens gudfader — albumet "Blues" från 1971 är fortfarande en hörnsten i polsk rock.',
  short_de = 'Verstarb am 4. März 2007 im Alter von 63 Jahren. Viele nennen ihn bis heute den Paten des polnischen Blues — das Album Blues von 1971 bleibt ein Eckpfeiler des polnischen Rock.',
  short_pl = 'Zmarł 4 marca 2007 roku w wieku 63 lat. Wielu wciąż nazywa go ojcem chrzestnym polskiego bluesa — album "Blues" z 1971 roku pozostaje kamieniem węgielnym polskiego rocka.'
WHERE slug = 'tadeusz-nalepa';

UPDATE artists SET
  short_en = 'Passed away November 21, 2022, at 75 -- still performing weeks before, decades after Dr. Feelgood and a cancer diagnosis he beat against the odds.',
  short_no = 'Gikk bort 21. november 2022, 75 år gammel — spilte helt til få uker før, tiår etter Dr. Feelgood og en kreftdiagnose han beseiret mot alle odds.',
  short_sv = 'Gick bort den 21 november 2022, 75 år gammal — spelade fortfarande veckor innan, årtionden efter Dr. Feelgood och en cancerdiagnos han besegrade mot alla odds.',
  short_de = 'Verstarb am 21. November 2022 im Alter von 75 Jahren — trat noch Wochen zuvor auf, Jahrzehnte nach Dr. Feelgood und einer Krebsdiagnose, die er gegen alle Widerstände besiegte.',
  short_pl = 'Zmarł 21 listopada 2022 roku w wieku 75 lat — występował jeszcze na tygodnie przed śmiercią, dekady po Dr. Feelgood i diagnozie raka, którą pokonał wbrew wszelkim przeciwnościom.'
WHERE slug = 'wilko-johnson';
