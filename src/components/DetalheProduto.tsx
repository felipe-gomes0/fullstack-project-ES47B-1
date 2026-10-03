import { Button, Chip, Modal, toast } from '@heroui/react'
import { useState } from 'react'
import { useCarrinho } from '../contexts/CarrinhoContext.tsx'
import type { Produto } from '../validators/api.ts'
import ImagemProduto from './ImagemProduto.tsx'
import Preco from './Preco.tsx'
import SeletorQuantidade from './SeletorQuantidade.tsx'

function ConteudoDetalhe({ produto, onFechar }: { produto: Produto; onFechar: () => void }) {
  const { adicionar } = useCarrinho()
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const [quantidade, setQuantidade] = useState(1)

  function handleAdicionar() {
    adicionar(produto, quantidade)
    toast.success('Adicionado ao carrinho', {
      description: `${quantidade} × ${produto.titulo}`,
    })
    onFechar()
  }

  return (
    <>
      <Modal.Header>
        <Chip className="self-start" size="sm" variant="soft">
          {produto.categoria}
        </Chip>
        <Modal.Heading>{produto.titulo}</Modal.Heading>
      </Modal.Header>

      <Modal.Body className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-3">
          <ImagemProduto
            key={produto.imagens[imagemAtiva]}
            alt={produto.titulo}
            className="aspect-square w-full rounded-xl"
            src={produto.imagens[imagemAtiva]}
          />
          {produto.imagens.length > 1 && (
            <div className="flex gap-2">
              {produto.imagens.slice(0, 4).map((imagem, indice) => (
                <button
                  key={imagem}
                  aria-label={`Ver imagem ${indice + 1}`}
                  aria-pressed={indice === imagemAtiva}
                  className={`size-14 cursor-pointer overflow-hidden rounded-lg border-2 ${
                    indice === imagemAtiva ? 'border-accent' : 'border-transparent'
                  }`}
                  type="button"
                  onClick={() => setImagemAtiva(indice)}
                >
                  <ImagemProduto alt="" className="size-full" src={imagem} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Preco className="text-2xl font-semibold" valor={produto.preco} />
          <p className="text-sm leading-6 text-muted">
            {produto.descricao || 'Este produto não tem descrição.'}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Quantidade</span>
            <SeletorQuantidade
              quantidade={quantidade}
              rotulo="Quantidade do produto"
              onAlterar={setQuantidade}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="tertiary" onPress={onFechar}>
          Continuar comprando
        </Button>
        <Button onPress={handleAdicionar}>
          Adicionar ao carrinho · <Preco valor={produto.preco * quantidade} />
        </Button>
      </Modal.Footer>
    </>
  )
}

// O detalhe abre em um Modal sobre a lista: a página nunca é trocada (SPA).
interface DetalheProdutoProps {
  produto: Produto | null
  aberto: boolean
  onFechar: () => void
}

function DetalheProduto({ produto, aberto, onFechar }: DetalheProdutoProps) {
  return (
    <Modal.Backdrop isOpen={aberto} onOpenChange={(estaAberto) => !estaAberto && onFechar()}>
      <Modal.Container size="lg">
        <Modal.Dialog>
          <Modal.CloseTrigger aria-label="Fechar detalhes" />
          {produto && <ConteudoDetalhe key={produto.id} produto={produto} onFechar={onFechar} />}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}

export default DetalheProduto
