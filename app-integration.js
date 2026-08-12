/* J.G-TEEN full-stack bridge
 * Loads Supabase Auth + database features without replacing the legacy UI.
 * Browser code must use only the publishable key; service-role keys stay server-side.
 */
(function () {
  'use strict';

  const CONFIG = window.JOBOTEEN_SUPABASE || {};
  const configured = CONFIG.url && CONFIG.publishableKey &&
    !CONFIG.url.includes('YOUR_PROJECT_REF') &&
    !CONFIG.publishableKey.includes('YOUR_SUPABASE');

  let supabase = null;
  let currentUser = null;
  let authReady = false;

  function toast(message, type) {
    if (typeof window.notify === 'function') {
      window.notify(message);
      return;
    }
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:99999;padding:14px 18px;border:1px solid rgba(0,242,255,.35);border-radius:14px;background:rgba(10,12,20,.92);color:#fff;backdrop-filter:blur(18px);font:600 14px Inter,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.35)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function loadSupabase() {
    return new Promise((resolve, reject) => {
      if (window.supabase?.createClient) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Could not load Supabase client'));
      document.head.appendChild(script);
    });
  }

  async function init() {
    if (!configured) {
      console.info('[J.G-TEEN] Supabase is not configured. Demo/local mode remains available.');
      return;
    }
    try {
      await loadSupabase();
      supabase = window.supabase.createClient(CONFIG.url, CONFIG.publishableKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });

      const { data } = await supabase.auth.getSession();
      currentUser = data.session?.user || null;
      authReady = true;
      await syncAuthenticatedUI();

      supabase.auth.onAuthStateChange((_event, session) => {
        currentUser = session?.user || null;
        setTimeout(() => syncAuthenticatedUI(), 0);
      });
    } catch (error) {
      console.error('[J.G-TEEN] Backend initialization failed:', error);
      toast('Backend unavailable — continuing in local mode.');
    }
  }

  async function syncAuthenticatedUI() {
    if (!currentUser) return;
    document.getElementById('login-screen')?.style && (document.getElementById('login-screen').style.display = 'none');
    const app = document.getElementById('main-app');
    if (app) app.style.display = 'flex';
    await loadProfile();
    await loadStory();
    await loadNotifications();
  }

  async function signUp() {
    if (!supabase) return false;
    const name = document.getElementById('reg-name')?.value.trim() || '';
    const email = document.querySelector('#login-screen input[type="email"]')?.value.trim() || '';
    const password = document.querySelector('#login-screen input[type="password"]')?.value || '';
    if (!name || !email || password.length < 6) {
      toast('Enter your name, email and a password of at least 6 characters.');
      return true;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) { toast(error.message); return true; }
    if (!data.session) {
      toast('Account created. Check your email to confirm your account.');
      return true;
    }
    currentUser = data.user;
    await syncAuthenticatedUI();
    toast('Welcome to J.G-TEEN, ' + name + '.');
    return true;
  }

  async function signIn(email, password) {
    if (!supabase) return false;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast(error.message); return true; }
    currentUser = data.user;
    await syncAuthenticatedUI();
    return true;
  }

  async function loadProfile() {
    if (!supabase || !currentUser) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
    if (error || !data) return;
    const name = data.full_name || currentUser.user_metadata?.full_name || 'J.G-TEEN USER';
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.value = value ?? ''; };
    const text = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value ?? ''; };
    text('display-name-profile', name);
    text('user-display', name);
    set('user-bio', data.bio);
    set('user-location', data.location);
    const xp = document.querySelector('.p-stat strong');
    if (xp) xp.textContent = Number(data.xp || 0).toLocaleString();
    const rank = document.querySelectorAll('.p-stat strong')[0];
    if (rank) rank.textContent = data.rank || 'NOVICE';
    if (data.avatar_url) {
      const box = document.getElementById('profile-display');
      if (box) box.innerHTML = '<img src="' + escapeHtml(data.avatar_url) + '" alt="Profile photo">';
    }
  }

  async function loadStory() {
    if (!supabase || !currentUser) return;
    const { data } = await supabase.from('life_stories').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false }).limit(1).maybeSingle();
    const el = document.getElementById('life-story-input');
    if (el && data) el.value = data.body || '';
  }

  async function saveProfile() {
    if (!supabase || !currentUser) {
      toast('Configure Supabase to enable cloud sync.');
      return;
    }
    const name = document.getElementById('display-name-profile')?.textContent || currentUser.user_metadata?.full_name || '';
    const bio = document.getElementById('user-bio')?.value || '';
    const location = document.getElementById('user-location')?.value || '';
    const story = document.getElementById('life-story-input')?.value || '';

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: currentUser.id, full_name: name, bio, location
    });
    if (profileError) { toast(profileError.message); return; }

    const { data: existing } = await supabase.from('life_stories').select('id').eq('user_id', currentUser.id).order('updated_at', { ascending: false }).limit(1).maybeSingle();
    const storyPayload = { user_id: currentUser.id, body: story, is_private: true };
    const storyResult = existing?.id
      ? await supabase.from('life_stories').update(storyPayload).eq('id', existing.id)
      : await supabase.from('life_stories').insert(storyPayload);
    if (storyResult.error) { toast(storyResult.error.message); return; }
    toast('Profile and life story synced to cloud.');
  }

  async function submitMentorRequest() {
    if (!supabase || !currentUser) {
      toast('Please sign in to send a mentor request.');
      return;
    }
    const problem = document.getElementById('problem-desc')?.value.trim() || '';
    const urgency = document.getElementById('urgency')?.value || 'normal';
    if (problem.length < 10) { toast('Please describe your problem more clearly.'); return; }
    const { error } = await supabase.from('mentor_requests').insert({
      user_id: currentUser.id,
      mentor_name: window.selectedMentor || 'General Mentor',
      problem,
      urgency
    });
    if (error) { toast(error.message); return; }
    document.getElementById('problem-desc').value = '';
    toast('Mentor request securely submitted.');
  }

  async function loadNotifications() {
    if (!supabase || !currentUser) return;
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false }).limit(20);
    if (error || !data) return;
    const dot = document.getElementById('nav-notif-dot');
    const unread = data.some(n => !n.read_at);
    if (dot) dot.style.display = unread ? 'block' : 'none';
    const container = document.getElementById('notifications-view');
    if (!container || !data.length) return;
    const existing = container.querySelector('[data-live-notifications]');
    if (existing) existing.remove();
    const list = document.createElement('div');
    list.dataset.liveNotifications = 'true';
    list.className = 'glass-card';
    list.innerHTML = '<h3>Live notifications</h3>' + data.map(n => '<article style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,.08)"><strong>' + escapeHtml(n.title) + '</strong><p>' + escapeHtml(n.body) + '</p></article>').join('');
    container.appendChild(list);
  }

  async function saveGameScore(game, score) {
    if (!supabase || !currentUser || !Number.isFinite(score)) return;
    const { error } = await supabase.from('game_scores').insert({ user_id: currentUser.id, game, score: Math.max(0, Math.floor(score)) });
    if (error) console.warn('[J.G-TEEN] score sync failed:', error.message);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
  }

  // Preserve the existing UI API while replacing persistence/auth behavior.
  const legacyLaunch = window.launchPlatform;
  window.launchPlatform = async function () {
    if (!configured || !supabase || !authReady) {
      if (typeof legacyLaunch === 'function') return legacyLaunch();
      return;
    }
    const email = document.querySelector('#login-screen input[type="email"]')?.value.trim() || '';
    const password = document.querySelector('#login-screen input[type="password"]')?.value || '';
    if (email && password) return signUp();
    toast('Enter your email and password to create your account.');
  };

  window.saveFullProfile = saveProfile;
  window.submitRequest = submitMentorRequest;
  window.saveGameScore = saveGameScore;

  // Optional helpers for a future dedicated sign-in form.
  window.JoboTeenAuth = { signUp, signIn, signOut: async () => { if (supabase) await supabase.auth.signOut(); } };

  init();
})();
