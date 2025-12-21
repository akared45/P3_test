const { repositories } = require("../database/database");
const {
    userRepository,
    userSessionRepository,
    appointmentRepository,
    specializationRepository,
    verificationTokenRepository
} = repositories;

const MongoNotificationRepository = require('../../infrastructure/database/nosql/repositories/MongoNotificationRepository');
const MongoMessageRepository = require('../../infrastructure/database/nosql/repositories/MongoMessageRepository');
const MongoPaymentRepository = require('../../infrastructure/database/nosql/repositories/MongoPaymentRepository');
const MongoStatisticsRepository = require('../../infrastructure/database/nosql/repositories/MongoStatisticsRepository');
const MongoMedicationRepository = require('../../infrastructure/database/nosql/repositories/MongoMedicationRepository');

const BcryptAuthenticationService = require("../services/BcryptAuthenticationService");
const JwtTokenService = require("../services/JwtTokenService");
const AuthorizationService = require("../../domain/policies/AuthorizationService");
const GeminiAIService = require('../services/OpenAIService'); 
const LocalDiskStorageService = require('../storage/LocalDiskStorageService');
const SocketService = require('../services/SocketService');
const NodemailerEmailService = require("../services/NodemailerEmailService"); 
const SecurityService = require('../services/SecurityService'); 
const VnPayPaymentService = require('../services/VnPayPaymentService');
const MedicalSafetyService = require('../../domain/services/MedicalSafetyService');

const authenticationService = new BcryptAuthenticationService();
const tokenService = new JwtTokenService();
const authorizationService = new AuthorizationService();
const aiService = new GeminiAIService(); 
const storageService = new LocalDiskStorageService();
const socketService = new SocketService();
const emailService = new NodemailerEmailService(); 
const securityService = new SecurityService();
const vnPayPaymentService = new VnPayPaymentService(); 
const medicalSafetyService = new MedicalSafetyService();

const notificationRepository = new MongoNotificationRepository();
const messageRepository = new MongoMessageRepository();
const paymentRepository = new MongoPaymentRepository();
const statisticsRepository = new MongoStatisticsRepository();
const medicationRepository = new MongoMedicationRepository();

// --- Module: Auth ---
const RegisterPatientUseCase = require("../../application/use_cases/auth/RegisterPatientUseCase");
const LoginUserUseCase = require("../../application/use_cases/auth/LoginUserUseCase");
const RefreshTokenUseCase = require("../../application/use_cases/auth/RefreshTokenUseCase");
const LogoutUserUseCase = require("../../application/use_cases/auth/LogoutUserUseCase");
const VerifyEmailUseCase = require("../../application/use_cases/auth/VerifyEmailUseCase");
const GeneratePasswordResetTokenUseCase = require("../../application/use_cases/auth/GeneratePasswordResetTokenUseCase");
const ResetPasswordUseCase = require("../../application/use_cases/auth/ResetPasswordUseCase");

const registerPatientUseCase = new RegisterPatientUseCase({ userRepository, authenticationService, tokenService, emailService, verificationTokenRepository });
const loginUserUseCase = new LoginUserUseCase({ userRepository, userSessionRepository, authenticationService, tokenService });
const refreshTokenUseCase = new RefreshTokenUseCase({ userRepository, userSessionRepository, tokenService });
const logoutUserUseCase = new LogoutUserUseCase({ userSessionRepository });
const verifyEmailUseCase = new VerifyEmailUseCase({ userRepository, verificationTokenRepository });
const generatePasswordResetTokenUseCase = new GeneratePasswordResetTokenUseCase({ userRepository, verificationTokenRepository, emailService, securityService });
const resetPasswordUseCase = new ResetPasswordUseCase({ userRepository, verificationTokenRepository, authenticationService });

// --- Module: Admin & Stats ---
const CreateDoctorUseCase = require("../../application/use_cases/admin/CreateDoctorUseCase");
const UpdateDoctorUseCase = require("../../application/use_cases/admin/UpdateDoctorUseCase");
const DeleteUserUseCase = require("../../application/use_cases/admin/DeleteUserUseCase");
const GetDashboardStatsUseCase = require("../../application/use_cases/admin/GetDashboardStatsUseCase");

const createDoctorUseCase = new CreateDoctorUseCase({ userRepository, authenticationService, authorizationService });
const updateDoctorUseCase = new UpdateDoctorUseCase({ userRepository, authorizationService });
const deleteUserUseCase = new DeleteUserUseCase({ userRepository, userSessionRepository, authorizationService });
const getDashboardStatsUseCase = new GetDashboardStatsUseCase({ statisticsRepository });

