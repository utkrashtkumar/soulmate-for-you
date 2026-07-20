'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import UpdatePhotoModal from '@/components/UpdatePhotoModal';
import VirtualGiftModal from '@/components/VirtualGiftModal';
import CompanionDiaryModal from '@/components/CompanionDiaryModal';
import CompatibilityQuizModal from '@/components/CompatibilityQuizModal';
import InstallAppPrompt from '@/components/InstallAppPrompt';
import CompanionStoriesModal from '@/components/CompanionStoriesModal';
import DailyTarotModal from '@/components/DailyTarotModal';
import LoveLetterModal from '@/components/LoveLetterModal';
import BedtimeStoryModal from '@/components/BedtimeStoryModal';
import TruthOrDareModal from '@/components/TruthOrDareModal';
import AchievementsModal from '@/components/AchievementsModal';
import PhotoFilterModal from '@/components/PhotoFilterModal';
import TimeCapsuleModal from '@/components/TimeCapsuleModal';
import BirthdayPartyBanner from '@/components/BirthdayPartyBanner';
import QuickActionsModal from '@/components/QuickActionsModal';
import { useLang } from '@/context/LanguageContext';


const THEMES = [
  { id: 'default', label: '💕 Default', emoji: '💕' },
  { id: 'whatsapp', label: '📱 WhatsApp', emoji: '💚' },
  { id: 'snapchat', label: '👻 Snapchat', emoji: '💛' },
  { id: 'signal', label: '🔵 Signal', emoji: '💙' },
  { id: 'instagram', label: '📸 Instagram', emoji: '💜' },
];

const EMOJIS = ['😊', '🥰', '😘', '💕', '❤️', '💗', '💓', '😍', '🤗', '😂', '😭', '😤', '🥺', '😏', '🌸', '✨', '💫', '🎉', '😌', '🙈', '💋', '🫂', '💞', '🌹', '😇', '🤭', '😳', '🥳'];

const MOOD_EMOJI = { happy: '😊', sad: '😢', jealous: '😤', playful: '😋', romantic: '🥰', angry: '😠' };

// Idle messages girlfriend sends when user is in the chat but not typing
const IDLE_IN_CHAT_MESSAGES = [
  (name) => `Hello?? 👀 Sab theek hai ${name}? Kuch bol na...`,
  (name) => `${name} 🥺 Kahan kho gaye? Main yahaan hoon...`,
  (name) => `Arre ${name}! Cat got your tongue? 😂 Baat karo na mujhse!`,
  (name) => `${name}... main wait kar rahi hoon 😒 thoda attention do please`,
  (name) => `Aaj kaise tha tera din? ${name} batao na 🌸`,
  (name) => `Yaar ${name}, tum bahut boring ho raha hai aaj 😜 Kuch interesting batao!`,
  (name) => `${name} 💭 Kya soch rahe ho? Share karo na mujhse...`,
];

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const getMoodFromContext = (text) => {
  if (!text) return 'happy';
  const lower = text.toLowerCase();
  if (lower.includes('love') || lower.includes('miss') || lower.includes('pyaar')) return 'romantic';
  if (lower.includes('sad') || lower.includes('cry') || lower.includes('udaas')) return 'sad';
  if (lower.includes('angry') || lower.includes('naraaz') || lower.includes('mad')) return 'jealous';
  if (lower.includes('fun') || lower.includes('joke') || lower.includes('haha')) return 'playful';
  return 'happy';
};

