import { z } from 'zod'
import { validar } from './validar.ts'

const checkoutSchema = z.object({
  nome: z
    .string()
    .trim()
    .refine((nome) => nome.split(/\s+/).filter(Boolean).length >= 2, 'Informe nome e sobrenome.'),
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Informe um e-mail válido, como nome@exemplo.com.'),
  cep: z.string().refine((cep) => cep.replace(/\D/g, '').length === 8, 'O CEP deve ter 8 dígitos.'),
  endereco: z.string().trim().min(8, 'Informe rua, número e bairro.'),
})

export type CamposCheckout = z.input<typeof checkoutSchema>
export type Cliente = z.output<typeof checkoutSchema>

export function validarCheckout(campos: CamposCheckout) {
  return validar(checkoutSchema, campos)
}
