<script setup lang="ts">
interface Contenu {
  siege_social?: string
  actionnariat?: string
  infrastructure?: string
  fonctionnalites?: string[] | string
  securite_detail?: string
  problemes?: string[] | string
  avantages_souverains?: string
  cout_detail?: string
  migration?: string
}

interface Logiciel {
  nom: string
  etat: string
  nationalite: string | null
  creation: number
  cout_annuel_eur: number | null
  code_ouvert: string | null
  serveurs: string[] | null
  compatibilite: string[] | null
  portabilite: string | null
  securite: string | null
  ux: number | null
  score?: number | null
  challenge: { role: string | null; demarche: string | null }
  notion_url: string
  contenu?: Contenu
}

const props = defineProps<{
  logiciel: Logiciel
  isChallenged?: boolean
}>()

const isOpen = ref(false)

const slug = computed(() => props.logiciel.nom.toLowerCase().replace(/\s+/g, '-'))

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('logiciel') === slug.value && props.logiciel.contenu) {
    isOpen.value = true
  }
})

watch(isOpen, (val) => {
  const url = new URL(window.location.href)
  if (val) {
    url.searchParams.set('logiciel', slug.value)
  } else {
    url.searchParams.delete('logiciel')
  }
  history.replaceState(history.state, '', url.toString())
})

// Carte blanche = logiciel actif
const isActive = computed(() =>
  props.logiciel.etat === 'Utilisé' || props.logiciel.etat === 'En cours de migration'
)

// Logos locaux depuis assets/images/logiciels/
const logoGlob = import.meta.glob('~/assets/images/logiciels/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

const logoMap: Record<string, string> = {}
for (const [path, url] of Object.entries(logoGlob)) {
  const filename = path.split('/').pop()?.replace(/\.[^.]+$/, '').toLowerCase() ?? ''
  logoMap[filename] = url
}

const logoUrl = computed(() => {
  const key = props.logiciel.nom.toLowerCase().replace(/\s+/g, '-')
  return logoMap[key] ?? logoMap[props.logiciel.nom.toLowerCase()] ?? null
})

const initials = computed(() =>
  props.logiciel.nom.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
)

// ── Palette de couleurs ──────────────────────────────────────────
const C = {
  green:   '#7FB069',
  red:     '#EC6B40',
  citron:  '#FFFBBD',
  caramel: '#FB9CA0',
}

const B = 'inline-flex items-center text-[13px] font-normal px-2 py-0.5 rounded border'

function stateBadgeClass(etat: string): string {
  if (etat === 'Utilisé' || etat === 'En cours de migration')
    return 'inline-flex items-center text-[13px] font-normal px-2 py-0.5 rounded border text-[#7FB069] bg-[#7FB069]/10 border-[#7FB069]/20'
  if (etat === "A l'étude")
    return 'inline-flex items-center text-[13px] font-normal px-2 py-0.5 rounded border text-[#FB9CA0] bg-[#FB9CA0]/10 border-[#FB9CA0]/25'
  if (etat === 'backlog')
    return `${B} text-white bg-white/10 border-white/20`
  if (etat === 'Abandonné')
    return `${B} text-[#A1A1AA] bg-zinc-800/40 border-zinc-700/30`
  return `${B} text-[#A1A1AA] bg-zinc-800/40 border-zinc-700/30`
}

function openBadgeClass(_v: string | null): string {
  return `${B} text-white bg-white/10 border-white/20`
}

function secBadgeClass(_v: string | null): string {
  return `${B} text-white bg-white/10 border-white/20`
}

function portBadgeClass(_v: string | null): string {
  return `${B} text-white bg-white/10 border-white/20`
}

function serverClass(_s: string): string {
  return 'inline-flex items-center text-[13px] font-normal px-2 py-0.5 rounded border text-white bg-white/10 border-white/20'
}

const stateLabel = computed(() => props.logiciel.etat === 'backlog' ? 'Backlog' : props.logiciel.etat)

function toList(v: string | string[] | undefined | null): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  const s = v.trim()
  if (/^non renseigné/i.test(s)) return []
  return [s]
}

