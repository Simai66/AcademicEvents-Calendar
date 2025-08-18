/**
 * Academic Events Calendar - Filter Functionality
 * Event filtering, search, category management
 */

// Filter state
const FilterState = {
    activeFilters: {
        academic: true,
        student: true,
        holiday: true,
        training: true,
        sports: true
    },
    searchQuery: '',
    dateRange: {
        start: null,
        end: null
    },
    sortBy: 'date', // 'date', 'title', 'category'
    sortOrder: 'asc' // 'asc', 'desc'
};

// Category information
const CATEGORIES = {
    academic: {
        name: 'การศึกษา',
        icon: 'fas fa-graduation-cap',
        color: '#3b82f6',
        description: 'กิจกรรมทางการศึกษา เช่น การสอบ การลงทะเบียน'
    },
    student: {
        name: 'กิจกรรมนักศึกษา',
        icon: 'fas fa-users',
        color: '#3b82f6',
        description: 'กิจกรรมสำหรับนักศึกษา เช่น งานเลี้ยง ทริป'
    },
    holiday: {
        name: 'วันหยุด',
        icon: 'fas fa-calendar-check',
        color: '#ef4444',
        description: 'วันหยุดราชการ วันหยุดพิเศษ'
    },
    training: {
        name: 'ฝึกอบรม',
        icon: 'fas fa-chalkboard-teacher',
        color: '#3b82f6',
        description: 'การฝึกอบรม สัมมนา ประชุม'
    },
    sports: {
        name: 'กีฬา/วัฒนธรรม',
        icon: 'fas fa-trophy',
        color: '#f59e0b',
        description: 'กิจกรรมกีฬา ศิลปวัฒนธรรม'
    }
};

/**
 * Initialize filter functionality
 */
function initializeFilter() {
    setupFilterEventListeners();
    loadSavedFilters();
    renderCategoryList();
    renderFilterControls();
    
    console.log('Filter system initialized');
}

/**
 * Setup filter event listeners
 */
function setupFilterEventListeners() {
    // Category filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox, input[type="checkbox"][id^="filter-"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCategoryFilter);
    });
    
    // Search input
    const searchInput = document.querySelector('#search-input, .search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keypress', handleSearchKeypress);
    }
    
    // Clear search button
    const clearSearchBtn = document.querySelector('.clear-search');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearch);
    }
    
    // Sort controls
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
    
    // Date range filters
    const startDateInput = document.querySelector('#start-date');
    const endDateInput = document.querySelector('#end-date');
    
    if (startDateInput) {
        startDateInput.addEventListener('change', handleDateRangeChange);
    }
    
    if (endDateInput) {
        endDateInput.addEventListener('change', handleDateRangeChange);
    }
    
    // Reset filters button
    const resetBtn = document.querySelector('.reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
    }
    
    // Quick filter buttons
    const quickFilterBtns = document.querySelectorAll('.quick-filter');
    quickFilterBtns.forEach(btn => {
        btn.addEventListener('click', handleQuickFilter);
    });
}

/**
 * Handle category filter changes
 */
function handleCategoryFilter(event) {
    const filterId = event.target.id.replace('filter-', '');
    const isChecked = event.target.checked;
    
    FilterState.activeFilters[filterId] = isChecked;
    
    applyFilters();
    saveFiltersToStorage();
    updateFilterUI();
    
    // Analytics
    trackFilterUsage(filterId, isChecked);
}

/**
 * Handle search input
 */
function handleSearch(event) {
    FilterState.searchQuery = event.target.value.toLowerCase().trim();
    applyFilters();
    updateSearchUI();
}

/**
 * Handle search keypress (Enter to search)
 */
function handleSearchKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch(event);
    }
}

/**
 * Clear search
 */
function clearSearch() {
    const searchInput = document.querySelector('#search-input, .search-input');
    if (searchInput) {
        searchInput.value = '';
        FilterState.searchQuery = '';
        applyFilters();
        updateSearchUI();
    }
}

/**
 * Handle sort change
 */
function handleSortChange(event) {
    const [sortBy, sortOrder] = event.target.value.split('-');
    FilterState.sortBy = sortBy;
    FilterState.sortOrder = sortOrder;
    
    applyFilters();
    saveFiltersToStorage();
}

/**
 * Handle date range change
 */
