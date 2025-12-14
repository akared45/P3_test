require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dependencies = require('./src/infrastructure/config/dependencies');
const { connectDatabase } = require('./src/infrastructure/database/database');
const errorMiddleware = require('./src/presentation/middleware/error_middleware');
const authRoutes = require('./src/presentation/routes/auth_routes');
const adminRoutes = require('./src/presentation/routes/admin_routes');
const doctorRoutes = require('./src/presentation/routes/doctor_routes');
const patientRoutes = require('./src/presentation/routes/patient_routes');
const userRoutes = require('./src/presentation/routes/user_routes');
const appointmentRoutes = require('./src/presentation/routes/appointment_routes');
const specializationRoutes = require('./src/presentation/routes/specialization_routes');
const aiRoutes = require('./src/presentation/routes/ai_routes');
const uploadRoutes = require('./src/presentation/routes/upload_routes');
const notificationRoutes = require('./src/presentation/routes/notification_routes');
const chatRoutes = require ('./src/presentation/routes/chat_routes');

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);
if (dependencies.socketService) {
  dependencies.socketService.init(httpServer, {
    sendMessageUseCase: dependencies.sendMessageUseCase
  });
} else {
  console.error("CRITICAL: socketService chưa được export từ dependencies.js");
}

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat',chatRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDatabase();
    httpServer.listen(PORT, () => {
      console.log(`=================================`);
      console.log(`Server (HTTP + Socket) running on port ${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`http://localhost:${PORT}`);
      console.log(`=================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();