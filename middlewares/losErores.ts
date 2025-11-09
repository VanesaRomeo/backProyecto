import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

export const losErores = (req:Request, res:Response, next:NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() }); // 👈 devolver array y cortar
  } else{
    next();
  }
  
};