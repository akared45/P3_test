const MOCK_USERS = {
  // Người dùng hiện tại (Current User)
  user_1: {
    id: "user_1",
    username: "Vinh Béo",
    avatarUrl: "/avatars/vinh_beo.jpg",
  },
  // Người dùng A (Moderator/Admin)
  user_2: {
    id: "user_2",
    username: "SW (Bò)",
    avatarUrl: "/avatars/sw_bo.jpg",
  },
  // Người dùng B
  user_3: {
    id: "user_3",
    username: "Hỗ Trợ",
    avatarUrl: "/avatars/support.jpg",
  },
};

const MOCK_THREAD_LIST = [
  {
    id: "thread_1",
    title: "Lỗi LND Launcher (như danh dưới đây)",
    senderId: "user_2", // SW (Bò)
    lastReplyTime: "tuần trước", // Có thể dùng timestamp thực
    excerpt:
      "Lỗi LND Launcher (như danh dưới đây) các bạn làm theo hướng dẫn ...",
    isRead: false,
  },
  {
    id: "thread_2",
    title: 'Vấn đề về lỗi "The operation was canceled by the user"',
    senderId: "user_2", // SW (Bò)
    lastReplyTime: "5 tháng trước",
    excerpt:
      'Vấn đề về lỗi "The operation was canceled by the user" đã có hướng dẫn ...',
    isRead: true,
  },
  {
    id: "thread_3",
    title: "Đề tài toàn bộ link google/VIP",
    senderId: "user_2", // SW (Bò)
    lastReplyTime: "8 tháng trước",
    excerpt: "Đề tài toàn bộ link google/VIP thế mọi người, splua...",
    isRead: true,
  },
];

const MOCK_THREAD_DETAILS = {
  thread_2: {
    id: "thread_2",
    title: 'Vấn đề về lỗi "The operation was canceled by the user"',
    posts: [
      // Bài viết/Comment 1 - SW (Bò)
      {
        postId: "post_2_1",
        senderId: "user_2", // SW (Bò)
        time: "5 tháng trước",
        content: [
          'Vấn đề về lỗi **"The operation was canceled by the user"** đã có hướng dẫn được xử lý bởi người dùng.',
          "Nọi người xem link này:",
          {
            type: "link",
            url: "https://linkneverdie.top/thread/vấn-đề-về-lỗi-the-operation-was-canceled-by-the-user-đã-có-hướng-dẫn-được-xử-lý-bởi-người-dùng-25320",
            text: "https://linkneverdie.top/thread/vấn-đề-về-lỗi-the-operation-was-canceled-by-the-user-đã-có-hướng-dẫn-được-xử-lý-bởi-người-dùng-25320",
          },
        ],
        isSupport: true, // Đánh dấu đây là bài viết hỗ trợ/admin
      },
      // Bài viết/Comment 2 - SW (Bò)
      {
        postId: "post_2_2",
        senderId: "user_2", // SW (Bò)
        time: "5 tháng trước",
        content: [
          'Vấn đề về lỗi **"The operation was canceled by the user"** đã có hướng dẫn được xử lý bởi người dùng.',
          "Đây là bài viết mới nhất.",
        ],
        isSupport: true,
      },
      // Bài viết/Comment 3 - SW (Bò)
      {
        postId: "post_2_3",
        senderId: "user_2", // SW (Bò)
        time: "5 tháng trước",
        content: ["Đề tài toàn bộ link google/VIP thế mọi người, splua..."],
        isSupport: true,
      },
    ],
  },

  // Bạn có thể thêm chi tiết cho 'thread_1' và 'thread_3' nếu cần...
};
