<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8" :style="{ background: 'var(--bg-primary)' }">
    <div class="max-w-desktop mx-auto">
      <!-- Header -->
      <header class="text-center mb-12">
        <div class="flex justify-between mb-4">
          <div></div>
          <h1 class="text-5xl font-bold drop-shadow-lg text-neutral">Game Portal Hub</h1>
          <GSelect class="w-auto" v-model="selectedTheme" :items="themeItems" placeholder="Chọn theme" color="info"
            variant="outline" size="md" @change="handleThemeChange" />
        </div>
        <p class="text-xl">Khám phá và chơi hàng trăm tựa game đỉnh cao ngay tại đây!</p>
        <div class="mt-6 flex justify-center space-x-4">
          <GButton color="primary" size="lg" @click="handleSearchFocus">
            Tìm Game
          </GButton>
          <GButton color="secondary" variant="outline" size="lg" @click="favoritesOpen = !favoritesOpen">
            {{ favoritesOpen ? 'Đóng' : 'Yêu Thích' }}
          </GButton>
        </div>
      </header>

      <!-- Search and Filters -->
      <section class="mb-12 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div class="flex items-center flex-wrap gap-4">
          <GInput class="w-fit" inputRef="searchInput" v-model="searchQuery" placeholder="Tìm kiếm game theo tên..." size="md" color="primary"
            leading-icon="i-heroicons-magnifying-glass" icon="magnifying-glass" :loading="isLoadingSearch"
            @focus="handleSearchFocus" @input="simulateLoadingSearch" @keydown="handleSearchKeydown" />
          <GSelect class="w-fit" v-model="selectedGenre" :items="genreItems" placeholder="Chọn thể loại"
            color="secondary" variant="outline" size="md" @change="handleGenreChange" />
          <GSelect class="w-fit" v-model="selectedPlatform" :items="platformItems" placeholder="Chọn nền tảng"
            color="info" variant="outline" size="md" @change="handlePlatformChange" />
        </div>
      </section>

      <!-- Favorites Toggle -->
      <section v-if="favoritesOpen" class="mb-12 backdrop-blur-md rounded-xl p-6 shadow-xl" :style="{ backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-lg)' }">
        <h2 class="text-2xl font-semibold mb-4">Game Yêu Thích</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <GameCard v-for="game in filteredFavorites" :key="game.id" :game="game" :is-favorite="true"
            @play="handlePlayGame" @toggle-favorite="handleToggleFavorite" />
        </div>
      </section>

      <!-- Event Log -->
      <div class="mb-8 p-4 rounded-lg" :style="{ backgroundColor: 'var(--bg-tertiary)', boxShadow: 'var(--shadow-md)' }">
        <div class="flex justify-between">
          <h3 class="text-lg font-semibold mb-2">Nhật Ký Tương Tác</h3>
          <GButton variant="solid" color="warning" @click="handleClearLogs">Xóa nhật ký</GButton>
        </div>
        <div v-for="(event, index) in eventLog" :key="index" class="text-sm mb-1">
          {{ event }}
        </div>
      </div>

      <!-- Games Grid -->
      <section class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">Danh Sách Game</h2>
          <GButton color="success" variant="ghost" @click="loadMoreGames">
            Tải Thêm
          </GButton>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <GameCard v-for="game in filteredGames" :key="game.id" :game="game" :is-favorite="favorites.includes(game.id)"
            @play="handlePlayGame" @toggle-favorite="handleToggleFavorite" />
        </div>
        <div v-if="filteredGames.length === 0" class="text-center py-12">
          <GAlert title="Không tìm thấy game" description="Hãy thử tìm kiếm khác hoặc thay đổi bộ lọc." color="warning"
            variant="soft" icon="i-heroicons-exclamation-triangle" />
        </div>
      </section>

      <UModal v-model:open="modalOpen" :title="selectedGame?.title || ''" :ui="{
        wrapper: 'z-50',
        content: 'rounded-lg shadow-xl max-w-md w-full',
        header: 'p-4 border-b',
        body: 'p-4',
        footer: 'p-4 border-t flex justify-end space-x-2'
      }">
        <!-- Body: Hình ảnh và thông tin chi tiết -->
        <template #body>
          <div class="flex items-start space-x-4">
            <img :src="selectedGame?.image || ''" :alt="selectedGame?.title || ''"
              class="w-16 h-16 rounded-lg flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-gray-900 dark:text-white mb-2 text-sm">
                Thể loại: {{ selectedGame?.genre || 'N/A' }}
              </p>
              <p class="text-gray-900 dark:text-white mb-2 text-sm">
                Nền tảng: {{ selectedGame?.platform || 'N/A' }}
              </p>
              <p class="text-yellow-400 font-medium mb-2 text-sm">
                Đánh giá: {{ selectedGame?.rating || 'N/A' }}/10
              </p>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                {{ selectedGame?.description || '' }}
              </p>
            </div>
          </div>
        </template>

        <!-- Footer: Actions (buttons) -->
        <template #footer>
          <UButton variant="solid" color="primary" @click="handlePlayGame(selectedGame)">
            Chơi Ngay
          </UButton>
          <UButton variant="outline" color="secondary" @click="handleAddToCart(selectedGame)">
            Thêm Vào Giỏ
          </UButton>
          <UButton variant="outline" color="neutral" @click="closeModal">
            Đóng
          </UButton>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Color Mode
