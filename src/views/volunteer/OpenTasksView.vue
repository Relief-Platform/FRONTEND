<template>
  <VolunteerLayout>
    <div class="open-tasks-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ $t('openTasks.title') }}</h1>
          <p class="page-sub">{{ $t('openTasks.sub') }}</p>
        </div>
      </div>

      <p v-if="joinSuccess" class="banner banner--success">{{ joinSuccess }}</p>

      <div class="card">
        <div v-if="isLoading" class="empty-state">{{ $t('common.loading') }}</div>
        <div v-else-if="tasks.length === 0" class="empty-state">{{ $t('openTasks.no_tasks') }}</div>

        <div class="task-list" v-else>
          <div class="task-card" v-for="task in tasks" :key="task.id">
            <div class="task-card__main">
              <span class="task-card__level" :class="`elv-${task.emergencyLevel}`">{{ emergencyLabel(task.emergencyLevel) }}</span>
              <h3 class="task-card__title">{{ task.title }}</h3>
              <p class="task-card__region">{{ task.region }}</p>
              <p class="task-card__slots">{{ $t('openTasks.slots', { current: task.activeAssignmentCount, total: task.targetHeadcount }) }}</p>
              <p class="task-card__time">{{ formatDateTimeVI(task.createdAt) }}</p>
            </div>
            <button
              class="btn-join"
              :disabled="joiningId === task.id"
              @click="handleJoin(task)"
            >
              {{ joiningId === task.id ? $t('openTasks.joining') : $t('openTasks.btn_join') }}
            </button>
          </div>
        </div>
        <p v-if="joinError" class="error-text">{{ joinError }}</p>
      </div>
    </div>
  </VolunteerLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VolunteerLayout from '@/components/layout/VolunteerLayout.vue'
import { getOpenTasks, joinOpenTask, type OpenTask } from '@/features/requests/open-tasks.api'
import { formatDateTimeVI } from '@/features/requests/requests.helpers'

const { t } = useI18n()

const tasks = ref<OpenTask[]>([])
const isLoading = ref(true)
const joiningId = ref<string | null>(null)
const joinError = ref('')
const joinSuccess = ref('')

async function loadTasks() {
  isLoading.value = true
  try {
    const result = await getOpenTasks(1, 100)
    tasks.value = result.items
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
onMounted(loadTasks)

function emergencyLabel(level: number): string {
  if (level >= 3) return t('coordinator.emergency_severe')
  if (level === 2) return t('coordinator.emergency_large_scale')
  return t('coordinator.emergency_low')
}

async function handleJoin(task: OpenTask) {
  joiningId.value = task.id
  joinError.value = ''
  joinSuccess.value = ''
  try {
    await joinOpenTask(task.id)
    joinSuccess.value = t('openTasks.join_success', { title: task.title })
    await loadTasks()
  } catch (e: unknown) {
    joinError.value = e instanceof Error ? e.message : t('openTasks.join_failed')
  } finally {
    joiningId.value = null
  }
}
</script>

<style scoped>
.open-tasks-page { max-width: 1000px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; margin: 0 0 4px 0; }
.page-sub { font-size: 13.5px; color: #718096; margin: 0; }

.banner { border-radius: 8px; padding: 10px 14px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
.banner--success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }

.card { background: #fff; border-radius: 16px; padding: 22px; border: 1px solid #e9ecef; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
.empty-state { text-align: center; padding: 40px 0; color: #94a3b8; font-size: 14px; }

.task-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.task-card {
  border: 1px solid #eef2f7; border-radius: 12px; padding: 16px;
  display: flex; flex-direction: column; gap: 8px; background: #f8fafc;
}
.task-card__level { align-self: flex-start; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.task-card__level.elv-1 { background: #dcfce7; color: #15803d; }
.task-card__level.elv-2 { background: #fef9c3; color: #854d0e; }
.task-card__level.elv-3 { background: #fee2e2; color: #991b1b; }
.task-card__title { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0; }
.task-card__region { font-size: 13px; color: #475569; margin: 0; }
.task-card__slots { font-size: 12.5px; color: #ea580c; font-weight: 600; margin: 0; }
.task-card__time { font-size: 11.5px; color: #a0aec0; margin: 0; }
.btn-join {
  margin-top: 6px; background: #e11d48; color: #fff; border: none; padding: 9px 16px;
  border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
}
.btn-join:hover:not(:disabled) { background: #be123c; }
.btn-join:disabled { opacity: 0.6; cursor: not-allowed; }

.error-text { color: #e53e3e; font-size: 12.5px; margin: 12px 0 0 0; }
</style>
