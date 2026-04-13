import { CATEGORIES, MEDIA_DATA, placeholderX } from './data/index.js';
import { DEFAULT_ICONS, DEFAULT_LABELS, PT_LABELS, CATEGORY_FILTERS } from './data/config.js';

let currentCategory = null;
let currentFilter = 'all';
let showColoredBorders = true;
let isStaggeredMode = false;
let currentLanguage = 'pt';

const appContainer = document.getElementById('app');
const toggleBtn = document.getElementById('toggle-borders-btn');
const layoutToggleBtn = document.getElementById('toggle-layout-btn');

function getStatusIcon(status) {
    return DEFAULT_ICONS[status] || '';
}

function getStatusLabel(status) {
    if (currentLanguage === 'pt') {
        return PT_LABELS[status] || status;
    }
    return DEFAULT_LABELS[status] || status;
}

function getFilterKeys(categoryId) {
    return CATEGORY_FILTERS[categoryId] || ['all', 'seen', 'to-watch', 'hyped'];
}

// Initialize
function init() {
    updateToggleUI();
    render();
    setupGlobalListeners();
}

function setupGlobalListeners() {
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            showColoredBorders = !showColoredBorders;
            updateToggleUI();
            updateBordersUI();
        });
    }

    if (layoutToggleBtn) {
        layoutToggleBtn.addEventListener('click', () => {
            isStaggeredMode = !isStaggeredMode;
            updateToggleUI();
            render(); // Re-render to apply layout change
        });
    }
}

function updateToggleUI() {
    if (toggleBtn) {
        if (showColoredBorders) {
            toggleBtn.classList.add('active');
            toggleBtn.querySelector('.toggle-label').textContent = '✨ Colored Borders: ON';
        } else {
            toggleBtn.classList.remove('active');
            toggleBtn.querySelector('.toggle-label').textContent = '🌑 Colored Borders: OFF';
        }
    }

    if (layoutToggleBtn) {
        const label = layoutToggleBtn.querySelector('.toggle-label');
        if (isStaggeredMode) {
            layoutToggleBtn.classList.add('active');
            label.textContent = '⏫ Layout: 2 LINES';
        } else {
            layoutToggleBtn.classList.remove('active');
            label.textContent = '➖ Layout: 1 LINE';
        }
    }
}

function updateBordersUI() {
    const grid = document.querySelector('.category-grid, .media-list');
    if (grid) {
        if (showColoredBorders) {
            grid.classList.remove('borders-off');
        } else {
            grid.classList.add('borders-off');
        }
    }
}

function getSteamThumb(url) {
    const match = url.match(/\/app\/(\d+)/);
    // Using vertical library capsules for a more premium "cover" look
    return match ? `https://cdn.akamai.steamstatic.com/steam/apps/${match[1]}/library_600x900_2x.jpg` : null;
}

function render() {
    if (!currentCategory) {
        renderHomeView();
    } else {
        renderDetailView();
    }
    updateBordersUI();
}

function renderHomeView() {
    appContainer.innerHTML = `
        <section class="home-view">
            <header class="header">
                <h1 class="category-title" style="--accent-color: var(--primary)">GAS+Organizer</h1>
            </header>
            
            <div class="category-grid ${!showColoredBorders ? 'borders-off' : ''} ${isStaggeredMode ? 'staggered' : ''}">
                ${CATEGORIES.map(cat => `
                    <div class="category-card" data-id="${cat.id}" style="--card-accent: ${cat.color}; --card-accent-faint: ${cat.shadow}">
                        <span class="category-icon">${cat.icon}</span>
                        <h3>${cat.name}</h3>
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    // Add listeners to category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            currentCategory = CATEGORIES.find(c => c.id === id);
            currentFilter = 'all'; // Reset filter on category switch
            render();
            window.scrollTo(0, 0);
        });
    });
}

function getColumnCount() {
    const width = window.innerWidth;
    if (width >= 1000) return 4;
    if (width >= 750) return 3;
    if (width >= 500) return 2;
    return 1;
}

function renderMediaCard(item) {
    const icon = getStatusIcon(item.status, currentCategory.id);
    const label = getStatusLabel(item.status, currentCategory.id);

    // Game-specific badges (Current category is games)
    let playerBadge = '';
    if (currentCategory.id === 'games') {
        const modes = [];
        if (item.isSingleplayer) modes.push('<span class="mode-icon single">👤</span>');
        if (item.isMultiplayer) modes.push('<span class="mode-icon multi">👥</span>');

        if (modes.length > 0) {
            const playerLabel = item.isSingleplayer && item.isMultiplayer ? 'Single & Multi' : (item.isMultiplayer ? 'Multi' : 'Single');
            playerBadge = `<div class="status-badge player-mode ${modes.length > 1 ? 'dual' : ''}" title="${playerLabel}">${modes.join('')}</div>`;
        }

        if (item.isEndless) playerBadge += `<div class="status-badge endless" title="Endless Gameplay">∞</div>`;
        if (item.isMobile) playerBadge += `<div class="status-badge mobile" title="Mobile Game">📱</div>`;
    }

    return `
        <div class="media-card" style="--card-accent: ${currentCategory.color}; --card-accent-faint: ${currentCategory.shadow}">
            <div class="thumb-container">
                <div class="badges-wrapper">
                    ${item.favorite ? `<div class="status-badge favorite" title="Favorite">⭐</div>` : ''}
                    ${playerBadge}
                    ${item.status ? `<div class="status-badge ${item.status}" title="${label}">${icon}</div>` : ''}
                </div>
                <img src="${item.displayThumb}" alt="${item.title}" class="media-thumb" onerror="this.src='${placeholderX}'">
            </div>
            <h4>${item.title}</h4>
            <div class="media-info">
                <p class="media-synopsis">${currentLanguage === 'pt' ? (item.synopsisPT || item.synopsis) : item.synopsis}</p>
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="media-link">
                    Open ${currentCategory.id === 'games' ? 'on Steam' : 'Link'}
                </a>
            </div>
        </div>
    `;
}

