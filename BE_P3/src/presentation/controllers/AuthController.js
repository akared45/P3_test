const RegisterRequest = require("../../application/dtos/auth/RegisterRequest");
const LoginRequest = require("../../application/dtos/auth/LoginRequest");
const RefreshTokenRequest = require("../../application/dtos/auth/RefreshTokenRequest");

class AuthController {
  constructor({
    registerPatientUseCase,
    loginUserUseCase,
    refreshTokenUseCase,
    logoutUserUseCase
  }) {
    this.registerPatientUseCase = registerPatientUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.refreshTokenUseCase = refreshTokenUseCase;
    this.logoutUserUseCase = logoutUserUseCase;
  }
  
  register = async (req, res, next) => {
    try {
      const requestDto = new RegisterRequest(req.body);
      const result = await this.registerPatientUseCase.execute(requestDto);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const requestDto = new LoginRequest(req.body);
      const result = await this.loginUserUseCase.execute(requestDto);
      const refreshToken = result.auth?.refreshToken || result.refreshToken;
      if (refreshToken) {
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
      } else {
        console.log('No token ');
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) {
        return res.status(401).json({ message: "Refresh Token not found" });
      }
      const requestDto = new RefreshTokenRequest({ refreshToken: token });
      const result = await this.refreshTokenUseCase.execute(requestDto);
      if (result.refreshToken) {
        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
      }
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken || req.body.refreshToken;
      if (token) {
        await this.logoutUserUseCase.execute(token);
      }
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
      })
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;