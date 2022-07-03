import bcrypt from 'bcrypt'

class User {
    static async hashPassword(password: string): Promise<string>
    {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }

    static async comparePassword(password: string, hash: string): Promise<boolean>
    {
        return await bcrypt.compare(password, hash)
    }
}

export default User