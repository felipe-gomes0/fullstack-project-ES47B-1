import { Button, Drawer, toast } from '@heroui/react'
import { useState } from 'react'
import { useCarrinho } from '../contexts/CarrinhoContext.tsx'
import type { ItemCarrinho as Item } from '../validators/carrinho.ts'
import type { Cliente } from '../validators/checkout.ts'
import FormCheckout from './FormCheckout.tsx'
import { IconeConfirmado, IconeLixeira, IconeSacola } from './Icones.tsx'
import ImagemProduto from './ImagemProduto.tsx'
import Preco from './Preco.tsx'
import SeletorQuantidade from './SeletorQuantidade.tsx'

type Etapa = 'itens' | 'checkout' | 'concluido'

interface Pedido {
  numero: string
  cliente: Cliente
  total: number
  quantidade: number
}

const TITULOS: Record<Etapa, string> = {
  itens: 'Seu carrinho',
  checkout: 'Finalizar compra',
  concluido: 'Pedido confirmado',
}

function ItemCarrinho({ item }: { item: Item }) {
  const { alterarQuantidade, remover } = useCarrinho()

  return (
    <li className="flex gap-3 py-4">
      <ImagemProduto alt="" className="size-16 shrink-0 rounded-lg" src={item.imagem} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium text-foreground">{item.titulo}</p>
          <Button
            isIconOnly
            aria-label={`Remover ${item.titulo} do carrinho`}
            size="sm"
            variant="ghost"
            onPress={() => remover(item.id)}
          >
            <IconeLixeira tamanho={16} />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <SeletorQuantidade
            quantidade={item.quantidade}
            rotulo={`Quantidade de ${item.titulo}`}
            onAlterar={(quantidade) => alterarQuantidade(item.id, quantidade)}
          />
          <Preco
            className="text-sm font-semibold text-foreground"
            valor={item.preco * item.quantidade}
          />
        </div>
      </div>
    </li>
  )
}

function Carrinho({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  const { itens, totalItens, subtotal, limpar } = useCarrinho()
  const [etapa, setEtapa] = useState<Etapa>('itens')
  const [pedido, setPedido] = useState<Pedido | null>(null)

  function handleFechar() {
    onFechar()
    if (etapa !== 'itens') setEtapa('itens')
  }

  function handleConfirmar(cliente: Cliente) {
    setPedido({
      numero: Date.now().toString().slice(-6),
      cliente,
      total: subtotal,
      quantidade: totalItens,
    })
    limpar()
    setEtapa('concluido')
    toast.success('Pedido confirmado')
  }

  return (
    <Drawer.Backdrop isOpen={aberto} onOpenChange={(estaAberto) => !estaAberto && handleFechar()}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="sm:max-w-md">
          <Drawer.CloseTrigger aria-label="Fechar carrinho" />
          <Drawer.Header>
            <Drawer.Heading>{TITULOS[etapa]}</Drawer.Heading>
          </Drawer.Header>

          <Drawer.Body>
            {etapa === 'concluido' && pedido && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="text-success">
                  <IconeConfirmado tamanho={48} />
                </span>
                <p className="text-lg font-semibold">
                  Obrigado, {pedido.cliente.nome.split(' ')[0]}!
                </p>
                <p className="text-sm text-muted">
                  Pedido nº {pedido.numero} com {pedido.quantidade}{' '}
                  {pedido.quantidade === 1 ? 'item' : 'itens'}, no total de{' '}
                  <Preco className="font-medium text-foreground" valor={pedido.total} />.
                </p>
                <p className="text-sm text-muted">
                  Entrega em {pedido.cliente.endereco}, CEP {pedido.cliente.cep}.
                </p>
              </div>
            )}

            {etapa === 'checkout' && (
              <FormCheckout onConfirmar={handleConfirmar} onVoltar={() => setEtapa('itens')} />
            )}

            {etapa === 'itens' && itens.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-surface-secondary text-muted">
                  <IconeSacola tamanho={22} />
                </span>
                <p className="font-medium">Seu carrinho está vazio</p>
                <p className="text-sm text-muted">
                  Adicione produtos do catálogo para vê-los aqui.
                </p>
              </div>
            )}

            {etapa === 'itens' && itens.length > 0 && (
              <ul className="divide-y divide-border">
                {itens.map((item) => (
                  <ItemCarrinho key={item.id} item={item} />
                ))}
              </ul>
            )}
          </Drawer.Body>

          {etapa === 'itens' && itens.length > 0 && (
            <Drawer.Footer className="flex-col items-stretch gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">
                  Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'})
                </span>
                <Preco className="text-lg font-semibold" valor={subtotal} />
              </div>
              <Button fullWidth onPress={() => setEtapa('checkout')}>
                Finalizar compra
              </Button>
              <Button fullWidth variant="tertiary" onPress={limpar}>
                Esvaziar carrinho
              </Button>
            </Drawer.Footer>
          )}

          {etapa === 'concluido' && (
            <Drawer.Footer>
              <Button fullWidth onPress={handleFechar}>
                Continuar comprando
              </Button>
            </Drawer.Footer>
          )}
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  )
}

export default Carrinho
