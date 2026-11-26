/* dictation.html — Dedicated "Luyện tập: Nghe chính tả" 2-column BT TOEIC page (?list=1..23) */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const list = APP.getListByNumber(APP.getQueryParam("list", "1"));

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function splitMeaning(meaning) {
    const lines = String(meaning || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const vi = (lines.find((l) => !l.startsWith("=")) || lines[0] || "").replace(/^=\s*/, "");
    const en = lines.find((l) => l.startsWith("=")) || "";
    return { vi, en };
  }

  const allWords = shuffleArray(list.words);
  let mode = "all"; /* 'all' | 'exclude-ignored' | 'wrong-only' */
  let currentIndex = 0;
  let showViMeaning = true;
  let autoReplay = false;
  let autoReplayTimer = null;
  let voiceLang = "en-US";
  const speeds = [0.75, 1, 1.25];
  let speedIndex = 1;

  const ignoredWords = new Set();
  const wrongWords = new Set();
  const historyLog = []; /* { word, correct } */

  let inputValue = "";
  let checkStatus = "idle"; /* 'idle' | 'correct' | 'wrong' */
  let answerRevealed = false;

  const sidebarListTitle = document.getElementById("sidebarListTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevActivityLink = document.getElementById("prevActivityLink");
  const nextActivityLink = document.getElementById("nextActivityLink");
  const mainContentMount = document.getElementById("mainContentMount");
  const completeAndNextBtn = document.getElementById("completeAndNextBtn");

  APP.initSharedShell({
    onProgressReset: () => renderSidebar()
  });

  document.title = `Nghe chính tả - ${list.title} - Complete TOEIC - BT TOEIC`;

  function getActivePool() {
    if (mode === "exclude-ignored") {
      return allWords.filter((w) => !ignoredWords.has(w.word));
    }
    if (mode === "wrong-only") {
      return allWords.filter((w) => wrongWords.has(w.word));
    }
    return allWords;
  }

  function getCurrentTerm() {
    const pool = getActivePool();
    if (pool.length === 0) return null;
    if (currentIndex >= pool.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = pool.length - 1;
    return pool[currentIndex];
  }

  function clearAutoReplay() {
    if (autoReplayTimer) {
      clearInterval(autoReplayTimer);
      autoReplayTimer = null;
    }
  }

  function syncAutoReplay() {
    clearAutoReplay();
    if (autoReplay) {
      autoReplayTimer = setInterval(() => {
        playCurrentAudio();
      }, 3200);
    }
  }

  function playCurrentAudio() {
    const term = getCurrentTerm();
    if (!term) return;

    const fill = document.getElementById("plyrProgressFill");
    if (fill) {
      fill.classList.remove("is-speaking");
      void fill.offsetWidth;
      fill.classList.add("is-speaking");
    }

    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(term.word);
        utter.lang = voiceLang;
        utter.rate = speeds[speedIndex];
        const voices = window.speechSynthesis.getVoices();
        const preferred =
          voices.find((v) => v.lang.toLowerCase() === voiceLang.toLowerCase()) ||
          voices.find((v) => v.lang.toLowerCase().startsWith("en"));
        if (preferred) utter.voice = preferred;
        window.speechSynthesis.speak(utter);
      } catch (_) {
        APP.speakText(term.word, voiceLang);
      }
    }
  }

  function renderSidebar() {
    const completedSet = APP.loadCompletedSet();
    sidebarListTitle.textContent = list.title;
    sidebarListTitle.href = `flashcards.html?list=${list.number}`;

    const linkMap = {
      flashcards: `flashcards.html?list=${list.number}`,
      quiz: `quiz.html?list=${list.number}`,
      matching: `matching.html?list=${list.number}`,
      listening: `listening.html?list=${list.number}`,
      translation: `translation.html?list=${list.number}`,
      dictation: `dictation.html?list=${list.number}`
    };

    const activityItemsHtml = list.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const isActive = act.key === "dictation";
        const iconHtml = isDone ? APP.ICONS.check : APP.ICONS[act.icon];
        return `
          <a href="${linkMap[act.key]}" class="sidebar-activity-item${isActive ? " is-active" : ""}">
            <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${iconHtml}</span>
            <span><strong>${APP.escapeHtml(act.prefix)}</strong> ${APP.escapeHtml(act.label)}</span>
          </a>
        `;
      })
      .join("");

    const nextList = list.number < APP.VOCAB_LISTS.length ? APP.getListByNumber(list.number + 1) : null;
    const nextHtml = nextList
      ? `
        <div class="sidebar-next-lesson">
          <div class="sidebar-next-label">Bài học tiếp theo:</div>
          <a href="flashcards.html?list=${nextList.number}" class="sidebar-next-link">${APP.escapeHtml(nextList.title)} (${nextList.wordCount} từ)</a>
        </div>
      `
      : "";

    lessonSidebarList.innerHTML = `
      ${activityItemsHtml}
      <a href="index.html" class="sidebar-back-unit-btn">&larr; Quay lại chương học</a>
      ${nextHtml}
    `;
  }

  function renderHeaderNav() {
    breadcrumbNav.innerHTML = `
      <a href="index.html" class="breadcrumb-link">${APP.escapeHtml(APP.DATA.course.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="index.html" class="breadcrumb-link">Từ vựng TOEIC</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="flashcards.html?list=${list.number}" class="breadcrumb-link">${APP.escapeHtml(list.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">Nghe chính tả</span>
    `;

    prevActivityLink.href = `translation.html?list=${list.number}`;
    if (list.number < APP.VOCAB_LISTS.length) {
      nextActivityLink.href = `flashcards.html?list=${list.number + 1}`;
      nextActivityLink.textContent = `List ${list.number + 1} >`;
    } else {
      nextActivityLink.href = "index.html";
      nextActivityLink.textContent = "Hoàn tất >";
    }
  }

  function renderMain() {
    const pool = getActivePool();
    const term = getCurrentTerm();

    const historyHtml = historyLog
      .map(
        (h) => `
        <button type="button" class="dictation-chip ${h.correct ? "is-correct" : "is-wrong"}" data-speak="${APP.escapeHtml(h.word)}" data-lang="${voiceLang}" title="Bấm để nghe lại">
          ${APP.escapeHtml(h.word)}
        </button>
      `
      )
      .join("");

    let rightPanelHtml = "";
    if (!term) {
      rightPanelHtml = `
        <div class="empty-state" style="padding: 36px 12px;">
          <h3>Không còn từ nào trong chế độ này</h3>
          <p>Bạn có thể chuyển chế độ luyện tập về "Tất cả" để tiếp tục luyện nghe chính tả.</p>
          <button type="button" class="btn btn-primary" id="resetModeAllBtn">Chuyển về Tất cả (${allWords.length} từ)</button>
        </div>
      `;
    } else {
      const { vi, en } = splitMeaning(term.meaning);
      const showPhonetic = checkStatus === "correct" || answerRevealed;
      const inputClass =
        checkStatus === "correct"
          ? "dictation-input is-correct"
          : checkStatus === "wrong"
            ? "dictation-input is-wrong"
            : "dictation-input";

      rightPanelHtml = `
        <div class="dictation-mode-row">
          <div style="display:flex; align-items:center; gap:8px;">
            <label for="dictationModeSelect">Chọn chế độ luyện tập:</label>
            <select id="dictationModeSelect" class="dictation-mode-select">
              <option value="all"${mode === "all" ? " selected" : ""}>Tất cả (${allWords.length})</option>
              <option value="exclude-ignored"${mode === "exclude-ignored" ? " selected" : ""}>Trừ các từ đã bỏ qua (${allWords.length - ignoredWords.size})</option>
              <option value="wrong-only"${mode === "wrong-only" ? " selected" : ""}>Chỉ những từ làm sai (${wrongWords.size})</option>
            </select>
          </div>
          <span>Từ <strong>${currentIndex + 1}/${pool.length}</strong></span>
        </div>

        <div class="plyr-bar" style="margin-bottom: 10px;">
          <button type="button" class="plyr-play-btn" id="plyrPlayBtn" title="Nghe lại từ vựng" aria-label="Nghe lại từ vựng">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>
          </button>
          <div class="plyr-progress-wrap" id="plyrProgressWrap" title="Bấm để nghe lại">
            <div class="plyr-progress-fill" id="plyrProgressFill"></div>
          </div>
          <div class="plyr-meta-controls">
            <button type="button" class="plyr-chip-btn" id="speedToggleBtn" title="Tốc độ đọc">${speeds[speedIndex]}x</button>
          </div>
        </div>

        <div class="dictation-audio-accent">
          <span>${voiceLang === "en-GB" ? "Audio 1 (UK)" : "Audio 2 (US)"}</span>
          <button type="button" class="audio-btn" id="switchAccentBtn">
            ${APP.ICONS.speaker}<span>Đổi sang ${voiceLang === "en-GB" ? "US" : "UK"}</span>
          </button>
        </div>

        <div class="dictation-prompt-box" data-current-word="${APP.escapeHtml(term.word)}">
          ${showViMeaning ? `<div class="dictation-vi-meaning">${APP.escapeHtml(vi)}</div>` : ""}
          ${showViMeaning && en ? `<div class="dictation-en-def">${APP.escapeHtml(en)}</div>` : ""}
          <div class="dictation-phonetic">${showPhonetic ? APP.escapeHtml(term.phonetic || "/.../") : "/Phiên âm/"}</div>
        </div>

        <form class="dictation-form" id="dictationForm">
          <input
            type="text"
            class="${inputClass}"
            id="dictationInput"
            value="${APP.escapeHtml(inputValue)}"
            placeholder="Gõ từ bạn nghe được..."
            spellcheck="false"
            autocomplete="off"
          />

          ${
            answerRevealed || checkStatus === "correct"
              ? `<div style="font-size: 14px; font-weight: 600; color: ${checkStatus === "correct" ? "var(--color-success)" : "var(--color-primary)"};">Đáp án: ${APP.escapeHtml(term.word)} ${APP.escapeHtml(term.pos)}</div>`
              : ""
          }

          <div class="dictation-actions">
            <button type="submit" class="btn btn-outline" id="checkDictationBtn" style="height:36px;">&check; Check kết quả</button>
            ${
              checkStatus === "wrong" && !answerRevealed
                ? `<button type="button" class="btn btn-outline" id="revealAnswerBtn" style="height:36px;">Hiện đáp án</button>`
                : ""
            }
          </div>
        </form>

        <div class="dictation-footer-controls">
          <div class="dictation-toggles">
            <label class="auto-next-toggle">
              <input type="checkbox" id="showMeaningCheckbox" ${showViMeaning ? "checked" : ""} />
              <span class="auto-next-track" aria-hidden="true"><span class="auto-next-thumb"></span></span>
              <span>Hiện nghĩa tiếng Việt</span>
            </label>
            <label class="auto-next-toggle">
              <input type="checkbox" id="autoReplayCheckbox" ${autoReplay ? "checked" : ""} />
              <span class="auto-next-track" aria-hidden="true"><span class="auto-next-thumb"></span></span>
              <span>Auto replay</span>
            </label>
          </div>

          <button type="button" class="problem-set-control-btn" id="nextDictationBtn" style="padding: 7px 14px; font-size: 13px;">
            Từ tiếp theo &gt;
          </button>
        </div>

        <div class="dictation-ignore-row">
          <button type="button" class="dictation-ignore-btn" id="ignoreWordBtn">
            &times; Đã biết, bỏ qua và không test từ này nữa
          </button>
        </div>
      `;
    }

    mainContentMount.innerHTML = `
      <section class="contentblock dictation-card" aria-label="Bài luyện nghe chính tả">
        <div class="dictation-layout">
          <div>
            <div class="dictation-info-box">
              <ul>
                <li>List gồm <strong>${list.wordCount}</strong> từ</li>
                <li>Để check đáp án, bạn gõ từ bạn nghe được và bấm Enter hoặc nhấn <strong>Check kết quả</strong>.</li>
                <li>Từ vựng sẽ xuất hiện dưới đây sau khi bạn check đáp án hoặc chuyển câu.</li>
              </ul>
            </div>
            <div class="dictation-history" id="dictationHistory">
              ${historyHtml}
            </div>
          </div>

          <div>
            ${rightPanelHtml}
          </div>
        </div>
      </section>
    `;

    const input = document.getElementById("dictationInput");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }

    bindEvents();
  }

  function recordHistory(word, correct) {
    if (!historyLog.some((h) => h.word === word)) {
      historyLog.push({ word, correct });
    }
  }

  function goNextWord() {
    const pool = getActivePool();
    if (pool.length === 0) return;
    currentIndex = (currentIndex + 1) % pool.length;
    inputValue = "";
    checkStatus = "idle";
    answerRevealed = false;
    renderMain();
    setTimeout(playCurrentAudio, 200);
  }

  function handleCheck(rawVal) {
    const term = getCurrentTerm();
    if (!term) return;

    /* If already correct, pressing Enter advances to next word */
    if (checkStatus === "correct") {
      goNextWord();
      return;
    }

    const trimmed = String(rawVal || "").trim();
    if (!trimmed) return;
    inputValue = trimmed;

    if (trimmed.toLowerCase() === term.word.toLowerCase()) {
      checkStatus = "correct";
      answerRevealed = true;
      wrongWords.delete(term.word);
      recordHistory(term.word, true);
      renderMain();
    } else {
      checkStatus = "wrong";
      wrongWords.add(term.word);
      recordHistory(term.word, false);
      renderMain();
      playCurrentAudio();
    }
  }

  function bindEvents() {
    const modeSelect = document.getElementById("dictationModeSelect");
    const resetModeBtn = document.getElementById("resetModeAllBtn");
    const playBtn = document.getElementById("plyrPlayBtn");
    const progressWrap = document.getElementById("plyrProgressWrap");
    const speedBtn = document.getElementById("speedToggleBtn");
    const switchAccentBtn = document.getElementById("switchAccentBtn");
    const form = document.getElementById("dictationForm");
    const input = document.getElementById("dictationInput");
    const revealBtn = document.getElementById("revealAnswerBtn");
    const showMeaningCheckbox = document.getElementById("showMeaningCheckbox");
    const autoReplayCheckbox = document.getElementById("autoReplayCheckbox");
    const nextBtn = document.getElementById("nextDictationBtn");
    const ignoreBtn = document.getElementById("ignoreWordBtn");

    if (modeSelect) {
      modeSelect.addEventListener("change", (e) => {
        mode = e.target.value;
        currentIndex = 0;
        inputValue = "";
        checkStatus = "idle";
        answerRevealed = false;
        renderMain();
        playCurrentAudio();
      });
    }

    if (resetModeBtn) {
      resetModeBtn.addEventListener("click", () => {
        mode = "all";
        currentIndex = 0;
        renderMain();
        playCurrentAudio();
      });
    }

    if (playBtn) playBtn.addEventListener("click", playCurrentAudio);
    if (progressWrap) progressWrap.addEventListener("click", playCurrentAudio);

    if (speedBtn) {
      speedBtn.addEventListener("click", () => {
        speedIndex = (speedIndex + 1) % speeds.length;
        renderMain();
        playCurrentAudio();
      });
    }

    if (switchAccentBtn) {
      switchAccentBtn.addEventListener("click", () => {
        voiceLang = voiceLang === "en-GB" ? "en-US" : "en-GB";
        renderMain();
        playCurrentAudio();
      });
    }

    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleCheck(input.value);
      });
    }

    if (revealBtn) {
      revealBtn.addEventListener("click", () => {
        answerRevealed = true;
        renderMain();
      });
    }

    if (showMeaningCheckbox) {
      showMeaningCheckbox.addEventListener("change", (e) => {
        showViMeaning = e.target.checked;
        renderMain();
      });
    }

    if (autoReplayCheckbox) {
      autoReplayCheckbox.addEventListener("change", (e) => {
        autoReplay = e.target.checked;
        syncAutoReplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const term = getCurrentTerm();
        if (term && checkStatus === "idle") recordHistory(term.word, false);
        goNextWord();
      });
    }

    if (ignoreBtn) {
      ignoreBtn.addEventListener("click", () => {
        const term = getCurrentTerm();
        if (!term) return;
        ignoredWords.add(term.word);
        APP.showToast(`Đã thêm "${term.word}" vào danh sách bỏ qua`);
        goNextWord();
      });
    }
  }

  completeAndNextBtn.addEventListener("click", () => {
    clearAutoReplay();
    const completedSet = APP.loadCompletedSet();
    completedSet.add(`list-${list.number}:dictation`);
    APP.saveCompletedSet(completedSet);
    if (list.number < APP.VOCAB_LISTS.length) {
      window.location.href = `flashcards.html?list=${list.number + 1}`;
    } else {
      window.location.href = "index.html";
    }
  });

  renderSidebar();
  renderHeaderNav();
  renderMain();
  setTimeout(playCurrentAudio, 350);
})();
