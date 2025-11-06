// ============================================================================
// DEMENTIA CLOCK - FLASHCARDS MODULE
// ============================================================================
// Handles flashcard display, rotation, and navigation

let flashcardState = {
    currentCategoryIndex: 0,
    currentCardIndex: 0,
    isPaused: false,
    rotationTimer: null,
    displayMode: 'single',  // 'single' or 'grid'
    source: null  // 'patient', 'primaryCaregiver', 'caregiver-N', 'category-N', or null
};

function getAllFlashcardSources() {
    const sources = [];
    
    // Patient gallery
    if (settings.photoGallery && settings.photoGallery.length > 0) {
        sources.push({
            type: 'patient',
            name: settings.displayName,
            cards: settings.photoGallery
        });
    }
    
    // Primary caregiver gallery
    if (settings.primaryCaregiver.photoGallery && settings.primaryCaregiver.photoGallery.length > 0) {
        sources.push({
            type: 'primaryCaregiver',
            name: settings.primaryCaregiver.displayName,
            relationship: settings.primaryCaregiver.relationship,
            cards: settings.primaryCaregiver.photoGallery
        });
    }
    
    // Additional caregivers
    if (settings.additionalCaregivers) {
        settings.additionalCaregivers.forEach((caregiver, index) => {
            if (caregiver.photoGallery && caregiver.photoGallery.length > 0) {
                sources.push({
                    type: 'caregiver',
                    index: index,
                    name: caregiver.displayName || caregiver.name,
                    relationship: caregiver.relationship,
                    cards: caregiver.photoGallery
                });
            }
        });
    }
    
    // Custom categories
    if (settings.flashcards && settings.flashcards.categories) {
        settings.flashcards.categories.forEach((category, index) => {
            if (category.cards && category.cards.length > 0) {
                sources.push({
                    type: 'category',
                    index: index,
                    name: category.name,
                    cards: category.cards
                });
            }
        });
    }
    
    return sources;
}

function openFlashcards(source = null) {
    flashcardState.source = source;
    flashcardState.currentCardIndex = 0;
    flashcardState.isPaused = false;
    
    // Set display mode from settings
    if (settings.flashcards && settings.flashcards.displayMode) {
        flashcardState.displayMode = settings.flashcards.displayMode;
    }
    
    const panel = document.getElementById('flashcardsPanel');
    panel.classList.add('active');
    document.getElementById('homeBtn').classList.add('visible');
    
    renderFlashcards();
    
    // Start auto-rotation if enabled
    if (settings.flashcards && settings.flashcards.autoRotate) {
        startFlashcardRotation();
    }
}

function closeFlashcards() {
    const panel = document.getElementById('flashcardsPanel');
    panel.classList.remove('active');
    
    stopFlashcardRotation();
    flashcardState.source = null;
}

function renderFlashcards() {
    const sources = getAllFlashcardSources();
    
    if (sources.length === 0) {
        renderEmptyFlashcards();
        return;
    }
    
    // If no specific source, show category browser
    if (!flashcardState.source) {
        renderCategoryBrowser(sources);
        return;
    }
    
    // Find the source
    let sourceData = null;
    
    if (flashcardState.source.type === 'patient') {
        sourceData = sources.find(s => s.type === 'patient');
    } else if (flashcardState.source.type === 'primaryCaregiver') {
        sourceData = sources.find(s => s.type === 'primaryCaregiver');
    } else if (flashcardState.source.type === 'caregiver') {
        sourceData = sources.find(s => s.type === 'caregiver' && s.index === flashcardState.source.index);
    } else if (flashcardState.source.type === 'category') {
        sourceData = sources.find(s => s.type === 'category' && s.index === flashcardState.source.index);
    }
    
    if (!sourceData || !sourceData.cards || sourceData.cards.length === 0) {
        renderEmptyFlashcards();
        return;
    }
    
    // Render based on display mode
    if (flashcardState.displayMode === 'grid') {
        renderGridFlashcards(sourceData);
    } else {
        renderSingleFlashcard(sourceData);
    }
}

function renderCategoryBrowser(sources) {
    const content = document.getElementById('flashcardsContent');
    
    let html = '<div class="flashcard-browser">';
    html += '<h2 style="text-align: center; margin-bottom: 2rem; font-size: 2.5rem;">Choose a Category</h2>';
    html += '<div class="flashcard-category-grid">';
    
    sources.forEach((source, index) => {
        const isPersonal = source.type === 'patient' || source.type === 'primaryCaregiver' || source.type === 'caregiver';
        const icon = isPersonal ? '👤' : '📚';
        const subtitle = source.relationship ? `(${source.relationship})` : `${source.cards.length} cards`;
        
        html += `
            <div class="flashcard-category-card" data-source-index="${index}">
                <div class="flashcard-category-icon">${icon}</div>
                <div class="flashcard-category-name">${source.name}</div>
                <div class="flashcard-category-subtitle">${subtitle}</div>
            </div>
        `;
    });
    
    html += '</div>';
    html += '</div>';
    
    content.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll('.flashcard-category-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            flashcardState.source = sources[index];
            flashcardState.currentCardIndex = 0;
            renderFlashcards();
            
            // Start auto-rotation if enabled
            if (settings.flashcards && settings.flashcards.autoRotate) {
                startFlashcardRotation();
            }
        });
    });
}

