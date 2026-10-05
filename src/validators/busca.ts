import { z } from 'zod'
import { validar } from './validar.ts'

/** O que a busca envia para a API: só os filtros que foram preenchidos. */
export interface Filtros {
  titulo?: string
  categoriaId?: number
  precoMin?: number
  precoMax?: number
}

/** Aceita "10", "10.5" e "10,5". Campo vazio vira null (filtro não informado). */
function preco(mensagem: string) {
  return z
    .string()
    .trim()
    .transform((texto) => texto.replace(',', '.'))
    .refine((texto) => texto === '' || /^\d+(\.\d{1,2})?$/.test(texto), mensagem)
    .transform((texto) => (texto === '' ? null : Number(texto)))
}

/** Campos do formulário → filtros da busca. */
const filtrosSchema = z
  .object({
    titulo: z
      .string()
      .trim()
      .refine((titulo) => titulo.length !== 1, 'Digite pelo menos 2 caracteres.'),
    categoriaId: z.number().int().positive().nullable(),
    precoMin: preco('Informe um valor válido, como 10 ou 10,50.'),
    precoMax: preco('Informe um valor válido, como 100 ou 99,90.').refine(
      (valor) => valor !== 0,
      'O preço máximo deve ser maior que zero.',
    ),
  })
  .refine(
    ({ precoMin, precoMax }) => precoMin == null || precoMax == null || precoMax >= precoMin,
    { path: ['precoMax'], message: 'O preço máximo deve ser maior ou igual ao mínimo.' },
  )
  .transform(({ titulo, categoriaId, precoMin, precoMax }) => {
    const filtros: Filtros = {}
    if (titulo) filtros.titulo = titulo
    if (categoriaId) filtros.categoriaId = categoriaId
    if (precoMin != null) filtros.precoMin = precoMin
    if (precoMax != null) filtros.precoMax = precoMax
    return filtros
  })

const buscaSchema = filtrosSchema.refine((filtros) => Object.keys(filtros).length > 0, {
  path: ['geral'],
  message: 'Preencha pelo menos um filtro para buscar.',
})

export type CamposBusca = z.input<typeof filtrosSchema>

/**
 * Validação ANTES do envio: nenhum erro aqui chega a virar requisição.
 * Com permitirVazio, nenhum filtro preenchido é aceito (volta ao catálogo inicial).
 */
export function validarBusca(campos: CamposBusca, { permitirVazio = false } = {}) {
  return validar(permitirVazio ? filtrosSchema : buscaSchema, campos)
}
