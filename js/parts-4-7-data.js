/* Complete BT TOEIC Part 4, Part 5, Part 6, and Part 7 Dataset */
(function () {
  "use strict";

  const PARTS = window.BT_TOEIC_PARTS_DATA;
  if (!PARTS) return;

  const extraParts = {
    4: {
      num: 4,
      key: "part-4",
      title: "Part 4: Talks - Nghe hiểu bài nói",
      lessons: [
        { id: 1, title: "Tổng quan", activities: [{ id: "p4-l1-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }] },
        { id: 2, title: "Câu hỏi về chủ đề, mục đích", activities: [{ id: "p4-l2-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p4-l2-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 3, title: "Câu hỏi về danh tính, địa điểm", activities: [{ id: "p4-l3-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p4-l3-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 4, title: "Câu hỏi về chi tiết", activities: [{ id: "p4-l4-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p4-l4-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 5, title: "Câu hỏi yêu cầu, gợi ý", activities: [{ id: "p4-l5-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p4-l5-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 6, title: "Câu hỏi về hành động tương lai", activities: [{ id: "p4-l6-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p4-l6-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 7, title: "Câu hỏi về hàm ý câu nói", activities: [{ id: "p4-l7-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p4-l7-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 8, title: "Câu hỏi kết hợp bảng biểu", activities: [{ id: "p4-l8-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p4-l8-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 9, title: "Dạng bài Telephone message - Tin nhắn thoại", activities: [{ id: "p4-l9-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p4-l9-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 10, title: "Dạng bài Advertisement - Quảng cáo", activities: [{ id: "p4-l10-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p4-l10-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 11, title: "Dạng bài Announcement - Thông báo", activities: [{ id: "p4-l11-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p4-l11-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 12, title: "Dạng bài Talk - Bài phát biểu, diễn văn", activities: [{ id: "p4-l12-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p4-l12-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 13, title: "Dạng bài News report, Broadcast - Bản tin", activities: [{ id: "p4-l13-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p4-l13-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 14, title: "Dạng bài Excerpt from a meeting - Trích dẫn từ buổi họp", activities: [{ id: "p4-l14-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p4-l14-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 15, title: "PRACTICE ZONE", activities: [{ id: "p4-l15-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] }
      ],
      defaultTheoryHtml: `
        <h2>Chiến lược Part 4: Talks (Nghe hiểu bài nói ngắn)</h2>
        <ul>
          <li>Part 4 gồm <strong>10 bài độc thoại</strong> (30 câu hỏi, mỗi bài 3 câu): Tin nhắn thoại, Thông báo, Quảng cáo, Bản tin, Bài phát biểu, Trích đoạn cuộc họp.</li>
          <li><strong>Câu 1</strong> thường nằm ở 2 câu đầu (chủ đề / người nói / địa điểm). <strong>Câu 3</strong> thường nằm ở 2 câu cuối (hành động tiếp theo / yêu cầu người nghe).</li>
        </ul>
      `,
      practiceSets: [
        {
          num: 1,
          talkText:
            "Attention all passengers waiting for Flight 402 to Singapore. Due to a brief maintenance inspection on the aircraft, boarding has been delayed by thirty minutes and will now begin at 3:15 P.M. at Gate B12 instead of Gate B8. As a token of our apology, complimentary beverage vouchers are available at the service desk next to Gate B12. Please have your boarding pass and passport ready when boarding begins.",
          questions: [
            {
              num: 71,
              text: "Where is this announcement most likely being made?",
              options: ["A. At a train station", "B. At an airport", "C. On a cruise ship", "D. At a hotel lobby"],
              answer: 1,
              explain: "Các từ khóa 'Flight 402', 'aircraft', 'Gate B12', 'boarding pass' → thông báo tại sân bay → chọn B."
            },
            {
              num: 72,
              text: "Why has the departure been delayed?",
              options: ["A. Severe weather conditions", "B. A late flight crew", "C. A maintenance inspection", "D. Heavy passenger traffic"],
              answer: 2,
              explain: "Bài nói nêu rõ: 'Due to a brief maintenance inspection on the aircraft' → kiểm tra bảo dưỡng → chọn C."
            },
            {
              num: 73,
              text: "What are passengers offered at the service desk?",
              options: ["A. Free seat upgrades", "B. Complimentary drink vouchers", "C. Priority luggage tags", "D. Overnight hotel rooms"],
              answer: 1,
              explain: "'complimentary beverage vouchers are available at the service desk' → phiếu đồ uống miễn phí → chọn B."
            }
          ]
        },
        {
          num: 2,
          talkText:
            "Hi Ms. Carter, this is Alex from GreenLeaf Dental Clinic calling to confirm your routine cleaning appointment scheduled for tomorrow, Tuesday, at 10:30 A.M. Because we recently updated our patient intake forms, please arrive ten minutes early to verify your insurance details. If you need to reschedule, kindly call our front desk before 5:00 P.M. today at 555-0194.",
          questions: [
            {
              num: 74,
              text: "What is the purpose of the telephone message?",
              options: ["A. To confirm an appointment", "B. To advertise a dental product", "C. To cancel a clinic visit", "D. To collect an unpaid bill"],
              answer: 0,
              explain: "Người gọi nói: 'calling to confirm your routine cleaning appointment' → xác nhận lịch hẹn → chọn A."
            },
            {
              num: 75,
              text: "Why is Ms. Carter asked to arrive ten minutes early?",
              options: ["A. Parking is limited", "B. To verify insurance information", "C. The doctor is leaving early", "D. To take an X-ray scan"],
              answer: 1,
              explain: "'please arrive ten minutes early to verify your insurance details' → xác nhận thông tin bảo hiểm → chọn B."
            },
            {
              num: 76,
              text: "What should Ms. Carter do if she needs to change the appointment?",
              options: ["A. Send an email tonight", "B. Visit the clinic website", "C. Call the front desk before 5:00 P.M.", "D. Reply to a text message"],
              answer: 2,
              explain: "'kindly call our front desk before 5:00 P.M. today' → gọi quầy lễ tân trước 5 giờ chiều → chọn C."
            }
          ]
        }
      ]
    },

    5: {
      num: 5,
      key: "part-5",
      title: "Part 5: Incomplete Sentences - Điền từ vào câu",
      lessons: [
        { id: 1, title: "Tổng quan", activities: [{ id: "p5-l1-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }] },
        { id: 2, title: "Câu hỏi từ loại", activities: [{ id: "p5-l2-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p5-l2-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 3, title: "Câu hỏi ngữ pháp", activities: [{ id: "p5-l3-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p5-l3-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 4, title: "Câu hỏi từ vựng", activities: [{ id: "p5-l4-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p5-l4-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 5, title: "[Câu hỏi từ vựng] Danh từ", activities: [{ id: "p5-l5-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 6, title: "[Câu hỏi từ vựng] Động từ", activities: [{ id: "p5-l6-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 7, title: "[Câu hỏi từ vựng] Tính từ", activities: [{ id: "p5-l7-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 8, title: "[Câu hỏi từ vựng] Trạng từ", activities: [{ id: "p5-l8-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 9, title: "[Câu hỏi từ loại] Danh từ", activities: [{ id: "p5-l9-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 10, title: "[Câu hỏi từ loại] Tính từ", activities: [{ id: "p5-l10-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 11, title: "[Câu hỏi từ loại] Trạng từ", activities: [{ id: "p5-l11-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 12, title: "[Câu hỏi từ loại] Động từ", activities: [{ id: "p5-l12-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 13, title: "[Câu hỏi ngữ pháp] Đại từ", activities: [{ id: "p5-l13-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 14, title: "[Câu hỏi ngữ pháp] Thì của động từ", activities: [{ id: "p5-l14-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 15, title: "[Câu hỏi ngữ pháp] Thể của động từ (chủ động vs bị động)", activities: [{ id: "p5-l15-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 16, title: "[Câu hỏi ngữ pháp] Cấu trúc phân từ", activities: [{ id: "p5-l16-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 17, title: "[Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu có 'to' (to V)", activities: [{ id: "p5-l17-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 18, title: "[Câu hỏi ngữ pháp] Dạng của động từ - Danh động từ (Ving)", activities: [{ id: "p5-l18-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 19, title: "[Câu hỏi ngữ pháp] Dạng của động từ - Động từ nguyên mẫu (V inf)", activities: [{ id: "p5-l19-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 20, title: "[Câu hỏi ngữ pháp] Liên từ", activities: [{ id: "p5-l20-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 21, title: "[Câu hỏi ngữ pháp] Giới từ", activities: [{ id: "p5-l21-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 22, title: "[Câu hỏi ngữ pháp] Câu cầu khiến", activities: [{ id: "p5-l22-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 23, title: "[Câu hỏi ngữ pháp] Mệnh đề quan hệ", activities: [{ id: "p5-l23-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 24, title: "[Câu hỏi ngữ pháp] Cấu trúc so sánh", activities: [{ id: "p5-l24-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 25, title: "PRACTICE ZONE", activities: [{ id: "p5-l25-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] }
      ],
      defaultTheoryHtml: `
        <h2>Chiến lược Part 5: Incomplete Sentences (30 câu)</h2>
        <ul>
          <li><strong>Phân bổ thời gian chuẩn:</strong> Hoàn thành 30 câu trong <strong>10–12 phút</strong> (trung bình 20–25 giây/câu) để dành thời gian cho Part 7.</li>
          <li><strong>Nhìn 4 đáp án trước:</strong> Nếu 4 đáp án cùng gốc từ → câu hỏi <strong>Từ loại / Ngữ pháp</strong> (giải nhanh không cần dịch hết câu); nếu 4 từ khác hẳn nhau → câu hỏi <strong>Từ vựng</strong>.</li>
        </ul>
      `,
      practiceQuestions: [
        {
          num: 101,
          sentence: "The finance committee will review the <span class='grammar-clue'>_____</span> budget proposal at tomorrow's session.",
          options: ["A. revise", "B. revision", "C. revised", "D. revising"],
          answer: 2,
          explain: "Trước cụm danh từ 'budget proposal' cần tính từ/phân từ mang nghĩa bị động ('đã được chỉnh sửa') → chọn C (revised)."
        },
        {
          num: 102,
          sentence: "Customers can track their shipments <span class='grammar-clue'>_____</span> by entering the confirmation code on our website.",
          options: ["A. convenient", "B. convenience", "C. conveniently", "D. conveniences"],
          answer: 2,
          explain: "Cần trạng từ bổ nghĩa cho động từ 'track' → chọn C (conveniently: một cách thuận tiện)."
        },
        {
          num: 103,
          sentence: "All newly hired engineers are required to attend a <span class='grammar-clue'>_____</span> safety orientation.",
          options: ["A. mandatory", "B. hesitantly", "C. fragile", "D. vacant"],
          answer: 0,
          explain: "Câu hỏi từ vựng: 'mandatory safety orientation' (buổi định hướng an toàn bắt buộc) → chọn A."
        },
        {
          num: 104,
          sentence: "<span class='grammar-clue'>In addition to</span> offering competitive salaries, the firm provides flexible remote work schedules.",
          options: ["A. offers", "B. offering", "C. offered", "D. to offer"],
          answer: 1,
          explain: "Sau cụm giới từ 'In addition to' luôn là V-ing hoặc Danh từ → chọn B (offering)."
        }
      ]
    },

    6: {
      num: 6,
      key: "part-6",
      title: "Part 6: Text Completion - Điền từ vào đoạn văn",
      lessons: [
        { id: 1, title: "Tổng quan", activities: [{ id: "p6-l1-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }] },
        { id: 2, title: "Câu hỏi từ loại", activities: [{ id: "p6-l2-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p6-l2-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 3, title: "Câu hỏi ngữ pháp", activities: [{ id: "p6-l3-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p6-l3-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 4, title: "Câu hỏi từ vựng", activities: [{ id: "p6-l4-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p6-l4-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 5, title: "Câu hỏi điền câu vào đoạn văn", activities: [{ id: "p6-l5-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p6-l5-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        {
          id: 6,
          title: "Luyện tập theo hình thức văn bản",
          activities: [
            { id: "p6-l6-a1", prefix: "Luyện tập:", title: "Thư điện tử/ thư tay (Email/ Letter)", type: "practice" },
            { id: "p6-l6-a2", prefix: "Luyện tập:", title: "Bài báo (Article/ Review)", type: "practice" },
            { id: "p6-l6-a3", prefix: "Luyện tập:", title: "Quảng cáo (Advertisement)", type: "practice" },
            { id: "p6-l6-a4", prefix: "Luyện tập:", title: "Thông báo/ văn bản hướng dẫn (Notice/ Announcement Information)", type: "practice" },
            { id: "p6-l6-a5", prefix: "Luyện tập:", title: "Thông báo nội bộ (Memo)", type: "practice" }
          ]
        },
        { id: 7, title: "PRACTICE ZONE", activities: [{ id: "p6-l7-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] }
      ],
      defaultTheoryHtml: `
        <h2>Chiến lược Part 6: Text Completion (16 câu / 4 đoạn)</h2>
        <ul>
          <li>Mỗi đoạn văn có 4 chỗ trống: 3 câu từ loại/ngữ pháp/từ vựng và <strong>1 câu điền cả câu vào đoạn văn</strong>.</li>
          <li>Với câu điền cả câu: đọc kỹ <strong>câu liền trước và câu liền sau</strong>, chú ý đại từ liên kết (<em>this, these, however, therefore</em>).</li>
        </ul>
      `,
      practiceSets: [
        {
          num: 1,
          docType: "Internal Memo — Thông báo nội bộ",
          meta: "To: All Staff | From: Facilities Management | Subject: Parking Garage Resurfacing",
          passageHtml: `
            Please be advised that the west wing of the employee parking garage will be closed for resurfacing from Monday, November 16, through Wednesday, November 18. <span class="reading-blank-badge">(131)</span> this period, all vehicles must be parked in the east wing or in the overflow lot across Oak Street.<br><br>
            We have arranged for a shuttle bus to operate <span class="reading-blank-badge">(132)</span> between the overflow lot and the main entrance every ten minutes. <span class="reading-blank-badge">(133)</span>. We appreciate your <span class="reading-blank-badge">(134)</span> as we work to improve our campus facilities.
          `,
          questions: [
            {
              num: 131,
              text: "Chọn từ điền vào chỗ trống (131):",
              options: ["A. During", "B. While", "C. Since", "D. Although"],
              answer: 0,
              explain: "Sau chỗ trống là cụm danh từ 'this period' → dùng giới từ 'During' (trong suốt giai đoạn này) → chọn A."
            },
            {
              num: 132,
              text: "Chọn từ điền vào chỗ trống (132):",
              options: ["A. continuous", "B. continuously", "C. continue", "D. continuity"],
              answer: 1,
              explain: "Bổ nghĩa cho động từ 'operate' cần trạng từ → chọn B (continuously)."
            },
            {
              num: 133,
              text: "Chọn câu điền vào chỗ trống (133):",
              options: [
                "A. The cafeteria menu will also change next month.",
                "B. Employees should show their ID badges when boarding the shuttle.",
                "C. All quarterly financial reports have already been approved.",
                "D. New laptops will be distributed to the sales team."
              ],
              answer: 1,
              explain: "Câu trước nói về xe buýt đưa đón (shuttle bus) → câu B liên kết trực tiếp ('when boarding the shuttle') → chọn B."
            },
            {
              num: 134,
              text: "Chọn từ điền vào chỗ trống (134):",
              options: ["A. cooperate", "B. cooperative", "C. cooperation", "D. cooperatively"],
              answer: 2,
              explain: "Sau tính từ sở hữu 'your' cần danh từ → chọn C (cooperation: sự hợp tác)."
            }
          ]
        }
      ]
    },

    7: {
      num: 7,
      key: "part-7",
      title: "Part 7: Reading Comprehension - Đọc hiểu văn bản",
      lessons: [
        { id: 1, title: "Tổng quan", activities: [{ id: "p7-l1-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }] },
        { id: 2, title: "Câu hỏi về chủ đề, mục đích", activities: [{ id: "p7-l2-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p7-l2-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 3, title: "Câu hỏi tìm thông tin", activities: [{ id: "p7-l3-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p7-l3-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 4, title: "Câu hỏi suy luận", activities: [{ id: "p7-l4-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p7-l4-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 5, title: "Câu hỏi tìm từ đồng nghĩa", activities: [{ id: "p7-l5-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p7-l5-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 6, title: "Câu hỏi về hàm ý câu nói", activities: [{ id: "p7-l6-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p7-l6-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 7, title: "Câu hỏi tìm chi tiết sai", activities: [{ id: "p7-l7-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p7-l7-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 8, title: "Câu hỏi điền câu", activities: [{ id: "p7-l8-a1", prefix: "Video bài giảng:", title: "Lý thuyết", type: "video" }, { id: "p7-l8-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 9, title: "Dạng bài Article/ Review - Bài báo/ Bài đánh giá", activities: [{ id: "p7-l9-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p7-l9-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 10, title: "Dạng bài Announcement/ Notice - Thông báo", activities: [{ id: "p7-l10-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p7-l10-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 11, title: "Dạng bài Email/ Letter - Thư điện tử/ Thư tay", activities: [{ id: "p7-l11-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p7-l11-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 12, title: "Dạng bài Advertisement - Quảng cáo", activities: [{ id: "p7-l12-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p7-l12-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 13, title: "Dạng bài Form - Biểu mẫu", activities: [{ id: "p7-l13-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p7-l13-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        { id: 14, title: "Dạng bài Text message chain - Chuỗi tin nhắn", activities: [{ id: "p7-l14-a1", prefix: "Lý thuyết:", title: "Lý thuyết", type: "reading" }, { id: "p7-l14-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] },
        {
          id: 15,
          title: "Luyện tập theo cấu trúc",
          activities: [
            { id: "p7-l15-a1", prefix: "Luyện tập:", title: "Cấu trúc một đoạn", type: "practice" },
            { id: "p7-l15-a2", prefix: "Luyện tập:", title: "Cấu trúc nhiều đoạn", type: "practice" }
          ]
        },
        { id: 16, title: "PRACTICE ZONE", activities: [{ id: "p7-l16-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", type: "practice" }] }
      ],
      defaultTheoryHtml: `
        <h2>Chiến lược Part 7: Reading Comprehension (54 câu)</h2>
        <ul>
          <li>Gồm đoạn đơn (29 câu) và đoạn kép/đoạn ba (25 câu) — hãy dành ít nhất <strong>50–55 phút</strong> cho Part 7.</li>
          <li><strong>Kỹ thuật Skimming &amp; Scanning:</strong> Đọc tiêu đề/người gửi/người nhận trước → đọc câu hỏi để khoanh từ khóa → dò ngược vị trí chính xác trong văn bản.</li>
        </ul>
      `,
      practiceSets: [
        {
          num: 1,
          docType: "Email — Thư điện tử",
          meta: "From: Hannah Brooks <hbrooks@novatech.com><br>To: Software Engineering Team<br>Date: October 12<br>Subject: Annual Code Quality Workshop",
          passageHtml: `
            Dear Team,<br><br>
            I am pleased to announce that NovaTech will host our Annual Code Quality Workshop on Friday, October 23, from 9:00 A.M. to 4:00 P.M. in Auditorium C. This year's keynote speaker is Dr. Kenji Sato, who has led reliability engineering teams at several major cloud providers.<br><br>
            Morning sessions will focus on automated testing strategies, while afternoon labs will give participants hands-on practice refactoring legacy modules. Lunch will be catered in the courtyard at noon. Please register on the internal portal by <strong>October 19</strong> so we can finalize seating and dietary preferences.<br><br>
            Best regards,<br>Hannah Brooks, VP of Engineering
          `,
          questions: [
            {
              num: 147,
              text: "What is the main purpose of the email?",
              options: [
                "A. To announce a company training workshop",
                "B. To recruit a new keynote speaker",
                "C. To reschedule a software release date",
                "D. To request feedback on cafeteria food"
              ],
              answer: 0,
              explain: "Câu mở đầu: 'I am pleased to announce that NovaTech will host our Annual Code Quality Workshop' → thông báo hội thảo đào tạo → chọn A."
            },
            {
              num: 148,
              text: "What will participants do during the afternoon labs?",
              options: [
                "A. Listen to a keynote speech",
                "B. Practice refactoring legacy modules",
                "C. Interview cloud service vendors",
                "D. Submit annual performance reviews"
              ],
              answer: 1,
              explain: "Đoạn 2: 'afternoon labs will give participants hands-on practice refactoring legacy modules' → chọn B."
            },
            {
              num: 149,
              text: "By when should employees register on the internal portal?",
              options: ["A. October 12", "B. October 19", "C. October 23", "D. October 30"],
              answer: 1,
              explain: "'Please register on the internal portal by October 19' → hạn chót ngày 19/10 → chọn B."
            }
          ]
        }
      ]
    }
  };

  Object.values(extraParts).forEach((p) => {
    p.totalActivities = p.lessons.reduce((sum, l) => sum + l.activities.length, 0);
    PARTS.parts[p.num] = p;
  });
})();
