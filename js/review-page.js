/* review.html — Dedicated 3D Flip Flashcards Review page (?list=1..23) */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const list = APP.getListByNumber(APP.getQueryParam("list", "1"));
  const words = list.words;

  let reviewIndex = 0;
  let reviewFlipped = false;
  const reviewKnown = new Set();
  const reviewAgain = new Set();

  const sidebarListTitle = document.getElementById("sidebarListTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const mainContentMount = document.getElementById("mainContentMount");

  APP.initSharedShell();
  document.title = `Luyện tập Flashcards - ${list.title} - BT TOEIC`;

  function renderSidebar() {
    const completedSet = APP.loadCompletedSet();
    sidebarListTitle.textContent = list.title;
    sidebarListTitle.href = `flashcards.html?list=${list.number}`;

    const itemsHtml = list.activities
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
        const href = pageHrefMap[act.key] || `flashcards.html?list=${list.number}`;
        return `
          <a href="${href}" class="sidebar-activity-item${isActive ? " is-active" : ""}">
            <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${iconHtml}</span>
            <span><strong>${APP.escapeHtml(act.prefix)}</strong> ${APP.escapeHtml(act.label)}</span>
          </a>
        `;
      })
      .join("");

    lessonSidebarList.innerHTML = `
      ${itemsHtml}
      <a href="flashcards.html?list=${list.number}" class="sidebar-back-unit-btn">&larr; Quay lại danh sách ${APP.escapeHtml(list.title)}</a>
      <a href="index.html" class="sidebar-back-unit-btn">&larr; Quay lại Từ vựng TOEIC</a>
    `;
  }

  function renderBreadcrumb() {
    breadcrumbNav.innerHTML = `
      <a href="index.html" class="breadcrumb-link">${APP.escapeHtml(APP.DATA.course.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="index.html" class="breadcrumb-link">Từ vựng TOEIC</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="flashcards.html?list=${list.number}" class="breadcrumb-link">${APP.escapeHtml(list.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">Luyện tập flashcards</span>
    `;
  }

  function renderReview() {
    if (!words.length) return;
    if (reviewIndex >= words.length) reviewIndex = 0;
    if (reviewIndex < 0) reviewIndex = words.length - 1;

    const term = words[reviewIndex];
    const firstEx = term.examples && term.examples.length > 0 ? term.examples[0] : "";

    mainContentMount.innerHTML = `
      <div class="review-header">
        <a href="flashcards.html?list=${list.number}" class="btn btn-outline">&larr; Quay lại danh sách ${APP.escapeHtml(list.title)}</a>
        <div class="review-stats">
          <span>Thẻ <strong>${reviewIndex + 1} / ${words.length}</strong></span>
          <span class="review-stat-pill known">Đã nhớ: ${reviewKnown.size}</span>
          <span class="review-stat-pill again">Cần ôn: ${reviewAgain.size}</span>
        </div>
      </div>

      <div class="flashcard-stage">
        <div class="flashcard-3d${reviewFlipped ? " is-flipped" : ""}" id="flashcard3d" tabindex="0" role="button" aria-label="Lật thẻ flashcard">
          <div class="flashcard-face flashcard-front">
            <div class="fc-front-word">${APP.escapeHtml(term.word)}</div>
            <div class="fc-front-meta">${APP.escapeHtml(term.pos)} ${APP.escapeHtml(term.phonetic)}</div>
            <div class="fc-audio-row">
              <button type="button" class="audio-btn" data-speak="${APP.escapeHtml(term.word)}" data-lang="en-GB">${APP.ICONS.speaker}<span>UK</span></button>
              <button type="button" class="audio-btn" data-speak="${APP.escapeHtml(term.word)}" data-lang="en-US">${APP.ICONS.speaker}<span>US</span></button>
            </div>
            <div class="fc-flip-hint">Nhấn vào thẻ hoặc phím Space để lật mặt sau</div>
          </div>

          <div class="flashcard-face flashcard-back">
            <div class="termlist-item-body" style="width:100%;">
              <div class="termlist-item-text">
                <h2 class="termlist-heading" style="margin-bottom:8px;">
                  <span>${APP.escapeHtml(term.word)}</span>
                  <span class="termlist-pos">${APP.escapeHtml(term.pos)}</span>
                  <span class="termlist-phonetic">${APP.escapeHtml(term.phonetic)}</span>
                </h2>
                <div class="termlist-section-label">Định nghĩa:</div>
                <div class="termlist-meaning">${APP.escapeHtml(term.meaning)}</div>
                ${
                  firstEx
                    ? `
                  <div class="termlist-section-label">Ví dụ:</div>
                  <div style="font-size: 14px; line-height: 1.55;">${APP.formatExampleHtml(firstEx)}</div>
                `
                    : ""
                }
              </div>
              ${
                term.image
                  ? `<div class="termlist-item-media" style="width:165px;"><img src="${APP.escapeHtml(term.image)}" alt="${APP.escapeHtml(term.word)}" onerror="this.parentElement.style.display='none'" /></div>`
                  : ""
              }
            </div>
          </div>
        </div>
      </div>

      <div class="review-controls">
        <button type="button" class="btn btn-outline" id="fcPrevBtn">&larr; Thẻ trước</button>
        <div class="review-controls-group">
          <button type="button" class="btn btn-outline" id="fcAgainBtn">Cần ôn lại</button>
          <button type="button" class="btn btn-success" id="fcKnownBtn">Đã nhớ &check;</button>
        </div>
        <button type="button" class="btn btn-primary" id="fcNextBtn">Thẻ tiếp theo &rarr;</button>
      </div>
    `;

    const card = document.getElementById("flashcard3d");
    const prevBtn = document.getElementById("fcPrevBtn");
    const nextBtn = document.getElementById("fcNextBtn");
    const knownBtn = document.getElementById("fcKnownBtn");
    const againBtn = document.getElementById("fcAgainBtn");

    card.addEventListener("click", (e) => {
      if (e.target.closest(".audio-btn")) return;
      reviewFlipped = !reviewFlipped;
      card.classList.toggle("is-flipped", reviewFlipped);
    });

    prevBtn.addEventListener("click", () => {
      reviewIndex = (reviewIndex - 1 + words.length) % words.length;
      reviewFlipped = false;
      renderReview();
    });

    nextBtn.addEventListener("click", () => {
      reviewIndex = (reviewIndex + 1) % words.length;
      reviewFlipped = false;
      renderReview();
    });

    knownBtn.addEventListener("click", () => {
      reviewAgain.delete(term.word);
      reviewKnown.add(term.word);
      reviewIndex = (reviewIndex + 1) % words.length;
      reviewFlipped = false;
      renderReview();
    });

    againBtn.addEventListener("click", () => {
      reviewKnown.delete(term.word);
      reviewAgain.add(term.word);
      reviewIndex = (reviewIndex + 1) % words.length;
      reviewFlipped = false;
      renderReview();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
    if (e.code === "Space") {
      e.preventDefault();
      const card = document.getElementById("flashcard3d");
      reviewFlipped = !reviewFlipped;
      if (card) card.classList.toggle("is-flipped", reviewFlipped);
    } else if (e.key === "ArrowRight") {
      reviewIndex = (reviewIndex + 1) % words.length;
      reviewFlipped = false;
      renderReview();
    } else if (e.key === "ArrowLeft") {
      reviewIndex = (reviewIndex - 1 + words.length) % words.length;
      reviewFlipped = false;
      renderReview();
    }
  });

  renderSidebar();
  renderBreadcrumb();
  renderReview();
})();
