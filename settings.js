// ============================================================================
// DEMENTIA CLOCK - CONFIGURATION FILE
// ============================================================================
// This file contains all customizable settings for the clock.
// Edit the values below to personalize the clock for your loved one.
// ============================================================================

// ============================================================================
// PERSONAL INFORMATION
// ============================================================================
// Photos and names will be displayed at the top of the clock.
// Place all photo files in the same folder as this settings file.

const PERSONAL_INFO = {
    firstName: "Ilona",
    lastName: "Jones",
    birthDate: "1953-04-15",        // Format: YYYY-MM-DD (for special events)
    spouseName: "Hal",
    anniversaryDate: "1975-06-10",  // Format: YYYY-MM-DD (for special events)
    
    // Photo filenames (must be in same folder as HTML/JS files)
    photo: "ilona.jpg",             // Patient photo
    spousePhoto: "hal.jpg"          // Spouse photo
};

// ============================================================================
// CAREGIVER PHOTOS
// ============================================================================
// List of caregivers who may help. Photos cycle with button click.
// When spouse is caregiver, third photo is hidden automatically.

const CAREGIVERS = [
    { name: "Hal", photo: "hal.jpg" },      // Must match spouse
    { name: "Sarah", photo: "sarah.jpg" },
    { name: "Emma", photo: "emma.jpg" },
    { name: "Michael", photo: "michael.jpg" },
    { name: "Lisa", photo: "lisa.jpg" }
];

// Which caregiver is currently displayed (0 = first in list, 1 = second, etc.)
// Change this number to set who is helping, or use the button on screen to cycle
let currentCaregiverIndex = 0;

// ============================================================================
// ACTIVITY SCHEDULE
// ============================================================================
// Define when different activities occur throughout the day.
// Times use 24-hour format (0-23).
// The clock will display the appropriate activity label based on current time.

const ACTIVITY_SCHEDULE = {
    breakfast: { 
        start: 6,           // 6:00 AM
        end: 9,             // 9:00 AM
        label: "Breakfast Time" 
    },
    morning: { 
        start: 9,           // 9:00 AM
        end: 12,            // 12:00 PM
        label: "Morning Time" 
    },
    lunch: { 
        start: 12,          // 12:00 PM
        end: 13,            // 1:00 PM
        label: "Lunch Time" 
    },
    afternoon: { 
        start: 13,          // 1:00 PM
        end: 17,            // 5:00 PM
        label: "Afternoon Time" 
    },
    dinner: { 
        start: 17,          // 5:00 PM
        end: 19,            // 7:00 PM
        label: "Dinner Time" 
    },
    evening: { 
        start: 19,          // 7:00 PM
        end: 22,            // 10:00 PM
        label: "Evening Time" 
    },
    sleep: { 
        start: 22,          // 10:00 PM
        end: 6,             // 6:00 AM (wraps to next day)
        label: "Sleep Time" 
    }
};

// ============================================================================
// SPECIAL EVENTS (Phase 2 - Not yet active)
// ============================================================================
// Personal events that will be displayed on specific dates.
// Format: "MM-DD - Event Description"

const SPECIAL_EVENTS = [
    // Examples:
    // "10-05 - Ilona's Birthday",
    // "05-11 - Hal's Birthday",
    // "10-20 - Wedding Anniversary",
    // "12-05 - Granddaughter Emma's Birthday"
];

// ============================================================================
// HOLIDAY CALENDAR (Phase 2 - Not yet active)
// ============================================================================
// Enable or disable holidays to be displayed on the clock.
// Set to true to show, false to hide.

