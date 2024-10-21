import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const accessTokenSecret = "your-access-token-secret"; // Use a secret key from environment variables

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token is required" });
    return
  }

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      res
          .status(403)
          .json({message: "Access token expired or invalid"});
      return
    }
    req.body['user'] = user; // Attach user information to the request
    next();
  });
};
