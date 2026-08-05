// Supabase Connection
const SUPABASE_URL = 'https://jyokiouskrfwzuerbyue.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DBVEUxrgKCO9SQvRp11uHw_Q3_lYIFN';

// Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Google Sign-In Function
async function signInWithGoogle() {
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://orvix-aibd.vercel.app'
      }
    });
    
    if (error) {
      alert('গুগল লগইন সমস্যা: ' + error.message);
    }
  } catch (err) {
    console.error(err);
    alert('কোনো একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।');
  }
}
