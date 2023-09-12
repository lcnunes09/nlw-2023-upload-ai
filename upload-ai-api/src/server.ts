import { fastify } from "fastify"
import { getAllPromptsRoutes } from "./routes/get-all-prompts"
import { uploadVideoRoutes } from "./routes/upload-video"

export const app = fastify()

app.register(getAllPromptsRoutes)
app.register(uploadVideoRoutes)

app.listen({ 
    port: 3333
}).then(() => {
    console.log("Server is running on port 3000")
})