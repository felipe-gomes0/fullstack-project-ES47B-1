import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Produto } from '../validators/api.ts'
import { QUANTIDADE_MAXIMA, lerCarrinhoSalvo, type ItemCarrinho } from '../validators/carrinho.ts'

const CHAVE_ARMAZENAMENTO = 'vitrine:carrinho'

type AcaoCarrinho =
  | { type: 'ADICIONAR'; produto: Produto; quantidade?: number }
  | { type: 'ALTERAR_QUANTIDADE'; id: number; quantidade: number }
  | { type: 'REMOVER'; id: number }
  | { type: 'LIMPAR' }

interface ValorCarrinho {
  itens: ItemCarrinho[]
  totalItens: number
  subtotal: number
  adicionar: (produto: Produto, quantidade?: number) => void
  alterarQuantidade: (id: number, quantidade: number) => void
  remover: (id: number) => void
  limpar: () => void
}

function limitarQuantidade(quantidade: number) {
  return Math.min(Math.max(Math.trunc(quantidade) || 1, 1), QUANTIDADE_MAXIMA)
}

// (estado atual, ação) → novo estado. O estado é a lista de itens do carrinho.
function carrinhoReducer(itens: ItemCarrinho[], acao: AcaoCarrinho): ItemCarrinho[] {
  switch (acao.type) {
    case 'ADICIONAR': {
      const { produto, quantidade = 1 } = acao
      const existente = itens.find((item) => item.id === produto.id)

      if (existente) {
        return itens.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: limitarQuantidade(item.quantidade + quantidade) }
            : item,
        )
      }
      return [
        ...itens,
        {
          id: produto.id,
          titulo: produto.titulo,
          preco: produto.preco,
          imagem: produto.imagens[0] ?? null,
          quantidade: limitarQuantidade(quantidade),
        },
      ]
    }
    case 'ALTERAR_QUANTIDADE':
      return itens.map((item) =>
        item.id === acao.id ? { ...item, quantidade: limitarQuantidade(acao.quantidade) } : item,
      )
    case 'REMOVER':
      return itens.filter((item) => item.id !== acao.id)
    case 'LIMPAR':
      return []
  }
}

// Inicialização preguiçosa: recupera o carrinho salvo na última visita.
function carregarCarrinhoSalvo(): ItemCarrinho[] {
  try {
    return lerCarrinhoSalvo(JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO) ?? 'null'))
  } catch {
    return []
  }
}

const CarrinhoContext = createContext<ValorCarrinho | null>(null)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, dispatch] = useReducer(carrinhoReducer, undefined, carregarCarrinhoSalvo)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(itens))
    } catch {
      // Armazenamento indisponível (aba anônima, por exemplo): o carrinho segue só em memória.
    }
  }, [itens])

  const valor = useMemo<ValorCarrinho>(() => {
    const totalItens = itens.reduce((soma, item) => soma + item.quantidade, 0)
    const subtotal = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0)

    return {
      itens,
      totalItens,
      subtotal,
      adicionar: (produto, quantidade) => dispatch({ type: 'ADICIONAR', produto, quantidade }),
      alterarQuantidade: (id, quantidade) =>
        dispatch({ type: 'ALTERAR_QUANTIDADE', id, quantidade }),
      remover: (id) => dispatch({ type: 'REMOVER', id }),
      limpar: () => dispatch({ type: 'LIMPAR' }),
    }
  }, [itens])

  return <CarrinhoContext value={valor}>{children}</CarrinhoContext>
}

// oxlint-disable-next-line react/only-export-components
export function useCarrinho() {
  const contexto = useContext(CarrinhoContext)
  if (!contexto) {
    throw new Error('useCarrinho deve ser usado dentro de <CarrinhoProvider>.')
  }
  return contexto
}
