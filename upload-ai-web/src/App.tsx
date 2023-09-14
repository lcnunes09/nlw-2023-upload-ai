import { Github, Wand2 } from 'lucide-react'
import { Button } from "./components/ui/button"
import { Separator } from './components/ui/separator'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Slider } from './components/ui/slider'
import { VideoInputForm } from './components/video-input.form'
import { PromptSelect } from './components/prompt-select'
import { useState } from 'react'
import { useCompletion } from 'ai/react'

export function App() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)

  const {
    input,
    setInput,
    handleInputChange,
  } = useCompletion({
    api: 'http://localhost:3333/ai-completion',
    body: {
      videoId,
      temperature,
    }
  })

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
              placeholder='Add prompt to\ AI'
              value={input}
              onChange={handleInputChange}
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
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form className='space-y-6'>
            <div className='space-y-2'>
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
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
                value={[temperature]}
                onValueChange={value => setTemperature(value[0])}
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
