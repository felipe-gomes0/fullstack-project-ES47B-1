import { Button, FieldError, Input, Label, TextField } from '@heroui/react'
import { useState, type FormEvent } from 'react'
import { validarCheckout, type CamposCheckout, type Cliente } from '../validators/checkout.ts'
import type { Erros } from '../validators/validar.ts'

interface FormCheckoutProps {
  onConfirmar: (cliente: Cliente) => void
  onVoltar: () => void
}

const CAMPOS_VAZIOS: CamposCheckout = { nome: '', email: '', cep: '', endereco: '' }

function formatarCep(texto: string) {
  const digitos = texto.replace(/\D/g, '').slice(0, 8)
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos
}

function FormCheckout({ onConfirmar, onVoltar }: FormCheckoutProps) {
  const [campos, setCampos] = useState(CAMPOS_VAZIOS)
  const [erros, setErros] = useState<Erros<CamposCheckout>>({})

  function alterarCampo(nome: keyof CamposCheckout, valor: string) {
    setCampos((anteriores) => ({ ...anteriores, [nome]: valor }))
  }

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault()

    const { dados: cliente, erros: errosEncontrados } = validarCheckout(campos)
    setErros(errosEncontrados)
    if (cliente) onConfirmar(cliente)
  }

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <p className="text-sm text-muted">
        Esta é uma loja de demonstração: nenhum pagamento é cobrado e nenhum dado é enviado.
      </p>

      <TextField
        fullWidth
        isInvalid={Boolean(erros.nome)}
        name="nome"
        value={campos.nome}
        onChange={(valor) => alterarCampo('nome', valor)}
      >
        <Label>Nome completo</Label>
        <Input autoComplete="name" />
        <FieldError>{erros.nome}</FieldError>
      </TextField>

      <TextField
        fullWidth
        isInvalid={Boolean(erros.email)}
        name="email"
        type="email"
        value={campos.email}
        onChange={(valor) => alterarCampo('email', valor)}
      >
        <Label>E-mail</Label>
        <Input autoComplete="email" placeholder="nome@exemplo.com" />
        <FieldError>{erros.email}</FieldError>
      </TextField>

      <TextField
        fullWidth
        isInvalid={Boolean(erros.cep)}
        name="cep"
        value={campos.cep}
        onChange={(valor) => alterarCampo('cep', formatarCep(valor))}
      >
        <Label>CEP</Label>
        <Input autoComplete="postal-code" inputMode="numeric" placeholder="00000-000" />
        <FieldError>{erros.cep}</FieldError>
      </TextField>

      <TextField
        fullWidth
        isInvalid={Boolean(erros.endereco)}
        name="endereco"
        value={campos.endereco}
        onChange={(valor) => alterarCampo('endereco', valor)}
      >
        <Label>Endereço de entrega</Label>
        <Input autoComplete="street-address" placeholder="Rua, número e bairro" />
        <FieldError>{erros.endereco}</FieldError>
      </TextField>

      <div className="mt-2 flex gap-2">
        <Button className="flex-1" type="button" variant="tertiary" onPress={onVoltar}>
          Voltar
        </Button>
        <Button className="flex-1" type="submit">
          Confirmar pedido
        </Button>
      </div>
    </form>
  )
}

export default FormCheckout
