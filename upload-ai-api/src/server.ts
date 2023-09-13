import { fastify } from "fastify"
import { fastifyCors } from "@fastify/cors"
import { getAllPromptsRoutes } from "./routes/get-all-prompts"
import { uploadVideoRoutes } from "./routes/upload-video"
import { createTranscriptionsRoute } from "./routes/create-transcriptions"
import { generateAICompletionRoute } from "./routes/generate-ai-completion"

export const app = fastify()

app.register(fastifyCors, {
    origin: '*',
})

app.register(getAllPromptsRoutes)
app.register(uploadVideoRoutes)
app.register(createTranscriptionsRoute)
app.register(generateAICompletionRoute)

app.listen({ 
    port: 3333
}).then(() => {
    console.log("Server is running on port 3000")
})