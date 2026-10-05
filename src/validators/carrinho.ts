import { z } from 'zod'

export const QUANTIDADE_MAXIMA = 99

const itemCarrinhoSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  preco: z.number().nonnegative(),
  imagem: z.string().nullable(),
  quantidade: z.number().int().min(1).max(QUANTIDADE_MAXIMA),
})

export type ItemCarrinho = z.output<typeof itemCarrinhoSchema>

/** O localStorage pode ter sido editado ou vir de uma versão antiga: fica só o que é item válido. */
export function lerCarrinhoSalvo(valor: unknown): ItemCarrinho[] {
  if (!Array.isArray(valor)) return []
  return valor.flatMap((item) => {
    const resultado = itemCarrinhoSchema.safeParse(item)
    return resultado.success ? [resultado.data] : []
  })
}
