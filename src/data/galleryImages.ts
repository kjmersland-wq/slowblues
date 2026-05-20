// Gallery Images - All public domain from Library of Congress / Wikimedia Commons
// Source: Farm Security Administration/Office of War Information Collection

import jukeJointBelleGlade from "@/assets/gallery/juke-joint-belle-glade.webp";
import crossroadsMelrose from "@/assets/gallery/crossroads-melrose.webp";
import sharecropperCabin from "@/assets/gallery/sharecropper-cabin.webp";
import cottonPicking from "@/assets/gallery/cotton-picking.jpg";

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  location: string;
  year: string;
  photographer: string;
  source: string;
  license: string;
  commonsUrl?: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "juke-joint-belle-glade",
    src: jukeJointBelleGlade,
    title: "Migratory Laborers at a Juke Joint",
    location: "Belle Glade, Florida",
    year: "February 1941",
    photographer: "Marion Post Wolcott",
    source: "Library of Congress, FSA/OWI Collection (fsac.1a34397)",
    license: "Public Domain",
    commonsUrl: "https://commons.wikimedia.org/wiki/File:FSA_JukeJoint.jpg"
  },
  {
    id: "crossroads-melrose",
    src: crossroadsMelrose,
    title: "Crossroads Store, Bar and Juke Joint",
    location: "Melrose, Louisiana",
    year: "June 1940",
    photographer: "Marion Post Wolcott",
    source: "Library of Congress, FSA/OWI Collection (fsac.1a34361)",
    license: "Public Domain",
    commonsUrl: "https://commons.wikimedia.org/wiki/File:A_cross_roads_store,_bar,_juke_joint,_and_gas_station_in_Melrose,_Louisiana,_1944.jpg"
  },
  {
    id: "sharecropper-cabin",
    src: sharecropperCabin,
    title: "African American Sharecropper's Cabin",
    location: "Hale County, Alabama",
    year: "Summer 1936",
    photographer: "Walker Evans",
    source: "Library of Congress, FSA/OWI Collection (fsa.8c52263)",
    license: "Public Domain",
    commonsUrl: "https://commons.wikimedia.org/wiki/File:African_American_cabin,_Hale_County,_Alabama,_8c52263.jpg"
  },
  {
    id: "cotton-picking",
    src: cottonPicking,
    title: "Cotton Pickers in the Field",
    location: "Georgia",
    year: "1907",
    photographer: "Unknown",
    source: "Library of Congress",
    license: "Public Domain",
    commonsUrl: "https://commons.wikimedia.org/wiki/File:African_Americans_picking_cotton,_Georgia,_1907.jpg"
  }
];
