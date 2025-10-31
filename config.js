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
    primaryCaregiver: {
        name: "Hal",
        displayName: "Hal",
        relationship: "Husband",
        phone: "",
        photo: null
    },
    additionalCaregivers: [],
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
    medications: []
};

// Declare settings variable - will be initialized in main.js after storage.js loads
let settings;
