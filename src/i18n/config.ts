export type Locale = (typeof locales)[number];
export const locales = ["en", "fr", "de", "es", "it"] as const;
export const defaultLocale: Locale = "en";
