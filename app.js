/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC
   Author: Shri Shivanesh S R
   Year: 2026
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Mobile Menu Toggle
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                navToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // ==========================================================================
    // 2. Active Link Highlighter on Scroll & Navbar Sticky
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Navbar styling
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section highlighting
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= (secTop - 150)) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 3. Typing Effect
    // ==========================================================================
    const typingTextElement = document.getElementById('typing-text');
    const roles = [
        "Software Developer (Fresher)",
        "Full-Stack Web Developer",
        "IoT & Automation Enthusiast"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typingTextElement) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before starting next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing
    setTimeout(typeEffect, 1000);

    // ==========================================================================
    // 4. Scroll Reveal (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Read delay if present
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // 5. 3D Card Hover Tilt & Mouse Glow Effect
    // ==========================================================================
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        // Track mouse position on hover for glowing background spotlight
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Apply 3D rotation tilt
            const width = rect.width;
            const height = rect.height;
            const centerX = width / 2;
            const centerY = height / 2;
            
            // Calculate tilt angle (max 10 degrees)
            const rotateX = ((centerY - y) / centerY) * 8; // Tilt up/down
            const rotateY = ((x - centerX) / centerX) * 8; // Tilt left/right
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Reset positions on leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        // Re-enable smooth transition when entering
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // ==========================================================================
    // 6. Q&A Accordion
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // ==========================================================================
    // 7. Interactive 3D Canvas Skills Tag Cloud (Sphere)
    // ==========================================================================
    const skillCanvas = document.getElementById('skill-sphere-canvas');
    if (skillCanvas) {
        const ctx = skillCanvas.getContext('2d');
        const tags = [
            "React JS", "Node JS", "JavaScript", "Java", 
            "Firebase", "MySQL", "Git", "GitHub", 
            "HTML5", "CSS3", "REST API", "SDLC", 
            "OOP", "IoT", "Sensors", "Embedded C"
        ];
        
        let sphereRad = 180;
        let tagsArray = [];
        let mousePos = { x: 0, y: 0 };
        let activeRotation = { x: 0.003, y: -0.003 };
        let isDragging = false;
        let startMousePos = { x: 0, y: 0 };

        // Tag Object definition
        class Tag {
            constructor(text, x, y, z) {
                this.text = text;
                this.x = x;
                this.y = y;
                this.z = z;
                // Generate a randomized harmonious color for each tag
                const colors = ['#00f3ff', '#8e2de2', '#ff007f', '#a855f7', '#38bdf8', '#fb7185'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            // Project 3D coordinates onto 2D viewport
            project() {
                const depth = 400; // Camera distance
                const scale = depth / (depth + this.z); // Perspective division scale
                
                // Canvas coordinate center offset
                const projX = (this.x * scale) + (skillCanvas.width / 2);
                const projY = (this.y * scale) + (skillCanvas.height / 2);
                const opacity = (200 - this.z) / 300; // Fade tags at the back

                return {
                    x: projX,
                    y: projY,
                    scale: scale,
                    opacity: Math.max(0.15, Math.min(1.0, opacity))
                };
            }

            // Apply 3D rotations based on coordinate trigonometry
            rotateX(angle) {
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const y1 = this.y * cos - this.z * sin;
                const z1 = this.z * cos + this.y * sin;
                this.y = y1;
                this.z = z1;
            }

            rotateY(angle) {
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const x1 = this.x * cos - this.z * sin;
                const z1 = this.z * cos + this.x * sin;
                this.x = x1;
                this.z = z1;
            }
        }

        // Initialize tags distributed evenly in a golden-ratio Fibonacci spiral
        function initTags() {
            const count = tags.length;
            for (let i = 0; i < count; i++) {
                const phi = Math.acos(-1 + (2 * i) / count);
                const theta = Math.sqrt(count * Math.PI) * phi;
                
                const x = sphereRad * Math.sin(phi) * Math.cos(theta);
                const y = sphereRad * Math.sin(phi) * Math.sin(theta);
                const z = sphereRad * Math.cos(phi);
                
                tagsArray.push(new Tag(tags[i], x, y, z));
            }
        }

        initTags();

        // Main Animation Loop
        function animateTags() {
            ctx.clearRect(0, 0, skillCanvas.width, skillCanvas.height);
            
            // Draw background decorative orbits
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(skillCanvas.width/2, skillCanvas.height/2, sphereRad, 0, Math.PI * 2);
            ctx.stroke();

            // Sort tags by Z (depth) so front tags paint on top of back tags (painter's algorithm)
            tagsArray.sort((a, b) => b.z - a.z);

            tagsArray.forEach(tag => {
                // Apply rotation
                tag.rotateX(activeRotation.x);
                tag.rotateY(activeRotation.y);

                // Project
                const p = tag.project();

                // Style tag text
                ctx.save();
                ctx.fillStyle = tag.color;
                ctx.globalAlpha = p.opacity;
                
                // Adjust font size based on perspective scale
                const baseSize = 14;
                const finalSize = Math.round(baseSize * p.scale * 1.1);
                ctx.font = `bold ${finalSize}px 'Outfit', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Draw text shadow glow for items near the front
                if (tag.z < 0) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = tag.color;
                }
                
                ctx.fillText(tag.text, p.x, p.y);
                ctx.restore();
            });

            // Dampen active rotation speeds slowly back to default base speeds
            if (!isDragging) {
                activeRotation.x += (0.001 - activeRotation.x) * 0.05;
                activeRotation.y += (-0.001 - activeRotation.y) * 0.05;
            }

            requestAnimationFrame(animateTags);
        }

        // Initialize drag interaction listeners
        skillCanvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = skillCanvas.getBoundingClientRect();
            startMousePos.x = e.clientX - rect.left;
            startMousePos.y = e.clientY - rect.top;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = skillCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Speed factor
            const dx = mouseX - startMousePos.x;
            const dy = mouseY - startMousePos.y;
            
            // Adjust rotation vector proportional to delta movement
            activeRotation.y = dx * 0.00015;
            activeRotation.x = -dy * 0.00015;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Touch supports
        skillCanvas.addEventListener('touchstart', (e) => {
            isDragging = true;
            const rect = skillCanvas.getBoundingClientRect();
            startMousePos.x = e.touches[0].clientX - rect.left;
            startMousePos.y = e.touches[0].clientY - rect.top;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const rect = skillCanvas.getBoundingClientRect();
            const mouseX = e.touches[0].clientX - rect.left;
            const mouseY = e.touches[0].clientY - rect.top;
            
            const dx = mouseX - startMousePos.x;
            const dy = mouseY - startMousePos.y;
            
            activeRotation.y = dx * 0.00015;
            activeRotation.x = -dy * 0.00015;
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Run Tag sphere
        animateTags();
    }

    // ==========================================================================
    // 8. Background Customizer Widget & Theme Loader
    // ==========================================================================
    const customizerToggle = document.getElementById('customizer-toggle');
    const customizerWidget = document.getElementById('customizer-widget');
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    const bgCanvasElement = document.getElementById('bg-canvas');
    const videoBgContainer = document.getElementById('video-bg-container');
    const keyboardBgContainer = document.getElementById('keyboard-bg-container');
    const bgVideo = document.getElementById('bg-video');
    const videoSoundControl = document.getElementById('video-sound-control');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    
    let activeBgTheme = 'keyboard'; // Default

    if (customizerToggle && customizerWidget) {
        customizerToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            customizerWidget.classList.toggle('active');
        });

        // Close customizer clicking outside
        document.addEventListener('click', () => {
            customizerWidget.classList.remove('active');
        });

        // Stop click bubble inside the panel
        customizerWidget.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Change background themes
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTheme = btn.getAttribute('data-theme');
            
            // Update active btn state
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            applyBgTheme(targetTheme);
        });
    });

    function applyBgTheme(theme) {
        activeBgTheme = theme;
        
        if (theme === 'keyboard') {
            // Render keyboard image, overlay subtle 3D mesh dots in background
            if (keyboardBgContainer) keyboardBgContainer.classList.add('active');
            bgCanvasElement.style.opacity = '0.12'; 
            videoBgContainer.style.opacity = '0';
            videoSoundControl.style.display = 'none';
            if (bgVideo) bgVideo.pause();
        }
        else if (theme === '3d-particles') {
            // Render 3D Canvas, hide keyboard and video
            if (keyboardBgContainer) keyboardBgContainer.classList.remove('active');
            bgCanvasElement.style.opacity = '1';
            videoBgContainer.style.opacity = '0';
            videoSoundControl.style.display = 'none';
            if (bgVideo) bgVideo.pause();
        } 
        else if (theme === 'video') {
            // Hide keyboard, render video
            if (keyboardBgContainer) keyboardBgContainer.classList.remove('active');
            bgCanvasElement.style.opacity = '0.15';
            videoBgContainer.style.opacity = '0.4';
            videoSoundControl.style.display = 'block';
            if (bgVideo) {
                bgVideo.play().catch(err => console.log("Auto playback prevented:", err));
            }
        } 
        else if (theme === 'neon') {
            // Hide all backgrounds, solid gradient
            if (keyboardBgContainer) keyboardBgContainer.classList.remove('active');
            bgCanvasElement.style.opacity = '0';
            videoBgContainer.style.opacity = '0';
            videoSoundControl.style.display = 'none';
            if (bgVideo) bgVideo.pause();
        }
    }

    // Sound toggle control for video
    if (soundToggleBtn && bgVideo) {
        soundToggleBtn.addEventListener('click', () => {
            bgVideo.muted = !bgVideo.muted;
            if (bgVideo.muted) {
                soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Muted';
                soundToggleBtn.classList.remove('active');
            } else {
                soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
                soundToggleBtn.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // 8a. Scroll Parallax & Mouse displacement loop for Keyboard image
    // ==========================================================================
    let currentMouseX = 0;
    let currentMouseY = 0;
    let targetDisplaceX = 0;
    let targetDisplaceY = 0;

    window.addEventListener('mousemove', (e) => {
        currentMouseX = (e.clientX / window.innerWidth) - 0.5;
        currentMouseY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    function updateParallaxBackground() {
        if (activeBgTheme === 'keyboard' && keyboardBgContainer) {
            // Interpolate mouse coordinates (lerp)
            targetDisplaceX += (currentMouseX - targetDisplaceX) * 0.08;
            targetDisplaceY += (currentMouseY - targetDisplaceY) * 0.08;

            // Mouse displacement offset (pushes opposite direction)
            const mouseShiftX = targetDisplaceX * -25;
            const mouseShiftY = targetDisplaceY * -25;

            // Execute 3D hardware-accelerated translation (fixed scroll, mouse only)
            keyboardBgContainer.style.transform = `translate3d(${mouseShiftX}px, ${mouseShiftY}px, 0)`;
        }
        requestAnimationFrame(updateParallaxBackground);
    }
    
    // Start parallax loop
    updateParallaxBackground();

    // ==========================================================================
    // 9. Three.js 3D Interactive Background (Particle Mesh Wave)
    // ==========================================================================
    let threeRenderer, threeScene, threeCamera, particleGridPoints;
    let particleCount = 1200;
    let particlePositions = [];
    let mouse3D = { x: 0, y: 0 };
    let targetMouse3D = { x: 0, y: 0 };
    let clock = new THREE.Clock();

    function initThreeJSBackground() {
        if (!bgCanvasElement) return;

        // Scene
        threeScene = new THREE.Scene();

        // Camera
        threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        threeCamera.position.z = 100;
        threeCamera.position.y = 45;
        threeCamera.rotation.x = -Math.PI / 6;

        // Renderer
        threeRenderer = new THREE.WebGLRenderer({
            canvas: bgCanvasElement,
            alpha: true,
            antialias: true
        });
        threeRenderer.setSize(window.innerWidth, window.innerHeight);
        threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create wave coordinates
        const width = 160;
        const height = 160;
        const columns = 40;
        const rows = 40;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(columns * rows * 3);
        const colors = new Float32Array(columns * rows * 3);

        const color1 = new THREE.Color('#988686'); // Custom Mauve
        const color2 = new THREE.Color('#5c4e4e'); // Custom Taupe

        let index = 0;
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                // Centered grids
                const x = (i - columns / 2) * (width / columns);
                const z = (j - rows / 2) * (height / rows);
                const y = 0;

                positions[index] = x;
                positions[index + 1] = y;
                positions[index + 2] = z;

                // Color interpolation based on position
                const ratio = i / columns;
                const blendedColor = color1.clone().lerp(color2, ratio);
                colors[index] = blendedColor.r;
                colors[index + 1] = blendedColor.g;
                colors[index + 2] = blendedColor.b;

                index += 3;
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create texture sprite
        const canvasSprite = document.createElement('canvas');
        canvasSprite.width = 16;
        canvasSprite.height = 16;
        const ctxSprite = canvasSprite.getContext('2d');
        const grad = ctxSprite.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctxSprite.fillStyle = grad;
        ctxSprite.fillRect(0, 0, 16, 16);
        const texture = new THREE.CanvasTexture(canvasSprite);

        // Material setup
        const material = new THREE.PointsMaterial({
            size: 2.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.65,
            map: texture,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Combine into points
        particleGridPoints = new THREE.Points(geometry, material);
        threeScene.add(particleGridPoints);

        // Render Loop
        function animateThreeJS() {
            if (activeBgTheme === 'neon') {
                // Pause rendering pipeline if not visible for efficiency
                setTimeout(() => {
                    requestAnimationFrame(animateThreeJS);
                }, 200);
                return;
            }

            requestAnimationFrame(animateThreeJS);

            const elapsedTime = clock.getElapsedTime();
            const positionsArray = particleGridPoints.geometry.attributes.position.array;
            
            // Move camera mouse tracking smoothly
            targetMouse3D.x += (mouse3D.x - targetMouse3D.x) * 0.05;
            targetMouse3D.y += (mouse3D.y - targetMouse3D.y) * 0.05;
            
            threeCamera.position.x = targetMouse3D.x * 25;
            threeCamera.lookAt(new THREE.Vector3(0, 0, 0));

            // Wave deformation formula (sine/cosine math combo)
            let arrIdx = 0;
            for (let i = 0; i < columns; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = positionsArray[arrIdx];
                    const z = positionsArray[arrIdx + 2];
                    
                    // Wave calculation
                    positionsArray[arrIdx + 1] = 
                        Math.sin(x * 0.08 + elapsedTime) * 5 + 
                        Math.cos(z * 0.08 + elapsedTime) * 5;

                    arrIdx += 3;
                }
            }

            particleGridPoints.geometry.attributes.position.needsUpdate = true;
            threeRenderer.render(threeScene, threeCamera);
        }

        animateThreeJS();
    }

    // Capture mouse coordinate movements on window
    window.addEventListener('mousemove', (e) => {
        // Map to normal coordinate scales (-1 to +1)
        mouse3D.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse3D.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Resize viewport
    window.addEventListener('resize', () => {
        if (threeCamera && threeRenderer) {
            threeCamera.aspect = window.innerWidth / window.innerHeight;
            threeCamera.updateProjectionMatrix();
            threeRenderer.setSize(window.innerWidth, window.innerHeight);
        }
    });

    // Try loading Three.js particle waves
    try {
        initThreeJSBackground();
    } catch (e) {
        console.warn("Three.js initialization failure. Fallback to basic transitions.", e);
    }

    // Note: Old print listener removed. Replaced by Section 13 PDF Lightbox modal.

    // ==========================================================================
    // 11. Contact Form Submissions & Validations
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formAlert = document.getElementById('form-status-alert');

    if (contactForm && formSubmitBtn && formAlert) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear styling statuses
            formAlert.style.display = 'none';
            formAlert.className = 'form-status-alert';
            
            const nameField = document.getElementById('form-name');
            const emailField = document.getElementById('form-email');
            const subjectField = document.getElementById('form-subject');
            const messageField = document.getElementById('form-message');
            
            let isFormValid = true;

            // Name checks
            if (!nameField.value.trim()) {
                nameField.parentElement.classList.add('invalid');
                isFormValid = false;
            } else {
                nameField.parentElement.classList.remove('invalid');
            }

            // Email checks
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
                emailField.parentElement.classList.add('invalid');
                isFormValid = false;
            } else {
                emailField.parentElement.classList.remove('invalid');
            }

            // Subject checks
            if (!subjectField.value.trim()) {
                subjectField.parentElement.classList.add('invalid');
                isFormValid = false;
            } else {
                subjectField.parentElement.classList.remove('invalid');
            }

            // Message checks
            if (!messageField.value.trim()) {
                messageField.parentElement.classList.add('invalid');
                isFormValid = false;
            } else {
                messageField.parentElement.classList.remove('invalid');
            }

            if (!isFormValid) return;

            // Trigger visual spinner on loading button
            const btnText = formSubmitBtn.querySelector('.btn-text');
            const btnSpinner = formSubmitBtn.querySelector('.btn-loading-spinner');
            
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
            formSubmitBtn.disabled = true;

            // Simulate server dispatch delay
            setTimeout(() => {
                btnText.style.display = 'inline-block';
                btnSpinner.style.display = 'none';
                formSubmitBtn.disabled = false;

                // Set success message
                formAlert.classList.add('success');
                formAlert.innerHTML = '<i class="fas fa-check-circle"></i> Connection Request Simulated! Thank you, ' + nameField.value + '. Shri Shivanesh will contact you shortly.';
                formAlert.style.display = 'block';

                // Reset inputs
                contactForm.reset();
            }, 1800);
        });

        // Add blur listener triggers for typing validation
        const fields = [
            document.getElementById('form-name'),
            document.getElementById('form-email'),
            document.getElementById('form-subject'),
            document.getElementById('form-message')
        ];

        fields.forEach(field => {
            if (field) {
                field.addEventListener('input', () => {
                    if (field.value.trim()) {
                        field.parentElement.classList.remove('invalid');
                    }
                });
                field.addEventListener('blur', () => {
                    if (!field.value.trim()) {
                        field.parentElement.classList.add('invalid');
                    }
                });
            }
        });
    }

    // ==========================================================================
    // 12. Hero Profile HUD Scan Entrance Trigger & Live Recording Counter
    // ==========================================================================
    const heroProfileContainer = document.getElementById('hero-profile-container');
    const hudTimeDisplay = document.getElementById('hud-time-display');

    if (heroProfileContainer) {
        // Trigger activation shortly after DOM content loads to let animations play out
        setTimeout(() => {
            heroProfileContainer.classList.add('activated');
        }, 500);

        // Run live timer simulation
        if (hudTimeDisplay) {
            let totalSeconds = 0;
            setInterval(() => {
                totalSeconds++;
                const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
                const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
                const secs = String(totalSeconds % 60).padStart(2, '0');
                hudTimeDisplay.textContent = `${hrs}:${mins}:${secs}`;
            }, 1000);
        }
    }

    // ==========================================================================
    // 13. PDF Resume Lightbox Modal Controller
    // ==========================================================================
    const printResumeBtn = document.getElementById('btn-print-resume');
    const pdfModal = document.getElementById('pdf-modal');
    const pdfModalOverlay = document.getElementById('pdf-modal-overlay');
    const pdfCloseBtn = document.getElementById('pdf-close-btn');
    const pdfPrintBtn = document.getElementById('pdf-print-btn');
    const pdfIframe = document.getElementById('pdf-iframe');
    const pdfModalContainer = document.querySelector('.pdf-modal-container');

    if (printResumeBtn && pdfModal) {
        // Intercept standard click on "Get Resume"
        printResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openPdfModal();
        });

        // Close functions
        pdfCloseBtn.addEventListener('click', closePdfModal);
        pdfModalOverlay.addEventListener('click', closePdfModal);
        
        // Escape key close support
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
                closePdfModal();
            }
        });

        function openPdfModal() {
            pdfModal.classList.add('active');
            pdfModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Stop scroll in background
            
            // Check if PDF loaded correctly or if we fall back
            if (pdfIframe) {
                pdfIframe.onload = function() {
                    try {
                        const iframeDoc = pdfIframe.contentDocument || pdfIframe.contentWindow.document;
                        if (iframeDoc && (iframeDoc.body.innerHTML.includes('File Not Found') || iframeDoc.body.innerHTML.includes('404'))) {
                            pdfModalContainer.classList.remove('pdf-loaded');
                        } else {
                            pdfModalContainer.classList.add('pdf-loaded');
                        }
                    } catch (err) {
                        pdfModalContainer.classList.add('pdf-loaded');
                    }
                };
            }
        }

        function closePdfModal() {
            pdfModal.classList.remove('active');
            pdfModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto'; // Restore scroll
        }

        // Print iframe content or open fallback window print
        if (pdfPrintBtn) {
            pdfPrintBtn.addEventListener('click', () => {
                if (pdfModalContainer.classList.contains('pdf-loaded') && pdfIframe) {
                    try {
                        pdfIframe.contentWindow.focus();
                        pdfIframe.contentWindow.print();
                    } catch (e) {
                        window.print();
                    }
                } else {
                    const printContent = document.getElementById('pdf-fallback-container').innerHTML;
                    const printWindow = window.open('', '_blank', 'height=600,width=800');
                    printWindow.document.write('<html><head><title>Print Resume</title>');
                    printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">');
                    printWindow.document.write('<style>body{font-family:"Inter",sans-serif;padding:30px;line-height:1.5;} h1{text-align:center;font-size:24px;margin-bottom:5px;} .resume-sub{text-align:center;font-size:12px;color:#555;text-transform:uppercase;margin-bottom:15px;} .resume-contact{text-align:center;font-size:11px;color:#666;margin-bottom:20px;} h3{font-size:13px;border-bottom:1px solid #ccc;padding-bottom:5px;margin-top:20px;text-transform:uppercase;} .resume-item{margin-bottom:15px;} .resume-item-title{display:flex;justify-content:space-between;font-weight:bold;font-size:12px;} .resume-item-sub{font-style:italic;font-size:11px;color:#555;} .resume-item-desc{font-size:11.5px;color:#333;margin-top:3px;} p{font-size:12px;margin:3px 0;}</style>');
                    printWindow.document.write('</head><body>');
                    printWindow.document.write(printContent);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                    }, 500);
                }
            });
        }
    }
});
