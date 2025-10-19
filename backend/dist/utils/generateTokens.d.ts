import { Types } from 'mongoose';
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
declare const generateTokens: (userId: Types.ObjectId | string) => TokenPair;
export default generateTokens;
//# sourceMappingURL=generateTokens.d.ts.map