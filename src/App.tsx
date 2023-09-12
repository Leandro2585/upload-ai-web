import { Github } from 'lucide-react'
import { Button, Separator } from './components/ui'

export const App = () => {
  return (
    <div>
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
    </div>
  )
}

