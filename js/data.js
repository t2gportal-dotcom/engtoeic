/* Course structure & "Từ vựng TOEIC" metadata (23 Lists) */
window.BT_TOEIC_DATA = {
  course: {
    id: 28,
    title: "Complete TOEIC",
    menus: [
      { id: "vocab-toeic", title: "Từ vựng TOEIC", implemented: true },
      { id: "grammar-toeic", title: "Ngữ pháp TOEIC", implemented: false },
      { id: "part-1", title: "Part 1: Photographs - Nghe tranh", implemented: false },
      { id: "part-2", title: "Part 2: Question - Response - Hỏi - đáp", implemented: false },
      { id: "part-3", title: "Part 3: Conversations - Nghe hiểu đối thoại", implemented: false },
      { id: "part-4", title: "Part 4: Talks - Nghe hiểu bài nói", implemented: false },
      { id: "part-5", title: "Part 5: Incomplete Sentences - Điền từ vào câu", implemented: false },
      { id: "part-6", title: "Part 6: Text Completion - Điền từ vào đoạn văn", implemented: false },
      { id: "part-7", title: "Part 7: Reading Comprehension - Đọc hiểu văn bản", implemented: false },
      { id: "dictation-toeic", title: "Luyện nghe chép chính tả TOEIC", implemented: false },
      { id: "review-flashcards", title: "Ôn tập Flashcards", implemented: false },
      { id: "renew-account", title: "Gia hạn tài khoản", implemented: false }
    ]
  },

  /* 6 standard activities inside each List 1..23 */
  activityTemplates: [
    { key: "flashcards", prefix: "Từ vựng:", label: "Flashcards", icon: "note" },
    { key: "quiz", prefix: "Luyện tập:", label: "Trắc nghiệm từ vựng", icon: "pencil" },
    { key: "matching", prefix: "Luyện tập:", label: "Tìm cặp", icon: "pencil" },
    { key: "listening", prefix: "Luyện tập:", label: "Nghe từ vựng", icon: "pencil" },
    { key: "translation", prefix: "Luyện tập:", label: "Dịch nghĩa / Điền từ", icon: "pencil" },
    { key: "dictation", prefix: "Luyện tập:", label: "Nghe chính tả", icon: "pencil" }
  ],

  /* Initial completed IDs (empty by default — 0/138) */
  defaultCompletedIds: [],

  /* Build all 23 Lists attached to the real extracted BT_TOEIC_VOCAB_DATA */
  buildVocabLists() {
    const vocabMap = window.BT_TOEIC_VOCAB_DATA || {};
    const lists = [];
    for (let i = 1; i <= 23; i++) {
      const vocabEntry = vocabMap[i] || { words: [], wordCount: 0 };
      lists.push({
        id: `list-${i}`,
        number: i,
        title: `List ${i}`,
        wordCount: vocabEntry.wordCount || (vocabEntry.words ? vocabEntry.words.length : 0),
        words: vocabEntry.words || [],
        activities: this.activityTemplates.map((tpl) => ({
          id: `list-${i}:${tpl.key}`,
          listNumber: i,
          listTitle: `List ${i}`,
          ...tpl
        }))
      });
    }
    return lists;
  }
};
