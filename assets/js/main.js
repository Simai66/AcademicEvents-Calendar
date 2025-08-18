/**
 * Academic Events Calendar - Main JavaScript File
 * Main functionality and initialization
 */

// Application state
const AppState = {
    currentView: 'home',
    currentYear: 2568,
    currentMonth: 1,
    events: [],
    filters: {
        academic: true,
        student: true,
        holiday: true,
        training: true,
        sports: true
    }
};

// DOM elements cache
const Elements = {
    sidebar: null,
    mobileNav: null,
    navItems: null,
    filterCheckboxes: null,
    viewRadios: null
};

/**
 * Initialize the application
 */
function initializeApp() {
    cacheElements();
    loadEvents();
    setupEventListeners();
    updateActiveNavigation();
    
    console.log('Academic Events Calendar initialized');
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
    Elements.sidebar = document.querySelector('.sidebar');
    Elements.mobileNav = document.querySelector('.mobile-nav');
    Elements.navItems = document.querySelectorAll('.nav-item');
    Elements.filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    Elements.viewRadios = document.querySelectorAll('input[name="view"]');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Navigation click handlers
    Elements.navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Filter change handlers
    Elements.filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // View change handlers
    Elements.viewRadios.forEach(radio => {
        radio.addEventListener('change', handleViewChange);
    });

    // Mobile navigation toggle
    if (Elements.mobileNav) {
        const toggle = Elements.mobileNav.querySelector('summary');
        if (toggle) {
            toggle.addEventListener('click', handleMobileNavToggle);
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

/**
 * Handle navigation between pages
 */
function handleNavigation(event) {
    const href = event.currentTarget.getAttribute('href');
    
    // For external links, allow default behavior
    if (href && href.startsWith('http')) {
        return;
    }
    
    // Update active state
    updateActiveNavigation(event.currentTarget);
    
    // Analytics (if needed)
    trackPageView(href);
}

/**
 * Handle filter changes
 */
function handleFilterChange(event) {
    const filterId = event.target.id.replace('filter-', '');
    AppState.filters[filterId] = event.target.checked;
    
    // Apply filters
    applyFilters();
    
    // Save to localStorage
    saveFiltersToStorage();
}

/**
 * Handle view changes (for SPA-like behavior if needed)
 */
function handleViewChange(event) {
    AppState.currentView = event.target.value;
    updateBodyClass();
    
    console.log(`View changed to: ${AppState.currentView}`);
}

/**
 * Handle mobile navigation toggle
 */
function handleMobileNavToggle(event) {
    const nav = event.currentTarget.closest('.mobile-nav');
    nav.classList.toggle('open');
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(event) {
    // ESC key to close mobile navigation
    if (event.key === 'Escape' && Elements.mobileNav) {
        Elements.mobileNav.removeAttribute('open');
    }
    
    // Arrow keys for calendar navigation (if on calendar view)
    if (AppState.currentView === 'home') {
        switch (event.key) {
            case 'ArrowLeft':
                navigateMonth(-1);
                break;
            case 'ArrowRight':
                navigateMonth(1);
                break;
        }
    }
}

/**
 * Navigate between months
 */
function navigateMonth(direction) {
    AppState.currentMonth += direction;
    
    if (AppState.currentMonth > 12) {
        AppState.currentMonth = 1;
        AppState.currentYear++;
    } else if (AppState.currentMonth < 1) {
        AppState.currentMonth = 12;
        AppState.currentYear--;
    }
    
    updateCalendarDisplay();
}

/**
 * Update active navigation state
 */
function updateActiveNavigation(activeItem = null) {
    Elements.navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    if (activeItem) {
        activeItem.classList.add('active');
    } else {
        // Set active based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        Elements.navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && href.includes(currentPage)) {
                item.classList.add('active');
            }
        });
    }
}

/**
 * Apply filters to events
 */
function applyFilters() {
    const eventElements = document.querySelectorAll('.event');
    
    eventElements.forEach(event => {
        let shouldShow = false;
        
        // Check if event matches any active filter
        Object.keys(AppState.filters).forEach(filterKey => {
            if (AppState.filters[filterKey] && event.classList.contains(`cat-${filterKey}`)) {
                shouldShow = true;
            }
        });
        
        // Show/hide event
        event.style.display = shouldShow ? 'block' : 'none';
    });
    
    updateEventCount();
}

/**
 * Update event count display
 */
function updateEventCount() {
    const visibleEvents = document.querySelectorAll('.event:not([style*="display: none"])');
    const countElements = document.querySelectorAll('.event-count');
    
    countElements.forEach(element => {
        element.textContent = `${visibleEvents.length} กิจกรรม`;
    });
}

/**
 * Load events from JSON file
 */
async function loadEvents() {
    try {
        const response = await fetch('assets/data/events.json');
        if (response.ok) {
            AppState.events = await response.json();
            console.log('Events loaded successfully');
        } else {
            console.warn('Events file not found, using default events');
            AppState.events = getDefaultEvents();
        }
    } catch (error) {
        console.error('Error loading events:', error);
        AppState.events = getDefaultEvents();
    }
}

/**
 * Get default events if JSON file is not available
 */
function getDefaultEvents() {
    return [
        {
            id: 1,
            title: 'วันปิดภาคเรียน',
            date: '2568-01-15',
            category: 'academic',
            description: 'วันปิดภาคเรียนที่ 1/2568'
        },
        {
            id: 2,
            title: 'วันกีฬามหาวิทยาลัย',
            date: '2568-02-20',
            category: 'sports',
            description: 'การแข่งขันกีฬาประจำปี'
        }
    ];
}

/**
 * Update calendar display
 */
function updateCalendarDisplay() {
    // This will be implemented in calendar.js
    if (typeof updateCalendar === 'function') {
        updateCalendar(AppState.currentYear, AppState.currentMonth);
    }
}

/**
 * Update body class for styling
 */
function updateBodyClass() {
    document.body.className = `view-${AppState.currentView}`;
}

/**
 * Save filters to localStorage
 */
function saveFiltersToStorage() {
    localStorage.setItem('academicCalendarFilters', JSON.stringify(AppState.filters));
}

/**
 * Load filters from localStorage
 */
function loadFiltersFromStorage() {
    const saved = localStorage.getItem('academicCalendarFilters');
    if (saved) {
        try {
            AppState.filters = { ...AppState.filters, ...JSON.parse(saved) };
            
            // Update checkbox states
            Elements.filterCheckboxes.forEach(checkbox => {
                const filterId = checkbox.id.replace('filter-', '');
                checkbox.checked = AppState.filters[filterId];
            });
        } catch (error) {
            console.error('Error loading saved filters:', error);
        }
    }
}

/**
 * Track page views (placeholder for analytics)
 */
function trackPageView(page) {
    // Implement analytics tracking if needed
    console.log(`Page view: ${page}`);
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function to throttle function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for use in other modules
window.AcademicCalendar = {
    AppState,
    Elements,
    initializeApp,
    updateActiveNavigation,
    applyFilters,
    loadEvents
};