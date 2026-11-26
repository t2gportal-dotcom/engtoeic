/* listening.html — Dedicated "Luyện tập: Nghe từ vựng" 3x3 Live Audio Grid (?list=1..23) */
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

  function getViMeaning(meaning) {
    if (!meaning) return "";
    const lines = String(meaning)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const viLine = lines.find((l) => !l.startsWith("=")) || lines[0] || "";
    return viLine.replace(/^=\s*/, "");
  }

  /* State */
  let queue = [];
  let gridSlots = []; /* length 9, each item is word obj or null */
  let targetSlotIndex = -1;
  let completedCount = 0;
  let wrongSlotIndex = -1;
  let correctSlotIndex = -1;
  let swapInSlotIndex = -1;
  let isLocked = false;
  let voiceLang = "en-US";
  const speeds = [0.75, 1, 1.25];
  let speedIndex = 1;
  let sessionDone = false;

  const sidebarListTitle = document.getElementById("sidebarListTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevActivityLink = document.getElementById("prevActivityLink");
  const nextActivityLink = document.getElementById("nextActivityLink");
  const mainContentMount = document.getElementById("mainContentMount");
  const completeAndNextBtn = document.getElementById("completeAndNextBtn");

  const modal = APP.createModalController(() => renderSidebar());
  APP.initSharedShell({
    onProgressReset: () => renderSidebar()
  });

  document.title = `Nghe từ vựng - ${list.title} - Complete TOEIC - BT TOEIC`;

  function initSession() {
    const shuffled = shuffleArray(list.words);
    gridSlots = shuffled.slice(0, 9);
    while (gridSlots.length < 9) gridSlots.push(null);
    queue = shuffled.slice(9);
    completedCount = 0;
    wrongSlotIndex = -1;
    correctSlotIndex = -1;
    swapInSlotIndex = -1;
    isLocked = false;
    sessionDone = false;
    pickNextTarget();
  }

  function pickNextTarget() {
    const activeIndices = gridSlots
      .map((item, idx) => (item ? idx : -1))
      .filter((idx) => idx !== -1);
    if (activeIndices.length === 0) {
      targetSlotIndex = -1;
      sessionDone = true;
      return;
    }
    targetSlotIndex = activeIndices[Math.floor(Math.random() * activeIndices.length)];
  }

  function playCurrentTarget() {
    if (targetSlotIndex < 0 || !gridSlots[targetSlotIndex]) return;
    const word = gridSlots[targetSlotIndex].word;

    const fill = document.getElementById("plyrProgressFill");
    if (fill) {
      fill.classList.remove("is-speaking");
      void fill.offsetWidth;
      fill.classList.add("is-speaking");
    }

    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(word);
        utter.lang = voiceLang;
        utter.rate = speeds[speedIndex];
        const voices = window.speechSynthesis.getVoices();
        const preferred =
          voices.find((v) => v.lang.toLowerCase() === voiceLang.toLowerCase()) ||
          voices.find((v) => v.lang.toLowerCase().startsWith("en"));
        if (preferred) utter.voice = preferred;
        window.speechSynthesis.speak(utter);
      } catch (_) {
        APP.speakText(word, voiceLang);
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
        const isActive = act.key === "listening";
        const iconHtml = isDone ? APP.ICONS.check : APP.ICONS[act.icon];

        if (linkMap[act.key]) {
          return `
            <a href="${linkMap[act.key]}" class="sidebar-activity-item${isActive ? " is-active" : ""}">
              <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${iconHtml}</span>
              <span><strong>${APP.escapeHtml(act.prefix)}</strong> ${APP.escapeHtml(act.label)}</span>
            </a>
          `;
        }
        return `
          <button type="button" class="sidebar-activity-item" data-activity-id="${act.id}">
            <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${iconHtml}</span>
            <span><strong>${APP.escapeHtml(act.prefix)}</strong> ${APP.escapeHtml(act.label)}</span>
          </button>
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

    lessonSidebarList.querySelectorAll("button[data-activity-id]").forEach((btn) => {
      btn.addEventListener("click", () => modal.open(btn.dataset.activityId));
    });
  }

  function renderHeaderNav() {
    breadcrumbNav.innerHTML = `
      <a href="index.html" class="breadcrumb-link">${APP.escapeHtml(APP.DATA.course.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="index.html" class="breadcrumb-link">Từ vựng TOEIC</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="flashcards.html?list=${list.number}" class="breadcrumb-link">${APP.escapeHtml(list.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">Nghe từ vựng</span>
    `;

    prevActivityLink.href = `matching.html?list=${list.number}`;
    nextActivityLink.href = `translation.html?list=${list.number}`;
    nextActivityLink.textContent = "Bài sau >";
  }

  function renderMain() {
    const targetWord = targetSlotIndex >= 0 && gridSlots[targetSlotIndex] ? gridSlots[targetSlotIndex].word : "";

    const bodyHtml = sessionDone
      ? `
        <div class="listening-done-box">
          <h3>Chúc mừng! Bạn đã nghe đúng ${list.wordCount}/${list.wordCount} từ!</h3>
          <p>Toàn bộ từ vựng trong ${APP.escapeHtml(list.title)} đã được luyện nghe hoàn tất.</p>
          <button type="button" class="btn btn-primary" id="replaySessionBtn">Luyện nghe lại từ đầu</button>
        </div>
      `
      : `
        <div class="plyr-bar">
          <button type="button" class="plyr-play-btn" id="plyrPlayBtn" title="Nghe lại từ vựng (Phím Space)" aria-label="Nghe lại từ vựng">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>
          </button>

          <div class="plyr-progress-wrap" id="plyrProgressWrap" title="Bấm để nghe lại">
            <div class="plyr-progress-fill" id="plyrProgressFill"></div>
          </div>

          <div class="plyr-meta-controls">
            <button type="button" class="plyr-chip-btn" id="accentToggleBtn" title="Đổi giọng đọc US / UK">${voiceLang === "en-GB" ? "UK" : "US"}</button>
            <button type="button" class="plyr-chip-btn" id="speedToggleBtn" title="Tốc độ đọc">${speeds[speedIndex]}x</button>
          </div>
        </div>

        <div class="listening-grid" id="listeningGrid" data-target-word="${APP.escapeHtml(targetWord)}">
          ${gridSlots
            .map((item, idx) => {
              if (!item) {
                return `<div class="listening-cell is-empty" aria-hidden="true"></div>`;
              }
              const classes = ["listening-cell"];
              if (idx === wrongSlotIndex) classes.push("is-wrong");
              if (idx === correctSlotIndex) classes.push("is-correct");
              if (idx === swapInSlotIndex) classes.push("is-swap-in");

              return `
                <button type="button" class="${classes.join(" ")}" data-slot-index="${idx}" data-word="${APP.escapeHtml(item.word)}">
                  <span class="listening-cell-word">${APP.escapeHtml(item.word)}</span>
                  <span class="listening-cell-meaning">(${APP.escapeHtml(getViMeaning(item.meaning))})</span>
                </button>
              `;
            })
            .join("")}
        </div>
      `;

    mainContentMount.innerHTML = `
      <section class="contentblock listening-card" aria-label="Bài luyện nghe từ vựng">
        ${bodyHtml}
      </section>

      <section class="contentblock quiz-nav-card" aria-label="Tiến độ bài luyện nghe">
        <div class="problem-set-controls">
          <button type="button" class="problem-set-control-btn" disabled>&lt; Câu trước</button>

          <label class="auto-next-toggle">
            <input type="checkbox" checked disabled />
            <span class="auto-next-track" aria-hidden="true">
              <span class="auto-next-thumb"></span>
            </span>
            <span>Tự động phát từ tiếp theo</span>
          </label>

          <button type="button" class="problem-set-control-btn" id="restartListeningBtn">Làm lại</button>
        </div>

        <div class="problemset-grid-header">
          <h2 class="problemset-grid-title">Danh sách bài tập:</h2>
          <span class="problemset-grid-score">Đã nghe đúng: <strong>${completedCount}/${list.wordCount}</strong> từ</span>
        </div>

        <div class="problemset-change-problem">
          <button type="button" class="problemset-problem-number ${sessionDone ? "is-done" : "is-active"}">1</button>
        </div>
      </section>
    `;

    bindEvents();
  }

  function handleCellClick(slotIdx) {
    if (isLocked || sessionDone || !gridSlots[slotIdx]) return;
    isLocked = true;

    if (slotIdx === targetSlotIndex) {
      correctSlotIndex = slotIdx;
      swapInSlotIndex = -1;
      renderMain();

      setTimeout(() => {
        completedCount += 1;
        correctSlotIndex = -1;
        if (queue.length > 0) {
          gridSlots[slotIdx] = queue.shift();
          swapInSlotIndex = slotIdx;
        } else {
          gridSlots[slotIdx] = null;
          swapInSlotIndex = -1;
        }

        pickNextTarget();
        if (sessionDone) {
          const set = APP.loadCompletedSet();
          set.add(`list-${list.number}:listening`);
          APP.saveCompletedSet(set);
          renderSidebar();
          APP.showToast(`Tuyệt vời! Bạn đã hoàn thành Nghe từ vựng ${list.title}!`);
        }

        isLocked = false;
        renderMain();
        if (!sessionDone) {
          setTimeout(playCurrentTarget, 220);
        }
      }, 280);
    } else {
      wrongSlotIndex = slotIdx;
      renderMain();
      setTimeout(() => {
        wrongSlotIndex = -1;
        isLocked = false;
        renderMain();
        playCurrentTarget();
      }, 600);
    }
  }

  function bindEvents() {
    const playBtn = document.getElementById("plyrPlayBtn");
    const progressWrap = document.getElementById("plyrProgressWrap");
    const accentBtn = document.getElementById("accentToggleBtn");
    const speedBtn = document.getElementById("speedToggleBtn");
    const restartBtn = document.getElementById("restartListeningBtn");
    const replaySessionBtn = document.getElementById("replaySessionBtn");

    if (playBtn) playBtn.addEventListener("click", playCurrentTarget);
    if (progressWrap) progressWrap.addEventListener("click", playCurrentTarget);

    if (accentBtn) {
      accentBtn.addEventListener("click", () => {
        voiceLang = voiceLang === "en-US" ? "en-GB" : "en-US";
        renderMain();
        playCurrentTarget();
      });
    }

    if (speedBtn) {
      speedBtn.addEventListener("click", () => {
        speedIndex = (speedIndex + 1) % speeds.length;
        renderMain();
        playCurrentTarget();
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        initSession();
        renderMain();
        playCurrentTarget();
      });
    }

    if (replaySessionBtn) {
      replaySessionBtn.addEventListener("click", () => {
        initSession();
        renderMain();
        playCurrentTarget();
      });
    }

    mainContentMount.querySelectorAll(".listening-cell[data-slot-index]").forEach((btn) => {
      btn.addEventListener("click", () => handleCellClick(Number(btn.dataset.slotIndex)));
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      playCurrentTarget();
    }
  });

  completeAndNextBtn.addEventListener("click", () => {
    const completedSet = APP.loadCompletedSet();
    completedSet.add(`list-${list.number}:listening`);
    APP.saveCompletedSet(completedSet);
    if (list.number < APP.VOCAB_LISTS.length) {
      window.location.href = `flashcards.html?list=${list.number + 1}`;
    } else {
      window.location.href = "index.html";
    }
  });

  initSession();
  renderSidebar();
  renderHeaderNav();
  renderMain();
  setTimeout(playCurrentTarget, 350);
})();
