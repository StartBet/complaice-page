<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  CalendarDays,
  Clock3,
  FileCheck2,
  Filter,
  Instagram,
  Search,
  Sparkles,
  X,
} from 'lucide-vue-next';

declare global {
  interface Window {
    zE?: (...args: unknown[]) => void;
  }
}

type Article = {
  title: string;
  category: string;
  summary: string;
  readTime: string;
  date: string;
  featured?: boolean;
};

const categories = ['Todos', 'PLD/FT', 'Jogo Responsavel', 'Privacidade', 'Conduta', 'Regulatorio'];
const selectedCategory = ref('Todos');
const search = ref('');
const selectedArticle = ref<Article | null>(null);
const isChatLoading = ref(false);

const zendeskSnippetId = 'ze-snippet';
const zendeskSnippetUrl =
  'https://static.zdassets.com/ekr/snippet.js?key=05f7e9c0-797b-4df7-9b07-5d976d554662';

let isZendeskCloseHandlerRegistered = false;

const articles: Article[] = [
  {
    title: 'Como identificar sinais de comportamento de risco',
    category: 'Jogo Responsavel',
    summary:
      'Critérios práticos para equipes reconhecerem padrões de uso que exigem orientação, acolhimento e acionamento dos canais corretos.',
    readTime: '7 min',
    date: 'Atualizado hoje',
    featured: true,
  },
  {
    title: 'Prevenção à lavagem de dinheiro no fluxo operacional',
    category: 'PLD/FT',
    summary:
      'Uma visão objetiva sobre alertas transacionais, documentação mínima, trilha de decisão e escalonamento para análise especializada.',
    readTime: '9 min',
    date: '10 mai 2026',
  },
  {
    title: 'Boas práticas no tratamento de dados pessoais',
    category: 'Privacidade',
    summary:
      'Diretrizes para reduzir exposição de dados, preservar evidências necessárias e manter transparência com os titulares.',
    readTime: '6 min',
    date: '8 mai 2026',
  },
  {
    title: 'Conflito de interesses: quando declarar',
    category: 'Conduta',
    summary:
      'Exemplos comuns, critérios de materialidade e caminho recomendado para registro preventivo junto ao time de compliance.',
    readTime: '5 min',
    date: '3 mai 2026',
  },
  {
    title: 'Checklist para novos comunicados regulatórios',
    category: 'Regulatorio',
    summary:
      'Itens essenciais para validar escopo, área responsável, prazo de implementação e evidências antes da publicação interna.',
    readTime: '8 min',
    date: '28 abr 2026',
  },
];

const featuredArticle = computed(() => articles.find((article) => article.featured) ?? articles[0]);

const filteredArticles = computed(() => {
  const normalizedSearch = search.value.trim().toLowerCase();

  return articles.filter((article) => {
    const matchesCategory =
      selectedCategory.value === 'Todos' || article.category === selectedCategory.value;
    const matchesSearch =
      !normalizedSearch ||
      [article.title, article.category, article.summary].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );

    return matchesCategory && matchesSearch;
  });
});

const quickLinks = [
  'Políticas internas',
  'Canal de dúvidas',
  'Calendário regulatório',
  'Materiais obrigatórios',
];

