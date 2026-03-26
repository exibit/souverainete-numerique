<script setup lang="ts">
import rawData from '~/logiciels_souverainete_spade.json'

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
  challenge: {
    role: string | null
    demarche: string | null
  }
  notion_url: string
  contenu?: Contenu
}

const data = rawData as {
  generated_at: string
  source: string
  note: string
  logiciels: Logiciel[]
}

const logiciels = data.logiciels

const selectedDemarche = ref<string>('')
const search = ref<string>('')

const demarches = computed(() =>
  [...new Set(logiciels.map(l => l.challenge?.demarche).filter((d): d is string => !!d))]
)

const demarcheCount = computed(() => {
  const counts: Record<string, number> = {}
  logiciels.forEach(l => {
    const d = l.challenge?.demarche
    if (d) counts[d] = (counts[d] || 0) + 1
  })
  return counts
})

const stats = computed(() => [
  { value: logiciels.length, label: 'logiciels analysés' },
  { value: demarches.value.length, label: 'démarches' },
  { value: logiciels.filter(l => l.etat === 'Utilisé').length, label: 'utilisés' },
  { value: logiciels.filter(l => l.code_ouvert === 'Oui').length, label: 'open source' },
  { value: logiciels.filter(l => l.nationalite !== '🇺🇸').length, label: 'non-US' },
])

