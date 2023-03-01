// utils
import makeValidation from '@withvoid/make-validation';
import userService from '../services/user.service.js';

export default {
  onGetAllUsers: async (req, res) => {
    try {
      const users = await userService.findUsers();

      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  onGetUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await userService.findUserById(id);

      if (!user) {
        throw new Error('No user with this id found');
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  onCreateUser: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          firstName: { type: types.string },
          lastName: { type: types.string },
          username: { type: types.string },
          password: { type: types.string }
        }
      }));

      if (!validation.success) {
        return res.status(400).json(validation);
      }

      const { firstName, lastName, username, password } = req.body;

      const user = await userService.createUser({
        firstName,
        lastName,
        username,
        password
      });

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  onDeleteUserById: async (req, res) => {}
};
