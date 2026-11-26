/* grammar-lesson.html — Dedicated "Video bài giảng: Lý thuyết" page */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const GRAMMAR = window.BT_TOEIC_GRAMMAR_DATA;

  const topic = GRAMMAR.getTopicById(APP.getQueryParam("topic", "1"));
  const actId = APP.getQueryParam("act", topic.activities[0].id);
  const currentActIndex = Math.max(0, topic.activities.findIndex((a) => a.id === actId));
  const currentAct = topic.activities[currentActIndex] || topic.activities[0];

  const slides =
    topic.slides && topic.slides.length > 0
      ? topic.slides
      : [
          {
            heading: topic.title,
            points: [
              "Nắm vững quy tắc cốt lõi và vị trí từ loại trong câu TOEIC Part 5 & Part 6.",
              "Xem phần <strong>Lý thuyết chi tiết</strong> ngay bên dưới và làm các bài <strong>Trắc nghiệm format TOEIC</strong> để ghi nhớ."
            ]
          }
        ];

  let slideIndex = 0;
  let showSlidesList = false;

  const sidebarTopicTitle = document.getElementById("sidebarTopicTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevActivityLink = document.getElementById("prevActivityLink");
  const nextActivityLink = document.getElementById("nextActivityLink");
  const lectureStageMount = document.getElementById("lectureStageMount");
  const mainContentMount = document.getElementById("mainContentMount");
  const completeAndNextBtn = document.getElementById("completeAndNextBtn");

  APP.initSharedShell({
    onProgressReset: () => {
      APP.saveGrammarCompletedSet(new Set());
      renderSidebar();
    }
  });

  document.title = `${topic.title} - ${currentAct.title} - BT TOEIC`;

  function getActHref(t, act) {
    return act.isVideo
      ? `grammar-lesson.html?topic=${t.id}&act=${encodeURIComponent(act.id)}`
      : `grammar-practice.html?topic=${t.id}&act=${encodeURIComponent(act.id)}`;
  }

  function getNextTargetHref() {
    if (currentActIndex < topic.activities.length - 1) {
      return getActHref(topic, topic.activities[currentActIndex + 1]);
    }
    const nextTopic = GRAMMAR.topics.find((t) => t.id === topic.id + 1);
    if (nextTopic && nextTopic.activities.length > 0) {
      return getActHref(nextTopic, nextTopic.activities[0]);
    }
    return "grammar.html";
  }

  function getPrevTargetHref() {
    if (currentActIndex > 0) {
      return getActHref(topic, topic.activities[currentActIndex - 1]);
    }
    const prevTopic = GRAMMAR.topics.find((t) => t.id === topic.id - 1);
    if (prevTopic && prevTopic.activities.length > 0) {
      return getActHref(prevTopic, prevTopic.activities[prevTopic.activities.length - 1]);
    }
    return null;
  }

  function renderSidebar() {
    const completedSet = APP.loadGrammarCompletedSet();
    sidebarTopicTitle.textContent = topic.title;
    sidebarTopicTitle.href = getActHref(topic, topic.activities[0]);

    const itemsHtml = topic.activities
      .map((act) => {
        const isDone = completedSet.has(act.id);
        const isActive = act.id === currentAct.id;
        const iconHtml = isDone ? APP.ICONS.check : act.isVideo ? APP.ICONS.play : APP.ICONS.pencil;
        return `
          <a href="${getActHref(topic, act)}" class="sidebar-activity-item${isActive ? " is-active" : ""}">
            <span class="learncourse-activity-icon${isDone ? " completed" : ""}" aria-hidden="true">${iconHtml}</span>
            <span><strong>${APP.escapeHtml(act.prefix)}</strong> ${APP.escapeHtml(act.title)}</span>
          </a>
        `;
      })
      .join("");

    const nextTopic = GRAMMAR.topics.find((t) => t.id === topic.id + 1);
    const nextHtml = nextTopic
      ? `
        <div class="sidebar-next-lesson">
          <div class="sidebar-next-label">Bài học tiếp theo:</div>
          <a href="${getActHref(nextTopic, nextTopic.activities[0])}" class="sidebar-next-link">${APP.escapeHtml(nextTopic.title)}</a>
        </div>
      `
      : "";

    lessonSidebarList.innerHTML = `
      ${itemsHtml}
      <a href="grammar.html" class="sidebar-back-unit-btn">&larr; Quay lại chương học</a>
      ${nextHtml}
    `;
  }

  function renderHeaderNav() {
    breadcrumbNav.innerHTML = `
      <a href="index.html" class="breadcrumb-link">${APP.escapeHtml(APP.DATA.course.title)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <a href="grammar.html" class="breadcrumb-link">Ngữ pháp TOEIC</a>
      <span class="breadcrumb-sep" aria-hidden="true">${APP.ICONS.caretRight}</span>
      <span class="breadcrumb-current">${APP.escapeHtml(topic.title)}</span>
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

  function renderLecture() {
    const videoId = (window.BT_TOEIC_VIDEO_EMBEDS || {})[currentAct.id] || "";
    const slide = slides[slideIndex];
    const progressPct = Math.round(((slideIndex + 1) / slides.length) * 100);

    if (videoId) {
      APP.renderProtectedVideoStage(lectureStageMount, {
        videoId,
        title: `${topic.title} - ${currentAct.title}`,
        label: topic.title
      });
    } else {
      lectureStageMount.innerHTML = `
        <div class="lecture-video-stage">
          <div class="lecture-video-frame">
            <div class="lecture-slide-canvas">
              <div>
                <div class="lecture-slide-topbar">
                  <span>CompleteTOEIC</span>
                  <span>Ngữ pháp: ${APP.escapeHtml(topic.title)}</span>
                  <span>BT TOEIC</span>
                </div>
                <h2 class="lecture-slide-title">${APP.escapeHtml(slide.heading)}</h2>
                <ul class="lecture-slide-points">
                  ${slide.points.map((pt) => `<li>${pt}</li>`).join("")}
                </ul>
              </div>
              <div style="font-size: 12px; color: #94a3b8; text-align: right; margin-top: 16px;">
                Slide ${slideIndex + 1} / ${slides.length}
              </div>
            </div>

            <div class="lecture-video-controls">
              <button type="button" class="plyr-play-btn" id="slidePrevBtn" title="Slide trước" style="width:30px; height:30px;">&lt;</button>
              <div class="plyr-progress-wrap">
                <div class="plyr-progress-fill" style="width: ${progressPct}%;"></div>
              </div>
              <button type="button" class="plyr-play-btn" id="slideNextBtn" title="Slide tiếp theo" style="width:30px; height:30px;">&gt;</button>
            </div>
          </div>
        </div>
      `;
    }

    mainContentMount.innerHTML = `
      <div class="content-header" style="padding-bottom: 6px;">
        <h1 class="learncourse-heading-xl">${APP.escapeHtml(currentAct.title)}</h1>
      </div>

      <button type="button" class="lecture-slides-toggle" id="toggleSlidesBtn">
        <span>${showSlidesList ? "Ẩn slides bài giảng ▲" : "Hiển thị slides bài giảng ▼"}</span>
      </button>

      ${
        showSlidesList
          ? `
        <div class="contentblock" style="margin-bottom: 16px;">
          ${slides
            .map(
              (s, i) => `
            <div style="margin-bottom: 12px;">
              <div style="font-weight: 600; margin-bottom: 4px;">Slide ${i + 1}: ${APP.escapeHtml(s.heading)}</div>
              <ul style="margin:0; padding-left: 20px; font-size: 14px;">${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <article class="contentblock lecture-article">
        ${topic.theoryHtml}
      </article>
    `;

    const prevSlideBtn = document.getElementById("slidePrevBtn");
    const nextSlideBtn = document.getElementById("slideNextBtn");
    if (prevSlideBtn) {
      prevSlideBtn.addEventListener("click", () => {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        renderLecture();
      });
    }
    if (nextSlideBtn) {
      nextSlideBtn.addEventListener("click", () => {
        slideIndex = (slideIndex + 1) % slides.length;
        renderLecture();
      });
    }
    document.getElementById("toggleSlidesBtn").addEventListener("click", () => {
      showSlidesList = !showSlidesList;
      renderLecture();
    });
  }

  completeAndNextBtn.addEventListener("click", () => {
    const set = APP.loadGrammarCompletedSet();
    set.add(currentAct.id);
    APP.saveGrammarCompletedSet(set);
    window.location.href = getNextTargetHref();
  });

  renderSidebar();
  renderHeaderNav();
  renderLecture();
})();
