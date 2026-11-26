/* flashcards.html — Dedicated Flashcards Term List page (?list=1..23) */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const list = APP.getListByNumber(APP.getQueryParam("list", "1"));

  let termFilterQuery = "";
  let isShuffled = false;
  let shuffledOrder = [];
  let pageFilter = "all";

  /* Repeat loop playback & audio settings state */
  const RATE_STORAGE_KEY = "bt_toeic_speech_rate_v1";
  const DELAY_STORAGE_KEY = "bt_toeic_loop_delay_v1";
  const LOOP_ICON = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`;
  const PAUSE_ICON = `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>`;

  function loadSpeechRate() {
    try {
      const r = parseFloat(localStorage.getItem(RATE_STORAGE_KEY));
      if (r === 0.72 || r === 0.95) return r;
    } catch (_) {
      /* ignore */
    }
    return 0.95;
  }

  function loadLoopDelay() {
    try {
      const d = parseInt(localStorage.getItem(DELAY_STORAGE_KEY), 10);
      if (d === 1 || d === 2 || d === 3) return d;
    } catch (_) {
      /* ignore */
    }
    return 2;
  }

  let speechRate = loadSpeechRate();
  let loopDelaySec = loadLoopDelay();
  let loopingKey = null;
  let loopSessionId = 0;
  let loopTimerId = null;
  let activeLoopUtterance = null;

  function cleanSpokenText(rawText) {
    return String(rawText || "")
      .replace(/\(=Dịch:[\s\S]*?\)/gi, "")
      .replace(/[\[\]]/g, "")
      .trim();
  }

  function syncLoopButtons() {
    mainContentMount.querySelectorAll(".audio-loop-btn").forEach((btn) => {
      const isThis = loopingKey !== null && btn.dataset.loopKey === loopingKey;
      btn.classList.toggle("is-looping", isThis);
      btn.setAttribute("aria-pressed", String(isThis));
      btn.title = isThis ? "Tạm dừng nghe lặp lại" : `Nghe lặp lại (nghỉ ${loopDelaySec}s)`;
      btn.innerHTML = `${isThis ? PAUSE_ICON : LOOP_ICON}<span>${isThis ? "Tạm dừng" : "Lặp"}</span>`;
    });
  }

  function stopLoop(cancelSpeech) {
    loopSessionId++;
    if (loopTimerId !== null) {
      clearTimeout(loopTimerId);
      loopTimerId = null;
    }
    activeLoopUtterance = null;
    loopingKey = null;
    if (cancelSpeech && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {
        /* ignore */
      }
    }
    syncLoopButtons();
  }

  function startLoop(key, rawText) {
    if (!("speechSynthesis" in window)) {
      APP.showToast("Trình duyệt không hỗ trợ phát âm tự động");
      return;
    }
    const spoken = cleanSpokenText(rawText);
    if (!spoken) return;

    stopLoop(true);
    loopingKey = key;
    const mySession = loopSessionId;
    syncLoopButtons();

    function speakOnce() {
      if (mySession !== loopSessionId) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(spoken);
        utter.lang = "en-US";
        utter.rate = speechRate;
        const voices = window.speechSynthesis.getVoices();
        const preferred =
          voices.find((v) => v.lang.toLowerCase() === "en-us") ||
          voices.find((v) => v.lang.toLowerCase().startsWith("en"));
        if (preferred) utter.voice = preferred;

        let scheduled = false;
        const scheduleNext = () => {
          if (scheduled || mySession !== loopSessionId) return;
          scheduled = true;
          loopTimerId = setTimeout(speakOnce, loopDelaySec * 1000);
        };
        utter.onend = scheduleNext;
        utter.onerror = scheduleNext;

        activeLoopUtterance = utter;
        window.speechSynthesis.speak(utter);
      } catch (_) {
        stopLoop(false);
      }
    }

    speakOnce();
  }

  const sidebarListTitle = document.getElementById("sidebarListTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevLessonLink = document.getElementById("prevLessonLink");
  const nextLessonLink = document.getElementById("nextLessonLink");
  const mainContentMount = document.getElementById("mainContentMount");
  const mainScrollArea = document.getElementById("mainScrollArea");
  const completeAndNextBtn = document.getElementById("completeAndNextBtn");

  /* Handle clicks on loop buttons, audio settings pills, and stop loop if user clicks any normal speaker button */
  mainContentMount.addEventListener("click", (e) => {
    const rateBtn = e.target.closest("[data-rate]");
    if (rateBtn) {
      const nextRate = parseFloat(rateBtn.dataset.rate);
      if (nextRate === 0.72 || nextRate === 0.95) {
        speechRate = nextRate;
        try {
          localStorage.setItem(RATE_STORAGE_KEY, String(speechRate));
        } catch (_) {}
        mainContentMount.querySelectorAll("[data-rate]").forEach((b) => {
          b.classList.toggle("is-active", parseFloat(b.dataset.rate) === speechRate);
        });
        APP.showToast(speechRate === 0.72 ? "Tốc độ đọc: Chậm" : "Tốc độ đọc: Vừa");
      }
      return;
    }

    const delayBtn = e.target.closest("[data-delay]");
    if (delayBtn) {
      const nextDelay = parseInt(delayBtn.dataset.delay, 10);
      if (nextDelay === 1 || nextDelay === 2 || nextDelay === 3) {
        loopDelaySec = nextDelay;
        try {
          localStorage.setItem(DELAY_STORAGE_KEY, String(loopDelaySec));
        } catch (_) {}
        mainContentMount.querySelectorAll("[data-delay]").forEach((b) => {
          b.classList.toggle("is-active", parseInt(b.dataset.delay, 10) === loopDelaySec);
        });
        syncLoopButtons();
        APP.showToast(`Nghỉ giữa các lần lặp: ${loopDelaySec}s`);
      }
      return;
    }

    const loopBtn = e.target.closest(".audio-loop-btn");
    if (loopBtn) {
      e.stopPropagation();
      const key = loopBtn.dataset.loopKey;
      const text = loopBtn.dataset.loopText;
      if (loopingKey === key) {
        stopLoop(true);
      } else {
        startLoop(key, text);
      }
      return;
    }

    if (e.target.closest("[data-speak]") && loopingKey !== null) {
      stopLoop(false);
    }
  });

  window.addEventListener("pagehide", () => stopLoop(true));
  window.addEventListener("beforeunload", () => stopLoop(true));

  const modal = APP.createModalController(() => renderSidebar());
  APP.initSharedShell({
    onProgressReset: () => renderSidebar()
  });

  document.title = `${list.title} - Từ vựng: Flashcards - Complete TOEIC - BT TOEIC`;

  function renderSidebar() {
    const completedSet = APP.loadCompletedSet();
    sidebarListTitle.textContent = list.title;
    sidebarListTitle.href = `flashcards.html?list=${list.number}`;

    const activityItemsHtml = list.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const isActive = act.key === "flashcards";
        const iconHtml = isDone ? APP.ICONS.check : APP.ICONS[act.icon];
        const pageHrefMap = {
          flashcards: `flashcards.html?list=${list.number}`,
          quiz: `quiz.html?list=${list.number}`,
          matching: `matching.html?list=${list.number}`,
          listening: `listening.html?list=${list.number}`,
          translation: `translation.html?list=${list.number}`,
          dictation: `dictation.html?list=${list.number}`
        };
        if (pageHrefMap[act.key]) {
          return `
            <a href="${pageHrefMap[act.key]}" class="sidebar-activity-item${isActive ? " is-active" : ""}">
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
      <span class="breadcrumb-current">${APP.escapeHtml(list.title)}</span>
    `;

    if (list.number > 1) {
      prevLessonLink.href = `flashcards.html?list=${list.number - 1}`;
      prevLessonLink.style.opacity = "1";
      prevLessonLink.style.pointerEvents = "auto";
    } else {
      prevLessonLink.removeAttribute("href");
      prevLessonLink.style.opacity = "0.4";
      prevLessonLink.style.pointerEvents = "none";
    }

    if (list.number < APP.VOCAB_LISTS.length) {
      nextLessonLink.href = `flashcards.html?list=${list.number + 1}`;
      nextLessonLink.style.opacity = "1";
      nextLessonLink.style.pointerEvents = "auto";
    } else {
      nextLessonLink.removeAttribute("href");
      nextLessonLink.style.opacity = "0.4";
      nextLessonLink.style.pointerEvents = "none";
    }
  }

  function getActiveWords() {
    let words =
      isShuffled && shuffledOrder.length === list.words.length
        ? shuffledOrder.map((idx) => list.words[idx])
        : list.words;

    const q = termFilterQuery.trim().toLowerCase();
    if (q) {
      words = words.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          w.phonetic.toLowerCase().includes(q)
      );
    }
    return words;
  }

  function renderTermCard(term) {
    const mediaHtml = term.image
      ? `
        <div class="termlist-item-media">
          <img src="${APP.escapeHtml(term.image)}" alt="${APP.escapeHtml(term.word)}" loading="lazy" onerror="this.parentElement.style.display='none'" />
        </div>
      `
      : "";

    const examplesHtml =
      term.examples && term.examples.length > 0
        ? `
          <div class="termlist-section-label">Ví dụ:</div>
          <ul class="termlist-examples">
            ${term.examples
              .map((ex, exIdx) => {
                const exKey = `ex:${term.word}:${exIdx}`;
                const isLoopingEx = loopingKey === exKey;
                return `
                <li>
                  <button type="button" class="audio-btn audio-btn-inline" data-speak="${APP.escapeHtml(ex)}" data-lang="en-US" title="Nghe câu ví dụ" aria-label="Nghe câu ví dụ">
                    ${APP.ICONS.speaker}
                  </button>
                  <button
                    type="button"
                    class="audio-btn audio-loop-btn audio-loop-btn-inline${isLoopingEx ? " is-looping" : ""}"
                    data-loop-key="${APP.escapeHtml(exKey)}"
                    data-loop-text="${APP.escapeHtml(ex)}"
                    title="${isLoopingEx ? "Tạm dừng nghe lặp lại" : `Nghe lặp lại câu ví dụ (nghỉ ${loopDelaySec}s)`}"
                    aria-pressed="${isLoopingEx ? "true" : "false"}"
                  >
                    ${isLoopingEx ? PAUSE_ICON : LOOP_ICON}<span>${isLoopingEx ? "Tạm dừng" : "Lặp"}</span>
                  </button>
                  <span>${APP.formatExampleHtml(ex)}</span>
                </li>
              `;
              })
              .join("")}
          </ul>
        `
        : "";

    const wordKey = `w:${term.word}`;
    const isLoopingWord = loopingKey === wordKey;

    return `
      <article class="termlist-item contentblock">
        <div class="termlist-item-body">
          <div class="termlist-item-text">
            <h2 class="termlist-heading">
              <span>${APP.escapeHtml(term.word)}</span>
              ${term.pos ? `<span class="termlist-pos">${APP.escapeHtml(term.pos)}</span>` : ""}
              ${term.phonetic ? `<span class="termlist-phonetic">${APP.escapeHtml(term.phonetic)}</span>` : ""}
              <button type="button" class="audio-btn" data-speak="${APP.escapeHtml(term.word)}" data-lang="en-GB" title="Phát âm UK">
                ${APP.ICONS.speaker}<span>UK</span>
              </button>
              <button type="button" class="audio-btn" data-speak="${APP.escapeHtml(term.word)}" data-lang="en-US" title="Phát âm US">
                ${APP.ICONS.speaker}<span>US</span>
              </button>
              <button
                type="button"
                class="audio-btn audio-loop-btn${isLoopingWord ? " is-looping" : ""}"
                data-loop-key="${APP.escapeHtml(wordKey)}"
                data-loop-text="${APP.escapeHtml(term.word)}"
                title="${isLoopingWord ? "Tạm dừng nghe lặp lại" : `Nghe lặp lại (nghỉ ${loopDelaySec}s)`}"
                aria-pressed="${isLoopingWord ? "true" : "false"}"
              >
                ${isLoopingWord ? PAUSE_ICON : LOOP_ICON}<span>${isLoopingWord ? "Tạm dừng" : "Lặp"}</span>
              </button>
            </h2>
            <div class="termlist-section-label">Định nghĩa:</div>
            <div class="termlist-meaning">${APP.escapeHtml(term.meaning)}</div>
            ${examplesHtml}
          </div>
          ${mediaHtml}
        </div>
      </article>
    `;
  }

  function renderMain() {
    const filteredWords = getActiveWords();
    let visibleWords = filteredWords;
    if (!termFilterQuery.trim() && pageFilter === "1") {
      visibleWords = filteredWords.slice(0, 30);
    } else if (!termFilterQuery.trim() && pageFilter === "2") {
      visibleWords = filteredWords.slice(30);
    }

    const cardsHtml =
      visibleWords.length > 0
        ? visibleWords.map(renderTermCard).join("")
        : `
          <div class="contentblock empty-state">
            <h3>Không tìm thấy từ vựng</h3>
            <p>Không có từ nào trong ${APP.escapeHtml(list.title)} khớp với "${APP.escapeHtml(termFilterQuery.trim())}".</p>
          </div>
        `;

    mainContentMount.innerHTML = `
      <div class="flashcard-play-wrap">
        <a href="review.html?list=${list.number}" class="btn btn-sky">Luyện tập flashcards</a>
      </div>

      <div class="flashcard-toolbar">
        <button type="button" class="shuffle-link-btn" id="toggleShuffleBtn">
          ${APP.ICONS.shuffle}
          <span>${isShuffled ? "Đang xem ngẫu nhiên (Bấm để về thứ tự gốc)" : "Xem ngẫu nhiên"}</span>
        </button>

        <input
          type="text"
          class="termlist-filter-input"
          id="termFilterInput"
          placeholder="Lọc nhanh trong ${APP.escapeHtml(list.title)}..."
          value="${APP.escapeHtml(termFilterQuery)}"
        />
      </div>

      <div class="audio-settings-bar" role="group" aria-label="Cài đặt phát âm và lặp lại">
        <div class="audio-setting-group">
          <span class="audio-setting-label">Tốc độ đọc:</span>
          <div class="audio-pill-group">
            <button type="button" class="pager-pill${speechRate === 0.72 ? " is-active" : ""}" data-rate="0.72">Chậm</button>
            <button type="button" class="pager-pill${speechRate === 0.95 ? " is-active" : ""}" data-rate="0.95">Vừa</button>
          </div>
        </div>
        <div class="audio-setting-group">
          <span class="audio-setting-label">Nghỉ lặp:</span>
          <div class="audio-pill-group">
            <button type="button" class="pager-pill${loopDelaySec === 1 ? " is-active" : ""}" data-delay="1">1s</button>
            <button type="button" class="pager-pill${loopDelaySec === 2 ? " is-active" : ""}" data-delay="2">2s</button>
            <button type="button" class="pager-pill${loopDelaySec === 3 ? " is-active" : ""}" data-delay="3">3s</button>
          </div>
        </div>
      </div>

      <div class="termlist-meta-row">
        <div class="termlist-count">List có <strong>${list.wordCount}</strong> từ${termFilterQuery.trim() ? ` (đang hiện ${filteredWords.length} từ khớp)` : ""}</div>
        ${
          !termFilterQuery.trim() && list.wordCount > 30
            ? `
          <div class="termlist-pager" role="group" aria-label="Phân trang từ vựng">
            <button type="button" class="pager-pill${pageFilter === "all" ? " is-active" : ""}" data-page="all">Tất cả (${list.wordCount})</button>
            <button type="button" class="pager-pill${pageFilter === "1" ? " is-active" : ""}" data-page="1">Trang 1 (1–30)</button>
            <button type="button" class="pager-pill${pageFilter === "2" ? " is-active" : ""}" data-page="2">Trang 2 (31–${list.wordCount})</button>
          </div>
        `
            : ""
        }
      </div>

      <section aria-label="Danh sách từ vựng ${APP.escapeHtml(list.title)}">
        ${cardsHtml}
      </section>
    `;

    const shuffleBtn = document.getElementById("toggleShuffleBtn");
    const filterInput = document.getElementById("termFilterInput");

    if (shuffleBtn) {
      shuffleBtn.addEventListener("click", () => {
        isShuffled = !isShuffled;
        if (isShuffled) {
          const indices = list.words.map((_, i) => i);
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          shuffledOrder = indices;
          APP.showToast("Đã xáo trộn thứ tự từ vựng");
        } else {
          shuffledOrder = [];
        }
        renderMain();
      });
    }

    if (filterInput) {
      filterInput.addEventListener("input", (e) => {
        termFilterQuery = e.target.value;
        renderMain();
        const refreshed = document.getElementById("termFilterInput");
        if (refreshed) {
          refreshed.focus();
          refreshed.setSelectionRange(refreshed.value.length, refreshed.value.length);
        }
      });
    }

    mainContentMount.querySelectorAll(".pager-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        pageFilter = pill.dataset.page;
        renderMain();
        mainScrollArea.scrollTop = 0;
      });
    });
  }

  completeAndNextBtn.addEventListener("click", () => {
    const completedSet = APP.loadCompletedSet();
    completedSet.add(`list-${list.number}:flashcards`);
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
})();
