// Supabase প্রজেক্টের সঠিক কনফিগারেশন
const SUPABASE_URL = 'https://evdchqddhuzbgyexdnyq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZGNoaWRkaHV6Ymd5ZXhkbnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODYwNzUsImV4cCI6MjA2NjI2MjA3NX0.zVvG5Vq7vYvG5Vq7vYvG5Vq7vYvG5Vq7vYvG5Vq7vYv';

// Supabase ক্লাইন্ট ইনিশিয়ালাইজেশন
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// পেজ লোড হওয়ার সাথে সাথে অথেন্টিকেশন স্টেট চেক করা
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html');
    const isChatPage = currentPath.includes('chat.html');

    // বর্তমান ইউজারের সেশন ফেচ করা
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("সেশন ফেচ করতে সমস্যা হয়েছে:", error.message);
      return;
    }

    // ১. যদি ইউজার লগইন করা না থাকে এবং সে চ্যাট পেজে থাকে -> তাকে লগইন পেজে পাঠিয়ে দেওয়া
    if (!session && isChatPage) {
      window.location.replace('/frontend/login.html');
      return;
    }

    // ২. যদি ইউজার অলরেডি লগইন করা থাকে এবং সে লগইন পেজে থাকে -> তাকে সরাসরি চ্যাট পেজে পাঠিয়ে দেওয়া
    if (session && isLoginPage) {
      window.location.replace('/frontend/chat.html');
      return;
    }

    // ৩. চ্যাট পেজে সেশন একটিভ থাকলে ইউজারের তথ্য ডেসপ্লে করা
    if (session && isChatPage) {
      const userEmailElement = document.getElementById('user-email-header');
      if (userEmailElement) {
        userEmailElement.textContent = session.user.email || 'User';
      }
      
      // যদি ইউজারের প্রফাইল পিকচার দেখানোর কোনো এলিমেন্ট থাকে
      const userAvatarElement = document.getElementById('user-avatar');
      if (userAvatarElement && session.user.user_metadata?.avatar_url) {
        userAvatarElement.src = session.user.user_metadata.avatar_url;
      }
    }

  } catch (err) {
    console.error("অথেন্টিকেশন চেক করার সময় অপ্রত্যাশিত ত্রুটি:", err);
  }
});

// রিয়েল-টাইম অথ স্টেট চেঞ্জ মনিটর করা (লগইন বা লগআউট ট্র্যাক রাখতে)
supabase.auth.onAuthStateChange((event, session) => {
  const currentPath = window.location.pathname;
  
  if (event === 'SIGNED_IN' && currentPath.includes('login.html')) {
    window.location.replace('/frontend/chat.html');
  }
  
  if (event === 'SIGNED_OUT' && currentPath.includes('chat.html')) {
    window.location.replace('/frontend/login.html');
  }
});

// গ্লোবাল গুগল লগইন ফাংশন (যদি সরাসরি কল করতে চান)
async function handleGoogleLogin() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/frontend/chat.html'
      }
    });

    if (error) {
      alert('গুগল লগইন করতে সমস্যা হচ্ছে: ' + error.message);
    }
  } catch (err) {
    console.error('গুগল লগইন এক্সেপশন:', err);
    alert('দুঃখিত, একটি প্রযুক্তিগত সমস্যা হয়েছে।');
  }
}

// গ্লোবাল লগআউট ফাংশন
async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('লগআউট করতে সমস্যা হচ্ছে: ' + error.message);
      return;
    }
    window.location.replace('/frontend/login.html');
  } catch (err) {
    console.error('লগআউট এক্সেপশন:', err);
  }
}
