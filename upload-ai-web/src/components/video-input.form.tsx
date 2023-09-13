import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, useMemo, useState } from "react";

export function VideoInputForm() {
    const [videoFile, setVideoFile] = useState<File | null>(null)

    function handleVideoUpload(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget

        if (!files) return

        const uploadedFile = files[0]

        setVideoFile(uploadedFile)
    }

    const previewURL = useMemo(() => {
        if (!videoFile) {
            return null
        } 

        return URL.createObjectURL(videoFile)
    }, [videoFile])

    return (
        <form className='space-y-6'>
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

            <input type="file" id='video' accept='video/mp4' className='sr-only' onChange={handleVideoUpload}/>

            <Separator />

            <div className='space-y-2'>
              <Label htmlFor='transcription_prompt'>Prompt</Label>
              <Textarea 
                id="transcription_prompt" 
                className='h-20 leading-relaxed resize-none'
                placeholder='Add keywords mentioned in the video - use comma (,) as a separator'
              />
            </div>

            <Button type="submit" className='w-full'>
              Upload video
              <Upload className='w-4 h-4 ml-2' />
            </Button>
          </form>
    )
}