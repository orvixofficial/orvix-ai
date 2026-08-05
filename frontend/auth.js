// Supabase Config
const SUPABASE_URL = 'https://jyokiouskrfwzuerbyue.supabase.co';
const SUPABASE_KEY = 'Sb_publishable_DBVEUXrgKCO9SQvRp11uHw_Q3_lYIFN';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Signup Logic
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert('Signup Failed: ' + error.message);
        } else {
            alert('Account created! Logging in...');
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'chat.html';
        }
    });
}

// Login Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert('Login Failed: ' + error.message);
        } else {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'chat.html';
        }
    });
}
// Google Login Function
async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://orvix-aibd.vercel.app'
    }
  });
  if (error) console.error('Error logging in:', error.message);
}
