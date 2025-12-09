// Force scroll to top on page load
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Ensure page starts at top
document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const service = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;

        // Here you would typically send this data to a server
        // For now, we'll just show an alert
        alert('Thank you for your message! We will contact you soon at ' + phone);

        // Reset form
        this.reset();
    });
}

// Active nav link on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Image lazy loading fallback
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Fallback placeholder if image fails to load
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect fill="%23f36b24" width="800" height="600"/%3E%3Ctext fill="%23fff" font-family="Arial" font-size="48" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EGrenga Development%3C/text%3E%3C/svg%3E';
        });
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Force autoplay videos on mobile (iOS fix)
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video[autoplay]');
    const heroVideo = document.getElementById('heroVideo');
    const touchLayer = document.getElementById('videoTouchLayer');

    videos.forEach(video => {
        video.muted = true;
        video.setAttribute('playsinline', '');

        // Try to play immediately
        video.play().catch(function() {
            // If autoplay fails, play on first user interaction
            document.addEventListener('touchstart', function playVideo() {
                video.play();
                document.removeEventListener('touchstart', playVideo);
            }, { once: true });
        });
    });

    // Touch layer captures tap and plays video, hides play button
    if (touchLayer && heroVideo) {
        touchLayer.addEventListener('click', function() {
            heroVideo.play();
            touchLayer.classList.add('hidden');
        });
        touchLayer.addEventListener('touchstart', function() {
            heroVideo.play();
            touchLayer.classList.add('hidden');
        }, { passive: true });

        // Hide touch layer once video starts playing
        heroVideo.addEventListener('playing', function() {
            touchLayer.classList.add('hidden');
        });
    }
});

// Also try to play videos when they become visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const videos = document.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
            if (video.paused) {
                video.play().catch(() => {});
            }
        });
    }
});

// Mobile menu close on outside click
document.addEventListener('click', function(event) {
    const navbar = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');

    if (navbar.classList.contains('show') &&
        !navbar.contains(event.target) &&
        !toggler.contains(event.target)) {
        const bsCollapse = new bootstrap.Collapse(navbar);
        bsCollapse.hide();
    }
});

// Prevent empty form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    });
});

// Phone number formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = '(' + value;
            } else if (value.length <= 6) {
                value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
            } else {
                value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6, 10);
            }
        }
        e.target.value = value;
    });
});

// Reviews slider
let reviewPosition = 0;
const reviewsPerPage = 3;
const totalReviews = 5;

function slideReviews(direction) {
    const track = document.querySelector('.reviews-track');
    const maxPosition = totalReviews - reviewsPerPage;

    reviewPosition += direction;

    if (reviewPosition < 0) {
        reviewPosition = 0;
    } else if (reviewPosition > maxPosition) {
        reviewPosition = maxPosition;
    }

    const cardWidth = document.querySelector('.review-card').offsetWidth + 24; // 24px is the gap
    track.style.transform = `translateX(-${reviewPosition * cardWidth}px)`;
}

// Touch swipe support for reviews
let touchStartX = 0;
let touchEndX = 0;

const reviewsSlider = document.querySelector('.reviews-slider');
if (reviewsSlider) {
    reviewsSlider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    reviewsSlider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            slideReviews(1);
        } else if (touchEndX - touchStartX > 50) {
            slideReviews(-1);
        }
    });
}

// Console log to confirm script loaded
console.log('Grenga Development website loaded successfully!');
console.log('Contact: (401) 302-6909');

// =====================
// QUESTIONNAIRE FUNCTIONALITY
// =====================

let currentStep = 0;
const totalSteps = 5;
const questionnaireData = {};

// Start questionnaire from welcome page
function startQuestionnaire() {
    document.querySelector('.question-step[data-step="0"]').classList.remove('active');
    document.querySelector('.question-step[data-step="1"]').classList.add('active');
    document.querySelector('.progress-step[data-step="1"]').classList.add('active');
    currentStep = 1;
}

// Initialize questionnaire
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all option buttons
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            selectOption(this);
        });
    });
});

// Services that need finish question
const finishServices = ['patio', 'walkway'];
let showFinishQuestion = false;
let showDrivewayMaterial = false;
let drivewayMaterial = null;

// Select an option and auto-advance
function selectOption(btn) {
    const step = btn.closest('.question-step');
    const stepNum = step.dataset.step;
    const value = btn.dataset.value;

    // If "other" is clicked, don't auto-advance (handled separately)
    if (value === 'other') {
        return;
    }

    // Hide other input if visible
    const otherContainer = step.querySelector('.other-input-container');
    if (otherContainer) {
        otherContainer.style.display = 'none';
    }

    // Remove selected class from siblings
    step.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));

    // Add selected class to clicked button
    btn.classList.add('selected');

    // Store the value
    questionnaireData[`step${stepNum}`] = value;

    // Check if step 1 and needs special questions
    if (stepNum === '1' && value === 'driveway') {
        showDrivewayMaterial = true;
        showFinishQuestion = false;
    } else if (stepNum === '1' && finishServices.includes(value)) {
        showFinishQuestion = true;
        showDrivewayMaterial = false;
    } else if (stepNum === '1') {
        showFinishQuestion = false;
        showDrivewayMaterial = false;
    }

    // Check if step 1a (driveway material) and concrete selected
    if (stepNum === '1a') {
        drivewayMaterial = value;
        if (value === 'concrete') {
            showFinishQuestion = true;
        } else {
            showFinishQuestion = false;
        }
    }

    // Auto-advance to next step after short delay
    setTimeout(() => {
        nextStep();
    }, 300);
}

