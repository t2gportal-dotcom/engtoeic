/* grammar.html — Dedicated "Ngữ pháp TOEIC" Unit Page (18 Topics, 108 Activities) */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const GRAMMAR = window.BT_TOEIC_GRAMMAR_DATA;
  let searchQuery = "";

  const sidebarMenuList = document.getElementById("sidebarMenuList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const mainContentMount = document.getElementById("mainContentMount");

  APP.initSharedShell({
    onProgressReset: () => {
      APP.saveGrammarCompletedSet(new Set());
      renderMain();
    }
  });

  function renderSidebar() {
    sidebarMenuList.innerHTML = APP.DATA.course.menus
      .map((menu) => {
        const isActive = menu.id === "grammar-toeic";
        return `
          <a href="${APP.getMenuHref(menu.id)}" class="learncourse-sidebar-item${isActive ? " is-active" : ""}">
            <span>${APP.escapeHtml(menu.title)}</span>
          </a>
        `;
      })
      .join("");
  }

  function renderBreadcrumb() {
    breadcrumbNav.innerHTML = `
      <a href="index.html" class="breadcrumb-link">${APP.escapeHtml(APP.DATA.course.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">Ngữ pháp TOEIC</span>
    `;
  }

  function getActivityHref(topicId, act) {
    return act.isVideo
      ? `grammar-lesson.html?topic=${topicId}&act=${encodeURIComponent(act.id)}`
      : `grammar-practice.html?topic=${topicId}&act=${encodeURIComponent(act.id)}`;
  }

  function renderTopicCard(topic, completedSet) {
    const doneCount = topic.activities.filter((a) => completedSet.has(a.id)).length;
    const allDone = doneCount === topic.activities.length && topic.activities.length > 0;

    const rowsHtml = topic.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const iconHtml = isDone ? APP.ICONS.check : act.isVideo ? APP.ICONS.play : APP.ICONS.pencil;
        const doneClass = isDone ? " completed" : "";
        const statusHtml = isDone ? `<span class="activity-status-pill">Hoàn thành</span>` : "";

        return `
          <a href="${getActivityHref(topic.id, act)}" class="learncourse-unit-lesson-activity">
            <span class="learncourse-activity-icon${doneClass}" aria-hidden="true">${iconHtml}</span>
            <span class="activity-label">
              <span class="activity-prefix">${APP.escapeHtml(act.prefix)}</span> ${APP.escapeHtml(act.title)}
            </span>
            ${statusHtml}
          </a>
        `;
      })
      .join("");

    return `
      <article class="learncourse-unit-lesson contentblock">
        <h2 class="learncourse-heading">
          <span>${APP.escapeHtml(topic.title)}</span>
          <span class="lesson-list-badge${allDone ? " is-all-done" : ""}">${doneCount}/${topic.activities.length}</span>
        </h2>
        <div class="lesson-activities">
          ${rowsHtml}
        </div>
      </article>
    `;
  }

  function renderMain() {
    const completedSet = APP.loadGrammarCompletedSet();
    const completed = completedSet.size;
    const total = GRAMMAR.totalActivities;
    const percent = total > 0 ? Math.floor((completed / total) * 100) : 0;
    const q = searchQuery.trim().toLowerCase();

    const filteredTopics = GRAMMAR.topics
      .map((topic) => {
        if (!q) return topic;
        if (topic.title.toLowerCase().includes(q)) return topic;
        const matchingActs = topic.activities.filter((a) =>
          `${a.prefix} ${a.title}`.toLowerCase().includes(q)
        );
        return matchingActs.length > 0 ? { ...topic, activities: matchingActs } : null;
      })
      .filter(Boolean);

    const searchResultBarHtml = q
      ? `
        <div class="search-result-bar">
          <span>Tìm thấy <strong>${filteredTopics.length}</strong> chủ điểm phù hợp với "<strong>${APP.escapeHtml(searchQuery.trim())}</strong>"</span>
          <button type="button" class="clear-search-btn" id="clearSearchBtn">Xóa bộ lọc</button>
        </div>
      `
      : "";

    const cardsHtml =
      filteredTopics.length > 0
        ? filteredTopics.map((t) => renderTopicCard(t, completedSet)).join("")
        : `
          <div class="contentblock empty-state">
            <h3>Không tìm thấy bài học</h3>
            <p>Không có chủ điểm ngữ pháp nào khớp với "${APP.escapeHtml(searchQuery.trim())}".</p>
            <button type="button" class="btn btn-primary" id="emptyClearSearchBtn">Hiển thị tất cả 18 chủ điểm</button>
          </div>
        `;

    mainContentMount.innerHTML = `
      <div class="content-header">
        <h1 class="learncourse-heading-xl">Ngữ pháp TOEIC</h1>
      </div>

      <form class="search-form" id="grammarSearchForm" role="search">
        <div class="search-input-wrap">
          <input
            type="text"
            class="form-control"
            id="grammarSearchInput"
            placeholder="Nhập từ khoá (VD: Danh từ, Thì, Passive voice, điều kiện...)"
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
          <span class="progress-percent">${percent}%</span>
          <span class="progress-count">${completed}/${total} bài đã hoàn thành • ${GRAMMAR.topics.length} chủ điểm ngữ pháp</span>
        </div>
        <div class="progress-track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${percent}%;"></div>
        </div>
      </section>

      ${searchResultBarHtml}

      <section aria-label="Danh sách chủ điểm Ngữ pháp TOEIC">
        ${cardsHtml}
      </section>
    `;

    const form = document.getElementById("grammarSearchForm");
    const input = document.getElementById("grammarSearchInput");
    const clearBtn = document.getElementById("clearSearchBtn");
    const emptyClearBtn = document.getElementById("emptyClearSearchBtn");

    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        searchQuery = input.value;
        renderMain();
      });
    }
    if (clearBtn) clearBtn.addEventListener("click", () => { searchQuery = ""; renderMain(); });
    if (emptyClearBtn) emptyClearBtn.addEventListener("click", () => { searchQuery = ""; renderMain(); });
  }

  renderSidebar();
  renderBreadcrumb();
  renderMain();
})();
