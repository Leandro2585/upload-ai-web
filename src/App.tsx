import { FileVideo, Github, Upload, Wand2 } from 'lucide-react'
import { Button, Label, SelectContainer, Separator, Slider, Textarea } from './components/ui'

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Upload AI</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Desenvolvido com ❤ no NLW</span>
          
          <Separator orientation="vertical" className="h-6"/>
          
          <Button variant="outline">
            <Github className="w-4 h-4"/>
            Github
          </Button>
        </div>
      </div>
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea 
              placeholder="Inclua o prompt para a IA..."
              
              className="resize-none p-4 leading-relaxed"
            />
            <Textarea 
              placeholder="Resultado gerado pela IA..." 
              readOnly
              className="resize-none p-4 leading-relaxed"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável <code className="text-violet-400">{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label htmlFor="video" className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5">
              <FileVideo/>
              Selecione um vídeo
            </label>
            <input type="file" accept="video/mp4" id="video" className="sr-only" />

            <Separator/>

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
              <Textarea 
                id="transcription_prompt" 
                className="h-20 leading-relaxed resize-none"
                placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
              />
            </div>
            <Button type="submit" className="w-full">
              Carregar vídeo
              <Upload className="w-4 h-4 ml-2"/>
            </Button>
          </form>

          <Separator/>

          <form className="space-y-6">
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
          </form>
        </aside>
      </main>
    </div>
  )
}

