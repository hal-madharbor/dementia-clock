// ============================================================================
// DEMENTIA CLOCK - FLASHCARDS SETTINGS UI MODULE
// ============================================================================
// Handles flashcard settings interface - categories, cards, photo galleries

function renderFlashcardsTab() {
    const flashcardsPanel = document.getElementById('flashcards');
    
    flashcardsPanel.innerHTML = `
        <h2>Flashcards & Photo Galleries</h2>
        <p style="margin-bottom: 1.5rem; color: #666;">
            Create memory reinforcement flashcards and photo galleries. Home screen photos become interactive - tap them to view photo galleries.
        </p>
        
        <div class="flashcard-settings-section">
            <h3>Display Settings</h3>
            <div class="form-group">
                <label class="form-label">Display Mode</label>
                <select class="form-input" id="flashcardDisplayMode">
                    <option value="single">Single Card (one at a time)</option>
                    <option value="grid">Grid View (3×3 matrix)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Auto-Rotation</label>
                <input type="checkbox" id="flashcardAutoRotate" style="width: auto; margin-right: 0.5rem;">
                <label for="flashcardAutoRotate" style="display: inline; font-weight: normal;">Automatically advance to next card</label>
            </div>
            <div class="form-group">
                <label class="form-label">Rotation Interval (seconds)</label>
                <input type="number" class="form-input" id="flashcardInterval" min="3" max="60" placeholder="10">
            </div>
        </div>
        
        <div class="flashcard-settings-tabs">
            <button class="flashcard-subtab active" data-flashcard-tab="patient-gallery">Patient Gallery</button>
            <button class="flashcard-subtab" data-flashcard-tab="caregiver-galleries">Caregiver Galleries</button>
            <button class="flashcard-subtab" data-flashcard-tab="categories">Custom Categories</button>
        </div>
        
        <div class="flashcard-tab-content active" id="patient-gallery-content">
            <h3 style="margin: 1.5rem 0 1rem 0;">${settings.displayName}'s Photo Gallery</h3>
            <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
                Add multiple photos to help reinforce identity and memory. Tap ${settings.displayName}'s photo on the main screen to view this gallery.
            </p>
            <div id="patientGalleryList"></div>
            <button class="btn btn-primary" id="addPatientGalleryBtn" style="margin-top: 1rem;">+ Add Photo to ${settings.displayName}'s Gallery</button>
        </div>
        
        <div class="flashcard-tab-content" id="caregiver-galleries-content">
            <h3 style="margin: 1.5rem 0 1rem 0;">Caregiver Photo Galleries</h3>
            <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
                Add photos of each caregiver. Tap their photo on the main screen to view their gallery.
            </p>
            
            <h4 style="margin: 1.5rem 0 0.5rem 0; font-size: 1.1rem;">${settings.primaryCaregiver.displayName} (${settings.primaryCaregiver.relationship})</h4>
            <div id="primaryCaregiverGalleryList"></div>
            <button class="btn btn-secondary" id="addPrimaryCaregiverGalleryBtn" style="margin-top: 1rem;">+ Add Photo to ${settings.primaryCaregiver.displayName}'s Gallery</button>
            
            <div id="additionalCaregiversGalleries"></div>
        </div>
        
        <div class="flashcard-tab-content" id="categories-content">
            <h3 style="margin: 1.5rem 0 1rem 0;">Custom Flashcard Categories</h3>
            <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
                Create themed categories like "Kitchen Items", "Daily Activities", "Family & Friends", etc.
            </p>
            <div id="flashcardCategoriesList"></div>
            <button class="btn btn-primary" id="addFlashcardCategoryBtn" style="margin-top: 1rem;">+ Add Category</button>
        </div>
    `;
    
    // Load current settings
    loadFlashcardSettings();
    
    // Initialize tabs
    initializeFlashcardSettingsTabs();
    
    // Initialize all content
    renderPatientGallery();
    renderCaregiverGalleries();
    renderFlashcardCategories();
    
    // Attach event listeners
    attachFlashcardSettingsListeners();
}

function loadFlashcardSettings() {
    if (settings.flashcards) {
        document.getElementById('flashcardDisplayMode').value = settings.flashcards.displayMode || 'single';
        document.getElementById('flashcardAutoRotate').checked = settings.flashcards.autoRotate !== false;
        document.getElementById('flashcardInterval').value = settings.flashcards.rotationInterval || 10;
    }
}

