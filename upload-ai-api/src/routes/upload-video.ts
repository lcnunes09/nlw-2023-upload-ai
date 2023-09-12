import { FastifyInstance } from 'fastify'
import { fastifyMultipart } from '@fastify/multipart'
import { prisma } from '../lib/prisma'

import path from 'node:path'
import fs from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { randomUUID } from 'node:crypto'

const pump = promisify(pipeline)

export async function uploadVideoRoutes(app: FastifyInstance) {
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1_048_576 * 25, // 25MB
        }
    })

    app.post("/videos", async (request, reply) => {
        const data = await request.file()

        if (!data) {
            return reply.status(400).send({
                error: "No file uploaded."
            })
        }

        const extension = path.extname(data.filename)

        if (extension !== ".mp3") {
            return reply.status(400).send({
                error: "Invalid file type. Only mp3 files are allowed."
            })
        }

        const fileBaseName = path.basename(data.filename, extension) // filename without extension
        const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}` // filename with unique id and extension
        const uploadDestination = path.resolve(__dirname, "../../tmp", fileUploadName) // path to tmp directory

        await pump(data.file, fs.createWriteStream(uploadDestination))

        const video = await prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDestination
            }
        })

        return {
            video
        }
    })
}