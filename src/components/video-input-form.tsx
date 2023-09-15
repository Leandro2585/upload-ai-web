import { FileVideo, Upload } from "lucide-react"
import { Button, Label, Separator, Textarea } from './ui'
import { ChangeEvent, useMemo, useRef, useState } from "react"
import { getFFmpeg } from "@/lib/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import { api } from "@/lib/axios"

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'
const statusMessages = {
    converting: 'Convertendo...',
    generating: 'Transcrevendo...',
    uploading: 'Carregando...',
    success: 'Sucesso!'
}

export const VideoInputForm = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [status, setStatus] = useState<Status>('waiting')
    const promptInputRef = useRef<HTMLTextAreaElement>(null)

    const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.currentTarget
        if(!files) return
        setVideoFile(files[0])
    }

    const convertVideoToAudio = async (video: File) => {
        const ffmpeg = await getFFmpeg()
        await ffmpeg.writeFile('input.mp4', await fetchFile(video))

        ffmpeg.on('progress', progress => {
            console.log('Convert progress: '+ Math.round(progress.progress * 100))
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
            'output.mp3'
        ]) 
    
        const data = await ffmpeg.readFile('output.mp3')
        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
        const audioFile = new File([audioFileBlob], 'audio.mp3', { type: 'audio/mpeg' })
        console.log('Convert finished')

        return audioFile
    }

    const handleUploadVideo = async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        const prompt = promptInputRef.current?.value
        setStatus('converting')
        if(!videoFile) return
        const audioFile = await convertVideoToAudio(videoFile)
        setStatus('uploading')
        const data = new FormData()
        data.append('file', audioFile)
        const response = await api.post('/videos', data)
        const videoId = response.data.video.id
        setStatus('generating')
        await api.post(`/videos/${videoId}/transcription`, { prompt })
        setStatus('success')
    }

    const previewURL = useMemo(() => {
        if(!videoFile) return null
        return URL.createObjectURL(videoFile)
    }, [videoFile])

    return (
        <form onSubmit={handleUploadVideo} className="space-y-6">
            <label 
                htmlFor="video" 
                className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5">
                {previewURL 
                ? <video 
                    src={previewURL} 
                    controls={false} 
                    className="pointer-events-none absolute inset-0"    
                />
                : (<><FileVideo/> Selecione um vídeo</>)}
            </label>
            <input 
                type="file" 
                accept="video/mp4" 
                onChange={handleFileSelected}
                id="video" 
                className="sr-only" />

            <Separator/>

            <div className="space-y-2">
                <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
                <Textarea
                    disabled={status !== 'waiting'}
                    id="transcription_prompt" 
                    className="h-20 leading-relaxed resize-none"
                    ref={promptInputRef}
                    placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
                />
            </div>
            <Button 
                data-success={status === 'success'}
                disabled={status !== 'waiting'} 
                type="submit" 
                className="w-full data-[success=true]:bg-emerald-400"
            >
                {status === 'waiting' ? (
                    <>
                        Carregar vídeo
                        <Upload className="w-4 h-4 ml-2"/>
                    </>
                ) : (
                    statusMessages[status]
                )}
            </Button>
        </form>

    )
}

{/* <form className="space-y-6">
    <div className="space-y-2">
        <Label>Prompt</Label>
        <SelectContainer.Select>
        <SelectContainer.SelectTrigger>
            <SelectContainer.SelectValue placeholder="Selecione um prompt..."/>
        </SelectContainer.SelectTrigger>
        <SelectContainer.SelectContent>
            <SelectContainer.SelectItem value="title">Título do vídeo</SelectContainer.SelectItem>
            <SelectContainer.SelectItem value="description">Descrição do vídeo</SelectContainer.SelectItem>
        </SelectContainer.SelectContent>
        </SelectContainer.Select>
    </div>
    <div className="space-y-2">
        <Label>Modelo</Label>
        <SelectContainer.Select  disabled defaultValue="gpt3.5">
        <SelectContainer.SelectTrigger>
            <SelectContainer.SelectValue/>
        </SelectContainer.SelectTrigger>
        <SelectContainer.SelectContent>
            <SelectContainer.SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectContainer.SelectItem>
        </SelectContainer.SelectContent>
        </SelectContainer.Select>
        <span className="block text-xs text-muted-foreground italic">
        Você poderá customizar essa opção em breve
        </span>
    </div>

    <div className="space-y-4">
        <Label>Temperatura</Label>
        <Slider
        min={0}
        max={1}
        step={0.1}
        />
        <span className="block text-xs text-muted-foreground italic leading-relaxed">
        Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros
        </span>
    </div> 

    <Separator/>

    <Button type="submit" className="w-full">
        Executar
        <Wand2 className="w-4 h-4 ml-2"/>
    </Button>
</form> */}