// Show other input field
function showOtherInput(btn) {
    const step = btn.closest('.question-step');

    // Remove selected class from siblings
    step.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));

    // Add selected class to other button
    btn.classList.add('selected');

    // Show input container
    const otherContainer = step.querySelector('.other-input-container');
    otherContainer.style.display = 'block';

    // Focus the input
    document.getElementById('other-project').focus();
}

// Submit other project type
function submitOther() {
    const otherValue = document.getElementById('other-project').value.trim();

    if (!otherValue) {
        alert('Please describe your project');
        return;
    }

    // Store the custom value
    questionnaireData.step1 = 'other: ' + otherValue;

    // Advance to next step
    nextStep();
}

// Go to next step
function nextStep() {
    // Get current step element
    const currentStepEl = document.querySelector(`.question-step[data-step="${currentStep}"]`);

    // Check if we're on step 1 and need to show driveway material question
    if (currentStep === 1 && showDrivewayMaterial) {
        // Hide step 1
        currentStepEl.classList.remove('active');

        // Show step 1a (driveway material question)
        document.querySelector('.question-step[data-step="1a"]').classList.add('active');

        // Update progress
        document.querySelector('.progress-step[data-step="1"]').classList.add('completed');
        const progressLines = document.querySelectorAll('.progress-line');
        if (progressLines.length > 0) {
            progressLines[0].classList.add('active');
        }

        // Set current step
        currentStep = '1a';

        // Show back button
        document.querySelector('.back-btn').style.display = 'inline-flex';
        return;
    }

    // Check if we're on step 1 and need to show finish question (for patio/walkway)
    if (currentStep === 1 && showFinishQuestion) {
        // Hide step 1
        currentStepEl.classList.remove('active');

        // Show step 1b (finish question)
        document.querySelector('.question-step[data-step="1b"]').classList.add('active');

        // Update progress
        document.querySelector('.progress-step[data-step="1"]').classList.add('completed');
        const progressLines = document.querySelectorAll('.progress-line');
        if (progressLines.length > 0) {
            progressLines[0].classList.add('active');
        }

        // Set flag so we don't show it again
        currentStep = '1b';

        // Show back button
        document.querySelector('.back-btn').style.display = 'inline-flex';
        return;
    }

    // If we're on step 1a (driveway material), check if concrete to show finish question
    if (currentStep === '1a') {
        document.querySelector('.question-step[data-step="1a"]').classList.remove('active');

        if (showFinishQuestion) {
            // Show finish question for concrete driveway
            document.querySelector('.question-step[data-step="1b"]').classList.add('active');
            currentStep = '1b';
        } else {
            // Asphalt - skip to step 2
            currentStep = 2;
            document.querySelector(`.question-step[data-step="${currentStep}"]`).classList.add('active');
            document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
        }
        return;
    }

    // If we're on step 1b, go to step 2
    if (currentStep === '1b') {
        document.querySelector('.question-step[data-step="1b"]').classList.remove('active');
        currentStep = 2;
        document.querySelector(`.question-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
        return;
    }

    if (currentStep < totalSteps) {
        // Hide current step
        document.querySelector(`.question-step[data-step="${currentStep}"]`).classList.remove('active');

        // Update progress indicator
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('completed');

        // Get all progress lines and mark appropriate ones as active
        const progressLines = document.querySelectorAll('.progress-line');
        if (currentStep <= progressLines.length) {
            progressLines[currentStep - 1].classList.add('active');
        }

        // Move to next step
        currentStep++;

        // Show next step
        document.querySelector(`.question-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');

        // Show back button after first step
        if (currentStep > 1) {
            document.querySelector('.back-btn').style.display = 'inline-flex';
        }
    }
}

// Go to previous step
function prevStep() {
    // If on step 1a, go back to step 1
    if (currentStep === '1a') {
        document.querySelector('.question-step[data-step="1a"]').classList.remove('active');
        currentStep = 1;
        document.querySelector('.question-step[data-step="1"]').classList.add('active');
        document.querySelector('.progress-step[data-step="1"]').classList.remove('completed');
        const progressLines = document.querySelectorAll('.progress-line');
        if (progressLines.length > 0) {
            progressLines[0].classList.remove('active');
        }
        document.querySelector('.back-btn').style.display = 'none';
        showDrivewayMaterial = false;
        return;
    }

    // If on step 1b and came from driveway material, go back to 1a
    if (currentStep === '1b' && showDrivewayMaterial) {
        document.querySelector('.question-step[data-step="1b"]').classList.remove('active');
        currentStep = '1a';
        document.querySelector('.question-step[data-step="1a"]').classList.add('active');
        showFinishQuestion = false;
        return;
    }

    // If on step 1b (from patio/walkway), go back to step 1
    if (currentStep === '1b') {
        document.querySelector('.question-step[data-step="1b"]').classList.remove('active');
        currentStep = 1;
        document.querySelector('.question-step[data-step="1"]').classList.add('active');
        document.querySelector('.progress-step[data-step="1"]').classList.remove('completed');
        const progressLines = document.querySelectorAll('.progress-line');
        if (progressLines.length > 0) {
            progressLines[0].classList.remove('active');
        }
        document.querySelector('.back-btn').style.display = 'none';
        return;
    }

    // If on step 2 and came from finish question, go back to 1b
    if (currentStep === 2 && showFinishQuestion) {
        document.querySelector('.question-step[data-step="2"]').classList.remove('active');
        document.querySelector('.progress-step[data-step="2"]').classList.remove('active');
        currentStep = '1b';
        document.querySelector('.question-step[data-step="1b"]').classList.add('active');
        return;
    }

    // If on step 2 and came from asphalt driveway, go back to 1a
    if (currentStep === 2 && showDrivewayMaterial && !showFinishQuestion) {
        document.querySelector('.question-step[data-step="2"]').classList.remove('active');
        document.querySelector('.progress-step[data-step="2"]').classList.remove('active');
        currentStep = '1a';
        document.querySelector('.question-step[data-step="1a"]').classList.add('active');
        return;
    }

    if (currentStep > 1) {
        // Hide current step
        document.querySelector(`.question-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');

        // Get all progress lines and unmark appropriate ones
        const progressLines = document.querySelectorAll('.progress-line');
        if (currentStep > 1 && currentStep - 2 < progressLines.length) {
            progressLines[currentStep - 2].classList.remove('active');
        }

        // Move to previous step
        currentStep--;

        // Show previous step
        document.querySelector(`.question-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('completed');

        // Hide back button on first step
        if (currentStep === 1) {
            document.querySelector('.back-btn').style.display = 'none';
        }
    }
}

// Submit questionnaire
function submitQuestionnaire() {
    // Get contact form values
    const name = document.getElementById('q-name').value;
    const phone = document.getElementById('q-phone').value;
    const email = document.getElementById('q-email').value;
    const address = document.getElementById('q-address').value;

    // Validate required fields
    if (!name || !phone || !email) {
        alert('Please fill in all required fields (Name, Phone, Email)');
        return;
    }

    // Store contact info
    questionnaireData.name = name;
    questionnaireData.phone = phone;
    questionnaireData.email = email;
    questionnaireData.address = address;

    // Map values to readable labels
    const projectLabels = {
        'roof': 'Roof',
        'siding': 'Siding',
        'deck': 'Deck',
        'patio': 'Patio',
        'renovation': 'Renovation'
    };

    const propertyLabels = {
        'residential': 'Residential',
        'commercial': 'Commercial'
    };

    const timelineLabels = {
        'asap': 'ASAP',
        '1-3-months': '1-3 Months',
        '3-6-months': '3-6 Months',
        'exploring': 'Just Exploring'
    };

    const budgetLabels = {
        '5k-10k': '$5k - $10k',
        '10k-25k': '$10k - $25k',
        '25k-50k': '$25k - $50k',
        '50k+': '$50k+'
    };

    // Get readable values
    const projectType = questionnaireData.step1 && questionnaireData.step1.startsWith('other:')
        ? questionnaireData.step1.replace('other: ', '')
        : (projectLabels[questionnaireData.step1] || questionnaireData.step1);
    const propertyType = propertyLabels[questionnaireData.step2] || questionnaireData.step2;
    const timeline = timelineLabels[questionnaireData.step3] || questionnaireData.step3;
    const budget = budgetLabels[questionnaireData.step4] || questionnaireData.step4;

    // Send to webhook
    const webhookData = {
        name: name,
        phone: phone,
        email: email,
        address: address || 'Not provided',
        projectType: projectType,
        propertyType: propertyType,
        timeline: timeline,
        budget: budget,
        submittedAt: new Date().toISOString()
    };

    fetch('https://contractorai.app.n8n.cloud/webhook/f1d57f25-0767-454e-9081-4795252da419', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
    }).catch(err => console.log('Webhook error:', err));

    // Show popup first
    document.getElementById('quotePopup').classList.add('active');

    // Hide current step and progress
    document.querySelector(`.question-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector('.progress-indicator').style.display = 'none';
    document.querySelector('.questionnaire-nav').style.display = 'none';

    // Show success message
    document.querySelector('.question-step[data-step="success"]').classList.add('active');

    // Update title
    document.querySelector('.questionnaire-title').textContent = 'Request Submitted!';
    document.querySelector('.questionnaire-subtitle').textContent = '';
}

// Close popup
function closePopup() {
    document.getElementById('quotePopup').classList.remove('active');
}
