export const bookCategories = [
  "Engineering",
  "AI",
  "System Design",
  "DSA",
  "Web Development",
  "Cloud & DevOps",
  "Productivity",
  "Career Growth",
] as const;

export const allCategoryOptions = ["All", ...bookCategories] as const;
