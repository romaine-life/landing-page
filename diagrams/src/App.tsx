import { useState } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom'
import DiagramView from './components/DiagramView'
import PipelineView from './components/PipelineView'
import NavSidebar from './components/NavSidebar'
import EmotionsView from './components/EmotionsView'
import FztArchView from './components/FztArchView'
import FztProposedView from './components/FztProposedView'
import FztReposView from './components/FztReposView'
import FztSharedView from './components/FztSharedView'
import FztToolPage from './components/FztToolPage'
import FztMatrixView from './components/FztMatrixView'
import FztFinalView from './components/FztFinalView'
import FztKeyboardView from './components/FztKeyboardView'
import CertConceptsView from './components/CertConceptsView'
import SpireLensWorkflowView from './components/SpireLensWorkflowView'
import TankGithubMcpView from './components/TankGithubMcpView'
import type { AppName } from './types'
import { APP_NAMES } from './types'

function DiagramPage() {
  const { app } = useParams<{ app: string }>()
  const navigate = useNavigate()

  const selectedApp = app && APP_NAMES.includes(app as AppName) ? (app as AppName) : null

  const [localSelected, setLocalSelected] = useState<AppName | null>(selectedApp)

  const handleSelect = (newApp: AppName | null) => {
    setLocalSelected(newApp)
    navigate(newApp ? `/${newApp}` : '/', { replace: true })
  }

  return <DiagramView selectedApp={localSelected} onSelectApp={handleSelect} />
}

export default function App() {
  return (
    <BrowserRouter basename="/diagrams">
      <NavSidebar />
      <Routes>
        <Route path="/" element={<DiagramPage />} />
        <Route path="/pipelines" element={<PipelineView />} />
        <Route path="/fzt" element={<FztArchView />} />
        <Route path="/fzt/proposed" element={<FztProposedView />} />
        <Route path="/fzt/repos" element={<FztReposView />} />
        <Route path="/fzt/shared" element={<FztSharedView />} />
        <Route path="/fzt/tool/:tool" element={<FztToolPage />} />
        <Route path="/fzt/matrix" element={<FztMatrixView />} />
        <Route path="/fzt/final" element={<FztFinalView />} />
        <Route path="/fzt/keyboard" element={<FztKeyboardView />} />
        <Route path="/certs" element={<CertConceptsView />} />
        <Route path="/spirelens" element={<SpireLensWorkflowView />} />
        <Route path="/tank-operator/mcp-github" element={<TankGithubMcpView />} />
        <Route path="/emotions" element={<EmotionsView />} />
        <Route path="/:app" element={<DiagramPage />} />
      </Routes>
    </BrowserRouter>
  )
}
