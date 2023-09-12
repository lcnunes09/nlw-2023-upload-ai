import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getAllPromptsRoutes(app: FastifyInstance) {
    
    app.get("/prompts", async () => {
        const prompts = await prisma.prompt.findMany()
        
        return prompts
    })
}