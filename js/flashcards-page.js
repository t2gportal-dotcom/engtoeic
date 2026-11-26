/* flashcards.html — Dedicated Flashcards Term List page (?list=1..23) */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const list = APP.getListByNumber(APP.getQueryParam("list", "1"));

  let termFilterQuery = "";
  let isShuffled = false;
  let shuffledOrder = [];
  let pageFilter = "all";

  const sidebarListTitle = document.getElementById("sidebarListTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevLessonLink = document.getElementById("prevLessonLink");
  const nextLessonLink = document.getElementById("nextLessonLink");
  const mainContentMount = document.getElementById("mainContentMount");
  const mainScrollArea = document.getElementById("mainScrollArea");
  const completeAndNextBtn = document.getElementById("completeAndNextBtn");

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
              .map(
                (ex) => `
                <li>
                  <button type="button" class="audio-btn audio-btn-inline" data-speak="${APP.escapeHtml(ex)}" data-lang="en-US" title="Nghe câu ví dụ" aria-label="Nghe câu ví dụ">
                    ${APP.ICONS.speaker}
                  </button>
                  <span>${APP.formatExampleHtml(ex)}</span>
                </li>
              `
              )
              .join("")}
          </ul>
        `
        : "";

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
