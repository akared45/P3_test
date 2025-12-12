import Bs1 from "@images/blog-bs1.png";
import Bs2 from "@images/bs2.png";
import Bs3 from "@images/khamtainha.png";
import Bs4 from "@images/bs4.png";
import Bs5 from "@images/bs5.png";
import Subimg from "@images/partern.png";
import Subimg2 from "@images/Vector123.png";

export const doctors = [
  // 1. NHI KHOA
  {
    name: "TS. BS Lê Ngọc Mai",
    specialty: "Nhi khoa",
    expertise: "Nhi khoa Hô hấp & Tiêu hóa - Bệnh viện Nhi Trung ương",
    description:
      "Chuyên gia Nhi khoa với 18 năm kinh nghiệm, chuyên sâu về các bệnh lý hô hấp, tiêu hóa, và dinh dưỡng trẻ em.",
    details: {
      training: [
        "Tiến sĩ Nhi khoa – Đại học Y Hà Nội (2020)",
        "Đào tạo chuyên sâu Hô hấp Nhi tại Úc",
        "Đào tạo nâng cao về Dinh dưỡng và Tiêu hóa Nhi tại Pháp",
      ],
      position: ["Trưởng khoa Hô hấp – Bệnh viện Nhi Trung ương"],
      experience: [
        "2007 - 2015: Bác sĩ điều trị – Khoa Hô hấp",
        "2015 - nay: Trưởng khoa Hô hấp – Bệnh viện Nhi Trung ương",
      ],
      specialties: [
        "Viêm phổi, hen phế quản",
        "Rối loạn tiêu hóa",
        "Tư vấn dinh dưỡng trẻ nhỏ",
        "Bệnh lý tai mũi họng trẻ em",
      ],
    },
  },

  // 2. TAI MŨI HỌNG
  {
    name: "PGS. TS. BS Hoàng Trung Kiên",
    specialty: "Tai Mũi Họng",
    expertise: "Tai Mũi Họng - Bệnh viện Tai Mũi Họng Trung ương",
    description:
      "Chuyên gia Tai Mũi Họng hàng đầu, chuyên phẫu thuật nội soi xoang.",
    details: {
      training: [
        "Phó Giáo sư, Tiến sĩ Tai Mũi Họng – Đại học Y Hà Nội",
        "Đào tạo Phẫu thuật Nội soi Xoang tại Hàn Quốc",
        "Đào tạo vi phẫu tai tại Bỉ",
      ],
      position: ["Phó Giám đốc Bệnh viện Tai Mũi Họng TƯ"],
      experience: [
        "2002 - 2015: Bác sĩ phẫu thuật",
        "2015 - nay: Phó Giám đốc Bệnh viện Tai Mũi Họng TƯ",
      ],
      specialties: [
        "Viêm xoang",
        "Viêm tai giữa",
        "Phẫu thuật nội soi xoang",
        "Rối loạn giấc ngủ",
      ],
    },
  },

  // 3. THẦN KINH
  {
    name: "TS. BS Nguyễn Đức Thuận",
    specialty: "Thần kinh",
    expertise: "Thần kinh - Bệnh viện Quân y 103",
    description:
      "Bác sĩ Thần kinh với hơn 14 năm kinh nghiệm trong điều trị Parkinson và các rối loạn thần kinh.",
    details: {
      training: [
        "Tiến sĩ Y khoa – Đại học Y Charité Berlin",
        "Đào tạo Thần kinh tại Romania",
        "Đào tạo lâm sàng Thần kinh tại Singapore",
      ],
      position: ["Phó Chủ nhiệm Khoa Thần kinh – BV Quân y 103"],
      experience: [
        "2010 - 2019: Bác sĩ điều trị & nghiên cứu sinh",
        "2019 - nay: Phó Chủ nhiệm Khoa Thần kinh",
      ],
      specialties: ["Parkinson", "Đau thần kinh", "Đột quỵ", "Động kinh"],
    },
  },

  // 4. HUYẾT HỌC
  {
    name: "ThS. BS Trần Đình Phúc",
    specialty: "Huyết học",
    expertise:
      "Huyết học và Truyền máu - Viện Huyết học và Truyền máu Trung ương",
    description:
      "Chuyên gia Huyết học với kinh nghiệm trong chẩn đoán và điều trị các bệnh lý máu.",
    details: {
      training: [
        "Thạc sĩ Huyết học – Đại học Y Hà Nội",
        "Đào tạo tại Thái Lan và Canada",
      ],
      position: ["Bác sĩ điều trị – Khoa Huyết học Lâm sàng"],
      experience: [
        "2015 - 2020: Bác sĩ xét nghiệm",
        "2020 - nay: Bác sĩ điều trị",
      ],
      specialties: [
        "Thiếu máu",
        "Thalassemia",
        "Rối loạn đông máu",
        "Bệnh bạch cầu",
      ],
    },
  },

  // 5. CƠ XƯƠNG KHỚP
  {
    name: "PGS. TS. BS Đào Hồng Lực",
    specialty: "Cơ xương khớp",
    expertise: "Cơ Xương Khớp - Bệnh viện Bạch Mai",
    description:
      "Chuyên gia đầu ngành về bệnh lý tự miễn, gout và thoái hóa khớp.",
    details: {
      training: [
        "Phó Giáo sư, Tiến sĩ Cơ xương khớp – Đại học Y Hà Nội",
        "Đào tạo tại Mỹ & Pháp",
      ],
      position: ["Phó Trưởng khoa Cơ xương khớp – BV Bạch Mai"],
      experience: [
        "2005 - 2012: Bác sĩ điều trị – BV E",
        "2012 - nay: Phó Trưởng khoa",
      ],
      specialties: [
        "Viêm khớp dạng thấp",
        "Gout",
        "Thoái hóa khớp",
        "Loãng xương",
      ],
    },
  },

  // ===== THÊM 10 BÁC SĨ MỚI =====

  {
    name: "TS. BS Phạm Quốc Anh",
    specialty: "Tim mạch",
    expertise: "Tim mạch - Viện Tim mạch Quốc gia",
    description: "Chuyên điều trị các bệnh lý tim mạch phức tạp.",
    details: {
      training: ["Tiến sĩ Tim mạch – Đại học Y Hà Nội"],
      position: ["Bác sĩ cao cấp – Viện Tim mạch"],
      experience: ["2010 - nay: Bác sĩ Tim mạch"],
      specialties: ["Tăng huyết áp", "Suy tim", "Rối loạn nhịp tim"],
    },
  },

  {
    name: "ThS. BS Nguyễn Thị Hạnh",
    specialty: "Da liễu",
    expertise: "Da liễu - Bệnh viện Da liễu Trung ương",
    description: "Chuyên gia điều trị da thẩm mỹ và bệnh da liễu.",
    details: {
      training: ["Thạc sĩ Da liễu – Đại học Y Hà Nội"],
      position: ["Bác sĩ Da liễu"],
      experience: ["2014 - nay"],
      specialties: ["Mụn", "Viêm da cơ địa", "Nám da"],
    },
  },

  {
    name: "BS CKII Lê Văn Dũng",
    specialty: "Ngoại tổng quát",
    expertise: "Ngoại tổng quát - Bệnh viện Việt Đức",
    description: "Chuyên gia phẫu thuật ổ bụng.",
    details: {
      training: ["CKII Ngoại tổng quát"],
      position: ["Bác sĩ phẫu thuật"],
      experience: ["2008 - nay"],
      specialties: ["Cắt ruột thừa", "Thoát vị", "Sỏi mật"],
    },
  },

  {
    name: "TS. BS Đỗ Minh Quân",
    specialty: "Tiêu hóa",
    expertise: "Tiêu hóa - Bệnh viện Đại học Y",
    description: "Chuyên sâu về nội soi tiêu hóa.",
    details: {
      training: ["Tiến sĩ Tiêu hóa"],
      position: ["Trưởng khoa Nội soi"],
      experience: ["2012 - nay"],
      specialties: ["Viêm dạ dày", "Trào ngược", "Polyp đại tràng"],
    },
  },

  {
    name: "BS Nguyễn Hoài Nam",
    specialty: "Nam khoa",
    expertise: "Nam học - Bệnh viện Bình Dân",
    description: "Chuyên điều trị vô sinh nam.",
    details: {
      training: ["CKI Nam khoa"],
      position: ["Bác sĩ Nam học"],
      experience: ["2015 - nay"],
      specialties: ["Yếu sinh lý", "Vô sinh nam"],
    },
  },

  {
    name: "BS Trần Thị Lan",
    specialty: "Sản phụ khoa",
    expertise: "Sản - Bệnh viện Từ Dũ",
    description: "Theo dõi thai kỳ nguy cơ cao.",
    details: {
      training: ["CKI Sản phụ khoa"],
      position: ["Bác sĩ sản"],
      experience: ["2013 - nay"],
      specialties: ["Thai kỳ nguy cơ", "Sinh mổ"],
    },
  },

  {
    name: "TS. BS Hoàng Minh Tuấn",
    specialty: "Ung bướu",
    expertise: "Ung bướu - Bệnh viện K",
    description: "Chuyên gia điều trị ung thư hóa xạ trị.",
    details: {
      training: ["Tiến sĩ Ung bướu"],
      position: ["Trưởng khoa Xạ trị"],
      experience: ["2010 - nay"],
      specialties: ["Ung thư phổi", "Ung thư gan"],
    },
  },

  {
    name: "BS Võ Thanh Tùng",
    specialty: "Chấn thương chỉnh hình",
    expertise: "Chấn thương chỉnh hình - Bệnh viện 175",
    description: "Phẫu thuật xương khớp và phục hồi vận động.",
    details: {
      training: ["CKI Chấn thương chỉnh hình"],
      position: ["Bác sĩ phẫu thuật"],
      experience: ["2014 - nay"],
      specialties: ["Gãy xương", "Thoái hóa khớp"],
    },
  },

  {
    name: "TS. BS Lưu Thị Thu",
    specialty: "Nội tiết",
    expertise: "Nội tiết - Bệnh viện Nội tiết Trung ương",
    description: "Chuyên gia điều trị đái tháo đường.",
    details: {
      training: ["Tiến sĩ Nội tiết"],
      position: ["Trưởng khoa"],
      experience: ["2009 - nay"],
      specialties: ["Tiểu đường", "Bướu giáp"],
    },
  },

  {
    name: "BS Nguyễn Quốc Bảo",
    specialty: "Hô hấp",
    expertise: "Hô hấp - Bệnh viện Phổi Trung ương",
    description: "Chuyên điều trị bệnh phổi mạn tính.",
    details: {
      training: ["CKI Hô hấp"],
      position: ["Bác sĩ điều trị"],
      experience: ["2016 - nay"],
      specialties: ["COPD", "Viêm phổi"],
    },
  },
];

