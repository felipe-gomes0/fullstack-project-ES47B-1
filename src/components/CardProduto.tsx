import { Button, Card, Chip, toast } from '@heroui/react'
import { useCarrinho } from '../contexts/CarrinhoContext.tsx'
import type { Produto } from '../validators/api.ts'
import ImagemProduto from './ImagemProduto.tsx'
import Preco from './Preco.tsx'

interface CardProdutoProps {
  produto: Produto
  onVerDetalhes: (produto: Produto) => void
}

function CardProduto({ produto, onVerDetalhes }: CardProdutoProps) {
  const { adicionar } = useCarrinho()

  function handleAdicionar() {
    adicionar(produto, 1)
    toast.success('Adicionado ao carrinho', { description: produto.titulo })
  }

  return (
    <Card className="h-full gap-0 overflow-hidden p-0">
      <button
        aria-label={`Ver detalhes de ${produto.titulo}`}
        className="block aspect-square w-full cursor-pointer overflow-hidden"
        type="button"
        onClick={() => onVerDetalhes(produto)}
      >
        <ImagemProduto
          alt={produto.titulo}
          className="size-full transition-transform duration-300 hover:scale-105"
          src={produto.imagens[0]}
        />
      </button>

      <Card.Header className="gap-2 p-4 pb-2">
        <Chip className="self-start" size="sm" variant="soft">
          {produto.categoria}
        </Chip>
        <Card.Title className="line-clamp-2 min-h-12 text-base leading-6">
          {produto.titulo}
        </Card.Title>
      </Card.Header>

      <Card.Content className="px-4">
        <Preco className="text-lg font-semibold" valor={produto.preco} />
      </Card.Content>

      <Card.Footer className="mt-auto flex gap-2 p-4 pt-3">
        <Button className="flex-1" size="sm" variant="tertiary" onPress={() => onVerDetalhes(produto)}>
          Detalhes
        </Button>
        <Button className="flex-1" size="sm" onPress={handleAdicionar}>
          Adicionar
        </Button>
      </Card.Footer>
    </Card>
  )
}

export default CardProduto
