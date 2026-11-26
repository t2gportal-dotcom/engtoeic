/* part.html — Unit page for Part 1, Part 2, and Part 3 (?part=1|2|3) */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const PARTS = window.BT_TOEIC_PARTS_DATA;
  const part = PARTS.getPart(APP.getQueryParam("part", "1"));
  let searchQuery = "";

  const sidebarMenuList = document.getElementById("sidebarMenuList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const mainContentMount = document.getElementById("mainContentMount");

  APP.initSharedShell({
    onProgressReset: () => {
      APP.savePartCompletedSet(part.key, new Set());
      renderMain();
    }
  });

  document.title = `${part.title} - Complete TOEIC - BT TOEIC`;

  function renderSidebar() {
    sidebarMenuList.innerHTML = APP.DATA.course.menus
      .map((menu) => {
        const isActive = menu.id === part.key;
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
      <span class="breadcrumb-current">${APP.escapeHtml(part.title)}</span>
    `;
  }

  function getActivityHref(lessonId, act) {
    return act.type === "practice"
      ? `part-practice.html?part=${part.num}&lesson=${lessonId}&act=${encodeURIComponent(act.id)}`
      : `part-lesson.html?part=${part.num}&lesson=${lessonId}&act=${encodeURIComponent(act.id)}`;
  }

  function getActivityIcon(act, isDone) {
    if (isDone) return APP.ICONS.check;
    if (act.type === "video") return APP.ICONS.play;
    if (act.type === "reading") return APP.ICONS.book;
    return APP.ICONS.pencil;
  }

  function renderLessonCard(lesson, completedSet) {
    const doneCount = lesson.activities.filter((a) => completedSet.has(a.id)).length;
    const allDone = doneCount === lesson.activities.length && lesson.activities.length > 0;

    const rowsHtml = lesson.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        return `
          <a href="${getActivityHref(lesson.id, act)}" class="learncourse-unit-lesson-activity">
            <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${getActivityIcon(act, isDone)}</span>
            <span class="activity-label">
              <span class="activity-prefix">${APP.escapeHtml(act.prefix)}</span> ${APP.escapeHtml(act.title)}
            </span>
            ${isDone ? `<span class="activity-status-pill">Hoàn thành</span>` : ""}
          </a>
        `;
      })
      .join("");

    return `
      <article class="learncourse-unit-lesson contentblock">
        <h2 class="learncourse-heading">
          <span>${APP.escapeHtml(lesson.title)}</span>
          <span class="lesson-list-badge${allDone ? " is-all-done" : ""}">${doneCount}/${lesson.activities.length}</span>
        </h2>
        <div class="lesson-activities">${rowsHtml}</div>
      </article>
    `;
  }

  function renderMain() {
    const completedSet = APP.loadPartCompletedSet(part.key);
    const completed = completedSet.size;
    const total = part.totalActivities;
    const percent = total > 0 ? Math.floor((completed / total) * 100) : 0;
    const q = searchQuery.trim().toLowerCase();

    const filteredLessons = part.lessons
      .map((lesson) => {
        if (!q) return lesson;
        if (lesson.title.toLowerCase().includes(q)) return lesson;
        const matchingActs = lesson.activities.filter((a) =>
          `${a.prefix} ${a.title}`.toLowerCase().includes(q)
        );
        return matchingActs.length > 0 ? { ...lesson, activities: matchingActs } : null;
      })
      .filter(Boolean);

    const searchResultBarHtml = q
      ? `
        <div class="search-result-bar">
          <span>Tìm thấy <strong>${filteredLessons.length}</strong> bài học phù hợp với "<strong>${APP.escapeHtml(searchQuery.trim())}</strong>"</span>
          <button type="button" class="clear-search-btn" id="clearSearchBtn">Xóa bộ lọc</button>
        </div>
      `
      : "";

    const cardsHtml =
      filteredLessons.length > 0
        ? filteredLessons.map((l) => renderLessonCard(l, completedSet)).join("")
        : `
          <div class="contentblock empty-state">
            <h3>Không tìm thấy bài học</h3>
            <p>Không có bài nào khớp với "${APP.escapeHtml(searchQuery.trim())}".</p>
            <button type="button" class="btn btn-primary" id="emptyClearSearchBtn">Hiển thị tất cả</button>
          </div>
        `;

    mainContentMount.innerHTML = `
      <div class="content-header">
        <h1 class="learncourse-heading-xl">${APP.escapeHtml(part.title)}</h1>
      </div>

      <form class="search-form" id="partSearchForm" role="search">
        <div class="search-input-wrap">
          <input
            type="text"
            class="form-control"
            id="partSearchInput"
            placeholder="Nhập từ khoá bạn muốn tìm ..."
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
          <span class="progress-count">${completed}/${total} bài đã hoàn thành • ${part.lessons.length} bài học</span>
        </div>
        <div class="progress-track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${percent}%;"></div>
        </div>
      </section>

      ${searchResultBarHtml}

      <section aria-label="Danh sách bài học ${APP.escapeHtml(part.title)}">
        ${cardsHtml}
      </section>
    `;

    const form = document.getElementById("partSearchForm");
    const input = document.getElementById("partSearchInput");
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
