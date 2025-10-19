import { Request, Response } from 'express';
import { LoginRequestBody, RegisterRequestBody } from '../types';
export declare const register: (req: Request<{}, {}, RegisterRequestBody>, res: Response) => Promise<void>;
export declare const login: (req: Request<{}, {}, LoginRequestBody>, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => void;
export declare const refreshToken: (req: Request, res: Response) => void;
export declare const getCurrentUser: (req: Request, res: Response) => Promise<void>;
export declare const startGoogleAuth: any;
export declare const handleGoogleCallback: any[];
export declare const startGithubAuth: any;
export declare const handleGithubCallback: any[];
//# sourceMappingURL=auth.controller.d.ts.map