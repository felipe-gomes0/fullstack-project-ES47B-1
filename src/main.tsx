import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CarrinhoProvider } from './contexts/CarrinhoContext.tsx'
import { ProdutosProvider } from './contexts/ProdutosContext.tsx'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('Elemento #root não encontrado no index.html.')

createRoot(raiz).render(
  <StrictMode>
    <ProdutosProvider>
      <CarrinhoProvider>
        <App />
      </CarrinhoProvider>
    </ProdutosProvider>
  </StrictMode>,
)
