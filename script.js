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

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', createMobileMenu);

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

// Make sure loading screen is initialized properly
document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    initLoadingScreen();
});

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
            // description: 'Winter holiday window display featuring an enchanting wonderland theme. Created a magical retail experience that increased foot traffic by 45% during the holiday season.',
            subcategories: {
                'All': [
                    'https://i.imgur.com/uKEhiwW.jpeg', //overview
                    'https://i.imgur.com/C3DXy8t.jpeg',
                    'https://i.imgur.com/B2oZMNk.jpeg',
                    'https://i.imgur.com/EQlShAa.jpeg', //sale
                    'https://i.imgur.com/y3gC4RS.jpeg',
                    'https://i.imgur.com/GyFw4yT.jpeg', //ladies
                    'https://i.imgur.com/asoqE46.jpeg',
                    'https://i.imgur.com/Ta4P9Gu.jpeg',
                    'https://i.imgur.com/XPKG4Ig.jpeg', //mens
                    'https://i.imgur.com/4h76kOT.jpeg',
                    'https://i.imgur.com/2yWdaAW.jpeg',
                    'https://i.imgur.com/SwAG4zX.jpeg', //rubi
                    'https://i.imgur.com/m5csiqy.jpeg',
                    'https://i.imgur.com/9WPqRVB.jpeg'
                ],
                'Window': [
                    'https://i.imgur.com/uKEhiwW.jpeg',
                    'https://i.imgur.com/C3DXy8t.jpeg',
                    'https://i.imgur.com/B2oZMNk.jpeg'
                ],
                'Sale': [
                    'https://i.imgur.com/EQlShAa.jpeg',
                    'https://i.imgur.com/y3gC4RS.jpeg'
                ],
                'Ladies': [
                    'https://i.imgur.com/GyFw4yT.jpeg',
                    'https://i.imgur.com/asoqE46.jpeg',
                    'https://i.imgur.com/Ta4P9Gu.jpeg'
                ],
                'Mens': [
                    'https://i.imgur.com/XPKG4Ig.jpeg',
                    'https://i.imgur.com/4h76kOT.jpeg',
                    'https://i.imgur.com/2yWdaAW.jpeg'
                ],
                'Rubi': [
                    'https://i.imgur.com/SwAG4zX.jpeg',
                    'https://i.imgur.com/m5csiqy.jpeg',
                    'https://i.imgur.com/9WPqRVB.jpeg'
                ]
            },
            images: []  // This will be populated dynamically
        },
        'flyingtiger': {
            title: 'Flying Tiger',
            // description: 'Complete redesign of the luxury fashion floor with modern minimalist concept. Implemented strategic layout changes that resulted in 60% increase in sales.',
            subcategories: {
                'All': [
                    'https://i.imgur.com/2c7KUea.jpeg', //overview
                    'https://i.imgur.com/sZ1QfrV.jpeg',
                    'https://i.imgur.com/ZwIKZTr.jpeg',
                    'https://i.imgur.com/JDzxRRY.jpeg', //cashier
                    'https://i.imgur.com/aRAMLsa.jpeg', //window
                    'https://i.imgur.com/3iQcoKD.jpeg',
                    'https://i.imgur.com/3Md1M2f.jpeg',
                    'https://i.imgur.com/0qSP0lB.jpeg', //table
                    'https://i.imgur.com/j6YwdF0.jpeg',
                    'https://i.imgur.com/rd3H1Yq.jpeg',
                    'https://i.imgur.com/GkTizAx.jpeg',
                    'https://i.imgur.com/62Y8SJh.jpeg',
                    'https://i.imgur.com/AkC2fFS.jpeg',
                    'https://i.imgur.com/wT6IB2l.jpeg',
                    'https://i.imgur.com/gzDUS8d.jpeg',
                    'https://i.imgur.com/us36msk.jpeg', //wall
                    'https://i.imgur.com/7IF1qSL.jpeg',
                    'https://i.imgur.com/ASLWID2.jpeg', //poster
                    'https://i.imgur.com/qT12uRJ.jpeg'
                ],
                'Overview': [
                    'https://i.imgur.com/2c7KUea.jpeg',
                    'https://i.imgur.com/sZ1QfrV.jpeg',
                    'https://i.imgur.com/ZwIKZTr.jpeg'
                ],
                'Cashier': [
                    'https://i.imgur.com/JDzxRRY.jpeg'
                ],
                'Window': [
                    'https://i.imgur.com/aRAMLsa.jpeg',
                    'https://i.imgur.com/3iQcoKD.jpeg',
                    'https://i.imgur.com/3Md1M2f.jpeg'
                ],
                'Table': [
                    'https://i.imgur.com/0qSP0lB.jpeg',
                    'https://i.imgur.com/j6YwdF0.jpeg',
                    'https://i.imgur.com/rd3H1Yq.jpeg',
                    'https://i.imgur.com/GkTizAx.jpeg',
                    'https://i.imgur.com/62Y8SJh.jpeg',
                    'https://i.imgur.com/AkC2fFS.jpeg',
                    'https://i.imgur.com/wT6IB2l.jpeg',
                    'https://i.imgur.com/gzDUS8d.jpeg'
                ],
                'Wall': [
                    'https://i.imgur.com/us36msk.jpeg',
                    'https://i.imgur.com/7IF1qSL.jpeg'
                ],
                'Poster': [
                    'https://i.imgur.com/ASLWID2.jpeg',
                    'https://i.imgur.com/qT12uRJ.jpeg'
                ]
            },
            images: [] // This will be populated dynamically
        },
        'designs': {
            title: 'Designs',
            // description: 'Complete redesign of the luxury fashion floor with modern minimalist concept. Implemented strategic layout changes that resulted in 60% increase in sales.',
            subcategories: {
                'All': [
                    'https://i.imgur.com/peO4Kqn.png',
                    'https://i.imgur.com/ODk6NJb.png',
                    'https://i.imgur.com/iYQUCjk.png',
                    'https://i.imgur.com/WOgCqTU.png',
                    'https://i.imgur.com/ef1ejUW.jpeg'
                ],
                'Graphics': [
                    'https://i.imgur.com/peO4Kqn.png',
                    'https://i.imgur.com/ODk6NJb.png'
                ],
                'Illustrations': [
                    'https://i.imgur.com/iYQUCjk.png',
                    'https://i.imgur.com/WOgCqTU.png',
                    'https://i.imgur.com/ef1ejUW.jpeg'
                ]
            },
            images: [] // This will be populated dynamically
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

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
});

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

// Initialize theme toggle
document.addEventListener('DOMContentLoaded', () => {
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