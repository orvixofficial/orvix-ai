// Supabase Connection
const SUPABASE_URL = 'https://jyokiouskrfwzuerbyue.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DBVEUxrgKCO9SQvRp11uHw_Q3_lYIFN';

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Google Sign-In Function (লগইন সফল হলে সরাসরি chat.html এ রিডাইরেক্ট করবে)
async function signInWithGoogle() {
  if (!supabaseClient) return alert('Supabase লোড হয়নি!');
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/chat.html'
      }
    });
    if (error) alert('লগইন সমস্যা: ' + error.message);
  } catch (err) {
    console.error(err);
  }
}

// Session Protection & Auto Navigation
async function handleAuthRouting() {
  if (!supabaseClient) return;

  const { data: { session } } = await supabaseClient.auth.getSession();
  const currentPath = window.location.pathname;

  // ১. যদি ইউজার চ্যাট পেজে থাকে কিন্তু লগইন করা না থাকে -> login.html এ পাঠিয়ে দেবে
  if (currentPath.includes('chat.html') && !session) {
    window.location.href = 'login.html';
    return;
  }

  // ২. যদি ইউজার অলরেডি লগইন করা থাকে এবং login.html বা signup.html পেজে থাকে -> অটোমেটিক chat.html এ নিয়ে যাবে
  if ((currentPath.includes('login.html') || currentPath.includes('signup.html') || currentPath.endsWith('/') || currentPath.endsWith('index.html')) && session) {
    // যদি আপনি চান লগইন করার পর সরাসরি চ্যাট পেজ ওপেন হোক:
    if (currentPath.includes('login.html') || currentPath.includes('signup.html')) {
      window.location.href = 'chat.html';
      return;
    }
  }

  // ৩. চ্যাট পেজে থাকলে সাইডবারে ইউজারের নাম ও ছবি সেট করা
  if (session && session.user && currentPath.includes('chat.html')) {
    const user = session.user;
    const userName = user.user_metadata?.full_name || user.email;
    const userAvatar = user.user_metadata?.avatar_url;

    const nameEl = document.getElementById('sidebar-user-name');
    const avatarEl = document.getElementById('sidebar-user-avatar');

    if (nameEl) nameEl.innerText = userName;
    if (avatarEl && userAvatar) avatarEl.src = userAvatar;
  }
}

// Logout Function
async function handleLogout() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  }
}

window.addEventListener('load', handleAuthRouting);
