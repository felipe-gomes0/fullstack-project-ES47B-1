// A API informa os preços em dólar; a formatação segue o padrão brasileiro.
const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' })

function Preco({ valor, className }: { valor: number; className?: string }) {
  return <span className={className}>{formatoMoeda.format(valor)}</span>
}

export default Preco
