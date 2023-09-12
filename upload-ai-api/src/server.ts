import { fastify } from "fastify"
import { getAllPromptsRoutes } from "./routes/get-all-prompts"
import { uploadVideoRoutes } from "./routes/upload-video"
import { createTranscriptionsRoute } from "./routes/create-transcriptions"

export const app = fastify()

app.register(getAllPromptsRoutes)
app.register(uploadVideoRoutes)
app.register(createTranscriptionsRoute)

app.listen({ 
    port: 3333
}).then(() => {
    console.log("Server is running on port 3000")
})