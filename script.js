// ===== KONFIGURASI DASAR =====
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only handle actual anchor links
        if (href === '#' || !href.startsWith('#')) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== NAVIGASI =====
// Add scroll event listener for navbar
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// ===== MENU MOBILE =====
// Mobile menu functionality
const createMobileMenu = () => {
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger');
    hamburger.setAttribute('aria-label', 'Menu');
    hamburger.innerHTML = '<span class="bar"></span>';
    
    const nav = document.querySelector('nav');
    nav.appendChild(hamburger);

    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;
    let scrollPosition = 0;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        
        // Toggle classes
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        if (isMenuOpen) {
            // Store scroll position and lock body
            scrollPosition = window.pageYOffset;
            document.body.classList.add('menu-open');
            document.body.style.top = `-${scrollPosition}px`;
            
            // Animate menu items
            const links = navLinks.querySelectorAll('li');
            links.forEach((link, index) => {
                link.style.transitionDelay = `${0.2 + index * 0.1}s`;
            });
        } else {
            // Restore scroll position and unlock body
            document.body.classList.remove('menu-open');
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);
            
            // Reset transitions
            const links = navLinks.querySelectorAll('li');
            links.forEach(link => {
                link.style.transitionDelay = '0s';
            });
        }
    };

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;

        // First close the menu
        if (isMenuOpen) {
            toggleMenu();
        }

        // Wait for menu close animation
        setTimeout(() => {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }, 300); // Match this with your menu transition time
    };

    // Event Listeners
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Update the click handler for menu links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                scrollToSection(e, href);
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !nav.contains(e.target)) {
            toggleMenu();
        }
    });
};

// Mobile menu initialized in consolidated DOMContentLoaded below

// ===== EFEK PARALLAX =====
// Update the Scroll Animation Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add show class when element enters viewport
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            // Remove show class when element leaves viewport
            entry.target.classList.remove('show');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '-50px'  // Adds a small buffer before animation triggers
});

// Add hidden class to all elements we want to animate
document.querySelectorAll('.project-card, .service-card, .about-content, .experience, .hero-content h1, .hero-content h2, .hero-content h3, .hero-description, .social-links, .work h2, .services h2, .about h2, .contact h2').forEach(element => {
    element.classList.add('hidden');
    observer.observe(element);
});

// Add stagger effect for grid children
document.querySelectorAll('.projects-grid, .services-grid').forEach(grid => {
    observer.observe(grid);
    grid.querySelectorAll('.project-card, .service-card').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Animate numbers in experience section
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Trigger number animation when experience section is in view
const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.exp-item h4').forEach(counter => {
                const target = parseInt(counter.textContent);
                animateValue(counter, 0, target, 2000);
            });
            experienceObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

const experienceSection = document.querySelector('.experience');
if (experienceSection) {
    experienceObserver.observe(experienceSection);
}

// ===== ANIMASI NAVBAR =====
// Efek parallax untuk bagian hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    hero.style.transform = `translateY(${scrolled * 0.4}px)`;
});

// Mengatur tampilan navbar saat scroll naik/turun
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// ===== LOADING SCREEN =====
// Fungsi untuk menampilkan loading screen
const initLoadingScreen = () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const helloText = document.querySelector('.hello-text');
    const progressBar = document.querySelector('.loading-progress');
    
    // Simple hello text
    helloText.textContent = 'Hello!';
    
    // Progress bar animation
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                initializePageAnimations();
            }, 500);
        }
    }, 20);
};

// Menambahkan style untuk loading screen
const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            visibility: visible;
            opacity: 1;
            transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
        }

        .loading-content {
            text-align: center;
        }

        .hello-text {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #333;
            font-weight: 500;
            opacity: 0;
            animation: fadeIn 0.5s ease-out forwards;
        }

        .loading-progress {
            width: 0;
            height: 3px;
            background: #333;
            transition: width 0.2s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
};

// Loading screen initialized in consolidated DOMContentLoaded below

