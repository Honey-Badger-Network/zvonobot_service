<template>
    <el-container class="app-shell">
        <el-aside class="sidebar" :width="collapsed ? '76px' : '248px'">
            <div class="brand" @click="$router.push('/')">
                <div class="brand-mark">Z</div>
                <div v-if="!collapsed" class="brand-copy">
                    <strong>Zvonobot</strong>
                    <span>Control center</span>
                </div>
            </div>

            <el-menu :default-active="$route.path" router :collapse="collapsed" class="nav-menu">
                <el-menu-item index="/"><el-icon><DataBoard /></el-icon><template #title>Обзор</template></el-menu-item>
                <el-menu-item index="/leads"><el-icon><User /></el-icon><template #title>Лиды</template></el-menu-item>
                <el-menu-item index="/mailings"><el-icon><Promotion /></el-icon><template #title>Рассылки</template></el-menu-item>
                <el-menu-item index="/traffic"><el-icon><TrendCharts /></el-icon><template #title>Трафик</template></el-menu-item>
                <el-menu-item index="/minuses"><el-icon><Coin /></el-icon><template #title>Минусы</template></el-menu-item>
                <el-menu-item index="/tokens"><el-icon><Key /></el-icon><template #title>Токены</template></el-menu-item>
            </el-menu>

            <button class="collapse-button" @click="collapsed = !collapsed">
                <el-icon><Fold v-if="!collapsed" /><Expand v-else /></el-icon>
                <span v-if="!collapsed">Свернуть</span>
            </button>
        </el-aside>

        <el-container class="content-shell">
            <el-header class="topbar">
                <div>
                    <p class="eyebrow">ПАНЕЛЬ УПРАВЛЕНИЯ</p>
                    <h1>{{ $route.meta.title }}</h1>
                    <p>{{ $route.meta.subtitle }}</p>
                </div>
                <div class="topbar-status"><span></span> Сервис активен</div>
            </el-header>
            <el-main class="main-content">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'App',
    data() {
        return { collapsed: false }
    }
}
</script>
