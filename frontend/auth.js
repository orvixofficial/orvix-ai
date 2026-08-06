// Supabase Connection
const SUPABASE_URL = 'https://jyokiouskrfwzuerbyue.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DBVEUxrgKCO9SQvRp11uHw_Q3_lYIFN';

// Supabase ক্লায়েন্ট তৈরি করা
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// ১. গুগল দিয়ে লগইন করার ফাংশন
async function signInWithGoogle() {
  if (!supabaseClient) {
    alert('Supabase লোড হতে সমস্যা হয়েছে!');
    return;
  }
  
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/chat.html'
      }
    });
    if (error) {
      alert('লগইন ত্রুটি: ' + error.message);
    }
  } catch (err) {
    console.error("Login exception:", err);
  }
}

// ২. সেশন চেক করে পেজ রিডাইরেক্ট বা রাউটিং করার ফাংশন
async function handleAuthRouting() {
  if (!supabaseClient) return;

  const currentPath = window.location.pathname;
  
  // Supabase থেকে বর্তমান সেশন বা ইউজার ডাটা ফেচ করা
  const { data: { session }, error } = await supabaseClient.auth.getSession();

  console.log("Current Path:", currentPath);
  console.log("User Session:", session ? "Active" : "Null");

  // ক) যদি ইউজার chat.html এ থাকে কিন্তু লগইন করা না থাকে -> login.html এ পাঠিয়ে দিবে
  if (currentPath.includes('chat.html') && !session) {
    window.location.href = 'login.html';
    return;
  }

  // খ) যদি ইউজার login.html এ থাকে কিন্তু অলরেডি লগইন করা থাকে -> সরাসরি chat.html এ পাঠিয়ে দিবে
  if (currentPath.includes('login.html') && session) {
    window.location.href = 'chat.html';
    return;
  }
}

// ৩. লগআউট করার ফাংশন
async function handleLogout() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  }
}

// পেজ লোড হওয়া মাত্রই রাউটিং চেক করবে
window.addEventListener('DOMContentLoaded', handleAuthRouting);
