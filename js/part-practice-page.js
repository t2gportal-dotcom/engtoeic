/* part-practice.html — Unified Interactive TOEIC Practice for Part 1 through Part 7 */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const PARTS = window.BT_TOEIC_PARTS_DATA;
  const part = PARTS.getPart(APP.getQueryParam("part", "1"));
  const lesson = PARTS.getLesson(part, APP.getQueryParam("lesson", "2"));
  const actId = APP.getQueryParam("act", lesson.activities[lesson.activities.length - 1].id);
  const currentActIndex = Math.max(0, lesson.activities.findIndex((a) => a.id === actId));
  const currentAct = lesson.activities[currentActIndex] || lesson.activities[0];

  const isAudioPart = part.num >= 1 && part.num <= 4;
  const isSetPart = part.num === 3 || part.num === 4 || part.num === 6 || part.num === 7;

  const items = isSetPart
    ? (part.practiceSets || []).map((s) => ({
        ...s,
        selectedMap: {},
        checked: false,
        showTranscript: false
      }))
    : (part.practiceQuestions || []).map((q) => ({
        ...q,
        selected: -1,
        checked: false,
        showTranscript: false
      }));

  let currentIndex = 0;
  let autoNext = false;
  let highlightOn = true;
  const speeds = [0.75, 1, 1.25];
  let speedIndex = 1;

  const sidebarLessonTitle = document.getElementById("sidebarLessonTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevActivityLink = document.getElementById("prevActivityLink");
  const nextActivityLink = document.getElementById("nextActivityLink");
  const mainContentMount = document.getElementById("mainContentMount");
  const completeAndNextBtn = document.getElementById("completeAndNextBtn");

  APP.initSharedShell({
    onProgressReset: () => {
      APP.savePartCompletedSet(part.key, new Set());
      renderSidebar();
    }
  });

  document.title = `${lesson.title} - ${part.title} - BT TOEIC`;

  function getActHref(l, act) {
    return act.type === "practice"
      ? `part-practice.html?part=${part.num}&lesson=${l.id}&act=${encodeURIComponent(act.id)}`
      : `part-lesson.html?part=${part.num}&lesson=${l.id}&act=${encodeURIComponent(act.id)}`;
  }

  function getActIcon(act, isDone) {
    if (isDone) return APP.ICONS.check;
    if (act.type === "video") return APP.ICONS.play;
    if (act.type === "reading") return APP.ICONS.book;
    return APP.ICONS.pencil;
  }

  function getNextTargetHref() {
    if (currentActIndex < lesson.activities.length - 1) {
      return getActHref(lesson, lesson.activities[currentActIndex + 1]);
    }
    const nextLesson = part.lessons.find((l) => l.id === lesson.id + 1);
    if (nextLesson && nextLesson.activities.length > 0) {
      return getActHref(nextLesson, nextLesson.activities[0]);
    }
    return `part.html?part=${part.num}`;
  }

  function getPrevTargetHref() {
    if (currentActIndex > 0) {
      return getActHref(lesson, lesson.activities[currentActIndex - 1]);
    }
    const prevLesson = part.lessons.find((l) => l.id === lesson.id - 1);
    if (prevLesson && prevLesson.activities.length > 0) {
      return getActHref(prevLesson, prevLesson.activities[prevLesson.activities.length - 1]);
    }
    return null;
  }

  function speakLinesSequentially(lines) {
    if (!("speechSynthesis" in window)) {
      APP.showToast("Trình duyệt không hỗ trợ phát âm tự động");
      return;
    }
    window.speechSynthesis.cancel();
    const fill = document.getElementById("plyrProgressFill");
    if (fill) {
      fill.classList.remove("is-speaking");
      void fill.offsetWidth;
      fill.classList.add("is-speaking");
    }

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));

    lines.forEach((line) => {
      const utter = new SpeechSynthesisUtterance(line);
      utter.lang = "en-US";
      utter.rate = speeds[speedIndex];
      if (enVoice) utter.voice = enVoice;
      window.speechSynthesis.speak(utter);
    });
  }

  function playCurrentAudio() {
    const item = items[currentIndex];
    if (!item) return;
    if (part.num === 1) {
      speakLinesSequentially(item.statements);
    } else if (part.num === 2) {
      speakLinesSequentially([item.question, ...item.responses]);
    } else if (part.num === 3) {
      speakLinesSequentially(item.dialogue.map((d) => `${d.speaker}: ${d.text}`));
    } else if (part.num === 4) {
      speakLinesSequentially([item.talkText]);
    }
  }

  function renderSidebar() {
    const completedSet = APP.loadPartCompletedSet(part.key);
    sidebarLessonTitle.textContent = lesson.title;
    sidebarLessonTitle.href = getActHref(lesson, lesson.activities[0]);

    const itemsHtml = lesson.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const isActive = act.id === currentAct.id;
        return `
          <a href="${getActHref(lesson, act)}" class="sidebar-activity-item${isActive ? " is-active" : ""}">
            <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${getActIcon(act, isDone)}</span>
            <span><strong>${APP.escapeHtml(act.prefix)}</strong> ${APP.escapeHtml(act.title)}</span>
          </a>
        `;
      })
      .join("");

    const nextLesson = part.lessons.find((l) => l.id === lesson.id + 1);
    const nextHtml = nextLesson
      ? `
        <div class="sidebar-next-lesson">
          <div class="sidebar-next-label">Bài học tiếp theo:</div>
          <a href="${getActHref(nextLesson, nextLesson.activities[0])}" class="sidebar-next-link">${APP.escapeHtml(nextLesson.title)}</a>
        </div>
      `
      : "";

    lessonSidebarList.innerHTML = `
      ${itemsHtml}
      <a href="part.html?part=${part.num}" class="sidebar-back-unit-btn">&larr; Quay lại chương học</a>
      ${nextHtml}
    `;
  }

  function renderHeaderNav() {
    breadcrumbNav.innerHTML = `
      <a href="index.html" class="breadcrumb-link">${APP.escapeHtml(APP.DATA.course.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="part.html?part=${part.num}" class="breadcrumb-link">${APP.escapeHtml(part.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">${APP.escapeHtml(lesson.title)}</span>
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

  function renderLinkedQuestionsHtml(item) {
    return item.questions
      .map((q) => {
        const chosen = item.selectedMap[q.num] !== undefined ? item.selectedMap[q.num] : -1;
        const optsHtml = q.options
          .map((optText, idx) => {
            const classes = ["grammar-radio-opt"];
            if (item.checked) {
              if (idx === q.answer) classes.push("is-correct");
              else if (idx === chosen) classes.push("is-wrong");
            } else if (idx === chosen) {
              classes.push("is-selected");
            }
            return `
              <label class="${classes.join(" ")}">
                <input type="radio" name="setQ_${q.num}" data-qnum="${q.num}" value="${idx}" ${chosen === idx ? "checked" : ""} />
                <span>${APP.escapeHtml(optText)}</span>
              </label>
            `;
          })
          .join("");

        return `
          <div class="part3-q-block">
            <p class="grammar-q-text" style="margin-bottom:10px;">
              <span class="grammar-q-num">Q${q.num}:</span> ${APP.escapeHtml(q.text)}
            </p>
            <div class="grammar-radio-list">${optsHtml}</div>
            ${item.checked ? `<div class="grammar-explain-box" style="margin-top:10px;"><strong>Giải thích:</strong> ${APP.escapeHtml(q.explain)}</div>` : ""}
          </div>
        `;
      })
      .join("");
  }

  function renderPartBody(item) {
    /* Part 1: Photograph + A/B/C/D */
    if (part.num === 1) {
      const letters = ["A.", "B.", "C.", "D."];
      const optionsHtml = letters
        .map((label, idx) => {
          const classes = ["grammar-radio-opt"];
          if (item.checked) {
            if (idx === item.answer) classes.push("is-correct");
            else if (idx === item.selected) classes.push("is-wrong");
          } else if (idx === item.selected) {
            classes.push("is-selected");
          }
          return `
            <label class="${classes.join(" ")}">
              <input type="radio" name="partMcq" value="${idx}" ${item.selected === idx ? "checked" : ""} />
              <span>${label}</span>
            </label>
          `;
        })
        .join("");

      const transcriptHtml =
        item.checked || item.showTranscript
          ? `
            <div class="part-transcript-box">
              <div class="part-transcript-title">Transcript (Part 1 — Q${item.num}):</div>
              ${item.statements
                .map((st, i) => `<div class="part-transcript-line${item.checked && i === item.answer ? " is-answer-line" : ""}">${APP.escapeHtml(st)}</div>`)
                .join("")}
              ${item.checked ? `<div style="margin-top:8px; color:var(--color-success);"><strong>Giải thích:</strong> ${APP.escapeHtml(item.explain)}</div>` : ""}
            </div>
          `
          : "";

      return `
        <div class="part1-layout">
          <div class="part1-photo-card">
            <img src="${APP.escapeHtml(item.image)}" alt="Part 1 Photograph ${item.num}" />
            <div class="part1-photo-caption">${APP.escapeHtml(item.caption)}</div>
          </div>
          <div>
            <div style="font-weight:700; margin-bottom:10px; color:var(--color-primary);">Q${item.num}: Chọn đáp án mô tả đúng tranh</div>
            <div class="grammar-radio-list">${optionsHtml}</div>
          </div>
        </div>
        ${transcriptHtml}
      `;
    }

    /* Part 2: Question-Response A/B/C */
    if (part.num === 2) {
      const letters = ["A.", "B.", "C."];
      const optionsHtml = letters
        .map((label, idx) => {
          const classes = ["grammar-radio-opt"];
          if (item.checked) {
            if (idx === item.answer) classes.push("is-correct");
            else if (idx === item.selected) classes.push("is-wrong");
          } else if (idx === item.selected) {
            classes.push("is-selected");
          }
          return `
            <label class="${classes.join(" ")}">
              <input type="radio" name="partMcq" value="${idx}" ${item.selected === idx ? "checked" : ""} />
              <span>${label}</span>
            </label>
          `;
        })
        .join("");

      const transcriptHtml =
        item.checked || item.showTranscript
          ? `
            <div class="part-transcript-box">
              <div class="part-transcript-title">Transcript (Part 2 — Q${item.num}):</div>
              <div class="part-transcript-line"><strong>Question:</strong> ${APP.escapeHtml(item.question)}</div>
              ${item.responses
                .map((r, i) => `<div class="part-transcript-line${item.checked && i === item.answer ? " is-answer-line" : ""}">${APP.escapeHtml(r)}</div>`)
                .join("")}
              ${item.checked ? `<div style="margin-top:8px; color:var(--color-success);"><strong>Giải thích:</strong> ${APP.escapeHtml(item.explain)}</div>` : ""}
            </div>
          `
          : "";

      return `
        <div style="font-weight:700; margin-bottom:12px;">Q${item.num}: Nghe câu hỏi và chọn câu trả lời phù hợp nhất (A, B hoặc C)</div>
        <div class="grammar-radio-list">${optionsHtml}</div>
        ${transcriptHtml}
      `;
    }

    /* Part 3 (Conversations) & Part 4 (Talks) */
    if (part.num === 3 || part.num === 4) {
      const questionsHtml = renderLinkedQuestionsHtml(item);
      let transcriptHtml = "";
      if (item.checked || item.showTranscript) {
        if (part.num === 3) {
          transcriptHtml = `
            <div class="part-transcript-box">
              <div class="part-transcript-title">Transcript hội thoại (Đoạn ${item.num}):</div>
              ${item.dialogue
                .map((d) => `<div class="part-transcript-line"><strong>${APP.escapeHtml(d.speaker)}:</strong> ${APP.escapeHtml(d.text)}</div>`)
                .join("")}
            </div>
          `;
        } else {
          transcriptHtml = `
            <div class="part-transcript-box">
              <div class="part-transcript-title">Transcript bài nói (Part 4 — Đoạn ${item.num}):</div>
              <div class="part-transcript-line">${APP.escapeHtml(item.talkText)}</div>
            </div>
          `;
        }
      }
      return `${questionsHtml}${transcriptHtml}`;
    }

    /* Part 5: Incomplete Sentences */
    if (part.num === 5) {
      const optionsHtml = item.options
        .map((optText, idx) => {
          const classes = ["grammar-radio-opt"];
          if (item.checked) {
            if (idx === item.answer) classes.push("is-correct");
            else if (idx === item.selected) classes.push("is-wrong");
          } else if (idx === item.selected) {
            classes.push("is-selected");
          }
          return `
            <label class="${classes.join(" ")}">
              <input type="radio" name="partMcq" value="${idx}" ${item.selected === idx ? "checked" : ""} />
              <span>${APP.escapeHtml(optText)}</span>
            </label>
          `;
        })
        .join("");

      return `
        <p class="grammar-q-text${highlightOn ? " is-highlight-on" : ""}">
          <span class="grammar-q-num">Q${item.num}:</span>
          <span>${item.sentence}</span>
        </p>
        <div class="grammar-radio-list">${optionsHtml}</div>
        ${item.checked ? `<div class="grammar-explain-box"><strong>Giải thích:</strong> ${APP.escapeHtml(item.explain)}</div>` : ""}
      `;
    }

    /* Part 6 (Text Completion) & Part 7 (Reading Comprehension) */
    return `
      <div class="reading-passage-card">
        <div class="reading-passage-header">${APP.escapeHtml(item.docType || "TOEIC Reading Passage")}</div>
        ${item.meta ? `<div class="reading-passage-meta">${item.meta}</div>` : ""}
        <div>${item.passageHtml}</div>
      </div>
      ${renderLinkedQuestionsHtml(item)}
    `;
  }

  function renderPractice() {
    const item = items[currentIndex];
    const pillsHtml = items
      .map((it, idx) => {
        const classes = ["problemset-problem-number"];
        if (it.checked) classes.push("is-done");
        if (idx === currentIndex) classes.push("is-active");
        return `<button type="button" class="${classes.join(" ")}" data-item-index="${idx}">${idx + 1}</button>`;
      })
      .join("");

    const leftToolbarHtml = isAudioPart
      ? `
        <button type="button" class="btn btn-outline" id="toggleTranscriptBtn" style="height:34px; padding: 0 12px; font-size: 13px;">
          ${item.showTranscript ? "Ẩn Transcript" : "Hiện Transcript"}
        </button>
      `
      : `
        <label class="auto-next-toggle">
          <input type="checkbox" id="highlightToggle" ${highlightOn ? "checked" : ""} />
          <span class="auto-next-track" aria-hidden="true"><span class="auto-next-thumb"></span></span>
          <span>Highlight từ khóa</span>
        </label>
      `;

    const audioBarHtml = isAudioPart
      ? `
        <div class="plyr-bar">
          <button type="button" class="plyr-play-btn" id="plyrPlayBtn" title="Phát audio câu hỏi" aria-label="Phát audio câu hỏi">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>
          </button>
          <div class="plyr-progress-wrap" id="plyrProgressWrap" title="Bấm để nghe lại">
            <div class="plyr-progress-fill" id="plyrProgressFill"></div>
          </div>
          <div class="plyr-meta-controls">
            <button type="button" class="plyr-chip-btn" id="speedToggleBtn">${speeds[speedIndex]}x</button>
          </div>
        </div>
      `
      : "";

    mainContentMount.innerHTML = `
      <div class="content-header" style="padding-bottom: 10px;">
        <h1 class="learncourse-heading" style="margin:0; font-size: 1.25rem;">${APP.escapeHtml(lesson.title)} — ${APP.escapeHtml(currentAct.title)}</h1>
      </div>

      <section class="contentblock" aria-label="Bài luyện tập ${APP.escapeHtml(part.title)}">
        <div class="grammar-mcq-toolbar">
          ${leftToolbarHtml}
          <div class="grammar-mcq-actions">
            <button type="button" class="btn btn-primary" id="checkAnswerBtn" style="height:34px; padding: 0 14px; font-size: 13px;">Kiểm tra đáp án</button>
            <button type="button" class="btn btn-outline" id="clearAnswerBtn" style="height:34px; padding: 0 12px; font-size: 13px;">Xoá hết</button>
          </div>
        </div>

        ${audioBarHtml}
        ${renderPartBody(item)}
      </section>

      <section class="contentblock quiz-nav-card" aria-label="Điều hướng câu hỏi">
        <div class="problem-set-controls">
          <button type="button" class="problem-set-control-btn" id="prevItemBtn" ${currentIndex === 0 ? "disabled" : ""}>&lt; Câu trước</button>

          <label class="auto-next-toggle">
            <input type="checkbox" id="autoNextCheckbox" ${autoNext ? "checked" : ""} />
            <span class="auto-next-track" aria-hidden="true"><span class="auto-next-thumb"></span></span>
            <span>Tự động chuyển câu</span>
          </label>

          <button type="button" class="problem-set-control-btn" id="nextItemBtn" ${currentIndex === items.length - 1 ? "disabled" : ""}>Câu sau &gt;</button>
        </div>

        <div class="problemset-grid-header">
          <h2 class="problemset-grid-title">Danh sách bài tập:</h2>
          <span class="problemset-grid-score">${isSetPart ? "Đoạn" : "Câu"} <strong>${currentIndex + 1}/${items.length}</strong></span>
        </div>

        <div class="problemset-change-problem">${pillsHtml}</div>
      </section>
    `;

    bindEvents();
  }

  function bindEvents() {
    const item = items[currentIndex];
    const playBtn = document.getElementById("plyrPlayBtn");
    const progressWrap = document.getElementById("plyrProgressWrap");
    const speedBtn = document.getElementById("speedToggleBtn");
    const transcriptBtn = document.getElementById("toggleTranscriptBtn");
    const highlightToggle = document.getElementById("highlightToggle");
    const checkBtn = document.getElementById("checkAnswerBtn");
    const clearBtn = document.getElementById("clearAnswerBtn");
    const prevBtn = document.getElementById("prevItemBtn");
    const nextBtn = document.getElementById("nextItemBtn");
    const autoNextCheckbox = document.getElementById("autoNextCheckbox");

    if (playBtn) playBtn.addEventListener("click", playCurrentAudio);
    if (progressWrap) progressWrap.addEventListener("click", playCurrentAudio);
    if (speedBtn) {
      speedBtn.addEventListener("click", () => {
        speedIndex = (speedIndex + 1) % speeds.length;
        renderPractice();
      });
    }
    if (transcriptBtn) {
      transcriptBtn.addEventListener("click", () => {
        item.showTranscript = !item.showTranscript;
        renderPractice();
      });
    }
    if (highlightToggle) {
      highlightToggle.addEventListener("change", (e) => {
        highlightOn = e.target.checked;
        renderPractice();
      });
    }

    if (isSetPart) {
      mainContentMount.querySelectorAll("input[data-qnum]").forEach((radio) => {
        radio.addEventListener("change", (e) => {
          item.selectedMap[Number(e.target.dataset.qnum)] = Number(e.target.value);
          item.checked = false;
          renderPractice();
        });
      });
    } else {
      mainContentMount.querySelectorAll("input[name='partMcq']").forEach((radio) => {
        radio.addEventListener("change", (e) => {
          item.selected = Number(e.target.value);
          item.checked = false;
          renderPractice();
        });
      });
    }

    if (checkBtn) {
      checkBtn.addEventListener("click", () => {
        if (!isSetPart && item.selected < 0) {
          APP.showToast("Hãy chọn một đáp án trước khi kiểm tra!");
          return;
        }
        item.checked = true;
        renderPractice();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (isSetPart) item.selectedMap = {};
        else item.selected = -1;
        item.checked = false;
        renderPractice();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
          if ("speechSynthesis" in window) window.speechSynthesis.cancel();
          currentIndex -= 1;
          renderPractice();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentIndex < items.length - 1) {
          if ("speechSynthesis" in window) window.speechSynthesis.cancel();
          currentIndex += 1;
          renderPractice();
        }
      });
    }
    if (autoNextCheckbox) {
      autoNextCheckbox.addEventListener("change", (e) => {
        autoNext = e.target.checked;
      });
    }

    mainContentMount.querySelectorAll(".problemset-problem-number").forEach((pill) => {
      pill.addEventListener("click", () => {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        currentIndex = Number(pill.dataset.itemIndex);
        renderPractice();
      });
    });
  }

  completeAndNextBtn.addEventListener("click", () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    const set = APP.loadPartCompletedSet(part.key);
    set.add(currentAct.id);
    APP.savePartCompletedSet(part.key, set);
    window.location.href = getNextTargetHref();
  });

  renderSidebar();
  renderHeaderNav();
  renderPractice();
})();
