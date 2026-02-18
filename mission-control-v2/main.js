// Mission Control v2 - Main Application
class MissionControl {
    constructor() {
        this.currentView = 'overview';
        this.currentGoal = null;
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.renderFileBrowser();
        this.attachEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
    }
    
    loadTheme() {
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
    }
    
    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }
    
    updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleString('en-IN', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
        const els = document.querySelectorAll('.update-time');
        els.forEach(el => el.textContent = timeStr);
    }
    
    // Navigation
    switchView(view, goalId = null) {
        this.currentView = view;
        this.currentGoal = goalId;
        
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if(tab.dataset.view === view) tab.classList.add('active');
        });
        
        // Hide all views
        document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
        
        // Show target view
        const target = document.getElementById(`view-${view}`);
        if(target) {
            target.classList.remove('hidden');
            if(goalId) this.renderGoalDetail(goalId);
        }
        
        window.scrollTo(0, 0);
    }
    
    selectGoal(goalId) {
        // Update goal list styling
        document.querySelectorAll('.goal-item').forEach(item => {
            item.classList.remove('active');
            if(item.dataset.goal === goalId) item.classList.add('active');
        });
        
        this.switchView('goal', goalId);
    }
    
    renderGoalDetail(goalId) {
        const goals = {
            filmmaker: {
                title: 'Filmmaker Career',
                icon: '🎬',
                color: '#af52de',
                progress: 35,
                description: 'Secure funding for documentary, animation, or film projects. Canadian filmmaker based in UK/Europe.',
                pathways: [
                    {name: 'Grant Applications', tasks: 5, completed: 2, items: [
                        'Telefilm Canada research',
                        'BFI funding research',
                        'Creative Europe MEDIA',
                        'Hot Docs Forum prep',
                        'Sundance Documentary Fund'
                    ]},
                    {name: 'Pitch Decks', tasks: 3, completed: 1, items: [
                        'Documentary pitch template',
                        'Animation series deck',
                        'Feature film one-pager'
                    ]},
                    {name: 'Network Building', tasks: 8, completed: 3, items: [
                        'Portfolio website',
                        'LinkedIn optimization',
                        'Production database listings',
                        'UK film circles',
                        'European co-producers',
                        'Film festival circuit'
                    ]}
                ],
                opportunities: [
                    {name: 'Telefilm Canada', amount: '$250K-2M CAD', deadline: 'Rolling'},
                    {name: 'BFI Network', amount: '£15K-100K', deadline: 'Rolling'},
                    {name: 'Creative Europe', amount: '€50K-1M', deadline: 'Annual'},
                    {name: 'Hot Docs Forum', amount: 'Pitch meetings', deadline: 'Dec 2026'}
                ]
            },
            whitelabl: {
                title: 'Whitelabl.in',
                icon: '🏭',
                color: '#0071e3',
                progress: 15,
                description: 'Scale white-label cosmetics manufacturing in India through organic SEO and partnerships.',
                pathways: [
                    {name: 'SEO Content', tasks: 20, completed: 0, items: [
                        'CDSCO License Guide blog',
                        'Pricing strategy post',
                        'Mumbai landing page',
                        'Delhi landing page',
                        'Trending ingredients post'
                    ]},
                    {name: 'Partnerships', tasks: 5, completed: 0, items: [
                        'D2C course creators',
                        'CA/CS firms',
                        'Packaging suppliers',
                        'Influencer outreach'
                    ]},
                    {name: 'Email Funnel', tasks: 4, completed: 0, items: [
                        '12 Licenses Checklist PDF',
                        'MOQ Calculator',
                        'Welcome sequence (5 emails)',
                        'Lead capture setup'
                    ]}
                ],
                urgent: [
                    'Fix lorem ipsum testimonials',
                    'Add ISO/GMP trust badges',
                    'Write origin story'
                ]
            },
            wildonmedia: {
                title: 'WildOnMedia',
                icon: '🚚',
                color: '#ff9500',
                progress: 25,
                description: 'Expand OOH advertising with digital ad trucks and experiential marketing.',
                pathways: [
                    {name: 'Client Acquisition', tasks: 6, completed: 1, items: [
                        'Case study: digital truck campaign',
                        'LinkedIn content calendar',
                        'Event agency partnerships',
                        'Ad directories listing'
                    ]},
                    {name: 'Media Assets', tasks: 3, completed: 1, items: [
                        'Professional media kit PDF',
                        'Client logo showcase',
                        'Truck spec sheets'
                    ]},
                    {name: 'Case Studies', tasks: 4, completed: 0, items: [
                        'Festival activation',
                        'Product launch',
                        'Political campaign',
                        'Retail promotion'
                    ]}
                ]
            },
            appideas: {
                title: 'App/Web Projects',
                icon: '💡',
                color: '#5ac8fa',
                progress: 5,
                description: 'Build editable websites using no-code platforms (Webflow, Framer, WordPress).',
                pathways: [
                    {name: 'Ideation', tasks: 3, completed: 1, items: [
                        'Document 3 app ideas',
                        'User personas',
                        'Competitive analysis'
                    ]},
                    {name: 'MVP Build', tasks: 5, completed: 0, items: [
                        'Choose platform (Webflow/Framer/WP)',
                        'Wireframes',
                        'Prototype',
                        'User testing',
                        'Launch'
                    ]}
                ]
            }
        };
        
        const goal = goals[goalId];
        if(!goal) return;
        
        const container = document.getElementById('goal-detail-content');
        container.innerHTML = `
            <div class="goal-header" style="border-left: 4px solid ${goal.color}; padding-left: 20px; margin-bottom: 30px;">
                <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">${goal.icon} ${goal.title}</h1>
                <p style="color: var(--text-secondary); font-size: 16px;">${goal.description}</p>
                <div style="margin-top: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-weight: 600;">${goal.progress}% Complete</span>
                        <span style="color: var(--text-secondary);">${goal.pathways.reduce((a,p) => a + p.completed, 0)}/${goal.pathways.reduce((a,p) => a + p.tasks, 0)} tasks</span>
                    </div>
                    <div class="progress-bar" style="height: 8px; background: var(--bg-tertiary); border-radius: 4px;">
                        <div class="progress-fill" style="width: ${goal.progress}%; height: 100%; background: ${goal.color}; border-radius: 4px; transition: width 0.5s;"></div>
                    </div>
                </div>
            </div>
            
            ${goal.urgent ? `
            <div class="urgent-section" style="background: rgba(255,59,48,0.08); border: 1px solid rgba(255,59,48,0.2); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: var(--accent-red); margin-bottom: 12px;">⚠️ Urgent Tasks</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    ${goal.urgent.map(u => `<li style="margin-bottom: 8px;">${u}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            <div class="pathways-grid" style="display: grid; gap: 20px;">
                ${goal.pathways.map(p => `
                    <div class="pathway-card" style="background: var(--bg-secondary); border-radius: 16px; padding: 24px; border: 1px solid var(--border);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <h3 style="font-size: 18px; font-weight: 600;">${p.name}</h3>
                            <span style="font-size: 14px; color: var(--text-secondary);">${p.completed}/${p.tasks}</span>
                        </div>
                        <div class="progress-bar" style="height: 4px; background: var(--bg-tertiary); border-radius: 2px; margin-bottom: 16px;">
                            <div class="progress-fill" style="width: ${(p.completed/p.tasks)*100}%; height: 100%; background: ${goal.color}; border-radius: 2px;"></div>
                        </div>
                        <ul style="margin: 0; padding: 0; list-style: none;">
                            ${p.items.map(item => `
                                <li style="padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px;">
                                    <span style="width: 18px; height: 18px; border: 2px solid var(--text-tertiary); border-radius: 4px; display: inline-block;"></span>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
            
            ${goal.opportunities ? `
            <div class="opportunities-section" style="margin-top: 30px;">
                <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">💰 Funding Opportunities</h3>
                <div style="display: grid; gap: 12px;">
                    ${goal.opportunities.map(o => `
                        <div style="background: var(--bg-tertiary); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: 600;">${o.name}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">Deadline: ${o.deadline}</div>
                            </div>
                            <div style="font-weight: 600; color: ${goal.color};">${o.amount}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        `;
    }
    
    renderFileBrowser() {
        // Files data (would be dynamic in real app)
        const files = [
            {name: 'Whitelabl_Growth_Strategy.pdf', type: 'pdf', size: '156 KB', date: 'Feb 13', icon: '📄'},
            {name: 'monk_cloud.gif', type: 'gif', size: '45 KB', date: 'Feb 13', icon: '🎬'},
            {name: 'loading_forever.gif', type: 'gif', size: '32 KB', date: 'Feb 13', icon: '🔄'},
            {name: 'Mission_Control_v1.html', type: 'html', size: '23 KB', date: 'Feb 13', icon: '🌐'},
        ];
        
        const container = document.getElementById('file-list');
        if(!container) return;
        
        container.innerHTML = files.map(f => `
            <div class="file-item" style="display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--bg-tertiary); border-radius: 10px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='var(--bg-primary)'" onmouseout="this.style.background='var(--bg-tertiary)'">
                <div style="width: 40px; height: 40px; background: var(--bg-secondary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">${f.icon}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 500; margin-bottom: 2px;">${f.name}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${f.size} • ${f.date}</div>
                </div>
                <button style="padding: 6px 12px; border: none; background: var(--bg-secondary); border-radius: 6px; cursor: pointer; font-size: 13px;">Open</button>
            </div>
        `).join('');
    }
    
    attachEventListeners() {
        // Nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });
        
        // Goal items
        document.querySelectorAll('.goal-item').forEach(item => {
            item.addEventListener('click', () => {
                const goalId = item.dataset.goal;
                this.selectGoal(goalId);
            });
        });
        
        // Task checkboxes
        document.querySelectorAll('.task-checkbox').forEach(cb => {
            cb.addEventListener('click', (e) => {
                e.stopPropagation();
                cb.classList.toggle('checked');
                cb.closest('.task-item').classList.toggle('completed');
                
                // Save state
                const taskTitle = cb.closest('.task-item').querySelector('.task-title').textContent;
                localStorage.setItem('task_' + taskTitle, cb.classList.contains('checked'));
            });
        });
    }
}

// Initialize
const app = new MissionControl();

// Global functions for inline handlers
window.app = app;
window.toggleTheme = () => app.toggleTheme();
window.switchView = (view) => app.switchView(view);
window.selectGoal = (goalId) => app.selectGoal(goalId);
