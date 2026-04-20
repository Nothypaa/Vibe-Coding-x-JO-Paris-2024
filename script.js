/* ============================================================
   PARIS 2024 - JO WEBAPP
   Interactive Script
   ============================================================ */

// === LOADER ===
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1200);
});

// === SCROLL PROGRESS BAR ===
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('scroll-progress').style.width = progress + '%';
});

// === NAVBAR ===
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinksEl = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-links a');
const allSections = document.querySelectorAll('section');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
});

// Close mobile menu on link click
allNavLinks.forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksEl.classList.remove('open');
}));

// Active nav link + scrolled state
window.addEventListener('scroll', () => {
    // Scrolled navbar
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active section
    let current = '';
    allSections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    allNavLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // Back to top button
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 600);
});

// === HERO PARTICLES ===
(function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#0085C7', '#F4C300', '#009F3D', '#DF0024', '#ffffff'];

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.4 + 0.1,
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });
        ctx.globalAlpha = 1;

        // Draw connecting lines between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(255,255,255,' + (0.03 * (1 - dist / 120)) + ')';
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
})();

// === ANIMATED COUNTERS ===
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    if (!target) return;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        // Format with spaces for large numbers
        el.textContent = current.toLocaleString('fr-FR');

        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString('fr-FR');
    }
    requestAnimationFrame(update);
}

// === SCROLL ANIMATIONS (Intersection Observer) ===
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate counters inside
            entry.target.querySelectorAll('.counter:not(.counted)').forEach(c => {
                c.classList.add('counted');
                animateCounter(c);
            });

            // Animate gauges inside
            entry.target.querySelectorAll('.gauge-fill-bar:not(.animated)').forEach(g => {
                g.classList.add('animated');
            });

            // If the element itself is a counter
            if (entry.target.classList.contains('counter') && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-on-scroll, .counter').forEach(el => {
    scrollObserver.observe(el);
});

// Also observe hero stats counters
document.querySelectorAll('.hero-stat .counter').forEach(el => {
    scrollObserver.observe(el);
});

// === MAP INTERACTIVITY ===
function showMapInfo(pin) {
    const name = pin.getAttribute('data-name');
    const info = pin.getAttribute('data-info');
    const tooltip = document.getElementById('map-tooltip');
    document.getElementById('map-tooltip-name').innerHTML = name;
    document.getElementById('map-tooltip-info').innerHTML = info;
    tooltip.classList.add('visible');
    // Auto-hide after 4s
    clearTimeout(window._mapTimeout);
    window._mapTimeout = setTimeout(() => tooltip.classList.remove('visible'), 4000);
}

// === ECOSYSTEME CARD FLIP ===
function toggleCard(card) {
    card.classList.toggle('flipped');
}

