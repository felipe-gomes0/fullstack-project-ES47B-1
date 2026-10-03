import { Toast } from '@heroui/react'
import { useState } from 'react'
import Carrinho from './components/Carrinho.tsx'
import DetalheProduto from './components/DetalheProduto.tsx'
import FormBusca from './components/FormBusca.tsx'
import Header from './components/Header.tsx'
import ListaProdutos from './components/ListaProdutos.tsx'
import type { Produto } from './validators/api.ts'

function App() {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [detalheAberto, setDetalheAberto] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)

  function abrirDetalhes(produto: Produto) {
    setProdutoSelecionado(produto)
    setDetalheAberto(true)
  }

  return (
    <div id="topo">
      <Header onAbrirCarrinho={() => setCarrinhoAberto(true)} />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <div className="mb-6">
          <h1 className="text-4xl font-semibold tracking-tight">Catálogo</h1>
          <p className="mt-1 text-muted">
            Busque por nome, categoria ou faixa de preço e monte o seu carrinho.
          </p>
        </div>

        <FormBusca />

        <div className="mt-8">
          <ListaProdutos onVerDetalhes={abrirDetalhes} />
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        Dados fornecidos pela Platzi Fake Store API.
      </footer>

      <DetalheProduto
        aberto={detalheAberto}
        produto={produtoSelecionado}
        onFechar={() => setDetalheAberto(false)}
      />
      <Carrinho aberto={carrinhoAberto} onFechar={() => setCarrinhoAberto(false)} />
      <Toast.Provider placement="top" />
    </div>
  )
}

export default App
