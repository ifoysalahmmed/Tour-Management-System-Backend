export const slugify = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .normalize("NFD") // Convert accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .replace(/'/g, "") // Remove apostrophes
    .replace(/[^a-z0-9\s-]/g, "") // Remove all other special characters
    .replace(/[\s-]+/g, "-") // Replace one or more spaces/hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
