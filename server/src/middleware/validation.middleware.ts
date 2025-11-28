import { Request, Response, NextFunction } from 'express';

export const validateBoard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Title is required and must be a non-empty string' 
    });
  }

  if (title.trim().length > 100) {
    return res.status(400).json({ 
      message: 'Title cannot exceed 100 characters' 
    });
  }

  req.body.title = title.trim();
  next();
};

export const validateList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Title is required and must be a non-empty string' 
    });
  }

  if (title.trim().length > 100) {
    return res.status(400).json({ 
      message: 'Title cannot exceed 100 characters' 
    });
  }

  req.body.title = title.trim();
  next();
};

export const validateCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Title is required and must be a non-empty string' 
    });
  }

  if (title.trim().length > 255) {
    return res.status(400).json({ 
      message: 'Title cannot exceed 255 characters' 
    });
  }

  req.body.title = title.trim();
  next();
};
