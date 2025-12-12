require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dependencies = require('./src/infrastructure/config/dependencies');
const { connectDatabase } = require('./src/infrastructure/database/database');
const { initializeSocket } = require('./src/infrastructure/websocket/socket_server');
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
const chatRoutes = require('./src/presentation/routes/chat_routes');

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);
if (!dependencies.sendMessageUseCase) {
  console.error("CRITICAL: sendMessageUseCase chưa được export từ dependencies.js");
  process.exit(1);
}
const io = initializeSocket(httpServer, {
  sendMessageUseCase: dependencies.sendMessageUseCase
});

if (dependencies.socketService) {
  dependencies.socketService.setIO(io);
}
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
app.use('/api/chat', chatRoutes);

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
      console.log(`http://localhost:${PORT}`);
      console.log(`=================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();