const colorMode = useColorMode()
const selectedTheme = ref(colorMode.preference)
// khi user đổi theme
watch(selectedTheme, (val) => {
  colorMode.preference = val
})

// Event Log
const eventLog = ref<string[]>([])
const addEvent = (event: string) => {
  eventLog.value.push(`${new Date().toLocaleTimeString()}: ${event}`)
  if (eventLog.value.length > 10) eventLog.value.shift()
}

// Game Data
const games = ref([
  { id: 1, title: 'Super Mario Odyssey', genre: 'Platformer', platform: 'Nintendo Switch', description: 'Phiêu lưu qua các thế giới đa dạng.', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQrFOMEXeFPisA24Umoa9NRXoFNYj0W5D7itobz1LRRi_9X6LfY', rating: 9.5 },
  { id: 2, title: 'The Legend of Zelda', genre: 'Adventure', platform: 'Nintendo Switch', description: 'Khám phá thế giới mở rộng lớn.', image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTvv7AdnDOiUfeZAH4NWSNPqjMss3NSuo7nISf7Y3k4bskoR0ok', rating: 9.8 },
  { id: 3, title: 'Fortnite', genre: 'Battle Royale', platform: 'Multi', description: 'Chiến đấu sinh tồn với bạn bè.', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRWExVCRY_WnwJm6uMxodgrSlBbot9x_LpO66UPwTrxVeJdI_TW', rating: 8.5 },
  { id: 4, title: 'Minecraft', genre: 'Sandbox', platform: 'Multi', description: 'Xây dựng và sáng tạo vô tận.', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS8GqmyBiwcs2RvDreAHAs_fg5e8es-KYLzHM9NqA7nWuU6K705', rating: 9.2 },
  { id: 5, title: 'Genshin Impact', genre: 'RPG', platform: 'Multi', description: 'RPG hành động thế giới mở.', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQA7cfIB0ayy8wIT3tQCNWrkO3yH6ounYhVU2rrtbAgITMNu4XD', rating: 8.9 },
  { id: 6, title: 'Among Us', genre: 'Social Deduction', platform: 'Multi', description: 'Phát hiện kẻ phản bội.', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0DAQQs3-EpvfldJOCh292_ueF3LgmNSzEa5itB7WHiKwBhD7W', rating: 8.0 },
  { id: 7, title: 'Cyberpunk 2077', genre: 'RPG', platform: 'PC', description: 'Thế giới tương lai dystopian.', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSM0vv4cTvXHOMfYfmXSTPaasKG5HoqiDj4hlDizehQgBSBqzYX', rating: 8.7 },
  { id: 8, title: 'The Witcher 3', genre: 'RPG', platform: 'Multi', description: 'Câu chuyện epic về phù thủy.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgOPtH8lO6v8aRGGNpdEpaJgtR5GEO1UlnPv33E4-9hyPDQHa7', rating: 9.7 }
])

// Reactive States
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const debouncedSearchQuery = ref('')
const selectedGenre = ref('')
const selectedPlatform = ref('')
const favorites = ref<number[]>([1, 3]) // Initial favorites
const favoritesOpen = ref(false)
const selectedGame = ref<any>(null)
const loadedGames = ref(8) // Simulate pagination
const isLoadingSearch = ref(false);
let debounceTimer = 0;

// Computed Filtered Games
const filteredGames = computed(() => {
  let filtered = games.value.slice(0, loadedGames.value)
  if (debouncedSearchQuery.value) {
    filtered = filtered.filter(game => game.title.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase()))
  }
  if (selectedGenre.value && selectedGenre.value != "all") {
    filtered = filtered.filter(game => game.genre === selectedGenre.value)
  }
  if (selectedPlatform.value && selectedPlatform.value != "all") {
    filtered = filtered.filter(game => game.platform === selectedPlatform.value)
  }
  return filtered
})

const filteredFavorites = computed(() => {
  return games.value.filter(game => favorites.value.includes(game.id))
})

// Items for Selects
const genreItems = [
  { label: 'Tất Cả', value: 'all' },
  { label: 'Platformer', value: 'Platformer' },
  { label: 'Adventure', value: 'Adventure' },
  { label: 'Battle Royale', value: 'Battle Royale' },
  { label: 'Sandbox', value: 'Sandbox' },
  { label: 'RPG', value: 'RPG' },
  { label: 'Social Deduction', value: 'Social Deduction' }
]

const platformItems = [
  { label: 'Tất Cả', value: 'all' },
  { label: 'Nintendo Switch', value: 'Nintendo Switch' },
  { label: 'Multi', value: 'Multi' },
  { label: 'PC', value: 'PC' }
]

const themeItems = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]


// Handlers
const handleSearchFocus = () => {
  addEvent('Tìm kiếm được focus')
  if(searchInput.value) {
    searchInput.value.focus()
  }
}
const handleSearchKeydown = (event: KeyboardEvent) => addEvent(`Nhấn phím tìm kiếm: ${event.key}`)
const handleGenreChange = (event: Event) => addEvent(`Thay đổi thể loại: ${selectedGenre.value}`)
const handlePlatformChange = (event: Event) => addEvent(`Thay đổi nền tảng: ${selectedPlatform.value}`)
const handleThemeChange = (event: Event) => addEvent(`Thay đổi theme: ${selectedTheme.value}`)
const handleClearLogs = (event: Event) => {
  addEvent(`Nhấn phím clear logs`)
  eventLog.value = []
}
const simulateLoadingSearch = () => {
  // Clear timeout cũ nếu có
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set timeout mới: sau 500ms thì gọi search
  debounceTimer = setTimeout(() => {
    debouncedSearchQuery.value = searchQuery.value;
    isLoadingSearch.value = false;
    addEvent(`Tìm kiếm: ${searchQuery.value}`)
  }, 500);
  isLoadingSearch.value = true;
}
// Computed cho v-model của modal (dựa trên selectedGame)
const modalOpen = computed({
  get: () => !!selectedGame.value,
  set: (value: boolean) => {
    if (!value) {
      selectedGame.value = null
    }
  }
})

// Method đóng modal
const closeModal = () => {
  modalOpen.value = false
}

const handlePlayGame = (game: any) => {
  addEvent(`Chơi game: ${game.title}`)
  console.log('Mở modal cho game:', game.title)
  // Simulate playing: could integrate with iframe or router
  selectedGame.value = game
}


const handleAddToCart = (game: any) => {
  addEvent(`Thêm vào giỏ: ${game.title}`)
  selectedGame.value = null
}

const handleToggleFavorite = (gameId: number) => {
  const index = favorites.value.indexOf(gameId)
  if (index > -1) {
    favorites.value.splice(index, 1)
    addEvent(`Bỏ yêu thích: Game ID ${gameId}`)
  } else {
    favorites.value.push(gameId)
    addEvent(`Thêm yêu thích: Game ID ${gameId}`)
  }
}

const loadMoreGames = () => {
  loadedGames.value += 4
  addEvent('Tải thêm game')
}
</script>