import { Montserrat, Source_Code_Pro } from "next/font/google";
import localFont from "next/font/local";

// The fonts live here rather than in app/layout.tsx because a layout may only export a
// default component and Next's own route fields; any other named export fails the type
// check it generates. Keeping them in a module also means anything else that needs a
// font handle imports it from here instead of reaching into a route file.

// Body, UI, labels and eyebrows. The same face the consulting site uses.
export const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

// Code blocks only. The consulting site carries no code and so no monospace face;
// this is the one deliberate deviation from its two-family system.
export const sourceCodePro = Source_Code_Pro({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  fallback: ["monospace"],
  display: "swap",
});

// Copperplate CC, under the SIL Open Font License 1.1. The OFL permits modification and
// redistribution, but section 2 requires the copyright notice and the licence to travel
// with every copy — both are in fonts/CopperplateCC-OFL.txt.
//
// The font is kept out of public/, where everything is served at a browsable path. The
// OFL would allow it there; one rule for every font in this project is less to get wrong.
//
// The weights are mapped from the fonts' own metadata, not their filenames. This family
// keeps Goudy's original naming, where "Heavy" is the upright regular: the Heavy file
// reports subfamily Regular and usWeightClass 400, and Bold reports 700. Trusting the
// filename would map Heavy to 900 and leave the browser synthesising a bold that exists.
//
// It ships no small-cap glyphs either — the lowercase slots hold full-height capitals —
// which is why headings ask for `font-variant-caps: small-caps` and let the browser
// synthesise them. See the .heading-display rule in app/globals.css.
export const copperplate = localFont({
  src: [
    { path: "../fonts/CopperplateCC-Heavy.ttf", weight: "400", style: "normal" },
    { path: "../fonts/CopperplateCC-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});