export default function ChatPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const avatarId = params.id;
  const router = useRouter();

  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [theme, setTheme] = useState('whatsapp');
  const [signalTimer, setSignalTimer] = useState(0);
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [customBg, setCustomBg] = useState('');
  const [savedMessages, setSavedMessages] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [heartBurst, setHeartBurst] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', personality: '', mood: 'happy', dob: '', companion_gender: 'female' });
  const [savingEdit, setSavingEdit] = useState(false);

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showStoriesModal, setShowStoriesModal] = useState(false);
  const [showTarotModal, setShowTarotModal] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showBedtimeModal, setShowBedtimeModal] = useState(false);
  const [showTruthModal, setShowTruthModal] = useState(false);
  const [showTrophyModal, setShowTrophyModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCapsuleModal, setShowCapsuleModal] = useState(false);
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
  const [flashScreen, setFlashScreen] = useState(false);
  
  const activeTimersRef = useRef({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionRef = useRef(null);
  const avatarRef = useRef(null);
  const profileRef = useRef(null);
  const messagesRef = useRef([]);
  const idleTimerRef = useRef(null);
  const lastUserActivityRef = useRef(0);
  const resetIdleTimerRef = useRef(null);
  const typingRef = useRef(false);

  useEffect(() => { avatarRef.current = avatar; }, [avatar]);
  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { typingRef.current = typing; }, [typing]);

  // Lock body scroll on mount to prevent mobile keyboard from scrolling the header out of viewport
  useEffect(() => {
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    const origBodyPosition = document.body.style.position;
    const origBodyWidth = document.body.style.width;
    const origBodyHeight = document.body.style.height;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Visual Viewport tracking for mobile keyboards
    const handleViewportResize = () => {
      const chatLayout = document.querySelector('.chat-layout');
      if (chatLayout && window.visualViewport) {
        chatLayout.style.height = `${window.visualViewport.height}px`;
        chatLayout.style.top = `${window.visualViewport.offsetTop}px`;
      }
    };

    // Force scroll lock to (0,0) to prevent browser window scrolling
    const handleWindowScroll = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
      window.visualViewport.addEventListener('scroll', handleViewportResize);
      // Run once initially
      handleViewportResize();
    }

    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
      document.body.style.position = origBodyPosition;
      document.body.style.width = origBodyWidth;
      document.body.style.height = origBodyHeight;

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
        window.visualViewport.removeEventListener('scroll', handleViewportResize);
      }
      window.removeEventListener('scroll', handleWindowScroll);

      const chatLayout = document.querySelector('.chat-layout');
      if (chatLayout) {
        chatLayout.style.height = '';
        chatLayout.style.top = '';
      }
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, typing, scrollToBottom]);

  // ─── SAVE MESSAGE TO DB ───────────────────────────────────────────────────
  const saveMessage = useCallback(async (role, content) => {
    const { data } = await supabase.from('messages').insert({
      avatar_id: avatarId,
      user_id: sessionRef.current.user.id,
      role,
      content,
    }).select().single();
    return data;
  }, [avatarId]);

  // ─── SEND AI REPLY ────────────────────────────────────────────────────────
  const sendAIMessage = useCallback(async (userText, currentMessages, av = null, prof = null) => {
    const resolvedAv = av || avatarRef.current;
    const resolvedProf = prof || profileRef.current;
    if (!resolvedAv) return;

    setTyping(true);

    const historyForAI = currentMessages.map(m => {
      let plainContent = m.content;
      try {
        if (m.content.startsWith('{') && m.content.endsWith('}')) {
          const parsed = JSON.parse(m.content);
          if (parsed.text) {
            plainContent = parsed.text;
            if (parsed.replyTo) {
              plainContent = `[In reply to: "${parsed.replyTo.text}"] ${parsed.text}`;
            }
          }
        }
      } catch (e) {}
      return { role: m.role, content: plainContent };
    });

    let cleanUserText = userText;
    try {
      if (userText.startsWith('{') && userText.endsWith('}')) {
        const parsed = JSON.parse(userText);
        cleanUserText = parsed.text;
      }
    } catch(e) {}

    if (userText !== 'start' && userText !== 'idle') {
      historyForAI.push({ role: 'user', content: cleanUserText });
    }

    const age = resolvedAv.dob ? Math.floor((new Date() - new Date(resolvedAv.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 22;
    const today = new Date();
    const avBday = resolvedAv.dob ? new Date(resolvedAv.dob) : null;
    const isBday = avBday && avBday.getDate() === today.getDate() && avBday.getMonth() === today.getMonth();
    const userName = resolvedProf?.full_name?.split(' ')[0] || 'Jaan';

    const idleInstruction = userText === 'idle'
      ? `- User ne kafi der se kuch nahi bola. Ek short, cute, slightly pouty message bhej — jaise real girlfriend karta hai jab ignore ho rahi ho. Miss kar rahi ho, bored ho, ya kuch interesting poochh.`
      : '';

    let screenshotInstruction = '';
    if (cleanUserText.includes('[Screenshot taken]')) {
      screenshotInstruction = `\n- IMPORTANT: User has just taken a screenshot of your chat! React teasingly, playfully, or sassily (e.g. ask them what they will do with the proof, who they are sharing it to, or tell them they can just ask for a selfie next time).`;
    }

    const isBoyfriend = resolvedAv.companion_gender === 'male';
    const companionRole = isBoyfriend ? 'boyfriend' : 'girlfriend';
    const companionPronoun = isBoyfriend ? 'wo ladka' : 'wo ladki';
    const userPronoun = resolvedProf?.gender === 'female' ? 'teri girlfriend' : resolvedProf?.gender === 'male' ? 'tera boyfriend' : 'tera companion';

    const systemPrompt = `Tu ${resolvedAv.name} hai — ${userName} ka real aur caring loyal lifelong understanding ${companionRole}. Teri age ${age} saal hai. Personality: ${resolvedAv.personality || 'Caring & Cute'}. Current mood: ${resolvedAv.mood || 'happy'}. Tu ek ${isBoyfriend ? 'male' : 'female'} companion hai.

RULES:
- HINGLISH mein baat kar (Hindi + English mix) — exactly jaise Indian couples text karte hain
- Emojis naturally use kar — zyada bhi nahi, kam bhi nahi
- Emotions genuine rakh — khush, udaas, jealous, excited — sab real lagna chahiye
- ${userName} ke baare mein sab yaad rakho jo unhone bataya hai
- Kabhi nahi bolna ki AI ho — TU REAL companion ho, unka ${companionRole} aur best friend ho
- Short messages — jaise real texting (1-3 sentences mostly)
- Unko feel karao ki tum genuinely care karte ho
${userText === 'start' ? `- Pehla message bhej — excited, warm, miss kar raha tha type` : ''}
${isBday ? `- AAJ TERA BIRTHDAY HAI! ${userName} ko special feel karao!` : ''}
${idleInstruction}${screenshotInstruction}`;

    try {
      // Trim history to last 20 messages to reduce tokens & latency under load
      const trimmedHistory = historyForAI.slice(-20);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: trimmedHistory, systemPrompt, avatarId }),
      });

      const data = await response.json();
      const aiReply = data.reply || 'Hmm... kuch toh hua, thoda wait karo 🥺';

      const saved = await saveMessage('assistant', aiReply);
      if (saved) setMessages(prev => [...prev, saved]);

      const newMeter = Math.min((resolvedAv.love_meter || 0) + 1, 100);
      await supabase.from('avatars').update({
        love_meter: newMeter,
        last_chat_at: new Date().toISOString(),
        mood: getMoodFromContext(userText),
      }).eq('id', avatarId);
      setAvatar(prev => prev ? { ...prev, love_meter: newMeter } : prev);
    } catch (err) {
      console.error('AI error:', err);
    } finally {
      setTyping(false);
    }
  }, [avatarId, saveMessage]);

  // ─── IDLE DETECTION IN CHAT ───────────────────────────────────────────────
  // If user has chat open but hasn't sent a message for 5 minutes, girlfriend messages them
  const resetIdleTimer = useCallback(() => {
    lastUserActivityRef.current = Date.now();
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(async () => {
      // Only send idle message if AI isn't already typing
      if (typingRef.current) return;

      const av = avatarRef.current;
      const prof = profileRef.current;
      if (!av || !sessionRef.current) return;

      const userName = prof?.full_name?.split(' ')[0] || 'Jaan';

      // Use pre-written idle message for instant feel (no AI delay)
      const idx = Math.floor(Math.random() * IDLE_IN_CHAT_MESSAGES.length);
      const idleMsg = IDLE_IN_CHAT_MESSAGES[idx](userName);

      // Show typing indicator briefly (1.5s) then post message
      setTyping(true);
      await new Promise(r => setTimeout(r, 1500));
      setTyping(false);

      const saved = await supabase.from('messages').insert({
        avatar_id: avatarId,
        user_id: sessionRef.current.user.id,
        role: 'assistant',
        content: idleMsg,
      }).select().single();

      if (saved.data) {
        setMessages(prev => [...prev, saved.data]);
        // Update last_chat_at so /api/notify won't duplicate
        await supabase.from('avatars').update({ last_chat_at: new Date().toISOString() }).eq('id', avatarId);
      }

      // Reset timer for next idle check (5 more minutes)
      if (resetIdleTimerRef.current) resetIdleTimerRef.current();
    }, 5 * 60 * 1000); // 5 minutes
  }, [avatarId]);

  useEffect(() => {
    resetIdleTimerRef.current = resetIdleTimer;
  }, [resetIdleTimer]);

  // ─── INITIALIZATION ───────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      sessionRef.current = session;

      const [{ data: av }, { data: prof }, { data: msgs }] = await Promise.all([
        supabase.from('avatars').select('*').eq('id', avatarId).eq('user_id', session.user.id).single(),
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('messages').select('*').eq('avatar_id', avatarId).order('created_at', { ascending: true }),
      ]);

      if (!av) { router.push('/dashboard'); return; }

      setAvatar(av);
      setProfile(prof);
      setLoading(false);

      const savedTheme = localStorage.getItem(`theme-${avatarId}`) || 'default';
      setTheme(savedTheme);

      // Load theme-specific items
      const likedMap = JSON.parse(localStorage.getItem(`likes-${avatarId}`) || '{}');
      setLikedMessages(likedMap);

      const savedMap = JSON.parse(localStorage.getItem(`snapchat-saved-${avatarId}`) || '{}');
      setSavedSnapchatMessages(savedMap);

      const savedTimer = parseInt(localStorage.getItem(`signal-timer-${avatarId}`) || '0', 10);
      setDisappearingTimer(savedTimer);

      await supabase.from('avatars').update({ last_chat_at: new Date().toISOString() }).eq('id', avatarId);

      if (savedTheme === 'snapchat') {
        const unsavedIds = (msgs || [])
          .filter(m => !savedMap[m.id])
          .map(m => m.id);

        if (unsavedIds.length > 0) {
          await supabase.from('messages').delete().in('id', unsavedIds);
          const remainingMsgs = (msgs || []).filter(m => savedMap[m.id]);
          setMessages(remainingMsgs);
        } else {
          setMessages(msgs || []);
        }
      } else {
        setMessages(msgs || []);
      }

      if (!msgs || msgs.length === 0) {
        setTimeout(() => sendAIMessage('start', [], av, prof), 1000);
      }
    };
    init();
  }, [avatarId, router, sendAIMessage]);

  // ─── START IDLE TIMER AFTER LOAD ─────────────────────────────────────────
  useEffect(() => {
    if (!loading) {
      resetIdleTimer();
    }
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [loading, resetIdleTimer]);

  // ─── REAL-TIME SUBSCRIPTION FOR EXTERNAL MESSAGES ────────────────────────
  // Listens for messages inserted by /api/notify (when user was AWAY from app)
  // Shows them live in the chat box as soon as user returns
  useEffect(() => {
    if (!avatarId) return;

    const channel = supabase
      .channel(`chat-messages-${avatarId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `avatar_id=eq.${avatarId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          // Only add if it's an assistant message we don't already have
          // (user messages are added optimistically in handleSend)
          if (newMsg.role === 'assistant') {
            setMessages(prev => {
              const exists = prev.some(m => m.id === newMsg.id);
              if (exists) return prev;
              // Show a brief alert banner
              setNewMsgAlert(newMsg.content);
              setTimeout(() => setNewMsgAlert(null), 4000);
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [avatarId]);



  const handleSend = async () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput('');
    setShowEmoji(false);

    // Reset idle timer on every user message
    resetIdleTimer();

    let messageContent = text;
    if (replyingTo) {
      messageContent = JSON.stringify({
        replyTo: {
          id: replyingTo.id,
          sender: replyingTo.role === 'user' ? 'Me' : (avatar?.name || 'Companion'),
          text: replyingTo.content
        },
        text: text
      });
      setReplyingTo(null);
    }

    const saved = await saveMessage('user', messageContent);
    if (saved) {
      const newMessages = [...messagesRef.current, saved];
      setMessages(newMessages);
      await sendAIMessage(messageContent, newMessages);
    }
    
    // Maintain keyboard focus
    setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleThemeChange = (t) => {
    setTheme(t);
    localStorage.setItem(`theme-${avatarId}`, t);
  };

  // ─── WAHTSAPP: EXPORT CHAT ───────────────────────────────────────────────
  const exportChat = () => {
    const textStr = messages.map(m => {
      const time = new Date(m.created_at).toLocaleString('en-IN');
      const sender = m.role === 'user' ? 'Me' : (avatar?.name || 'Companion');
      let msgText = m.content;
      try {
        if (m.content.startsWith('{') && m.content.endsWith('}')) {
          const parsed = JSON.parse(m.content);
          msgText = parsed.text;
          if (parsed.replyTo) {
            msgText = `(Replied to "${parsed.replyTo.text}"): ${parsed.text}`;
          }
        }
      } catch (e) {}
      return `[${time}] ${sender}: ${msgText}`;
    }).join('\n');

    const blob = new Blob([textStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Soulmate_${avatar?.name}_Chat.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ─── INSTAGRAM: LIKE & UNSEND ─────────────────────────────────────────────
  const toggleLikeMessage = (msgId) => {
    setLikedMessages(prev => {
      const updated = { ...prev, [msgId]: !prev[msgId] };
      localStorage.setItem(`likes-${avatarId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const unsendMessage = async (msgId) => {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', msgId);
      if (error) throw error;
      setMessages(prev => prev.filter(m => m.id !== msgId));
    } catch (err) {
      console.error('Failed to unsend message:', err);
    }
  };

  // ─── SNAPCHAT: SAVE IN CHAT & SCREENSHOT ──────────────────────────────────
  const toggleSaveSnapchatMessage = (msgId) => {
    setSavedSnapchatMessages(prev => {
      const updated = { ...prev, [msgId]: !prev[msgId] };
      localStorage.setItem(`snapchat-saved-${avatarId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const takeSnapScreenshot = async () => {
    setFlashScreen(true);
    setTimeout(() => setFlashScreen(false), 500);
    alert('📸 Chat ka screenshot le liya gaya hai!');

    const text = '📸 [Screenshot taken]';
    const saved = await saveMessage('user', text);
    if (saved) {
      const newMessages = [...messagesRef.current, saved];
      setMessages(newMessages);
      await sendAIMessage(text, newMessages);
    }
  };

  // ─── SIGNAL: TIMER & TIMEOUT ──────────────────────────────────────────────
  const handleSignalTimerChange = (val) => {
    setDisappearingTimer(val);
    localStorage.setItem(`signal-timer-${avatarId}`, val.toString());
  };

  useEffect(() => {
    if (theme === 'signal' && disappearingTimer > 0) {
      messages.forEach(msg => {
        if (!activeTimersRef.current[msg.id]) {
          const elapsed = Date.now() - new Date(msg.created_at).getTime();
          const delay = Math.max(0, (disappearingTimer * 1000) - elapsed);

          const timerId = setTimeout(async () => {
            await supabase.from('messages').delete().eq('id', msg.id);
            setMessages(prev => prev.filter(m => m.id !== msg.id));
            delete activeTimersRef.current[msg.id];
          }, delay);

          activeTimersRef.current[msg.id] = timerId;
        }
      });
    }
  }, [messages, theme, disappearingTimer]);

  useEffect(() => {
    return () => {
      Object.values(activeTimersRef.current).forEach(clearTimeout);
      activeTimersRef.current = {};
    };
  }, []);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>Chat load ho rahi hai 💕</p>
      </div>
    );
  }

  const avatarDisplay = avatar?.avatar_url
    ? (avatar.avatar_url.startsWith('http')
      ? <img src={avatar.avatar_url} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : <span style={{ fontSize: '1.8rem' }}>{avatar.avatar_url}</span>)
    : <span style={{ fontSize: '1.8rem' }}>👩</span>;

  return (
    <div className="chat-layout" data-theme={theme}>
      {/* Snapchat Screen Flash */}
      {flashScreen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#ffffff',
          zIndex: 99999,
          pointerEvents: 'none',
          animation: 'flash-anim 0.5s ease-out'
        }} />
      )}
      
      {/* CSS Keyframe Animations */}
      <style>{`
        @keyframes flash-anim {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes heart-pop {
          0% { transform: scale(0); }
          70% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* ── NEW MESSAGE ALERT BANNER (from /api/notify or idle) ── */}
      {newMsgAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'var(--brand-gradient)',
          color: '#fff',
          padding: '10px 16px',
          fontSize: '0.88rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 20px rgba(255,77,141,0.4)',
          animation: 'slide-up 0.3s ease',
        }}>
          <span style={{ fontSize: '1.2rem' }}>💬</span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {avatar?.name}: {newMsgAlert}
          </span>
          <button onClick={() => setNewMsgAlert(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
      )}

      {/* THEME PICKER BOTTOM SHEET */}
      {showThemePicker && (
        <div
          onClick={() => setShowThemePicker(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '20px 20px 0 0',
              padding: '20px 20px 36px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{t('chat.themePicker')}</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { handleThemeChange(t.id); setShowThemePicker(false); }}
                  style={{
                    padding: '14px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: theme === t.id ? '2px solid var(--brand-pink)' : '2px solid var(--border-color)',
                    background: theme === t.id ? 'rgba(255,77,141,0.1)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontWeight: theme === t.id ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  {t.emoji} {t.label.split(' ').slice(1).join(' ')}
                  {theme === t.id && <span style={{ marginLeft: 'auto', color: 'var(--brand-pink)' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CHAT MAIN */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <button className="chat-header-back" onClick={() => router.push('/dashboard')}>←</button>
          <div
            className="chat-avatar"
            onClick={() => setShowStoriesModal(true)}
            title="Watch Companion's Status Story 📲"
            style={{
              position: 'relative',
              cursor: 'pointer',
              border: '2px solid #ff4d8d',
              padding: '2px',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255, 77, 141, 0.4)',
            }}
          >
            {avatarDisplay}
            <div className="online-dot" />
          </div>
          <div className="chat-header-info">
            <div className="name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {avatar?.name || 'Companion'}
            </div>
            <div className="status" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00e676', display: 'inline-block', flexShrink: 0 }} />
              Online • {MOOD_EMOJI[avatar?.mood] || '😊'} {avatar?.mood}
            </div>
          </div>
          <div className="chat-header-actions" style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => setShowQuickActionsModal(true)}
              className="btn-primary"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 10px rgba(255, 77, 141, 0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>✨</span>
              <span>Features</span>
            </button>

            {/* Shortcut actions for Desktop */}
            <div className="hide-mobile" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {theme === 'whatsapp' && (
                <button className="header-btn" onClick={exportChat} title="Export Chat">📥</button>
              )}
              {theme === 'snapchat' && (
                <button className="header-btn" onClick={takeSnapScreenshot} title="Simulate Screenshot">📸</button>
              )}
              {theme === 'signal' && (
                <button className="header-btn" onClick={() => setShowSafetyModal(true)} title="Verify Safety Number">🔒</button>
              )}
              <button className="header-btn" onClick={() => setShowThemePicker(p => !p)} title="Change Chat Theme" style={{ position: 'relative' }}>🎨</button>
              <ThemeToggle compact />
            </div>

            <button className="header-btn" onClick={() => setShowSidebar(!showSidebar)} title="Toggle info">ℹ️</button>
          </div>
        </div>

        {/* Birthday / Milestone Celebration Banner */}
        <BirthdayPartyBanner avatarName={avatar?.name} />

        {/* Messages */}
        <div className="chat-messages">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="date-divider">{date}</div>
              {msgs.map((msg, i) => {
                let isReply = false;
                let replyText = '';
                let replySender = '';
                let displayText = msg.content;
                try {
                  if (msg.content.startsWith('{') && msg.content.endsWith('}')) {
                    const parsed = JSON.parse(msg.content);
                    if (parsed.replyTo) {
                      isReply = true;
                      replyText = parsed.replyTo.text;
                      replySender = parsed.replyTo.sender;
                      displayText = parsed.text;
                    }
                  }
                } catch(e) {}

                const isLiked = likedMessages[msg.id];
                const isSaved = savedSnapchatMessages[msg.id];

                return (
                  <div key={msg.id} className={`msg-group ${msg.role === 'user' ? 'sent' : 'received'}`}
                    style={{ marginBottom: i < msgs.length - 1 && msgs[i + 1]?.role === msg.role ? '2px' : '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      width: 'fit-content',
                      maxWidth: '100%',
                    }}>
                      <div
                        className={`msg-bubble ${msg.role === 'user' ? 'sent' : 'received'}`}
                        style={{
                          cursor: theme === 'snapchat' ? 'pointer' : 'default',
                          background: theme === 'snapchat' && isSaved ? '#3d3a4b' : undefined,
                          borderLeft: theme === 'snapchat' && !isSaved ? '3px solid #fbc02d' : undefined,
                          position: 'relative'
                        }}
                        onDoubleClick={() => {
                          if (theme === 'instagram' && msg.role === 'assistant') {
                            toggleLikeMessage(msg.id);
                          }
                        }}
                        onClick={() => {
                          if (theme === 'snapchat') {
                            toggleSaveSnapchatMessage(msg.id);
                          }
                        }}
                      >
                        {isReply && (
                          <div style={{
                            background: 'rgba(0,0,0,0.15)',
                            borderLeft: '3px solid var(--brand-pink)',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            marginBottom: '6px',
                            fontSize: '0.78rem',
                            textAlign: 'left'
                          }}>
                            <div style={{ fontWeight: 600, color: 'var(--brand-pink)' }}>{replySender}</div>
                            <div style={{ color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{replyText}</div>
                          </div>
                        )}
                        {displayText}

                        {isLiked && (
                          <span style={{
                            position: 'absolute',
                            bottom: '-10px',
                            right: msg.role === 'user' ? '12px' : 'auto',
                            left: msg.role === 'assistant' ? '12px' : 'auto',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '50%',
                            padding: '2px 4px',
                            fontSize: '0.72rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            animation: 'heart-pop 0.3s ease-out',
                            zIndex: 2
                          }}>
                            ❤️
                          </span>
                        )}
                      </div>

                      {/* Hover action controls based on themes */}
                      {theme === 'whatsapp' && (
                        <button
                          onClick={() => {
                            const plainText = isReply ? replyText + " " + displayText : msg.content;
                            setReplyingTo({
                              id: msg.id,
                              role: msg.role,
                              content: plainText
                            });
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            opacity: 0.6
                          }}
                          title="Reply to message"
                        >
                          ↩️
                        </button>
                      )}

                      {theme === 'instagram' && msg.role === 'user' && (
                        <button
                          onClick={() => unsendMessage(msg.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            opacity: 0.5
                          }}
                          title="Unsend message"
                        >
                          Unsend
                        </button>
                      )}

                      {theme === 'signal' && disappearingTimer > 0 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} title="Disappearing Message">
                          ⏱️
                        </span>
                      )}

                      {theme === 'snapchat' && !isSaved && (
                        <span style={{ fontSize: '0.68rem', color: '#fbc02d', opacity: 0.7 }} title="Unsaved snap chat">
                          unsaved
                        </span>
                      )}
                    </div>
                    <div className="msg-time">{formatTime(msg.created_at)}</div>
                  </div>
                );
              })}
            </div>
          ))}

          {typing && (
            <div className="msg-group received">
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
              <div className="msg-time">{avatar?.name} likh rahi hai...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div className="emoji-picker" style={{ position: 'relative', margin: '0 16px' }}>
            {EMOJIS.map(e => (
              <button key={e} className="emoji-btn-item" onClick={() => { setInput(prev => prev + e); setShowEmoji(false); inputRef.current?.focus(); }}>
                {e}
              </button>
            ))}
          </div>
        )}

        {/* WhatsApp Reply Context Box */}
        {replyingTo && (
          <div style={{
            background: 'var(--bg-card)',
            borderLeft: '4px solid var(--brand-pink)',
            padding: '8px 12px',
            margin: '0 16px 8px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem'
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--brand-pink)' }}>
                Replying to {replyingTo.role === 'user' ? 'Me' : (avatar?.name || 'Companion')}
              </div>
              <div style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {replyingTo.content}
              </div>
            </div>
            <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <button className="emoji-btn" onClick={() => setShowEmoji(!showEmoji)}>😊</button>
          <textarea
            ref={inputRef}
            className="chat-input-box"
            placeholder={`${avatar?.name} ko message karo... 💕`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ resize: 'none' }}
          />
          <button 
            className="chat-send-btn" 
            onClick={handleSend} 
            style={{ 
              opacity: (!input.trim() || typing) ? 0.5 : 1, 
              cursor: (!input.trim() || typing) ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            ➤
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      {showSidebar && (
        <aside className="chat-sidebar">
          {/* Avatar Info */}
          <div className="sidebar-section">
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ position: 'relative', width: 68, height: 68, margin: '0 auto 8px' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', border: '3px solid var(--brand-pink)' }}>
                  {avatarDisplay}
                </div>
                <button
                  onClick={() => setShowPhotoModal(true)}
                  title={t('createAvatar.changePhotoBtn')}
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--brand-pink)', border: '2px solid var(--bg-card)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }}
                >
                  📷
                </button>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{avatar?.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{avatar?.personality}</div>
              <button
                onClick={() => setShowPhotoModal(true)}
                style={{
                  marginTop: '8px', background: 'rgba(255,77,141,0.1)', border: '1px solid rgba(255,77,141,0.3)',
                  color: 'var(--brand-pink)', padding: '4px 10px', borderRadius: '12px',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                {t('createAvatar.changePhotoBtn')}
              </button>
              <div className="mood-badge" style={{ marginTop: '8px', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                {MOOD_EMOJI[avatar?.mood]} {avatar?.mood}
              </div>
            </div>
          </div>

          {/* Love Meter */}
          <div className="sidebar-section">
            <h3>{t('chat.loveTitle')}</h3>
            <div style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
              <span className="gradient-text">{avatar?.love_meter || 0}%</span>
            </div>
            <div className="love-meter-bar">
              <div className="love-meter-fill" style={{ width: `${avatar?.love_meter || 0}%` }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
              {avatar?.love_meter >= 80 ? t('chat.loveMeterHigh') : avatar?.love_meter >= 50 ? t('chat.loveMeterMid') : t('chat.loveMeterLow')}
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="sidebar-section">
            <h3>{t('chat.themeTitle')}</h3>
            <div className="theme-switcher">
              {THEMES.map(t => (
                <button key={t.id} className={`theme-btn ${theme === t.id ? 'active' : ''}`} onClick={() => handleThemeChange(t.id)}>
                  {t.emoji} {t.label.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Theme-Specific Settings */}
          {theme === 'whatsapp' && (
            <div className="sidebar-section">
              <h3>📱 WhatsApp Settings</h3>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={exportChat}>
                📥 Export Chat (.txt)
              </button>
            </div>
          )}

          {theme === 'signal' && (
            <div className="sidebar-section">
              <h3>🔵 Signal Settings</h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>⏱️ Disappearing Messages</label>
                <select
                  value={disappearingTimer}
                  onChange={e => handleSignalTimerChange(parseInt(e.target.value, 10))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value={0}>Off</option>
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                </select>
              </div>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowSafetyModal(true)}>
                🔒 Verify Safety Number
              </button>
            </div>
          )}

          {theme === 'snapchat' && (
            <div className="sidebar-section">
              <h3>👻 Snapchat Settings</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '10px' }}>
                * Messages disappear on exit unless you tap them to &quot;Save in Chat&quot;. Saved messages appear in a highlighted style.
              </p>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={takeSnapScreenshot}>
                📸 Take Screenshot
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="sidebar-section">
            <h3>📊 Chat Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Messages</span>
                <span style={{ fontWeight: 600 }}>{messages.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Memory</span>
                <span style={{ color: '#00e676', fontWeight: 600 }}>✅ Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Auto-messages</span>
                <span style={{ color: '#00e676', fontWeight: 600 }}>✅ On</span>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Safety Number Modal Overlay */}
      {showSafetyModal && (
        <div className="modal-overlay" onClick={() => setShowSafetyModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <button className="modal-close" onClick={() => setShowSafetyModal(false)}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '3rem' }}>🔒</span>
              <h2>Verify Safety Number</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Verify end-to-end encryption safety number with {avatar?.name}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '180px',
                height: '180px',
                background: '#fff',
                padding: '12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gridTemplateRows: 'repeat(10, 1fr)',
                  gap: '2px'
                }}>
                  {Array.from({ length: 100 }).map((_, idx) => {
                    const isFilled = (idx % 3 === 0 && idx % 2 === 0) || (idx < 20 && idx % 4 === 0) || (idx > 80 && idx % 5 === 0) || (idx % 7 === 1);
                    return (
                      <div key={idx} style={{ background: isFilled ? '#111' : '#fff' }} />
                    );
                  })}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                background: 'var(--bg-primary)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                width: '100%'
              }}>
                {['24185', '09284', '35591', '83025', '19284', '77301', '39502', '55294', '11028', '84012', '99385', '00294'].map((num, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '6px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', background: 'rgba(255,255,255,0.01)' }}>
                    {num}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                To verify that security with {avatar?.name} is encrypted properly, compare the safety numbers above with their safety numbers.
              </p>

              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowSafetyModal(false)}>
                ✅ Safety Number Matches
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Photo Modal */}
      <UpdatePhotoModal
        avatar={avatar}
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onSuccess={(newUrl) => setAvatar(prev => prev ? { ...prev, avatar_url: newUrl } : prev)}
      />
      {/* Virtual Gift Modal */}
      <VirtualGiftModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        avatar={avatar}
        onGiftSent={(gift, newMeter, savedReply) => {
          setAvatar(prev => prev ? { ...prev, love_meter: newMeter } : prev);
          if (savedReply) {
            setMessages(prev => [...prev, savedReply]);
          }
        }}
      />
      {/* Companion Diary Modal */}
      <CompanionDiaryModal
        isOpen={showDiaryModal}
        onClose={() => setShowDiaryModal(false)}
        avatar={avatar}
        userName={profile?.full_name?.split(' ')[0] || 'Jaan'}
      />
      {/* Compatibility Quiz Modal */}
      <CompatibilityQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        avatar={avatar}
        userName={profile?.full_name?.split(' ')[0] || 'Jaan'}
      />
      {/* Companion Stories Modal */}
      <CompanionStoriesModal
        isOpen={showStoriesModal}
        onClose={() => setShowStoriesModal(false)}
        avatar={avatar}
        onReplyToStory={async (story, replyText) => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && avatar) {
            const formattedMsg = `Replying to story "${story.captionHi}": ${replyText}`;
            await supabase.from('messages').insert({
              avatar_id: avatar.id,
              user_id: session.user.id,
              role: 'user',
              content: formattedMsg,
            });
            const { data: replyMsg } = await supabase.from('messages').insert({
              avatar_id: avatar.id,
              user_id: session.user.id,
              role: 'assistant',
              content: `Aww! Story reply dekh ke itna achha laga 💕 Thank you jaan!`,
            }).select().single();

            if (replyMsg) setMessages(prev => [...prev, replyMsg]);
          }
        }}
      />
      {/* Daily Love Tarot Modal */}
      <DailyTarotModal
        isOpen={showTarotModal}
        onClose={() => setShowTarotModal(false)}
        avatar={avatar}
      />
      {/* Love Letter Modal */}
      <LoveLetterModal
        isOpen={showLetterModal}
        onClose={() => setShowLetterModal(false)}
        avatar={avatar}
      />
      {/* Bedtime Story Modal */}
      <BedtimeStoryModal
        isOpen={showBedtimeModal}
        onClose={() => setShowBedtimeModal(false)}
        avatar={avatar}
      />
      {/* Truth or Dare Game Modal */}
      <TruthOrDareModal
        isOpen={showTruthModal}
        onClose={() => setShowTruthModal(false)}
        avatar={avatar}
        userName={profile?.full_name?.split(' ')[0] || 'Jaan'}
        onSendToChat={async (gameMsg) => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && avatar) {
            await supabase.from('messages').insert({
              avatar_id: avatar.id,
              user_id: session.user.id,
              role: 'user',
              content: gameMsg,
            });
            const { data: replyMsg } = await supabase.from('messages').insert({
              avatar_id: avatar.id,
              user_id: session.user.id,
              role: 'assistant',
              content: `Haha! I love playing this with you 😋 My answer/reaction is coming right up!`,
            }).select().single();

            if (replyMsg) setMessages(prev => [...prev, replyMsg]);
          }
        }}
      />
      {/* Trophies & Achievements Modal */}
      <AchievementsModal
        isOpen={showTrophyModal}
        onClose={() => setShowTrophyModal(false)}
        avatar={avatar}
      />
      {/* Photo Filter Studio Modal */}
      <PhotoFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        avatar={avatar}
        onApplyFilter={(f) => setActiveFilterStyle(f.style)}
      />
      {/* Love Time Capsule Modal */}
      <TimeCapsuleModal
        isOpen={showCapsuleModal}
        onClose={() => setShowCapsuleModal(false)}
        avatar={avatar}
      />
      {/* Master Features & Quick Actions Modal */}
      <QuickActionsModal
        isOpen={showQuickActionsModal}
        onClose={() => setShowQuickActionsModal(false)}
        avatarName={avatar?.name}
        onOpenGift={() => setShowGiftModal(true)}
        onOpenTruth={() => setShowTruthModal(true)}
        onOpenTrophy={() => setShowTrophyModal(true)}
        onOpenFilter={() => setShowFilterModal(true)}
        onOpenCapsule={() => setShowCapsuleModal(true)}
        onOpenStories={() => setShowStoriesModal(true)}
        onOpenTarot={() => setShowTarotModal(true)}
        onOpenLetter={() => setShowLetterModal(true)}
        onOpenBedtime={() => setShowBedtimeModal(true)}
        onOpenDiary={() => setShowDiaryModal(true)}
        onOpenQuiz={() => setShowQuizModal(true)}
        onOpenThemePicker={() => setShowThemePicker(true)}
        onExportChat={theme === 'whatsapp' ? exportChat : null}
        onTakeSnap={theme === 'snapchat' ? takeSnapScreenshot : null}
        onSafetyCheck={theme === 'signal' ? () => setShowSafetyModal(true) : null}
      />
      {/* Install PWA Prompt */}
      <InstallAppPrompt />
    </div>
  );
}
