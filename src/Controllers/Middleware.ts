import { NextFunction, Request, Response } from "express";
import { Messages } from "../Helpers";
import prisma from "../Utils/database";

class Middleware {
    static async checkAuth(req: Request, res: Response, next: NextFunction)
    {
        try {
            let token = req.headers.authorization
            if(!token || !token.includes("Bearer ")) return res.status(401).json(Messages.Errors.Unauthorized)

            token = token.replace("Bearer ", "")

            const user = await prisma.user.findFirst({ where: {token} })
            if(!user) return res.status(401).json(Messages.Errors.Unauthorized)

            if(user.token_expiration && user.token_expiration < new Date()) return res.status(403).json(Messages.Errors.Forbidden)
            return next()
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

export default Middleware