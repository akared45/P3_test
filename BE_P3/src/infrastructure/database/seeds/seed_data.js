const bcrypt = require('bcryptjs');
const hash = (p) => bcrypt.hashSync(p, 10);

// ================= SPECIALIZATIONS =================
exports.specializations = [
    {
        _id: "CARD",
        name: "Tim mạch",
        category: "INTERNAL",
        isDeleted: false,
        deletedAt: null
    },
    {
        _id: "NEURO",
        name: "Thần kinh",
        category: "INTERNAL",
        isDeleted: false,
        deletedAt: null
    },
    {
        _id: "GASTRO",
        name: "Tiêu hóa",
        category: "INTERNAL",
        isDeleted: false,
        deletedAt: null
    },
    {
        _id: "PULMO",
        name: "Hô hấp",
        category: "INTERNAL",
        isDeleted: false,
        deletedAt: null
    },
    {
        _id: "ENDO",
        name: "Nội tiết",
        category: "INTERNAL",
        isDeleted: false,
        deletedAt: null
    },
    {
        _id: "DERMA",
        name: "Da liễu",
        category: "EXTERNAL",
        isDeleted: false,
        deletedAt: null
    },
    {
        _id: "PEDIA",
        name: "Nhi khoa",
        category: "PEDIATRIC",
        isDeleted: false,
        deletedAt: null
    },
    {
        _id: "OBGYN",
        name: "Sản phụ khoa",
        category: "WOMEN",
        isDeleted: false,
        deletedAt: null
    },
    {
        _id: "PSYCH",
        name: "Tâm thần",
        category: "MENTAL",
        isDeleted: false,
        deletedAt: null
    },
    {
        _id: "ORTHO",
        name: "Chỉnh hình",
        category: "SURGICAL",
        isDeleted: false,
        deletedAt: null
    }
];


// ================= MEDICATIONS =================
exports.medications = [
    {
        code: "PARA500",
        name: "Paracetamol 500mg",
        genericName: "Paracetamol",
        drugClass: "GIẢM ĐAU, HẠ SỐT",
        isDeleted: false,
        safety: {
            allergens: ["Paracetamol"],
            contraindications: ["Suy gan nặng", "Quá mẫn cảm với paracetamol"]
        },
        usage: {
            instructions: "1-2 viên mỗi liều, cách mỗi 4-6 giờ. Không dùng quá 4g mỗi ngày. Uống sau khi ăn.",
            sideEffects: ["Phát ban da", "Buồn nôn", "Thay đổi men gan"]
        }
    },
    {
        code: "IBU400",
        name: "Ibuprofen 400mg",
        genericName: "Ibuprofen",
        drugClass: "KHÁNG VIÊM KHÔNG STEROID (NSAID)",
        isDeleted: false,
        safety: {
            allergens: ["Ibuprofen", "Aspirin"],
            contraindications: ["Loét dạ dày tá tràng", "Suy tim nặng", "Ba tháng cuối thai kỳ"]
        },
        usage: {
            instructions: "1 viên mỗi liều, 3 lần mỗi ngày. Phải uống sau khi ăn với nhiều nước.",
            sideEffects: ["Đau dạ dày", "Ợ nóng", "Chóng mặt"]
        }
    },
    {
        code: "AMOX500",
        name: "Amoxicillin 500mg",
        genericName: "Amoxicillin",
        drugClass: "KHÁNG SINH",
        isDeleted: false,
        safety: {
            allergens: ["Penicillin", "Amoxicillin"],
            contraindications: ["Tăng bạch cầu đơn nhân nhiễm khuẩn", "Tiền sử dị ứng penicillin"]
        },
        usage: {
            instructions: "1 viên mỗi 8 giờ (3 lần một ngày). Phải uống hết liệu trình ngay cả khi đã cảm thấy khỏe hơn.",
            sideEffects: ["Tiêu chảy", "Buồn nôn", "Tưa miệng/Nấm miệng"]
        }
    },
    {
        code: "OMEP20",
        name: "Omeprazole 20mg",
        genericName: "Omeprazole",
        drugClass: "THUỐC ỨC CHẾ BƠM PROTON (PPI)",
        isDeleted: false,
        safety: {
            allergens: ["Omeprazole"],
            contraindications: ["Sử dụng đồng thời với nelfinavir"]
        },
        usage: {
            instructions: "1 viên mỗi ngày, tốt nhất là vào buổi sáng 30 phút trước khi ăn sáng.",
            sideEffects: ["Đau đầu", "Đau bụng", "Đầy hơi"]
        }
    },
    {
        code: "METF850",
        name: "Metformin 850mg",
        genericName: "Metformin",
        drugClass: "THUỐC ĐIỀU TRỊ TIỂU ĐƯỜNG",
        isDeleted: false,
        safety: {
            allergens: ["Metformin"],
            contraindications: ["Suy thận (eGFR < 30)", "Nhiễm toan chuyển hóa cấp tính"]
        },
        usage: {
            instructions: "1 viên x 2 lần mỗi ngày. Uống trong hoặc sau bữa ăn để giảm tác dụng phụ lên dạ dày.",
            sideEffects: ["Vị kim loại trong miệng", "Nhiễm toan lactic (hiếm gặp)", "Thiếu hụt Vitamin B12"]
        }
    },
    {
        code: "ATOR20",
        name: "Atorvastatin 20mg",
        genericName: "Atorvastatin",
        drugClass: "STATIN (THUỐC HẠ MỠ MÁU)",
        isDeleted: false,
        safety: {
            allergens: ["Atorvastatin"],
            contraindications: ["Bệnh gan đang tiến triển", "Phụ nữ mang thai", "Phụ nữ đang cho con bú"]
        },
        usage: {
            instructions: "1 viên một lần mỗi ngày. Có thể uống vào bất kỳ thời điểm nào trong ngày, cùng hoặc không cùng thức ăn.",
            sideEffects: ["Đau cơ", "Đau khớp", "Triệu chứng cảm lạnh thông thường"]
        }
    },
    {
        code: "CETI10",
        name: "Cetirizine 10mg",
        genericName: "Cetirizine",
        drugClass: "THUỐC KHÁNG HISTAMINE",
        isDeleted: false,
        safety: {
            allergens: ["Cetirizine", "Hydroxyzine"],
            contraindications: ["Suy thận nặng (CrCl < 10ml/phút)"]
        },
        usage: {
            instructions: "1 viên mỗi ngày. Có thể gây buồn ngủ ở một số bệnh nhân.",
            sideEffects: ["Ngủ gật", "Mệt mỏi", "Khô miệng"]
        }
    }
];

