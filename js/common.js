/* Shared utilities, header/drawer/sidebar shell, Dark Mode switch & speech synthesis */
window.BT_TOEIC_APP = (function () {
  "use strict";

  const STORAGE_KEYS = {
    completed: "bt_toeic_completed_v2",
    grammarCompleted: "bt_toeic_grammar_completed_v1",
    theme: "bt_toeic_theme_v1",
    notes: "bt_toeic_notes_v1"
  };

  const DATA = window.BT_TOEIC_DATA;
  const VOCAB_LISTS = DATA.buildVocabLists();
  const ALL_WORDS_FLAT = VOCAB_LISTS.flatMap((list) =>
    list.words.map((w) => ({ ...w, listNumber: list.number, listTitle: list.title }))
  );
  const TOTAL_ACTIVITIES = VOCAB_LISTS.reduce((sum, l) => sum + l.activities.length, 0);

  const ICONS = {
    note: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
    play: `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>`,
    book: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    pencil: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
    check: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    search: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    caretRight: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    speaker: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`,
    shuffle: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>`
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatExampleHtml(rawEx) {
    const escaped = escapeHtml(rawEx);
    const withHighlight = escaped.replace(/\[([^\]]+)\]/g, `<span class="example-highlight">[$1]</span>`);
    return withHighlight.replace(/(\(=Dịch:[\s\S]*?\))/gi, `<span class="example-translation">$1</span>`);
  }

  function getQueryParam(name, fallback) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || fallback;
  }

  function getListByNumber(num) {
    const n = Math.min(Math.max(parseInt(num, 10) || 1, 1), VOCAB_LISTS.length);
    return VOCAB_LISTS.find((l) => l.number === n) || VOCAB_LISTS[0];
  }

  function loadCompletedSet() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.completed);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch (_) {
      /* ignore */
    }
    return new Set(DATA.defaultCompletedIds);
  }

  function saveCompletedSet(set) {
    try {
      localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify([...set]));
    } catch (_) {
      /* ignore */
    }
  }

  function loadGrammarCompletedSet() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.grammarCompleted);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch (_) {
      /* ignore */
    }
    return new Set();
  }

  function saveGrammarCompletedSet(set) {
    try {
      localStorage.setItem(STORAGE_KEYS.grammarCompleted, JSON.stringify([...set]));
    } catch (_) {
      /* ignore */
    }
  }

  function loadPartCompletedSet(partKey) {
    try {
      const saved = localStorage.getItem(`bt_toeic_${partKey}_completed_v1`);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch (_) {
      /* ignore */
    }
    return new Set();
  }

  function savePartCompletedSet(partKey, set) {
    try {
      localStorage.setItem(`bt_toeic_${partKey}_completed_v1`, JSON.stringify([...set]));
    } catch (_) {
      /* ignore */
    }
  }

  function getMenuHref(menuId) {
    if (menuId === "vocab-toeic") return "index.html";
    if (menuId === "grammar-toeic") return "grammar.html";
    if (menuId === "dictation-toeic") return "toeic-dictation.html";
    if (menuId === "review-flashcards") return "flashcard-review-hub.html";
    const partMatch = /^part-([1-7])$/.exec(menuId);
    if (partMatch) return `part.html?part=${partMatch[1]}`;
    return `index.html?menu=${encodeURIComponent(menuId)}`;
  }

  function getProgressStats(completedSet) {
    const completed = completedSet.size;
    const percent = TOTAL_ACTIVITIES > 0 ? Math.floor((completed / TOTAL_ACTIVITIES) * 100) : 0;
    return { completed, total: TOTAL_ACTIVITIES, percent };
  }

  function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  function speakText(text, lang) {
    if (!("speechSynthesis" in window)) {
      showToast("Trình duyệt không hỗ trợ phát âm tự động");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const cleaned = String(text)
        .replace(/\(=Dịch:[\s\S]*?\)/gi, "")
        .replace(/[\[\]]/g, "")
        .trim();
      if (!cleaned) return;
      const utter = new SpeechSynthesisUtterance(cleaned);
      utter.lang = lang || "en-US";
      utter.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang.toLowerCase() === utter.lang.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(utter.lang.slice(0, 2).toLowerCase()));
      if (preferred) utter.voice = preferred;
      window.speechSynthesis.speak(utter);
    } catch (_) {
      showToast("Không thể phát âm thanh lúc này");
    }
  }

  /* Theme Management */
  function getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.theme) || "light";
    } catch (_) {
      return "light";
    }
  }

  function applyTheme(theme) {
    const t = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, t);
    } catch (_) {
      /* ignore */
    }
    const switchBtn = document.getElementById("darkModeSwitch");
    if (switchBtn) {
      switchBtn.setAttribute("aria-checked", String(t === "dark"));
      const label = switchBtn.querySelector(".darkmode-switch-label");
      if (label) label.textContent = t === "dark" ? "Dark Mode" : "Light Mode";
    }
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", t === "dark" ? "#0b1120" : "#4f46e5");
    }
  }

  /* Register PWA Service Worker when served over HTTPS or localhost */
  function registerServiceWorker() {
    if (
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  /* Render shared Top Navbar + Right Drawer + Floating Elevator + Modal */
  function initSharedShell(options) {
    const opts = options || {};
    applyTheme(getTheme());
    registerServiceWorker();

    const switchBtn = document.getElementById("darkModeSwitch");
    if (switchBtn) {
      switchBtn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        showToast(next === "dark" ? "Đã bật Dark Mode" : "Đã chuyển sang Light Mode");
      });
    }

    /* Delegated audio speaker buttons */
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-speak]");
      if (!btn) return;
      e.stopPropagation();
      speakText(btn.dataset.speak, btn.dataset.lang || "en-US");
    });

    /* Sidebar collapse & mobile drawer */
    const wrapper = document.getElementById("learnCourseWrapper");
    const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
    const mobileSidebarBtn = document.getElementById("mobileSidebarBtn");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");

    if (sidebarToggleBtn && wrapper) {
      sidebarToggleBtn.addEventListener("click", () => {
        if (window.innerWidth <= 900) wrapper.classList.remove("is-mobile-open");
        else wrapper.classList.toggle("is-toggled");
      });
    }
    if (mobileSidebarBtn && wrapper) {
      mobileSidebarBtn.addEventListener("click", () => wrapper.classList.toggle("is-mobile-open"));
    }
    if (sidebarBackdrop && wrapper) {
      sidebarBackdrop.addEventListener("click", () => wrapper.classList.remove("is-mobile-open"));
    }

    /* User dropdown (sync logged-in user + inject Logout action) */
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userDropdown = document.getElementById("userDropdown");
    if (userMenuBtn && userDropdown) {
      if (window.BT_TOEIC_AUTH) {
        const session = window.BT_TOEIC_AUTH.getSession();
        if (session) {
          const nameEl = userDropdown.querySelector(".user-dropdown-name");
          const subEl = userDropdown.querySelector(".user-dropdown-sub");
          if (nameEl) nameEl.textContent = session.displayName;
          if (subEl) subEl.textContent = `BT TOEIC • ${session.role}`;
        }
        if (!userDropdown.querySelector("[data-action='logout']")) {
          const logoutLink = document.createElement("a");
          logoutLink.href = "#";
          logoutLink.className = "user-dropdown-item text-danger";
          logoutLink.dataset.action = "logout";
          logoutLink.textContent = "Đăng xuất";
          userDropdown.appendChild(logoutLink);
        }
      }

      userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = userDropdown.hidden;
        userDropdown.hidden = !willOpen;
        userMenuBtn.setAttribute("aria-expanded", String(willOpen));
      });
      document.addEventListener("click", (e) => {
        if (!userDropdown.hidden && !e.target.closest(".user-menu-wrapper")) {
          userDropdown.hidden = true;
          userMenuBtn.setAttribute("aria-expanded", "false");
        }
      });
      userDropdown.addEventListener("click", (e) => {
        const item = e.target.closest(".user-dropdown-item");
        if (!item) return;
        const action = item.dataset.action;
        if (!action) return;
        e.preventDefault();
        userDropdown.hidden = true;
        if (action === "logout" && window.BT_TOEIC_AUTH) {
          window.BT_TOEIC_AUTH.logout();
        } else if (action === "reset-progress") {
          saveCompletedSet(new Set(DATA.defaultCompletedIds));
          showToast("Đã đặt lại tiến độ về trạng thái ban đầu");
          if (typeof opts.onProgressReset === "function") opts.onProgressReset();
        } else {
          showToast(`Đã chọn: ${item.textContent.trim()}`);
        }
      });
    }

    /* Right Drawer (Dictionary & Notes) */
    const rightDrawer = document.getElementById("rightDrawer");
    const rightDrawerBody = document.getElementById("rightDrawerBody");
    const openDrawerBtn = document.getElementById("openDrawerBtn");
    const closeDrawerBtn = document.getElementById("closeDrawerBtn");
    const elevatorDictBtn = document.getElementById("elevatorDictBtn");
    const elevatorNotesBtn = document.getElementById("elevatorNotesBtn");
    const elevatorTopBtn = document.getElementById("elevatorTopBtn");
    const mainScrollArea = document.getElementById("mainScrollArea");

    let activeDrawerTab = "dict";
    let dictQuery = "";

    function syncDrawerTabs() {
      if (!rightDrawer) return;
      rightDrawer.querySelectorAll(".drawer-tab").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.drawerTab === activeDrawerTab);
      });
    }

    function renderDrawerBody() {
      if (!rightDrawerBody) return;
      if (activeDrawerTab === "dict") {
        const q = dictQuery.trim().toLowerCase();
        const matches = q
          ? ALL_WORDS_FLAT.filter(
              (w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
            ).slice(0, 30)
          : ALL_WORDS_FLAT.slice(0, 20);

        rightDrawerBody.innerHTML = `
          <form class="drawer-search" id="drawerDictForm">
            <input type="text" class="form-control" id="drawerDictInput" placeholder="Tra trong ${ALL_WORDS_FLAT.length} từ TOEIC..." value="${escapeHtml(dictQuery)}" />
          </form>
          <div class="vocab-preview-list">
            ${
              matches.length > 0
                ? matches
                    .map(
                      (w) => `
                    <div class="vocab-preview-item">
                      <div class="vocab-word-row">
                        <a href="flashcards.html?list=${w.listNumber}" class="vocab-word">${escapeHtml(w.word)}</a>
                        <span class="vocab-phonetic">${escapeHtml(w.phonetic)}</span>
                        ${w.pos ? `<span class="vocab-pos">${escapeHtml(w.pos)}</span>` : ""}
                        <button type="button" class="audio-btn audio-btn-inline" data-speak="${escapeHtml(w.word)}" data-lang="en-US" title="Phát âm">${ICONS.speaker}</button>
                      </div>
                      <div class="vocab-meaning">${escapeHtml(w.meaning.split("\n")[0])}</div>
                      <div style="font-size:11px; color:var(--color-text-muted); margin-top:4px;">${escapeHtml(w.listTitle)}</div>
                    </div>
                  `
                    )
                    .join("")
                : `<div class="empty-state" style="padding:20px 0;"><p>Không tìm thấy từ "${escapeHtml(dictQuery)}".</p></div>`
            }
          </div>
        `;
        const dictInput = document.getElementById("drawerDictInput");
        if (dictInput) {
          dictInput.addEventListener("input", (e) => {
            dictQuery = e.target.value;
            renderDrawerBody();
            const refreshed = document.getElementById("drawerDictInput");
            if (refreshed) {
              refreshed.focus();
              refreshed.setSelectionRange(refreshed.value.length, refreshed.value.length);
            }
          });
        }
      } else {
        let savedNotes = "";
        try {
          savedNotes = localStorage.getItem(STORAGE_KEYS.notes) || "";
        } catch (_) {
          /* ignore */
        }
        rightDrawerBody.innerHTML = `
          <textarea class="drawer-textarea" id="lessonNotesTextarea" placeholder="Ghi chú từ vựng khó nhớ hoặc mẹo học TOEIC của bạn tại đây...">${escapeHtml(savedNotes)}</textarea>
          <div class="drawer-hint">Ghi chú được tự động lưu trên trình duyệt của bạn.</div>
        `;
        const textarea = document.getElementById("lessonNotesTextarea");
        if (textarea) {
          textarea.addEventListener("input", (e) => {
            try {
              localStorage.setItem(STORAGE_KEYS.notes, e.target.value);
            } catch (_) {
              /* ignore */
            }
          });
        }
      }
    }

    function openDrawer(tab) {
      if (!rightDrawer) return;
      activeDrawerTab = tab || activeDrawerTab;
      rightDrawer.hidden = false;
      syncDrawerTabs();
      renderDrawerBody();
    }

    function closeDrawer() {
      if (rightDrawer) rightDrawer.hidden = true;
    }

    if (openDrawerBtn) {
      openDrawerBtn.addEventListener("click", () => {
        if (rightDrawer.hidden) openDrawer("dict");
        else closeDrawer();
      });
    }
    if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
    if (elevatorDictBtn) elevatorDictBtn.addEventListener("click", () => openDrawer("dict"));
    if (elevatorNotesBtn) elevatorNotesBtn.addEventListener("click", () => openDrawer("notes"));
    if (elevatorTopBtn && mainScrollArea) {
      elevatorTopBtn.addEventListener("click", () => mainScrollArea.scrollTo({ top: 0, behavior: "smooth" }));
    }
    if (rightDrawer) {
      rightDrawer.querySelectorAll(".drawer-tab").forEach((tabBtn) => {
        tabBtn.addEventListener("click", () => {
          activeDrawerTab = tabBtn.dataset.drawerTab;
          syncDrawerTabs();
          renderDrawerBody();
        });
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrawer();
        if (userDropdown) userDropdown.hidden = true;
      }
    });

    document.querySelectorAll(".topnav-link").forEach((link) => {
      if (link.getAttribute("href") === "#") {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          showToast(`Điều hướng: ${link.textContent.trim()}`);
        });
      }
    });
  }

  /* Shared Activity Preview Modal (for non-flashcard activities) */
  function createModalController(onStateChange) {
    const modal = document.getElementById("activityModal");
    const eyebrow = document.getElementById("modalEyebrow");
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");
    const closeBtn = document.getElementById("modalCloseBtn");
    const cancelBtn = document.getElementById("modalCancelBtn");
    const toggleDoneBtn = document.getElementById("modalToggleDoneBtn");

    let activeActivity = null;

    function close() {
      if (modal) modal.hidden = true;
      activeActivity = null;
    }

    function open(activityId) {
      let found = null;
      for (const list of VOCAB_LISTS) {
        const act = list.activities.find((a) => a.id === activityId);
        if (act) {
          found = { act, list };
          break;
        }
      }
      if (!found || !modal) return;
      activeActivity = found.act;
      const completedSet = loadCompletedSet();
      const isDone = completedSet.has(activeActivity.id);
      const previewWords = found.list.words.slice(0, 5);

      eyebrow.textContent = `Từ vựng TOEIC • ${activeActivity.listTitle}`;
      title.textContent = `${activeActivity.prefix} ${activeActivity.label}`;
      body.innerHTML = `
        <p style="margin: 0 0 14px; font-size: 14px; color: var(--color-text-secondary);">
          Bài luyện tập sử dụng bộ <strong>${found.list.wordCount} từ vựng thật</strong> của <strong>${escapeHtml(found.list.title)}</strong>. Dưới đây là 5 từ đầu tiên:
        </p>
        <div class="vocab-preview-list">
          ${previewWords
            .map(
              (w) => `
              <div class="vocab-preview-item">
                <div class="vocab-word-row">
                  <span class="vocab-word">${escapeHtml(w.word)}</span>
                  <span class="vocab-phonetic">${escapeHtml(w.phonetic)}</span>
                  ${w.pos ? `<span class="vocab-pos">${escapeHtml(w.pos)}</span>` : ""}
                </div>
                <div class="vocab-meaning">${escapeHtml(w.meaning.split("\n")[0])}</div>
              </div>
            `
            )
            .join("")}
        </div>
      `;
      toggleDoneBtn.textContent = isDone ? "Bỏ đánh dấu hoàn thành" : "Đánh dấu hoàn thành";
      toggleDoneBtn.className = isDone ? "btn btn-outline" : "btn btn-success";
      modal.hidden = false;
    }

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (cancelBtn) cancelBtn.addEventListener("click", close);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
      });
    }
    if (toggleDoneBtn) {
      toggleDoneBtn.addEventListener("click", () => {
        if (!activeActivity) return;
        const set = loadCompletedSet();
        if (set.has(activeActivity.id)) {
          set.delete(activeActivity.id);
          showToast(`Đã bỏ hoàn thành: ${activeActivity.listTitle} — ${activeActivity.label}`);
        } else {
          set.add(activeActivity.id);
          showToast(`Đã hoàn thành: ${activeActivity.listTitle} — ${activeActivity.label}`);
        }
        saveCompletedSet(set);
        close();
        if (typeof onStateChange === "function") onStateChange();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.hidden) close();
    });

    return { open, close };
  }

  const VIDEO_UNLOCK_KEY = "bt_toeic_video_unlocked_v1";
  const VIDEO_PASSCODE = "2508";

  function isVideoUnlocked() {
    try {
      return sessionStorage.getItem(VIDEO_UNLOCK_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function setVideoUnlocked(flag) {
    try {
      if (flag) sessionStorage.setItem(VIDEO_UNLOCK_KEY, "1");
      else sessionStorage.removeItem(VIDEO_UNLOCK_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  function renderProtectedVideoStage(mountEl, opts) {
    const { videoId, title, label } = opts;
    if (!mountEl || !videoId) return;

    function render() {
      if (isVideoUnlocked()) {
        mountEl.innerHTML = `
          <div class="lecture-video-stage">
            <div class="yt-embed-shell">
              <div class="yt-embed-ratio">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1"
                  title="${escapeHtml(title)}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </div>
              <div class="yt-embed-bar">
                <span>Video bài giảng: <strong>${escapeHtml(label || title)}</strong></span>
                <div style="display:flex; align-items:center; gap:10px;">
                  <button type="button" class="yt-relock-btn" id="relockVideoBtn">Khóa lại</button>
                  <a href="https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}" target="_blank" rel="noopener noreferrer" class="yt-external-link">Mở trên YouTube &nearr;</a>
                </div>
              </div>
            </div>
          </div>
        `;
        const relockBtn = document.getElementById("relockVideoBtn");
        if (relockBtn) {
          relockBtn.addEventListener("click", () => {
            setVideoUnlocked(false);
            render();
          });
        }
        return;
      }

      /* Default locked pure-black video stage */
      mountEl.innerHTML = `
        <div class="lecture-video-stage">
          <div class="yt-embed-shell">
            <div class="yt-embed-ratio">
              <div class="yt-locked-stage" id="ytLockedStage">
                <button type="button" class="yt-lock-trigger" id="ytLockTrigger">
                  <span class="yt-lock-circle" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <span class="yt-lock-title">Nhấn để xem video bài giảng</span>
                  <span class="yt-lock-sub">Yêu cầu nhập mật khẩu để mở khóa</span>
                </button>

                <form class="yt-lock-form" id="ytLockForm" hidden>
                  <div class="yt-lock-title" style="margin-bottom:4px;">Nhập mật khẩu để xem video</div>
                  <div class="yt-lock-input-row">
                    <input type="password" class="yt-lock-input" id="ytLockInput" placeholder="••••" autocomplete="off" />
                    <button type="submit" class="btn btn-primary" style="height:38px; padding:0 16px;">Mở khóa</button>
                  </div>
                  <div class="yt-lock-error" id="ytLockError"></div>
                </form>
              </div>
            </div>
            <div class="yt-embed-bar">
              <span>Video bài giảng: <strong>${escapeHtml(label || title)}</strong></span>
              <span style="color:#94a3b8;">Đang khóa</span>
            </div>
          </div>
        </div>
      `;

      const stage = document.getElementById("ytLockedStage");
      const trigger = document.getElementById("ytLockTrigger");
      const form = document.getElementById("ytLockForm");
      const input = document.getElementById("ytLockInput");
      const errEl = document.getElementById("ytLockError");

      function showPasswordForm() {
        trigger.hidden = true;
        form.hidden = false;
        input.focus();
      }

      stage.addEventListener("click", (e) => {
        if (!form.hidden || e.target.closest(".yt-lock-form")) return;
        showPasswordForm();
      });

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        showPasswordForm();
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (input.value.trim() === VIDEO_PASSCODE) {
          setVideoUnlocked(true);
          showToast("Đã mở khóa video bài giảng!");
          render();
        } else {
          errEl.textContent = "Mật khẩu không đúng, vui lòng thử lại!";
          input.value = "";
          input.focus();
        }
      });
    }

    render();
  }

  return {
    DATA,
    VOCAB_LISTS,
    ALL_WORDS_FLAT,
    TOTAL_ACTIVITIES,
    ICONS,
    escapeHtml,
    formatExampleHtml,
    getQueryParam,
    getListByNumber,
    loadCompletedSet,
    saveCompletedSet,
    loadGrammarCompletedSet,
    saveGrammarCompletedSet,
    loadPartCompletedSet,
    savePartCompletedSet,
    getMenuHref,
    getProgressStats,
    showToast,
    speakText,
    initSharedShell,
    createModalController,
    renderProtectedVideoStage
  };
})();
