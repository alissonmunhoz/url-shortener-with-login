import { SignInService } from './services/signin.service';
import { SignUpService } from './services/signup.service';

export const AuthProvider = [SignUpService, SignInService];
