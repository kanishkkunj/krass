// Build-time import of portfolio images grouped by folder name.
// Uses Vite's import.meta.glob to get asset URLs
type Category = "corporate" | "social" | "wedding";

const modules = import.meta.glob('../assets/portfolio/**/*.{jpg,jpeg,png,webp,gif}', { 
  eager: true, 
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const imagesByCategory: Record<Category, string[]> = {
  corporate: [],
  social: [],
  wedding: [],
};

for (const p in modules) {
  const url = modules[p];
  const lower = p.toLowerCase();
  if (lower.includes('/corporate/')) imagesByCategory.corporate.push(url);
  else if (lower.includes('/social/')) imagesByCategory.social.push(url);
  else if (lower.includes('/wedding/')) imagesByCategory.wedding.push(url);
}

console.log('Portfolio images loaded:', imagesByCategory);

export default imagesByCategory;
