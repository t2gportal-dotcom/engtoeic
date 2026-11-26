/* index.html — Unit page ("Từ vựng TOEIC" — 23 Lists) */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const activeMenuId = APP.getQueryParam("menu", "vocab-toeic");
  let searchQuery = "";

  const sidebarMenuList = document.getElementById("sidebarMenuList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const mainContentMount = document.getElementById("mainContentMount");

  const modal = APP.createModalController(() => renderMainContent());
  APP.initSharedShell({
    onProgressReset: () => renderMainContent()
  });

  function renderSidebar() {
    sidebarMenuList.innerHTML = APP.DATA.course.menus
      .map((menu) => {
        const activeClass = menu.id === activeMenuId ? " is-active" : "";
        return `
          <a href="${APP.getMenuHref(menu.id)}" class="learncourse-sidebar-item${activeClass}">
            <span>${APP.escapeHtml(menu.title)}</span>
          </a>
        `;
      })
      .join("");
  }

  function renderBreadcrumb() {
    const activeMenu = APP.DATA.course.menus.find((m) => m.id === activeMenuId);
    const title = activeMenu ? activeMenu.title : "Từ vựng TOEIC";
    document.title = `${title} - Complete TOEIC - BT TOEIC`;
    breadcrumbNav.innerHTML = `
      <a href="index.html" class="breadcrumb-link">${APP.escapeHtml(APP.DATA.course.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">${APP.escapeHtml(title)}</span>
    `;
  }

  function renderMainContent() {
    if (activeMenuId !== "vocab-toeic") {
      const activeMenu = APP.DATA.course.menus.find((m) => m.id === activeMenuId);
      const title = activeMenu ? activeMenu.title : "Mục học";
      mainContentMount.innerHTML = `
        <div class="content-header">
          <h1 class="learncourse-heading-xl">${APP.escapeHtml(title)}</h1>
        </div>
        <div class="contentblock placeholder-card">
          <h2>Menu "${APP.escapeHtml(title)}" chưa được clone</h2>
          <p>Hiện tại giao diện đã hoàn thiện đầy đủ phần <strong>Từ vựng TOEIC (23 List &bull; ${APP.ALL_WORDS_FLAT.length} từ vựng + Flashcards)</strong>.</p>
          <a href="index.html" class="btn btn-primary">Quay lại Từ vựng TOEIC</a>
        </div>
      `;
      return;
    }

    const completedSet = APP.loadCompletedSet();
    const stats = APP.getProgressStats(completedSet);
    const query = searchQuery.trim().toLowerCase();

    const filteredLists = APP.VOCAB_LISTS.map((list) => {
      if (!query) return list;
      const listTitleMatches = list.title.toLowerCase().includes(query);
      const matchingWords = list.words.filter(
        (w) => w.word.toLowerCase().includes(query) || w.meaning.toLowerCase().includes(query)
      );
      const matchingActivities = list.activities.filter((act) =>
        `${act.prefix} ${act.label}`.toLowerCase().includes(query)
      );
      if (listTitleMatches || matchingWords.length > 0) {
        return { ...list, matchedWordCount: matchingWords.length };
      }
      if (matchingActivities.length > 0) {
        return { ...list, activities: matchingActivities, matchedWordCount: 0 };
      }
      return null;
    }).filter(Boolean);

    const searchResultBarHtml = query
      ? `
        <div class="search-result-bar">
          <span>Tìm thấy <strong>${filteredLists.length}</strong> danh sách phù hợp với "<strong>${APP.escapeHtml(searchQuery.trim())}</strong>"</span>
          <button type="button" class="clear-search-btn" id="clearSearchBtn">Xóa bộ lọc</button>
        </div>
      `
      : "";

    const listsHtml =
      filteredLists.length > 0
        ? filteredLists.map((list) => renderLessonCard(list, completedSet)).join("")
        : `
          <div class="contentblock empty-state">
            <h3>Không tìm thấy kết quả</h3>
            <p>Không có bài học hoặc từ vựng nào khớp với "${APP.escapeHtml(searchQuery.trim())}".</p>
            <button type="button" class="btn btn-primary" id="emptyClearSearchBtn">Hiển thị tất cả List 1 – 23</button>
          </div>
        `;

    mainContentMount.innerHTML = `
      <div class="content-header">
        <h1 class="learncourse-heading-xl">Từ vựng TOEIC</h1>
      </div>

      <form class="search-form" id="vocabSearchForm" role="search">
        <div class="search-input-wrap">
          <input
            type="text"
            class="form-control"
            id="vocabSearchInput"
            placeholder="Nhập từ khoá (VD: List 21, accuracy, Nghe chính tả...)"
            value="${APP.escapeHtml(searchQuery)}"
            autocomplete="off"
          />
          <span class="search-input-icon" aria-hidden="true">${APP.ICONS.search}</span>
        </div>
        <button type="submit" class="btn btn-primary">Tìm kiếm</button>
      </form>

      <section class="contentblock" aria-label="Tiến độ học tập">
        <h2 class="learncourse-heading">Tiến độ học tập</h2>
        <div class="progress-meta">
          <span class="progress-percent">${stats.percent}%</span>
          <span class="progress-count">${stats.completed}/${stats.total} bài đã hoàn thành • ${APP.ALL_WORDS_FLAT.length} từ vựng (23 List)</span>
        </div>
        <div class="progress-track" role="progressbar" aria-valuenow="${stats.percent}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${stats.percent}%;"></div>
        </div>
      </section>

      ${searchResultBarHtml}

      <section aria-label="Danh sách bài học từ vựng TOEIC">
        ${listsHtml}
      </section>
    `;

    bindEvents();
  }

  function renderLessonCard(list, completedSet) {
    const doneInList = list.activities.filter((act) => completedSet.has(act.id)).length;
    const allDone = doneInList === list.activities.length && list.activities.length > 0;
    const badgeClass = allDone ? " is-all-done" : "";
    const matchInfo = list.matchedWordCount > 0 ? ` • ${list.matchedWordCount} từ khớp` : "";

    const rowsHtml = list.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const iconHtml = isDone ? APP.ICONS.check : APP.ICONS[act.icon];
        const doneClass = isDone ? " completed" : "";
        const statusHtml = isDone ? `<span class="activity-status-pill">Hoàn thành</span>` : "";

        /* All 6 activities redirect directly to their dedicated pages */
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
            <a href="${pageHrefMap[act.key]}" class="learncourse-unit-lesson-activity">
              <span class="learncourse-activity-icon${doneClass}" aria-hidden="true">${iconHtml}</span>
              <span class="activity-label">
                <span class="activity-prefix">${APP.escapeHtml(act.prefix)}</span> ${APP.escapeHtml(act.label)}
              </span>
              ${statusHtml}
            </a>
          `;
        }

        return `
          <button type="button" class="learncourse-unit-lesson-activity" data-activity-id="${act.id}">
            <span class="learncourse-activity-icon${doneClass}" aria-hidden="true">${iconHtml}</span>
            <span class="activity-label">
              <span class="activity-prefix">${APP.escapeHtml(act.prefix)}</span> ${APP.escapeHtml(act.label)}
            </span>
            ${statusHtml}
          </button>
        `;
      })
      .join("");

    return `
      <article class="learncourse-unit-lesson contentblock" data-list-id="${list.id}">
        <h2 class="learncourse-heading">
          <span>${APP.escapeHtml(list.title)}<span class="word-count-chip">${list.wordCount} từ${matchInfo}</span></span>
          <span class="lesson-list-badge${badgeClass}">${doneInList}/${list.activities.length}</span>
        </h2>
        <div class="lesson-activities">
          ${rowsHtml}
        </div>
      </article>
    `;
  }

  function bindEvents() {
    const form = document.getElementById("vocabSearchForm");
    const input = document.getElementById("vocabSearchInput");
    const clearBtn = document.getElementById("clearSearchBtn");
    const emptyClearBtn = document.getElementById("emptyClearSearchBtn");

    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        searchQuery = input.value;
        renderMainContent();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchQuery = "";
        renderMainContent();
      });
    }
    if (emptyClearBtn) {
      emptyClearBtn.addEventListener("click", () => {
        searchQuery = "";
        renderMainContent();
      });
    }

    mainContentMount.querySelectorAll("button[data-activity-id]").forEach((btn) => {
      btn.addEventListener("click", () => modal.open(btn.dataset.activityId));
    });
  }

  renderSidebar();
  renderBreadcrumb();
  renderMainContent();
})();
