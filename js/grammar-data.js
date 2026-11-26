/* Complete BT TOEIC "Ngữ pháp TOEIC" Dataset — 18 Topics, 108 Activities + Theory & TOEIC Part 5 Questions */
window.BT_TOEIC_GRAMMAR_DATA = (function () {
  "use strict";

  const topics = [
    {
      id: 1,
      title: "Kiến thức cơ bản 1: từ loại và cụm từ",
      activities: [
        { id: "g1-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true }
      ],
      slides: [
        {
          heading: "1.1. 8 Từ loại cơ bản trong tiếng Anh",
          points: [
            "<strong>Danh từ (Noun):</strong> chỉ người, vật, sự việc, khái niệm (VD: <em>manager, report, contract</em>).",
            "<strong>Đại từ (Pronoun):</strong> dùng để xưng hô hoặc thay thế danh từ (VD: <em>he, she, they, it, our</em>).",
            "<strong>Động từ (Verb):</strong> diễn tả hành động hoặc trạng thái (VD: <em>review, submit, remain</em>).",
            "<strong>Tính từ (Adjective) & Trạng từ (Adverb):</strong> bổ nghĩa cho danh từ (Adj) và động từ/tính từ (Adv)."
          ]
        },
        {
          heading: "1.2. Cụm danh từ & Cụm giới từ trong TOEIC",
          points: [
            "<strong>Cụm danh từ (Noun Phrase):</strong> Từ hạn định + (Trạng từ) + Tính từ + Danh từ chính (VD: <em>the newly hired director</em>).",
            "<strong>Cụm giới từ (Prepositional Phrase):</strong> Giới từ + Cụm danh từ (VD: <em>in the conference room</em>).",
            "<strong>Mẹo Part 5:</strong> Xác định nhanh vị trí trống nằm trong cụm danh từ hay sau động từ để chọn đúng từ loại."
          ]
        }
      ],
      theoryHtml: `
        <h2>Kiến thức cơ bản 1: Từ loại và Cụm từ</h2>
        <p>Trong tiếng Anh có <strong>8 từ loại cơ bản</strong>: Danh từ (N), Đại từ (Pron), Động từ (V), Tính từ (Adj), Trạng từ (Adv), Giới từ (Prep), Liên từ (Conj) và Thán từ (Interj). Nắm chắc vị trí từ loại giúp bạn giải nhanh 30–40% câu hỏi TOEIC Part 5.</p>
        <h3>1. Vị trí nhận diện nhanh 4 từ loại trọng tâm</h3>
        <table class="lecture-table">
          <thead><tr><th>Từ loại</th><th>Vị trí thường gặp</th><th>Ví dụ TOEIC</th></tr></thead>
          <tbody>
            <tr><td><strong>Danh từ (N)</strong></td><td>Sau mạo từ (a/an/the), tính từ sở hữu, giới từ, tính từ</td><td>the <strong>approval</strong>, their <strong>proposal</strong></td></tr>
            <tr><td><strong>Tính từ (Adj)</strong></td><td>Trước danh từ, sau động từ nối (be, seem, remain, become)</td><td>a <strong>reliable</strong> supplier, remain <strong>competitive</strong></td></tr>
            <tr><td><strong>Trạng từ (Adv)</strong></td><td>Trước/sau động từ thường, trước tính từ, đầu câu</td><td><strong>carefully</strong> reviewed, <strong>highly</strong> qualified</td></tr>
            <tr><td><strong>Động từ (V)</strong></td><td>Sau chủ ngữ, sau trợ động từ (will, can, must, have)</td><td>The team <strong>submitted</strong> the report.</td></tr>
          </tbody>
        </table>
        <div class="lecture-callout"><strong>Lưu ý TOEIC:</strong> Sau giới từ (<em>of, for, in, about, regarding, despite...</em>) luôn là <strong>Danh từ / Cụm danh từ</strong> hoặc <strong>V-ing</strong>, không điền động từ chia thì!</div>
      `
    },
    {
      id: 2,
      title: "Kiến thức cơ bản 2: mệnh đề và câu",
      activities: [
        { id: "g2-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true }
      ],
      slides: [
        {
          heading: "2.1. Thành phần cốt lõi của một mệnh đề",
          points: [
            "Một mệnh đề hoàn chỉnh bắt buộc có ít nhất <strong>1 Chủ ngữ (S) + 1 Động từ chia thì (V)</strong>.",
            "<strong>Câu đơn:</strong> 1 mệnh đề độc lập (VD: <em>Ms. Kim signed the contract yesterday.</em>).",
            "<strong>Câu ghép & Câu phức:</strong> Nối 2 mệnh đề bằng liên từ kết hợp (<em>and, but, so</em>) hoặc liên từ phụ thuộc (<em>because, although, when, if</em>)."
          ]
        }
      ],
      theoryHtml: `
        <h2>Kiến thức cơ bản 2: Mệnh đề và Câu</h2>
        <p>Mọi câu chuẩn trong tiếng Anh đều xoay quanh cấu trúc <strong>Chủ ngữ (S) + Động từ chính (V) + (Tân ngữ/Bổ ngữ)</strong>.</p>
        <h3>1. Phân biệt Cụm từ (Phrase) và Mệnh đề (Clause)</h3>
        <ul>
          <li><strong>Cụm từ:</strong> Không có cặp S + V chia thì (VD: <em>because of the heavy rain</em>).</li>
          <li><strong>Mệnh đề:</strong> Có đủ S + V chia thì (VD: <em>because it rained heavily</em>).</li>
        </ul>
        <div class="lecture-callout"><strong>Mẹo Part 5:</strong> Trước khi chọn đáp án, hãy đếm số động từ chia thì trong câu. Nếu câu chưa có động từ chính → chọn động từ chia thì; nếu đã có động từ chính và không có liên từ → chọn V-ing/V-ed/to-V.</div>
      `
    },
    {
      id: 3,
      title: "Danh từ",
      activities: [
        { id: "g3-a1", prefix: "Video bài giảng:", title: "Lý thuyết (phần 1)", isVideo: true },
        { id: "g3-a2", prefix: "Video bài giảng:", title: "Lý thuyết (phần 2)", isVideo: true },
        { id: "g3-a3", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g3-a4", prefix: "Luyện tập:", title: "Nouns: countable, uncountable (Danh từ: đếm được, không đếm được)", isVideo: false },
        { id: "g3-a5", prefix: "Luyện tập:", title: "Plural nouns (Danh từ số nhiều)", isVideo: false },
        { id: "g3-a6", prefix: "Luyện tập:", title: "Plurals: mix (Số nhiều: tổng hợp)", isVideo: false },
        { id: "g3-a7", prefix: "Luyện tập:", title: "Indefinite article (Mạo từ không xác định)", isVideo: false },
        { id: "g3-a8", prefix: "Luyện tập:", title: "Definite article (Mạo từ xác định)", isVideo: false },
        { id: "g3-a9", prefix: "Luyện tập:", title: "Few, less, little, much, many (Ít / nhiều)", isVideo: false },
        { id: "g3-a10", prefix: "Luyện tập:", title: "Zero article (Không dùng mạo từ)", isVideo: false },
        { id: "g3-a11", prefix: "Luyện tập:", title: "Quantity - mix (Số lượng - tổng hợp)", isVideo: false },
        { id: "g3-a12", prefix: "Luyện tập:", title: "Articles: mix (Mạo từ: tổng hợp)", isVideo: false }
      ],
      slides: [
        {
          heading: "Danh từ đếm được & Không đếm được trong TOEIC",
          points: [
            "<strong>Danh từ đếm được số ít</strong> KHÔNG được đứng một mình — phải có mạo từ (<em>a/an/the</em>) hoặc từ hạn định (<em>this, my, each</em>).",
            "<strong>Danh từ không đếm được hay gặp:</strong> <em>information, equipment, advice, furniture, luggage, feedback, access</em> (không thêm <em>-s</em>, không dùng <em>a/an</em>).",
            "<strong>Lượng từ:</strong> <em>many / few / several</em> + N số nhiều; <em>much / little / less</em> + N không đếm được."
          ]
        }
      ],
      theoryHtml: `
        <h2>Danh từ (Nouns), Mạo từ &amp; Lượng từ</h2>
        <h3>1. Hậu tố nhận diện danh từ phổ biến</h3>
        <ul>
          <li>Chỉ vật/sự việc: <strong>-tion/-sion</strong> (<em>application</em>), <strong>-ment</strong> (<em>agreement</em>), <strong>-ness</strong> (<em>awareness</em>), <strong>-ity</strong> (<em>productivity</em>), <strong>-ance/-ence</strong> (<em>attendance</em>).</li>
          <li>Chỉ người: <strong>-er/-or</strong> (<em>supervisor</em>), <strong>-ist</strong> (<em>specialist</em>), <strong>-ant/-ent</strong> (<em>applicant</em>), <strong>-ee</strong> (<em>employee</em>).</li>
        </ul>
        <h3>2. Quy tắc vàng trong TOEIC Part 5</h3>
        <div class="lecture-callout"><strong>Cạm bẫy thường gặp:</strong> <em>equipment, information, advice, feedback, merchandise, access</em> là danh từ <strong>không đếm được</strong> → luôn chia động từ số ít và không dùng <em>a/an/many</em>.</div>
      `
    },
    {
      id: 4,
      title: "Đại từ",
      activities: [
        { id: "g4-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g4-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g4-a3", prefix: "Luyện tập:", title: "Quantity - mix (Số lượng - tổng hợp)", isVideo: false },
        { id: "g4-a4", prefix: "Luyện tập:", title: "Personal pronouns (Đại từ nhân xưng)", isVideo: false },
        { id: "g4-a5", prefix: "Luyện tập:", title: "Reflexive pronouns (Đại từ phản thân)", isVideo: false },
        { id: "g4-a6", prefix: "Luyện tập:", title: "Some, any, no, every (Một số, bất kỳ, không, mọi thứ)", isVideo: false },
        { id: "g4-a7", prefix: "Luyện tập:", title: "Possessive pronouns (Đại từ sở hữu)", isVideo: false },
        { id: "g4-a8", prefix: "Luyện tập:", title: "Both, all, whole, every, each (Cả hai, tất cả, toàn bộ, mọi, mỗi)", isVideo: false },
        { id: "g4-a9", prefix: "Luyện tập:", title: "This / these / that / those", isVideo: false },
        { id: "g4-a10", prefix: "Luyện tập:", title: "Another, other, either, neither (Cái khác, cũng không, mỗi)", isVideo: false }
      ],
      theoryHtml: `
        <h2>Đại từ (Pronouns)</h2>
        <p>Bảng 5 cột đại từ bắt buộc phải thuộc lòng khi luyện thi TOEIC:</p>
        <table class="lecture-table">
          <thead><tr><th>Chủ ngữ</th><th>Tân ngữ</th><th>Tính từ sở hữu (+ N)</th><th>Đại từ sở hữu</th><th>Phản thân</th></tr></thead>
          <tbody>
            <tr><td>I / he / she</td><td>me / him / her</td><td>my / his / her</td><td>mine / his / hers</td><td>myself / himself / herself</td></tr>
            <tr><td>we / they</td><td>us / them</td><td>our / their</td><td>ours / theirs</td><td>ourselves / themselves</td></tr>
          </tbody>
        </table>
        <div class="lecture-callout"><strong>Mẹo nhanh:</strong> Sau <em>by + đại từ phản thân</em> = tự mình làm (VD: <em>by herself</em>). Phân biệt <strong>another + N số ít</strong> vs <strong>other + N số nhiều</strong>.</div>
      `
    },
    {
      id: 5,
      title: "Tính từ",
      activities: [
        { id: "g5-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g5-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g5-a3", prefix: "Luyện tập:", title: "Too vs. enough", isVideo: false }
      ],
      theoryHtml: `
        <h2>Tính từ (Adjectives)</h2>
        <ul>
          <li><strong>Hậu tố phổ biến:</strong> <em>-ful, -less, -ous, -al, -ive, -able/-ible, -ic, -ent/-ant</em>.</li>
          <li><strong>Vị trí:</strong> Đứng trước danh từ (<em>an <strong>efficient</strong> process</em>), sau động từ nối (<em>remain <strong>confident</strong></em>), hoặc cấu trúc <em>make/keep/find + O + Adj</em>.</li>
          <li><strong>Too vs. Enough:</strong> <em>too + Adj + to-V</em> vs <em>Adj + enough + to-V</em>.</li>
        </ul>
      `
    },
    {
      id: 6,
      title: "Thì",
      activities: [
        { id: "g6-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g6-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g6-a3", prefix: "Luyện tập:", title: "Present simple tense (Thì hiện tại đơn)", isVideo: false },
        { id: "g6-a4", prefix: "Luyện tập:", title: "Present continuous (Thì hiện tại tiếp diễn)", isVideo: false },
        { id: "g6-a5", prefix: "Luyện tập:", title: "Past simple tense (Thì quá khứ đơn)", isVideo: false },
        { id: "g6-a6", prefix: "Luyện tập:", title: "Present tense: questions and negatives (Thì hiện tại: câu hỏi và phủ định)", isVideo: false },
        { id: "g6-a7", prefix: "Luyện tập:", title: "Past tense: questions and negatives (Thì quá khứ: câu hỏi và phủ định)", isVideo: false },
        { id: "g6-a8", prefix: "Luyện tập:", title: "Future simple tense (Thì tương lai đơn)", isVideo: false },
        { id: "g6-a9", prefix: "Luyện tập:", title: "Present simple vs. present continuous (Thì hiện tại đơn vs. Thì hiện tại tiếp diễn)", isVideo: false },
        { id: "g6-a10", prefix: "Luyện tập:", title: "Past continuous (Thì quá khứ tiếp diễn)", isVideo: false },
        { id: "g6-a11", prefix: "Luyện tập:", title: "Future tenses: continuous vs. perfect (Các thì tương lai: tiếp diễn vs. hoàn thành)", isVideo: false },
        { id: "g6-a12", prefix: "Luyện tập:", title: "Used to (Đã từng)", isVideo: false },
        { id: "g6-a13", prefix: "Luyện tập:", title: "Present perfect tense (Thì hiện tại hoàn thành)", isVideo: false },
        { id: "g6-a14", prefix: "Luyện tập:", title: "Will vs. going to", isVideo: false },
        { id: "g6-a15", prefix: "Luyện tập:", title: "Tenses: mix (Các thì: tổng hợp)", isVideo: false },
        { id: "g6-a16", prefix: "Luyện tập:", title: "Present continuous - double consonant (Hiện tại tiếp diễn - phụ âm đôi)", isVideo: false },
        { id: "g6-a17", prefix: "Luyện tập:", title: "Talking about the present: mix (Nói về hiện tại: tổng hợp)", isVideo: false },
        { id: "g6-a18", prefix: "Luyện tập:", title: "Past perfect (Thì quá khứ hoàn thành)", isVideo: false },
        { id: "g6-a19", prefix: "Luyện tập:", title: "To do, to have, to be in present simple (To do, to have, to be: thì hiện tại)", isVideo: false },
        { id: "g6-a20", prefix: "Luyện tập:", title: "Past simple vs. past continuous (Quá khứ đơn vs. quá khứ tiếp diễn)", isVideo: false },
        { id: "g6-a21", prefix: "Luyện tập:", title: "To do, to have, to be: questions and negatives (To do, to have, to be: câu hỏi và phủ định)", isVideo: false },
        { id: "g6-a22", prefix: "Luyện tập:", title: "Modal verbs and infinitive (Động từ khuyết thiếu và động từ nguyên thể)", isVideo: false },
        { id: "g6-a23", prefix: "Luyện tập:", title: "Past simple vs. present perfect (Quá khứ đơn vs. hiện tại hoàn thành)", isVideo: false },
        { id: "g6-a24", prefix: "Luyện tập:", title: "To do, to have, to be in past simple (To do, to have, to be: thì quá khứ)", isVideo: false },
        { id: "g6-a25", prefix: "Luyện tập:", title: "Modal verbs: present simple (Động từ khuyết thiếu: hiện tại đơn)", isVideo: false },
        { id: "g6-a26", prefix: "Luyện tập:", title: "Present perfect: simple vs. continuous (Hiện tại hoàn thành: HTHT đơn vs. HTHT tiếp diễn)", isVideo: false },
        { id: "g6-a27", prefix: "Luyện tập:", title: "Modal verbs: past simple (Động từ khuyết thiếu: quá khứ đơn)", isVideo: false },
        { id: "g6-a28", prefix: "Luyện tập:", title: "Verb to be (Động từ to be)", isVideo: false },
        { id: "g6-a29", prefix: "Luyện tập:", title: "Past simple vs. past perfect (Quá khứ đơn vs. quá khứ hoàn thành)", isVideo: false },
        { id: "g6-a30", prefix: "Luyện tập:", title: "Can / could (Có thể)", isVideo: false },
        { id: "g6-a31", prefix: "Luyện tập:", title: "To be in past simple (Luyện tập: to be - thì quá khứ)", isVideo: false },
        { id: "g6-a32", prefix: "Luyện tập:", title: "There is, there are (Có)", isVideo: false },
        { id: "g6-a33", prefix: "Luyện tập:", title: "Must / have to / can (Phải / có thể)", isVideo: false },
        { id: "g6-a34", prefix: "Luyện tập:", title: "Pictures from the past (Hình ảnh trong quá khứ)", isVideo: false },
        { id: "g6-a35", prefix: "Luyện tập:", title: "Talking about the past: mix (Nói về quá khứ: tổng hợp)", isVideo: false },
        { id: "g6-a36", prefix: "Luyện tập:", title: "Be, have, do: mix (Be, have, do: tổng hợp)", isVideo: false },
        { id: "g6-a37", prefix: "Luyện tập:", title: "Should (Nên)", isVideo: false },
        { id: "g6-a38", prefix: "Luyện tập:", title: "Modal verbs: mix (Động từ khuyết thiếu: tổng hợp)", isVideo: false }
      ],
      theoryHtml: `
        <h2>Các thì động từ (Tenses) &amp; Động từ khuyết thiếu</h2>
        <table class="lecture-table">
          <thead><tr><th>Thì</th><th>Dấu hiệu TOEIC hay gặp</th><th>Công thức</th></tr></thead>
          <tbody>
            <tr><td><strong>Hiện tại hoàn thành</strong></td><td>since, for, recently, over the past 5 years, already, yet</td><td>have/has + V3/ed</td></tr>
            <tr><td><strong>Quá khứ đơn</strong></td><td>yesterday, last month, ago, in 2020</td><td>V2/ed</td></tr>
            <tr><td><strong>Tương lai hoàn thành</strong></td><td>by + mốc thời gian tương lai (by next Friday)</td><td>will have + V3/ed</td></tr>
            <tr><td><strong>Quá khứ hoàn thành</strong></td><td>by the time + S + V2/ed, before + quá khứ</td><td>had + V3/ed</td></tr>
          </tbody>
        </table>
      `
    },
    {
      id: 7,
      title: "Thể",
      activities: [
        { id: "g7-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g7-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g7-a3", prefix: "Luyện tập:", title: "Passive voice (Thể bị động)", isVideo: false },
        { id: "g7-a4", prefix: "Luyện tập:", title: "Have something done (Hoàn thành điều gì đó)", isVideo: false }
      ],
      theoryHtml: `
        <h2>Thể chủ động &amp; Thể bị động (Active vs. Passive Voice)</h2>
        <p><strong>Công thức chung thể bị động:</strong> <code>be + V3/ed</code>.</p>
        <div class="lecture-callout"><strong>Mẹo giải nhanh 3 giây:</strong> Nhìn ngay sau chỗ trống — nếu <strong>KHÔNG có tân ngữ</strong> (mà là giới từ, trạng từ, dấu chấm) → ưu tiên <strong>bị động</strong>; nếu có cụm danh từ làm tân ngữ → ưu tiên <strong>chủ động</strong>.</div>
      `
    },
    {
      id: 8,
      title: "Động từ nguyên mẫu",
      activities: [
        { id: "g8-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g8-a2", prefix: "Luyện tập:", title: "Make / let", isVideo: false }
      ],
      theoryHtml: `
        <h2>Động từ nguyên mẫu không 'to' (Bare Infinitive)</h2>
        <ul>
          <li>Sau động từ khuyết thiếu: <em>can, could, will, would, should, must, may, might + V0</em>.</li>
          <li>Sau cấu trúc sai khiến: <em>make / let / have + O + V0</em> (VD: <em>Let me know if you have questions.</em>).</li>
        </ul>
      `
    },
    {
      id: 9,
      title: "Động từ nguyên mẫu có 'to'",
      activities: [
        { id: "g9-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g9-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g9-a3", prefix: "Luyện tập:", title: "Verb + object + to infinitive (Động từ + tân ngữ + ĐT nguyên mẫu có 'to')", isVideo: false }
      ],
      theoryHtml: `
        <h2>Động từ nguyên mẫu có 'to' (To-Infinitive)</h2>
        <ul>
          <li><strong>Diễn tả mục đích:</strong> <em>(in order) to + V0</em> — để làm gì.</li>
          <li><strong>Động từ + to-V:</strong> <em>decide, plan, agree, promise, expect, offer, refuse, fail, manage</em>.</li>
          <li><strong>Động từ + O + to-V:</strong> <em>ask, advise, encourage, invite, remind, require, allow, enable</em>.</li>
        </ul>
      `
    },
    {
      id: 10,
      title: "Danh động từ",
      activities: [
        { id: "g10-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g10-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g10-a3", prefix: "Luyện tập:", title: "Gerund vs. infinitive (Danh động từ vs. động từ nguyên mẫu)", isVideo: false },
        { id: "g10-a4", prefix: "Luyện tập:", title: "Verb patterns: mix (Các dạng động từ: tổng hợp)", isVideo: false }
      ],
      theoryHtml: `
        <h2>Danh động từ (Gerund — V-ing)</h2>
        <ul>
          <li>Đứng sau <strong>giới từ</strong> (<em>by, without, before, after, in addition to, look forward to + V-ing</em>).</li>
          <li>Sau các động từ quen thuộc trong TOEIC: <em>consider, recommend, suggest, avoid, postpone, finish, enjoy, mind + V-ing</em>.</li>
          <li>Làm chủ ngữ trong câu (luôn chia động từ số ít): <em><strong>Submitting</strong> the form early ensures fast approval.</em></li>
        </ul>
      `
    },
    {
      id: 11,
      title: "Phân từ và cấu trúc phân từ",
      activities: [
        { id: "g11-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g11-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false }
      ],
      theoryHtml: `
        <h2>Phân từ (V-ing / V-ed) &amp; Cấu trúc phân từ</h2>
        <ul>
          <li><strong>Hiện tại phân từ (V-ing):</strong> mang nghĩa chủ động hoặc chỉ bản chất (<em>an <strong>exciting</strong> launch, the <strong>rising</strong> cost</em>).</li>
          <li><strong>Quá khứ phân từ (V-ed/V3):</strong> mang nghĩa bị động hoặc cảm xúc (<em>the <strong>attached</strong> file, <strong>satisfied</strong> customers</em>).</li>
        </ul>
      `
    },
    {
      id: 12,
      title: "Trạng từ",
      activities: [
        { id: "g12-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g12-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g12-a3", prefix: "Luyện tập:", title: "Positions of adverbs in sentences (Vị trí của trạng từ trong câu)", isVideo: false },
        { id: "g12-a4", prefix: "Luyện tập:", title: "Adjective or adverb? (Tính từ hay trạng từ?)", isVideo: false },
        { id: "g12-a5", prefix: "Luyện tập:", title: "Adjectives and adverbs: mix (Tính từ và trạng từ: tổng hợp)", isVideo: false }
      ],
      theoryHtml: `
        <h2>Trạng từ (Adverbs)</h2>
        <ul>
          <li>Bổ nghĩa cho <strong>động từ thường</strong> (<em>work <strong>efficiently</strong></em>), <strong>tính từ</strong> (<em><strong>extremely</strong> helpful</em>), hoặc <strong>cả câu</strong> (<em><strong>Fortunately</strong>, the shipment arrived early.</em>).</li>
          <li><strong>Cạm bẫy đuôi -ly nhưng là Tính từ:</strong> <em>timely, costly, friendly, weekly, monthly, likely</em>.</li>
        </ul>
      `
    },
    {
      id: 13,
      title: "Giới từ",
      activities: [
        { id: "g13-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g13-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g13-a3", prefix: "Luyện tập:", title: "Prepositions of time (Giới từ chỉ thời gian)", isVideo: false },
        { id: "g13-a4", prefix: "Luyện tập:", title: "Prepositions of place (Giới từ chỉ địa điểm)", isVideo: false },
        { id: "g13-a5", prefix: "Luyện tập:", title: "Prepositions of direction (Giới từ chỉ hướng)", isVideo: false },
        { id: "g13-a6", prefix: "Luyện tập:", title: "Prepositions: other (Giới từ: khác)", isVideo: false },
        { id: "g13-a7", prefix: "Luyện tập:", title: "Prepositions: mix (Giới từ: tổng hợp)", isVideo: false }
      ],
      theoryHtml: `
        <h2>Giới từ (Prepositions) trọng tâm TOEIC</h2>
        <ul>
          <li><strong>Thời gian:</strong> <em>at</em> (giờ), <em>on</em> (ngày/thứ), <em>in</em> (tháng/năm/mùa), <em>by</em> (trước hạn chót), <em>until</em> (cho đến khi), <em>within</em> (trong vòng), <em>throughout</em> (xuyên suốt).</li>
          <li><strong>Giới từ đặc trưng TOEIC:</strong> <em>regarding / concerning</em> (về việc), <em>despite / in spite of</em> (mặc dù + N), <em>due to / because of</em> (bởi vì + N), <em>prior to</em> (trước khi).</li>
        </ul>
      `
    },
    {
      id: 14,
      title: "Liên từ",
      activities: [
        { id: "g14-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g14-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false }
      ],
      theoryHtml: `
        <h2>Liên từ (Conjunctions)</h2>
        <ul>
          <li><strong>Cặp liên từ tương quan:</strong> <em>both... and..., either... or..., neither... nor..., not only... but also...</em></li>
          <li><strong>Phân biệt Liên từ (+ S + V) vs Giới từ (+ N/V-ing):</strong> <em>although / even though</em> vs <em>despite</em>; <em>because / since</em> vs <em>because of / due to</em>; <em>while</em> vs <em>during</em>.</li>
        </ul>
      `
    },
    {
      id: 15,
      title: "Mệnh đề quan hệ",
      activities: [
        { id: "g15-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g15-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false }
      ],
      theoryHtml: `
        <h2>Mệnh đề quan hệ (Relative Clauses)</h2>
        <ul>
          <li><strong>who / whom:</strong> chỉ người (<em>who + V</em>, <em>whom + S + V</em>).</li>
          <li><strong>which:</strong> chỉ vật; <strong>that:</strong> chỉ người/vật (không dùng sau dấu phẩy hoặc giới từ).</li>
          <li><strong>whose + N:</strong> chỉ sở hữu (<em>employees <strong>whose</strong> badges have expired</em>).</li>
        </ul>
      `
    },
    {
      id: 16,
      title: "Câu điều kiện",
      activities: [
        { id: "g16-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g16-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g16-a3", prefix: "Luyện tập:", title: "First conditional (Điều kiện loại 1)", isVideo: false },
        { id: "g16-a4", prefix: "Luyện tập:", title: "Second and third conditional (Điều kiện loại 2 và 3)", isVideo: false },
        { id: "g16-a5", prefix: "Luyện tập:", title: "Wish, unless, if only, if not (Ước gì, trừ khi, nếu chỉ, nếu không)", isVideo: false },
        { id: "g16-a6", prefix: "Luyện tập:", title: "Conditionals: mix (Điều kiện: tổng hợp)", isVideo: false }
      ],
      theoryHtml: `
        <h2>Câu điều kiện (Conditionals) &amp; Đảo ngữ TOEIC</h2>
        <table class="lecture-table">
          <thead><tr><th>Loại</th><th>Mệnh đề If</th><th>Mệnh đề chính</th><th>Đảo ngữ hay ra thi</th></tr></thead>
          <tbody>
            <tr><td>Loại 1</td><td>S + V(s/es)</td><td>S + will/can/should + V0</td><td><strong>Should</strong> + S + V0, ...</td></tr>
            <tr><td>Loại 2</td><td>S + V2/were</td><td>S + would/could + V0</td><td><strong>Were</strong> + S + (to V0), ...</td></tr>
            <tr><td>Loại 3</td><td>S + had + V3/ed</td><td>S + would have + V3/ed</td><td><strong>Had</strong> + S + V3/ed, ...</td></tr>
          </tbody>
        </table>
      `
    },
    {
      id: 17,
      title: "Cấu trúc phân từ",
      activities: [
        { id: "g17-a1", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false }
      ],
      theoryHtml: `
        <h2>Rút gọn mệnh đề bằng Cấu trúc phân từ</h2>
        <p>Khi 2 mệnh đề có cùng chủ ngữ, có thể rút gọn mệnh đề phụ bằng <strong>V-ing</strong> (nghĩa chủ động) hoặc <strong>V3/ed</strong> (nghĩa bị động).</p>
      `
    },
    {
      id: 18,
      title: "Cấu trúc so sánh",
      activities: [
        { id: "g18-a1", prefix: "Video bài giảng:", title: "Lý thuyết", isVideo: true },
        { id: "g18-a2", prefix: "Luyện tập:", title: "Trắc nghiệm format TOEIC", isVideo: false },
        { id: "g18-a3", prefix: "Luyện tập:", title: "Comparative / superlative adjectives (Tính từ so sánh hơn / so sánh nhất)", isVideo: false },
        { id: "g18-a4", prefix: "Luyện tập:", title: "Comparative / superlative adverbs (Trạng từ so sánh hơn / so sánh nhất)", isVideo: false },
        { id: "g18-a5", prefix: "Luyện tập:", title: "Than vs then", isVideo: false }
      ],
      theoryHtml: `
        <h2>Cấu trúc so sánh (Comparisons)</h2>
        <ul>
          <li><strong>So sánh bằng:</strong> <em>as + Adj/Adv + as</em>.</li>
          <li><strong>So sánh hơn:</strong> <em>Adj-er / more + Adj + than</em> (nhấn mạnh bằng <em>much / far / significantly / even</em>).</li>
          <li><strong>So sánh nhất:</strong> <em>the + Adj-est / the most + Adj</em> (thường đi với <em>in the region, of all, ever</em>).</li>
        </ul>
      `
    }
  ];

  /* Real TOEIC Part 5 Grammar Questions (grouped by topicId, with shared fallback pool) */
  const questionsByTopic = {
    3: [
      {
        num: 101,
        sentence: "<span class='grammar-clue'>Because of</span> transportation _____ due to winter weather, some conference participants may arrive late.",
        options: ["A. are delayed", "B. to delay", "C. delays", "D. had delayed"],
        answer: 2,
        explain: "Sau giới từ 'Because of' cần một cụm danh từ. 'transportation delays' (sự chậm trễ giao thông) là cụm danh từ ghép phù hợp nhất → chọn C."
      },
      {
        num: 102,
        sentence: "The purchasing department ordered <span class='grammar-clue'>new</span> _____ for the newly renovated laboratory.",
        options: ["A. equip", "B. equipment", "C. equipments", "D. equipped"],
        answer: 1,
        explain: "Sau tính từ 'new' cần danh từ. 'equipment' là danh từ không đếm được nên không thêm '-s' → chọn B."
      },
      {
        num: 103,
        sentence: "Ms. Tanaka received <span class='grammar-clue'>several</span> _____ from clients praising the updated user interface.",
        options: ["A. compliment", "B. compliments", "C. complimentary", "D. complimenting"],
        answer: 1,
        explain: "Sau lượng từ 'several' (một vài) luôn là danh từ đếm được số nhiều → chọn B (compliments)."
      },
      {
        num: 104,
        sentence: "There is very <span class='grammar-clue'>_____</span> time left to finalize the quarterly budget before the board meeting.",
        options: ["A. few", "B. many", "C. little", "D. several"],
        answer: 2,
        explain: "'time' là danh từ không đếm được nên chỉ đi với 'little' (rất ít), không dùng 'few/many/several' → chọn C."
      },
      {
        num: 105,
        sentence: "All employees must submit <span class='grammar-clue'>their</span> _____ for annual leave at least two weeks in advance.",
        options: ["A. request", "B. requested", "C. requesting", "D. requests"],
        answer: 3,
        explain: "Sau tính từ sở hữu 'their' (của tất cả nhân viên) cần danh từ số nhiều 'requests' → chọn D."
      }
    ],
    4: [
      {
        num: 101,
        sentence: "Mr. Vance completed the entire market analysis <span class='grammar-clue'>by</span> _____ over the weekend.",
        options: ["A. he", "B. him", "C. his", "D. himself"],
        answer: 3,
        explain: "Cấu trúc 'by + đại từ phản thân' mang nghĩa tự mình làm. Chủ ngữ là 'Mr. Vance' → chọn D (himself)."
      },
      {
        num: 102,
        sentence: "Please remind the interns to bring _____ identification badges to the orientation session.",
        options: ["A. they", "B. them", "C. their", "D. theirs"],
        answer: 2,
        explain: "Trước cụm danh từ 'identification badges' cần tính từ sở hữu → chọn C (their)."
      },
      {
        num: 103,
        sentence: "If this conference room is occupied, we can move the briefing to <span class='grammar-clue'>_____</span> room on the fifth floor.",
        options: ["A. another", "B. other", "C. others", "D. the others"],
        answer: 0,
        explain: "Trước danh từ đếm được số ít 'room' dùng 'another' (một phòng khác) → chọn A."
      },
      {
        num: 104,
        sentence: "Our shipping policy is much more flexible than _____ of our main competitors.",
        options: ["A. this", "B. that", "C. those", "D. these"],
        answer: 1,
        explain: "Dùng đại từ chỉ định 'that' để thay thế cho danh từ số ít đã nhắc trước đó ('shipping policy') → chọn B."
      }
    ],
    5: [
      {
        num: 101,
        sentence: "The new automated billing system has proven to be highly <span class='grammar-clue'>_____</span> in reducing errors.",
        options: ["A. effect", "B. effectively", "C. effective", "D. effectiveness"],
        answer: 2,
        explain: "Sau 'be + trạng từ (highly)' cần một tính từ → chọn C (effective)."
      },
      {
        num: 102,
        sentence: "The venue was not spacious <span class='grammar-clue'>_____</span> to accommodate all 500 summit attendees.",
        options: ["A. too", "B. enough", "C. very", "D. so"],
        answer: 1,
        explain: "Cấu trúc 'Adj + enough + to-V' (đủ rộng để chứa...) → chọn B."
      },
      {
        num: 103,
        sentence: "Customers appreciate the <span class='grammar-clue'>_____</span> service provided by our support representatives.",
        options: ["A. prompt", "B. promptly", "C. promptness", "D. prompted"],
        answer: 0,
        explain: "Trước danh từ 'service' cần tính từ bổ nghĩa → chọn A (prompt: nhanh chóng)."
      }
    ],
    6: [
      {
        num: 101,
        sentence: "Over the past five years, Apex Logistics <span class='grammar-clue'>_____</span> its delivery network across Southeast Asia.",
        options: ["A. expands", "B. has expanded", "C. will expand", "D. expanding"],
        answer: 1,
        explain: "Dấu hiệu 'Over the past five years' (trong suốt 5 năm qua) → dùng thì Hiện tại hoàn thành → chọn B."
      },
      {
        num: 102,
        sentence: "<span class='grammar-clue'>By next Friday</span>, the engineering team _____ all safety inspections for the new plant.",
        options: ["A. completes", "B. completed", "C. will have completed", "D. has completed"],
        answer: 2,
        explain: "Cấu trúc 'By + mốc thời gian tương lai (By next Friday)' → dùng thì Tương lai hoàn thành (will have + V3) → chọn C."
      },
      {
        num: 103,
        sentence: "All visitors <span class='grammar-clue'>must</span> _____ at the reception desk upon entering the building.",
        options: ["A. register", "B. registered", "C. registering", "D. registration"],
        answer: 0,
        explain: "Sau động từ khuyết thiếu 'must' luôn là động từ nguyên mẫu không 'to' → chọn A."
      },
      {
        num: 104,
        sentence: "The board of directors _____ the merger proposal during <span class='grammar-clue'>yesterday's</span> emergency meeting.",
        options: ["A. approve", "B. approved", "C. approves", "D. will approve"],
        answer: 1,
        explain: "Dấu hiệu quá khứ 'yesterday's' → chia thì Quá khứ đơn → chọn B."
      }
    ],
    7: [
      {
        num: 101,
        sentence: "The updated employee handbook will _____ to all staff members <span class='grammar-clue'>via email</span> tomorrow.",
        options: ["A. distribute", "B. be distributed", "C. distributing", "D. distribution"],
        answer: 1,
        explain: "Chủ ngữ 'handbook' (vật) và sau chỗ trống là giới từ 'to' (không có tân ngữ) → dùng bị động 'will be + V3' → chọn B."
      },
      {
        num: 102,
        sentence: "Mr. Park had his office printer _____ by an authorized technician this morning.",
        options: ["A. repair", "B. repairing", "C. repaired", "D. repairs"],
        answer: 2,
        explain: "Cấu trúc bị động sai khiến 'have something + V3/ed' → chọn C (repaired)."
      }
    ],
    10: [
      {
        num: 101,
        sentence: "We are <span class='grammar-clue'>considering</span> _____ a satellite office in Da Nang next quarter.",
        options: ["A. open", "B. to open", "C. opening", "D. opened"],
        answer: 2,
        explain: "Động từ 'consider' luôn đi với danh động từ (V-ing) → chọn C (opening)."
      },
      {
        num: 102,
        sentence: "Thank you <span class='grammar-clue'>for</span> _____ your constructive feedback on our new mobile application.",
        options: ["A. share", "B. sharing", "C. shared", "D. to share"],
        answer: 1,
        explain: "Sau giới từ 'for' dùng V-ing → chọn B."
      }
    ],
    12: [
      {
        num: 101,
        sentence: "Sales of electric scooters increased <span class='grammar-clue'>_____</span> during the third quarter.",
        options: ["A. significant", "B. significance", "C. significantly", "D. signify"],
        answer: 2,
        explain: "Cần trạng từ bổ nghĩa cho động từ thường 'increased' → chọn C (significantly)."
      },
      {
        num: 102,
        sentence: "Please review the attached contract <span class='grammar-clue'>_____</span> before signing on the final page.",
        options: ["A. careful", "B. carefully", "C. care", "D. carefulness"],
        answer: 1,
        explain: "Cần trạng từ bổ nghĩa cho động từ 'review' → chọn B (carefully)."
      }
    ],
    13: [
      {
        num: 101,
        sentence: "<span class='grammar-clue'>_____</span> the heavy rain, the outdoor charity concert attracted over 2,000 guests.",
        options: ["A. Although", "B. Despite", "C. Because", "D. Unless"],
        answer: 1,
        explain: "Sau chỗ trống là cụm danh từ 'the heavy rain' và mang nghĩa nhượng bộ → dùng giới từ 'Despite' → chọn B."
      },
      {
        num: 102,
        sentence: "All expense reports must be submitted <span class='grammar-clue'>_____</span> 5:00 P.M. on Friday.",
        options: ["A. by", "B. during", "C. among", "D. between"],
        answer: 0,
        explain: "Dùng giới từ 'by' trước mốc thời gian chỉ hạn chót (trước 5 giờ chiều) → chọn A."
      }
    ],
    14: [
      {
        num: 101,
        sentence: "_____ the software upgrade was scheduled for midnight, <span class='grammar-clue'>it</span> caused no disruption to daytime operations.",
        options: ["A. Because", "B. Because of", "C. Due to", "D. Despite"],
        answer: 0,
        explain: "Sau chỗ trống là mệnh đề đầy đủ (S + V) và mang nghĩa nguyên nhân → dùng liên từ 'Because' → chọn A."
      },
      {
        num: 102,
        sentence: "Both the marketing director <span class='grammar-clue'>_____</span> the lead designer will attend the Berlin trade show.",
        options: ["A. or", "B. nor", "C. and", "D. but"],
        answer: 2,
        explain: "Cặp liên từ tương quan 'Both A and B' → chọn C."
      }
    ],
    15: [
      {
        num: 101,
        sentence: "Employees _____ badges have been lost should report immediately to the security office.",
        options: ["A. who", "B. whom", "C. whose", "D. which"],
        answer: 2,
        explain: "Trước danh từ 'badges' chỉ sự sở hữu của 'Employees' → dùng đại từ quan hệ 'whose' → chọn C."
      },
      {
        num: 102,
        sentence: "The candidate _____ impressed the hiring panel most has ten years of finance experience.",
        options: ["A. who", "B. whom", "C. whose", "D. which"],
        answer: 0,
        explain: "Thay thế cho danh từ chỉ người 'candidate' và làm chủ ngữ trước động từ 'impressed' → chọn A (who)."
      }
    ],
    16: [
      {
        num: 101,
        sentence: "<span class='grammar-clue'>_____</span> you require any further assistance, please contact our customer care desk.",
        options: ["A. Should", "B. Had", "C. Were", "D. Did"],
        answer: 0,
        explain: "Đảo ngữ câu điều kiện loại 1: 'Should + S + V0, please + V0' (= If you should require...) → chọn A."
      },
      {
        num: 102,
        sentence: "If the shipment <span class='grammar-clue'>had arrived</span> on time, we _____ the launch yesterday.",
        options: ["A. will hold", "B. would hold", "C. would have held", "D. held"],
        answer: 2,
        explain: "Câu điều kiện loại 3 (trái sự thật trong quá khứ): If + had V3, S + would have + V3 → chọn C."
      }
    ],
    18: [
      {
        num: 101,
        sentence: "The Model X200 printer operates <span class='grammar-clue'>much _____</span> than the previous version.",
        options: ["A. quiet", "B. quieter", "C. more quietly", "D. most quietly"],
        answer: 2,
        explain: "Bổ nghĩa cho động từ thường 'operates' và có 'than' → dùng trạng từ so sánh hơn 'more quietly' → chọn C."
      },
      {
        num: 102,
        sentence: "This quarter's revenue growth is <span class='grammar-clue'>the _____</span> the company has recorded in a decade.",
        options: ["A. high", "B. higher", "C. highest", "D. highly"],
        answer: 2,
        explain: "Sau 'the' và phạm vi 'in a decade' → dùng tính từ so sánh nhất 'highest' → chọn C."
      }
    ]
  };

  /* Helper: get questions for any topicId (falls back to a curated TOEIC Part 5 mix if topic has fewer items) */
  function getQuestionsForTopic(topicId) {
    const specific = questionsByTopic[topicId] || [];
    const fallbackPool = [
      ...questionsByTopic[3],
      ...questionsByTopic[6],
      ...questionsByTopic[12],
      ...questionsByTopic[13],
      ...questionsByTopic[14]
    ];
    const combined = [...specific];
    for (const q of fallbackPool) {
      if (combined.length >= 6) break;
      if (!combined.some((item) => item.sentence === q.sentence)) {
        combined.push(q);
      }
    }
    return combined.map((q, idx) => ({ ...q, num: 101 + idx }));
  }

  return {
    topics,
    totalActivities: topics.reduce((sum, t) => sum + t.activities.length, 0),
    getTopicById(id) {
      const n = parseInt(id, 10) || 1;
      return topics.find((t) => t.id === n) || topics[0];
    },
    getQuestionsForTopic
  };
})();