function renderSingleFlashcard(sourceData) {
    const content = document.getElementById('flashcardsContent');
    const card = sourceData.cards[flashcardState.currentCardIndex];
    
    if (!card) {
        renderEmptyFlashcards();
        return;
    }
    
    const totalCards = sourceData.cards.length;
    const currentNum = flashcardState.currentCardIndex + 1;
    
    let html = '<div class="flashcard-single-container">';
    
    // Header with category name and back button
    html += '<div class="flashcard-header">';
    html += `<button class="flashcard-back-btn" onclick="flashcardState.source = null; renderFlashcards(); stopFlashcardRotation();">← Back</button>`;
    html += `<div class="flashcard-category-title">${sourceData.name}</div>`;
    html += `<div class="flashcard-counter">${currentNum} / ${totalCards}</div>`;
    html += '</div>';
    
    // Main flashcard display
    html += '<div class="flashcard-single-card">';
    html += `<div class="flashcard-image-container">`;
    html += `<img src="${card.image}" alt="${card.caption}" class="flashcard-image">`;
    html += `</div>`;
    html += `<div class="flashcard-caption">${card.caption}</div>`;
    html += '</div>';
    
    // Controls
    html += '<div class="flashcard-controls">';
    html += `<button class="flashcard-control-btn" onclick="previousFlashcard()" ${currentNum === 1 ? 'disabled' : ''}>◀ Previous</button>`;
    
    if (flashcardState.isPaused) {
        html += `<button class="flashcard-control-btn flashcard-play-btn" onclick="resumeFlashcardRotation()">▶ Play</button>`;
    } else {
        html += `<button class="flashcard-control-btn flashcard-pause-btn" onclick="pauseFlashcardRotation()">⏸ Pause</button>`;
    }
    
    html += `<button class="flashcard-control-btn" onclick="nextFlashcard()" ${currentNum === totalCards ? 'disabled' : ''}>Next ▶</button>`;
    html += '</div>';
    
    // Progress bar
    const progress = (currentNum / totalCards) * 100;
    html += `<div class="flashcard-progress-bar">`;
    html += `<div class="flashcard-progress-fill" style="width: ${progress}%"></div>`;
    html += `</div>`;
    
    html += '</div>';
    
    content.innerHTML = html;
}

function renderGridFlashcards(sourceData) {
    const content = document.getElementById('flashcardsContent');
    
    // Get 9 cards starting from current index
    const startIndex = flashcardState.currentCardIndex;
    const cards = sourceData.cards.slice(startIndex, startIndex + 9);
    
    if (cards.length === 0) {
        renderEmptyFlashcards();
        return;
    }
    
    const totalCards = sourceData.cards.length;
    const currentPage = Math.floor(startIndex / 9) + 1;
    const totalPages = Math.ceil(totalCards / 9);
    
    let html = '<div class="flashcard-grid-container">';
    
    // Header
    html += '<div class="flashcard-header">';
    html += `<button class="flashcard-back-btn" onclick="flashcardState.source = null; renderFlashcards(); stopFlashcardRotation();">← Back</button>`;
    html += `<div class="flashcard-category-title">${sourceData.name}</div>`;
    html += `<div class="flashcard-counter">Page ${currentPage} / ${totalPages}</div>`;
    html += '</div>';
    
    // Grid
    html += '<div class="flashcard-grid">';
    cards.forEach(card => {
        html += '<div class="flashcard-grid-card">';
        html += `<img src="${card.image}" alt="${card.caption}" class="flashcard-grid-image">`;
        html += `<div class="flashcard-grid-caption">${card.caption}</div>`;
        html += '</div>';
    });
    html += '</div>';
    
    // Controls
    html += '<div class="flashcard-controls">';
    html += `<button class="flashcard-control-btn" onclick="previousFlashcardGrid()" ${currentPage === 1 ? 'disabled' : ''}>◀ Previous</button>`;
    
    if (flashcardState.isPaused) {
        html += `<button class="flashcard-control-btn flashcard-play-btn" onclick="resumeFlashcardRotation()">▶ Play</button>`;
    } else {
        html += `<button class="flashcard-control-btn flashcard-pause-btn" onclick="pauseFlashcardRotation()">⏸ Pause</button>`;
    }
    
    html += `<button class="flashcard-control-btn" onclick="nextFlashcardGrid()" ${currentPage === totalPages ? 'disabled' : ''}>Next ▶</button>`;
    html += '</div>';
    
    html += '</div>';
    
    content.innerHTML = html;
}