function initializeFlashcardSettingsTabs() {
    document.querySelectorAll('.flashcard-subtab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.flashcard-subtab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            document.querySelectorAll('.flashcard-tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(e.target.dataset.flashcardTab + '-content').classList.add('active');
        });
    });
}

function renderPatientGallery() {
    const container = document.getElementById('patientGalleryList');
    container.innerHTML = '';
    
    if (!settings.photoGallery || settings.photoGallery.length === 0) {
        container.innerHTML = '<p style="color: #999; padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">No photos in gallery yet.</p>';
        return;
    }
    
    settings.photoGallery.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'flashcard-gallery-item';
        item.innerHTML = `
            <img src="${photo.image}" class="flashcard-gallery-thumb" alt="${photo.caption}">
            <div style="flex: 1;">
                <input type="text" class="form-input gallery-caption-input" data-gallery="patient" data-index="${index}" value="${photo.caption}" placeholder="Caption" style="margin: 0;">
            </div>
            <button class="btn btn-danger gallery-remove-btn" data-gallery="patient" data-index="${index}">✕</button>
        `;
        container.appendChild(item);
    });
    
    attachGalleryEventListeners();
}

function renderCaregiverGalleries() {
    const primaryContainer = document.getElementById('primaryCaregiverGalleryList');
    primaryContainer.innerHTML = '';
    
    if (!settings.primaryCaregiver.photoGallery || settings.primaryCaregiver.photoGallery.length === 0) {
        primaryContainer.innerHTML = '<p style="color: #999; padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">No photos in gallery yet.</p>';
    } else {
        settings.primaryCaregiver.photoGallery.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'flashcard-gallery-item';
            item.innerHTML = `
                <img src="${photo.image}" class="flashcard-gallery-thumb" alt="${photo.caption}">
                <div style="flex: 1;">
                    <input type="text" class="form-input gallery-caption-input" data-gallery="primaryCaregiver" data-index="${index}" value="${photo.caption}" placeholder="Caption" style="margin: 0;">
                </div>
                <button class="btn btn-danger gallery-remove-btn" data-gallery="primaryCaregiver" data-index="${index}">✕</button>
            `;
            primaryContainer.appendChild(item);
        });
    }
    
    // Additional caregivers
    const additionalContainer = document.getElementById('additionalCaregiversGalleries');
    additionalContainer.innerHTML = '';
    
    settings.additionalCaregivers.forEach((caregiver, cgIndex) => {
        const section = document.createElement('div');
        section.style.marginTop = '2rem';
        
        let html = `<h4 style="margin: 1.5rem 0 0.5rem 0; font-size: 1.1rem;">${caregiver.displayName || caregiver.name}`;
        if (caregiver.relationship) {
            html += ` (${caregiver.relationship})`;
        }
        html += `</h4>`;
        
        const galleryId = `additionalCaregiver${cgIndex}GalleryList`;
        html += `<div id="${galleryId}"></div>`;
        html += `<button class="btn btn-secondary add-additional-caregiver-gallery-btn" data-index="${cgIndex}" style="margin-top: 1rem;">+ Add Photo to ${caregiver.displayName || caregiver.name}'s Gallery</button>`;
        
        section.innerHTML = html;
        additionalContainer.appendChild(section);
        
        // Render gallery
        const galleryContainer = document.getElementById(galleryId);
        if (!caregiver.photoGallery || caregiver.photoGallery.length === 0) {
            galleryContainer.innerHTML = '<p style="color: #999; padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">No photos in gallery yet.</p>';
        } else {
            caregiver.photoGallery.forEach((photo, photoIndex) => {
                const item = document.createElement('div');
                item.className = 'flashcard-gallery-item';
                item.innerHTML = `
                    <img src="${photo.image}" class="flashcard-gallery-thumb" alt="${photo.caption}">
                    <div style="flex: 1;">
                        <input type="text" class="form-input gallery-caption-input" data-gallery="additionalCaregiver" data-cg-index="${cgIndex}" data-index="${photoIndex}" value="${photo.caption}" placeholder="Caption" style="margin: 0;">
                    </div>
                    <button class="btn btn-danger gallery-remove-btn" data-gallery="additionalCaregiver" data-cg-index="${cgIndex}" data-index="${photoIndex}">✕</button>
                `;
                galleryContainer.appendChild(item);
            });
        }
    });
    
    attachGalleryEventListeners();
}

