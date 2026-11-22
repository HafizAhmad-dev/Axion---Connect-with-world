import jwt from 'jsonwebtoken';



export const signToken = (payload: { userId: string,sessionVersion:number }) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string,{expiresIn:'30d'});
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, sessionVersion: number };
};