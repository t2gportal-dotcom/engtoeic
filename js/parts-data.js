/* Complete BT TOEIC Part 1, Part 2, and Part 3 Listening Dataset */
window.BT_TOEIC_PARTS_DATA = (function () {
  "use strict";

  const parts = {
    1: {
      num: 1,
      key: "part-1",
      title: "Part 1: Photographs - Nghe tranh",
      lessons: [
        {
          id: 1,
          title: "Tổng quan",
          activities: [{ id: "p1-l1-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }],
          slides: [
            {
              heading: "Tổng quan TOEIC Listening Part 1",
              points: [
                "Gồm <strong>6 câu hỏi</strong> mô tả tranh (4 lựa chọn A, B, C, D chỉ đọc qua audio, không in trên đề).",
                "3 nhóm tranh chính: <strong>Tranh tả người</strong>, <strong>Tranh tả vật</strong>, <strong>Tranh tả cả người và vật</strong>.",
                "<strong>Chiến lược 3 bước:</strong> Quan sát nhanh chủ thể & hành động → Lắng nghe thì Hiện tại tiếp diễn / Bị động → Loại trừ bẫy từ đồng âm."
              ]
            }
          ],
          theoryHtml: `
            <h2>Tổng quan Part 1: Photographs - Nghe tranh</h2>
            <p>Part 1 kiểm tra khả năng nhận diện hành động, trạng thái và vị trí của người hoặc vật trong bức ảnh.</p>
            <ul>
              <li><strong>Tranh tả người:</strong> Chú ý cấu trúc <code>S + is/are + V-ing</code> (hành động đang diễn ra) và <code>wearing / holding / looking at</code>.</li>
              <li><strong>Tranh tả vật:</strong> Chú ý cấu trúc bị động trạng thái <code>is/are + V3/ed</code> (VD: <em>Chairs are arranged around a table</em>).</li>
            </ul>
            <div class="lecture-callout"><strong>Cạm bẫy kinh điển:</strong> Bẫy <em>being + V3</em> trong tranh KHÔNG có người (luôn sai nếu không thấy ai đang thực hiện hành động!).</div>
          `
        },
        {
          id: 2,
          title: "Tranh tả người",
          activities: [
            { id: "p1-l2-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" },
            { id: "p1-l2-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }
          ],
          theoryHtml: `
            <h2>Chiến lược làm bài: Tranh tả người</h2>
            <ul>
              <li>Quan sát ánh mắt, tay cầm vật gì, trang phục và tư thế (<em>standing, seated, leaning, reaching for, pouring, typing</em>).</li>
              <li>Nghe kỹ động từ chính ngay sau <em>is / are</em> để loại trừ đáp án sai hành động.</li>
            </ul>
          `
        },
        {
          id: 3,
          title: "Tranh tả vật",
          activities: [
            { id: "p1-l3-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" },
            { id: "p1-l3-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }
          ],
          theoryHtml: `
            <h2>Chiến lược làm bài: Tranh tả vật</h2>
            <ul>
              <li>Xác định vị trí đồ vật bằng giới từ: <em>on, under, next to, stacked on, lined up along, hanging on</em>.</li>
              <li>Loại ngay các câu có <code>is/are being + V3</code> vì không có người tác động trong ảnh.</li>
            </ul>
          `
        },
        {
          id: 4,
          title: "Tranh tả cả người và vật",
          activities: [
            { id: "p1-l4-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" },
            { id: "p1-l4-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }
          ],
          theoryHtml: `
            <h2>Chiến lược làm bài: Tranh tả cả người và vật</h2>
            <p>Đáp án đúng có thể mô tả hành động của người HOẶC vị trí của vật ở hậu cảnh — đừng chỉ tập trung vào nhân vật chính!</p>
          `
        },
        {
          id: 5,
          title: "PRACTICE ZONE",
          activities: [
            { id: "p1-l5-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }
          ],
          theoryHtml: `<h2>Practice Zone — Part 1</h2><p>Luyện tập tổng hợp các dạng tranh Part 1 chuẩn format đề thi TOEIC.</p>`
        }
      ],
      practiceQuestions: [
        {
          num: 1,
          image: "assets/images/02_Accounting_52ef9f83.webp",
          caption: "Mô tả: Nhân viên kế toán đang làm việc với máy tính và tài liệu tại bàn làm việc.",
          statements: [
            "A. A woman is reviewing documents at a desk.",
            "B. A woman is painting a picture on the wall.",
            "C. A woman is carrying boxes up the stairs.",
            "D. A woman is locking the front entrance."
          ],
          answer: 0,
          explain: "Đáp án A đúng: 'reviewing documents at a desk' (đang xem xét tài liệu tại bàn làm việc) khớp với nội dung tranh."
        },
        {
          num: 2,
          image: "assets/images/11_accuracy1_6cffefbe.webp",
          caption: "Mô tả: Biểu tượng bảng mục tiêu với mũi tên cắm chính giữa tâm.",
          statements: [
            "A. People are gathering in a stadium.",
            "B. An arrow is positioned in the center of a target.",
            "C. Some equipment is being packed into a truck.",
            "D. Several chairs are stacked near a window."
          ],
          answer: 1,
          explain: "Đáp án B đúng: Tranh tả vật, không có người → loại ngay A và C ('being packed')."
        },
        {
          num: 3,
          image: "assets/images/02_Accounting_52ef9f83.webp",
          caption: "Mô tả: Không gian văn phòng với laptop và giấy tờ đặt trên mặt bàn.",
          statements: [
            "A. The office is completely empty of furniture.",
            "B. A laptop has been placed on the table.",
            "C. Workers are sweeping the hallway floor.",
            "D. A vehicle is parked in front of a store."
          ],
          answer: 1,
          explain: "Đáp án B đúng: Cấu trúc bị động trạng thái 'has been placed on the table' mô tả chính xác vị trí laptop."
        }
      ]
    },

    2: {
      num: 2,
      key: "part-2",
      title: "Part 2: Question - Response - Hỏi - đáp",
      lessons: [
        { id: 1, title: "Tổng quan", activities: [{ id: "p2-l1-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }] },
        { id: 2, title: "Câu hỏi WHO", activities: [{ id: "p2-l2-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l2-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 3, title: "Câu hỏi WHAT", activities: [{ id: "p2-l3-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l3-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 4, title: "Câu hỏi WHERE", activities: [{ id: "p2-l4-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l4-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 5, title: "Câu hỏi WHEN", activities: [{ id: "p2-l5-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l5-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 6, title: "Câu hỏi WHY", activities: [{ id: "p2-l6-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l6-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 7, title: "Câu hỏi HOW", activities: [{ id: "p2-l7-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l7-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 8, title: "Câu hỏi YES/NO", activities: [{ id: "p2-l8-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l8-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 9, title: "Câu hỏi lựa chọn", activities: [{ id: "p2-l9-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l9-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 10, title: "Câu hỏi đuôi", activities: [{ id: "p2-l10-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l10-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 11, title: "Câu đề nghị, yêu cầu", activities: [{ id: "p2-l11-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l11-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 12, title: "Câu trần thuật", activities: [{ id: "p2-l12-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p2-l12-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 13, title: "PRACTICE ZONE", activities: [{ id: "p2-l13-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC (Luyện tập)", type: "practice" }] }
      ],
      defaultTheoryHtml: `
        <h2>Chiến lược Part 2: Question - Response (Hỏi - Đáp)</h2>
        <ul>
          <li><strong>Bắt từ để hỏi ở 2 giây đầu:</strong> <em>Who</em> (người/phòng ban), <em>Where</em> (địa điểm), <em>When</em> (thời gian), <em>Why</em> (lý do: Because / To-V), <em>How</em> (cách thức/số lượng).</li>
          <li><strong>Quy tắc loại bẫy:</strong> Câu hỏi WH- KHÔNG trả lời bằng <em>Yes / No</em>. Cảnh giác đáp án lặp lại y hệt từ vựng trong câu hỏi.</li>
          <li><strong>Đáp án gián tiếp (hay ra thi):</strong> <em>"I'm not sure"</em>, <em>"Ask Ms. Lee"</em>, <em>"It hasn't been decided yet"</em>.</li>
        </ul>
      `,
      practiceQuestions: [
        {
          num: 1,
          question: "Who is in charge of organizing the annual client banquet?",
          responses: [
            "A. Yes, it was very well organized.",
            "B. Ms. Patel from the marketing department.",
            "C. At the Grand Horizon Hotel."
          ],
          answer: 1,
          explain: "Câu hỏi 'Who' hỏi về người phụ trách → chọn B ('Ms. Patel from the marketing department'). Loại A vì có 'Yes', loại C vì chỉ địa điểm."
        },
        {
          num: 2,
          question: "Where should I store the extra boxes of printer paper?",
          responses: [
            "A. In the supply closet down the hall.",
            "B. About twenty pages.",
            "C. Because the printer is out of ink."
          ],
          answer: 0,
          explain: "Câu hỏi 'Where' hỏi địa điểm → chọn A ('In the supply closet down the hall')."
        },
        {
          num: 3,
          question: "When will the revised budget report be ready for review?",
          responses: [
            "A. No, I haven't read it yet.",
            "B. By three o'clock this afternoon.",
            "C. Mr. Chen revised the figures."
          ],
          answer: 1,
          explain: "Câu hỏi 'When' hỏi thời điểm → chọn B ('By three o'clock this afternoon')."
        },
        {
          num: 4,
          question: "Would you like to take the morning train or fly to Chicago?",
          responses: [
            "A. Yes, I'd love to.",
            "B. Taking the train sounds more relaxing.",
            "C. The flight was delayed yesterday."
          ],
          answer: 1,
          explain: "Câu hỏi lựa chọn 'A or B' không trả lời bằng Yes/No → chọn B ('Taking the train sounds more relaxing')."
        }
      ]
    },

    3: {
      num: 3,
      key: "part-3",
      title: "Part 3: Conversations - Nghe hiểu đối thoại",
      lessons: [
        { id: 1, title: "Tổng quan", activities: [{ id: "p3-l1-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }] },
        { id: 2, title: "Câu hỏi về chủ đề, mục đích", activities: [{ id: "p3-l2-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p3-l2-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 3, title: "Câu hỏi về địa điểm hội thoại", activities: [{ id: "p3-l3-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p3-l3-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 4, title: "Câu hỏi về danh tính người nói", activities: [{ id: "p3-l4-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p3-l4-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 5, title: "Câu hỏi về chi tiết cuộc hội thoại", activities: [{ id: "p3-l5-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p3-l5-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 6, title: "Câu hỏi về hành động tương lai", activities: [{ id: "p3-l6-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p3-l6-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 7, title: "Câu hỏi về yêu cầu, gợi ý", activities: [{ id: "p3-l7-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p3-l7-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 8, title: "Câu hỏi về hàm ý câu nói", activities: [{ id: "p3-l8-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p3-l8-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 9, title: "Câu hỏi kết hợp bảng biểu", activities: [{ id: "p3-l9-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p3-l9-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        {
          id: 10,
          title: "Chủ đề các cuộc đối thoại",
          activities: [
            { id: "p3-l10-a1", prefix: "Lý thuyết:", title: "Company - General Office Work", type: "reading" },
            { id: "p3-l10-a2", prefix: "Lý thuyết:", title: "Company - Personnel", type: "reading" },
            { id: "p3-l10-a3", prefix: "Lý thuyết:", title: "Company - Business, Marketing", type: "reading" },
            { id: "p3-l10-a4", prefix: "Lý thuyết:", title: "Company - Event, Project", type: "reading" },
            { id: "p3-l10-a5", prefix: "Lý thuyết:", title: "Company - Facility", type: "reading" },
            { id: "p3-l10-a6", prefix: "Lý thuyết:", title: "Shopping, Service", type: "reading" },
            { id: "p3-l10-a7", prefix: "Lý thuyết:", title: "Order, Delivery", type: "reading" },
            { id: "p3-l10-a8", prefix: "Lý thuyết:", title: "Housing", type: "reading" },
            { id: "p3-l10-a9", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }
          ]
        },
        { id: 11, title: "PRACTICE ZONE", activities: [{ id: "p3-l11-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] }
      ],
      defaultTheoryHtml: `
        <h2>Chiến lược Part 3: Conversations (Nghe hiểu đối thoại)</h2>
        <ul>
          <li><strong>Đọc trước 3 câu hỏi</strong> trong lúc audio đọc hướng dẫn để xác định từ khóa (hỏi Man hay Woman, hỏi mục đích, chi tiết hay hành động tiếp theo).</li>
          <li><strong>Thứ tự thông tin</strong> trong hội thoại thường đi tuần tự từ Câu 1 → Câu 2 → Câu 3.</li>
          <li><strong>Chú ý Paraphrasing:</strong> Đáp án đúng thường diễn đạt lại bằng từ đồng nghĩa (VD: <em>"out of stock" → "unavailable"</em>).</li>
        </ul>
      `,
      practiceSets: [
        {
          num: 1,
          dialogue: [
            { speaker: "Woman", text: "Hi David, did you hear that the downtown convention center is undergoing roof repairs next week?" },
            { speaker: "Man", text: "Really? That's where we planned to host our product launch on Thursday. We'll need to find another venue right away." },
            { speaker: "Woman", text: "I already called the Riverside Hotel. Their main ballroom is available, and they can provide catering too." },
            { speaker: "Man", text: "That's a huge relief. I'll email the updated invitations to all registered guests this afternoon." }
          ],
          questions: [
            {
              num: 32,
              text: "What problem do the speakers mention?",
              options: ["A. A shipment of products was delayed.", "B. A scheduled venue is being repaired.", "C. A catering company canceled an order.", "D. Several guests did not receive invitations."],
              answer: 1,
              explain: "Người phụ nữ nói: 'the downtown convention center is undergoing roof repairs next week' → địa điểm tổ chức đang sửa chữa → chọn B."
            },
            {
              num: 33,
              text: "What has the woman already done?",
              options: ["A. Contacted an alternative hotel", "B. Printed new promotional brochures", "C. Postponed the launch until next month", "D. Reserved a shuttle bus for guests"],
              answer: 0,
              explain: "Cô ấy nói: 'I already called the Riverside Hotel' → đã liên hệ khách sạn thay thế → chọn A."
            },
            {
              num: 34,
              text: "What will the man do this afternoon?",
              options: ["A. Visit the Riverside Hotel", "B. Approve the catering menu", "C. Send updated invitations by email", "D. Call the convention center manager"],
              answer: 2,
              explain: "Người đàn ông nói: 'I'll email the updated invitations to all registered guests this afternoon' → chọn C."
            }
          ]
        },
        {
          num: 2,
          dialogue: [
            { speaker: "Man", text: "Good morning, I ordered a standing desk from your website last Monday, but the package still hasn't arrived." },
            { speaker: "Woman", text: "I'm sorry about the delay. Could you give me your order number so I can check our tracking system?" },
            { speaker: "Man", text: "Sure, it's 4-8-2-9-B. I really need it before my home office renovation finishes on Friday." },
            { speaker: "Woman", text: "I see it's currently at our regional warehouse. I'll upgrade your shipment to express delivery at no extra charge so it reaches you tomorrow." }
          ],
          questions: [
            {
              num: 35,
              text: "Why is the man calling?",
              options: ["A. To cancel a furniture order", "B. To inquire about a late delivery", "C. To schedule a home renovation", "D. To request a damaged-item refund"],
              answer: 1,
              explain: "Anh ấy nói đã đặt bàn từ thứ Hai tuần trước nhưng kiện hàng vẫn chưa tới → hỏi về đơn giao hàng trễ → chọn B."
            },
            {
              num: 36,
              text: "What does the woman ask the man for?",
              options: ["A. His billing address", "B. A receipt number", "C. His order number", "D. A phone number"],
              answer: 2,
              explain: "Cô ấy hỏi: 'Could you give me your order number...' → chọn C."
            },
            {
              num: 37,
              text: "What does the woman offer to do?",
              options: ["A. Provide free express shipping", "B. Send a replacement desk", "C. Offer a 20% discount coupon", "D. Assemble the desk on Friday"],
              answer: 0,
              explain: "Cô ấy nói: 'I'll upgrade your shipment to express delivery at no extra charge' → giao nhanh miễn phí → chọn A."
            }
          ]
        }
      ]
    }
  };

  /* Compute totals */
  Object.values(parts).forEach((p) => {
    p.totalActivities = p.lessons.reduce((sum, l) => sum + l.activities.length, 0);
  });

  return {
    parts,
    getPart(num) {
      const n = parseInt(num, 10);
      return parts[n] || parts[1];
    },
    getLesson(partObj, lessonId) {
      const id = parseInt(lessonId, 10) || 1;
      return partObj.lessons.find((l) => l.id === id) || partObj.lessons[0];
    }
  };
})();