function renderFlashcardCategories() {
    const container = document.getElementById('flashcardCategoriesList');
    container.innerHTML = '';
    
    if (!settings.flashcards.categories || settings.flashcards.categories.length === 0) {
        container.innerHTML = '<p style="color: #999; padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">No categories created yet.</p>';
        return;
    }
    
    settings.flashcards.categories.forEach((category, catIndex) => {
        const section = document.createElement('div');
        section.className = 'flashcard-category-section';
        section.style.cssText = 'margin-bottom: 2rem; padding: 1.5rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; background: #f9fafb;';
        
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <input type="text" class="form-input category-name-input" data-index="${catIndex}" value="${category.name}" placeholder="Category Name" style="flex: 1; margin: 0; margin-right: 1rem;">
                <button class="btn btn-danger category-delete-btn" data-index="${catIndex}">Delete Category</button>
            </div>
        `;
        
        const cardsId = `category${catIndex}CardsList`;
        html += `<div id="${cardsId}"></div>`;
        html += `<button class="btn btn-secondary add-category-card-btn" data-index="${catIndex}" style="margin-top: 1rem;">+ Add Card to ${category.name}</button>`;
        
        section.innerHTML = html;
        container.appendChild(section);
        
        // Render cards
        const cardsContainer = document.getElementById(cardsId);
        if (!category.cards || category.cards.length === 0) {
            cardsContainer.innerHTML = '<p style="color: #999; padding: 1rem; background: white; border-radius: 0.5rem; margin-top: 1rem;">No cards in this category yet.</p>';
        } else {
            category.cards.forEach((card, cardIndex) => {
                const item = document.createElement('div');
                item.className = 'flashcard-gallery-item';
                item.style.marginTop = '0.5rem';
                item.innerHTML = `
                    <img src="${card.image}" class="flashcard-gallery-thumb" alt="${card.caption}">
                    <div style="flex: 1;">
                        <input type="text" class="form-input category-card-caption-input" data-cat-index="${catIndex}" data-card-index="${cardIndex}" value="${card.caption}" placeholder="Caption" style="margin: 0;">
                    </div>
                    <button class="btn btn-danger category-card-remove-btn" data-cat-index="${catIndex}" data-card-index="${cardIndex}">✕</button>
                `;
                cardsContainer.appendChild(item);
            });
        }
    });
    
    attachFlashcardCategoryListeners();
}

function attachFlashcardSettingsListeners() {
    // Display mode
    document.getElementById('flashcardDisplayMode').addEventListener('change', (e) => {
        if (!settings.flashcards) settings.flashcards = {};
        settings.flashcards.displayMode = e.target.value;
    });
    
    // Auto-rotate
    document.getElementById('flashcardAutoRotate').addEventListener('change', (e) => {
        if (!settings.flashcards) settings.flashcards = {};
        settings.flashcards.autoRotate = e.target.checked;
    });
    
    // Interval
    document.getElementById('flashcardInterval').addEventListener('change', (e) => {
        if (!settings.flashcards) settings.flashcards = {};
        settings.flashcards.rotationInterval = parseInt(e.target.value) || 10;
    });
    
    // Add patient gallery photo
    document.getElementById('addPatientGalleryBtn').addEventListener('click', () => {
        addPhotoToGallery('patient');
    });
    
    // Add primary caregiver gallery photo
    document.getElementById('addPrimaryCaregiverGalleryBtn').addEventListener('click', () => {
        addPhotoToGallery('primaryCaregiver');
    });
    
    // Add additional caregiver gallery photos
    document.querySelectorAll('.add-additional-caregiver-gallery-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cgIndex = parseInt(e.target.dataset.index);
            addPhotoToGallery('additionalCaregiver', cgIndex);
        });
    });
    
    // Add flashcard category
    document.getElementById('addFlashcardCategoryBtn').addEventListener('click', () => {
        const name = prompt('Enter category name (e.g., "Kitchen Items", "Daily Activities"):');
        if (name && name.trim()) {
            if (!settings.flashcards) settings.flashcards = { categories: [] };
            if (!settings.flashcards.categories) settings.flashcards.categories = [];
            
            settings.flashcards.categories.push({
                name: name.trim(),
                cards: []
            });
            renderFlashcardCategories();
        }
    });
}

function attachGalleryEventListeners() {
    // Caption changes
    document.querySelectorAll('.gallery-caption-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const gallery = e.target.dataset.gallery;
            const index = parseInt(e.target.dataset.index);
            const caption = e.target.value.trim();
            
            if (gallery === 'patient') {
                if (settings.photoGallery[index]) {
                    settings.photoGallery[index].caption = caption;
                }
            } else if (gallery === 'primaryCaregiver') {
                if (settings.primaryCaregiver.photoGallery[index]) {
                    settings.primaryCaregiver.photoGallery[index].caption = caption;
                }
            } else if (gallery === 'additionalCaregiver') {
                const cgIndex = parseInt(e.target.dataset.cgIndex);
                if (settings.additionalCaregivers[cgIndex] && settings.additionalCaregivers[cgIndex].photoGallery[index]) {
                    settings.additionalCaregivers[cgIndex].photoGallery[index].caption = caption;
                }
            }
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.gallery-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!confirm('Remove this photo from gallery?')) return;
            
            const gallery = e.target.dataset.gallery;
            const index = parseInt(e.target.dataset.index);
            
            if (gallery === 'patient') {
                settings.photoGallery.splice(index, 1);
                renderPatientGallery();
            } else if (gallery === 'primaryCaregiver') {
                settings.primaryCaregiver.photoGallery.splice(index, 1);
                renderCaregiverGalleries();
            } else if (gallery === 'additionalCaregiver') {
                const cgIndex = parseInt(e.target.dataset.cgIndex);
                settings.additionalCaregivers[cgIndex].photoGallery.splice(index, 1);
                renderCaregiverGalleries();
            }
        });
    });
}

function attachFlashcardCategoryListeners() {
    // Category name changes
    document.querySelectorAll('.category-name-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            const name = e.target.value.trim();
            if (name && settings.flashcards.categories[index]) {
                settings.flashcards.categories[index].name = name;
            }
        });
    });
    
    // Delete category
    document.querySelectorAll('.category-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (confirm('Delete this entire category and all its cards?')) {
                settings.flashcards.categories.splice(index, 1);
                renderFlashcardCategories();
            }
        });
    });
    
    // Add card to category
    document.querySelectorAll('.add-category-card-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const catIndex = parseInt(e.target.dataset.index);
            addCardToCategory(catIndex);
        });
    });
    
    // Card caption changes
    document.querySelectorAll('.category-card-caption-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const catIndex = parseInt(e.target.dataset.catIndex);
            const cardIndex = parseInt(e.target.dataset.cardIndex);
            const caption = e.target.value.trim();
            
            if (settings.flashcards.categories[catIndex] && settings.flashcards.categories[catIndex].cards[cardIndex]) {
                settings.flashcards.categories[catIndex].cards[cardIndex].caption = caption;
            }
        });
    });
    
    // Remove card
    document.querySelectorAll('.category-card-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!confirm('Remove this card?')) return;
            
            const catIndex = parseInt(e.target.dataset.catIndex);
            const cardIndex = parseInt(e.target.dataset.cardIndex);
            
            settings.flashcards.categories[catIndex].cards.splice(cardIndex, 1);
            renderFlashcardCategories();
        });
    });
}

function addPhotoToGallery(galleryType, cgIndex = null) {
    const caption = prompt('Enter caption for this photo:');
    if (!caption || !caption.trim()) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Photo too large. Please use under 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const photoData = {
                    image: event.target.result,
                    caption: caption.trim()
                };
                
                if (galleryType === 'patient') {
                    if (!settings.photoGallery) settings.photoGallery = [];
                    settings.photoGallery.push(photoData);
                    renderPatientGallery();
                } else if (galleryType === 'primaryCaregiver') {
                    if (!settings.primaryCaregiver.photoGallery) settings.primaryCaregiver.photoGallery = [];
                    settings.primaryCaregiver.photoGallery.push(photoData);
                    renderCaregiverGalleries();
                } else if (galleryType === 'additionalCaregiver') {
                    if (!settings.additionalCaregivers[cgIndex].photoGallery) {
                        settings.additionalCaregivers[cgIndex].photoGallery = [];
                    }
                    settings.additionalCaregivers[cgIndex].photoGallery.push(photoData);
                    renderCaregiverGalleries();
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function addCardToCategory(catIndex) {
    const caption = prompt('Enter caption for this card:');
    if (!caption || !caption.trim()) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Photo too large. Please use under 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const cardData = {
                    image: event.target.result,
                    caption: caption.trim()
                };
                
                if (!settings.flashcards.categories[catIndex].cards) {
                    settings.flashcards.categories[catIndex].cards = [];
                }
                settings.flashcards.categories[catIndex].cards.push(cardData);
                renderFlashcardCategories();
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Export function for use in settings-ui.js
if (typeof window !== 'undefined') {
    window.renderFlashcardsTab = renderFlashcardsTab;
}