// === PERFORMANCE FILTERS ===
function filterPerf(type, btn) {
    document.querySelectorAll('#results-body tr').forEach(row => {
        row.classList.toggle('hidden', type !== 'all' && row.dataset.type !== type);
    });
    document.querySelectorAll('#performances .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

// === TABLE SORTING ===
let sortDirection = {};
function sortTable(colIndex) {
    const table = document.getElementById('perf-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const dir = sortDirection[colIndex] === 'asc' ? 'desc' : 'asc';
    sortDirection[colIndex] = dir;

    rows.sort((a, b) => {
        const aText = a.cells[colIndex].textContent.trim();
        const bText = b.cells[colIndex].textContent.trim();
        if (dir === 'asc') return aText.localeCompare(bText, 'fr');
        return bText.localeCompare(aText, 'fr');
    });

    rows.forEach(row => tbody.appendChild(row));
}

// === DETAIL MODAL ===
function showDetail(title, time, desc) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-time').textContent = time;
    document.getElementById('modal-desc').textContent = desc;
    document.getElementById('detail-modal').classList.add('open');
}

function closeModal(event) {
    if (event.target === event.currentTarget) {
        document.getElementById('detail-modal').classList.remove('open');
    }
}

// === INNOVATION FILTERS ===
function filterInno(cat, btn) {
    const cards = document.querySelectorAll('#inno-grid .inno-card');
    cards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.classList.toggle('hidden', !match);
    });
    document.querySelectorAll('#innovations .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

// === CHART.JS - ALL CHARTS ===
document.addEventListener('DOMContentLoaded', () => {
    // Shared defaults
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#64748b';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 16;

    // --- ECOSYSTEME: Budget Pie ---
    const budgetCtx = document.getElementById('chart-budget');
    if (budgetCtx) {
        new Chart(budgetCtx, {
            type: 'doughnut',
            data: {
                labels: ['COJO Organisation', 'SOLIDEO Infrastructures', 'Billetterie', 'Sponsors', 'Droits TV (CIO)', 'Autres'],
                datasets: [{
                    data: [2.0, 4.4, 1.4, 1.2, 0.8, 0.4],
                    backgroundColor: ['#0085C7', '#1a1a2e', '#F4C300', '#009F3D', '#DF0024', '#94a3b8'],
                    borderWidth: 3, borderColor: '#ffffff',
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                cutout: '55%',
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } }
                }
            }
        });
    }

    // --- PERFORMANCES: Times Bar ---
    const timesCtx = document.getElementById('chart-times');
    if (timesCtx) {
        new Chart(timesCtx, {
            type: 'bar',
            data: {
                labels: ['400m 4 nages', '200m papillon', '200m brasse', '200m 4 nages', '4x100m mixte'],
                datasets: [{
                    label: 'Temps (secondes)',
                    data: [242.95, 111.21, 125.85, 114.06, 217.32],
                    backgroundColor: [
                        'rgba(0,133,199,0.8)', 'rgba(244,195,0,0.8)',
                        'rgba(0,159,61,0.8)', 'rgba(223,0,36,0.8)', 'rgba(148,163,184,0.6)'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: false, min: 100,
                        grid: { color: 'rgba(0,0,0,0.04)' }
                    },
                    x: { grid: { display: false } }
                },
                onClick: (e, elements) => {
                    if (elements.length) {
                        const i = elements[0].index;
                        const events = ['400m 4 nages', '200m papillon', '200m brasse', '200m 4 nages', '4x100m mixte'];
                        const times = ['4:02.95', '1:51.21', '2:05.85', '1:54.06', '3:37.32'];
                        showDetail(events[i], times[i], 'Cliquez sur les lignes du tableau pour plus de details.');
                    }
                }
            }
        });
    }

    // --- PERFORMANCES: Medals Donut ---
    const medalsCtx = document.getElementById('chart-medals');
    if (medalsCtx) {
        new Chart(medalsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Or', 'Bronze'],
                datasets: [{
                    data: [4, 1],
                    backgroundColor: ['#FFD700', '#CD7F32'],
                    borderWidth: 4, borderColor: '#fff',
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                cutout: '60%',
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // --- PERFORMANCES: Evolution Line ---
    const evoCtx = document.getElementById('chart-evolution');
    if (evoCtx) {
        new Chart(evoCtx, {
            type: 'line',
            data: {
                labels: ['2008 Pekin', '2012 Londres', '2016 Rio', '2020 Tokyo', '2024 Paris'],
                datasets: [
                    {
                        label: 'Record Olympique (s)',
                        data: [243.84, 243.46, 243.14, 243.00, 242.95],
                        borderColor: '#0085C7',
                        backgroundColor: 'rgba(0,133,199,0.08)',
                        fill: true, tension: 0.35,
                        pointRadius: 6, pointHoverRadius: 9,
                        pointBackgroundColor: '#0085C7',
                        borderWidth: 3
                    },
                    {
                        label: 'Record du Monde (s)',
                        data: [243.84, 242.46, 242.46, 242.46, 242.95],
                        borderColor: '#DF0024',
                        borderDash: [6, 4], tension: 0.35,
                        pointRadius: 4, pointHoverRadius: 7,
                        pointBackgroundColor: '#DF0024',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 241.5, max: 244.5,
                        grid: { color: 'rgba(0,0,0,0.04)' }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- PERFORMANCES: Nations Medal Tally ---
    const nationsCtx = document.getElementById('chart-nations');
    if (nationsCtx) {
        new Chart(nationsCtx, {
            type: 'bar',
            data: {
                labels: ['USA', 'Chine', 'Grande-Bretagne', 'France', 'Australie'],
                datasets: [
                    { label: 'Or', data: [40, 40, 14, 16, 18], backgroundColor: '#FFD700', borderRadius: 4 },
                    { label: 'Argent', data: [44, 27, 22, 26, 19], backgroundColor: '#C0C0C0', borderRadius: 4 },
                    { label: 'Bronze', data: [42, 24, 29, 22, 16], backgroundColor: '#CD7F32', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    x: { stacked: true, grid: { display: false } },
                    y: { stacked: true, grid: { color: 'rgba(0,0,0,0.04)' } }
                }
            }
        });
    }

    // --- INNOVATIONS: Radar ---
    const radarCtx = document.getElementById('chart-radar');
    if (radarCtx) {
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Diffusion', 'Securite', 'Sport', 'Ecologie'],
                datasets: [{
                    label: 'Impact moyen (%)',
                    data: [86.5, 86.5, 78.5, 81],
                    backgroundColor: 'rgba(0,133,199,0.15)',
                    borderColor: '#0085C7',
                    pointBackgroundColor: '#0085C7',
                    pointRadius: 5, borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true, max: 100,
                        grid: { color: 'rgba(0,0,0,0.06)' },
                        pointLabels: { font: { size: 13, weight: '600' } }
                    }
                }
            }
        });
    }

    // --- INNOVATIONS: Comparison Bar ---
    const compareCtx = document.getElementById('chart-inno-compare');
    if (compareCtx) {
        new Chart(compareCtx, {
            type: 'bar',
            data: {
                labels: ['Londres 2012', 'Rio 2016', 'Tokyo 2020', 'Paris 2024'],
                datasets: [
                    {
                        label: 'Cameras IA',
                        data: [0, 500, 8000, 15000],
                        backgroundColor: 'rgba(223,0,36,0.7)', borderRadius: 4
                    },
                    {
                        label: 'Capteurs IoT',
                        data: [1000, 5000, 20000, 50000],
                        backgroundColor: 'rgba(0,133,199,0.7)', borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(0,0,0,0.04)' } }
                }
            }
        });
    }
});
