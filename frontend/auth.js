// Supabase Connection
const SUPABASE_URL = 'https://jyokiouskrfwzuerbyue.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DBVEUxrgKCO9SQvRp11uHw_Q3_lYIFN';

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// ১. গুগল দিয়ে লগইন করার ফাংশন
async function signInWithGoogle() {
  if (!supabaseClient) return alert('Supabase লোড হয়নি!');
  
  await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/chat.html'
    }
  });
}

// ২. সেশন চেক করে সঠিক পেজে রাখার ফাংশন (লুপ রোধ করতে সুরক্ষিত)
async function handleAuthRouting() {
  if (!supabaseClient) return;

  const currentPath = window.location.pathname;
  
  // একটু সময় নিয়ে সেশন ফেচ করা যাতে ব্রাউজার ডাটা পেতে মিস না করে
  const { data: { session } } = await supabaseClient.auth.getSession();

  // ক) যদি chat.html পেজে থাকে কিন্তু লগইন করা না থাকে, তবেই login.html এ পাঠাবে
  if (currentPath.includes('chat.html') && !session) {
    window.location.href = 'login.html';
    return;
  }

  // খ) যদি login.html পেজে থাকে এবং অলরেডি লগইন করা থাকে, তবেই chat.html এ পাঠাবে
  if (currentPath.includes('login.html') && session) {
    window.location.href = 'chat.html';
    return;
  }
}

// ৩. লগআউট ফাংশন
async function handleLogout() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  }
}

// পেজ লোড হওয়ার সাথে সাথে চেক করবে
window.addEventListener('DOMContentLoaded', handleAuthRouting);
