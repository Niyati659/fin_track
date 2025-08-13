import { supabase } from './supabaseClient.js';
import bcrypt from 'bcryptjs';

// 1. Find users
export async function findUsers({ username, password }) {
  const { data: users, error } = await supabase
    .from('Users')
    .select('*')
    .eq('username', username)
    .limit(1);

  if (error) return { error };
  if (users.length == 0) return { error: { message: 'User not found' } };

  const user = users[0];

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { error: { message: 'Invalid password' } };

  return { data: { id: user.id } };
}

// 2. Add users
export async function addUsers({ username, password }) {
  // Check if username already exists
  const { data: users, error: findError } = await supabase
    .from('Users')
    .select('id')
    .eq('username', username)
    .limit(1);

  if (findError) return { error: findError };
  if (users.length > 0) return { error: { message: 'Username already exists' } };

  // Hash the password before storing (assuming bcrypt is imported)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  const { data, error } = await supabase
    .from('Users')
    .insert([{ username: username, password: hashedPassword }])
    .select('id')
    .single();

  if (error) return { error };
  return { data };
}


// 3. Add or update income for the same month and year
export async function addIncome({ user_id, amount, date }) {
  // Extract year and month from the provided date
  const inputDate = new Date(date);
  const inputYear = inputDate.getFullYear();
  const inputMonth = inputDate.getMonth() + 1; // getMonth() is 0-based

  // Find existing income for the same user, month, and year
  const { data: existing, error } = await supabase
    .from('income')
    .select('*')
    .eq('user_id', user_id);

  if (error) return { error };

  // Check if any entry matches the same month and year
  const match = existing.find(item => {
    const createdAt = new Date(item.created_at);
    return (
      createdAt.getFullYear() === inputYear &&
      createdAt.getMonth() + 1 === inputMonth
    );
  });

  if (match) {
    // Update the amount (you can decide to sum or replace)
    const { data, error: updateError } = await supabase
      .from('income')
      .update({ income: amount })
      .eq('income_id', match.income_id);

    if (updateError) return { error: updateError };
    return { data, updated: true };
  } else {
    // Insert new income
    const { data, error: insertError } = await supabase
      .from('income')
      .insert([{ user_id: user_id, income: amount}]);

    if (insertError) return { error: insertError };
    return { data, inserted: true };
  }
}

// 4. Add expenses
export async function addExpenses({ user_id, amount, category}) {
  return await supabase.from('expenses').insert([{ user_id: user_id, amount: amount, category: category}]);
}

// 5. Get expenses
export async function getExpenses(user_id) {
  const { data, error } = await supabase
    .rpc('get_expenses_grouped', { uid: user_id });
  if (error) return { error };
  return { data };
}

// 6. Get income
export async function getIncome(user_id) {
  const { data, error } = await supabase
    .from('income')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) return { error };
  return { data };
}

// 7. Delete user
export async function deleteUser(id) {
  return await supabase.from('Users').delete().eq('id', id);
}
