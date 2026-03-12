document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSearch();
    initCopyButtons();
    initRecentTools();
    registerCurrentTool();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err));
        });
    }
});

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const currentTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateToggleIcon(newTheme);
        });
    }
}

function updateToggleIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'ph-sun-bold' : 'ph-moon-bold';
    }
}

// Search Functionality
function initSearch() {
    const searchBar = document.getElementById('tool-search');
    const toolCards = document.querySelectorAll('.tool-card');
    
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            toolCards.forEach(card => {
                const titleEl = card.querySelector('h3');
                const descEl = card.querySelector('p');
                
                const title = titleEl ? titleEl.textContent.toLowerCase() : '';
                const desc = descEl ? descEl.textContent.toLowerCase() : '';
                
                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = 'flex';
                    card.style.animation = 'none';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Card Entry Animation
function animateCards() {
    const cards = document.querySelectorAll('.tool-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        // observer.observe(card); // Cards already have CSS animation on load
    });
}

// Recent Tools Functionality
function registerCurrentTool() {
    const title = document.querySelector('.tool-header h2')?.textContent;
    if (!title) return;

    let recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
    const currentTool = {
        name: title,
        path: window.location.pathname,
    };

    // Filter out existing and keep only top 4
    recent = recent.filter(t => t.name !== title);
    recent.unshift(currentTool);
    localStorage.setItem('recentTools', JSON.stringify(recent.slice(0, 4)));
}

function initRecentTools() {
    const container = document.getElementById('recent-tools-list');
    if (!container) return;

    const recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
    if (recent.length === 0) {
        const recentSection = document.getElementById('recent-section');
        if (recentSection) recentSection.style.display = 'none';
        return;
    }

    container.innerHTML = recent.map(tool => `
        <a href="${tool.path}" class="tool-card recent-mini">
            <div class="card-content">
                <h3>${tool.name}</h3>
                <p>Quick access</p>
            </div>
        </a>
    `).join('');
}

// Common Utilities
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="ph-check-bold"></i> Copied';
        button.classList.add('btn-success');
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('btn-success');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function downloadFile(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-copy');
            const target = document.getElementById(targetId);
            if (target) {
                copyToClipboard(target.value || target.textContent, button);
            }
        });
    });
}