export const introData = [
  {
    title: "Đội ngũ bác sĩ",
    description:
      "Đội ngũ bác sĩ tâm huyết, có trình độ chuyên môn cao và nhiều năm kinh nghiệm đang công tác tại các bệnh viện lớn Trung ương & Hà Nội.",
    img: Bs5,
    flexDirection: true,
    buttons: [
      { content: "Bác sĩ Doctor4U", variant: "contained" },
      { content: "Bác sĩ Hà Nội" },
      { content: "Chuyên khoa", variant: "outlined" },
    ],
  },
  {
    title: "Tư vấn trực tuyến",
    description:
      "Bạn bận rộn và không sắp xếp được thời gian tới khám trong khi cần tư vấn với bác sỹ chuyên khoa? Doctor4U giúp bạn kết nối với bác sỹ dù bạn đang ở đâu với khung giờ linh hoạt.",
    img: Bs2,
    flexDirection: false,
    subimg: Subimg,
    buttons: [{ content: "Các chuyên khoa" }],
  },
  {
    title: "Khám bệnh tại nhà",
    description:
      "Khám bệnh tại nhà hay còn gọi là bác sĩ gia đình là dịch vụ thăm khám, chăm sóc và quản lý sức khỏe của từng thành viên trong gia đình. Với đội ngũ bác sĩ được đào tạo bài bản, có nhiều năm kinh nghiệm, sự tận tâm, trách nhiệm và luôn hết lòng vì người bệnh, Doctor4U giúp mỗi gia đình an tâm theo dõi và chăm sóc sức khỏe cho từng cá nhân.",
    img: Bs3,
    flexDirection: true,
    buttons: [{ content: "Chi tiết" }],
  },
  {
    title: "Chăm sóc bệnh mãn tính",
    description:
      "Bạn cần bác sỹ chuyên khoa tư vấn khi gặp các vấn đề sức khỏe? Doctor4U là bác sỹ gia đình của bạn, cùng bạn theo dõi, chăm sóc bệnh mãn tính với đội ngũ bác sỹ chuyên khoa giàu kinh nghiệm.",
    img: Bs4,
    flexDirection: false,
    subimg: Subimg2,
    buttons: [{ content: "Liên hệ ngay" }, { content: "Xem thêm" }],
  },
];
