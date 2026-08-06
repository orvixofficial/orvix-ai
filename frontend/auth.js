// Supabase Connection
const SUPABASE_URL = 'https://jyokiouskrfwzuerbyue.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DBVEUxrgKCO9SQvRp11uHw_Q3_lYIFN';

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Google Sign-In Function
async function signInWithGoogle() {
  if (!supabaseClient) return alert('Supabase লোড হয়নি!');
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://orvix-aibd.vercel.app/chat.html'
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

  // গুগল থেকে রিডাইরেক্ট হয়ে ফেরার সময় সেশন ক্যাচ করার জন্য ব্রাউজারের হ্যাস বা কোড চেক করা
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  const currentPath = window.location.pathname;

  console.log("Current Session:", session); // কনসোলে দেখার জন্য

  // ১. যদি চ্যাট পেজে থাকে কিন্তু লগইন করা না থাকে -> login.html এ পাঠিয়ে দেবে
  if (currentPath.includes('chat.html') && !session) {
    window.location.href = 'login.html';
    return;
  }

  // ২. যদি লগইন বা সাইনআপ পেজে থাকে এবং অলরেডি সেশন থাকে -> সরাসরি chat.html এ পাঠিয়ে দেবে
  if ((currentPath.includes('login.html') || currentPath.includes('signup.html')) && session) {
    window.location.href = 'chat.html';
    return;
  }

  // ৩. চ্যাট পেজে থাকলে সাইডবারে নাম ও ছবি সেট করা
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