const HOLIDAY_CALENDAR = {
    enabled: true,  // Master switch: set to false to disable all holidays
    
    holidays: {
        // January
        "New Year's Day": true,
        "Martin Luther King Jr. Day": false,
        
        // February
        "Groundhog Day": false,
        "Valentine's Day": true,
        "Presidents Day": false,
        
        // March
        "St. Patrick's Day": false,
        "First Day of Spring": false,
        
        // March/April (Variable dates)
        "Good Friday": false,
        "Easter Sunday": true,
        "Passover": false,
        
        // May
        "Mother's Day": true,
        "Memorial Day": false,
        
        // June
        "First Day of Summer": false,
        "Juneteenth": false,
        "Father's Day": true,
        
        // July
        "Independence Day": true,
        
        // September
        "Labor Day": false,
        "Rosh Hashanah": false,
        "First Day of Fall": false,
        
        // September/October
        "Yom Kippur": false,
        
        // October
        "Columbus Day": false,
        "Diwali": false,
        "Halloween": true,
        
        // November
        "Day of the Dead": false,
        "Veterans Day": false,
        "Thanksgiving": true,
        
        // December
        "Hanukkah": false,
        "First Day of Winter": false,
        "Christmas Eve": false,
        "Christmas Day": true,
        "New Year's Eve": false,
        
        // Islamic (Lunar calendar - dates vary)
        "Ramadan": false,
        "Eid al-Fitr": false,
        "Eid al-Adha": false
    }
};

// ============================================================================
// MEDICATION SCHEDULE (Phase 5 - Not yet active)
// ============================================================================
// Times when medication should be taken.
// Background color will change at these times to alert caregivers.
// Format: 24-hour time as string "HH:MM"

const MEDICATION_TIMES = [
    // Examples:
    // "08:00",  // 8:00 AM
    // "12:00",  // 12:00 PM
    // "18:00"   // 6:00 PM
];

// Duration in minutes that the medication reminder color stays active
const MEDICATION_REMINDER_DURATION = 30;

// ============================================================================
// CAREGIVER INFORMATION (Phase 3 - Not yet active)
// ============================================================================
// Information accessible via the "i" button for caregivers.
// Organized in Apple contact card style.

const CAREGIVER_INFO = {
    "Medication Schedule": [
        // Examples:
        // "8:00 AM - Aspirin 81mg, Vitamin D",
        // "12:00 PM - Blood pressure medication (Lisinopril 10mg)",
        // "6:00 PM - Evening medications"
    ],
    
    "Emergency Contacts": [
        // Examples:
        // "Hal (husband): 555-123-4567",
        // "Dr. Smith (primary): 555-234-5678",
        // "Neighbor Sarah: 555-345-6789"
    ],
    
    "Medical Information": [
        // Examples:
        // "Allergies: Penicillin",
        // "Conditions: Dementia, Hypertension",
        // "Blood Type: O+"
    ],
    
    "Daily Routine": [
        // Examples:
        // "Morning: Wakes around 7 AM, likes coffee with breakfast",
        // "Afternoon: Enjoys sitting in garden",
        // "Evening: Watches news at 6 PM"
    ],
    
    "Calming Strategies": [
        // Examples:
        // "Enjoys looking at family photo albums",
        // "Favorite music: Classical, especially Mozart",
        // "Reassure her about where she is and who you are"
    ],
    
    "Dietary Notes": [
        // Examples:
        // "Vegetarian, no spicy foods",
        // "Likes: Pasta, soup, fruit",
        // "Dislikes: Fish, strong cheese"
    ]
    
    // You can add custom categories by following this format:
    // "Custom Category Name": [
    //     "Your information here",
    //     "Can be multiple lines"
    // ]
};

// ============================================================================
// POP-UP TASK SYSTEM (Phase 4 - Not yet active)
// ============================================================================
// Schedule pop-up reminders at specific times throughout the day.
// Each time slot can contain 1-3 tasks.
// Format: "HH:MM AM/PM": ["Task 1", "Task 2", "Task 3"]
// Available slots: Every 15 minutes (12:00 AM, 12:15 AM, 12:30 AM, etc.)

const POPUP_TASKS = {
    // Examples:
    // "8:00 AM": ["Take Morning Pills", "Eat Breakfast"],
    // "7:30 PM": ["Brush Your Teeth", "Change to PJ's"],
    // "9:00 PM": ["Take Evening Medicine"]
};

// ============================================================================
// END OF CONFIGURATION
// ============================================================================
// You should not need to edit anything below this line.
// ============================================================================