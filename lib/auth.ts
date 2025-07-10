import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';

const JWT_SECRET = process.env.JWT_SECRET;

// JWT_SECRETが設定されていない場合は警告
if (!JWT_SECRET) {
  logger.error('JWT_SECRET is not configured. Authentication will not work properly.');
}

interface DecodedToken {
  username: string;
  id: number;
  role?: string;
  iat?: number;
  exp?: number;
}

// トークン検証関数
export const verifyAuth = async (token: string): Promise<boolean> => {
  if (!JWT_SECRET) {
    logger.error('JWT_SECRET is not configured');
    return false;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    // トークンが有効であることを確認
    return !!decoded && !!decoded.username;
  } catch (error) {
    logger.error('Token verification failed:', error);
    return false;
  }
};

// トークンデコード関数
export const decodeToken = (token: string): DecodedToken | null => {
  if (!JWT_SECRET) {
    return null;
  }
  
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    return null;
  }
};