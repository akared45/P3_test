export const doctors = [
  {
    id: 1,
    name: "TS.BS Nguyễn Minh Hùng",
    specialty: "Tim mạch",
    experience: 20,
    rating: 4.8,
    hospital: "Bệnh viện Bạch Mai",
    avatar: "https://i.pravatar.cc/300?img=12",
    shortDesc:
      "Bác sĩ tim mạch với hơn 20 năm kinh nghiệm điều trị bệnh lý tim mạch phức tạp.",
    fullDesc: `
- Tốt nghiệp Tiến sĩ Y khoa tại ĐH Y Hà Nội  
- 20 năm kinh nghiệm điều trị bệnh tim mạch  
- Thành viên Hội Tim mạch Việt Nam  
- Giảng viên Bộ môn Nội Tim Mạch  
    `,
  },
  {
    id: 2,
    name: "BSCKII Trần Thị Lan",
    specialty: "Da liễu",
    experience: 15,
    rating: 4.6,
    hospital: "Bệnh viện Da Liễu TW",
    avatar: "https://i.pravatar.cc/300?img=20",
    shortDesc:
      "Chuyên gia da liễu điều trị mụn, nám và bệnh lý da liễu lâu năm.",
    fullDesc: `
- 15 năm kinh nghiệm điều trị các bệnh da liễu  
- Chứng chỉ Laser thẩm mỹ Hàn Quốc  
- Thành viên Hội Da Liễu Việt Nam  
    `,
  },
  {
    id: 3,
    name: "PGS.BS Lê Văn Khánh",
    specialty: "Thần kinh",
    experience: 22,
    rating: 4.9,
    hospital: "Bệnh viện Chợ Rẫy",
    avatar: "https://i.pravatar.cc/300?img=30",
    shortDesc: "Chuyên khoa thần kinh, điều trị đau đầu, mất ngủ và tai biến.",
    fullDesc: `
- 22 năm kinh nghiệm khám chữa bệnh thần kinh  
- Chuyên gia điều trị tai biến  
- Giảng viên bộ môn Thần kinh ĐH Y Dược  
    `,
  },
];

// Thêm 37 bác sĩ nữa để tổng là 40+
for (let i = 4; i <= 60; i++) {
  doctors.push({
    id: i,
    name: `BS Nguyễn Văn ${i}`,
    specialty: ["Tim mạch", "Da liễu", "Thần kinh", "Nhi khoa", "Răng hàm mặt"][
      i % 5
    ],
    experience: 5 + (i % 20),
    rating: (3 + (i % 3) * 0.5).toFixed(1), // 3.0, 3.5, 4.0
    hospital: `Bệnh viện ${i}`,
    avatar: `https://i.pravatar.cc/300?img=${i + 10}`,
    shortDesc: `Bác sĩ chuyên khoa với kinh nghiệm ${5 + (i % 20)} năm.`,
    fullDesc: `
- Kinh nghiệm ${5 + (i % 20)} năm trong chuyên khoa  
- Hoạt động tại ${["Bệnh viện A", "Bệnh viện B", "Bệnh viện C"][i % 3]}  
- Thành viên hội chuyên môn  
    `,
  });
}