// ===== GALERI PROYEK =====
// Inisialisasi dan konfigurasi galeri
const initGallery = () => {
    // Cek keberadaan elemen modal
    const modal = document.querySelector('.gallery-modal');
    if (!modal) return; // Exit if modal doesn't exist

    const closeBtn = modal.querySelector('.close-gallery');
    const mainImage = modal.querySelector('.gallery-image img');
    const title = modal.querySelector('.gallery-header h3');
    const description = modal.querySelector('.gallery-description');
    const thumbnailsContainer = modal.querySelector('.gallery-thumbnails');
    const prevBtn = modal.querySelector('.prev');
    const nextBtn = modal.querySelector('.next');
    const content = modal.querySelector('.gallery-content');

    // Data proyek galeri
    // Bisa disesuaikan dengan menambah/mengubah data di sini
    const galleryData = {
        'cotton:on': {
            title: 'Cotton:On',
            subcategories: {
                'All': [
                    'images/cottonon/window/1.avif',
                    'images/cottonon/window/2.avif',
                    'images/cottonon/window/3.avif',
                    'images/cottonon/sale/1.avif',
                    'images/cottonon/sale/2.avif',
                    'images/cottonon/ladies/1.avif',
                    'images/cottonon/ladies/2.avif',
                    'images/cottonon/ladies/3.avif',
                    'images/cottonon/mens/1.avif',
                    'images/cottonon/mens/2.avif',
                    'images/cottonon/mens/3.avif',
                    'images/cottonon/rubi/1.avif',
                    'images/cottonon/rubi/2.avif',
                    'images/cottonon/rubi/3.avif'
                ],
                'Window': [
                    'images/cottonon/window/1.avif',
                    'images/cottonon/window/2.avif',
                    'images/cottonon/window/3.avif'
                ],
                'Sale': [
                    'images/cottonon/sale/1.avif',
                    'images/cottonon/sale/2.avif'
                ],
                'Ladies': [
                    'images/cottonon/ladies/1.avif',
                    'images/cottonon/ladies/2.avif',
                    'images/cottonon/ladies/3.avif'
                ],
                'Mens': [
                    'images/cottonon/mens/1.avif',
                    'images/cottonon/mens/2.avif',
                    'images/cottonon/mens/3.avif'
                ],
                'Rubi': [
                    'images/cottonon/rubi/1.avif',
                    'images/cottonon/rubi/2.avif',
                    'images/cottonon/rubi/3.avif'
                ]
            },
            images: []
        },
        'flyingtiger': {
            title: 'Flying Tiger',
            subcategories: {
                'All': [
                    'images/flyingtiger/overview/1.avif',
                    'images/flyingtiger/overview/2.avif',
                    'images/flyingtiger/overview/3.avif',
                    'images/flyingtiger/overview/4.avif',
                    'images/flyingtiger/cashier/1.avif',
                    'images/flyingtiger/cashier/2.avif',
                    'images/flyingtiger/cashier/3.avif',
                    'images/flyingtiger/window/1.avif',
                    'images/flyingtiger/window/2.avif',
                    'images/flyingtiger/window/3.avif',
                    'images/flyingtiger/table/1.jpg',
                    'images/flyingtiger/table/2.jpg',
                    'images/flyingtiger/table/3.jpg',
                    'images/flyingtiger/table/4.jpg',
                    'images/flyingtiger/table/5.jpg',
                    'images/flyingtiger/table/6.jpg',
                    'images/flyingtiger/table/7.jpg',
                    'images/flyingtiger/table/8.jpg',
                    'images/flyingtiger/table/9.jpg',
                    'images/flyingtiger/table/10.jpg',
                    'images/flyingtiger/table/11.jpg',
                    'images/flyingtiger/table/12.jpg',
                    'images/flyingtiger/table/13.jpg',
                    'images/flyingtiger/table/14.jpg',
                    'images/flyingtiger/table/15.jpg',
                    'images/flyingtiger/table/16.jpg',
                    'images/flyingtiger/table/17.jpg',
                    'images/flyingtiger/wall/1.avif',
                    'images/flyingtiger/wall/2.avif',
                    'images/flyingtiger/wall/3.avif',
                    'images/flyingtiger/wall/4.avif',
                    'images/flyingtiger/poster/1.avif',
                    'images/flyingtiger/poster/2.avif',
                    'images/flyingtiger/poster/3.avif'
                ],
                'Overview': [
                    'images/flyingtiger/overview/1.avif',
                    'images/flyingtiger/overview/2.avif',
                    'images/flyingtiger/overview/3.avif',
                    'images/flyingtiger/overview/4.avif'
                ],
                'Cashier': [
                    'images/flyingtiger/cashier/1.avif',
                    'images/flyingtiger/cashier/2.avif',
                    'images/flyingtiger/cashier/3.avif'
                ],
                'Window': [
                    'images/flyingtiger/window/1.avif',
                    'images/flyingtiger/window/2.avif',
                    'images/flyingtiger/window/3.avif'
                ],
                'Table': [
                    'images/flyingtiger/table/1.jpg',
                    'images/flyingtiger/table/2.jpg',
                    'images/flyingtiger/table/3.jpg',
                    'images/flyingtiger/table/4.jpg',
                    'images/flyingtiger/table/5.jpg',
                    'images/flyingtiger/table/6.jpg',
                    'images/flyingtiger/table/7.jpg',
                    'images/flyingtiger/table/8.jpg',
                    'images/flyingtiger/table/9.jpg',
                    'images/flyingtiger/table/10.jpg',
                    'images/flyingtiger/table/11.jpg',
                    'images/flyingtiger/table/12.jpg',
                    'images/flyingtiger/table/13.jpg',
                    'images/flyingtiger/table/14.jpg',
                    'images/flyingtiger/table/15.jpg',
                    'images/flyingtiger/table/16.jpg',
                    'images/flyingtiger/table/17.jpg'
                ],
                'Wall': [
                    'images/flyingtiger/wall/1.avif',
                    'images/flyingtiger/wall/2.avif',
                    'images/flyingtiger/wall/3.avif',
                    'images/flyingtiger/wall/4.avif'
                ],
                'Poster': [
                    'images/flyingtiger/poster/1.avif',
                    'images/flyingtiger/poster/2.avif',
                    'images/flyingtiger/poster/3.avif'
                ]
            },
            images: []
        },
        'designs': {
            title: 'Designs',
            subcategories: {
                'All': [
                    'images/designs/1.avif',
                    'images/designs/2.avif',
                    'images/designs/3.avif',
                    'images/designs/4.avif',
                    'images/designs/5.avif',
                    'images/designs/6.avif'
                ]
            },
            images: []
        }
    };

    let currentProject = null;
    let currentImageIndex = 0;
    let currentSubcategory = 'All';

    // Fungsi untuk membuka galeri
    const openGallery = (projectId) => {
        if (!galleryData[projectId]) return;
        
        currentProject = projectId;
        currentSubcategory = 'All';
        currentImageIndex = 0;
        
        // Set the active images from the All subcategory
        galleryData[currentProject].images = [...galleryData[currentProject].subcategories['All']];
        
        // Hide the main navbar
        const navbar = document.querySelector('nav');
        if (navbar) {
            navbar.style.display = 'none';
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Ensure the sidebar is visible in the layout
        const sidebarContainer = modal.querySelector('.gallery-sidebar');
        if (sidebarContainer) {
            sidebarContainer.style.display = 'flex';
        }
        
        updateGallery();
    };

    // Fungsi untuk menutup galeri
    const closeGallery = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Show the main navbar again
        const navbar = document.querySelector('nav');
        if (navbar) {
            navbar.style.display = '';
        }
        
        currentProject = null;
        currentImageIndex = 0;
        currentSubcategory = 'All';
    };

    // Fungsi untuk memperbarui konten galeri
    const updateGallery = () => {
        if (!currentProject || !galleryData[currentProject]) return;
        
        const data = galleryData[currentProject];
        
        // Add loading state
        mainImage.classList.add('loading');
        mainImage.style.opacity = '0';
        
        // Preload image
        const img = new Image();
        img.src = data.images[currentImageIndex];
        img.onload = () => {
            mainImage.src = data.images[currentImageIndex];
            mainImage.style.opacity = '1';
            mainImage.classList.remove('loading');
        };

        // Update text content
        title.textContent = data.title;
        description.textContent = data.description;

        // Update subcategories - fix the selector to find the subcategories container
        const subcategoriesContainer = modal.querySelector('.gallery-header .gallery-subcategories');
        subcategoriesContainer.innerHTML = Object.keys(data.subcategories).map(subcat => `
            <button class="subcategory-button ${subcat === currentSubcategory ? 'active' : ''}" 
                   data-subcategory="${subcat}">
                ${subcat}
            </button>
        `).join('');

        // Add click handlers to subcategory buttons
        subcategoriesContainer.querySelectorAll('.subcategory-button').forEach(button => {
            button.addEventListener('click', () => {
                const newSubcategory = button.dataset.subcategory;
                if (newSubcategory === currentSubcategory) return;
                
                currentSubcategory = newSubcategory;
                galleryData[currentProject].images = [...galleryData[currentProject].subcategories[currentSubcategory]];
                currentImageIndex = 0;
                updateGallery();
            });
        });

        // Update sidebar thumbnails
        const sidebarContainer = modal.querySelector('.gallery-sidebar');
        sidebarContainer.innerHTML = data.images.map((src, index) => `
            <div class="sidebar-thumbnail ${index === currentImageIndex ? 'active' : ''}" 
                 data-index="${index}">
                <img src="${src}" alt="Thumbnail ${index + 1}">
            </div>
        `).join('');

        // Add click handlers to sidebar thumbnails
        sidebarContainer.querySelectorAll('.sidebar-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const newIndex = parseInt(thumb.dataset.index);
                if (newIndex === currentImageIndex) return;
                currentImageIndex = newIndex;
                updateGallery();
            });
        });

        // Update bottom thumbnails (simplified since they're now hidden by CSS)
        thumbnailsContainer.innerHTML = '';
    };

    // ===== EVENT LISTENERS =====
    // Event untuk tombol-tombol navigasi
    document.querySelectorAll('.demo-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = link.closest('.project-card');
            if (!projectCard) return;
            
            const projectId = projectCard.dataset.project;
            openGallery(projectId);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeGallery);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGallery();
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!currentProject) return;
            currentImageIndex = (currentImageIndex - 1 + galleryData[currentProject].images.length) % galleryData[currentProject].images.length;
            updateGallery();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!currentProject) return;
            currentImageIndex = (currentImageIndex + 1) % galleryData[currentProject].images.length;
            updateGallery();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                prevBtn?.click();
                break;
            case 'ArrowRight':
                nextBtn?.click();
                break;
            case 'Escape':
                closeGallery();
                break;
        }
    });
};