const highlights = [
  'Textos curtos e escaneáveis',
  'Filtros por tema de compliance',
  'Conteúdo preparado para atualização contínua',
];
const footerSections = [
  {
    title: 'Sobre',
    links: [
      { label: 'Sobre Nós', href: 'https://start.bet.br/page/about' },
      { label: 'Jogo Responsável', href: 'https://start.bet.br/page/responsible-gaming' },
      { label: 'Regras do Jogo', href: 'https://start.bet.br/page/rules' },
      { label: 'Blog', href: 'https://startbetblog.com/' },
      { label: 'Politica de Privacidade', href: 'https://start.bet.br/page/kyc-and-privacy-policy' },
      { label: 'Politica PLD-FTP', href: 'https://start.bet.br/page/aml-policy' },
      { label: 'Politica de Cookies', href: '#' },
      {
        label: 'Autoexclusao Centralizada',
        href: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas/autoexclusao',
      },
    ],
  },
  {
    title: 'Informações',
    links: [
      { label: 'Promoções', href: 'https://start.bet.br/promotions' },
      { label: 'Termos e Condições', href: 'https://start.bet.br/page/terms-and-conditions' },
      { label: 'Central de Ajuda', href: 'https://central-deajuda-sb.vercel.app/' },
    ],
  },
  {
    title: 'Produtos',
    links: [
      { label: 'Esportes', href: 'https://start.bet.br/sportsbook/Football/Brazil' },
      { label: 'Apostas ao Vivo', href: 'https://start.bet.br/live/Football' },
      { label: 'Cassino', href: 'https://start.bet.br/casino' },
      { label: 'Cassino ao vivo', href: 'https://start.bet.br/live-casino' },
    ],
  },
];

const socialLinks = [
  { label: 'Instagram', icon: Instagram },
];

