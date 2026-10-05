import { z } from 'zod'

const RESPOSTA_INESPERADA = 'A API devolveu uma resposta em formato inesperado.'

/** Algumas imagens da API chegam como texto com colchetes e aspas: '["https://..."]'. */
function normalizarImagens(imagens: unknown): string[] {
  if (!Array.isArray(imagens)) return []
  return imagens
    .map((imagem) =>
      String(imagem)
        .replace(/[[\]"\\]/g, '')
        .trim(),
    )
    .filter((imagem) => imagem.startsWith('http'))
}

/** Produto como vem da API → produto como a loja usa. */
const produtoSchema = z
  .object({
    id: z.number(),
    title: z.string().nullish(),
    price: z.unknown(),
    description: z.string().nullish(),
    category: z.object({ name: z.string().nullish() }).nullish(),
    images: z.unknown(),
  })
  .transform((produto) => ({
    id: produto.id,
    titulo: produto.title ?? 'Produto sem nome',
    preco: Number(produto.price) || 0,
    descricao: produto.description ?? '',
    categoria: produto.category?.name ?? 'Sem categoria',
    imagens: normalizarImagens(produto.images),
  }))

const categoriaSchema = z
  .object({ id: z.number(), name: z.string() })
  .transform((categoria) => ({ id: categoria.id, nome: categoria.name }))

export type Produto = z.output<typeof produtoSchema>
export type Categoria = z.output<typeof categoriaSchema>

/** A resposta precisa ser uma lista; itens fora do formato são descartados sem derrubar os demais. */
function lerLista<Schema extends z.ZodType>(schema: Schema, dados: unknown): z.output<Schema>[] {
  if (!Array.isArray(dados)) throw new Error(RESPOSTA_INESPERADA)

  return dados.flatMap((item) => {
    const resultado = schema.safeParse(item)
    return resultado.success ? [resultado.data] : []
  })
}

export function lerProdutos(dados: unknown): Produto[] {
  return lerLista(produtoSchema, dados)
}

export function lerCategorias(dados: unknown): Categoria[] {
  return lerLista(categoriaSchema, dados)
}