// Gallery initialized in consolidated DOMContentLoaded below

// Theme Toggle Functionality
const initThemeToggle = () => {
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Optional: Add animation
        document.documentElement.style.setProperty('--transition-speed', '0.3s');
        setTimeout(() => {
            document.documentElement.style.setProperty('--transition-speed', '0s');
        }, 300);
    });
};

// Theme toggle initialized in consolidated DOMContentLoaded below

// ===== CONSOLIDATED INITIALIZATION =====
// Single DOMContentLoaded listener for better performance
document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    initLoadingScreen();
    createMobileMenu();
    initGallery();
    initThemeToggle();
});

// Function to initialize page animations
const initializePageAnimations = () => {
    // Animate hero section elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.opacity = '1';
            element.classList.add('show');
        }, 300 + (index * 200));
    });

    // Start observing elements for scroll animations
    const elementsToAnimate = document.querySelectorAll(
        '.project-card, .service-card, .about-content, .experience, ' +
        '.work h2, .services h2, .about h2, .contact h2'
    );
    
    elementsToAnimate.forEach(element => {
        element.classList.add('hidden');
        observer.observe(element);
    });

    // Add stagger effect for grid children
    document.querySelectorAll('.projects-grid, .services-grid').forEach(grid => {
        observer.observe(grid);
        grid.querySelectorAll('.project-card, .service-card').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}; 