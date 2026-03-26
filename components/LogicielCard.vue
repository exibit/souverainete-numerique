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

// Carte blanche = logiciel actif
const isActive = computed(() =>
  props.logiciel.etat === 'Utilisé' || props.logiciel.etat === 'En cours de migration'
)

// Favicon
const domainMap: Record<string, string> = {
  'Slack': 'slack.com',
  'Figma': 'figma.com',
  'Dropbox': 'dropbox.com',
  'Gitlab': 'gitlab.com',
  'Mattermost': 'mattermost.com',
  'FramaTeam': 'framateam.org',
  'Treebal': 'treebal.com',
  'Wire': 'wire.com',
  'Element': 'element.io',
  'Kchat': 'kchat.infomaniak.com',
  'Matrix.org': 'matrix.org',
  'Stackfield': 'stackfield.com',
  'kDrive': 'kdrive.infomaniak.com',
  'Perplexity.ai': 'perplexity.ai',
}

const faviconUrl = computed(() => {
  const domain = domainMap[props.logiciel.nom]
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : null
})

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
    return `${B} text-[${C.green}] bg-[${C.green}]/10 border-[${C.green}]/25`
  if (etat === "A l'étude")
    return `${B} text-[${C.caramel}] bg-[${C.caramel}]/10 border-[${C.caramel}]/25`
  if (etat === 'backlog')
    return `${B} text-white bg-white/10 border-white/20`
  if (etat === 'Abandonné')
    return `${B} text-[#A1A1AA] bg-zinc-800/40 border-zinc-700/30`
  return `${B} text-[#A1A1AA] bg-zinc-800/40 border-zinc-700/30`
}

function openBadgeClass(v: string | null): string {
  if (v === 'Oui')    return `${B} text-[${C.green}] bg-[${C.green}]/10 border-[${C.green}]/25`
  if (v === 'Partiel') return `${B} text-[${C.citron}] bg-[${C.citron}]/8 border-[${C.citron}]/20`
  if (v === 'Non')    return `${B} text-[${C.red}] bg-[${C.red}]/10 border-[${C.red}]/25`
  return `${B} text-[#A1A1AA] bg-zinc-800/40 border-zinc-700/30`
}

function secBadgeClass(v: string | null): string {
  if (v === 'Fort')   return `${B} text-[${C.green}] bg-[${C.green}]/10 border-[${C.green}]/25`
  if (v === 'Moyen')  return `${B} text-[${C.citron}] bg-[${C.citron}]/8 border-[${C.citron}]/20`
  if (v === 'Faible') return `${B} text-[${C.red}] bg-[${C.red}]/10 border-[${C.red}]/25`
  return `${B} text-[#A1A1AA] bg-zinc-800/40 border-zinc-700/30`
}

function portBadgeClass(v: string | null): string {
  if (v === 'Importante')   return `${B} text-[${C.green}] bg-[${C.green}]/10 border-[${C.green}]/25`
  if (v === 'Satisfaisante') return `${B} text-white bg-white/10 border-white/20`
  if (v === 'Faible')       return `${B} text-[${C.red}] bg-[${C.red}]/10 border-[${C.red}]/25`
  return `${B} text-[#A1A1AA] bg-zinc-800/40 border-zinc-700/30`
}

