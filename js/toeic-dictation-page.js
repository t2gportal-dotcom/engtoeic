/* toeic-dictation.html — Unit page for "Luyện nghe chép chính tả TOEIC" */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const TD = window.BT_TOEIC_DICTATION_DATA;
  let searchQuery = "";

  const sidebarMenuList = document.getElementById("sidebarMenuList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const mainContentMount = document.getElementById("mainContentMount");

  APP.initSharedShell({
    onProgressReset: () => {
      APP.savePartCompletedSet("toeic-dictation", new Set());
      renderMain();
    }
  });

  function renderSidebar() {
    sidebarMenuList.innerHTML = APP.DATA.course.menus
      .map((menu) => {
        const isActive = menu.id === "dictation-toeic";
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
      <span class="breadcrumb-current">Luyện nghe chép chính tả TOEIC</span>
    `;
  }

  function renderTestCard(test, completedSet) {
    const doneCount = test.activities.filter((a) => completedSet.has(a.id)).length;
    const allDone = doneCount === test.activities.length;

    const rowsHtml = test.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const iconHtml = isDone ? APP.ICONS.check : APP.ICONS.pencil;
        return `
          <a href="toeic-dictation-practice.html?test=${test.id}&part=${act.part}" class="learncourse-unit-lesson-activity">
            <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${iconHtml}</span>
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
          <span>${APP.escapeHtml(test.title)}</span>
          <span class="lesson-list-badge${allDone ? " is-all-done" : ""}">${doneCount}/${test.activities.length}</span>
        </h2>
        <div class="lesson-activities">${rowsHtml}</div>
      </article>
    `;
  }

  function renderMain() {
    const completedSet = APP.loadPartCompletedSet("toeic-dictation");
    const completed = completedSet.size;
    const total = TD.totalActivities;
    const percent = total > 0 ? Math.floor((completed / total) * 100) : 0;
    const q = searchQuery.trim().toLowerCase();

    const filteredTests = q
      ? TD.tests.filter((t) => t.title.toLowerCase().includes(q))
      : TD.tests;

    mainContentMount.innerHTML = `
      <div class="content-header">
        <h1 class="learncourse-heading-xl">Luyện nghe chép chính tả TOEIC</h1>
      </div>

      <form class="search-form" id="tdSearchForm" role="search">
        <div class="search-input-wrap">
          <input
            type="text"
            class="form-control"
            id="tdSearchInput"
            placeholder="Nhập tên bộ đề (VD: Collection 1, ETS 2024, Test 5...)"
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
          <span class="progress-count">${completed}/${total} bài đã hoàn thành • ${TD.tests.length} đề thi TOEIC</span>
        </div>
        <div class="progress-track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${percent}%;"></div>
        </div>
      </section>

      ${
        q
          ? `<div class="search-result-bar"><span>Tìm thấy <strong>${filteredTests.length}</strong> đề thi</span><button type="button" class="clear-search-btn" id="clearSearchBtn">Xóa bộ lọc</button></div>`
          : ""
      }

      <section>
        ${
          filteredTests.length > 0
            ? filteredTests.map((t) => renderTestCard(t, completedSet)).join("")
            : `<div class="contentblock empty-state"><h3>Không tìm thấy đề thi</h3><p>Không có đề nào khớp với "${APP.escapeHtml(searchQuery.trim())}".</p></div>`
        }
      </section>
    `;

    const form = document.getElementById("tdSearchForm");
    const input = document.getElementById("tdSearchInput");
    const clearBtn = document.getElementById("clearSearchBtn");
    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        searchQuery = input.value;
        renderMain();
      });
    }
    if (clearBtn) clearBtn.addEventListener("click", () => { searchQuery = ""; renderMain(); });
  }

  renderSidebar();
  renderBreadcrumb();
  renderMain();
})();
