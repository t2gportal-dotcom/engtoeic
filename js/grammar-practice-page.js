/* grammar-practice.html — Dedicated TOEIC Format Grammar MCQ Page */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const GRAMMAR = window.BT_TOEIC_GRAMMAR_DATA;

  const topic = GRAMMAR.getTopicById(APP.getQueryParam("topic", "3"));
  const actId = APP.getQueryParam("act", topic.activities[0].id);
  const currentActIndex = Math.max(0, topic.activities.findIndex((a) => a.id === actId));
  const currentAct = topic.activities[currentActIndex] || topic.activities[0];

  const questions = GRAMMAR.getQuestionsForTopic(topic.id).map((q) => ({
    ...q,
    selected: -1,
    checked: false
  }));

  let currentIndex = 0;
  let highlightOn = true;
  let autoNext = true;
  let autoNextTimer = null;

  const sidebarTopicTitle = document.getElementById("sidebarTopicTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevActivityLink = document.getElementById("prevActivityLink");
  const nextActivityLink = document.getElementById("nextActivityLink");
  const mainContentMount = document.getElementById("mainContentMount");
  const completeAndNextBtn = document.getElementById("completeAndNextBtn");

  APP.initSharedShell({
    onProgressReset: () => {
      APP.saveGrammarCompletedSet(new Set());
      renderSidebar();
    }
  });

  document.title = `${currentAct.title} - ${topic.title} - BT TOEIC`;

  function clearTimers() {
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      autoNextTimer = null;
    }
  }

  function getActHref(t, act) {
    return act.isVideo
      ? `grammar-lesson.html?topic=${t.id}&act=${encodeURIComponent(act.id)}`
      : `grammar-practice.html?topic=${t.id}&act=${encodeURIComponent(act.id)}`;
  }

  function getNextTargetHref() {
    if (currentActIndex < topic.activities.length - 1) {
      return getActHref(topic, topic.activities[currentActIndex + 1]);
    }
    const nextTopic = GRAMMAR.topics.find((t) => t.id === topic.id + 1);
    if (nextTopic && nextTopic.activities.length > 0) {
      return getActHref(nextTopic, nextTopic.activities[0]);
    }
    return "grammar.html";
  }

  function getPrevTargetHref() {
    if (currentActIndex > 0) {
      return getActHref(topic, topic.activities[currentActIndex - 1]);
    }
    const prevTopic = GRAMMAR.topics.find((t) => t.id === topic.id - 1);
    if (prevTopic && prevTopic.activities.length > 0) {
      return getActHref(prevTopic, prevTopic.activities[prevTopic.activities.length - 1]);
    }
    return null;
  }

  function renderSidebar() {
    const completedSet = APP.loadGrammarCompletedSet();
    sidebarTopicTitle.textContent = topic.title;
    sidebarTopicTitle.href = getActHref(topic, topic.activities[0]);

    const itemsHtml = topic.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const isActive = act.id === currentAct.id;
        const iconHtml = isDone ? APP.ICONS.check : act.isVideo ? APP.ICONS.play : APP.ICONS.pencil;
        return `
          <a href="${getActHref(topic, act)}" class="sidebar-activity-item${isActive ? " is-active" : ""}">
            <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${iconHtml}</span>
            <span><strong>${APP.escapeHtml(act.prefix)}</strong> ${APP.escapeHtml(act.title)}</span>
          </a>
        `;
      })
      .join("");

    const nextTopic = GRAMMAR.topics.find((t) => t.id === topic.id + 1);
    const nextHtml = nextTopic
      ? `
        <div class="sidebar-next-lesson">
          <div class="sidebar-next-label">Bài học tiếp theo:</div>
          <a href="${getActHref(nextTopic, nextTopic.activities[0])}" class="sidebar-next-link">${APP.escapeHtml(nextTopic.title)}</a>
        </div>
      `
      : "";

    lessonSidebarList.innerHTML = `
      ${itemsHtml}
      <a href="grammar.html" class="sidebar-back-unit-btn">&larr; Quay lại chương học</a>
      ${nextHtml}
    `;
  }

  function renderHeaderNav() {
    breadcrumbNav.innerHTML = `
      <a href="index.html" class="breadcrumb-link">${APP.escapeHtml(APP.DATA.course.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="grammar.html" class="breadcrumb-link">Ngữ pháp TOEIC</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">${APP.escapeHtml(topic.title)}</span>
    `;

    const prevHref = getPrevTargetHref();
    if (prevHref) {
      prevActivityLink.href = prevHref;
      prevActivityLink.style.opacity = "1";
      prevActivityLink.style.pointerEvents = "auto";
    } else {
      prevActivityLink.removeAttribute("href");
      prevActivityLink.style.opacity = "0.4";
      prevActivityLink.style.pointerEvents = "none";
    }
    nextActivityLink.href = getNextTargetHref();
  }

  function goToQuestion(idx) {
    clearTimers();
    if (idx < 0 || idx >= questions.length) return;
    currentIndex = idx;
    renderPractice();
  }

  function renderPractice() {
    const q = questions[currentIndex];
    const correctCount = questions.filter((item) => item.checked && item.selected === item.answer).length;

    const optionsHtml = q.options
      .map((optText, idx) => {
        const classes = ["grammar-radio-opt"];
        if (q.checked) {
          if (idx === q.answer) classes.push("is-correct");
          else if (idx === q.selected) classes.push("is-wrong");
        } else if (idx === q.selected) {
          classes.push("is-selected");
        }

        return `
          <label class="${classes.join(" ")}">
            <input type="radio" name="grammarMcq" value="${idx}" ${q.selected === idx ? "checked" : ""} />
            <span>${APP.escapeHtml(optText)}</span>
          </label>
        `;
      })
      .join("");

    const explainHtml = q.checked
      ? `
        <div class="grammar-explain-box">
          <strong>Giải thích:</strong> ${APP.escapeHtml(q.explain)}
        </div>
      `
      : "";

    const pillsHtml = questions
      .map((item, idx) => {
        const classes = ["problemset-problem-number"];
        if (item.checked && item.selected === item.answer) classes.push("is-done");
        if (idx === currentIndex) classes.push("is-active");
        return `<button type="button" class="${classes.join(" ")}" data-q-index="${idx}">${idx + 1}</button>`;
      })
      .join("");

    mainContentMount.innerHTML = `
      <div class="content-header" style="padding-bottom: 10px;">
        <h1 class="learncourse-heading" style="margin:0; font-size: 1.25rem;">${APP.escapeHtml(currentAct.title)}</h1>
      </div>

      <section class="contentblock" aria-label="Câu hỏi ngữ pháp TOEIC">
        <div class="grammar-mcq-toolbar">
          <label class="auto-next-toggle">
            <input type="checkbox" id="highlightToggle" ${highlightOn ? "checked" : ""} />
            <span class="auto-next-track" aria-hidden="true"><span class="auto-next-thumb"></span></span>
            <span>Highlight từ khóa</span>
          </label>

          <div class="grammar-mcq-actions">
            <button type="button" class="btn btn-primary" id="checkAnswerBtn" style="height:34px; padding: 0 14px; font-size: 13px;">Kiểm tra đáp án</button>
            <button type="button" class="btn btn-outline" id="clearAnswerBtn" style="height:34px; padding: 0 12px; font-size: 13px;">Xoá hết</button>
          </div>
        </div>

        <p class="grammar-q-text${highlightOn ? " is-highlight-on" : ""}">
          <span class="grammar-q-num">Q${q.num}:</span>
          <span>${q.sentence}</span>
        </p>

        <div class="grammar-radio-list" id="grammarRadioList">
          ${optionsHtml}
        </div>

        ${explainHtml}
      </section>

      <section class="contentblock quiz-nav-card" aria-label="Điều hướng câu hỏi">
        <div class="problem-set-controls">
          <button type="button" class="problem-set-control-btn" id="prevQuestionBtn" ${currentIndex === 0 ? "disabled" : ""}>
            &lt; Câu trước
          </button>

          <label class="auto-next-toggle">
            <input type="checkbox" id="autoNextCheckbox" ${autoNext ? "checked" : ""} />
            <span class="auto-next-track" aria-hidden="true"><span class="auto-next-thumb"></span></span>
            <span>Tự động chuyển câu</span>
          </label>

          <button type="button" class="problem-set-control-btn" id="nextQuestionBtn" ${currentIndex === questions.length - 1 ? "disabled" : ""}>
            Câu sau &gt;
          </button>
        </div>

        <div class="problemset-grid-header">
          <h2 class="problemset-grid-title">Danh sách bài tập:</h2>
          <span class="problemset-grid-score">Đúng: <strong>${correctCount}/${questions.length}</strong></span>
        </div>

        <div class="problemset-change-problem">
          ${pillsHtml}
        </div>
      </section>
    `;

    bindEvents();
  }

  function bindEvents() {
    const highlightToggle = document.getElementById("highlightToggle");
    const checkBtn = document.getElementById("checkAnswerBtn");
    const clearBtn = document.getElementById("clearAnswerBtn");
    const prevBtn = document.getElementById("prevQuestionBtn");
    const nextBtn = document.getElementById("nextQuestionBtn");
    const autoNextCheckbox = document.getElementById("autoNextCheckbox");

    if (highlightToggle) {
      highlightToggle.addEventListener("change", (e) => {
        highlightOn = e.target.checked;
        renderPractice();
      });
    }

    mainContentMount.querySelectorAll("input[name='grammarMcq']").forEach((radio) => {
      radio.addEventListener("change", (e) => {
        questions[currentIndex].selected = Number(e.target.value);
        questions[currentIndex].checked = false;
        renderPractice();
      });
    });

    if (checkBtn) {
      checkBtn.addEventListener("click", () => {
        const q = questions[currentIndex];
        if (q.selected < 0) {
          APP.showToast("Hãy chọn một đáp án A, B, C hoặc D trước khi kiểm tra!");
          return;
        }
        q.checked = true;
        renderPractice();

        if (q.selected === q.answer) {
          if (questions.every((item) => item.checked && item.selected === item.answer)) {
            const set = APP.loadGrammarCompletedSet();
            set.add(currentAct.id);
            APP.saveGrammarCompletedSet(set);
            renderSidebar();
            APP.showToast(`Hoàn thành bài luyện tập: ${currentAct.title}!`);
          }
          if (autoNext && currentIndex < questions.length - 1) {
            clearTimers();
            autoNextTimer = setTimeout(() => goToQuestion(currentIndex + 1), 1800);
          }
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        clearTimers();
        questions[currentIndex].selected = -1;
        questions[currentIndex].checked = false;
        renderPractice();
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
    const set = APP.loadGrammarCompletedSet();
    set.add(currentAct.id);
    APP.saveGrammarCompletedSet(set);
    window.location.href = getNextTargetHref();
  });

  renderSidebar();
  renderHeaderNav();
  renderPractice();
})();
