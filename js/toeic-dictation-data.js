/* Complete BT TOEIC "Luyện nghe chép chính tả TOEIC" Dataset */
window.BT_TOEIC_DICTATION_DATA = (function () {
  "use strict";

  const testNames = [];
  for (let i = 1; i <= 10; i++) testNames.push(`TOEIC LR Collection 1 Test ${i}`);
  for (let i = 1; i <= 10; i++) testNames.push(`ETS TOEIC 2024 Test ${i}`);
  for (let i = 1; i <= 10; i++) testNames.push(`Practice Set Test ${i}`);

  const tests = testNames.map((title, idx) => ({
    id: idx + 1,
    title,
    activities: [
      { id: `td-${idx + 1}-p1`, part: 1, prefix: "Luyện tập:", title: "Part 1" },
      { id: `td-${idx + 1}-p2`, part: 2, prefix: "Luyện tập:", title: "Part 2" },
      { id: `td-${idx + 1}-p3`, part: 3, prefix: "Luyện tập:", title: "Part 3" },
      { id: `td-${idx + 1}-p4`, part: 4, prefix: "Luyện tập:", title: "Part 4" }
    ]
  }));

  /* Authentic TOEIC Listening dictation sentences per Part */
  const sentencesByPart = {
    1: [
      { num: 1, text: "A woman is reviewing financial documents at her desk.", vi: "Một người phụ nữ đang xem xét tài liệu tài chính tại bàn làm việc." },
      { num: 2, text: "Several chairs have been arranged around a conference table.", vi: "Một vài chiếc ghế đã được xếp xung quanh bàn hội nghị." },
      { num: 3, text: "A technician is inspecting equipment inside the laboratory.", vi: "Một kỹ thuật viên đang kiểm tra thiết bị bên trong phòng thí nghiệm." },
      { num: 4, text: "Customers are waiting in line near the front counter.", vi: "Khách hàng đang xếp hàng chờ gần quầy lễ tân." },
      { num: 5, text: "Some boxes are stacked beside the warehouse entrance.", vi: "Một số thùng hàng được xếp chồng bên cạnh lối vào nhà kho." },
      { num: 6, text: "Two colleagues are discussing a blueprint in the office.", vi: "Hai đồng nghiệp đang thảo luận về bản thiết kế trong văn phòng." }
    ],
    2: [
      { num: 1, text: "Who is responsible for updating the quarterly sales report?", vi: "Ai chịu trách nhiệm cập nhật báo cáo doanh số hàng quý?" },
      { num: 2, text: "Where will the annual shareholder meeting be held this year?", vi: "Cuộc họp cổ đông thường niên năm nay sẽ tổ chức ở đâu?" },
      { num: 3, text: "When does the express train to Boston depart from platform three?", vi: "Chuyến tàu tốc hành đi Boston khởi hành từ sân ga số 3 lúc mấy giờ?" },
      { num: 4, text: "Why was the software launch postponed until next Monday?", vi: "Tại sao buổi ra mắt phần mềm bị hoãn đến thứ Hai tuần tới?" },
      { num: 5, text: "Could you send me the revised contract before noon today?", vi: "Bạn có thể gửi cho tôi bản hợp đồng đã sửa trước trưa nay không?" },
      { num: 6, text: "How many participants have registered for the leadership seminar?", vi: "Có bao nhiêu người tham gia đã đăng ký hội thảo lãnh đạo?" }
    ],
    3: [
      { num: 1, text: "The downtown convention center is undergoing roof repairs next week.", vi: "Trung tâm hội nghị trung tâm thành phố sẽ sửa mái vào tuần tới." },
      { num: 2, text: "I already called the Riverside Hotel and reserved their main ballroom.", vi: "Tôi đã gọi khách sạn Riverside và đặt sảnh lớn của họ." },
      { num: 3, text: "We will email the updated invitations to all registered guests this afternoon.", vi: "Chúng tôi sẽ gửi email thư mời cập nhật tới tất cả khách đã đăng ký chiều nay." },
      { num: 4, text: "Could you give me your order number so I can check our tracking system?", vi: "Bạn có thể cho tôi mã đơn hàng để tôi kiểm tra hệ thống theo dõi không?" },
      { num: 5, text: "We will upgrade your shipment to express delivery at no extra charge.", vi: "Chúng tôi sẽ nâng cấp đơn hàng của bạn lên giao nhanh miễn phí." },
      { num: 6, text: "Please let us know if you need any technical support during installation.", vi: "Vui lòng cho chúng tôi biết nếu bạn cần hỗ trợ kỹ thuật khi lắp đặt." }
    ],
    4: [
      { num: 1, text: "Attention all passengers waiting for Flight 402 to Singapore.", vi: "Xin lưu ý tất cả hành khách đang chờ chuyến bay 402 đi Singapore." },
      { num: 2, text: "Due to a brief maintenance inspection, boarding has been delayed by thirty minutes.", vi: "Do kiểm tra bảo dưỡng ngắn, giờ lên máy bay bị hoãn 30 phút." },
      { num: 3, text: "Complimentary beverage vouchers are available at the service desk next to Gate B12.", vi: "Phiếu đồ uống miễn phí có sẵn tại quầy dịch vụ cạnh cổng B12." },
      { num: 4, text: "Please arrive ten minutes early to verify your insurance details.", vi: "Vui lòng đến sớm 10 phút để xác nhận thông tin bảo hiểm của bạn." },
      { num: 5, text: "If you need to reschedule, kindly call our front desk before five o'clock.", vi: "Nếu bạn cần đổi lịch, vui lòng gọi quầy lễ tân trước 5 giờ." },
      { num: 6, text: "Thank you for attending today's workshop on sustainable manufacturing.", vi: "Cảm ơn bạn đã tham dự hội thảo hôm nay về sản xuất bền vững." }
    ]
  };

  return {
    tests,
    totalActivities: tests.reduce((s, t) => s + t.activities.length, 0),
    getTest(id) {
      const n = parseInt(id, 10) || 1;
      return tests.find((t) => t.id === n) || tests[0];
    },
    getSentences(partNum) {
      return sentencesByPart[parseInt(partNum, 10)] || sentencesByPart[1];
    }
  };
})();
