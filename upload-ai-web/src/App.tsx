import { Github, FileVideo, Upload, Wand2 } from 'lucide-react'
import { Button } from "./components/ui/button"
import { Separator } from './components/ui/separator'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Slider } from './components/ui/slider'

export function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-small text-muted-foreground">NLW 2023 🚀 🩷</span>

          <Separator orientation='vertical' className='h-6'/>
          
          <Button variant="outline">
            <Github className='w-4 h-4 mr-2' />
            Github
          </Button>
        </div>
      </div>

      <main className="flex-1 flex p-6 gap-6">
        <div className='flex flex-col flex-1 gap-4'>
          <div className='grid grid-rows-2 gap-4 flex-1'>
            <Textarea 
              className='resize-none p-4 leading-relaxed'  
              placeholder='Add prompt to AI'
            />
            <Textarea 
              className='resize-none p-4 leading-relaxed'  
              placeholder='Result' 
              readOnly 
            />
          </div>

          <p className='text-sm text-muted-foreground'>
            [Tip] it is possible to add <code className='text-violet-400'>{'{transcription}'}</code> into the prompt to add the transcription content from the uploaded video. 
          </p>
        </div>
        <aside className='w-80 space-y-6'>
          <form className='space-y-6'>
            <label 
              htmlFor="video"
              className='border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 justify-center items-center text-muted-foreground hover:bg-primary/5'
            >
              <FileVideo className='w-4 h-4'/>
              Click to browse
            </label>

            <input type="file" id='video' accept='video/mp4' className='sr-only'/>

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

          <Separator />

          <form className='space-y-6'>
            <div className='space-y-2'>
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a prompt...'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='title'>Video title</SelectItem>
                  <SelectItem value='description'>Video description</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Model</Label>
              <Select disabled defaultValue='gpt3.5'>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='gpt3.5'>GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className='block text-xs text-muted-foreground italic'>
                Another model will soon be available for you to choose.
              </span>
            </div>

            <Separator />

            <div className='space-y-4'>
              <Label>Temperature</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
              />
              <span className='block text-xs text-muted-foreground italic leading-relaxed'>
                The higher the temperature, the crazier the text.
              </span>
            </div>

            <Separator />

            <Button type="submit" className='w-full'> 
              Generate

              <Wand2 className='w-4 h-4 ml-2' />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