const fonctionnalites = computed(() => toList(props.logiciel.contenu?.fonctionnalites))
const problemes       = computed(() => toList(props.logiciel.contenu?.problemes))

function isHtml(v: string | string[] | undefined | null): v is string {
  return typeof v === 'string' && /<[a-z][\s\S]*>/i.test(v)
}
</script>

<template>
  <!-- ── Card ── -->
  <div
    class="rounded-xl border transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col group"
    :class="[
      isActive
        ? 'border-white bg-white/8 hover:bg-white/10'
        : 'border-[#FB9CA0]/15 bg-[#FB9CA0]/5 hover:border-[#FB9CA0]/25 hover:bg-[#FB9CA0]/8',
      logiciel.etat === 'Abandonné' ? 'opacity-50' : '',
      logiciel.contenu ? 'cursor-pointer' : ''
    ]"
    @click="logiciel.contenu && (isOpen = true)"
  >
    <div class="p-4 flex flex-col gap-3 flex-1">

      <!-- Name + state -->
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            :alt="logiciel.nom"
            class="w-5 h-5 rounded flex-shrink-0 object-contain"
          />
          <span
            v-else
            class="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center bg-white/15 text-white font-semibold"
            style="font-size:7px"
          >{{ initials }}</span>
          <h3 class="font-semibold text-base leading-tight text-white">{{ logiciel.nom }}</h3>
        </div>
        <span :class="stateBadgeClass(logiciel.etat)" class="flex-shrink-0">{{ stateLabel }}</span>
      </div>

      <!-- Indicators -->
      <div class="flex flex-wrap gap-1">
        <span :class="openBadgeClass(logiciel.code_ouvert)">
          {{ logiciel.code_ouvert ? `OpenSource: ${logiciel.code_ouvert}` : 'OpenSource ?' }}
        </span>
        <span :class="secBadgeClass(logiciel.securite)">
          {{ logiciel.securite ? `Sécu: ${logiciel.securite}` : 'Sécu ?' }}
        </span>
        <span :class="portBadgeClass(logiciel.portabilite)">
          {{ logiciel.portabilite ? `Portabilité: ${logiciel.portabilite}` : 'Portabilité ?' }}
        </span>
      </div>

      <!-- Cost -->
      <div class="text-sm text-[#A1A1AA]">
        <span v-if="logiciel.cout_annuel_eur === 0" class="font-semibold text-[#7FB069]">Gratuit</span>
        <span v-else-if="logiciel.cout_annuel_eur !== null">
          <strong class="font-mono text-zinc-300">{{ logiciel.cout_annuel_eur.toLocaleString('fr-FR') }} €</strong> / an
        </span>
        <span v-else class="text-[#898994]">Coût non renseigné</span>
      </div>

      <!-- Servers -->
      <div v-if="logiciel.serveurs?.length" class="flex items-start gap-1.5">
        <UIcon name="i-heroicons-server" class="w-3.5 h-3.5 text-[#898994] mt-0.5 flex-shrink-0" />
        <div class="flex flex-wrap gap-1">
          <span v-for="s in logiciel.serveurs" :key="s" :class="serverClass(s)">{{ s }}</span>
        </div>
      </div>

      <!-- Compatibility -->
      <div v-if="logiciel.compatibilite?.length" class="flex items-start gap-1.5">
        <UIcon name="i-heroicons-device-phone-mobile" class="w-3.5 h-3.5 text-[#898994] mt-0.5 flex-shrink-0" />
        <div class="flex flex-wrap gap-1">
          <span
            v-for="c in logiciel.compatibilite"
            :key="c"
            class="text-[12px] font-normal px-1.5 py-0.5 rounded bg-zinc-800/60 border border-zinc-700/50 text-[#A1A1AA]"
          >{{ c }}</span>
        </div>
      </div>

      <!-- Score -->
      <div v-if="logiciel.score != null" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[12px] text-[#898994]">Score de souveraineté</span>
          <span class="text-[12px] font-medium text-[#FB9CA0]">{{ logiciel.score }}/100</span>
        </div>
        <div class="h-1 rounded-full bg-white/10">
          <div
            class="h-1 rounded-full transition-all"
            :style="{ width: `${logiciel.score}%`, background: '#FB9CA0' }"
          />
        </div>
      </div>

      <div class="flex-1" />

      <!-- Footer -->
      <div class="flex items-center justify-between pt-3 border-t border-white/5">
        <span class="text-[21px] leading-none">{{ logiciel.nationalite }}</span>
        <span class="text-sm text-[#898994] font-mono">{{ logiciel.creation }}</span>
      </div>
    </div>
  </div>

  <!-- ── Detail Slideover ── -->
  <USlideover v-model="isOpen" side="right" :ui="{ width: 'max-w-xl', overlay: { background: 'backdrop-blur-sm bg-black/60' } }">
    <div class="flex flex-col h-full overflow-hidden" style="background:#0312B3">

      <!-- Header -->
      <div class="px-6 py-5 border-b border-white/[2] flex-shrink-0">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <img v-if="logoUrl" :src="logoUrl" :alt="logiciel.nom" class="w-7 h-7 rounded object-contain" />
              <span
                v-else
                class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-white/15 text-white font-semibold"
                style="font-size:10px"
              >{{ initials }}</span>
              <h2 class="text-[26px] font-medium text-white">{{ logiciel.nom }}</h2>
              <span class="text-xl">{{ logiciel.nationalite }}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span :class="stateBadgeClass(logiciel.etat)">{{ stateLabel }}</span>
              <span :class="openBadgeClass(logiciel.code_ouvert)">
                {{ logiciel.code_ouvert ? `OpenSource: ${logiciel.code_ouvert}` : 'OpenSource ?' }}
              </span>
              <span v-if="logiciel.ux !== null" :class="B" class="text-white bg-white/10 border-white/20">
                UX {{ logiciel.ux }}/10
              </span>
            </div>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            variant="outline"
            color="white"
            size="sm"
            :ui="{ rounded: 'rounded-full', color: { white: { outline: 'text-white border border-white ring-0 hover:bg-white/10' } } }"
            @click="isOpen = false"
          />
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto divide-y divide-white/5">

        <div class="px-6 py-5 space-y-4">
          <div v-if="logiciel.contenu?.siege_social">
            <h3 class="text-[13px] font-normal uppercase tracking-widest text-white mb-1.5 flex items-center gap-1.5">
              <UIcon name="i-heroicons-building-office-2" class="w-3.5 h-3.5" /> Siège social
            </h3>
            <div class="rich-text text-base text-zinc-300 leading-relaxed" v-html="logiciel.contenu.siege_social" />
          </div>
          <div v-if="logiciel.contenu?.actionnariat">
            <h3 class="text-[13px] font-normal uppercase tracking-widest text-white mb-1.5 flex items-center gap-1.5">
              <UIcon name="i-heroicons-chart-pie" class="w-3.5 h-3.5" /> Actionnariat
            </h3>
            <div class="rich-text text-base text-zinc-300 leading-relaxed" v-html="logiciel.contenu.actionnariat" />
          </div>
        </div>

        <div v-if="logiciel.contenu?.infrastructure" class="px-6 py-5">
          <h3 class="text-[13px] font-normal uppercase tracking-widest text-white mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-server" class="w-3.5 h-3.5" /> Infrastructure
          </h3>
          <div class="rich-text text-base text-zinc-300 leading-relaxed mb-2" v-html="logiciel.contenu.infrastructure" />
          <div v-if="logiciel.serveurs?.length" class="flex flex-wrap gap-1">
            <span v-for="s in logiciel.serveurs" :key="s" :class="serverClass(s)">{{ s }}</span>
          </div>
        </div>

        <div v-if="logiciel.contenu?.fonctionnalites" class="px-6 py-5">
          <h3 class="text-[13px] font-normal uppercase tracking-widest text-white mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5" /> Fonctionnalités
          </h3>
          <div v-if="isHtml(logiciel.contenu.fonctionnalites)" class="rich-text text-base text-zinc-300 leading-relaxed" v-html="logiciel.contenu.fonctionnalites" />
          <ul v-else class="space-y-1.5">
            <li v-for="(f, i) in fonctionnalites" :key="i" class="flex items-start gap-2 text-base text-zinc-300">
              <span class="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-white/60" />
              {{ f }}
            </li>
          </ul>
        </div>

        <div v-if="logiciel.contenu?.securite_detail" class="px-6 py-5">
          <h3 class="text-[13px] font-normal uppercase tracking-widest text-white mb-2 flex items-center gap-2">
            <UIcon name="i-heroicons-shield-check" class="w-3.5 h-3.5" />
            Sécurité
            <span v-if="logiciel.securite" :class="secBadgeClass(logiciel.securite)">{{ logiciel.securite }}</span>
          </h3>
          <div class="rich-text text-base text-zinc-300 leading-relaxed" v-html="logiciel.contenu.securite_detail" />
        </div>

        <div v-if="logiciel.contenu?.problemes" class="px-6 py-5">
          <h3 class="text-[13px] font-normal uppercase tracking-widest text-white mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5" /> Points d'attention
          </h3>
          <div v-if="isHtml(logiciel.contenu.problemes)" class="rich-text text-base text-zinc-300 leading-relaxed" v-html="logiciel.contenu.problemes" />
          <ul v-else class="space-y-1.5">
            <li v-for="(p, i) in problemes" :key="i" class="flex items-start gap-2 text-base text-zinc-300">
              <span class="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-white/60" />
              {{ p }}
            </li>
          </ul>
        </div>

        <div v-if="logiciel.contenu?.avantages_souverains" class="px-6 py-5">
          <h3 class="text-[13px] font-normal uppercase tracking-widest text-white mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-shield-check" class="w-3.5 h-3.5" /> Avantages souverains
          </h3>
          <div class="rich-text text-base text-zinc-300 leading-relaxed" v-html="logiciel.contenu.avantages_souverains" />
        </div>

        <div v-if="logiciel.contenu?.cout_detail" class="px-6 py-5">
          <h3 class="text-[13px] font-normal uppercase tracking-widest text-white mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-banknotes" class="w-3.5 h-3.5" /> Coût
          </h3>
          <div class="rich-text text-base text-zinc-300 leading-relaxed" v-html="logiciel.contenu.cout_detail" />
        </div>

        <div v-if="logiciel.contenu?.migration" class="px-6 py-5">
          <h3 class="text-[13px] font-normal uppercase tracking-widest text-white mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5" /> Migration
          </h3>
          <div class="rich-text text-base text-zinc-300 leading-relaxed" v-html="logiciel.contenu.migration" />
        </div>


      </div>
    </div>
  </USlideover>
</template>

<style scoped>
.rich-text :deep(ul) {
  list-style: disc;
  padding-left: 1.25rem;
  margin-top: 0.25rem;
  space-y: 0.25rem;
}
.rich-text :deep(ol) {
  list-style: decimal;
  padding-left: 1.25rem;
  margin-top: 0.25rem;
}
.rich-text :deep(li) {
  margin-bottom: 0.25rem;
}
.rich-text :deep(p) {
  margin-bottom: 0.5rem;
}
.rich-text :deep(p:last-child) {
  margin-bottom: 0;
}
.rich-text :deep(strong) {
  color: #fff;
  font-weight: 600;
}
.rich-text :deep(a) {
  color: rgba(255,255,255,0.7);
  text-decoration: underline;
}
</style>