const filtered = computed(() =>
  logiciels.filter(l => {
    if (selectedDemarche.value && l.challenge?.demarche !== selectedDemarche.value) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      const hay = [l.nom, l.etat, l.challenge?.demarche, ...(l.serveurs || [])].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
)

interface DemarcheGroup {
  challenged: Logiciel[]
  challengers: Logiciel[]
}

const grouped = computed(() => {
  const groups: Record<string, DemarcheGroup> = {}
  const standalone: Logiciel[] = []

  filtered.value.forEach(l => {
    const d = l.challenge?.demarche
    if (d) {
      if (!groups[d]) groups[d] = { challenged: [], challengers: [] }
      if (l.challenge.role === 'challengé') groups[d].challenged.push(l)
      else groups[d].challengers.push(l)
    } else {
      standalone.push(l)
    }
  })

  const byScore = (a: Logiciel, b: Logiciel) => (b.score ?? 0) - (a.score ?? 0)
  Object.values(groups).forEach(g => {
    g.challenged.sort(byScore)
    g.challengers.sort(byScore)
  })
  standalone.sort(byScore)

  return { groups, standalone }
})

const formattedDate = computed(() => {
  const [year, month, day] = data.generated_at.split('-')
  return `${day}/${month}/${year}`
})

const demarcheIcons: Record<string, string> = {
  'Messagerie professionnelle': 'i-heroicons-chat-bubble-left-right',
  'Service cloud': 'i-heroicons-cloud',
  'Prototypage UI': 'i-heroicons-paint-brush',
}

function toggleDemarche(value: string) {
  selectedDemarche.value = selectedDemarche.value === value ? '' : value
}
</script>

<template>
  <div class="min-h-screen text-white relative">

    <!-- Halo de fond -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-32 -right-32 w-[800px] h-[800px] rounded-full"
           style="background: radial-gradient(circle, #0312B3 0%, #01084D 45%, transparent 70%); opacity: 0.35" />
    </div>

    <!-- ── Hero ── -->
    <div class="max-w-[1240px] mx-auto px-6 pt-16 pb-16">
      <a href="https://www.spade.be" aria-label="Retour à l'accueil" class="block w-fit mb-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="80 68 215 50" aria-hidden="true" class="h-7 w-auto">
          <path fill="#ffffff" d="M124.9,102.4c7.6,0,13.1,5.8,13.1,14s-5,14-12.7,14a10.3,10.3,0,0,1-7.9-3.4v8.7l-7,3.6V103H117v2.8A10.45,10.45,0,0,1,124.9,102.4Zm-26.8,0a9.89,9.89,0,0,1,9.1,4.8l-4.6,3.5a6.16,6.16,0,0,0-4.8-2.6c-1.6,0-2.8.8-2.8,2.1,0,4.2,12.7,2.2,12.7,11.7,0,5.2-4.5,8.5-10.2,8.5a11.55,11.55,0,0,1-10-5l4.1-3.7a7.63,7.63,0,0,0,6.1,2.9c2,0,3.3-.9,3.3-2.4,0-4.1-12.6-2.5-12.6-12,0-5,4.2-7.9,9.7-7.8Zm116.4,0c8.3,0,13,5.5,13,14.2a7.57,7.57,0,0,1-.1,1.5H208.6c.1,3.6,3,6.1,6.9,6.1a7.92,7.92,0,0,0,6.5-3.3l4.6,3.5c-1,1.9-4.6,5.9-11.2,5.9-8.6,0-14-5.9-14-13.9S206.9,102.4,214.5,102.4Zm-60.2,0a14.21,14.21,0,0,1,7.3,1.9V103h7v26.7h-6.1l-.4-1.4a15.38,15.38,0,0,1-7.8,2c-8.3,0-14.3-5.8-14.3-13.8a13.91,13.91,0,0,1,13.9-14.1Zm44.6-8.9v36.2h-6.6v-2.8a10.39,10.39,0,0,1-7.9,3.5c-7.7,0-13.1-5.8-13.1-14s5-14,12.6-14a10.3,10.3,0,0,1,7.9,3.4V97.2Zm-74.8,15.1c-4.3,0-6.8,3.5-6.8,7.7,0,5,3,7.8,6.8,7.8,4.1,0,6.8-3.2,6.8-7.8S128.1,108.6,124.1,108.6Zm30.3,0c-4.2,0-7.3,3.3-7.3,7.8s3.1,7.7,7.3,7.7,7.3-3.2,7.3-7.7S158.6,108.6,154.4,108.6Zm30.8,0c-4.1,0-6.8,3.2-6.8,7.8s2.9,7.7,6.8,7.7c4.3,0,6.8-3.5,6.8-7.7C192,111.5,189.1,108.6,185.2,108.6Zm29.4-.5a5.66,5.66,0,0,0-5.8,5.4h11.5a5.46,5.46,0,0,0-5.5-5.4Z" transform="translate(40.1 -25.37)"/>
        </svg>
      </a>
      <h1 class="text-5xl sm:text-[80px] font-medium text-white leading-[1] mb-6">
        Démarche de souveraineté numérique
      </h1>
      <p class="text-zinc-400 text-lg max-w-xl leading-relaxed mb-10">
        Analyse et comparaison des alternatives souveraines aux outils numériques actuellement utilisés chez Spade.
      </p>

      <!-- Stats + date -->
      <div class="flex flex-wrap gap-x-8 gap-y-3">
        <div v-for="stat in stats" :key="stat.label" class="flex items-baseline gap-2">
          <span class="text-[26px] font-bold text-white font-mono">{{ stat.value }}</span>
          <span class="text-base text-[#A1A1AA]">{{ stat.label }}</span>
        </div>
        <div class="flex items-baseline self-end" style="margin-bottom:5px">
          <span class="text-base text-[#A1A1AA]">mise à jour : {{ formattedDate }}</span>
        </div>
      </div>
    </div>

    <!-- ── Divider ── -->
    <div class="max-w-[1240px] mx-auto px-6">
      <div class="h-px bg-white/8" />
    </div>

    <!-- ── Main content ── -->
    <div class="max-w-[1240px] mx-auto px-6 py-12">

      <!-- ── Filtre démarches ── -->
      <div class="flex items-center gap-2 mb-10 px-4 py-3 rounded-xl border border-white/20 w-full">
        <span class="text-sm font-semibold text-[#A1A1AA] flex-shrink-0">Démarches</span>
        <div class="w-px h-4 bg-white/10 flex-shrink-0" />
        <UButton
          size="sm"
          :variant="selectedDemarche === '' ? 'solid' : 'ghost'"
          :color="selectedDemarche === '' ? 'primary' : 'gray'"
          label="Toutes"
          :ui="{ rounded: 'rounded-full', color: { gray: { ghost: 'text-white hover:text-white hover:bg-white/10' } } }"
          @click="selectedDemarche = ''"
        />
        <UButton
          v-for="d in demarches"
          :key="d"
          size="sm"
          :variant="selectedDemarche === d ? 'solid' : 'ghost'"
          :color="selectedDemarche === d ? 'primary' : 'gray'"
          :label="`${d} (${demarcheCount[d]})`"
          :ui="{ rounded: 'rounded-full', color: { gray: { ghost: 'text-white hover:text-white hover:bg-white/10' } } }"
          @click="toggleDemarche(d)"
        />
        <div class="ml-auto flex items-center gap-2 flex-shrink-0">
          <div class="w-px h-4 bg-white/10" />
          <UInput
            v-model="search"
            placeholder="Recherche logiciel"
            icon="i-heroicons-magnifying-glass"
            size="sm"
            variant="none"
            :ui="{ rounded: 'rounded-full', color: { white: { none: 'text-[#000419] placeholder-[#898994]' } } }"
            class="w-40"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filtered.length === 0" class="flex flex-col items-center justify-center py-24 text-[#898994]">
        <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 mb-4" />
        <p class="text-lg">Aucun logiciel ne correspond à vos filtres.</p>
        <UButton
          variant="ghost"
          color="gray"
          label="Réinitialiser"
          class="mt-4"
          @click="selectedDemarche = ''; search = ''"
        />
      </div>

      <template v-else>
        <DemarcheSection
          v-for="(group, demarche) in grouped.groups"
          :key="demarche"
          :demarche="(demarche as string)"
          :icon="demarcheIcons[(demarche as string)] || 'i-heroicons-wrench-screwdriver'"
          :challenged="group.challenged"
          :challengers="group.challengers"
        />

        <div v-if="grouped.standalone.length" class="mb-12">
          <div class="flex items-center gap-3 mb-6">
            <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-zinc-500" />
            <h2 class="text-lg font-semibold text-white">Autres logiciels</h2>
            <span class="text-xs text-[#898994]">{{ grouped.standalone.length }}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <LogicielCard v-for="l in grouped.standalone" :key="l.nom" :logiciel="l" />
          </div>
        </div>
      </template>
    </div>

    <!-- ── Footer ── -->
    <footer class="max-w-[1240px] mx-auto px-6 pt-12 pb-10">
      <div class="h-px bg-white/10 mb-10" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- Col 1 : Logo -->
        <div>
          <a href="https://www.spade.be" aria-label="Retour à l'accueil" class="block w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="80 68 215 50" aria-hidden="true" class="h-7 w-auto">
              <path fill="#ffffff" d="M124.9,102.4c7.6,0,13.1,5.8,13.1,14s-5,14-12.7,14a10.3,10.3,0,0,1-7.9-3.4v8.7l-7,3.6V103H117v2.8A10.45,10.45,0,0,1,124.9,102.4Zm-26.8,0a9.89,9.89,0,0,1,9.1,4.8l-4.6,3.5a6.16,6.16,0,0,0-4.8-2.6c-1.6,0-2.8.8-2.8,2.1,0,4.2,12.7,2.2,12.7,11.7,0,5.2-4.5,8.5-10.2,8.5a11.55,11.55,0,0,1-10-5l4.1-3.7a7.63,7.63,0,0,0,6.1,2.9c2,0,3.3-.9,3.3-2.4,0-4.1-12.6-2.5-12.6-12,0-5,4.2-7.9,9.7-7.8Zm116.4,0c8.3,0,13,5.5,13,14.2a7.57,7.57,0,0,1-.1,1.5H208.6c.1,3.6,3,6.1,6.9,6.1a7.92,7.92,0,0,0,6.5-3.3l4.6,3.5c-1,1.9-4.6,5.9-11.2,5.9-8.6,0-14-5.9-14-13.9S206.9,102.4,214.5,102.4Zm-60.2,0a14.21,14.21,0,0,1,7.3,1.9V103h7v26.7h-6.1l-.4-1.4a15.38,15.38,0,0,1-7.8,2c-8.3,0-14.3-5.8-14.3-13.8a13.91,13.91,0,0,1,13.9-14.1Zm44.6-8.9v36.2h-6.6v-2.8a10.39,10.39,0,0,1-7.9,3.5c-7.7,0-13.1-5.8-13.1-14s5-14,12.6-14a10.3,10.3,0,0,1,7.9,3.4V97.2Zm-74.8,15.1c-4.3,0-6.8,3.5-6.8,7.7,0,5,3,7.8,6.8,7.8,4.1,0,6.8-3.2,6.8-7.8S128.1,108.6,124.1,108.6Zm30.3,0c-4.2,0-7.3,3.3-7.3,7.8s3.1,7.7,7.3,7.7,7.3-3.2,7.3-7.7S158.6,108.6,154.4,108.6Zm30.8,0c-4.1,0-6.8,3.2-6.8,7.8s2.9,7.7,6.8,7.7c4.3,0,6.8-3.5,6.8-7.7C192,111.5,189.1,108.6,185.2,108.6Zm29.4-.5a5.66,5.66,0,0,0-5.8,5.4h11.5a5.46,5.46,0,0,0-5.5-5.4Z" transform="translate(40.1 -25.37)"/>
            </svg>
          </a>
        </div>

        <!-- Col 2 : Adresses -->
        <div class="space-y-5">
          <div>
            <p class="text-sm font-semibold text-white mb-1">Bruxelles</p>
            <p class="text-sm text-[#A1A1AA] leading-relaxed">Rue Vanderschrick 85 · 1060 Bruxelles<br>+32 2 721 61 72</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-white mb-1">Namur</p>
            <p class="text-sm text-[#A1A1AA] leading-relaxed">Rue des Brasseurs 107 · 5000 Namur<br>+32 81 84 01 20</p>
          </div>
        </div>

        <!-- Col 3 : Liens -->
        <div>
          <a
            href="https://www.spade.be/fr/cgv/"
            target="_blank"
            rel="noopener"
            class="text-sm text-[#A1A1AA] hover:text-white transition-colors"
          >Conditions générales de vente</a>
        </div>

      </div>

      <div class="h-px bg-white/10 mt-10 mb-6" />
      <p class="text-sm text-[#898994]">© 2026 · Tous droits réservés.</p>
    </footer>

  </div>
</template>
