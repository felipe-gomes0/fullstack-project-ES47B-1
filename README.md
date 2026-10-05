# Vitrine

Loja virtual em página única (SPA) feita com React. O catálogo vem da
[Platzi Fake Store API](https://fakeapi.platzi.com/) por requisições AJAX (`fetch`),
e toda a navegação acontece sem recarregar a página.

Projeto 1 da disciplina Programação Web Fullstack.

## Escolhas do projeto

| Item               | Escolha                                                   | Onde está                                                                                              |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| API JSON aberta    | Platzi Fake Store API (`https://api.escuelajs.co/api/v1`) | `src/contexts/ProdutosContext.tsx`                                                                     |
| Hook do React      | `useReducer`                                              | Carrinho em `src/contexts/CarrinhoContext.tsx` e estado da busca em `src/contexts/ProdutosContext.tsx` |
| Biblioteca externa | [HeroUI](https://heroui.com/) (com Tailwind CSS)          | Todos os componentes em `src/components`                                                               |

## Funcionalidades

- Catálogo carregado ao abrir a página, com botão para carregar mais produtos.
- Busca com envio de parâmetros para a API: nome, categoria e faixa de preço.
- Validação dos campos antes do envio e mensagens de erro da API depois do envio.
- Quatro estados de tela: carregando, erro, vazio e sucesso.
- Detalhes do produto em uma janela sobre a lista, com galeria de imagens.
- Carrinho lateral com alteração de quantidade, remoção e subtotal, salvo no navegador.
- Finalização de compra simulada, com formulário validado.

## Endpoints usados

| Método | Endpoint      | Parâmetros                                                         |
| ------ | ------------- | ------------------------------------------------------------------ |
| `GET`  | `/products`   | `limit`, `offset`, `title`, `categoryId`, `price_min`, `price_max` |
| `GET`  | `/categories` | nenhum                                                             |

A API só filtra por preço quando recebe `price_min` e `price_max` juntos. Por isso, quando
só um dos dois é preenchido, o outro é enviado com um valor padrão.

## Como executar

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Outros comandos:

```bash
npm run build     # verifica os tipos e gera a versão de produção em dist/
npm run typecheck # verifica só os tipos
npm run preview   # serve a versão de produção localmente
npm run lint      # verifica o código
```

A URL da API pode ser trocada criando um arquivo `.env` a partir do `.env.example`.

## Estrutura

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── components/
│   ├── Header.tsx             cabeçalho e botão do carrinho
│   ├── FormBusca.tsx          filtros da busca
│   ├── ListaProdutos.tsx      grade de produtos e estados da tela
│   ├── CardProduto.tsx        cartão de um produto
│   ├── DetalheProduto.tsx     janela de detalhes
│   ├── Carrinho.tsx           painel lateral do carrinho
│   ├── FormCheckout.tsx       formulário de finalização
│   ├── SeletorQuantidade.tsx  botões de mais e menos
│   ├── ImagemProduto.tsx      imagem com espaço reservado em caso de falha
│   ├── Preco.tsx              formatação de preço
│   └── Icones.tsx             ícones em SVG
├── contexts/
│   ├── ProdutosContext.tsx    acesso à API e estado da busca
│   └── CarrinhoContext.tsx    estado do carrinho
└── validators/
    ├── validar.ts             roda um schema e devolve dados ou erros por campo
    ├── busca.ts               filtros da busca
    ├── checkout.ts            formulário de finalização
    ├── carrinho.ts            carrinho salvo no navegador
    └── api.ts                 respostas da API (produtos e categorias)
```

## Ferramentas

- [Vite](https://vite.dev/) para o ambiente de desenvolvimento e o build
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) em todo o código
- [HeroUI](https://heroui.com/) e [Tailwind CSS](https://tailwindcss.com/) para a interface
- [Zod](https://zod.dev/) para as validações
- [Oxlint](https://oxc.rs/) para a verificação do código