function handleDateRangeChange() {
    const startDate = document.querySelector('#start-date')?.value;
    const endDate = document.querySelector('#end-date')?.value;
    
    FilterState.dateRange.start = startDate ? new Date(startDate) : null;
    FilterState.dateRange.end = endDate ? new Date(endDate) : null;
    
    applyFilters();
    saveFiltersToStorage();
}

/**
 * Handle quick filter buttons
 */
function handleQuickFilter(event) {
    const filterType = event.target.dataset.filter;
    
    switch (filterType) {
        case 'this-month':
            filterThisMonth();
            break;
        case 'next-month':
            filterNextMonth();
            break;
        case 'this-semester':
            filterThisSemester();
            break;
        case 'holidays-only':
            filterHolidaysOnly();
            break;
        default:
            console.warn('Unknown quick filter:', filterType);
    }
}

/**
 * Apply all active filters
 */
function applyFilters() {
    const events = getAllEvents();
    const filteredEvents = filterEvents(events);
    const sortedEvents = sortEvents(filteredEvents);
    
    displayFilteredEvents(sortedEvents);
    updateResultsCount(sortedEvents.length);
    
    // Trigger event for other modules
    const filterEvent = new CustomEvent('filtersApplied', {
        detail: {
            filteredEvents: sortedEvents,
            filterState: { ...FilterState }
        }
    });
    document.dispatchEvent(filterEvent);
}

/**
 * Filter events based on current filter state
 */
function filterEvents(events) {
    return events.filter(event => {
        // Category filter
        if (!FilterState.activeFilters[event.category]) {
            return false;
        }
        
        // Search filter
        if (FilterState.searchQuery) {
            const searchFields = [
                event.title,
                event.description,
                CATEGORIES[event.category]?.name
            ].join(' ').toLowerCase();
            
            if (!searchFields.includes(FilterState.searchQuery)) {
                return false;
            }
        }
        
        // Date range filter
        if (FilterState.dateRange.start || FilterState.dateRange.end) {
            const eventDate = new Date(event.date);
            
            if (FilterState.dateRange.start && eventDate < FilterState.dateRange.start) {
                return false;
            }
            
            if (FilterState.dateRange.end && eventDate > FilterState.dateRange.end) {
                return false;
            }
        }
        
        return true;
    });
}

/**
 * Sort events based on current sort settings
 */
function sortEvents(events) {
    return [...events].sort((a, b) => {
        let comparison = 0;
        
        switch (FilterState.sortBy) {
            case 'date':
                comparison = new Date(a.date) - new Date(b.date);
                break;
            case 'title':
                comparison = a.title.localeCompare(b.title, 'th');
                break;
            case 'category':
                const categoryA = CATEGORIES[a.category]?.name || a.category;
                const categoryB = CATEGORIES[b.category]?.name || b.category;
                comparison = categoryA.localeCompare(categoryB, 'th');
                break;
        }
        
        return FilterState.sortOrder === 'desc' ? -comparison : comparison;
    });
}

/**
 * Get all events from various sources
 */
function getAllEvents() {
    // Try to get events from main app state
    const appEvents = window.AcademicCalendar?.AppState?.events || [];
    
    // Also get events from DOM if needed
    const domEvents = extractEventsFromDOM();
    
    // Combine and deduplicate
    const allEvents = [...appEvents, ...domEvents];
    const uniqueEvents = allEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
    );
    
    return uniqueEvents;
}

/**
 * Extract events from DOM elements (fallback)
 */
function extractEventsFromDOM() {
    const events = [];
    const eventElements = document.querySelectorAll('.event-card, .event-item');
    
    eventElements.forEach((element, index) => {
        const title = element.querySelector('.event-title, .event-details')?.textContent?.trim();
        const date = element.querySelector('.event-date')?.textContent?.trim();
        const categoryElement = element.querySelector('.event-category');
        
        if (title && date) {
            // Extract category from class names
            let category = 'academic';
            for (const className of element.classList) {
                if (className.startsWith('cat-')) {
                    category = className.replace('cat-', '');
                    break;
                }
            }
            
            events.push({
                id: `dom-${index}`,
                title: title,
                date: parseDateFromThai(date),
                category: category,
                description: title
            });
        }
    });
    
    return events;
}

/**
 * Parse Thai date format to ISO date
 */
