import { Request } from 'express'
export const getIdFromToken = (req: Request): Number => {
    try {
        const payload = JSON.parse(Buffer.from(req.cookies.refreshToken.split('.')[1], 'base64').toString())
        const payloadUserId = Number(payload.user_id)
        return payloadUserId
    } catch {
        return 0;
    }
}

export const getRandomInt = (min: number, max: number) => {//straight from dev mozilla
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
} 
