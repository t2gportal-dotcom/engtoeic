/* translation.html — Dedicated "Luyện tập: Dịch nghĩa / Điền từ" page (?list=1..23) */
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

  function getHintText(meaning) {
    if (!meaning) return "";
    const lines = String(meaning)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const enLine = lines.find((l) => l.startsWith("="));
    return enLine ? `Hint: ${enLine}` : `Hint: ${lines[0] || ""}`;
  }

  function buildQuestion(term, idx) {
    const examples = Array.isArray(term.examples) ? term.examples : [];
    const bracketed = examples.find((ex) => /\[[^\]]+\]/.test(ex));
    let promptHtml = `Điền từ tiếng Anh có nghĩa: "${APP.escapeHtml(getViMeaning(term.meaning))}"`;
    let expectedInBlank = term.word;

    if (bracketed) {
      const englishOnly = bracketed.replace(/\s*\(=Dịch:[\s\S]*?\)/gi, "").trim();
      const match = englishOnly.match(/\[([^\]]+)\]/);
      if (match && match[1]) expectedInBlank = match[1].trim();
      promptHtml = APP.escapeHtml(englishOnly).replace(
        /\[[^\]]+\]/g,
        `<span class="quiz-blank" aria-label="chỗ trống"></span>`
      );
    }

    return {
      index: idx,
      word: term.word,
      expectedInBlank,
      viMeaning: getViMeaning(term.meaning),
      promptHtml,
      hintText: getHintText(term.meaning),
      userValue: "",
      status: "idle", /* 'idle' | 'wrong' | 'correct' */
      solved: false
    };
  }

  const questions = shuffleArray(list.words).map((w, idx) => buildQuestion(w, idx));
  let currentIndex = 0;
  let autoNext = true;
  let autoNextTimer = null;
  let countdownInterval = null;

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

  document.title = `Dịch nghĩa / Điền từ - ${list.title} - Complete TOEIC - BT TOEIC`;

  function clearTimers() {
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      autoNextTimer = null;
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
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
        const isActive = act.key === "translation";
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
      <span class="breadcrumb-current">Dịch nghĩa / Điền từ</span>
    `;

    prevActivityLink.href = `listening.html?list=${list.number}`;
    nextActivityLink.href = `dictation.html?list=${list.number}`;
  }

  function goToQuestion(idx) {
    clearTimers();
    if (idx < 0 || idx >= questions.length) return;
    currentIndex = idx;
    renderQuestion();
  }

  function renderQuestion() {
    const q = questions[currentIndex];
    const solvedCount = questions.filter((item) => item.solved).length;

    const inputClass =
      q.status === "correct"
        ? "translation-input is-correct"
        : q.status === "wrong"
          ? "translation-input is-wrong"
          : "translation-input";

    let feedbackHtml = "";
    if (q.status === "wrong") {
      feedbackHtml = `
        <div class="translation-solution">${APP.escapeHtml(q.expectedInBlank)}</div>
        <div class="translation-explanation">${APP.escapeHtml(q.viMeaning)} — Hãy gõ lại từ đúng và nhấn Enter</div>
      `;
    } else if (q.status === "correct") {
      feedbackHtml = `
        <div class="translation-explanation" style="color: var(--color-success); font-weight: 500;">
          Chính xác! ${APP.escapeHtml(q.word)} — ${APP.escapeHtml(q.viMeaning)}
        </div>
      `;
    }

    const numberPillsHtml = questions
      .map((item, idx) => {
        const classes = ["problemset-problem-number"];
        if (item.solved) classes.push("is-done");
        if (idx === currentIndex) classes.push("is-active");
        return `<button type="button" class="${classes.join(" ")}" data-q-index="${idx}">${idx + 1}</button>`;
      })
      .join("");

    mainContentMount.innerHTML = `
      <section class="contentblock quiz-question-card" aria-label="Câu hỏi điền từ">
        <h1 class="quiz-question-title">${q.promptHtml}</h1>
        <p class="quiz-hint" style="font-style: italic;">${APP.escapeHtml(q.hintText)}</p>

        <form class="translation-input-wrap" id="translationForm">
          <input
            type="text"
            class="${inputClass}"
            id="answerInput"
            value="${APP.escapeHtml(q.userValue)}"
            placeholder="Gõ từ cần điền rồi nhấn Enter..."
            spellcheck="false"
            autocomplete="off"
          />
          <button type="submit" class="btn btn-primary" style="height:36px; padding: 0 22px;">Kiểm tra</button>
        </form>

        <div class="translation-feedback" id="translationFeedback">${feedbackHtml}</div>
        <div class="quiz-timer-banner" id="quizTimerBanner" aria-live="polite"></div>
      </section>

      <section class="contentblock quiz-nav-card" aria-label="Điều hướng câu hỏi">
        <div class="problem-set-controls">
          <button type="button" class="problem-set-control-btn" id="prevQuestionBtn" ${currentIndex === 0 ? "disabled" : ""}>
            &lt; Câu trước
          </button>

          <label class="auto-next-toggle">
            <input type="checkbox" id="autoNextCheckbox" ${autoNext ? "checked" : ""} />
            <span class="auto-next-track" aria-hidden="true">
              <span class="auto-next-thumb"></span>
            </span>
            <span>Tự động chuyển câu</span>
          </label>

          <button type="button" class="problem-set-control-btn" id="nextQuestionBtn" ${currentIndex === questions.length - 1 ? "disabled" : ""}>
            Câu sau &gt;
          </button>
        </div>

        <div class="problemset-grid-header">
          <h2 class="problemset-grid-title">Danh sách bài tập:</h2>
          <span class="problemset-grid-score">Đã điền đúng: <strong>${solvedCount}/${questions.length}</strong></span>
        </div>

        <div class="problemset-change-problem">
          ${numberPillsHtml}
        </div>
      </section>
    `;

    const input = document.getElementById("answerInput");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }

    bindEvents();
  }

  function handleSubmit(rawVal) {
    const q = questions[currentIndex];
    const trimmed = String(rawVal || "").trim();
    if (!trimmed) return;

    q.userValue = trimmed;
    const normalized = trimmed.toLowerCase();
    const isMatch =
      normalized === q.expectedInBlank.toLowerCase() ||
      normalized === q.word.toLowerCase();

    if (isMatch) {
      q.status = "correct";
      q.solved = true;
      APP.speakText(q.word, "en-US");

      if (questions.every((item) => item.solved)) {
        const set = APP.loadCompletedSet();
        set.add(`list-${list.number}:translation`);
        APP.saveCompletedSet(set);
        renderSidebar();
        APP.showToast(`Tuyệt vời! Bạn đã hoàn thành Dịch nghĩa / Điền từ ${list.title}!`);
      }

      renderQuestion();

      if (autoNext && currentIndex < questions.length - 1) {
        clearTimers();
        let remaining = 2;
        const banner = document.getElementById("quizTimerBanner");
        if (banner) banner.textContent = `Chuyển câu tiếp theo sau: ${remaining}s`;

        countdownInterval = setInterval(() => {
          remaining -= 1;
          const b = document.getElementById("quizTimerBanner");
          if (b && remaining > 0) b.textContent = `Chuyển câu tiếp theo sau: ${remaining}s`;
        }, 1000);

        autoNextTimer = setTimeout(() => goToQuestion(currentIndex + 1), 1500);
      }
    } else {
      q.status = "wrong";
      renderQuestion();
    }
  }

  function bindEvents() {
    const form = document.getElementById("translationForm");
    const input = document.getElementById("answerInput");
    const prevBtn = document.getElementById("prevQuestionBtn");
    const nextBtn = document.getElementById("nextQuestionBtn");
    const autoNextCheckbox = document.getElementById("autoNextCheckbox");

    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSubmit(input.value);
      });
    }
    if (prevBtn) prevBtn.addEventListener("click", () => goToQuestion(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goToQuestion(currentIndex + 1));
    if (autoNextCheckbox) {
      autoNextCheckbox.addEventListener("change", (e) => {
        autoNext = e.target.checked;
        if (!autoNext) clearTimers();
      });
    }

    mainContentMount.querySelectorAll(".problemset-problem-number").forEach((pill) => {
      pill.addEventListener("click", () => goToQuestion(Number(pill.dataset.qIndex)));
    });
  }

  completeAndNextBtn.addEventListener("click", () => {
    const completedSet = APP.loadCompletedSet();
    completedSet.add(`list-${list.number}:translation`);
    APP.saveCompletedSet(completedSet);
    window.location.href = `dictation.html?list=${list.number}`;
  });

  renderSidebar();
  renderHeaderNav();
  renderQuestion();
})();