function serverClass(_s: string): string {
  return 'text-[12px] font-normal px-1.5 py-0.5 rounded bg-zinc-800/60 border border-zinc-700/50 text-[#A1A1AA]'
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
            v-if="faviconUrl"
            :src="faviconUrl"
            :alt="logiciel.nom"
            class="w-5 h-5 rounded flex-shrink-0 object-contain"
          />
          <span v-else class="w-5 h-5 rounded bg-zinc-700 flex-shrink-0" />
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
          <span class="text-[12px] text-[#898994]">Score</span>
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
  <USlideover v-model="isOpen" side="right" :ui="{ width: 'max-w-xl' }">
    <div class="flex flex-col h-full overflow-hidden" style="background:#000419">

      <!-- Header -->
      <div class="px-6 py-5 border-b border-white/8 flex-shrink-0">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <img v-if="faviconUrl" :src="faviconUrl" :alt="logiciel.nom" class="w-7 h-7 rounded object-contain" />
              <h2 class="text-[26px] font-medium text-white">{{ logiciel.nom }}</h2>
              <span class="text-xl">{{ logiciel.nationalite }}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span :class="stateBadgeClass(logiciel.etat)">{{ stateLabel }}</span>
              <span :class="openBadgeClass(logiciel.code_ouvert)">
                {{ logiciel.code_ouvert ? `OpenSource: ${logiciel.code_ouvert}` : 'OpenSource ?' }}
              </span>
              <span v-if="logiciel.ux !== null" :class="B" class="text-[#FB9CA0] bg-[#FB9CA0]/10 border-[#FB9CA0]/25">
                UX {{ logiciel.ux }}/10
              </span>
            </div>
          </div>
          <UButton icon="i-heroicons-x-mark" variant="ghost" color="gray" size="sm" @click="isOpen = false" />
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto divide-y divide-white/5">

        <div class="px-6 py-5 space-y-4">
          <div v-if="logiciel.contenu?.siege_social">
            <p class="text-[13px] font-semibold uppercase tracking-widest text-[#898994] mb-1.5 flex items-center gap-1.5">
              <UIcon name="i-heroicons-building-office-2" class="w-3.5 h-3.5" /> Siège social
            </p>
            <p class="text-base text-zinc-300 leading-relaxed">{{ logiciel.contenu.siege_social }}</p>
          </div>
          <div v-if="logiciel.contenu?.actionnariat">
            <p class="text-[13px] font-semibold uppercase tracking-widest text-[#898994] mb-1.5 flex items-center gap-1.5">
              <UIcon name="i-heroicons-chart-pie" class="w-3.5 h-3.5" /> Actionnariat
            </p>
            <p class="text-base text-zinc-300 leading-relaxed">{{ logiciel.contenu.actionnariat }}</p>
          </div>
        </div>

        <div v-if="logiciel.contenu?.infrastructure" class="px-6 py-5">
          <p class="text-[13px] font-semibold uppercase tracking-widest text-[#898994] mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-server" class="w-3.5 h-3.5" /> Infrastructure
          </p>
          <p class="text-sm text-zinc-300 leading-relaxed mb-2">{{ logiciel.contenu.infrastructure }}</p>
          <div v-if="logiciel.serveurs?.length" class="flex flex-wrap gap-1">
            <span v-for="s in logiciel.serveurs" :key="s" :class="serverClass(s)">{{ s }}</span>
          </div>
        </div>

        <div v-if="fonctionnalites.length" class="px-6 py-5">
          <p class="text-[13px] font-semibold uppercase tracking-widest text-[#898994] mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5" /> Fonctionnalités
          </p>
          <ul class="space-y-1.5">
            <li v-for="(f, i) in fonctionnalites" :key="i" class="flex items-start gap-2 text-base text-zinc-300">
              <span class="w-1 h-1 rounded-full mt-2 flex-shrink-0" style="background:#7FB069" />
              {{ f }}
            </li>
          </ul>
        </div>

        <div v-if="logiciel.contenu?.securite_detail" class="px-6 py-5">
          <p class="text-[13px] font-semibold uppercase tracking-widest text-[#898994] mb-2 flex items-center gap-2">
            <UIcon name="i-heroicons-shield-check" class="w-3.5 h-3.5" />
            Sécurité
            <span v-if="logiciel.securite" :class="secBadgeClass(logiciel.securite)">{{ logiciel.securite }}</span>
          </p>
          <p class="text-base text-zinc-300 leading-relaxed">{{ logiciel.contenu.securite_detail }}</p>
        </div>

        <div v-if="problemes.length" class="px-6 py-5">
          <p class="text-[11px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" style="color:#EC6B40">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5" /> Points d'attention
          </p>
          <ul class="space-y-1.5">
            <li v-for="(p, i) in problemes" :key="i" class="flex items-start gap-2 text-base text-zinc-300">
              <span class="w-1 h-1 rounded-full mt-2 flex-shrink-0" style="background:#EC6B40" />
              {{ p }}
            </li>
          </ul>
        </div>

        <div v-if="logiciel.contenu?.avantages_souverains" class="px-6 py-5">
          <p class="text-[11px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" style="color:#7FB069">
            <UIcon name="i-heroicons-shield-check" class="w-3.5 h-3.5" /> Avantages souverains
          </p>
          <p class="text-base text-zinc-300 leading-relaxed">{{ logiciel.contenu.avantages_souverains }}</p>
        </div>

        <div v-if="logiciel.contenu?.cout_detail" class="px-6 py-5">
          <p class="text-[13px] font-semibold uppercase tracking-widest text-[#898994] mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-banknotes" class="w-3.5 h-3.5" /> Coût
          </p>
          <p class="text-base text-zinc-300 leading-relaxed">{{ logiciel.contenu.cout_detail }}</p>
        </div>

        <div v-if="logiciel.contenu?.migration" class="px-6 py-5">
          <p class="text-[13px] font-semibold uppercase tracking-widest text-[#898994] mb-2 flex items-center gap-1.5">
            <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5" /> Migration
          </p>
          <p class="text-base text-zinc-300 leading-relaxed">{{ logiciel.contenu.migration }}</p>
        </div>


      </div>
    </div>
  </USlideover>
</template>
