/* quiz.html — Dedicated "Luyện tập: Trắc nghiệm từ vựng" page (?list=1..23) */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const list = APP.getListByNumber(APP.getQueryParam("list", "1"));

  /* Deterministic-friendly shuffle helper */
  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /* Extract clean Vietnamese meaning (first line before '=...') */
  function getViMeaning(meaning) {
    if (!meaning) return "";
    const lines = String(meaning)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const viLine = lines.find((l) => !l.startsWith("=")) || lines[0] || "";
    return viLine.replace(/^=\s*/, "");
  }

  /* Extract English hint line ('=...') if present, else fallback to Vi meaning */
  function getHintText(meaning) {
    if (!meaning) return "";
    const lines = String(meaning)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const enLine = lines.find((l) => l.startsWith("="));
    if (enLine) return `Hint: ${enLine}`;
    return `Hint: ${lines[0] || ""}`;
  }

  /* Build fill-in-the-blank prompt from word's example sentence */
  function buildPromptHtml(term) {
    const examples = Array.isArray(term.examples) ? term.examples : [];
    const bracketed = examples.find((ex) => /\[[^\]]+\]/.test(ex));
    if (bracketed) {
      const englishOnly = bracketed.replace(/\s*\(=Dịch:[\s\S]*?\)/gi, "").trim();
      const escaped = APP.escapeHtml(englishOnly);
      return escaped.replace(/\[[^\]]+\]/g, `<span class="quiz-blank" aria-label="chỗ trống"></span>`);
    }
    return `Chọn từ tiếng Anh có nghĩa là: "${APP.escapeHtml(getViMeaning(term.meaning))}"`;
  }

  /* Build N quiz questions (1 per word in List, shuffled like BT TOEIC) */
  function buildQuestions(words) {
    const orderedWords = shuffleArray(words);
    return orderedWords.map((target, idx) => {
      const pool = words.filter((w) => w.word !== target.word);
      const distractors = shuffleArray(pool).slice(0, 3);
      const options = shuffleArray([target, ...distractors]).map((w) => ({
        word: w.word,
        viMeaning: getViMeaning(w.meaning),
        isCorrect: w.word === target.word
      }));

      return {
        index: idx,
        targetWord: target.word,
        promptHtml: buildPromptHtml(target),
        hintText: getHintText(target.meaning),
        options,
        clickedWords: new Set(),
        solved: false
      };
    });
  }

  const questions = buildQuestions(list.words);
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

  const modal = APP.createModalController(() => renderSidebar());
  APP.initSharedShell({
    onProgressReset: () => renderSidebar()
  });

  document.title = `Trắc nghiệm từ vựng - ${list.title} - Complete TOEIC - BT TOEIC`;

  function clearAutoNextTimers() {
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

    const activityItemsHtml = list.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const isActive = act.key === "quiz";
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
      <a href="flashcards.html?list=${list.number}" class="breadcrumb-link">${APP.escapeHtml(list.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">Trắc nghiệm từ vựng</span>
    `;

    prevActivityLink.href = `flashcards.html?list=${list.number}`;
    nextActivityLink.href = `matching.html?list=${list.number}`;
    nextActivityLink.textContent = "Bài sau >";
  }

  function goToQuestion(idx) {
    clearAutoNextTimers();
    if (idx < 0 || idx >= questions.length) return;
    currentIndex = idx;
    renderQuiz();
  }

  function renderQuiz() {
    const q = questions[currentIndex];
    const solvedCount = questions.filter((item) => item.solved).length;

    const optionsHtml = q.options
      .map((opt) => {
        const isClicked = q.clickedWords.has(opt.word);
        let stateClass = "";
        if (isClicked) {
          stateClass = opt.isCorrect ? " clicked correct" : " clicked wrong";
        }
        const meaningSuffix = isClicked && opt.viMeaning
          ? ` <span class="quiz-variant-meaning">(${APP.escapeHtml(opt.viMeaning)})</span>`
          : "";

        return `
          <button type="button" class="quiz-variant${stateClass}" data-option-word="${APP.escapeHtml(opt.word)}">
            <span>${APP.escapeHtml(opt.word)}</span>${meaningSuffix}
          </button>
        `;
      })
      .join("");

    const numberPillsHtml = questions
      .map((item, idx) => {
        const classes = ["problemset-problem-number"];
        if (item.solved) classes.push("is-done");
        if (idx === currentIndex) classes.push("is-active");
        return `<button type="button" class="${classes.join(" ")}" data-q-index="${idx}">${idx + 1}</button>`;
      })
      .join("");

    mainContentMount.innerHTML = `
      <section class="contentblock quiz-question-card" aria-label="Câu hỏi trắc nghiệm từ vựng">
        <h1 class="quiz-question-title" id="questionTitle">${q.promptHtml}</h1>
        <p class="quiz-hint" id="questionHint">${APP.escapeHtml(q.hintText)}</p>

        <div class="quiz-variants" id="quizVariants">
          ${optionsHtml}
        </div>

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
          <span class="problemset-grid-score">Đã làm đúng: <strong>${solvedCount}/${questions.length}</strong></span>
        </div>

        <div class="problemset-change-problem" id="problemGrid">
          ${numberPillsHtml}
        </div>
      </section>
    `;

    bindQuizEvents();
  }

  function handleOptionClick(optionWord) {
    const q = questions[currentIndex];
    const opt = q.options.find((o) => o.word === optionWord);
    if (!opt || q.clickedWords.has(opt.word)) return;

    q.clickedWords.add(opt.word);

    if (opt.isCorrect) {
      q.solved = true;
      APP.speakText(opt.word, "en-US");

      /* Auto-mark quiz activity completed when all questions are solved */
      const allSolved = questions.every((item) => item.solved);
      if (allSolved) {
        const set = APP.loadCompletedSet();
        set.add(`list-${list.number}:quiz`);
        APP.saveCompletedSet(set);
        renderSidebar();
        APP.showToast(`Tuyệt vời! Bạn đã hoàn thành Trắc nghiệm ${list.title}!`);
      }

      renderQuiz();

      if (autoNext && currentIndex < questions.length - 1) {
        clearAutoNextTimers();
        let remaining = 2;
        const banner = document.getElementById("quizTimerBanner");
        if (banner) banner.textContent = `Chuyển câu tiếp theo sau: ${remaining}s`;

        countdownInterval = setInterval(() => {
          remaining -= 1;
          const b = document.getElementById("quizTimerBanner");
          if (b && remaining > 0) b.textContent = `Chuyển câu tiếp theo sau: ${remaining}s`;
        }, 1000);

        autoNextTimer = setTimeout(() => {
          goToQuestion(currentIndex + 1);
        }, 1600);
      }
    } else {
      renderQuiz();
    }
  }

  function bindQuizEvents() {
    mainContentMount.querySelectorAll(".quiz-variant").forEach((btn) => {
      btn.addEventListener("click", () => handleOptionClick(btn.dataset.optionWord));
    });

    const prevBtn = document.getElementById("prevQuestionBtn");
    const nextBtn = document.getElementById("nextQuestionBtn");
    const autoNextCheckbox = document.getElementById("autoNextCheckbox");

    if (prevBtn) prevBtn.addEventListener("click", () => goToQuestion(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goToQuestion(currentIndex + 1));
    if (autoNextCheckbox) {
      autoNextCheckbox.addEventListener("change", (e) => {
        autoNext = e.target.checked;
        if (!autoNext) {
          clearAutoNextTimers();
          const b = document.getElementById("quizTimerBanner");
          if (b) b.textContent = "";
        }
      });
    }

    mainContentMount.querySelectorAll(".problemset-problem-number").forEach((pill) => {
      pill.addEventListener("click", () => goToQuestion(Number(pill.dataset.qIndex)));
    });
  }

  completeAndNextBtn.addEventListener("click", () => {
    const completedSet = APP.loadCompletedSet();
    completedSet.add(`list-${list.number}:quiz`);
    APP.saveCompletedSet(completedSet);
    if (list.number < APP.VOCAB_LISTS.length) {
      window.location.href = `flashcards.html?list=${list.number + 1}`;
    } else {
      window.location.href = "index.html";
    }
  });

  renderSidebar();
  renderHeaderNav();
  renderQuiz();
})();
