// ============================================================================
// DEMENTIA CLOCK - CONFIGURATION
// ============================================================================
// Default settings structure for the application
// This file is loaded first and defines the data model

const DEFAULT_SETTINGS = {
    firstName: "Ilona",
    lastName: "Jones",
    displayName: "Ilona",
    photo: null,
    photoGallery: [],  // Array of { image: base64, caption: "text" }
    primaryCaregiver: {
        name: "Hal",
        displayName: "Hal",
        relationship: "Husband",
        phone: "",
        photo: null,
        photoGallery: []  // Array of { image: base64, caption: "text" }
    },
    additionalCaregivers: [],  // Each will have photoGallery: []
    currentCaregiverIndex: -1,
    schedule: [
        { start: "06:00", end: "09:00", label: "Breakfast Time" },
        { start: "09:00", end: "12:00", label: "Morning Time" },
        { start: "12:00", end: "13:00", label: "Lunch Time" },
        { start: "13:00", end: "17:00", label: "Afternoon Time" },
        { start: "17:00", end: "19:00", label: "Dinner Time" },
        { start: "19:00", end: "22:00", label: "Evening Time" },
        { start: "22:00", end: "06:00", label: "Sleep Time" }
    ],
    caregiverInfo: {
        emergencyContacts: {
            contact1: { name: "", phone: "", note: "" },
            contact2: { name: "", phone: "", note: "" }
        },
        medicalTeam: {
            primaryPhysician: { name: "", phone: "", note: "" },
            preferredHospital: ""
        },
        legal: {
            poa: { name: "", phone: "", note: "" },
            dnrStatus: ""
        },
        medical: {
            allergies: "",
            conditions: ""
        }
    },
    medications: [],
    specialEvents: {
        birthdays: [
            // { name: "Sarah", month: 3, day: 15, year: 1983, note: "" }
        ],
        annualHolidays: [
            // { name: "Christmas", month: 12, day: 25, note: "" }
        ],
        floatingHolidays: [
            // { name: "Thanksgiving", month: 11, day: 28, year: 2025, note: "" }
        ],
        specialOccasions: [
            // { name: "Anniversary", month: 6, day: 14, year: 1975, note: "Wedding day" }
        ]
    },
    flashcards: {
        displayMode: "single",  // "single" or "grid"
        rotationInterval: 10,   // seconds
        autoRotate: true,
        categories: [
            // { 
            //   name: "Kitchen Items", 
            //   cards: [
            //     { image: base64, caption: "Spoon" },
            //     { image: base64, caption: "Fork" }
            //   ]
            // }
        ]
    }
};

// Declare settings variable - will be initialized in main.js after storage.js loads
let settings;
