import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../../providers/redis";
import {Request, Response, NextFunction} from "express";

class AuthController {
  private accessTokenSecret = "your-access-token-secret"; // Use from environment variables
  private refreshTokenSecret = "your-refresh-token-secret"; // Use from environment variables

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "email and password are required" });
        return
      }

      const user = (await User.findOne({ email })) as {
        _id: string;
        email: string;
        password: string;
      };

      if (!user) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid credentials" });
        return
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid credentials" });
        return
      }

      const { accessToken, refreshToken } = await this.signTokens(user._id);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      }); // 15 minutes
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); // 7 days

      res.json({ message: "Logged in successfully" });
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password || !firstName || !lastName) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "email and password and firstName and lastName are required",
        });

        return
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword, lastName, firstName});

      const { accessToken, refreshToken } = await this.signTokens(user._id);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      }); // 15 minutes
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); // 7 days

      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      next(error)
    }
  };

  private signTokens = async (userId: unknown) => {
    const accessToken = jwt.sign({ userId }, this.accessTokenSecret, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, this.refreshTokenSecret, {
      expiresIn: "7d",
    });

    await client.set(JSON.stringify(userId) as any, refreshToken as any, JSON.stringify({ EX: 7 * 24 * 60 * 60 }) as any);

    return { accessToken, refreshToken };
  };
}

export default AuthController;
