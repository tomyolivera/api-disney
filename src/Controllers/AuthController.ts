import { Request, Response } from "express";
import { sign } from 'jsonwebtoken'
import { Messages } from "../Helpers";
import User from "../Models/User";
import prisma from '../Utils/database'

class AuthController {
    static async register(req: Request, res: Response): Promise<Response>
    {
        try {
            const userExists = await prisma.user.findFirst({ where: {email: req.body.email} })
            if(userExists) return res.status(401).json(Messages.Errors.EmailAlreadyExists)
            
            const password = await User.hashPassword(req.body.password)
            await prisma.user.create({ data: {...req.body, password} })
            
            return res.status(201).json(Messages.Success.Created)
        } catch (error) {
            return res.status(500).json(error)   
        }
    }

    static async login(req: Request, res: Response): Promise<Response>
    {
        try {
            const { email, password } = req.body
            const user = await prisma.user.findFirst({ where: { email } })
            if (!user) return res.status(404).json(Messages.Errors.NotFound)
            if (!await User.comparePassword(password, user.password)) return res.status(401).json(Messages.Errors.NotFound)            
            

            const token = sign({ id: user.id }, process.env.JWT_SECRET || "test", { expiresIn: '5m' })
            user.token = token
            user.token_expiration = new Date(new Date().getTime() + 5 * 60 * 1000) // Expira en 5 minutos
            await prisma.user.update({ where: { id: user.id }, data: user })
            return res.json({ token })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

export default AuthController