function parseDateFromThai(dateText) {
    // This is a simplified parser - you might need to enhance it
    const dateMatch = dateText.match(/(\d+)\s*(\w+)\s*(\d+)/);
    if (dateMatch) {
        const [, day, monthName, year] = dateMatch;
        const monthIndex = THAI_MONTHS.indexOf(monthName);
        if (monthIndex !== -1) {
            return `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }
    
    return new Date().toISOString().split('T')[0]; // fallback to today
}

/**
 * Display filtered events
 */
function displayFilteredEvents(events) {
    const eventContainers = document.querySelectorAll('.event-cards, .events-list, .event-grid');
    
    eventContainers.forEach(container => {
        // Hide all events first
        const allEventElements = container.querySelectorAll('.event-card, .event-item, .event');
        allEventElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // Show filtered events
        events.forEach(event => {
            const eventElement = findEventElement(event, container);
            if (eventElement) {
                eventElement.style.display = 'block';
            }
        });
    });
}

/**
 * Find event element in container
 */
function findEventElement(event, container) {
    // Try to find by title or content
    const elements = container.querySelectorAll('.event-card, .event-item, .event');
    
    for (const element of elements) {
        const elementTitle = element.querySelector('.event-title, .event-details')?.textContent?.trim();
        if (elementTitle && elementTitle.includes(event.title)) {
            return element;
        }
    }
    
    return null;
}

/**
 * Update results count display
 */
function updateResultsCount(count) {
    const countElements = document.querySelectorAll('.results-count, .event-count');
    countElements.forEach(element => {
        element.textContent = `${count} กิจกรรม`;
    });
}

/**
 * Render category list
 */
function renderCategoryList() {
    const categoryList = document.querySelector('.category-list');
    if (!categoryList) return;
    
    categoryList.innerHTML = '';
    
    Object.entries(CATEGORIES).forEach(([key, category]) => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <label class="category-label">
                <input type="checkbox" class="filter-checkbox" id="filter-${key}" ${FilterState.activeFilters[key] ? 'checked' : ''}>
                <span class="category-icon"><i class="${category.icon}"></i></span>
                <span class="category-name">${category.name}</span>
                <span class="category-count">0</span>
            </label>
        `;
        
        categoryList.appendChild(categoryItem);
    });
    
    updateCategoryCounts();
}

/**
 * Update category counts
 */
function updateCategoryCounts() {
    const events = getAllEvents();
    const counts = {};
    
    // Count events by category
    events.forEach(event => {
        counts[event.category] = (counts[event.category] || 0) + 1;
    });
    
    // Update display
    Object.keys(CATEGORIES).forEach(categoryKey => {
        const countElement = document.querySelector(`#filter-${categoryKey}`)?.closest('.category-item')?.querySelector('.category-count');
        if (countElement) {
            countElement.textContent = counts[categoryKey] || 0;
        }
    });
}

/**
 * Render filter controls
 */
function renderFilterControls() {
    const filterControls = document.querySelector('.filter-controls');
    if (!filterControls) return;
    
    // Add search box if it doesn't exist
    if (!filterControls.querySelector('.search-input')) {
        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        searchBox.innerHTML = `
            <input type="text" class="search-input" placeholder="ค้นหากิจกรรม..." value="${FilterState.searchQuery}">
            <button class="clear-search" title="ล้างการค้นหา"><i class="fas fa-times"></i></button>
        `;
        filterControls.appendChild(searchBox);
    }
    
    // Add sort controls if they don't exist
    if (!filterControls.querySelector('.sort-select')) {
        const sortControls = document.createElement('div');
        sortControls.className = 'sort-controls';
        sortControls.innerHTML = `
            <label for="sort-select">เรียงตาม:</label>
            <select class="sort-select" id="sort-select">
                <option value="date-asc">วันที่ (เก่า → ใหม่)</option>
                <option value="date-desc">วันที่ (ใหม่ → เก่า)</option>
                <option value="title-asc">ชื่อ (ก → ฮ)</option>
                <option value="title-desc">ชื่อ (ฮ → ก)</option>
                <option value="category-asc">หมวดหมู่ (ก → ฮ)</option>
                <option value="category-desc">หมวดหมู่ (ฮ → ก)</option>
            </select>
        `;
        filterControls.appendChild(sortControls);
    }
}

/**
 * Quick filter functions
 */
function filterThisMonth() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    FilterState.dateRange.start = startOfMonth;
    FilterState.dateRange.end = endOfMonth;
    
    updateDateInputs();
    applyFilters();
}

