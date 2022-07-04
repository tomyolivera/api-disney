import { Request, Response } from 'express'
import { Messages } from '../Helpers'
import prisma from '../Utils/database'

class CharacterController {
    static async getAll(req: Request, res: Response): Promise<Response>
    {
        try {
            if(req.query.nombre || req.query.edad || req.query.movietitle) return await CharacterController.getByAttr(req, res)
            const characters = await prisma.character.findMany({ include: { movies: true } })
            if(!characters) return res.status(404).json(Messages.Errors.NotFound)
            return res.json(characters)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    static async getByAttr(req: Request, res: Response): Promise<Response>
    {
        try {
            const nombre = req.query.nombre as string
            const edad = req.query.edad as string
            const movietitle = req.query.movietitle as string
            const characters = await prisma.character.findMany({
                where: {
                    nombre: { contains: nombre },
                    movies: { some: { titulo: { contains: movietitle } } },
                    edad: { equals: edad }
                },
                include: { movies: true }
            })
            if(!characters.length) return res.status(404).json(Messages.Errors.NotFound)
            return res.json(characters)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    static async create(req: Request, res: Response): Promise<Response>
    {
        try {
            const character = await prisma.character.create({ data: {...req.body} })
            return res.status(201).json(character)
        }
        catch (error) {
            return res.status(500).json(error)
        }
    }

    static async update(req: Request, res: Response): Promise<Response>
    {
        try {
            const id = parseInt(req.params.id)
            const character = await prisma.character.update({ where: {id}, data: {...req.body} })
            if(!character) return res.status(404).json(Messages.Errors.NotFound)
            return res.json(character)
        }
        catch (error) {
            return res.status(500).json(error)
        }
    }

    static async delete(req: Request, res: Response): Promise<Response>
    {
        try {
            const id = parseInt(req.params.id)
            const character = await prisma.character.delete({ where: {id} })
            if(!character) return res.status(404).json(Messages.Errors.NotFound)
            return res.json("Deleted")
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

export default CharacterController