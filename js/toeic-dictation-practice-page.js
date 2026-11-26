/* toeic-dictation-practice.html — Sentence-Level TOEIC Dictation Practice */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const TD = window.BT_TOEIC_DICTATION_DATA;

  const test = TD.getTest(APP.getQueryParam("test", "1"));
  const partNum = Math.min(Math.max(parseInt(APP.getQueryParam("part", "1"), 10) || 1, 1), 4);
  const currentAct = test.activities.find((a) => a.part === partNum) || test.activities[0];
  const sentences = TD.getSentences(partNum).map((s) => ({
    ...s,
    tokens: s.text.split(" ").map((raw) => {
      const clean = raw.replace(/[^a-zA-Z0-9'-]/g, "");
      const punct = raw.slice(clean.length);
      return { raw, clean, punct };
    }),
    answers: {},
    fullInput: "",
    checked: false,
    revealed: false,
    solved: false
  }));

  let currentIndex = 0;
  let activeTab = "dictation"; /* 'dictation' | 'transcript' */
  let mode = "medium"; /* 'medium' | 'hard' | 'full' */
  let autoReplay = false;
  let autoReplayTimer = null;
  const speeds = [0.75, 1, 1.25];
  let speedIndex = 1;

  const sidebarTestTitle = document.getElementById("sidebarTestTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevPartLink = document.getElementById("prevPartLink");
  const nextPartLink = document.getElementById("nextPartLink");
  const mainContentMount = document.getElementById("mainContentMount");
  const completeAndNextBtn = document.getElementById("completeAndNextBtn");

  APP.initSharedShell({
    onProgressReset: () => {
      APP.savePartCompletedSet("toeic-dictation", new Set());
      renderSidebar();
    }
  });

  document.title = `${test.title} - Part ${partNum} - BT TOEIC`;

  function isBlankIndex(idx, total, currentMode) {
    if (currentMode === "hard") return idx % 3 !== 0;
    return idx % 3 === 1 || idx === total - 1;
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
      autoReplayTimer = setInterval(playCurrentSentence, 4500);
    }
  }

  function playCurrentSentence() {
    const s = sentences[currentIndex];
    if (!s || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const fill = document.getElementById("plyrProgressFill");
    if (fill) {
      fill.classList.remove("is-speaking");
      void fill.offsetWidth;
      fill.classList.add("is-speaking");
    }
    const utter = new SpeechSynthesisUtterance(s.text);
    utter.lang = "en-US";
    utter.rate = speeds[speedIndex];
    window.speechSynthesis.speak(utter);
  }

  function getNextTargetHref() {
    if (partNum < 4) return `toeic-dictation-practice.html?test=${test.id}&part=${partNum + 1}`;
    if (test.id < TD.tests.length) return `toeic-dictation-practice.html?test=${test.id + 1}&part=1`;
    return "toeic-dictation.html";
  }

  function renderSidebar() {
    const completedSet = APP.loadPartCompletedSet("toeic-dictation");
    sidebarTestTitle.textContent = test.title;
    sidebarTestTitle.href = `toeic-dictation-practice.html?test=${test.id}&part=1`;

    const itemsHtml = test.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const isActive = act.part === partNum;
        return `
          <a href="toeic-dictation-practice.html?test=${test.id}&part=${act.part}" class="sidebar-activity-item${isActive ? " is-active" : ""}">
            <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${isDone ? APP.ICONS.check : APP.ICONS.pencil}</span>
            <span><strong>${APP.escapeHtml(act.prefix)}</strong> ${APP.escapeHtml(act.title)}</span>
          </a>
        `;
      })
      .join("");

    const nextTest = TD.tests.find((t) => t.id === test.id + 1);
    const nextHtml = nextTest
      ? `
        <div class="sidebar-next-lesson">
          <div class="sidebar-next-label">Bài học tiếp theo:</div>
          <a href="toeic-dictation-practice.html?test=${nextTest.id}&part=1" class="sidebar-next-link">${APP.escapeHtml(nextTest.title)}</a>
        </div>
      `
      : "";

    lessonSidebarList.innerHTML = `
      ${itemsHtml}
      <a href="toeic-dictation.html" class="sidebar-back-unit-btn">&larr; Quay lại chương học</a>
      ${nextHtml}
    `;
  }

  function renderHeaderNav() {
    breadcrumbNav.innerHTML = `
      <a href="index.html" class="breadcrumb-link">${APP.escapeHtml(APP.DATA.course.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="toeic-dictation.html" class="breadcrumb-link">Luyện nghe chép chính tả TOEIC</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">${APP.escapeHtml(test.title)}</span>
    `;

    if (partNum > 1) {
      prevPartLink.href = `toeic-dictation-practice.html?test=${test.id}&part=${partNum - 1}`;
      prevPartLink.style.opacity = "1";
      prevPartLink.style.pointerEvents = "auto";
    } else {
      prevPartLink.removeAttribute("href");
      prevPartLink.style.opacity = "0.4";
      prevPartLink.style.pointerEvents = "none";
    }
    nextPartLink.href = getNextTargetHref();
  }

  function renderMain() {
    const s = sentences[currentIndex];
    const pillsHtml = sentences
      .map((item, idx) => {
        const classes = ["problemset-problem-number"];
        if (item.solved) classes.push("is-done");
        if (idx === currentIndex) classes.push("is-active");
        return `<button type="button" class="${classes.join(" ")}" data-s-index="${idx}">${idx + 1}</button>`;
      })
      .join("");

    let workspaceHtml = "";
    if (activeTab === "transcript") {
      workspaceHtml = `
        <div class="part-transcript-box" style="margin-top: 8px;">
          <div class="part-transcript-title">Transcript câu ${s.num}:</div>
          <div style="font-size: 1.08rem; font-weight: 500; margin-bottom: 6px;">${APP.escapeHtml(s.text)}</div>
          <div style="color: var(--color-text-secondary);">${APP.escapeHtml(s.vi)}</div>
        </div>
      `;
    } else {
      let sentenceBodyHtml = "";
      if (mode === "full") {
        sentenceBodyHtml = `
          <textarea class="td-full-textarea" id="tdFullInput" placeholder="Nghe và chép lại nguyên câu tiếng Anh...">${APP.escapeHtml(s.fullInput)}</textarea>
        `;
      } else {
        sentenceBodyHtml = s.tokens
          .map((tok, idx) => {
            if (!isBlankIndex(idx, s.tokens.length, mode)) {
              return `<span>${APP.escapeHtml(tok.raw)}</span>`;
            }
            const val = s.answers[idx] || "";
            let cls = "td-inline-input";
            if (s.checked) {
              cls += val.trim().toLowerCase() === tok.clean.toLowerCase() ? " is-correct" : " is-wrong";
            }
            const widthCh = Math.max(tok.clean.length + 2, 6);
            return `<input type="text" class="${cls}" data-tok-idx="${idx}" value="${APP.escapeHtml(val)}" style="width:${widthCh}ch;" spellcheck="false" autocomplete="off" />${APP.escapeHtml(tok.punct)}`;
          })
          .join(" ");
      }

      const answerRevealHtml =
        s.revealed || s.solved
          ? `
            <div class="part-transcript-box" style="margin-top: 12px; text-align:left;">
              <div class="part-transcript-title" style="color: var(--color-success);">Đáp án:</div>
              <div><strong>${APP.escapeHtml(s.text)}</strong></div>
              <div style="color: var(--color-text-secondary); margin-top: 4px;">${APP.escapeHtml(s.vi)}</div>
            </div>
          `
          : "";

      workspaceHtml = `
        <div class="td-mode-bar">
          <label for="tdModeSelect">Chọn chế độ:</label>
          <select id="tdModeSelect" class="dictation-mode-select">
            <option value="medium"${mode === "medium" ? " selected" : ""}>Điền từ (trung bình)</option>
            <option value="hard"${mode === "hard" ? " selected" : ""}>Điền từ (khó)</option>
            <option value="full"${mode === "full" ? " selected" : ""}>Chép cả câu</option>
          </select>
        </div>

        <div class="td-sentence-box" id="tdSentenceBox">
          ${sentenceBodyHtml}
        </div>

        <div class="td-btn-row">
          <button type="button" class="problem-set-control-btn" id="tdPrevBtn" ${currentIndex === 0 ? "disabled" : ""}>&lt; Câu trước</button>
          <button type="button" class="problem-set-control-btn" id="tdReplayBtn">Nghe lại</button>
          <button type="button" class="btn btn-primary" id="tdCheckBtn" style="height:30px; padding:0 14px; font-size:12px;">&check; Kiểm tra</button>
          <button type="button" class="problem-set-control-btn" id="tdNextBtn" ${currentIndex === sentences.length - 1 ? "disabled" : ""}>Câu sau &gt;</button>
        </div>

        <div class="td-btn-row">
          <button type="button" class="problem-set-control-btn" id="tdClearBtn">Xoá hết</button>
          <button type="button" class="problem-set-control-btn" id="tdRevealBtn">Đáp án</button>
        </div>

        <div style="display:flex; justify-content:center; margin-top:8px;">
          <label class="auto-next-toggle">
            <input type="checkbox" id="tdAutoReplay" ${autoReplay ? "checked" : ""} />
            <span class="auto-next-track" aria-hidden="true"><span class="auto-next-thumb"></span></span>
            <span>Tự động phát lại câu</span>
          </label>
        </div>

        ${answerRevealHtml}

        <div class="td-shortcuts-hint">
          Phím tắt: ấn [Space] hoặc [Tab] để chuyển sang ô trống tiếp theo; [Enter] để kiểm tra đáp án.<br />
          Ấn [\\] để phát lại câu; [Shift + ←/→] để chuyển câu trước/sau.
        </div>
      `;
    }

    mainContentMount.innerHTML = `
      <div class="content-header" style="padding-bottom: 8px;">
        <h1 class="learncourse-heading" style="margin:0;">${APP.escapeHtml(test.title)} - Part ${partNum} - câu ${s.num}</h1>
      </div>

      <section class="contentblock">
        <div class="td-tabs">
          <button type="button" class="td-tab-btn${activeTab === "dictation" ? " is-active" : ""}" data-td-tab="dictation">Luyện nghe chép chính tả</button>
          <button type="button" class="td-tab-btn${activeTab === "transcript" ? " is-active" : ""}" data-td-tab="transcript">Luyện nghe có transcript</button>
        </div>

        <div class="plyr-bar">
          <button type="button" class="plyr-play-btn" id="plyrPlayBtn" title="Phát câu audio" aria-label="Phát câu audio">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>
          </button>
          <div class="plyr-progress-wrap" id="plyrProgressWrap">
            <div class="plyr-progress-fill" id="plyrProgressFill"></div>
          </div>
          <div class="plyr-meta-controls">
            <button type="button" class="plyr-chip-btn" id="speedToggleBtn">${speeds[speedIndex]}x</button>
          </div>
        </div>

        ${workspaceHtml}
      </section>

      <section class="contentblock quiz-nav-card" style="max-width: 560px; margin: 0 auto;">
        <div class="problem-set-controls">
          <button type="button" class="problem-set-control-btn" id="navPrevBtn" ${currentIndex === 0 ? "disabled" : ""}>&lt; Câu trước</button>
          <span style="font-size: 12.5px; color: var(--color-text-secondary);">Câu <strong>${currentIndex + 1}/${sentences.length}</strong></span>
          <button type="button" class="problem-set-control-btn" id="navNextBtn" ${currentIndex === sentences.length - 1 ? "disabled" : ""}>Câu sau &gt;</button>
        </div>

        <div class="problemset-grid-header">
          <h2 class="problemset-grid-title">Danh sách bài tập:</h2>
        </div>
        <div class="problemset-change-problem">${pillsHtml}</div>
      </section>
    `;

    bindEvents();
  }

  function checkCurrentSentence() {
    const s = sentences[currentIndex];
    s.checked = true;

    if (mode === "full") {
      const cleanUser = s.fullInput.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
      const cleanTarget = s.text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
      s.solved = cleanUser === cleanTarget;
    } else {
      let allCorrect = true;
      s.tokens.forEach((tok, idx) => {
        if (isBlankIndex(idx, s.tokens.length, mode)) {
          const v = (s.answers[idx] || "").trim().toLowerCase();
          if (v !== tok.clean.toLowerCase()) allCorrect = false;
        }
      });
      s.solved = allCorrect;
    }

    if (s.solved) APP.showToast("Chính xác 100%!");
    else APP.showToast("Có từ chưa đúng, hãy nghe lại hoặc bấm Đáp án!");
    renderMain();
  }

  function goToSentence(idx) {
    if (idx < 0 || idx >= sentences.length) return;
    currentIndex = idx;
    renderMain();
    setTimeout(playCurrentSentence, 180);
  }

  function bindEvents() {
    const s = sentences[currentIndex];

    mainContentMount.querySelectorAll("[data-td-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTab = btn.dataset.tdTab;
        renderMain();
      });
    });

    const playBtn = document.getElementById("plyrPlayBtn");
    const progressWrap = document.getElementById("plyrProgressWrap");
    const speedBtn = document.getElementById("speedToggleBtn");
    const modeSelect = document.getElementById("tdModeSelect");
    const fullInput = document.getElementById("tdFullInput");
    const prevBtn = document.getElementById("tdPrevBtn");
    const nextBtn = document.getElementById("tdNextBtn");
    const replayBtn = document.getElementById("tdReplayBtn");
    const checkBtn = document.getElementById("tdCheckBtn");
    const clearBtn = document.getElementById("tdClearBtn");
    const revealBtn = document.getElementById("tdRevealBtn");
    const autoReplayCb = document.getElementById("tdAutoReplay");
    const navPrevBtn = document.getElementById("navPrevBtn");
    const navNextBtn = document.getElementById("navNextBtn");

    if (playBtn) playBtn.addEventListener("click", playCurrentSentence);
    if (progressWrap) progressWrap.addEventListener("click", playCurrentSentence);
    if (speedBtn) {
      speedBtn.addEventListener("click", () => {
        speedIndex = (speedIndex + 1) % speeds.length;
        renderMain();
      });
    }
    if (modeSelect) {
      modeSelect.addEventListener("change", (e) => {
        mode = e.target.value;
        s.checked = false;
        renderMain();
      });
    }
    if (fullInput) {
      fullInput.addEventListener("input", (e) => {
        s.fullInput = e.target.value;
        s.checked = false;
      });
    }

    const inlineInputs = [...mainContentMount.querySelectorAll(".td-inline-input")];
    inlineInputs.forEach((inp, pos) => {
      inp.addEventListener("input", (e) => {
        s.answers[Number(inp.dataset.tokIdx)] = e.target.value;
        s.checked = false;
      });
      inp.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          if (inlineInputs[pos + 1]) inlineInputs[pos + 1].focus();
        } else if (e.key === "Enter") {
          e.preventDefault();
          checkCurrentSentence();
        }
      });
    });

    if (prevBtn) prevBtn.addEventListener("click", () => goToSentence(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goToSentence(currentIndex + 1));
    if (navPrevBtn) navPrevBtn.addEventListener("click", () => goToSentence(currentIndex - 1));
    if (navNextBtn) navNextBtn.addEventListener("click", () => goToSentence(currentIndex + 1));
    if (replayBtn) replayBtn.addEventListener("click", playCurrentSentence);
    if (checkBtn) checkBtn.addEventListener("click", checkCurrentSentence);
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        s.answers = {};
        s.fullInput = "";
        s.checked = false;
        s.revealed = false;
        renderMain();
      });
    }
    if (revealBtn) {
      revealBtn.addEventListener("click", () => {
        s.revealed = true;
        renderMain();
      });
    }
    if (autoReplayCb) {
      autoReplayCb.addEventListener("change", (e) => {
        autoReplay = e.target.checked;
        syncAutoReplay();
      });
    }

    mainContentMount.querySelectorAll(".problemset-problem-number").forEach((pill) => {
      pill.addEventListener("click", () => goToSentence(Number(pill.dataset.sIndex)));
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "\\") {
      e.preventDefault();
      playCurrentSentence();
    } else if (e.shiftKey && e.key === "ArrowRight") {
      e.preventDefault();
      goToSentence(currentIndex + 1);
    } else if (e.shiftKey && e.key === "ArrowLeft") {
      e.preventDefault();
      goToSentence(currentIndex - 1);
    }
  });

  completeAndNextBtn.addEventListener("click", () => {
    clearAutoReplay();
    const set = APP.loadPartCompletedSet("toeic-dictation");
    set.add(currentAct.id);
    APP.savePartCompletedSet("toeic-dictation", set);
    window.location.href = getNextTargetHref();
  });

  renderSidebar();
  renderHeaderNav();
  renderMain();
})();