exports.userSeeds = () => {
    const baseDate = new Date("2024-01-01T10:00:00Z");
    const patients = [];
    const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ"];
    const middleNames = ["Văn", "Thị", "Hữu", "Minh", "Thanh", "Hoài", "Kim", "Ngọc", "Xuân", "Thu"];
    const lastNames = ["An", "Bình", "Cường", "Dũng", "Giang", "Hải", "Khoa", "Long", "Nam", "Phúc"];
    for (let i = 1; i <= 10; i++) {
        const patientNum = i.toString().padStart(2, '0');
        const firstName = firstNames[(i - 1) % firstNames.length];
        const middleName = middleNames[(i - 1) % middleNames.length];
        const lastName = lastNames[(i - 1) % lastNames.length];
        const fullName = `${firstName} ${middleName} ${lastName}`;
        const emailUsername = fullName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '')
            + "@email.com";

        patients.push({
            _id: `PAT${patientNum}`,
            username: `patient${patientNum}`,
            email: emailUsername,
            passwordHash: hash("123456"),
            userType: "patient",
            isActive: true,
            isEmailVerified: true,
            createdAt: new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000),
            isDeleted: i === 9,
            deletedAt: i === 9 ? new Date("2024-06-15T14:30:00Z") : null,
            isEmailVerified: true,
            profile: {
                fullName: fullName,
                dateOfBirth: new Date(1990 - (i % 10), (i % 12), 15),
                gender: i % 2 === 0 ? "Female" : "Male",
                avatarUrl: `/avatars/patient${patientNum}.jpg`,
                address: `Số ${i * 10}, Đường ${lastName}, Quận ${i}, TP.HCM`,
                bloodType: ["A", "B", "AB", "O"][i % 4],
                height: 160 + (i % 20),
                weight: 50 + (i % 15)
            },
            contacts: [
                { type: "phone", value: `0987${10000 + i}`, isPrimary: true },
                { type: "email", value: emailUsername, isPrimary: true }
            ],
            medicalConditions: [
                {
                    name: i % 3 === 0 ? "Tiểu đường type 2" :
                        i % 3 === 1 ? "Cao huyết áp" : "Hen suyễn",
                    diagnosedDate: new Date(2020 - (i % 5), (i % 12), 15),
                    status: i % 2 === 0 ? "chronic" : "controlled",
                    treatmentPlan: i % 3 === 0 ? "Kiểm soát bằng Metformin" :
                        i % 3 === 1 ? "Thuốc huyết áp hàng ngày" : "Xịt Ventolin khi cần",
                    notes: `Theo dõi định kỳ ${i} tháng/lần`
                }
            ],
            allergies: [
                {
                    name: i % 2 === 0 ? "Penicillin" : "Sulfa",
                    severity: i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low",
                    reaction: i % 2 === 0 ? "Sốc phản vệ" : "Phát ban",
                    notes: "Tránh sử dụng"
                }
            ],
            emergencyContacts: [
                {
                    name: `Trần Thị ${String.fromCharCode(64 + i)}`,
                    relationship: i % 2 === 0 ? "Vợ" : "Chồng",
                    phone: `0909${20000 + i}`,
                    isPrimary: true
                }
            ]
        });
    }

    const doctors = [];
    const doctorFirstNames = ["Lê", "Trần", "Nguyễn", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ"];
    const doctorMiddleNames = ["Văn", "Thị", "Hữu", "Minh", "Thanh", "Anh", "Xuân", "Kim", "Ngọc", "Thu"];
    const doctorLastNames = ["An", "Bình", "Châu", "Dũng", "Giang", "Hải", "Khoa", "Long", "Nam", "Phúc"];
    const doctorSpecNames = ["Tim mạch", "Thần kinh", "Tiêu hóa", "Hô hấp", "Nội tiết",
        "Da liễu", "Nhi khoa", "Sản phụ khoa", "Tâm thần", "Chỉnh hình"];

    for (let i = 1; i <= 10; i++) {
        const docNum = i.toString().padStart(2, '0');
        const specializations = ["CARD", "NEURO", "GASTRO", "PULMO", "ENDO",
            "DERMA", "PEDIA", "OBGYN", "PSYCH", "ORTHO"];

        const firstName = doctorFirstNames[i - 1];
        const middleName = doctorMiddleNames[i - 1];
        const lastName = doctorLastNames[i - 1];
        const fullName = `${firstName} ${middleName} ${lastName}`;
        const emailUsername = fullName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '')
            + "@email.com";
        const specName = doctorSpecNames[i - 1];

        doctors.push({
            _id: `DOC${docNum}`,
            username: `doctor${docNum}`,
            email: emailUsername,
            passwordHash: hash("123456"),
            isEmailVerified: true,
            userType: "doctor",
            isActive: i !== 8,
            createdAt: new Date(baseDate.getTime() + i * 2 * 24 * 60 * 60 * 1000),
            isDeleted: i === 7,
            deletedAt: i === 7 ? new Date("2024-08-20T09:15:00Z") : null,
            profile: {
                fullName: `BS. ${fullName}`,
                dateOfBirth: new Date(1980 - (i % 10), (i % 12), 10),
                gender: i % 3 === 0 ? "Male" : "Female",
                avatarUrl: `/avatars/doctor${docNum}.jpg`,
                address: `Số ${i * 20}, Đường ${lastName}, Quận ${(i % 8) + 1}, TP.HCM`,
                phone: `0985${20000 + i}`,
                bio: `Chuyên gia ${i % 2 === 0 ? 'hàng đầu' : 'có uy tín'} về ${specName.toLowerCase()}`
            },
            bio: `Chuyên gia về ${specName} với ${10 + i} năm kinh nghiệm. Tốt nghiệp xuất sắc và có nhiều đóng góp trong lĩnh vực chuyên môn.`,
            licenseNumber: `BS-${10000 + i}`,
            specCode: specializations[i - 1],
            specName: specName,
            yearsExperience: 10 + i,
            rating: 4.0 + (i * 0.08),
            reviewCount: i * 15,
            isEmailVerified: true,
            schedules: [
                {
                    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i % 5],
                    start: "08:00",
                    end: "12:00",
                    maxPatients: 10,
                    sessionType: "morning"
                },
                {
                    day: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i % 5],
                    start: "13:00",
                    end: "17:00",
                    maxPatients: 8,
                    sessionType: "afternoon"
                }
            ],
            qualifications: [
                {
                    degree: "Bác sĩ Đa khoa",
                    institution: `Đại học Y Hà Nội`,
                    year: 2000 + (i % 5),
                    specialization: specName
                },
                {
                    degree: `Thạc sĩ ${specName}`,
                    institution: `Đại học Y Dược TP.HCM`,
                    year: 2005 + (i % 5)
                },
                i % 3 === 0 ? {
                    degree: `Tiến sĩ ${specName}`,
                    institution: `Đại học Y khoa Phạm Ngọc Thạch`,
                    year: 2010 + (i % 5)
                } : null
            ].filter(q => q !== null),
            workHistory: [
                {
                    position: "Bác sĩ nội trú",
                    place: `Bệnh viện ${["Bạch Mai", "Chợ Rẫy", "Vinmec", "Hòa Hảo", "115"][i % 5]}`,
                    from: new Date(2005, 0, 1),
                    to: new Date(2010, 0, 1),
                    department: specName
                },
                {
                    position: `Trưởng khoa ${specName}`,
                    place: `Bệnh viện ${["Chợ Rẫy", "Bạch Mai", "115", "Vinmec", "Đại học Y Dược"][i % 5]}`,
                    from: new Date(2010, 1, 1),
                    to: null,
                    department: specName
                }
            ],
            contacts: [
                { type: "phone", value: `0985${20000 + i}`, isPrimary: true },
                { type: "email", value: emailUsername, isPrimary: true },
                { type: "emergency", value: `0908${30000 + i}`, isPrimary: false }
            ]
        });
    }

    const admins = [];
    for (let i = 1; i <= 3; i++) {
        admins.push({
            _id: `ADM${i.toString().padStart(2, '0')}`,
            username: `admin${i}`,
            email: `admin${i}@telemedicine.com`,
            passwordHash: hash(`admin${i}123`),
            userType: "admin",
            isEmailVerified: true,
            isActive: true,
            createdAt: new Date(baseDate.getTime() + i * 3 * 24 * 60 * 60 * 1000),
            isDeleted: i === 3,
            deletedAt: i === 3 ? new Date("2024-10-05T16:45:00Z") : null,
            profile: {
                fullName: `Quản trị viên ${i}`,
                gender: i % 2 === 0 ? "Female" : "Male",
                avatarUrl: `/avatars/admin${i}.jpg`,
                department: i === 1 ? "Technical" : i === 2 ? "Medical" : "Customer Support"
            }
        });
    }

    return [...patients, ...doctors, ...admins];
};

