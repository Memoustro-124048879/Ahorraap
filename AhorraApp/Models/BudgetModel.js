import db from '../Database/Database';

export const BudgetModel = {
  create: async (userId, amount, category, month) => {
    try {
      const result = await db.runAsync(
        'INSERT INTO budgets (user_id, amount, category, month) VALUES (?, ?, ?, ?)',
        [userId, amount, category, month]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  },

  getAllByUser: async (userId) => {
    try {
      const budgets = await db.getAllAsync(
        'SELECT * FROM budgets WHERE user_id = ?',
        [userId]
      );
      return budgets;
    } catch (error) {
      console.error('Error getting budgets:', error);
      throw error;
    }
  },

  update: async (id, amount, category, month) => {
    try {
      await db.runAsync(
        'UPDATE budgets SET amount = ?, category = ?, month = ? WHERE id = ?',
        [amount, category, month, id]
      );
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await db.runAsync('DELETE FROM budgets WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },
  
  getByCategoryAndMonth: async (userId, category, month) => {
      try {
          const budget = await db.getFirstAsync(
              'SELECT * FROM budgets WHERE user_id = ? AND category = ? AND month = ?',
              [userId, category, month]
          );
          return budget;
      } catch (error) {
          console.error('Error getting budget by category:', error);
          throw error;
      }
  }
};
