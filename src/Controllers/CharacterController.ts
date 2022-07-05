import axios from 'axios'
import { Request, Response } from 'express'
import { Messages } from '../Helpers'
import prisma from '../Utils/database'

interface ICharacter {
    nombre: string,
    edad: string,
    peso: number,
    historia: string,
    imagen: string
}

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
        // const { data } = await axios.get("https://api.disneyapi.dev/characters")
        // // random number between 30 and 60
        // // lorem ipsum text generator https://www.lipsum.com/
        // data.data.forEach(async (element: any) => {
        //     var character = {} as ICharacter
        //     var i = {} as any
        //     character.nombre = element.name
        //     character.edad = (Math.floor(Math.random() * (60 - 30 + 1)) + 30 + '')
        //     character.peso = Math.floor(Math.random() * (100 - 50 + 1)) + 50
        //     character.historia = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        //     character.imagen = element.imageUrl
        //     i = character
        //     console.log(i)
        //     await prisma.character.create({
        //         data: i
        //     })
        // });
        // return res.json("Characters")
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