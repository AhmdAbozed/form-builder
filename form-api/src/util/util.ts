import { Request } from 'express'
export const getIdFromToken = (req: Request):Number => {
    try {
        const payload = JSON.parse(Buffer.from(req.cookies.refreshToken.split('.')[1], 'base64').toString())
        const payloadUserId = Number(payload.user_id)
        return payloadUserId
    } catch {
        return 0;
    }
}