// Supabase প্রজেক্টের সঠিক তথ্য
const SUPABASE_URL = 'https://evdchqddhuzbgyexdnyq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZGNoaWRkaHV6Ymd5ZXhkbnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODYwNzUsImV4cCI6MjA2NjI2MjA3NX0.zVvG5Vq7vYvG5Vq7vYvG5Vq7vYvG5Vq7vYvG5Vq7vYv';

// Supabase ক্লাইন্ট ইনিশিয়ালাইজ করা
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  const currentPath = window.location.pathname;
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.error("Session Error:", error.message);

    const isAuthPage = currentPath.includes('login.html');
    const isChatPage = currentPath.includes('chat.html');

    // যদি লগইন করা না থাকে এবং সে চ্যাট পেজে থাকে -> লগইন পেজে পাঠাবে
    if (!session && isChatPage) {
      window.location.href = '/frontend/login.html';
      return;
    }

    // যদি লগইন করা থাকে এবং সে লগইন পেজে থাকে -> চ্যাট পেজে পাঠাবে
    if (session && isAuthPage) {
      window.location.href = '/frontend/chat.html';
      return;
    }

    // চ্যাট পেজে ইমেইল শো করানো
    if (session && isChatPage) {
      const userEmailElement = document.getElementById('user-email-header');
      if (userEmailElement) {
        userEmailElement.textContent = session.user.email;
      }
    }
  } catch (err) {
    console.error("Auth Load Error:", err);
  }
});

// গুগল দিয়ে লগইন করার ফাংশন
async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/frontend/chat.html'
      }
    });
    if (error) {
      alert('গুগল লগইন এরর: ' + error.message);
    }
  } catch (err) {
    console.error("Google Sign-In Exception:", err);
    alert('কিছু একটা সমস্যা হয়েছে। কনসোল চেক করুন।');
  }
}

// লগআউট ফাংশন
async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    window.location.href = '/frontend/login.html';
  } else {
    alert('লগআউট করতে সমস্যা হচ্ছে: ' + error.message);
  }
}
