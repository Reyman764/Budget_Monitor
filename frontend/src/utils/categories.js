// Fallback category lists — used only until the household's own
// customized categories (household.categories) have loaded, or for an
// older household that hasn't been migrated to have its own list yet.
export const DEFAULT_CATEGORIES = {
  expense: ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'],
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Saving', 'Other']
};
