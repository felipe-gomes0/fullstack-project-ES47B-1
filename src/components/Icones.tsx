import type { ReactNode } from 'react'

interface IconeProps {
  tamanho?: number
}

// Ícones em SVG usados na interface. Herdam a cor do texto (currentColor).
function Icone({ children, tamanho = 20 }: IconeProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={tamanho}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={tamanho}
    >
      {children}
    </svg>
  )
}

export function IconeSacola(props: IconeProps) {
  return (
    <Icone {...props}>
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </Icone>
  )
}

export function IconeBusca(props: IconeProps) {
  return (
    <Icone {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Icone>
  )
}

export function IconeLixeira(props: IconeProps) {
  return (
    <Icone {...props}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </Icone>
  )
}

export function IconeMais(props: IconeProps) {
  return (
    <Icone {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icone>
  )
}

export function IconeMenos(props: IconeProps) {
  return (
    <Icone {...props}>
      <path d="M5 12h14" />
    </Icone>
  )
}

export function IconeImagem(props: IconeProps) {
  return (
    <Icone {...props}>
      <rect height="16" rx="2" width="18" x="3" y="4" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m4 18 5-5 4 4 3-3 4 4" />
    </Icone>
  )
}

export function IconeConfirmado(props: IconeProps) {
  return (
    <Icone {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.8 2.8L16 9.5" />
    </Icone>
  )
}