// --- Module: Specialization ---
const GetAllSpecializationsUseCase = require("../../application/use_cases/shared/GetAllSpecializationsUseCase");
const CreateSpecializationUseCase = require("../../application/use_cases/admin/CreateSpecializationUseCase");
const UpdateSpecializationUseCase = require("../../application/use_cases/admin/UpdateSpecializationUseCase");
const DeleteSpecializationUseCase = require("../../application/use_cases/admin/DeleteSpecializationUseCase");
const GetSpecializationDetailUseCase = require("../../application/use_cases/shared/GetSpecializationDetailUseCase");

const getAllSpecializationsUseCase = new GetAllSpecializationsUseCase({ specializationRepository });
const createSpecializationUseCase = new CreateSpecializationUseCase({ specializationRepository });
const updateSpecializationUseCase = new UpdateSpecializationUseCase({ specializationRepository });
const deleteSpecializationUseCase = new DeleteSpecializationUseCase({ specializationRepository });
const getSpecializationDetailUseCase = new GetSpecializationDetailUseCase({ specializationRepository });

// --- Module: Doctor & Patient ---
const GetDoctorListUseCase = require("../../application/use_cases/shared/GetDoctorListUseCase");
const GetDoctorDetailUseCase = require("../../application/use_cases/shared/GetDoctorDetailUseCase");
const GetPatientListUseCase = require("../../application/use_cases/shared/GetPatientListUseCase");
const UpdatePatientProfileUseCase = require("../../application/use_cases/patient/UpdatePatientProfileUseCase");
const GetUserProfileUseCase = require("../../application/use_cases/shared/GetUserProfileUseCase");
const GetPatientProfileUseCase = require("../../application/use_cases/patient/GetPatientProfileUseCase");
const GetDoctorAvailableSlots = require("../../application/use_cases/doctor/GetDoctorAvailableSlots"); 

const getDoctorListUseCase = new GetDoctorListUseCase({ userRepository });
const getDoctorDetailUseCase = new GetDoctorDetailUseCase({ userRepository });
const getPatientListUseCase = new GetPatientListUseCase({ userRepository, authorizationService });
const getPatientProfileUseCase = new GetPatientProfileUseCase({ userRepository, authorizationService });
const updatePatientProfileUseCase = new UpdatePatientProfileUseCase({ userRepository, authorizationService });
const getUserProfileUseCase = new GetUserProfileUseCase({ userRepository, authorizationService });
const getAvailableSlotsUseCase = new GetDoctorAvailableSlots({ userRepository, appointmentRepository });

// --- Module: Chat ---
const SendMessageUseCase = require('../../application/use_cases/chat/SendMessageUseCase');
const GetChatHistoryUseCase = require('../../application/use_cases/chat/GetChatHistoryUseCase');

const sendMessageUseCase = new SendMessageUseCase({ messageRepository, appointmentRepository, socketService });
const getChatHistoryUseCase = new GetChatHistoryUseCase({ messageRepository, appointmentRepository });

// --- Module: Appointment ---
const BookAppointmentUseCase = require("../../application/use_cases/appointment/BookAppointmentUseCase");
const UpdateAppointmentStatusUseCase = require("../../application/use_cases/appointment/UpdateAppointmentStatusUseCase");
const GetMyAppointmentsUseCase = require("../../application/use_cases/appointment/GetMyAppointmentsUseCase"); 
const GetBusySlotsUseCase = require("../../application/use_cases/appointment/GetBusySlotsUseCase");
const CompleteAppointmentUseCase = require('../../application/use_cases/appointment/CompleteAppointmentUseCase');

const bookAppointmentUseCase = new BookAppointmentUseCase({ appointmentRepository, userRepository, emailService, socketService, notificationRepository });
const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase({ appointmentRepository });
const getMyAppointmentsUseCase = new GetMyAppointmentsUseCase({ appointmentRepository });
const getBusySlotsUseCase = new GetBusySlotsUseCase({ appointmentRepository });
const completeAppointmentUseCase = new CompleteAppointmentUseCase({ appointmentRepository, userRepository, emailService });

// --- Module: AI ---
const SuggestSpecialtyUseCase = require('../../application/use_cases/ai/SuggestSpecialtyUseCase');
const suggestSpecialtyUseCase = new SuggestSpecialtyUseCase({ aiService, specializationRepository });

// --- Module: Medication ---
const AddPrescriptionUseCase = require('../../application/use_cases/medication/AddPrescriptionUseCase');
const GetMedicationCatalogUseCase = require('../../application/use_cases/medication/GetMedicationCatalogUseCase');
const CreateMedicationUseCase = require('../../application/use_cases/medication/CreateMedicationUseCase');
const UpdateMedicationUseCase = require('../../application/use_cases/medication/UpdateMedicationUseCase');
const DeleteMedicationUseCase = require('../../application/use_cases/medication/DeleteMedicationUseCase');