// ================= APPOINTMENTS =================
exports.appointmentSeeds = (function () {
    const appointments = [];
    const baseDate = new Date("2024-01-15T09:00:00Z");
    const statuses = ["completed", "confirmed", "pending", "cancelled"];
    const types = ["video", "in_person", "phone", "chat"];
    for (let i = 1; i <= 10; i++) {
        const appNum = i.toString().padStart(3, '0');
        const patientNum = (i % 10 || 10).toString().padStart(2, '0');
        const doctorNum = ((i % 10) + 1).toString().padStart(2, '0');
        const appointmentDate = new Date(baseDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);

        appointments.push({
            _id: `APP${appNum}`,
            patientId: `PAT${patientNum}`,
            doctorId: `DOC${doctorNum}`,
            type: types[i % types.length],
            appointmentDate: appointmentDate,
            durationMinutes: i % 3 === 0 ? 15 : i % 3 === 1 ? 30 : 45,

            status: statuses[i % statuses.length],

            calculatedFee: 50000,

            symptoms: ["Đau đầu, sốt", "Ho, khó thở", "Đau bụng, buồn nôn",
                "Đau ngực", "Mất ngủ, lo âu", "Đau khớp", "Ngứa da",
                "Mệt mỏi kéo dài", "Chóng mặt", "Đau lưng"][i - 1],

            doctorNotes: i % 2 === 0 ? "Bệnh nhân cần nghỉ ngơi" : "Đã kê đơn thuốc",

            createdAt: new Date(appointmentDate.getTime() - 5 * 24 * 60 * 60 * 1000),

            symptomDetails: [
                {
                    name: ["Đau đầu", "Sốt"][i % 2],
                    severity: "medium",
                    durationDays: i
                }
            ],
            prescriptions: [
                {
                    medicationCode: "PARA500",
                    dosage: "1 viên",
                    frequency: "3 lần/ngày",
                    duration: "5 ngày"
                }
            ],

        });
    }

    return appointments;
})();
exports.messageSeeds = (function () {
    const messages = [];
    const baseDate = new Date("2024-01-15T09:00:00Z");

    for (let i = 1; i <= 10; i++) {
        const appNum = i.toString().padStart(3, '0');
        const patientNum = (i % 10 || 10).toString().padStart(2, '0');
        const doctorNum = ((i % 10) + 1).toString().padStart(2, '0');

        const appointmentDate = new Date(baseDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);

        messages.push({
            _id: `MSG${i.toString().padStart(3, '0')}A`,
            appointmentId: `APP${appNum}`,
            senderId: `PAT${patientNum}`,
            type: "text",
            content: `Xin chào bác sĩ, tôi có triệu chứng khó chịu ở ${["đầu", "bụng", "ngực"][i % 3]}`,
            isRead: true,
            createdAt: new Date(appointmentDate.getTime() - 60 * 60 * 1000)
        });

        messages.push({
            _id: `MSG${i.toString().padStart(3, '0')}B`,
            appointmentId: `APP${appNum}`,
            senderId: `DOC${doctorNum}`,
            type: "text",
            content: "Chào bạn, tôi đã nhận được thông tin. Bạn chờ chút nhé.",
            isRead: true,
            createdAt: new Date(appointmentDate.getTime() - 30 * 60 * 1000)
        });
    }

    return messages;
})();
// ================= NOTIFICATIONS =================
exports.notificationSeeds = (function () {
    const notifications = [];
    const baseDate = new Date("2024-01-14T09:00:00Z");
    const notificationTypes = ["appointment_reminder", "prescription_ready",
        "test_result", "payment_confirmation", "system_alert"];

    for (let i = 1; i <= 10; i++) {
        const notifNum = i.toString().padStart(3, '0');
        const patientNum = (i % 10 || 10).toString().padStart(2, '0');
        const doctorNum = ((i % 10) + 1).toString().padStart(2, '0');

        notifications.push({
            _id: `NOT${notifNum}`,
            userId: i % 3 === 0 ? `DOC${doctorNum}` : `PAT${patientNum}`,
            
            type: notificationTypes[i % notificationTypes.length],
            title: ["Lịch hẹn sắp tới", "Đơn thuốc đã sẵn sàng", "Kết quả xét nghiệm",
                "Xác nhận thanh toán", "Cảnh báo hệ thống"][i % 5],
            message: i % 3 === 0 ?
                `Bác sĩ có lịch hẹn với bệnh nhân PAT${patientNum} vào ${9 + (i % 4)}:00 ngày ${15 + i}/01` :
                `Bạn có lịch hẹn với BS. ${["Trần", "Lê", "Nguyễn", "Phạm", "Hoàng"][i % 5]} vào ${9 + (i % 4)}:00 ngày ${15 + i}/01`,
            read: i % 4 === 0,
            priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low",
            createdAt: new Date(baseDate.getTime() + i * 3 * 60 * 60 * 1000),
            expiresAt: new Date(baseDate.getTime() + (i + 2) * 24 * 60 * 60 * 1000),
            relatedEntity: {
                type: i % 2 === 0 ? "appointment" : "prescription",
                id: i % 2 === 0 ? `APP${i.toString().padStart(3, '0')}` : `RX${i}`
            },
            actions: i % 3 === 0 ? [
                { label: "Xem chi tiết", url: `/appointments/APP${i.toString().padStart(3, '0')}` },
                { label: "Hủy lịch", url: `/appointments/APP${i.toString().padStart(3, '0')}/cancel` }
            ] : [
                { label: "Xem đơn thuốc", url: `/prescriptions/RX${i}` }
            ]
        });
    }

    return notifications;
})();

