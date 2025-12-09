import db from '../Database/Database';

export const UserModel = {
  create: async (email, password, name) => {
    try {
      const result = await db.runAsync(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, password, name]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  findByEmail: async (email) => {
    try {
      const user = await db.getFirstAsync(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  },

  updatePassword: async (email, newPassword) => {
    try {
      await db.runAsync(
        'UPDATE users SET password = ? WHERE email = ?',
        [newPassword, email]
      );
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
};
