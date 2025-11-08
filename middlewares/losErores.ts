import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

export const losErores = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() }); // 👈 devolver array y cortar
  }
  next();
};