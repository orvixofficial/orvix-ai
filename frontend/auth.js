// Supabase Connection
const SUPABASE_URL = 'https://jyokiouskrfwzuerbyue.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DBVEUxrgKCO9SQvRp11uHw_Q3_lYIFN';

// Initialize Supabase Client (সঠিক ও নিরাপদভাবে তৈরি)
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Google Sign-In Function
async function signInWithGoogle() {
  if (!supabaseClient) return alert('Supabase সঠিকভাবে লোড হয়নি!');
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://orvix-aibd.vercel.app'
      }
    });
    if (error) alert('গুগল লগইন সমস্যা: ' + error.message);
  } catch (err) {
    console.error(err);
  }
}

// Check logged in user on main page
async function checkUserSession() {
  if (!supabaseClient) return;

  const { data: { session } } = await supabaseClient.auth.getSession();
  
  const profileDiv = document.getElementById('user-profile');
  const userEmailSpan = document.getElementById('user-email');
  const authLinks = document.getElementById('auth-links');

  if (session && session.user) {
    if (userEmailSpan) userEmailSpan.innerText = session.user.email;
    if (profileDiv) profileDiv.style.display = 'flex';
    if (authLinks) authLinks.style.display = 'none';
  } else {
    if (profileDiv) profileDiv.style.display = 'none';
    if (authLinks) authLinks.style.display = 'flex';
  }
}

// Logout Function
async function handleLogout() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
    window.location.reload();
  }
}

// পেজ এবং সুপাবেস লোড হওয়া নিশ্চিত করে সেশন চেক
window.addEventListener('load', checkUserSession);
