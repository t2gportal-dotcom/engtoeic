/* part-lesson.html — Video Lecture & Theory Reading page for Part 1, Part 2, Part 3 */
(function () {
  "use strict";

  const APP = window.BT_TOEIC_APP;
  const PARTS = window.BT_TOEIC_PARTS_DATA;
  const part = PARTS.getPart(APP.getQueryParam("part", "1"));
  const lesson = PARTS.getLesson(part, APP.getQueryParam("lesson", "1"));
  const actId = APP.getQueryParam("act", lesson.activities[0].id);
  const currentActIndex = Math.max(0, lesson.activities.findIndex((a) => a.id === actId));
  const currentAct = lesson.activities[currentActIndex] || lesson.activities[0];

  const slides =
    lesson.slides && lesson.slides.length > 0
      ? lesson.slides
      : [
          {
            heading: `${part.title} — ${lesson.title}`,
            points: [
              `Chủ điểm: <strong>${APP.escapeHtml(currentAct.title)}</strong>`,
              "Nghe kỹ từ khóa trọng tâm, phân tích bẫy thường gặp và luyện tập ngay với bài <strong>Trắc nghiệm format TOEIC</strong>."
            ]
          }
        ];

  let slideIndex = 0;

  const sidebarLessonTitle = document.getElementById("sidebarLessonTitle");
  const lessonSidebarList = document.getElementById("lessonSidebarList");
  const breadcrumbNav = document.getElementById("breadcrumbNav");
  const prevActivityLink = document.getElementById("prevActivityLink");
  const nextActivityLink = document.getElementById("nextActivityLink");
  const lectureStageMount = document.getElementById("lectureStageMount");
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

  function renderContent() {
    const videoId = (window.BT_TOEIC_VIDEO_EMBEDS || {})[currentAct.id] || "";
    const slide = slides[slideIndex];
    const progressPct = Math.round(((slideIndex + 1) / slides.length) * 100);

    if (currentAct.type === "video" && videoId) {
      APP.renderProtectedVideoStage(lectureStageMount, {
        videoId,
        title: `${part.title} - ${lesson.title}`,
        label: `${part.title} — ${lesson.title}`
      });
    } else if (currentAct.type === "video") {
      lectureStageMount.innerHTML = `
        <div class="lecture-video-stage">
          <div class="lecture-video-frame">
            <div class="lecture-slide-canvas">
              <div>
                <div class="lecture-slide-topbar">
                  <span>CompleteTOEIC</span>
                  <span>${APP.escapeHtml(part.title)}</span>
                  <span>BT TOEIC</span>
                </div>
                <h2 class="lecture-slide-title">${APP.escapeHtml(slide.heading)}</h2>
                <ul class="lecture-slide-points">
                  ${slide.points.map((p) => `<li>${p}</li>`).join("")}
                </ul>
              </div>
              <div style="font-size: 12px; color: #94a3b8; text-align: right; margin-top: 16px;">
                Slide ${slideIndex + 1} / ${slides.length}
              </div>
            </div>
            <div class="lecture-video-controls">
              <button type="button" class="plyr-play-btn" id="slidePrevBtn" style="width:30px; height:30px;">&lt;</button>
              <div class="plyr-progress-wrap"><div class="plyr-progress-fill" style="width: ${progressPct}%;"></div></div>
              <button type="button" class="plyr-play-btn" id="slideNextBtn" style="width:30px; height:30px;">&gt;</button>
            </div>
          </div>
        </div>
      `;
      document.getElementById("slidePrevBtn").addEventListener("click", () => {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        renderContent();
      });
      document.getElementById("slideNextBtn").addEventListener("click", () => {
        slideIndex = (slideIndex + 1) % slides.length;
        renderContent();
      });
    } else {
      lectureStageMount.innerHTML = "";
    }

    const bodyHtml = lesson.theoryHtml || part.defaultTheoryHtml || `<h2>${APP.escapeHtml(lesson.title)}</h2>`;
    mainContentMount.innerHTML = `
      <div class="content-header" style="padding-bottom: 10px;">
        <h1 class="learncourse-heading-xl">${APP.escapeHtml(currentAct.title)}</h1>
      </div>
      <article class="contentblock lecture-article">
        ${bodyHtml}
      </article>
    `;
  }

  completeAndNextBtn.addEventListener("click", () => {
    const set = APP.loadPartCompletedSet(part.key);
    set.add(currentAct.id);
    APP.savePartCompletedSet(part.key, set);
    window.location.href = getNextTargetHref();
  });

  renderSidebar();
  renderHeaderNav();
  renderContent();
})();
