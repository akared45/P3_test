import React, { useState } from "react";
import {
    Box, Container, Grid, Typography, TextField, Button, Paper,
    Stack, Accordion, AccordionSummary, AccordionDetails, MenuItem
} from "@mui/material";
import {
    LocationOn, Phone, Email, AccessTime, Send, ExpandMore, Map
} from "@mui/icons-material";

const contactInfo = [
    {
        icon: <Phone fontSize="large" />,
        title: "Hotline khẩn cấp",
        desc: "24/7 cho mọi tình huống",
        info: "1900 1234",
        color: "#e74c3c"
    },
    {
        icon: <LocationOn fontSize="large" />,
        title: "Địa chỉ phòng khám",
        desc: "Tòa nhà Imperial Suites",
        info: "71 Vạn Phúc, Ba Đình, Hà Nội",
        color: "#1976d2"
    },
    {
        icon: <Email fontSize="large" />,
        title: "Email hỗ trợ",
        desc: "Phản hồi trong 24h",
        info: "care@doctor4u.vn",
        color: "#f39c12"
    },
    {
        icon: <AccessTime fontSize="large" />,
        title: "Giờ làm việc",
        desc: "Thứ 2 - Chủ Nhật",
        info: "07:00 - 20:00",
        color: "#27ae60"
    },
];

const faqs = [
    { q: "Tôi có cần đặt lịch trước khi đến khám không?", a: "Để giảm thiểu thời gian chờ đợi, chúng tôi khuyến khích bạn đặt lịch trước thông qua Website hoặc Ứng dụng. Tuy nhiên, chúng tôi vẫn tiếp nhận bệnh nhân đến trực tiếp." },
    { q: "Chi phí khám bệnh là bao nhiêu?", a: "Chi phí khám tổng quát bắt đầu từ 300.000 VNĐ. Chi phí chi tiết phụ thuộc vào chuyên khoa và các xét nghiệm (nếu có)." },
    { q: "Phòng khám có thanh toán bảo hiểm y tế không?", a: "Có. Chúng tôi hỗ trợ thanh toán bảo hiểm y tế nhà nước và bảo lãnh viện phí cho hơn 20 đơn vị bảo hiểm tư nhân." },
];

const subjects = [
    { value: 'tuvan', label: 'Tư vấn sức khỏe' },
    { value: 'datlich', label: 'Hỗ trợ đặt lịch' },
    { value: 'khieu_nai', label: 'Phản ánh dịch vụ' },
    { value: 'hop_tac', label: 'Liên hệ hợp tác' },
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', subject: 'tuvan', message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        alert("Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!");
    };

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', pb: 10 }}>

            <Box
                sx={{
                    bgcolor: 'white',
                    py: 8,
                    textAlign: 'center',
                    borderBottom: '1px solid #e0e0e0'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={1.5}>
                        LIÊN HỆ VỚI CHÚNG TÔI
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ mt: 1, mb: 2, color: '#2c3e50' }}>
                        Chúng tôi luôn sẵn sàng lắng nghe
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Đội ngũ chăm sóc khách hàng của Medicare luôn túc trực để giải đáp mọi thắc mắc và hỗ trợ bạn một cách nhanh nhất.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: -4 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 3,
                        mt: "-50px",         
                        px: 3,
                        position: "relative",
                        zIndex: 10              
                    }}
                >
                    {contactInfo.map((item, i) => (
                        <Paper
                            key={i}
                            sx={{
                                width: { xs: "100%", sm: "45%", md: "22%" },
                                p: 4,
                                textAlign: "center",
                                borderRadius: 4,
                                transition: "0.35s",
                                transform: "translateY(0)",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                                background: "#fff",
                                "&:hover": {
                                    transform: "translateY(-12px)",
                                    boxShadow: "0 18px 35px rgba(0,0,0,0.18)"
                                }
                            }}
                        >
                            <Box sx={{ fontSize: 40, mb: 2, color: item.color }}>{item.icon}</Box>
                            <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
                            <Typography variant="body2" mt={1} color="text.secondary">{item.desc}</Typography>
                            <Typography fontWeight="bold" mt={1} color="primary">{item.info}</Typography>
                        </Paper>
                    ))}
                </Box>

                <Grid container spacing={4} sx={{ mt: 6 }}>
                    <Grid item xs={12} md={7}>
                        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, bgcolor: 'white', height: '100%' }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email color="primary" /> Gửi tin nhắn cho chúng tôi
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                Vui lòng điền thông tin vào biểu mẫu bên dưới, chúng tôi sẽ phản hồi qua Email hoặc Số điện thoại của bạn.
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Họ và tên" name="name"
                                            value={formData.name} onChange={handleChange} required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Số điện thoại" name="phone"
                                            value={formData.phone} onChange={handleChange} required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth label="Email" name="email" type="email"
                                            value={formData.email} onChange={handleChange} required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            select fullWidth label="Vấn đề cần hỗ trợ"
                                            name="subject" value={formData.subject} onChange={handleChange}
                                        >
                                            {subjects.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth label="Nội dung tin nhắn" name="message"
                                            multiline rows={4}
                                            value={formData.message} onChange={handleChange} required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit" variant="contained" size="large"
                                            endIcon={<Send />}
                                            sx={{ borderRadius: 8, px: 5, py: 1.5, fontWeight: 'bold' }}
                                        >
                                            Gửi tin nhắn
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Paper elevation={0} sx={{ p: 0, borderRadius: 4, overflow: 'hidden', height: '100%', minHeight: 400 }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924088812613!2d105.81643907599863!3d21.03572338753733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xab069cd4eaa76aff!2zNzEgUC4gVuG6oW4gUGjDumMsIExp4buF Giai, Ba ÄÃ¬nh, HÃ  Nu1ed9i 100000, Vietnam!5e0!3m2!1sen!2s!4v1708420000000!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '500px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps"
                            ></iframe>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 8 }}>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                        Câu hỏi thường gặp
                    </Typography>
                    <Container maxWidth="md">
                        <Box sx={{ mt: 4 }}>
                            {faqs.map((faq, index) => (
                                <Accordion key={index} sx={{ mb: 2, borderRadius: '8px !important', boxShadow: 'none', '&:before': { display: 'none' }, border: '1px solid #e0e0e0' }}>
                                    <AccordionSummary expandIcon={<ExpandMore color="primary" />}>
                                        <Typography fontWeight="bold" color="#333">{faq.q}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography color="text.secondary">
                                            {faq.a}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Container>
                </Box>

            </Container>
        </Box>
    );
};

export default Contact;