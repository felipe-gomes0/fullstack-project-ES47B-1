import { Alert, Button, Skeleton } from '@heroui/react'
import { useEffect } from 'react'
import { PRODUTOS_POR_PAGINA, useProdutos } from '../contexts/ProdutosContext.tsx'
import type { Categoria, Produto } from '../validators/api.ts'
import type { Filtros } from '../validators/busca.ts'
import CardProduto from './CardProduto.tsx'
import { IconeBusca } from './Icones.tsx'

const GRADE = 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

function descreverFiltros(filtros: Filtros, categorias: Categoria[]) {
  const partes = []
  if (filtros.titulo) partes.push(`"${filtros.titulo}"`)
  if (filtros.categoriaId) {
    const categoria = categorias.find((item) => item.id === filtros.categoriaId)
    if (categoria) partes.push(`categoria ${categoria.nome}`)
  }
  if (filtros.precoMin != null && filtros.precoMax != null) {
    partes.push(`de US$ ${filtros.precoMin} a US$ ${filtros.precoMax}`)
  } else if (filtros.precoMin != null) {
    partes.push(`a partir de US$ ${filtros.precoMin}`)
  } else if (filtros.precoMax != null) {
    partes.push(`até US$ ${filtros.precoMax}`)
  }
  return partes.join(', ')
}

/**
 * Faz a carga inicial do catálogo ao aparecer na tela e renderiza um dos quatro
 * estados da busca: carregando, erro (resposta da API ou falha de rede, depois
 * do envio), vazio ou sucesso.
 */
function ListaProdutos({ onVerDetalhes }: { onVerDetalhes: (produto: Produto) => void }) {
  const {
    produtos,
    categorias,
    filtros,
    carregando,
    carregandoMais,
    erro,
    erroMais,
    temMais,
    buscarProdutos,
    carregarMais,
  } = useProdutos()

  useEffect(() => {
    buscarProdutos()
  }, [buscarProdutos])

  const resumoFiltros = descreverFiltros(filtros, categorias)

  if (carregando) {
    return (
      <div aria-busy="true" aria-label="Carregando produtos" className={GRADE}>
        {Array.from({ length: PRODUTOS_POR_PAGINA }, (_, indice) => (
          <div key={indice} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-4 w-1/3 rounded-lg" />
            <Skeleton className="h-4 w-4/5 rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (erro) {
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Não foi possível carregar os produtos</Alert.Title>
          <Alert.Description>{erro}</Alert.Description>
        </Alert.Content>
        <Button size="sm" variant="danger-soft" onPress={() => buscarProdutos(filtros)}>
          Tentar novamente
        </Button>
      </Alert>
    )
  }

  if (produtos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-secondary text-muted">
          <IconeBusca tamanho={22} />
        </span>
        <h2 className="text-lg font-semibold">Nenhum produto encontrado</h2>
        <p className="max-w-sm text-sm text-muted">
          {resumoFiltros
            ? `Não há resultados para ${resumoFiltros}. Tente outros termos ou use "Limpar filtros".`
            : 'O catálogo está vazio no momento.'}
        </p>
      </div>
    )
  }

  return (
    <section aria-label="Produtos">
      <p aria-live="polite" className="mb-4 text-sm text-muted">
        {resumoFiltros
          ? `${produtos.length} ${produtos.length === 1 ? 'resultado' : 'resultados'} para ${resumoFiltros}`
          : `Exibindo ${produtos.length} produtos do catálogo`}
      </p>

      <ul className={GRADE}>
        {produtos.map((produto) => (
          <li key={produto.id}>
            <CardProduto produto={produto} onVerDetalhes={onVerDetalhes} />
          </li>
        ))}
      </ul>

      {erroMais && (
        <p className="mt-6 text-center text-sm text-danger" role="alert">
          Não foi possível carregar mais produtos: {erroMais}
        </p>
      )}

      {temMais && (
        <div className="mt-8 flex justify-center">
          <Button isPending={carregandoMais} variant="secondary" onPress={carregarMais}>
            {carregandoMais ? 'Carregando...' : 'Carregar mais produtos'}
          </Button>
        </div>
      )}
    </section>
  )
}

export default ListaProdutos
