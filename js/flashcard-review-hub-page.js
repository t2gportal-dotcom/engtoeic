/* flashcard-review-hub.html — Dedicated "Ôn tập Flashcards" Review Hub */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const STUDYING_KEY = "bt_toeic_studying_lists_v1";

  const sidebarMenuList = document.getElementById("sidebarMenuList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const mainContentMount = document.getElementById("mainContentMount");

  APP.initSharedShell({
    onProgressReset: () => {
      saveStudyingListNumbers([]);
      renderMain();
    }
  });

  function loadStudyingListNumbers() {
    const nums = new Set();
    /* Include any list where user has started/completed an activity */
    const completedSet = APP.loadCompletedSet();
    completedSet.forEach((id) => {
      const m = /^list-(\d+):/.exec(id);
      if (m) nums.add(Number(m[1]));
    });
    /* Include manually added lists */
    try {
      const saved = JSON.parse(localStorage.getItem(STUDYING_KEY) || "[]");
      if (Array.isArray(saved)) saved.forEach((n) => nums.add(Number(n)));
    } catch (_) {
      /* ignore */
    }
    return [...nums].filter((n) => n >= 1 && n <= 23).sort((a, b) => a - b);
  }

  function saveStudyingListNumbers(arr) {
    try {
      localStorage.setItem(STUDYING_KEY, JSON.stringify(arr));
    } catch (_) {
      /* ignore */
    }
  }

  function renderSidebar() {
    sidebarMenuList.innerHTML = APP.DATA.course.menus
      .map((menu) => {
        const isActive = menu.id === "review-flashcards";
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
      <span class="breadcrumb-current">Ôn tập Flashcards</span>
    `;
  }

  function renderMain() {
    const studyingNums = loadStudyingListNumbers();
    const studyingLists = studyingNums.map((n) => APP.getListByNumber(n));
    const totalStudyingWords = studyingLists.reduce((sum, l) => sum + l.wordCount, 0);

    const addOptionsHtml = APP.VOCAB_LISTS.filter((l) => !studyingNums.includes(l.number))
      .map((l) => `<option value="${l.number}">${APP.escapeHtml(l.title)} (${l.wordCount} từ)</option>`)
      .join("");

    const cardsSectionHtml =
      studyingLists.length > 0
        ? `
          <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; margin-bottom: 10px;">
            <div style="font-size: 14px; color: var(--color-text-secondary);">
              Đang ôn tập <strong>${studyingLists.length}</strong> List (<strong>${totalStudyingWords}</strong> từ vựng TOEIC)
            </div>
          </div>
          <div class="review-hub-grid">
            ${studyingLists
              .map(
                (list) => `
              <article class="review-hub-card">
                <div>
                  <h3>Từ vựng TOEIC — ${APP.escapeHtml(list.title)}</h3>
                  <div class="review-hub-card-meta">${list.wordCount} từ vựng • Complete TOEIC</div>
                </div>
                <div class="review-hub-card-actions">
                  <a href="review.html?list=${list.number}" class="btn btn-primary" style="flex:1; height:34px; font-size:13px;">Ôn tập ngay</a>
                  <a href="flashcards.html?list=${list.number}" class="btn btn-outline" style="height:34px; padding:0 10px; font-size:13px;">Xem từ</a>
                </div>
              </article>
            `
              )
              .join("")}
          </div>
        `
        : `
          <div class="contentblock empty-state">
            <h3 style="font-style: italic; font-weight: 500;">Bạn chưa bắt đầu học list từ nào.</h3>
            <p>Hãy chọn một List bên dưới để đưa vào danh sách ôn tập, hoặc quay lại mục Từ vựng TOEIC để học từ mới.</p>
            <a href="index.html" class="btn btn-primary">Đi tới Từ vựng TOEIC</a>
          </div>
        `;

    mainContentMount.innerHTML = `
      <div class="review-hub-banner">
        Tính năng này chỉ dùng để review các list từ flashcards đang học. Để học thêm list từ mới, vui lòng vào các bài học tương ứng.
      </div>

      ${
        addOptionsHtml
          ? `
        <div class="contentblock" style="display:flex; flex-wrap:wrap; align-items:center; gap:10px; padding: 14px 18px;">
          <label for="addListSelect" style="font-size: 14px; font-weight: 500;">Thêm List vào ôn tập nhanh:</label>
          <select id="addListSelect" class="dictation-mode-select" style="height:36px; min-width: 180px;">
            ${addOptionsHtml}
          </select>
          <button type="button" class="btn btn-primary" id="addListBtn" style="height:36px; padding:0 16px;">+ Thêm List</button>
        </div>
      `
          : ""
      }

      ${cardsSectionHtml}
    `;

    const addBtn = document.getElementById("addListBtn");
    const addSelect = document.getElementById("addListSelect");
    if (addBtn && addSelect) {
      addBtn.addEventListener("click", () => {
        const num = Number(addSelect.value);
        if (!num) return;
        const next = [...new Set([...studyingNums, num])];
        saveStudyingListNumbers(next);
        APP.showToast(`Đã thêm List ${num} vào danh sách Ôn tập Flashcards`);
        renderMain();
      });
    }
  }

  renderSidebar();
  renderBreadcrumb();
  renderMain();
})();
