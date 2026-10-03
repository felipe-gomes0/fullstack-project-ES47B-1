import { useState } from 'react'
import { IconeImagem } from './Icones.tsx'

interface ImagemProdutoProps {
  src?: string | null
  alt: string
  className?: string
}

// Os dados da API são públicos e editáveis, então alguns links de imagem
// estão quebrados. Nesse caso, mostra um espaço reservado no lugar.
function ImagemProduto({ src, alt, className = '' }: ImagemProdutoProps) {
  const [falhou, setFalhou] = useState(false)

  if (!src || falhou) {
    return (
      <div
        aria-label={alt}
        className={`flex items-center justify-center bg-surface-secondary text-muted ${className}`}
        role="img"
      >
        <IconeImagem tamanho={28} />
      </div>
    )
  }

  return (
    <img
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      src={src}
      onError={() => setFalhou(true)}
    />
  )
}

export default ImagemProduto
