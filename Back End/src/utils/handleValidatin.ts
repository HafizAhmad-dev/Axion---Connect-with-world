
import type { Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleValidation = (req: Request, res: Response) => {
  console.log('Request body:', req.body); 
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string> = {};
    
    errors.array().forEach((err: any) => {
      formattedErrors[err.path] = err.msg;
    });
    
    res.status(400).json({ errors: formattedErrors });
    return true;
  }

  return false;
};