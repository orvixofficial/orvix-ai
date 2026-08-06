// Supabase প্রজেক্টের তথ্য (আপনার প্রজেক্ট অনুযায়ী দেওয়া)
const SUPABASE_URL = 'https://evdchqddhuzbgyexdnyq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZGNoaWRkaHV6Ymd5ZXhkbnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODYwNzUsImV4cCI6MjA2NjI2MjA3NX0.zVvG5Vq7vYvG5Vq7vYvG5Vq7vYvG5Vq7vYvG5Vq7vYv'; // আপনার আসল অ্যানন কি এখানে বসানো থাকতে পারে

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// পেজ লোড হওয়ার সাথে সাথে লগইন চেক করা
document.addEventListener("DOMContentLoaded", async () => {
  const currentPath = window.location.pathname;
  
  // ব্যবহারকারীর সেশন চেক করা
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthPage = currentPath.includes('login.html') || currentPath.includes('signup.html');
  const isChatPage = currentPath.includes('chat.html');

  // যদি লগইন করা না থাকে এবং সে যদি চ্যাট পেজে থাকে, তবে তাকে লগইন পেজে পাঠিয়ে দেবে
  if (!session && isChatPage) {
    window.location.href = '/frontend/login.html';
    return;
  }

  // যদি লগইন করা থাকে এবং সে যদি লগইন পেজে থাকে, তবে তাকে সরাসরি চ্যাট পেজে পাঠিয়ে দেবে
  if (session && isAuthPage) {
    window.location.href = '/frontend/chat.html';
    return;
  }

  // চ্যাট পেজে থাকলে ইউজারের ইমেইল বা নাম শো করানো
  if (session && isChatPage) {
    const userEmailElement = document.getElementById('user-email-header');
    if (userEmailElement) {
      userEmailElement.textContent = session.user.email;
    }
  }
});

// লগআউট ফাংশন
async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    window.location.href = '/frontend/login.html';
  } else {
    alert('লগআউট করতে সমস্যা হচ্ছে: ' + error.message);
  }
}