function renderDetailView() {
    const allItems = MEDIA_DATA[currentCategory.id].map(item => {
        let displayThumb = item.thumb;
        if (!displayThumb && currentCategory.id === 'games') {
            displayThumb = getSteamThumb(item.url);
        }
        return {
            ...item,
            displayThumb: displayThumb || placeholderX
        };
    });

    // Filtering logic
    const filteredItems = currentFilter === 'all'
        ? allItems
        : (currentFilter === 'favorite'
            ? allItems.filter(item => item.favorite)
            : (currentFilter === 'singleplayer'
                ? allItems.filter(item => item.isSingleplayer)
                : (currentFilter === 'multiplayer'
                    ? allItems.filter(item => item.isMultiplayer)
                    : (currentFilter === 'mobile'
                        ? allItems.filter(item => item.isMobile)
                        : (currentFilter === 'endless'
                            ? allItems.filter(item => item.isEndless)
                            : allItems.filter(item => item.status === currentFilter))))));

    // Counts for filters (simplified for dynamic keys)
    const filterKeys = getFilterKeys(currentCategory.id);
    const counts = {};
    filterKeys.forEach(key => {
        if (key === 'all') {
            counts[key] = allItems.length;
        } else if (key === 'favorite') {
            counts[key] = allItems.filter(i => i.favorite).length;
        } else if (key === 'singleplayer') {
            counts[key] = allItems.filter(i => i.isSingleplayer).length;
        } else if (key === 'multiplayer') {
            counts[key] = allItems.filter(i => i.isMultiplayer).length;
        } else if (key === 'mobile') {
            counts[key] = allItems.filter(i => i.isMobile).length;
        } else if (key === 'endless') {
            counts[key] = allItems.filter(i => i.isEndless).length;
        } else {
            counts[key] = allItems.filter(i => i.status === key).length;
        }
    });

    const columnsCount = getColumnCount();
    const columns = Array.from({ length: columnsCount }, () => []);

    filteredItems.forEach((item, index) => {
        columns[index % columnsCount].push(item);
    });

    appContainer.innerHTML = `
        <section class="detail-view" style="--accent-color: ${currentCategory.color}">
            <div class="sticky-nav">
                <header class="view-header">
                    <div class="header-controls">
                        <button class="back-btn" id="back-btn">← ${currentLanguage === 'en' ? 'Back' : 'Voltar'}</button>
                        <button class="lang-toggle-btn" id="lang-toggle">
                            ${currentLanguage === 'en' ? 'Language: 🇺🇸 EN' : 'Idioma: 🇧🇷 PT'}
                        </button>
                        <button class="filter-btn ${currentFilter === 'favorite' ? 'active' : ''}" id="favorite-toggle" data-filter="favorite">
                            ⭐ ${currentLanguage === 'en' ? 'Favorites' : 'Favoritos'}
                            <span class="filter-count" style="margin-left: 5px;">${counts['favorite']}</span>
                        </button>
                    </div>
                    <h1 class="category-title">
                        ${currentCategory.name}
                    </h1>
                </header>

                <div class="filter-bar">
                    ${filterKeys.filter(k => k !== 'favorite').map(key => `
                        <button class="filter-btn ${currentFilter === key ? 'active' : ''}" data-filter="${key}">
                            ${key === 'all' ? '🌐' : getStatusIcon(key)} ${getStatusLabel(key)}
                            <span class="filter-count">${counts[key]}</span>
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="media-list ${!showColoredBorders ? 'borders-off' : ''} ${isStaggeredMode ? 'staggered' : ''}" data-category="${currentCategory.id}">
                ${filteredItems.length === 0 ? `
                    <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #64748b;">
                        <p style="font-size: 1.2rem;">No items found in this section.</p>
                    </div>
                ` : columns.map((col, i) => `
                    <div class="masonry-column" data-col="${i + 1}">
                        ${col.map(item => renderMediaCard(item)).join('')}
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    // Event Listeners
    document.getElementById('lang-toggle').addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'pt' : 'en';
        render();
    });

    document.getElementById('back-btn').addEventListener('click', () => {
        currentCategory = null;
        render();
        window.scrollTo(0, 0);
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newFilter = btn.getAttribute('data-filter');
            currentFilter = (currentFilter === newFilter) ? 'all' : newFilter;
            render();
        });
    });
}

// Add resize listener to handle column redistribution
window.addEventListener('resize', () => {
    if (currentCategory) {
        render();
    }
});

init();