const assetUrl = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`;

const suggestionCards = [
  {
    label: 'Ofertas',
    title: 'Promocoes',
    href: 'https://start.bet.br/promotions',
    image: assetUrl('sidebar-promotions.png'),
  },
  {
    label: 'Conteudo',
    title: 'Blog Start',
    href: 'https://startbetblog.com/',
    image: assetUrl('sidebar-blog.png'),
  },
  {
    label: 'Videos',
    title: 'YouTube da Start',
    href: 'https://www.youtube.com/@StartBetOficial',
    image: assetUrl('sidebar-youtube.png'),
  },
  {
    label: 'Protecao',
    title: 'Autoexclusao Centralizada',
    href: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas/autoexclusao',
    image: assetUrl('sidebar-autoexclusao.png'),
  },
];

const destinationCards = [
  {
    eyebrow: 'Esportes',
    title: 'Sportsbook',
    description: 'Acompanhe mercados ao vivo, odds competitivas e grandes jogos em poucos cliques.',
    href: 'https://start.bet.br/sportsbook/Football/Brazil',
    image: assetUrl('destination-sportsbook.png'),
  },
  {
    eyebrow: 'Jogos online',
    title: 'Cassino',
    description: 'Explore slots, roleta, cartas e experiencias de cassino com navegacao simples.',
    href: 'https://start.bet.br/casino',
    image: assetUrl('destination-casino.png'),
  },
];

const openArticle = (article: Article) => {
  selectedArticle.value = article;
};

const closeArticle = () => {
  selectedArticle.value = null;
};

const hideZendeskMessenger = () => {
  window.zE?.('messenger', 'hide');
};

const registerZendeskCloseHandler = () => {
  if (!window.zE || isZendeskCloseHandlerRegistered) {
    return;
  }

  window.zE('messenger:on', 'close', hideZendeskMessenger);
  isZendeskCloseHandlerRegistered = true;
};

const showAndOpenZendeskMessenger = () => {
  registerZendeskCloseHandler();
  window.zE?.('messenger', 'show');
  window.zE?.('messenger', 'open');
  isChatLoading.value = false;
};

const openZendeskChat = () => {
  if (window.zE) {
    showAndOpenZendeskMessenger();
    return;
  }

  const existingSnippet = document.getElementById(zendeskSnippetId);

  isChatLoading.value = true;

  if (existingSnippet) {
    existingSnippet.addEventListener(
      'load',
      () => {
        showAndOpenZendeskMessenger();
      },
      { once: true },
    );
    return;
  }

  const snippet = document.createElement('script');
  snippet.id = zendeskSnippetId;
  snippet.src = zendeskSnippetUrl;
  snippet.async = true;
  snippet.addEventListener('load', () => {
    showAndOpenZendeskMessenger();
  });
  snippet.addEventListener('error', () => {
    isChatLoading.value = false;
  });
  document.head.appendChild(snippet);
};
</script>

<template>
  <main id="top" class="min-h-screen bg-start-mist text-start-ink">
    <section class="bg-start-deep text-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-6 sm:px-8 lg:px-10">
        <header class="flex flex-wrap items-center justify-between gap-4">
          <a href="#" class="inline-flex items-center" aria-label="Start">
            <img class="h-11 w-auto sm:h-12" :src="assetUrl('start-logo.png')" alt="Start" />
          </a>

          <nav class="flex flex-wrap items-center gap-2 text-white/86">
            <a
              class="grid h-11 w-11 place-items-center rounded-md border border-white/12 bg-white/8 transition hover:border-start-lemon/60 hover:bg-white/14 hover:text-white"
              href="#artigos"
              aria-label="Ver artigos"
            >
              <BookOpen class="h-5 w-5 text-start-lemon" aria-hidden="true" />
            </a>
            <button
              class="grid h-11 w-11 place-items-center rounded-md border border-start-lemon/50 bg-start-lemon text-start-deep shadow-soft transition hover:bg-start-lemonSoft"
              type="button"
              aria-label="Abrir suporte"
              :aria-busy="isChatLoading"
              @click="openZendeskChat"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 1024 1024"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M512 220.8C351.1 220.8 220.8 351.1 220.8 512V568C220.8 586.6 205.8 601.6 187.2 601.6 168.6 601.6 153.6 586.6 153.6 568V512C153.6 314 314 153.6 512 153.6 710 153.6 870.4 314 870.4 512V713.7C870.4 781.8 815.2 836.9 747.1 836.9L592.6 836.8C581 856.8 559.3 870.4 534.4 870.4H489.6C452.5 870.4 422.4 840.3 422.4 803.2 422.4 766.1 452.5 736 489.6 736H534.4C559.3 736 581 749.6 592.6 769.6L747.2 769.7C778.1 769.7 803.2 744.7 803.2 713.7V512C803.2 351.1 672.9 220.8 512 220.8ZM355.2 444.8H377.6C402.4 444.8 422.4 464.8 422.4 489.6V646.4C422.4 671.2 402.4 691.2 377.6 691.2H355.2C305.8 691.2 265.6 651 265.6 601.6V534.4C265.6 485 305.8 444.8 355.2 444.8ZM668.8 444.8C718.2 444.8 758.4 485 758.4 534.4V601.6C758.4 651 718.2 691.2 668.8 691.2H646.4C621.6 691.2 601.6 671.2 601.6 646.4V489.6C601.6 464.8 621.6 444.8 646.4 444.8H668.8Z"
                />
              </svg>
            </button>
          </nav>
        </header>

        <div class="grid gap-8 pb-10 lg:grid-cols-[minmax(0,1.05fr)_420px] lg:items-end">
          <div class="max-w-3xl"><!--
            <div
              class="mb-5 inline-flex items-center gap-2 rounded-md border border-white/14 bg-white/8 px-3 py-2 text-sm font-bold text-start-lemonSoft"
            >
              <Sparkles class="h-4 w-4" aria-hidden="true" />
              Biblioteca interna de conhecimentohttps://github.com/StartBet/complaice-page
            </div>-->
            <h1 class="max-w-3xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
              Artigos de compliance para consultar, entender e aplicar.
            </h1>
            <p class="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              Uma experiência focada em leitura: assuntos organizados por tema, busca rápida e
              resumos objetivos para orientar decisões do dia a dia.
            </p>
          </div>

          <aside
            class="rounded-lg border border-white/12 bg-white/[0.07] p-5 shadow-soft backdrop-blur"
            aria-label="Resumo da biblioteca"
          >
            <div class="flex items-start gap-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white text-start-deep">
                <FileCheck2 class="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p class="text-sm font-bold text-start-lemonSoft">Leitura recomendada</p>
                <h2 class="mt-1 text-xl font-black leading-tight">{{ featuredArticle.title }}</h2>
              </div>
            </div>
            <p class="mt-4 text-sm leading-7 text-white/74">{{ featuredArticle.summary }}</p>
            <div class="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-white/82">
              <span class="inline-flex items-center gap-2">
                <Clock3 class="h-4 w-4 text-start-lemon" aria-hidden="true" />
                {{ featuredArticle.readTime }}
              </span>
              <span class="inline-flex items-center gap-2">
                <CalendarDays class="h-4 w-4 text-start-lemon" aria-hidden="true" />
                {{ featuredArticle.date }}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="border-b border-start-deep/10 bg-white" aria-label="Busca de artigos">
      <div class="mx-auto grid max-w-7xl gap-4 px-5 py-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-10">
        <label
          class="flex min-h-12 items-center gap-3 rounded-lg border border-start-deep/12 bg-start-mist px-4 text-start-ink focus-within:border-start-surface"
        >
          <Search class="h-5 w-5 shrink-0 text-start-surface" aria-hidden="true" />
          <input
            v-model="search"
            class="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-start-ink/45"
            type="search"
            placeholder="Buscar por tema, palavra-chave ou artigo"
            aria-label="Buscar artigos"
          />
        </label>

        <div class="flex flex-wrap items-center gap-2" id="temas">
          <button
            v-for="category in categories"
            :key="category"
            class="h-10 rounded-md border px-3 text-sm font-bold transition"
            :class="
              selectedCategory === category
                ? 'border-start-lemon bg-start-lemon text-start-deep'
                : 'border-start-deep/12 bg-white text-start-ink hover:border-start-surface'
            "
            type="button"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </section>

    <section id="artigos" class="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_320px] lg:px-10">
      <div>
        <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-sm font-black uppercase text-start-surface">Artigos recentes</p>
            <h2 class="mt-2 text-3xl font-black text-start-deep">Conteúdo para consulta rápida</h2>
          </div>
          <p class="rounded-md bg-start-deep px-3 py-2 text-sm font-bold text-white">
            {{ filteredArticles.length }} resultados
          </p>
        </div>

        <div class="grid gap-4">
          <article
            v-for="article in filteredArticles"
            :key="article.title"
            class="group rounded-lg border border-start-deep/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-start-surface/40 hover:shadow-soft"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div class="max-w-2xl">
                <span
                  class="inline-flex rounded-md bg-start-sand px-3 py-1 text-xs font-black uppercase text-start-surface"
                >
                  {{ article.category }}
                </span>
                <h3 class="mt-3 text-xl font-black leading-snug text-start-deep">
                  {{ article.title }}
                </h3>
                <p class="mt-3 text-sm leading-7 text-start-ink/68">{{ article.summary }}</p>
              </div>

              <button
                class="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-start-deep px-4 text-sm font-black text-white transition group-hover:bg-start-surface"
                type="button"
                :aria-label="`Abrir artigo: ${article.title}`"
                @click="openArticle(article)"
              >
                Ler
                <ArrowRight class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div class="mt-5 flex flex-wrap gap-4 border-t border-start-deep/8 pt-4 text-sm font-semibold text-start-ink/58">
              <span class="inline-flex items-center gap-2">
                <BookOpen class="h-4 w-4 text-start-surface" aria-hidden="true" />
                {{ article.readTime }}
              </span>
              <span class="inline-flex items-center gap-2">
                <CalendarDays class="h-4 w-4 text-start-surface" aria-hidden="true" />
                {{ article.date }}
              </span>
            </div>
          </article>

          <div
            v-if="filteredArticles.length === 0"
            class="rounded-lg border border-start-deep/10 bg-white p-8 text-center"
          >
            <p class="text-lg font-black text-start-deep">Nenhum artigo encontrado</p>
            <p class="mt-2 text-sm text-start-ink/62">Tente ajustar a busca ou trocar o tema selecionado.</p>
          </div>
        </div>
      </div>

      <aside id="suporte" class="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <section class="rounded-lg bg-start-deep p-5 text-white shadow-soft">
          <h2 class="text-xl font-black">Guia de navegação</h2>
          <div class="mt-4 space-y-3">
            <a
              v-for="link in quickLinks"
              :key="link"
              href="#"
              class="flex items-center justify-between rounded-md border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-white/86 hover:bg-white/14 hover:text-white"
            >
              {{ link }}
              <ArrowRight class="h-4 w-4 text-start-lemon" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section class="rounded-lg bg-start-deep p-2 text-white shadow-soft">
          <h2 class="px-3 py-2 text-sm font-black uppercase tracking-[0.12em] text-start-lemon">
            Ver sugestoes
          </h2>
          <div class="space-y-2">
            <a
              v-for="card in suggestionCards"
              :key="card.title"
              class="group relative block min-h-[86px] overflow-hidden rounded-md border border-white/10 bg-start-surface"
              :href="card.href"
              target="_blank"
              rel="noreferrer"
            >
              <img
                class="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                :src="card.image"
                :alt="card.title"
              />
              <div
                class="absolute inset-0 bg-gradient-to-r from-start-deep via-start-deep/76 to-start-deep/20"
                aria-hidden="true"
              ></div>
              <div class="relative flex min-h-[86px] items-center justify-between gap-3 p-4">
                <div>
                  <span class="text-[11px] font-black uppercase tracking-[0.18em] text-start-lemon">
                    {{ card.label }}
                  </span>
                  <p class="mt-1 text-xl font-black uppercase leading-none text-start-sand">
                    {{ card.title }}
                  </p>
                </div>
                <span
                  class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-start-lemon text-start-deep transition group-hover:bg-start-lemonSoft"
                >
                  <ArrowRight class="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </a>
          </div>
        </section>
      </aside>
    </section>

    <section class="bg-start-deep px-5 py-12 text-white sm:px-8 lg:px-10" aria-label="Continue jogando">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-5 lg:grid-cols-[0.9fr_1fr] lg:items-end">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.22em] text-start-lemon">
              Continue jogando
            </p>
            <h2 class="mt-3 text-4xl font-black leading-tight text-start-sand sm:text-5xl">
              Escolha seu destino
            </h2>
          </div>
          <p class="max-w-2xl text-base font-semibold leading-7 text-white/72 lg:justify-self-end">
            Va direto para esportes ou cassino e continue sua experiencia no site oficial da
            StartBet.
          </p>
        </div>

        <div class="mt-8 grid gap-5 lg:grid-cols-2">
          <article
            v-for="destination in destinationCards"
            :key="destination.title"
            class="relative min-h-[260px] overflow-hidden rounded-lg border border-white/10 bg-start-surface shadow-soft"
          >
            <img
              class="absolute inset-0 h-full w-full object-cover"
              :src="destination.image"
              :alt="`${destination.title} na StartBet`"
            />
            <div
              class="absolute inset-0 bg-gradient-to-r from-start-deep via-start-deep/82 to-start-deep/18"
              aria-hidden="true"
            ></div>
            <div class="relative flex h-full max-w-md flex-col items-start justify-center p-6">
              <span class="rounded-full bg-start-lemon px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-start-deep">
                {{ destination.eyebrow }}
              </span>
              <h3 class="mt-5 text-4xl font-black uppercase leading-none text-start-sand sm:text-5xl">
                {{ destination.title }}
              </h3>
              <p class="mt-4 text-sm font-semibold leading-6 text-white/82 sm:text-base">
                {{ destination.description }}
              </p>
              <a
                class="mt-6 inline-flex h-12 items-center gap-3 rounded-md bg-start-lemon px-5 text-sm font-black uppercase text-start-deep transition hover:bg-start-lemonSoft"
                :href="destination.href"
                target="_blank"
                rel="noreferrer"
              >
                Quero jogar
                <ArrowRight class="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <footer class="bg-start-deep text-white">
      <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div class="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <section class="flex flex-col items-start">
            <img class="h-12 w-auto" :src="assetUrl('start-logo.png')" alt="Start" />

            <p class="mt-5 max-w-sm text-sm font-medium leading-7 text-white/64">
              Conteudo, canais e informacoes oficiais da StartBet reunidos em um so lugar.
            </p>

            <div class="mt-5 flex flex-wrap items-center gap-2">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                class="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/8 text-white transition hover:border-start-lemon/70 hover:bg-start-lemon hover:text-start-deep"
                href="https://www.instagram.com/startbetbr/"
                :aria-label="social.label"
              >
                <component :is="social.icon" class="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black/28 px-4 text-sm font-bold text-white transition hover:bg-black/40"
                href="#top"
              >
                <ArrowUp class="h-4 w-4" aria-hidden="true" />
                Voltar ao topo
              </a>
            </div>
          </section>

          <div class="grid gap-6 sm:grid-cols-3">
            <section
              v-for="section in footerSections"
              :key="section.title"
              class="p-1"
            >
              <h2 class="text-xs font-black uppercase tracking-[0.22em] text-start-lemon">
                {{ section.title }}
              </h2>
              <ul class="mt-5 space-y-3">
                <li v-for="link in section.links" :key="link.label">
                  <a
                    class="text-sm font-semibold text-white/72 transition hover:text-start-lemon"
                    :href="link.href"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {{ link.label }}
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <section class="mt-6 grid gap-5 rounded-lg border border-white/10 bg-start-surface/28 p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p class="text-sm font-medium leading-7 text-white/64">
              A Startbet e operada pela LBBR APOSTAS DE QUOTA FIXA S.A., empresa registrada sob
              o CNPJ 56.441.713/0001-45, licenciada pela Secretaria de Premios e Apostas do
              Ministerio da Fazenda no Brasil com a Autorizacao SPA/MF n 527, publicada em 14 de
              marco de 2025.
            </p>

            <p class="mt-3 text-sm font-black leading-6 text-white/70">
              Aposte com responsabilidade. Proibido para menores de 18 anos. Plataforma
              regulamentada. Apostas podem causar dependencia.
            </p>
          </div>

          <div class="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-start-lemon text-lg font-black text-start-lemon">
            18+
          </div>
        </section>
      </div>
    </footer>

    <Teleport to="body">
      <div
        v-if="selectedArticle"
        class="fixed inset-0 z-50 flex items-center justify-center bg-start-deep/70 px-5 py-8 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`article-modal-${selectedArticle.title}`"
        tabindex="-1"
        @keydown.esc="closeArticle"
        @click.self="closeArticle"
      >
        <section class="w-full max-w-2xl rounded-lg bg-white p-6 text-start-ink shadow-soft">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span
                class="inline-flex rounded-md bg-start-sand px-3 py-1 text-xs font-black uppercase text-start-surface"
              >
                {{ selectedArticle.category }}
              </span>
              <h2
                :id="`article-modal-${selectedArticle.title}`"
                class="mt-3 text-2xl font-black leading-tight text-start-deep"
              >
                {{ selectedArticle.title }}
              </h2>
            </div>
            <button
              class="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-start-deep/10 text-start-deep transition hover:border-start-surface hover:text-start-surface"
              type="button"
              aria-label="Fechar artigo"
              @click="closeArticle"
            >
              <X class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div class="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-start-ink/58">
            <span class="inline-flex items-center gap-2">
              <BookOpen class="h-4 w-4 text-start-surface" aria-hidden="true" />
              {{ selectedArticle.readTime }}
            </span>
            <span class="inline-flex items-center gap-2">
              <CalendarDays class="h-4 w-4 text-start-surface" aria-hidden="true" />
              {{ selectedArticle.date }}
            </span>
          </div>

          <div class="mt-6 space-y-4 border-t border-start-deep/8 pt-5 text-sm leading-7 text-start-ink/72">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, massa at
              pulvinar gravida, neque nunc porta justo, vitae posuere sem lacus at lectus.
            </p>
            <p>
              Sed non risus sed lorem feugiat fermentum. Praesent vitae arcu vel justo efficitur
              viverra, com foco em leitura simples e atualizacao futura do conteudo.
            </p>
          </div>
        </section>
      </div>
    </Teleport>
  </main>
</template>
