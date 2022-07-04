import { Request, Response } from 'express'
import { Messages } from '../Helpers'
import prisma from '../Utils/database'

class MovieController {
    static async getAll(req: Request, res: Response): Promise<Response>
    {
        try {
            if(req.query.titulo || req.query.orden) return await MovieController.getByAttr(req, res)
            const movies = await prisma.movie.findMany({ include: { characters: true } })
            if(!movies) return res.status(404).json(Messages.Errors.NotFound)
            return res.json(movies)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    static async getByAttr(req: Request, res: Response): Promise<Response>
    {
        try {
            const titulo = req.query.titulo as string
            const orden = req.query.orden as any
            const movies = await prisma.movie.findMany({
                where: {
                    titulo: { contains: titulo },
                },
                orderBy: { id: orden },
                include: { characters: true }
            })
            if(!movies.length) return res.status(404).json(Messages.Errors.NotFound)
            return res.json(movies)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    static async create(req: Request, res: Response): Promise<Response>
    {
        try {
            const fecha_creacion = new Date(req.body.fecha_creacion)
            const movie = await prisma.movie.create({ data: {...req.body, fecha_creacion} })
            return res.status(201).json(movie)
        }
        catch (error) {
            return res.status(500).json(error)
        }
    }

    static async update(req: Request, res: Response): Promise<Response>
    {
        try {
            const id = parseInt(req.params.id)
            const movie = await prisma.movie.update({ where: {id}, data: {...req.body} })
            if(!movie) return res.status(404).json(Messages.Errors.NotFound)
            return res.json(movie)
        }
        catch (error) {
            return res.status(500).json(error)
        }
    }

    static async delete(req: Request, res: Response): Promise<Response>
    {
        try {
            const id = parseInt(req.params.id)
            const movie = await prisma.movie.delete({ where: {id} })
            if(!movie) return res.status(404).json(Messages.Errors.NotFound)
            return res.json("Deleted")
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

export default MovieController