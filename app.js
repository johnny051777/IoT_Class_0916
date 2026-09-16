/**
 * Aura Chronos - Personal Dashboard & Time+ Hub
 * Real-time precision clock, profile management, and productivity tools
 */

(function () {
  'use strict';

  // --- Storage Keys ---
  const STORAGE_KEYS = {
    USER_NAME: 'aura_user_name',
    USER_TAGLINE: 'aura_user_tagline',
    STATUS_INDEX: 'aura_status_index',
    AVATAR_THEME_INDEX: 'aura_avatar_theme_index',
    TIME_FORMAT_24H: 'aura_time_format_24h',
    THEME: 'aura_theme',
    SCRATCHPAD: 'aura_scratchpad',
    BOOKMARKS: 'aura_bookmarks'
  };

  // --- Theme Palettes ---
  const THEMES = ['theme-obsidian', 'theme-cyber', 'theme-sunset', 'theme-emerald'];
  const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #6366f1, #06b6d4)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
    'linear-gradient(135deg, #f97316, #ef4444)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #eab308, #f97316)'
  ];

  // --- Status Options ---
  const STATUSES = [
    { text: 'In the Flow', color: '#10b981' },
    { text: 'Deep Focus', color: '#8b5cf6' },
    { text: 'Available', color: '#06b6d4' },
    { text: 'Taking a Break', color: '#f59e0b' },
    { text: 'Brainstorming', color: '#ec4899' }
  ];

  // --- World Clock Cities ---
  const WORLD_CITIES = [
    { name: 'Tokyo', zone: 'Asia/Tokyo', flag: '🇯🇵' },
    { name: 'Singapore', zone: 'Asia/Singapore', flag: '🇸🇬' },
    { name: 'London', zone: 'Europe/London', flag: '🇬🇧' },
    { name: 'New York', zone: 'America/New_York', flag: '🇺🇸' },
    { name: 'San Francisco', zone: 'America/Los_Angeles', flag: '🇺🇸' }
  ];

  // --- Inspiring Quotes on Time ---
  const TIME_QUOTES = [
    { text: 'Time is what we want most, but what we use worst.', author: 'William Penn' },
    { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { text: 'Do not wait; the time will never be "just right".', author: 'Napoleon Hill' },
    { text: 'Time and health are two precious assets that we don’t recognize until they are depleted.', author: 'Denis Waitley' },
    { text: 'You may delay, but time will not.', author: 'Benjamin Franklin' },
    { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' }
  ];

  // --- Default Quick Links ---
  const DEFAULT_BOOKMARKS = [
    { title: 'IoT Class Repo', url: 'https://github.com/johnny051777/IoT_Class_0916', icon: '🐙' },
    { title: 'GitHub Profile', url: 'https://github.com/johnny051777', icon: '👤' },
    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📚' },
    { title: 'DevDocs', url: 'https://devdocs.io', icon: '⚡' }
  ];

  // --- DOM Elements ---
  const el = {
    // Top Nav
    statusPill: document.getElementById('status-pill'),
    statusText: document.getElementById('status-text'),
    themeBtn: document.getElementById('theme-btn'),

    // Profile
    userName: document.getElementById('user-name'),
    nameEditBtn: document.getElementById('name-edit-btn'),
    userTagline: document.getElementById('user-tagline'),
    avatarDisplay: document.getElementById('avatar-display'),
    avatarInitials: document.getElementById('avatar-initials'),
    avatarRing: document.querySelector('.avatar-ring'),
    editAvatarBtn: document.getElementById('edit-avatar-btn'),
    greetingText: document.getElementById('greeting-text'),
    userTimezone: document.getElementById('user-timezone'),

    // Clock
    formatToggleBtn: document.getElementById('format-toggle-btn'),
    formatLabel: document.getElementById('format-label'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    ampm: document.getElementById('ampm'),
    fullDateString: document.getElementById('full-date-string'),
    weekNumberString: document.getElementById('week-number-string'),
    dayPercent: document.getElementById('day-percent'),
    dayProgressBar: document.getElementById('day-progress-bar'),
    timeRemainingToday: document.getElementById('time-remaining-today'),
    utcOffsetLabel: document.getElementById('utc-offset-label'),

    // Tabs
    tabWorldBtn: document.getElementById('tab-world-btn'),
    tabFocusBtn: document.getElementById('tab-focus-btn'),
    worldClockTab: document.getElementById('world-clock-tab'),
    focusTimerTab: document.getElementById('focus-timer-tab'),
    worldClockList: document.getElementById('world-clock-list'),

    // Stopwatch
    stopwatchDisplay: document.getElementById('stopwatch-display'),
    stopwatchToggleBtn: document.getElementById('stopwatch-toggle-btn'),
    stopwatchLapBtn: document.getElementById('stopwatch-lap-btn'),
    stopwatchResetBtn: document.getElementById('stopwatch-reset-btn'),
    lapsList: document.getElementById('laps-list'),

    // Scratchpad & Links
    scratchpad: document.getElementById('daily-scratchpad'),
    autosaveIndicator: document.getElementById('autosave-indicator'),
    quoteText: document.getElementById('quote-text'),
    quoteAuthor: document.getElementById('quote-author'),
    launchpadGrid: document.getElementById('launchpad-grid'),
    addLinkBtn: document.getElementById('add-link-btn'),

    // Modal
    bookmarkModal: document.getElementById('bookmark-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    cancelBookmarkBtn: document.getElementById('cancel-bookmark-btn'),
    saveBookmarkBtn: document.getElementById('save-bookmark-btn'),
    linkTitleInput: document.getElementById('link-title-input'),
    linkUrlInput: document.getElementById('link-url-input')
  };

  // --- State Variables ---
  let is24HourFormat = localStorage.getItem(STORAGE_KEYS.TIME_FORMAT_24H) !== 'false';
  let currentThemeIndex = parseInt(localStorage.getItem(STORAGE_KEYS.THEME) || '0', 10);
  let currentAvatarTheme = parseInt(localStorage.getItem(STORAGE_KEYS.AVATAR_THEME_INDEX) || '0', 10);
  let currentStatusIndex = parseInt(localStorage.getItem(STORAGE_KEYS.STATUS_INDEX) || '0', 10);

  // Stopwatch State
  let stopwatchRunning = false;
  let stopwatchStartTime = 0;
  let stopwatchElapsedTime = 0;
  let stopwatchIntervalId = null;
  let stopwatchLaps = [];

  // =========================================================================
  // Initialization
  // =========================================================================
  function init() {
    loadProfile();
    initTheme();
    initClock();
    initWorldClocks();
    initStopwatch();
    initScratchpad();
    initBookmarks();
    initQuote();
    bindEventListeners();
  }

  // =========================================================================
  // Profile Management
  // =========================================================================
  function loadProfile() {
    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME) || '林昱岑';
    const savedTagline = localStorage.getItem(STORAGE_KEYS.USER_TAGLINE) || 'IoT Class 0916 • 軟體與物聯網創作';

    el.userName.textContent = savedName;
    el.userTagline.textContent = savedTagline;
    updateInitials(savedName);
    applyAvatarTheme();
    updateStatusDisplay();

    // Detect user timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
      el.userTimezone.textContent = tz.replace('_', ' ');
    } catch (e) {
      el.userTimezone.textContent = 'Local Time';
    }
  }

  function updateInitials(name) {
    if (!name || !name.trim()) {
      el.avatarInitials.textContent = '昱岑';
      return;
    }
    const cleanName = name.trim();
    // Check if name contains Chinese characters
    const hasCjk = /[\u4e00-\u9fa5]/.test(cleanName);
    if (hasCjk) {
      if (cleanName.length >= 3) {
        el.avatarInitials.textContent = cleanName.slice(-2);
      } else {
        el.avatarInitials.textContent = cleanName;
      }
      return;
    }

    const parts = cleanName.split(/\s+/);
    if (parts.length >= 2) {
      el.avatarInitials.textContent = (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      el.avatarInitials.textContent = parts[0].slice(0, 2).toUpperCase();
    }
  }

  function saveProfileName() {
    const newName = el.userName.textContent.trim() || '林昱岑';
    localStorage.setItem(STORAGE_KEYS.USER_NAME, newName);
    updateInitials(newName);
  }

  function saveProfileTagline() {
    const newTagline = el.userTagline.textContent.trim() || 'IoT Class 0916 • 軟體與物聯網創作';
    localStorage.setItem(STORAGE_KEYS.USER_TAGLINE, newTagline);
  }

  function cycleAvatarTheme() {
    currentAvatarTheme = (currentAvatarTheme + 1) % AVATAR_GRADIENTS.length;
    localStorage.setItem(STORAGE_KEYS.AVATAR_THEME_INDEX, currentAvatarTheme);
    applyAvatarTheme();
  }

  function applyAvatarTheme() {
    if (el.avatarRing) {
      el.avatarRing.style.background = AVATAR_GRADIENTS[currentAvatarTheme];
    }
  }

  function cycleStatus() {
    currentStatusIndex = (currentStatusIndex + 1) % STATUSES.length;
    localStorage.setItem(STORAGE_KEYS.STATUS_INDEX, currentStatusIndex);
    updateStatusDisplay();
  }

  function updateStatusDisplay() {
    const current = STATUSES[currentStatusIndex] || STATUSES[0];
    el.statusText.textContent = current.text;
    const dot = el.statusPill.querySelector('.status-dot');
    if (dot) {
      dot.style.backgroundColor = current.color;
      dot.style.boxShadow = `0 0 8px ${current.color}`;
    }
  }

  // =========================================================================
  // Visual Theme Engine
  // =========================================================================
  function initTheme() {
    THEMES.forEach(t => document.body.classList.remove(t));
    document.body.classList.add(THEMES[currentThemeIndex]);
  }

  function cycleTheme() {
    THEMES.forEach(t => document.body.classList.remove(t));
    currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    document.body.classList.add(THEMES[currentThemeIndex]);
    localStorage.setItem(STORAGE_KEYS.THEME, currentThemeIndex);
  }

  // =========================================================================
  // Live High-Precision Clock & Time+
  // =========================================================================
  function initClock() {
    updateFormatUI();
    updateClock();
    // Run update every second
    setInterval(updateClock, 1000);
  }

  function updateFormatUI() {
    el.formatLabel.textContent = is24HourFormat ? '24H' : '12H';
    el.ampm.style.display = is24HourFormat ? 'none' : 'inline-block';
  }

  function toggleTimeFormat() {
    is24HourFormat = !is24HourFormat;
    localStorage.setItem(STORAGE_KEYS.TIME_FORMAT_24H, is24HourFormat);
    updateFormatUI();
    updateClock();
  }

  function updateClock() {
    const now = new Date();

    // 1. Time Digits
    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    if (!is24HourFormat) {
      const ampmText = h >= 12 ? 'PM' : 'AM';
      el.ampm.textContent = ampmText;
      h = h % 12 || 12;
    }

    el.hours.textContent = String(h).padStart(2, '0');
    el.minutes.textContent = String(m).padStart(2, '0');
    el.seconds.textContent = String(s).padStart(2, '0');

    // 2. Full Date String
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.fullDateString.textContent = now.toLocaleDateString(undefined, dateOptions);

    // 3. Week Number
    el.weekNumberString.textContent = `Week ${getWeekNumber(now)}`;

    // 4. Greeting based on hour
    const rawHour = now.getHours();
    let greeting = 'Good Evening';
    if (rawHour >= 5 && rawHour < 12) {
      greeting = 'Good Morning';
    } else if (rawHour >= 12 && rawHour < 17) {
      greeting = 'Good Afternoon';
    } else if (rawHour >= 17 && rawHour < 22) {
      greeting = 'Good Evening';
    } else {
      greeting = 'Night Owl Hours';
    }
    el.greetingText.textContent = greeting;

    // 5. Day Progress (Seconds elapsed today / 86400)
    const secondsToday = rawHour * 3600 + m * 60 + s;
    const totalSecondsInDay = 86400;
    const progressPercent = ((secondsToday / totalSecondsInDay) * 100).toFixed(1);
    el.dayPercent.textContent = `${progressPercent}%`;
    el.dayProgressBar.style.width = `${progressPercent}%`;

    // Remaining hours today
    const remainingSeconds = totalSecondsInDay - secondsToday;
    const remHours = Math.floor(remainingSeconds / 3600);
    const remMins = Math.floor((remainingSeconds % 3600) / 60);
    el.timeRemainingToday.textContent = `${remHours}h ${remMins}m left in today`;

    // 6. UTC Offset
    const offsetMin = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMin) / 60);
    const offsetRemMin = Math.abs(offsetMin) % 60;
    const sign = offsetMin >= 0 ? '+' : '-';
    el.utcOffsetLabel.textContent = `UTC${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetRemMin).padStart(2, '0')}`;

    // Update World Clocks on each tick
    renderWorldClocks(now);
  }

  function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }

  // =========================================================================
  // World Clocks
  // =========================================================================
  function initWorldClocks() {
    renderWorldClocks(new Date());
  }

  function renderWorldClocks(now) {
    if (!el.worldClockList) return;

    el.worldClockList.innerHTML = WORLD_CITIES.map(city => {
      try {
        const cityTimeStr = now.toLocaleTimeString('en-US', {
          timeZone: city.zone,
          hour12: !is24HourFormat,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        const dayStr = now.toLocaleDateString('en-US', {
          timeZone: city.zone,
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });

        return `
          <div class="world-city-item">
            <div class="city-info">
              <span class="city-name">${city.flag} ${city.name}</span>
              <span class="city-tag">${city.zone}</span>
            </div>
            <div class="city-time-box">
              <div class="city-time">${cityTimeStr}</div>
              <div class="city-day">${dayStr}</div>
            </div>
          </div>
        `;
      } catch (e) {
        return '';
      }
    }).join('');
  }

  // =========================================================================
  // Stopwatch / Focus Timer
  // =========================================================================
  function initStopwatch() {
    updateStopwatchDisplay(0);
  }

  function updateStopwatchDisplay(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((ms % 1000) / 10);

    el.stopwatchDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  }

  function toggleStopwatch() {
    if (!stopwatchRunning) {
      // Start
      stopwatchStartTime = performance.now() - stopwatchElapsedTime;
      stopwatchIntervalId = setInterval(() => {
        stopwatchElapsedTime = performance.now() - stopwatchStartTime;
        updateStopwatchDisplay(stopwatchElapsedTime);
      }, 30);
      stopwatchRunning = true;
      el.stopwatchToggleBtn.textContent = 'Pause';
      el.stopwatchToggleBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      el.stopwatchLapBtn.disabled = false;
    } else {
      // Pause
      clearInterval(stopwatchIntervalId);
      stopwatchRunning = false;
      el.stopwatchToggleBtn.textContent = 'Resume';
      el.stopwatchToggleBtn.style.background = 'linear-gradient(135deg, var(--accent-primary), #4f46e5)';
    }
  }

  function recordLap() {
    if (!stopwatchRunning) return;
    const lapIndex = stopwatchLaps.length + 1;
    const lapTimeStr = el.stopwatchDisplay.textContent;
    stopwatchLaps.unshift({ index: lapIndex, time: lapTimeStr });

    renderLaps();
  }

  function renderLaps() {
    el.lapsList.innerHTML = stopwatchLaps.map(lap => `
      <div class="lap-item">
        <span>Lap ${lap.index}</span>
        <span>${lap.time}</span>
      </div>
    `).join('');
  }

  function resetStopwatch() {
    clearInterval(stopwatchIntervalId);
    stopwatchRunning = false;
    stopwatchElapsedTime = 0;
    stopwatchLaps = [];
    updateStopwatchDisplay(0);
    el.stopwatchToggleBtn.textContent = 'Start';
    el.stopwatchToggleBtn.style.background = 'linear-gradient(135deg, var(--accent-primary), #4f46e5)';
    el.stopwatchLapBtn.disabled = true;
    el.lapsList.innerHTML = '';
  }

  // =========================================================================
  // Daily Focus & Scratchpad
  // =========================================================================
  function initScratchpad() {
    const saved = localStorage.getItem(STORAGE_KEYS.SCRATCHPAD) || '';
    el.scratchpad.value = saved;

    let saveTimeout = null;
    el.scratchpad.addEventListener('input', () => {
      el.autosaveIndicator.textContent = 'Saving...';
      el.autosaveIndicator.classList.add('saving');
      el.autosaveIndicator.classList.remove('saved');

      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEYS.SCRATCHPAD, el.scratchpad.value);
        el.autosaveIndicator.textContent = 'Saved';
        el.autosaveIndicator.classList.remove('saving');
        el.autosaveIndicator.classList.add('saved');
      }, 500);
    });
  }

  function initQuote() {
    // Pick quote of the day based on date day number
    const day = new Date().getDate();
    const quote = TIME_QUOTES[day % TIME_QUOTES.length];
    el.quoteText.textContent = `"${quote.text}"`;
    el.quoteAuthor.textContent = `— ${quote.author}`;
  }

  // =========================================================================
  // Quick Launchpad & Bookmarks
  // =========================================================================
  function getBookmarks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : DEFAULT_BOOKMARKS;
    } catch (e) {
      return DEFAULT_BOOKMARKS;
    }
  }

  function saveBookmarks(list) {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    renderBookmarks();
  }

  function initBookmarks() {
    renderBookmarks();
  }

  function renderBookmarks() {
    const list = getBookmarks();
    el.launchpadGrid.innerHTML = list.map((item, idx) => `
      <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="launchpad-item">
        <button class="remove-link-btn" data-index="${idx}" title="Remove link" aria-label="Remove link">&times;</button>
        <div class="launchpad-icon">${item.icon || '🔗'}</div>
        <span class="launchpad-name">${escapeHtml(item.title)}</span>
      </a>
    `).join('');

    // Attach remove handlers
    el.launchpadGrid.querySelectorAll('.remove-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-index'), 10);
        const curList = getBookmarks();
        curList.splice(index, 1);
        saveBookmarks(curList);
      });
    });
  }

  function openBookmarkModal() {
    el.linkTitleInput.value = '';
    el.linkUrlInput.value = '';
    el.bookmarkModal.classList.add('active');
    el.linkTitleInput.focus();
  }

  function closeBookmarkModal() {
    el.bookmarkModal.classList.remove('active');
  }

  function addBookmark() {
    const title = el.linkTitleInput.value.trim();
    let url = el.linkUrlInput.value.trim();

    if (!title || !url) return;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const list = getBookmarks();
    list.push({ title, url, icon: '🔗' });
    saveBookmarks(list);
    closeBookmarkModal();
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================
  function bindEventListeners() {
    // Theme Switch
    el.themeBtn.addEventListener('click', cycleTheme);

    // Status Pill
    el.statusPill.addEventListener('click', cycleStatus);

    // Profile Name inline editing
    el.nameEditBtn.addEventListener('click', () => {
      el.userName.focus();
      document.execCommand('selectAll', false, null);
    });

    el.userName.addEventListener('blur', saveProfileName);
    el.userName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.userName.blur();
      }
    });

    // Tagline inline editing
    el.userTagline.addEventListener('blur', saveProfileTagline);
    el.userTagline.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.userTagline.blur();
      }
    });

    // Cycle Avatar Style
    el.editAvatarBtn.addEventListener('click', cycleAvatarTheme);

    // Toggle 12h/24h
    el.formatToggleBtn.addEventListener('click', toggleTimeFormat);

    // Tabs
    el.tabWorldBtn.addEventListener('click', () => {
      el.tabWorldBtn.classList.add('active');
      el.tabFocusBtn.classList.remove('active');
      el.worldClockTab.classList.add('active');
      el.focusTimerTab.classList.remove('active');
    });

    el.tabFocusBtn.addEventListener('click', () => {
      el.tabFocusBtn.classList.add('active');
      el.tabWorldBtn.classList.remove('active');
      el.focusTimerTab.classList.add('active');
      el.worldClockTab.classList.remove('active');
    });

    // Stopwatch Buttons
    el.stopwatchToggleBtn.addEventListener('click', toggleStopwatch);
    el.stopwatchLapBtn.addEventListener('click', recordLap);
    el.stopwatchResetBtn.addEventListener('click', resetStopwatch);

    // Bookmark Modal
    el.addLinkBtn.addEventListener('click', openBookmarkModal);
    el.closeModalBtn.addEventListener('click', closeBookmarkModal);
    el.cancelBookmarkBtn.addEventListener('click', closeBookmarkModal);
    el.saveBookmarkBtn.addEventListener('click', addBookmark);

    // Close modal on escape or background click
    el.bookmarkModal.addEventListener('click', (e) => {
      if (e.target === el.bookmarkModal) closeBookmarkModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.bookmarkModal.classList.contains('active')) {
        closeBookmarkModal();
      }
    });
  }

  // Boot Application
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