function renderEmptyFlashcards() {
    const content = document.getElementById('flashcardsContent');
    content.innerHTML = `
        <div class="flashcard-empty">
            <div class="flashcard-empty-icon">📚</div>
            <h2>No Flashcards Yet</h2>
            <p>Add flashcards in Settings to get started.</p>
            <button class="btn btn-primary" onclick="closeFlashcards(); openSettings('flashcards');">Go to Settings</button>
        </div>
    `;
}

function nextFlashcard() {
    const sources = getAllFlashcardSources();
    if (!flashcardState.source) return;
    
    const sourceData = sources.find(s => 
        (s.type === flashcardState.source.type) && 
        (s.index === flashcardState.source.index || flashcardState.source.index === undefined)
    );
    
    if (!sourceData) return;
    
    if (flashcardState.currentCardIndex < sourceData.cards.length - 1) {
        flashcardState.currentCardIndex++;
        renderFlashcards();
    }
}

function previousFlashcard() {
    if (flashcardState.currentCardIndex > 0) {
        flashcardState.currentCardIndex--;
        renderFlashcards();
    }
}

function nextFlashcardGrid() {
    const sources = getAllFlashcardSources();
    if (!flashcardState.source) return;
    
    const sourceData = sources.find(s => 
        (s.type === flashcardState.source.type) && 
        (s.index === flashcardState.source.index || flashcardState.source.index === undefined)
    );
    
    if (!sourceData) return;
    
    const nextIndex = flashcardState.currentCardIndex + 9;
    if (nextIndex < sourceData.cards.length) {
        flashcardState.currentCardIndex = nextIndex;
        renderFlashcards();
    }
}

function previousFlashcardGrid() {
    const prevIndex = flashcardState.currentCardIndex - 9;
    if (prevIndex >= 0) {
        flashcardState.currentCardIndex = prevIndex;
        renderFlashcards();
    }
}

function startFlashcardRotation() {
    stopFlashcardRotation();
    
    const interval = (settings.flashcards && settings.flashcards.rotationInterval) 
        ? settings.flashcards.rotationInterval * 1000 
        : 10000;
    
    flashcardState.rotationTimer = setInterval(() => {
        if (!flashcardState.isPaused) {
            if (flashcardState.displayMode === 'grid') {
                nextFlashcardGrid();
            } else {
                nextFlashcard();
            }
            
            // Check if we've reached the end
            const sources = getAllFlashcardSources();
            if (!flashcardState.source) {
                stopFlashcardRotation();
                return;
            }
            
            const sourceData = sources.find(s => 
                (s.type === flashcardState.source.type) && 
                (s.index === flashcardState.source.index || flashcardState.source.index === undefined)
            );
            
            if (!sourceData) {
                stopFlashcardRotation();
                return;
            }
            
            // If grid mode and we've gone past the last page, restart
            if (flashcardState.displayMode === 'grid') {
                if (flashcardState.currentCardIndex >= sourceData.cards.length) {
                    flashcardState.currentCardIndex = 0;
                    renderFlashcards();
                }
            } else {
                // If single mode and we've reached the end, restart
                if (flashcardState.currentCardIndex >= sourceData.cards.length - 1) {
                    flashcardState.currentCardIndex = 0;
                    renderFlashcards();
                }
            }
        }
    }, interval);
}

function stopFlashcardRotation() {
    if (flashcardState.rotationTimer) {
        clearInterval(flashcardState.rotationTimer);
        flashcardState.rotationTimer = null;
    }
}

function pauseFlashcardRotation() {
    flashcardState.isPaused = true;
    renderFlashcards();
}

function resumeFlashcardRotation() {
    flashcardState.isPaused = false;
    renderFlashcards();
}

function openSettings(tab) {
    document.getElementById('settingsBtn').click();
    // Switch to the specified tab
    const tabButton = document.querySelector(`.tab[data-tab="${tab}"]`);
    if (tabButton) {
        tabButton.click();
    }
}

function initializeFlashcardHandlers() {
    // Flashcard button
    document.getElementById('flashcardsBtn').addEventListener('click', () => {
        openFlashcards();
    });
    
    // Photo click handlers - Patient
    document.getElementById('patientPhoto').addEventListener('click', () => {
        if (settings.photoGallery && settings.photoGallery.length > 0) {
            openFlashcards({ type: 'patient' });
        }
    });
    
    // Photo click handlers - Primary Caregiver
    document.getElementById('spousePhoto').addEventListener('click', () => {
        if (settings.primaryCaregiver.photoGallery && settings.primaryCaregiver.photoGallery.length > 0) {
            openFlashcards({ type: 'primaryCaregiver' });
        }
    });
    
    // Photo click handler - Additional Caregiver (dynamically added)
    document.getElementById('caregiverCard').addEventListener('click', () => {
        const currentIndex = settings.currentCaregiverIndex;
        if (currentIndex >= 0 && currentIndex < settings.additionalCaregivers.length) {
            const caregiver = settings.additionalCaregivers[currentIndex];
            if (caregiver.photoGallery && caregiver.photoGallery.length > 0) {
                openFlashcards({ type: 'caregiver', index: currentIndex });
            }
        }
    });
}
