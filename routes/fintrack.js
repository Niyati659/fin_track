import express from 'express';
import {
  findUsers,
  addUsers,
  addIncome,
  addExpenses,
  getExpenses,
  getIncome,
  deleteUser
} from '../fintrackFunctions.js';

const router = express.Router();

// 1. Find users
router.post('/findUsers', async (req, res) => {
  const{username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const { data, error } = await findUsers({ username, password });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: 'Login successful', user: data });
});

// 2. Add users
router.post('/addUsers', async (req, res) => {
  const { data, error } = await addUsers(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// 3. Add income
router.post('/addIncome', async (req, res) => {
  const { data, error } = await addIncome(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// 4. Add expenses
router.post('/addExpenses', async (req, res) => {
  const { data, error } = await addExpenses(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// 5. Get expenses
router.get('/getExpenses/:user_id', async (req, res) => {
  const { data, error } = await getExpenses(req.params.user_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 6. Get income
router.get('/getIncome/:user_id', async (req, res) => {
  const { data, error } = await getIncome(req.params.user_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 7. Delete user
router.delete('/deleteUser/:id', async (req, res) => {
  const { error } = await deleteUser(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'User deleted' });
});

export default router;
