import jwt from 'jsonwebtoken';


export const signToken = (payload: { userId: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string,{expiresIn:'2d'});
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
};