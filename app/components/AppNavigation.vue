<template>
    <header
        class="bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg py-4 px-6 md:px-10 flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center gap-4 text-primary hover:opacity-80 transition-opacity">
            <svg class="text-primary" fill="none" height="24" viewBox="0 0 24 24" width="24"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.23L19.5 8.5V15.5L12 19.77L4.5 15.5V8.5L12 4.23Z"
                    fill="currentColor"></path>
                <path d="M4.5 8.5L12 12.5L19.5 8.5" stroke="currentColor" stroke-width="1.5"></path>
                <path d="M12 22V12.5" stroke="currentColor" stroke-width="1.5"></path>
            </svg>
            <h1 class="text-xl font-bold" style="color: #709680;">Replay Rune</h1>
        </NuxtLink>
        <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/analysis"
                class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 px-3 py-2 rounded-md hidden">
                Analysis
            </NuxtLink>
            <!-- <NuxtLink to="/subscribe"
                class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 px-3 py-2 rounded-md">
                Subscribe
            </NuxtLink> -->
        </nav>
        <div class="flex items-center gap-4">
            <NuxtLink to="/history"
                class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 px-3 py-2 rounded-md">
                History
            </NuxtLink>
            <a class="hidden text-[var(--text-primary)] font-medium hover:text-[var(--primary-color)] transition-colors duration-200 px-3 py-2"
                href="#">Login</a>
            <a class="hidden bg-[var(--primary-color)] text-[var(--background-color)] font-bold py-2 px-5 rounded-md hover:shadow-[0_0_15px_rgba(13,242,242,0.7)] transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                href="#">
                Register
            </a>
            <button
                class="md:hidden flex items-center justify-center size-10 rounded-full bg-[var(--card-background)] text-[var(--text-primary)]">
                <span class="material-symbols-outlined">menu</span>
            </button>
        </div>
    </header>

    <!-- Mobile Menu Overlay and Menu -->
    <div class="fixed inset-0 bg-black/50 z-40 hidden" id="mobile-menu-overlay"></div>
    <div class="fixed top-0 right-0 h-full w-64 z-50 transform translate-x-full transition-transform duration-300 ease-in-out md:hidden"
        id="mobile-menu"
        style="background: linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%); box-shadow: 0px 0px 50px #000;">
        <div class="p-6">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-xl font-bold text-[var(--text-primary)]">Menu</h2>
                <button id="close-menu-btn">
                    <span class="material-symbols-outlined text-2xl">close</span>
                </button>
            </div>
            <nav class="flex flex-col gap-4">
                <NuxtLink to="/analysis"
                    class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 py-2 hidden">
                    Analysis
                </NuxtLink>
                <NuxtLink to="/history"
                    class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 py-2">
                    History
                </NuxtLink>
                <!-- <NuxtLink to="/subscribe"
                    class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 py-2">
                    Subscribe
                </NuxtLink> -->
                <hr class="border-[var(--text-secondary)]/20 my-2 hidden" />
                <a class="font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200 py-2 hidden"
                    href="#">Login</a>
                <a class="mt-2 bg-[var(--primary-color)] text-center text-[var(--background-color)] font-bold py-2 px-5 rounded-md glowing-button hidden"
                    href="#">
                    Register
                </a>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Mobile menu functionality
onMounted(() => {
    const mobileMenu = document.getElementById('mobile-menu')
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay')
    const openMenuBtn = document.querySelector('button.md\\:hidden')
    const closeMenuBtn = document.getElementById('close-menu-btn')

    if (mobileMenu && mobileMenuOverlay && openMenuBtn && closeMenuBtn) {
        const toggleMenu = () => {
            mobileMenu.classList.toggle('translate-x-full')
            mobileMenuOverlay.classList.toggle('hidden')
        }

        openMenuBtn.addEventListener('click', toggleMenu)
        closeMenuBtn.addEventListener('click', toggleMenu)
        mobileMenuOverlay.addEventListener('click', toggleMenu)
    }
})
</script>

<style scoped>
/* Component-specific styles can go here if needed */
</style>
