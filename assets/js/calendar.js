/**
 * Academic Events Calendar - Calendar Functionality
 * Calendar grid, date picker, month navigation
 */

// Thai month names
const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// Thai day names
const THAI_DAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

// Calendar state
const CalendarState = {
    currentYear: 2568,
    currentMonth: 1,
    selectedDate: null,
    viewMode: 'month', // 'month', 'year'
    events: []
};

/**
 * Initialize calendar functionality
 */
function initializeCalendar() {
    renderCalendar();
    setupCalendarEventListeners();
    updateMonthYearDisplay();
    
    console.log('Calendar initialized');
}

/**
 * Setup calendar event listeners
 */
function setupCalendarEventListeners() {
    // Month navigation buttons
    const prevBtn = document.querySelector('.prev-month');
    const nextBtn = document.querySelector('.next-month');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateMonth(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateMonth(1));
    }
    
    // Year selector buttons
    const yearButtons = document.querySelectorAll('.year-btn');
    yearButtons.forEach(btn => {
        btn.addEventListener('click', handleYearChange);
    });
    
    // Month selector buttons
    const monthButtons = document.querySelectorAll('.month-btn');
    monthButtons.forEach(btn => {
        btn.addEventListener('click', handleMonthChange);
    });
    
    // Today button
    const todayBtn = document.querySelector('.today-btn');
    if (todayBtn) {
        todayBtn.addEventListener('click', goToToday);
    }
}

/**
 * Navigate to previous/next month
 */
function navigateMonth(direction) {
    CalendarState.currentMonth += direction;
    
    if (CalendarState.currentMonth > 12) {
        CalendarState.currentMonth = 1;
        CalendarState.currentYear++;
    } else if (CalendarState.currentMonth < 1) {
        CalendarState.currentMonth = 12;
        CalendarState.currentYear--;
    }
    
    updateCalendar();
    updateMonthYearDisplay();
    
    // Update radio buttons if they exist
    updateRadioButtons();
}

/**
 * Handle year change
 */
function handleYearChange(event) {
    const year = parseInt(event.target.dataset.year);
    if (year) {
        CalendarState.currentYear = year;
        updateCalendar();
        updateMonthYearDisplay();
        updateRadioButtons();
    }
}

/**
 * Handle month change
 */
function handleMonthChange(event) {
    const month = parseInt(event.target.dataset.month);
    if (month) {
        CalendarState.currentMonth = month;
        updateCalendar();
        updateMonthYearDisplay();
        updateRadioButtons();
    }
}

/**
 * Go to today's date
 */
function goToToday() {
    const today = new Date();
    const buddhistYear = today.getFullYear() + 543;
    
    CalendarState.currentYear = buddhistYear;
    CalendarState.currentMonth = today.getMonth() + 1;
    CalendarState.selectedDate = today.getDate();
    
    updateCalendar();
    updateMonthYearDisplay();
    updateRadioButtons();
}

/**
 * Update calendar display
 */
function updateCalendar(year = CalendarState.currentYear, month = CalendarState.currentMonth) {
    CalendarState.currentYear = year;
    CalendarState.currentMonth = month;
    
    renderCalendar();
    updateMonthYearDisplay();
}

/**
 * Render the calendar grid
 */
function renderCalendar() {
    const calendarGrid = document.querySelector('.calendar-days');
    if (!calendarGrid) return;
    
    // Clear existing content
    calendarGrid.innerHTML = '';
    
    // Get calendar data
    const { days, startDay } = getCalendarData(CalendarState.currentYear, CalendarState.currentMonth);
    
    // Add day headers
    THAI_DAYS.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day-cell empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= days; day++) {
        const dayCell = createDayCell(day);
        calendarGrid.appendChild(dayCell);
    }
}

/**
 * Create a day cell element
 */
function createDayCell(day) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';
    dayCell.setAttribute('data-date', day);
    
    // Create day number
    const dayNumber = document.createElement('span');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayCell.appendChild(dayNumber);
    
    // Check for events on this day
    const eventsOnDay = getEventsForDate(CalendarState.currentYear, CalendarState.currentMonth, day);
    
    if (eventsOnDay.length > 0) {
        dayCell.classList.add('has-events');
        
        // Add event indicators
        const eventIndicator = document.createElement('div');
        eventIndicator.className = 'event-indicator';
        eventIndicator.textContent = eventsOnDay.length;
        dayCell.appendChild(eventIndicator);
        
        // Add event preview on hover
        dayCell.title = eventsOnDay.map(event => event.title).join(', ');
    }
    
    // Check if this is today
    if (isToday(CalendarState.currentYear, CalendarState.currentMonth, day)) {
        dayCell.classList.add('today');
    }
    
    // Check if this is selected date
    if (CalendarState.selectedDate === day) {
        dayCell.classList.add('selected');
    }
    
    // Add click handler
    dayCell.addEventListener('click', () => handleDayClick(day));
    
    return dayCell;
}

