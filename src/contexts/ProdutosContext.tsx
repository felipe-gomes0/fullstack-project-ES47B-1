import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { lerCategorias, lerProdutos, type Categoria, type Produto } from '../validators/api.ts'
import type { Filtros } from '../validators/busca.ts'

const API_URL: string = import.meta.env.VITE_API_URL ?? 'https://api.escuelajs.co/api/v1'

export const PRODUTOS_POR_PAGINA = 12

/** A API só aplica o filtro de preço quando recebe o mínimo e o máximo juntos. */
const PRECO_MINIMO_PADRAO = 1
const PRECO_MAXIMO_PADRAO = 1000000

function ehAbortError(erro: unknown) {
  return erro instanceof Error && erro.name === 'AbortError'
}

function mensagemDoErro(erro: unknown) {
  return erro instanceof Error ? erro.message : String(erro)
}

/** Faz a requisição e concentra o tratamento de erros de rede e de HTTP. */
async function requisicao(
  caminho: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<unknown> {
  let resposta
  try {
    resposta = await fetch(`${API_URL}${caminho}`, { signal })
  } catch (erro) {
    if (ehAbortError(erro)) throw erro
    throw new Error('Não foi possível conectar à API. Verifique sua conexão.', { cause: erro })
  }

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    const mensagem = Array.isArray(dados?.message) ? dados.message.join(' ') : dados?.message
    throw new Error(mensagem ?? `A API respondeu com erro ${resposta.status}.`)
  }
  return dados
}

function montarParametros(filtros: Filtros, offset: number) {
  const parametros = new URLSearchParams({
    limit: String(PRODUTOS_POR_PAGINA),
    offset: String(offset),
  })

  if (filtros.titulo) parametros.set('title', filtros.titulo)
  if (filtros.categoriaId) parametros.set('categoryId', String(filtros.categoriaId))
  if (filtros.precoMin != null || filtros.precoMax != null) {
    parametros.set('price_min', String(Math.max(filtros.precoMin ?? 0, PRECO_MINIMO_PADRAO)))
    parametros.set('price_max', String(filtros.precoMax ?? PRECO_MAXIMO_PADRAO))
  }
  return parametros
}

interface EstadoProdutos {
  produtos: Produto[]
  categorias: Categoria[]
  filtros: Filtros
  carregando: boolean
  carregandoMais: boolean
  erro: string | null
  erroMais: string | null
  temMais: boolean
}

type AcaoProdutos =
  | { type: 'BUSCA_INICIOU'; filtros: Filtros }
  | { type: 'BUSCA_SUCESSO'; produtos: Produto[]; temMais: boolean }
  | { type: 'BUSCA_ERRO'; erro: string }
  | { type: 'MAIS_INICIOU' }
  | { type: 'MAIS_SUCESSO'; produtos: Produto[]; temMais: boolean }
  | { type: 'MAIS_ERRO'; erro: string }
  | { type: 'CATEGORIAS_CARREGADAS'; categorias: Categoria[] }

interface ValorProdutos extends EstadoProdutos {
  buscarProdutos: (filtros?: Filtros) => Promise<void>
  carregarMais: () => Promise<void>
  carregarCategorias: (signal?: AbortSignal) => Promise<void>
}

const estadoInicial: EstadoProdutos = {
  produtos: [],
  categorias: [],
  filtros: {},
  carregando: true,
  carregandoMais: false,
  erro: null,
  erroMais: null,
  temMais: false,
}

function produtosReducer(estado: EstadoProdutos, acao: AcaoProdutos): EstadoProdutos {
  switch (acao.type) {
    case 'BUSCA_INICIOU':
      return { ...estado, carregando: true, erro: null, erroMais: null, filtros: acao.filtros }
    case 'BUSCA_SUCESSO':
      return { ...estado, carregando: false, produtos: acao.produtos, temMais: acao.temMais }
    case 'BUSCA_ERRO':
      return { ...estado, carregando: false, erro: acao.erro, produtos: [], temMais: false }
    case 'MAIS_INICIOU':
      return { ...estado, carregandoMais: true, erroMais: null }
    case 'MAIS_SUCESSO':
      return {
        ...estado,
        carregandoMais: false,
        produtos: [...estado.produtos, ...acao.produtos],
        temMais: acao.temMais,
      }
    case 'MAIS_ERRO':
      return { ...estado, carregandoMais: false, erroMais: acao.erro }
    case 'CATEGORIAS_CARREGADAS':
      return { ...estado, categorias: acao.categorias }
  }
}

const ProdutosContext = createContext<ValorProdutos | null>(null)

export function ProdutosProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(produtosReducer, estadoInicial)
  const buscaAtual = useRef<AbortController | null>(null)

  /** GET /products com os filtros na query string (sem filtros = catálogo inicial). */
  const buscarProdutos = useCallback(async (filtros: Filtros = {}) => {
    buscaAtual.current?.abort()
    const controlador = new AbortController()
    buscaAtual.current = controlador

    dispatch({ type: 'BUSCA_INICIOU', filtros })
    try {
      const dados = await requisicao(`/products?${montarParametros(filtros, 0)}`, {
        signal: controlador.signal,
      })
      const produtos = lerProdutos(dados)
      dispatch({
        type: 'BUSCA_SUCESSO',
        produtos,
        temMais: produtos.length === PRODUTOS_POR_PAGINA,
      })
    } catch (erro) {
      if (!ehAbortError(erro)) dispatch({ type: 'BUSCA_ERRO', erro: mensagemDoErro(erro) })
    }
  }, [])

  /** GET /products com offset: próxima página da busca atual. */
  const carregarMais = useCallback(async () => {
    const controlador = new AbortController()
    buscaAtual.current = controlador

    dispatch({ type: 'MAIS_INICIOU' })
    try {
      const parametros = montarParametros(estado.filtros, estado.produtos.length)
      const dados = await requisicao(`/products?${parametros}`, { signal: controlador.signal })
      const produtos = lerProdutos(dados)
      dispatch({
        type: 'MAIS_SUCESSO',
        produtos,
        temMais: produtos.length === PRODUTOS_POR_PAGINA,
      })
    } catch (erro) {
      if (!ehAbortError(erro)) dispatch({ type: 'MAIS_ERRO', erro: mensagemDoErro(erro) })
    }
  }, [estado.filtros, estado.produtos.length])

  /**
   * GET /categories: opções do filtro de categoria. A falha é ignorada:
   * sem categorias, a busca continua funcionando pelos outros filtros.
   */
  const carregarCategorias = useCallback(async (signal?: AbortSignal) => {
    try {
      const dados = await requisicao('/categories', { signal })
      dispatch({ type: 'CATEGORIAS_CARREGADAS', categorias: lerCategorias(dados) })
    } catch {}
  }, [])

  const valor = useMemo(
    () => ({ ...estado, buscarProdutos, carregarMais, carregarCategorias }),
    [estado, buscarProdutos, carregarMais, carregarCategorias],
  )

  return <ProdutosContext value={valor}>{children}</ProdutosContext>
}

// oxlint-disable-next-line react/only-export-components
export function useProdutos() {
  const contexto = useContext(ProdutosContext)
  if (!contexto) {
    throw new Error('useProdutos deve ser usado dentro de <ProdutosProvider>.')
  }
  return contexto
}
