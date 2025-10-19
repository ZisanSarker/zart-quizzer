import { IUser, AuthProvider, PublicUser } from '../types';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (candidatePassword: string, hashedPassword: string) => Promise<boolean>;
export declare const getAuthProvider: (user: IUser) => AuthProvider;
export declare const sanitizeUser: (user: IUser) => PublicUser;
//# sourceMappingURL=userUtils.d.ts.map