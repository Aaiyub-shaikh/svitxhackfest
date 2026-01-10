import { t } from '../i18n.js';
import { AssistantAPI } from '../api.js';
import { getCurrentUser } from '../auth.js';

export function initChatWidget() {
  if (document.getElementById('chatFab')) return;
  const fab = document.createElement('button');
  fab.id = 'chatFab';
  fab.className = 'chat-fab';
  fab.setAttribute('aria-label', t('chat.title'));
  fab.innerHTML = '<img alt="" src="./assets/icons/chat.svg" width="20" height="20" />';

  const panel = document.createElement('div');
  panel.id = 'chatPanel';
  panel.className = 'chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', t('chat.title'));
  panel.innerHTML = `
    <div class="p-3 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold" data-i18n="chat.title">${t('chat.title')}</h2>
        <button id="chatClose" class="px-2 py-1 text-sm text-gray-600 hover:text-black" aria-label="Close">✕</button>
      </div>
      <div id="chatList" class="max-h-64 overflow-auto space-y-2 text-sm"></div>
      <div class="flex items-stretch gap-2">
        <input id="chatInput" class="flex-1 px-3 py-2 border rounded" data-i18n-placeholder="chat.input.placeholder" placeholder="${t('chat.input.placeholder')}">
        <button id="chatMic" class="px-3 py-2 rounded bg-gray-100" title="${t('chat.mic')}" aria-label="${t('chat.mic')}">🎙️</button>
        <button id="chatSend" class="px-3 py-2 rounded bg-green-600 text-white" data-i18n="chat.send">${t('chat.send')}</button>
      </div>
    </div>`;

  document.body.append(fab, panel);

  let recognition = null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }

  const chatList = panel.querySelector('#chatList');
  const chatInput = panel.querySelector('#chatInput');
  const chatSend = panel.querySelector('#chatSend');
  const chatMic = panel.querySelector('#chatMic');
  const chatClose = panel.querySelector('#chatClose');

  function appendMsg(role, text) {
    const el = document.createElement('div');
    el.className = role === 'user' ? 'text-right' : 'text-left';
    el.innerHTML = `<div class="inline-block px-3 py-2 rounded-2xl ${role==='user'?'bg-green-600 text-white':'bg-gray-100'}">${text}</div>`;
    chatList.appendChild(el);
    chatList.scrollTop = chatList.scrollHeight;
  }

  function saveHistory() {
    const msgs = Array.from(chatList.children).map(div => div.innerText).slice(-10);
    sessionStorage.setItem('sf_chat_msgs', JSON.stringify(msgs));
  }
  function loadHistory() {
    try { const msgs = JSON.parse(sessionStorage.getItem('sf_chat_msgs')||'[]'); msgs.forEach((text, idx) => appendMsg(idx%2===0?'user':'assistant', text)); } catch {}
  }

  function tts(text) {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-IN';
      window.speechSynthesis.speak(u);
    }
  }

  async function sendMessage(text, audioBlob) {
    const user = getCurrentUser();
    appendMsg('user', text || '[voice]');
    saveHistory();
    try {
      let inputAudioUrl;
      if (!text && audioBlob) {
        // Fallback: inline data URL (server should parse if supported)
        const buf = await audioBlob.arrayBuffer();
        const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
        inputAudioUrl = `data:audio/webm;base64,${b64}`;
      }
      const res = await AssistantAPI.message({ userId: user?.id || 'guest', inputText: text, inputLang: 'en', inputAudioUrl });
      const reply = res?.replyText || '...';
      appendMsg('assistant', reply);
      saveHistory();
      if (res?.ttsUrl) {
        const audio = new Audio(res.ttsUrl);
        audio.play().catch(()=>{});
      } else {
        tts(reply);
      }
    } catch (e) {
      appendMsg('assistant', `Error: ${e.message}`);
    }
  }

  fab.addEventListener('click', () => { panel.classList.add('open'); panel.querySelector('#chatInput').focus(); loadHistory(); });
  chatClose.addEventListener('click', () => { panel.classList.remove('open'); fab.focus(); });
  chatSend.addEventListener('click', () => { const v = chatInput.value.trim(); if (v) { chatInput.value=''; sendMessage(v); } });
  chatInput.addEventListener('keydown', (e) => { if (e.key==='Enter') chatSend.click(); });

  if (recognition) {
    chatMic.addEventListener('click', () => {
      recognition.start();
    });
    recognition.onresult = (ev) => {
      const transcript = Array.from(ev.results).map(r => r[0].transcript).join(' ');
      sendMessage(transcript);
    };
  } else if (navigator.mediaDevices?.getUserMedia) {
    // Fallback to recording and sending audio
    chatMic.addEventListener('click', async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks = [];
      rec.ondataavailable = e => chunks.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        sendMessage('', blob);
      };
      rec.start();
      setTimeout(() => rec.stop(), 3000);
    });
  } else {
    chatMic.disabled = true;
    chatMic.title = 'Microphone not supported';
  }
}