function filterNextMonth() {
    const now = new Date();
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    
    FilterState.dateRange.start = startOfNextMonth;
    FilterState.dateRange.end = endOfNextMonth;
    
    updateDateInputs();
    applyFilters();
}

function filterThisSemester() {
    // Assuming semester is roughly 6 months
    const now = new Date();
    const startOfSemester = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfSemester = new Date(now.getFullYear(), now.getMonth() + 6, 0);
    
    FilterState.dateRange.start = startOfSemester;
    FilterState.dateRange.end = endOfSemester;
    
    updateDateInputs();
    applyFilters();
}

function filterHolidaysOnly() {
    // Reset all filters first
    Object.keys(FilterState.activeFilters).forEach(key => {
        FilterState.activeFilters[key] = false;
    });
    
    // Enable only holidays
    FilterState.activeFilters.holiday = true;
    
    updateFilterCheckboxes();
    applyFilters();
}

/**
 * Reset all filters
 */
function resetAllFilters() {
    // Reset active filters
    Object.keys(FilterState.activeFilters).forEach(key => {
        FilterState.activeFilters[key] = true;
    });
    
    // Reset other filters
    FilterState.searchQuery = '';
    FilterState.dateRange.start = null;
    FilterState.dateRange.end = null;
    FilterState.sortBy = 'date';
    FilterState.sortOrder = 'asc';
    
    // Update UI
    updateFilterUI();
    clearSearch();
    applyFilters();
    
    // Save to storage
    saveFiltersToStorage();
}

/**
 * Update filter UI elements
 */
function updateFilterUI() {
    updateFilterCheckboxes();
    updateSearchUI();
    updateDateInputs();
    updateSortSelect();
}

function updateFilterCheckboxes() {
    Object.entries(FilterState.activeFilters).forEach(([key, isActive]) => {
        const checkbox = document.querySelector(`#filter-${key}`);
        if (checkbox) {
            checkbox.checked = isActive;
        }
    });
}

function updateSearchUI() {
    const searchInput = document.querySelector('#search-input, .search-input');
    if (searchInput) {
        searchInput.value = FilterState.searchQuery;
    }
    
    const clearBtn = document.querySelector('.clear-search');
    if (clearBtn) {
        clearBtn.style.display = FilterState.searchQuery ? 'block' : 'none';
    }
}

function updateDateInputs() {
    const startDateInput = document.querySelector('#start-date');
    const endDateInput = document.querySelector('#end-date');
    
    if (startDateInput && FilterState.dateRange.start) {
        startDateInput.value = FilterState.dateRange.start.toISOString().split('T')[0];
    }
    
    if (endDateInput && FilterState.dateRange.end) {
        endDateInput.value = FilterState.dateRange.end.toISOString().split('T')[0];
    }
}

function updateSortSelect() {
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.value = `${FilterState.sortBy}-${FilterState.sortOrder}`;
    }
}

/**
 * Save filters to localStorage
 */
function saveFiltersToStorage() {
    const filterData = {
        activeFilters: FilterState.activeFilters,
        searchQuery: FilterState.searchQuery,
        sortBy: FilterState.sortBy,
        sortOrder: FilterState.sortOrder
    };
    
    localStorage.setItem('academicCalendarFilters', JSON.stringify(filterData));
}

/**
 * Load filters from localStorage
 */
function loadSavedFilters() {
    const saved = localStorage.getItem('academicCalendarFilters');
    if (saved) {
        try {
            const filterData = JSON.parse(saved);
            
            FilterState.activeFilters = { ...FilterState.activeFilters, ...filterData.activeFilters };
            FilterState.searchQuery = filterData.searchQuery || '';
            FilterState.sortBy = filterData.sortBy || 'date';
            FilterState.sortOrder = filterData.sortOrder || 'asc';
            
            updateFilterUI();
        } catch (error) {
            console.error('Error loading saved filters:', error);
        }
    }
}

/**
 * Track filter usage for analytics
 */
function trackFilterUsage(filterId, isActive) {
    console.log(`Filter ${filterId} ${isActive ? 'enabled' : 'disabled'}`);
    // Implement analytics tracking here if needed
}

/**
 * Debounce function for search
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFilter);

// Export filter functions
window.FilterModule = {
    initializeFilter,
    applyFilters,
    resetAllFilters,
    FilterState,
    CATEGORIES
};