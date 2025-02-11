async function loadMe() {
    try {
        const response = await fetch("/src/me.yaml");
        const text = await response.text();
        const yamlData = jsyaml.load(text);
        
        const container = document.getElementById("me-container");
        container.className = "profile-container";
        
        // Main profile section
        const profileSection = document.createElement("div");
        profileSection.className = "profile-header";
        profileSection.innerHTML = `
            <div class="profile-image-container">
                <img src="${yamlData.image}" alt="Profile Image" class="profile-image">
                <div class="profile-image-backdrop"></div>
            </div>
            <h1 class="profile-name">${yamlData.name}</h1>
            <p class="profile-bio">${yamlData.bio}</p>
        `;
        
        // Personal philosophy section with animated reveals
        const philosophySection = document.createElement("div");
        philosophySection.className = "philosophy-section";
        philosophySection.innerHTML = `
            <h2>Personal Philosophy</h2>
            <div class="philosophy-grid">
                ${yamlData.personal_philosophy.map((philosophy, index) => `
                    <div class="philosophy-card" style="animation-delay: ${index * 0.1}s">
                        <p>${philosophy}</p>
                    </div>
                `).join('')}
            </div>
        `;

        // Interactive hobbies explorer
const hobbiesSection = document.createElement("div");
hobbiesSection.className = "hobbies-section";
hobbiesSection.innerHTML = `
    <h2>Hobbies & Interests</h2>
    <div class="hobbies-tabs">
        ${Object.keys(yamlData.hobbies).map(category => `
            <button class="hobby-tab" data-category="${category}">
                ${category.replace('_', ' ').toUpperCase()}
            </button>
        `).join('')}
    </div>
    <div class="hobby-contents">
        ${Object.entries(yamlData.hobbies).map(([category, items]) => `
            <div class="hobby-content" data-category="${category}">
                <div class="hobby-grid">
                    ${items.map(hobby => `
                        <div class="hobby-card">
                            <p>${hobby}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    </div>
`;


        // Current explorations with progress indicators
        const explorationsSection = document.createElement("div");
        explorationsSection.className = "explorations-section";
        explorationsSection.innerHTML = `
            <h2>Current Explorations</h2>
            <div class="explorations-grid">
                ${yamlData.current_explorations.map((exploration, index) => `
                    <div class="exploration-card">
                        <p>${exploration}</p>
                        <div class="exploration-progress">
                            <div class="progress-bar" style="width: ${Math.random() * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Reading interests with dynamic book stack visualization
        const readingSection = document.createElement("div");
        readingSection.className = "reading-section";
        readingSection.innerHTML = `
            <h2>Reading Interests</h2>
            <div class="book-stack">
                ${yamlData.reading_interests.map((interest, index) => `
                    <div class="book" style="transform: translateY(${index * -10}px) rotate(${Math.random() * 5 - 2.5}deg)">
                        <p>${interest}</p>
                    </div>
                `).join('')}
            </div>
        `;

        // Append all sections
        container.appendChild(profileSection);
        container.appendChild(philosophySection);
        container.appendChild(hobbiesSection);
        container.appendChild(explorationsSection);
        container.appendChild(readingSection);

        // Initialize interactive features
        initializeHobbyTabs();
        initializeAnimations();
        
        
    } catch (error) {
        console.error("Error loading me.yaml:", error);
    }
}

function initializeHobbyTabs() {
    const tabs = document.querySelectorAll('.hobby-tab');
    const contents = document.querySelectorAll('.hobby-content');
    
    // Hide all content sections initially
    contents.forEach(content => {
        content.style.display = 'none';
    });
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });

            // Add active class to clicked tab and show corresponding content
            tab.classList.add('active');
            const activeContent = document.querySelector(`.hobby-content[data-category="${category}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
                activeContent.style.display = 'block';
            }
        });
    });
    
    // Activate first tab by default
    if (tabs[0]) {
        tabs[0].click();
    }
}
            

function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.philosophy-card, .hobby-card, .exploration-card, .book').forEach(el => {
        observer.observe(el);
    });
}



document.addEventListener("DOMContentLoaded", loadMe);

