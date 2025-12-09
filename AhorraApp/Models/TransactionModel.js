import db from '../Database/Database';

export const TransactionModel = {
  create: async (userId, amount, category, date, description) => {
    try {
      const result = await db.runAsync(
        'INSERT INTO transactions (user_id, amount, category, date, description) VALUES (?, ?, ?, ?, ?)',
        [userId, amount, category, date, description]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  getAllByUser: async (userId) => {
    try {
      const transactions = await db.getAllAsync(
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
        [userId]
      );
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  },

  update: async (id, amount, category, date, description) => {
    try {
      await db.runAsync(
        'UPDATE transactions SET amount = ?, category = ?, date = ?, description = ? WHERE id = ?',
        [amount, category, date, description, id]
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  filter: async (userId, category, date) => {
    try {
      let query = 'SELECT * FROM transactions WHERE user_id = ?';
      const params = [userId];

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      if (date) {
        query += ' AND date LIKE ?';
        params.push(`${date}%`);
      }

      query += ' ORDER BY date DESC';

      const transactions = await db.getAllAsync(query, params);
      return transactions;
    } catch (error) {
      console.error('Error filtering transactions:', error);
      throw error;
    }
  }
};
