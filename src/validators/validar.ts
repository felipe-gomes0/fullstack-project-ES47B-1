import type { z } from 'zod'

// Uma mensagem por campo; "geral" guarda os erros que não pertencem a um campo só.
export type Erros<Campos> = Partial<Record<keyof Campos | 'geral', string>>

export type Resultado<Schema extends z.ZodType> =
  | { dados: z.output<Schema>; erros: Erros<z.input<Schema>> }
  | { dados: null; erros: Erros<z.input<Schema>> }

// Roda um schema do zod e devolve o formato que os formulários usam:
// { dados } já tratados quando é válido, ou { erros } com uma mensagem por campo.
export function validar<Schema extends z.ZodType>(
  schema: Schema,
  valores: z.input<Schema>,
): Resultado<Schema> {
  const resultado = schema.safeParse(valores)
  if (resultado.success) return { dados: resultado.data, erros: {} }

  const erros: Record<string, string> = {}
  for (const problema of resultado.error.issues) {
    const campo = String(problema.path[0] ?? 'geral')
    erros[campo] ??= problema.message
  }
  return { dados: null, erros: erros as Erros<z.input<Schema>> }
}
