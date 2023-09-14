import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from '@ffmpeg/util'
import { api } from "@/lib/axios";

type Status = 'waiting' | 'uploading' | 'converting' | 'transcribing' | 'success'

const statusMessages = {
    uploading: 'Uploading video',
    converting: 'Converting video to audio',
    transcribing: 'Transcribing audio',
    success: 'Success',
}

export function VideoInputForm() {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [status, setStatus] = useState<Status>('waiting')

    const promptInputRef = useRef<HTMLTextAreaElement>(null)

    function handleChosenVideo(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget

        if (!files) return

        const uploadedFile = files[0]

        setVideoFile(uploadedFile)
    }

    async function convertVideoToAudio(video: File) {
        console.log('Convert started')

        const ffmpeg = await getFFmpeg()

        await ffmpeg.writeFile('input.mp4', await fetchFile(video))

        // ffmpeg.on('log', log => console.log(log.message))

        ffmpeg.on('progress', progress => {
            console.log('Convert progress: ' + Math.round(progress.progress * 100))
        })

        await ffmpeg.exec([
            '-i', 
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3',
        ])

        const data = await ffmpeg.readFile('output.mp3')

        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
        const audioFile = new File([audioFileBlob], 'audio.mp3', { type: 'audio/mpeg' })

        return audioFile
    }

    async function handleUploadedVideo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const prompt = promptInputRef.current?.value

        if (!videoFile) {
            return
        }

        setStatus('converting')

        const audioFile = await convertVideoToAudio(videoFile)

        const data = new FormData()

        data.append('file', audioFile)

        setStatus('uploading')

        const response = await api.post('/videos', data)

        const videoId = response.data.video.id

        setStatus('transcribing')

        await api.post(`/videos/${videoId}/transcription`, {
            prompt,
        })

        setStatus('success')
    }

    const previewURL = useMemo(() => {
        if (!videoFile) {
            return null
        } 

        return URL.createObjectURL(videoFile)
    }, [videoFile])

    return (
        <form onSubmit={handleUploadedVideo} className='space-y-6'>
            <label 
              htmlFor="video"
              className='relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 justify-center items-center text-muted-foreground hover:bg-primary/5'
            >
              {previewURL ? (
                <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0" />
              ) : (
                <>
                    <FileVideo className='w-4 h-4'/>
                    Click to browse
                </>
              )}
            </label>

            <input type="file" id='video' accept='video/mp4' className='sr-only' onChange={handleChosenVideo}/>

            <Separator />

            <div className='space-y-2'>
              <Label htmlFor='transcription_prompt'>Prompt</Label>
              <Textarea 
                ref={promptInputRef}
                disabled={status !== 'waiting'}
                id="transcription_prompt" 
                className='h-20 leading-relaxed resize-none'
                placeholder='Add keywords mentioned in the video - use comma (,) as a separator'
              />
            </div>

            <Button 
              data-success={status === 'success'}
              disabled={status !== 'waiting'} 
              type="submit" 
              className='w-full data-[success=true]:bg-green-600'
            >
              {status === 'waiting' ? (
                <>
                  Upload video
                  <Upload className='w-4 h-4 ml-2' />
                </>
              ) : statusMessages[status]}              
            </Button>
          </form>
    )
}