const getMedicationCatalogUseCase = new GetMedicationCatalogUseCase({ medicationRepository });
const addPrescriptionUseCase = new AddPrescriptionUseCase({
    appointmentRepository,
    medicationRepository,
    medicalSafetyService
});

// --- Module: Notification ---
const GetNotificationsUseCase = require('../../application/use_cases/notification/GetNotificationsUseCase');
const MarkNotificationAsReadUseCase = require('../../application/use_cases/notification/MarkNotificationAsReadUseCase');
const DeleteNotificationUseCase = require('../../application/use_cases/notification/DeleteNotificationUseCase');

const getNotificationsUseCase = new GetNotificationsUseCase({ notificationRepository });
const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase({ notificationRepository });
const deleteNotificationUseCase = new DeleteNotificationUseCase({ notificationRepository });

// --- Module: Payment ---
const CreateVnPayUrlUseCase = require('../../application/use_cases/payment/CreateVnPayUrlUseCase');
const HandleVnPayCallbackUseCase = require('../../application/use_cases/payment/HandleVnPayCallbackUseCase');

const createVnPayUrlUseCase = new CreateVnPayUrlUseCase({ appointmentRepository, paymentService: vnPayPaymentService });
const handleVnPayCallbackUseCase = new HandleVnPayCallbackUseCase({ appointmentRepository, paymentRepository, vnPayPaymentService, socketService, notificationRepository, userRepository, emailService });

const AuthController = require("../../presentation/controllers/AuthController");
const AdminController = require("../../presentation/controllers/AdminController");
const DoctorController = require("../../presentation/controllers/DoctorController");
const PatientController = require("../../presentation/controllers/PatientController");
const UserController = require("../../presentation/controllers/UserController");
const AppointmentController = require("../../presentation/controllers/AppointmentController");
const SpecializationController = require("../../presentation/controllers/SpecializationController");
const AIController = require('../../presentation/controllers/AIController');
const UploadController = require('../../presentation/controllers/UploadController');
const ChatController = require("../../presentation/controllers/ChatController");
const NotificationController = require('../../presentation/controllers/NotificationController');
const PaymentController = require('../../presentation/controllers/PaymentController');
const StatisticsController = require("../../presentation/controllers/StatisticsController");
const MedicationController = require('../../presentation/controllers/MedicationController');

const authController = new AuthController({ registerPatientUseCase, loginUserUseCase, refreshTokenUseCase, logoutUserUseCase, verifyEmailUseCase, generatePasswordResetTokenUseCase, resetPasswordUseCase });
const adminController = new AdminController({ createDoctorUseCase, updateDoctorUseCase, deleteUserUseCase });
const doctorController = new DoctorController({ getDoctorListUseCase, getDoctorDetailUseCase, getAvailableSlotsUseCase });
const patientController = new PatientController({ getPatientListUseCase, updatePatientProfileUseCase, getPatientProfileUseCase });
const userController = new UserController({ getUserProfileUseCase });
const appointmentController = new AppointmentController({ bookAppointmentUseCase, updateAppointmentStatusUseCase, getMyAppointmentsUseCase, getBusySlotsUseCase, completeAppointmentUseCase });
const specializationController = new SpecializationController({ getAllSpecializationsUseCase, createSpecializationUseCase, updateSpecializationUseCase, deleteSpecializationUseCase, getSpecializationDetailUseCase });
const chatController = new ChatController({ getChatHistoryUseCase });
const aiController = new AIController({ suggestSpecialtyUseCase });
const uploadController = new UploadController({ storageService });
const notificationController = new NotificationController({ getNotificationsUseCase, markNotificationAsReadUseCase, deleteNotificationUseCase });
const paymentController = new PaymentController({ createVnPayUrlUseCase, handleVnPayCallbackUseCase, vnPayPaymentService });
const statisticsController = new StatisticsController({ getDashboardStatsUseCase });


const createMedicationUseCase = new CreateMedicationUseCase({ medicationRepository });
const updateMedicationUseCase = new UpdateMedicationUseCase({ medicationRepository });
const deleteMedicationUseCase = new DeleteMedicationUseCase({ 
    medicationRepository, 
    appointmentRepository 
});

const medicationController = new MedicationController({
    getMedicationCatalogUseCase,
    addPrescriptionUseCase,
    createMedicationUseCase,
    updateMedicationUseCase,
    deleteMedicationUseCase
});


module.exports = {
    authController,
    adminController,
    doctorController,
    patientController,
    userController,
    appointmentController,
    specializationController,
    aiController,
    uploadController,
    chatController,
    notificationController,
    paymentController,
    statisticsController,
    medicationController, 
    socketService,
    tokenService,
    sendMessageUseCase,
    aiService
};