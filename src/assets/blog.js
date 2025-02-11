async function loadBlogContent() {
    try {
        // Load latest blog first to get its title
        const latestBlog = await loadLatestBlog();
        // Load headlines with the latest blog title
        await loadHeadlines(latestBlog.title);
    } catch (error) {
        console.error("Error loading blog content:", error);
    }
}

async function loadBlogBySlug(slug) {
    try {
        const response = await fetch(`src/blog/${slug}.yaml`);
        const text = await response.text();
        const yamlData = jsyaml.load(text);
        
        renderBlog(yamlData);
        return yamlData; // Return the yaml data for the title
    } catch (error) {
        console.error(`Error loading blog ${slug}:`, error);
        return null;
    }
}

function updatePageTitle(title) {
    document.title = title;
}

function renderBlog(yamlData) {
    const contentHtml = processContent(yamlData.content);
    
    // Update page title to show current blog title
    updatePageTitle(yamlData.title);
    
    const blogContainer = document.getElementById("blog-container");
    // Clear existing content
    blogContainer.innerHTML = '';
    
    
    const blogContent = document.createElement('div');
    blogContent.className = 'latest-blog';
    blogContent.innerHTML = `
        ${yamlData.featured_image ? `
            <div class="blog-featured-image">
                <img src="${yamlData.featured_image}" alt="${yamlData.title}">
            </div>
        ` : ''}
        <article class="blog-post">
            <h1 class="blog-title">${yamlData.title}</h1>
            <div class="blog-meta">
                <time datetime="${yamlData.date}">${formatDate(yamlData.date)}</time>
            </div>
            <div class="blog-content">
                ${contentHtml}
            </div>
        </article>
    `;
    
    blogContainer.appendChild(blogContent);
}

function titleToSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove consecutive hyphens
        .split('-') // Split into words
        .slice(0, 3) // Take first three words
        .join('-'); // Join with hyphens
}




async function loadLatestBlog() {
    try {
        const response = await fetch("src/blog/latest.yaml");
        const text = await response.text();
        const yamlData = jsyaml.load(text);
        renderBlog(yamlData);
        return yamlData; // Return the yaml data for the title
    } catch (error) {
        console.error("Error loading latest blog:", error);
        return null;
    }
}

async function loadHeadlines(currentBlogTitle) {
    try {
        const response = await fetch("src/blog/headlines.yaml");
        const text = await response.text();
        const headlines = jsyaml.load(text);
        
        // Filter out the current blog, but handle undefined currentBlogTitle
        const filteredHeadlines = currentBlogTitle 
            ? headlines.filter(headline => headline.title !== currentBlogTitle)
            : headlines;
        
        const blogContainer = document.getElementById("blog-container");
        const headlinesSection = document.createElement('div');
        headlinesSection.className = 'blog-headlines';
        
        headlinesSection.innerHTML = `
        <div class="headlines-header">
            <h2>Recent Posts</h2>
            <button id="show-all-headlines" class="headlines-toggle">Show All</button>
        </div>
        <div class="headlines-grid">
            ${filteredHeadlines.slice(0, 3).map(headline => `
                <div class="headline-card" data-slug="${titleToSlug(headline.title)}">
                    <h3>${headline.title}</h3>
                    <time datetime="${headline.date}">${formatDate(headline.date)}</time>
                </div>
            `).join('')}
        </div>
        <div class="headlines-expanded" style="display: none;">
            ${filteredHeadlines.slice(3).map(headline => `
                <div class="headline-card" data-slug="${titleToSlug(headline.title)}">
                    <h3>${headline.title}</h3>
                    <time datetime="${headline.date}">${formatDate(headline.date)}</time>
                </div>
            `).join('')}
        </div>
    `;
    
    blogContainer.appendChild(headlinesSection);
    
        
    // Add toggle functionality
    const toggleButton = document.getElementById('show-all-headlines');
    const expandedHeadlines = document.querySelector('.headlines-expanded');
    
    toggleButton.addEventListener('click', () => {
        const isExpanded = expandedHeadlines.style.display !== 'none';
        expandedHeadlines.style.display = isExpanded ? 'none' : 'block';
        toggleButton.textContent = isExpanded ? 'Show All' : 'Show Less';
    });
    
    // Add click listeners to headline cards
    document.querySelectorAll('.headline-card').forEach(card => {
        card.addEventListener('click', async () => {
            const slug = card.dataset.slug;
            const blogData = await loadBlogBySlug(slug);
            if (blogData) {
                // Scroll to top of the page
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Reload headlines with new current blog
                await loadHeadlines(blogData.title);
            }
        });
    });
    
} catch (error) {
    console.error("Error loading headlines:", error);
}
}

function processContent(content) {
    // Split content into paragraphs
    return content
        .split('\n')
        .filter(line => line.trim() !== '') // Remove empty lines
        .map(paragraph => {
            // Handle images with captions
            if (paragraph.startsWith('![')) {
                const matches = paragraph.match(/!\[(.*?)\]\((.*?)\)(\s*\*(.*?)\*)?/);
                if (matches) {
                    const [_, alt, src, __, caption] = matches;
                    return `
                        <figure class="blog-image">
                            <img src="${src}" alt="${alt}">
                            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
                        </figure>
                    `;
                }
            }
            
            // Handle headers
            if (paragraph.startsWith('##')) {
                return `<h2>${paragraph.replace('##', '').trim()}</h2>`;
            }
            
            // Handle lists
            if (paragraph.startsWith('-')) {
                return `<ul>${paragraph.split('\n').map(item => 
                    `<li>${item.replace('-', '').trim()}</li>`
                ).join('')}</ul>`;
            }
            
            // Regular paragraphs
            return `<p>${paragraph}</p>`;
        })
        .join('\n');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

document.addEventListener("DOMContentLoaded", loadLatestBlog);
document.addEventListener("DOMContentLoaded", loadBlogContent);