// ================= USER SESSIONS =================
exports.userSessions = (function () {
    const sessions = [];
    const baseDate = new Date("2024-01-08T10:00:00Z");

    for (let i = 1; i <= 10; i++) {
        const sessNum = i.toString().padStart(3, '0');
        const userId = i % 3 === 0 ? `DOC${((i % 10) + 1).toString().padStart(2, '0')}` :
            i % 3 === 1 ? `PAT${(i % 10 || 10).toString().padStart(2, '0')}` :
                `ADM${Math.ceil(i / 3).toString().padStart(2, '0')}`;

        sessions.push({
            _id: `SESS${sessNum}`,
            userId: userId,
            refreshToken: `refresh_token_${userId}_${Date.now()}_${i}`,
            deviceInfo: {
                userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${90 + (i % 10)}.0.0.0 Safari/537.36`,
                ipAddress: `192.168.1.${i}`,
                deviceType: i % 3 === 0 ? "mobile" : i % 3 === 1 ? "desktop" : "tablet",
                os: i % 2 === 0 ? "Windows" : "iOS"
            },
            loginAt: new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000),
            expiresAt: new Date(baseDate.getTime() + (i + 30) * 24 * 60 * 60 * 1000),
            lastActivityAt: new Date(baseDate.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
            revoked: i % 10 === 0,
            revokedAt: i % 10 === 0 ? new Date(baseDate.getTime() + (i + 5) * 24 * 60 * 60 * 1000) : null,
            revocationReason: i % 10 === 0 ? "user_logout" : null
        });
    }

    return sessions;
})();

// ================= ADDITIONAL DATA =================

// Medical Tests
exports.medicalTests = (function () {
    const tests = [];
    const testTypes = ["blood_test", "urine_test", "xray", "ultrasound", "ecg",
        "mri", "ct_scan", "endoscopy", "biopsy", "stress_test"];

    for (let i = 1; i <= 10; i++) {
        tests.push({
            _id: `TEST${i.toString().padStart(3, '0')}`,
            patientId: `PAT${(i % 10 || 10).toString().padStart(2, '0')}`,
            doctorId: `DOC${((i % 10) + 1).toString().padStart(2, '0')}`,
            appointmentId: `APP${i.toString().padStart(3, '0')}`,
            testType: testTypes[i - 1],
            name: [`Xét nghiệm máu toàn phần`, `Xét nghiệm nước tiểu`, `X-quang ngực`,
                `Siêu âm bụng`, `Điện tâm đồ`, `Chụp MRI não`, `Chụp CT ngực`,
                `Nội soi dạ dày`, `Sinh thiết da`, `Test gắng sức`][i - 1],
            orderedDate: new Date(2024, 0, 10 + i),
            performedDate: new Date(2024, 0, 12 + i),
            resultsAvailable: i % 3 !== 0,
            resultsDate: i % 3 !== 0 ? new Date(2024, 0, 14 + i) : null,
            findings: i % 3 !== 0 ? `Kết quả ${i % 2 === 0 ? 'bình thường' : 'có bất thường nhẹ'}` : null,
            notes: i % 3 !== 0 ? `Bệnh nhân cần theo dõi thêm` : `Đang chờ kết quả`,
            labName: `Phòng xét nghiệm ${["A", "B", "C", "D", "E"][i % 5]}`,
            files: i % 3 !== 0 ? [
                {
                    name: `ket_qua_${i}.pdf`,
                    url: `/reports/test${i}.pdf`,
                    size: 1024 * (100 + i),
                    uploadedAt: new Date(2024, 0, 14 + i)
                }
            ] : []
        });
    }

    return tests;
})();

// Invoices
exports.invoices = (function () {
    const invoices = [];

    for (let i = 1; i <= 10; i++) {
        const appointmentId = `APP${i.toString().padStart(3, '0')}`;
        const patientId = `PAT${(i % 10 || 10).toString().padStart(2, '0')}`;
        const doctorId = `DOC${((i % 10) + 1).toString().padStart(2, '0')}`;

        invoices.push({
            _id: `INV${i.toString().padStart(3, '0')}`,
            invoiceNumber: `INV-2024-${1000 + i}`,
            appointmentId: appointmentId,
            patientId: patientId,
            doctorId: doctorId,
            issueDate: new Date(2024, 0, 15 + i),
            dueDate: new Date(2024, 0, 30 + i),
            items: [
                {
                    description: "Phí tư vấn bác sĩ",
                    quantity: 1,
                    unitPrice: 500000,
                    amount: 500000
                },
                {
                    description: i % 2 === 0 ? "Phí đơn thuốc" : "Phí xét nghiệm",
                    quantity: 1,
                    unitPrice: 100000 + (i * 10000),
                    amount: 100000 + (i * 10000)
                }
            ],
            subtotal: 600000 + (i * 10000),
            tax: (600000 + (i * 10000)) * 0.1,
            total: (600000 + (i * 10000)) * 1.1,
            status: i % 4 === 0 ? "pending" : i % 4 === 1 ? "paid" : i % 4 === 2 ? "overdue" : "cancelled",
            paymentMethod: i % 3 === 0 ? "credit_card" : i % 3 === 1 ? "bank_transfer" : "cash",
            paidAt: i % 4 !== 0 ? new Date(2024, 0, 16 + i) : null,
            notes: i % 3 === 0 ? "Thanh toán trong vòng 15 ngày" : ""
        });
    }

    return invoices;
})();