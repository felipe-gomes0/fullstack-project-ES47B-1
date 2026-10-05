import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
  type Key,
} from '@heroui/react'
import { useEffect, useState, type FormEvent } from 'react'
import { useProdutos } from '../contexts/ProdutosContext.tsx'
import { validarBusca, type CamposBusca } from '../validators/busca.ts'
import type { Erros } from '../validators/validar.ts'
import { IconeBusca } from './Icones.tsx'

const CAMPOS_VAZIOS: CamposBusca = { titulo: '', categoriaId: null, precoMin: '', precoMax: '' }
const MAXIMO_CATEGORIAS = 12
const TODAS_CATEGORIAS = 'todas'

function FormBusca() {
  const { buscarProdutos, carregarCategorias, categorias, carregando, filtros } = useProdutos()
  const [campos, setCampos] = useState(CAMPOS_VAZIOS)
  const [erros, setErros] = useState<Erros<CamposBusca>>({})

  const haFiltrosAplicados = Object.keys(filtros).length > 0

  useEffect(() => {
    const controlador = new AbortController()
    carregarCategorias(controlador.signal)
    return () => controlador.abort()
  }, [carregarCategorias])

  function alterarCampo(nome: 'titulo' | 'precoMin' | 'precoMax', valor: string) {
    setCampos((anteriores) => ({ ...anteriores, [nome]: valor }))
  }

  // Valida e dispara a busca. Com permitirVazio, nenhum filtro preenchido volta ao catálogo inicial.
  function aplicarFiltros(camposAtuais: CamposBusca, { permitirVazio = false } = {}) {
    const { dados: novosFiltros, erros: errosEncontrados } = validarBusca(camposAtuais, {
      permitirVazio,
    })
    setErros(errosEncontrados)
    if (novosFiltros) buscarProdutos(novosFiltros)
  }

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault()
    aplicarFiltros(campos)
  }

  // A categoria filtra na hora, sem depender do botão "Buscar".
  function handleCategoria(valor: Key | null) {
    const novosCampos = { ...campos, categoriaId: typeof valor === 'number' ? valor : null }
    setCampos(novosCampos)
    aplicarFiltros(novosCampos, { permitirVazio: true })
  }

  function handleLimpar() {
    setCampos(CAMPOS_VAZIOS)
    setErros({})
    if (haFiltrosAplicados) buscarProdutos()
  }

  return (
    <form
      noValidate
      aria-label="Buscar produtos"
      className="rounded-2xl border border-border bg-surface p-4 shadow-surface sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1.4fr_1fr_1fr]">
        <TextField
          fullWidth
          isInvalid={Boolean(erros.titulo)}
          name="titulo"
          value={campos.titulo}
          onChange={(valor) => alterarCampo('titulo', valor)}
        >
          <Label>Nome do produto</Label>
          <Input placeholder="Ex.: hoodie, sofa, shoes" />
          <FieldError>{erros.titulo}</FieldError>
        </TextField>

        <Select
          fullWidth
          name="categoria"
          placeholder="Todas"
          value={campos.categoriaId}
          onChange={handleCategoria}
        >
          <Label>Categoria</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id={TODAS_CATEGORIAS} textValue="Todas">
                Todas
              </ListBox.Item>
              {categorias.slice(0, MAXIMO_CATEGORIAS).map((categoria) => (
                <ListBox.Item key={categoria.id} id={categoria.id} textValue={categoria.nome}>
                  {categoria.nome}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <TextField
          fullWidth
          isInvalid={Boolean(erros.precoMin)}
          name="precoMin"
          value={campos.precoMin}
          onChange={(valor) => alterarCampo('precoMin', valor)}
        >
          <Label>Preço mínimo (US$)</Label>
          <Input inputMode="decimal" placeholder="0" />
          <FieldError>{erros.precoMin}</FieldError>
        </TextField>

        <TextField
          fullWidth
          isInvalid={Boolean(erros.precoMax)}
          name="precoMax"
          value={campos.precoMax}
          onChange={(valor) => alterarCampo('precoMax', valor)}
        >
          <Label>Preço máximo (US$)</Label>
          <Input inputMode="decimal" placeholder="500" />
          <FieldError>{erros.precoMax}</FieldError>
        </TextField>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button isPending={carregando} type="submit">
          <IconeBusca tamanho={16} />
          {carregando ? 'Buscando...' : 'Buscar'}
        </Button>
        <Button type="button" variant="tertiary" onPress={handleLimpar}>
          Limpar filtros
        </Button>
        {erros.geral && (
          <p className="text-sm text-danger" role="alert">
            {erros.geral}
          </p>
        )}
      </div>
    </form>
  )
}

export default FormBusca
