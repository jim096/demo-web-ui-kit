<template>
    <TCard
        class="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        <img :src="props.game.image" :alt="props.game.title" class="w-full h-32 object-cover rounded-lg mb-3" />
        <h3 class="text-lg font-semibold text-white mb-2">{{ props.game.title }}</h3>
        <p class="text-sm text-blue-100 mb-2">{{ props.game.genre }} - {{ props.game.platform }}</p>
        <div class="flex justify-between items-center mb-3">
            <span class="text-yellow-400 font-medium">★ {{ props.game.rating }}</span>
            <TCheckbox v-model="localFavorite" size="sm" color="warning" variant="card" indicator="end"
                label="Yêu thích" @change="handleToggleFavorite"/>
        </div>
        <TButton block color="primary" size="md" icon="i-heroicons-play" @click="handlePlay">
            Chơi
        </TButton>
    </TCard>
</template>

<script setup lang="ts">
interface Game {
    id: number
    image: string
    title: string
    genre: string
    platform: string
    rating: number
}

// Define props
const props = defineProps({
    game: {
        type: Object as PropType<Game>,
        required: true
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
})

// Define emits
const emit = defineEmits(['play', 'toggle-favorite'])

const localFavorite = ref(props.isFavorite)

// Watch prop changes from parent
watch(() => props.isFavorite, (newVal) => {
    localFavorite.value = newVal
})

const handlePlay = () => {
    emit('play', props.game)
}
const handleToggleFavorite = () => {
    emit('toggle-favorite', props.game.id)
}


</script>