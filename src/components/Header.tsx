import { Badge, Button } from '@heroui/react'
import { useCarrinho } from '../contexts/CarrinhoContext.tsx'
import { IconeSacola } from './Icones.tsx'

function Header({ onAbrirCarrinho }: { onAbrirCarrinho: () => void }) {
  const { totalItens } = useCarrinho()

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a className="flex items-center gap-2 text-lg font-semibold tracking-tight" href="#topo">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <IconeSacola tamanho={18} />
          </span>
          Vitrine
        </a>

        <Badge.Anchor>
          <Button
            aria-label={`Abrir carrinho, ${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`}
            variant="secondary"
            onPress={onAbrirCarrinho}
          >
            <IconeSacola tamanho={18} />
            Carrinho
          </Button>
          {totalItens > 0 && (
            <Badge color="accent" size="sm">
              {totalItens}
            </Badge>
          )}
        </Badge.Anchor>
      </div>
    </header>
  )
}

export default Header
