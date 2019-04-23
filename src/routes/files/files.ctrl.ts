import { Request, Response, NextFunction } from "express";

export const createIllustImageUrl = (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "파일": "파일"
    })
}