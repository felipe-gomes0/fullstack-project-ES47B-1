import { Button } from '@heroui/react'
import { QUANTIDADE_MAXIMA } from '../validators/carrinho.ts'
import { IconeMais, IconeMenos } from './Icones.tsx'

interface SeletorQuantidadeProps {
  quantidade: number
  onAlterar: (quantidade: number) => void
  rotulo: string
}

function SeletorQuantidade({ quantidade, onAlterar, rotulo }: SeletorQuantidadeProps) {
  return (
    <div aria-label={rotulo} className="flex items-center gap-1" role="group">
      <Button
        isIconOnly
        aria-label="Diminuir quantidade"
        isDisabled={quantidade <= 1}
        size="sm"
        variant="tertiary"
        onPress={() => onAlterar(quantidade - 1)}
      >
        <IconeMenos tamanho={16} />
      </Button>
      <span aria-live="polite" className="w-8 text-center text-sm font-medium tabular-nums">
        {quantidade}
      </span>
      <Button
        isIconOnly
        aria-label="Aumentar quantidade"
        isDisabled={quantidade >= QUANTIDADE_MAXIMA}
        size="sm"
        variant="tertiary"
        onPress={() => onAlterar(quantidade + 1)}
      >
        <IconeMais tamanho={16} />
      </Button>
    </div>
  )
}

export default SeletorQuantidade
