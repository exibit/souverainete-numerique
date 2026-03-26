<script setup lang="ts">
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
  challenge: { role: string | null; demarche: string | null }
  notion_url: string
}

const props = defineProps<{
  demarche: string
  icon: string
  challenged: Logiciel[]
  challengers: Logiciel[]
}>()

// Ordre de tri des états (actifs en premier, archivés en dernier)
const etatOrder: Record<string, number> = {
  'Utilisé': 0,
  'En cours de migration': 1,
  "A l'étude": 2,
  'backlog': 3,
  'Abandonné': 4,
}

const sortedChallengers = computed(() => props.challengers)

// Une alternative "Utilisé" ou "En cours de migration" reçoit la même apparence que le challengé
function isHighlighted(etat: string): boolean {
  return etat === 'Utilisé' || etat === 'En cours de migration'
}
</script>

<template>
  <div class="mb-16">

    <!-- Section header -->
    <div class="flex items-center gap-3 mb-8">
      <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        <UIcon :name="icon" class="w-4 h-4 text-[#FB9CA0]" />
      </div>
      <h2 class="text-2xl font-medium text-white tracking-tight">{{ demarche }}</h2>
      <span class="text-sm text-[#898994] font-mono self-end mb-0.5">
        {{ challenged.length + challengers.length }}
      </span>
    </div>

    <!-- Two-column layout -->
    <div class="grid lg:grid-cols-[260px_1fr] gap-8 items-start">

      <!-- Currently used (challengé) -->
      <div>
        <h3 class="text-[15px] font-normal uppercase tracking-widest text-[#898994] mb-3">
          Actuellement utilisé
        </h3>
        <div v-if="challenged.length" class="space-y-3">
          <LogicielCard
            v-for="l in challenged"
            :key="l.nom"
            :logiciel="l"
            :is-challenged="true"
          />
        </div>
        <p v-else class="text-base text-zinc-700 py-2">Aucun dans ce filtre</p>
      </div>

      <!-- Challengers (alternatives) triées par état -->
      <div>
        <h3 class="text-[15px] font-normal uppercase tracking-widest text-[#898994] mb-3">
          Alternatives évaluées
        </h3>
        <div
          v-if="sortedChallengers.length"
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <LogicielCard
            v-for="l in sortedChallengers"
            :key="l.nom"
            :logiciel="l"
            :is-challenged="isHighlighted(l.etat)"
          />
        </div>
        <p v-else class="text-base text-zinc-700 py-2">Aucune alternative dans ce filtre</p>
      </div>

    </div>

    <!-- Section separator -->
    <div class="mt-16 h-px bg-white/5" />
  </div>
</template>
