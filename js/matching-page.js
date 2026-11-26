/* matching.html — Dedicated "Luyện tập: Tìm cặp" 4x4 Pexeso board (?list=1..23) */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const list = APP.getListByNumber(APP.getQueryParam("list", "1"));

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /* Build 4x4 rounds (8 pairs = 16 tiles each) covering every word in the List */
  function buildRounds(words) {
    const shuffledWords = shuffleArray(words);
    const numRounds = Math.max(1, Math.ceil(shuffledWords.length / 8));
    const rounds = [];

    for (let r = 0; r < numRounds; r++) {
      let chunk = shuffledWords.slice(r * 8, r * 8 + 8);
      /* Top up last round to 8 pairs so every board is a complete 4x4 grid */
      if (chunk.length < 8) {
        const used = new Set(chunk.map((w) => w.word));
        const fillers = shuffleArray(words.filter((w) => !used.has(w.word))).slice(0, 8 - chunk.length);
        chunk = chunk.concat(fillers);
      }

      const tiles = [];
      chunk.forEach((w, idx) => {
        const pairId = `r${r}-p${idx}`;
        tiles.push({
          tileId: `${pairId}-word`,
          pairId,
          type: "word",
          word: w.word,
          text: w.word
        });
        tiles.push({
          tileId: `${pairId}-meaning`,
          pairId,
          type: "meaning",
          word: w.word,
          text: w.meaning
        });
      });

      const bgWord = chunk.find((w) => w.image);
      rounds.push({
        index: r,
        bgImage: bgWord ? bgWord.image : "",
        tiles: shuffleArray(tiles),
        matchedPairIds: new Set(),
        done: false
      });
    }
    return rounds;
  }

  const rounds = buildRounds(list.words);
  let currentRoundIndex = 0;
  let selectedTileId = null;
  let wrongTileIds = new Set();
  let flashTileIds = new Set();
  let isLocked = false;
  let autoNext = true;
  let autoNextTimer = null;

  const sidebarListTitle = document.getElementById("sidebarListTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevActivityLink = document.getElementById("prevActivityLink");
  const nextActivityLink = document.getElementById("nextActivityLink");
  const mainContentMount = document.getElementById("mainContentMount");
  const completeAndNextBtn = document.getElementById("completeAndNextBtn");

  const modal = APP.createModalController(() => renderSidebar());
  APP.initSharedShell({
    onProgressReset: () => renderSidebar()
  });

  document.title = `Tìm cặp - ${list.title} - Complete TOEIC - BT TOEIC`;

  function clearTimers() {
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      autoNextTimer = null;
    }
  }

  function renderSidebar() {
    const completedSet = APP.loadCompletedSet();
    sidebarListTitle.textContent = list.title;
    sidebarListTitle.href = `flashcards.html?list=${list.number}`;

    const linkMap = {
      flashcards: `flashcards.html?list=${list.number}`,
      quiz: `quiz.html?list=${list.number}`,
      matching: `matching.html?list=${list.number}`,
      listening: `listening.html?list=${list.number}`,
      translation: `translation.html?list=${list.number}`,
      dictation: `dictation.html?list=${list.number}`
    };

    const activityItemsHtml = list.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const isActive = act.key === "matching";
        const iconHtml = isDone ? APP.ICONS.check : APP.ICONS[act.icon];

        if (linkMap[act.key]) {
          return `
            <a href="${linkMap[act.key]}" class="sidebar-activity-item${isActive ? " is-active" : ""}">
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
      <a href="flashcards.html?list=${list.number}" class="breadcrumb-link">${APP.escapeHtml(list.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">Tìm cặp</span>
    `;

    prevActivityLink.href = `quiz.html?list=${list.number}`;
    nextActivityLink.href = `listening.html?list=${list.number}`;
    nextActivityLink.textContent = "Bài sau >";
  }

  function goToRound(idx) {
    clearTimers();
    if (idx < 0 || idx >= rounds.length) return;
    currentRoundIndex = idx;
    selectedTileId = null;
    wrongTileIds.clear();
    flashTileIds.clear();
    isLocked = false;
    renderBoard();
  }

  function renderBoard() {
    const round = rounds[currentRoundIndex];
    const doneRounds = rounds.filter((r) => r.done).length;
    const matchedPairs = round.matchedPairIds.size;

    const tilesHtml = round.tiles
      .map((tile) => {
        const classes = ["pexeso-tile", tile.type === "word" ? "is-word" : "is-meaning"];
        if (round.matchedPairIds.has(tile.pairId)) classes.push("is-matched");
        if (selectedTileId === tile.tileId) classes.push("is-selected");
        if (wrongTileIds.has(tile.tileId)) classes.push("is-wrong");
        if (flashTileIds.has(tile.tileId)) classes.push("is-correct-flash");

        return `
          <button
            type="button"
            class="${classes.join(" ")}"
            data-tile-id="${tile.tileId}"
            data-pair-id="${tile.pairId}"
            data-tile-type="${tile.type}"
          >${APP.escapeHtml(tile.text)}</button>
        `;
      })
      .join("");

    const clearOverlayHtml = round.done
      ? `
        <div class="pexeso-clear-overlay">
          <h3>Hoàn thành lượt ${currentRoundIndex + 1}!</h3>
          <p>Bạn đã ghép đúng toàn bộ 8/8 cặp từ vựng.</p>
          <div style="display:flex; gap:10px; margin-top:6px;">
            <button type="button" class="btn btn-outline" id="replayRoundBtn" style="color:#fff; border-color:rgba(255,255,255,0.5);">Chơi lại lượt này</button>
            ${
              currentRoundIndex < rounds.length - 1
                ? `<button type="button" class="btn btn-success" id="overlayNextRoundBtn">Lượt tiếp theo &rarr;</button>`
                : ""
            }
          </div>
        </div>
      `
      : "";

    const numberPillsHtml = rounds
      .map((r, idx) => {
        const classes = ["problemset-problem-number"];
        if (r.done) classes.push("is-done");
        if (idx === currentRoundIndex) classes.push("is-active");
        return `<button type="button" class="${classes.join(" ")}" data-round-index="${idx}">${idx + 1}</button>`;
      })
      .join("");

    const bgStyle = round.bgImage ? `style="background-image: url('${APP.escapeHtml(round.bgImage)}');"` : "";

    mainContentMount.innerHTML = `
      <section class="pexeso-wrap" aria-label="Bảng ghép cặp từ vựng 4x4">
        <div class="pexeso-board" id="pexesoBoard">
          <div class="pexeso-bg-layer" ${bgStyle}></div>
          <div class="pexeso-grid" id="pexesoGrid">
            ${tilesHtml}
          </div>
          ${clearOverlayHtml}
        </div>
      </section>

      <section class="contentblock quiz-nav-card" aria-label="Điều hướng lượt chơi">
        <div class="problem-set-controls">
          <button type="button" class="problem-set-control-btn" id="prevRoundBtn" ${currentRoundIndex === 0 ? "disabled" : ""}>
            &lt; Câu trước
          </button>

          <label class="auto-next-toggle">
            <input type="checkbox" id="autoNextCheckbox" ${autoNext ? "checked" : ""} />
            <span class="auto-next-track" aria-hidden="true">
              <span class="auto-next-thumb"></span>
            </span>
            <span>Tự động chuyển câu</span>
          </label>

          <button type="button" class="problem-set-control-btn" id="nextRoundBtn" ${currentRoundIndex === rounds.length - 1 ? "disabled" : ""}>
            Câu sau &gt;
          </button>
        </div>

        <div class="problemset-grid-header">
          <h2 class="problemset-grid-title">Danh sách bài tập:</h2>
          <span class="problemset-grid-score">Đã ghép: <strong>${matchedPairs}/8 cặp</strong> &bull; Xong <strong>${doneRounds}/${rounds.length}</strong> lượt</span>
        </div>

        <div class="problemset-change-problem">
          ${numberPillsHtml}
        </div>
      </section>
    `;

    bindBoardEvents();
  }

  function handleTileClick(tileId) {
    if (isLocked) return;
    const round = rounds[currentRoundIndex];
    const clicked = round.tiles.find((t) => t.tileId === tileId);
    if (!clicked || round.matchedPairIds.has(clicked.pairId)) return;

    if (clicked.type === "word") {
      APP.speakText(clicked.word, "en-US");
    }

    /* Clicking the already-selected tile deselects it */
    if (selectedTileId === clicked.tileId) {
      selectedTileId = null;
      renderBoard();
      return;
    }

    /* First selection */
    if (!selectedTileId) {
      selectedTileId = clicked.tileId;
      renderBoard();
      return;
    }

    /* Second selection */
    const first = round.tiles.find((t) => t.tileId === selectedTileId);
    if (!first) {
      selectedTileId = clicked.tileId;
      renderBoard();
      return;
    }

    isLocked = true;
    if (first.pairId === clicked.pairId && first.type !== clicked.type) {
      /* Correct match */
      flashTileIds = new Set([first.tileId, clicked.tileId]);
      selectedTileId = null;
      APP.speakText(first.word, "en-US");
      renderBoard();

      setTimeout(() => {
        flashTileIds.clear();
        round.matchedPairIds.add(first.pairId);
        if (round.matchedPairIds.size >= 8) {
          round.done = true;
          if (rounds.every((r) => r.done)) {
            const set = APP.loadCompletedSet();
            set.add(`list-${list.number}:matching`);
            APP.saveCompletedSet(set);
            renderSidebar();
            APP.showToast(`Tuyệt vời! Bạn đã hoàn thành Tìm cặp ${list.title}!`);
          }
          if (autoNext && currentRoundIndex < rounds.length - 1) {
            autoNextTimer = setTimeout(() => goToRound(currentRoundIndex + 1), 1600);
          }
        }
        isLocked = false;
        renderBoard();
      }, 280);
    } else {
      /* Wrong match */
      wrongTileIds = new Set([first.tileId, clicked.tileId]);
      selectedTileId = null;
      renderBoard();

      setTimeout(() => {
        wrongTileIds.clear();
        isLocked = false;
        renderBoard();
      }, 650);
    }
  }

  function bindBoardEvents() {
    mainContentMount.querySelectorAll(".pexeso-tile").forEach((btn) => {
      btn.addEventListener("click", () => handleTileClick(btn.dataset.tileId));
    });

    const prevBtn = document.getElementById("prevRoundBtn");
    const nextBtn = document.getElementById("nextRoundBtn");
    const autoNextCheckbox = document.getElementById("autoNextCheckbox");
    const replayBtn = document.getElementById("replayRoundBtn");
    const overlayNextBtn = document.getElementById("overlayNextRoundBtn");

    if (prevBtn) prevBtn.addEventListener("click", () => goToRound(currentRoundIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goToRound(currentRoundIndex + 1));
    if (autoNextCheckbox) {
      autoNextCheckbox.addEventListener("change", (e) => {
        autoNext = e.target.checked;
        if (!autoNext) clearTimers();
      });
    }
    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        clearTimers();
        const r = rounds[currentRoundIndex];
        r.matchedPairIds.clear();
        r.done = false;
        r.tiles = shuffleArray(r.tiles);
        renderBoard();
      });
    }
    if (overlayNextBtn) {
      overlayNextBtn.addEventListener("click", () => goToRound(currentRoundIndex + 1));
    }

    mainContentMount.querySelectorAll(".problemset-problem-number").forEach((pill) => {
      pill.addEventListener("click", () => goToRound(Number(pill.dataset.roundIndex)));
    });
  }

  completeAndNextBtn.addEventListener("click", () => {
    const completedSet = APP.loadCompletedSet();
    completedSet.add(`list-${list.number}:matching`);
    APP.saveCompletedSet(completedSet);
    if (list.number < APP.VOCAB_LISTS.length) {
      window.location.href = `flashcards.html?list=${list.number + 1}`;
    } else {
      window.location.href = "index.html";
    }
  });

  renderSidebar();
  renderHeaderNav();
  renderBoard();
})();