/**
 * Handle day cell click
 */
function handleDayClick(day) {
    // Remove previous selection
    const previousSelected = document.querySelector('.day-cell.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    // Set new selection
    CalendarState.selectedDate = day;
    const dayCell = document.querySelector(`[data-date="${day}"]`);
    if (dayCell) {
        dayCell.classList.add('selected');
    }
    
    // Show events for this day
    showEventsForDay(day);
    
    // Trigger event
    const event = new CustomEvent('dateSelected', {
        detail: {
            year: CalendarState.currentYear,
            month: CalendarState.currentMonth,
            day: day
        }
    });
    document.dispatchEvent(event);
}

/**
 * Get calendar data for a specific year and month
 */
function getCalendarData(year, month) {
    // Convert Buddhist year to Gregorian year
    const gregorianYear = year - 543;
    
    // Get first day of month and number of days
    const firstDay = new Date(gregorianYear, month - 1, 1);
    const lastDay = new Date(gregorianYear, month, 0);
    
    return {
        days: lastDay.getDate(),
        startDay: firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.
    };
}

/**
 * Get events for a specific date
 */
function getEventsForDate(year, month, day) {
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Get events from AppState if available
    const events = window.AcademicCalendar?.AppState?.events || CalendarState.events;
    
    return events.filter(event => event.date === dateString);
}

/**
 * Check if a date is today
 */
function isToday(year, month, day) {
    const today = new Date();
    const buddhistYear = today.getFullYear() + 543;
    
    return year === buddhistYear && 
           month === (today.getMonth() + 1) && 
           day === today.getDate();
}

/**
 * Show events for a specific day
 */
function showEventsForDay(day) {
    const events = getEventsForDate(CalendarState.currentYear, CalendarState.currentMonth, day);
    const eventsList = document.querySelector('.events-list');
    
    if (!eventsList) return;
    
    eventsList.innerHTML = '';
    
    if (events.length === 0) {
        eventsList.innerHTML = '<p class="no-events">ไม่มีกิจกรรมในวันนี้</p>';
        return;
    }
    
    events.forEach(event => {
        const eventElement = createEventElement(event);
        eventsList.appendChild(eventElement);
    });
}

/**
 * Create an event element
 */
function createEventElement(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = `event-item cat-${event.category}`;
    
    eventDiv.innerHTML = `
        <div class="event-title">${event.title}</div>
        <div class="event-description">${event.description || ''}</div>
        <div class="event-category ${event.category}">${getCategoryName(event.category)}</div>
    `;
    
    return eventDiv;
}

/**
 * Get category display name
 */
function getCategoryName(category) {
    const categories = {
        academic: 'การศึกษา',
        student: 'กิจกรรมนักศึกษา',
        holiday: 'วันหยุด',
        training: 'ฝึกอบรม',
        sports: 'กีฬา/วัฒนธรรม'
    };
    
    return categories[category] || category;
}

/**
 * Update month and year display
 */
function updateMonthYearDisplay() {
    const monthDisplay = document.querySelector('.current-month');
    const yearDisplay = document.querySelector('.current-year');
    
    if (monthDisplay) {
        monthDisplay.textContent = THAI_MONTHS[CalendarState.currentMonth - 1];
    }
    
    if (yearDisplay) {
        yearDisplay.textContent = CalendarState.currentYear;
    }
    
    // Update month-year combined displays
    const monthYearDisplays = document.querySelectorAll('.month-year-display');
    monthYearDisplays.forEach(display => {
        display.textContent = `${THAI_MONTHS[CalendarState.currentMonth - 1]} ${CalendarState.currentYear}`;
    });
}

/**
 * Update radio buttons to match current state
 */
function updateRadioButtons() {
    // Update year radio button
    const yearRadio = document.querySelector(`#year-${CalendarState.currentYear}`);
    if (yearRadio) {
        yearRadio.checked = true;
    }
    
    // Update month radio button
    const monthRadio = document.querySelector(`#month-${CalendarState.currentYear}-${CalendarState.currentMonth}`);
    if (monthRadio) {
        monthRadio.checked = true;
    }
}

/**
 * Set events data
 */
function setCalendarEvents(events) {
    CalendarState.events = events;
    renderCalendar(); // Re-render to show event indicators
}

/**
 * Get current calendar state
 */
function getCalendarState() {
    return { ...CalendarState };
}

/**
 * Jump to specific month/year
 */
function jumpToDate(year, month, day = null) {
    CalendarState.currentYear = year;
    CalendarState.currentMonth = month;
    if (day) {
        CalendarState.selectedDate = day;
    }
    
    updateCalendar();
    updateMonthYearDisplay();
    updateRadioButtons();
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCalendar);

// Export calendar functions
window.CalendarModule = {
    initializeCalendar,
    updateCalendar,
    navigateMonth,
    jumpToDate,
    setCalendarEvents,
    getCalendarState,
    THAI_MONTHS,
    THAI_DAYS
};