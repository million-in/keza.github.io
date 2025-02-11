document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            tab.classList.add('active');
            const targetId = tab.id.replace('tab-', '');
            document.getElementById(`${targetId}-section`).classList.add('active');
            
            // Update page title based on active tab
            if (targetId === 'me') {
                document.title = 'Keza';
            }
            // For blog tab, only update title if there's a current blog loaded
            else if (targetId === 'blog') {
                const blogTitle = document.querySelector('.blog-title');
                if (blogTitle) {
                    document.title = blogTitle.textContent;
                } else {
                    document.title = 'Blog';
                }
            }
        });
    });
});

