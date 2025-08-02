// Email protection function
function copyEmail() {
    const email = 'omerfarukbasar@outlook.com';
    navigator.clipboard.writeText(email).then(function() {
        const btn = document.getElementById('email-btn');
        btn.textContent = 'Email copied to clipboard!';
        btn.classList.remove('text-blue-400');
        btn.classList.add('text-green-400');
        
        setTimeout(() => {
            btn.textContent = email;
            btn.classList.remove('text-green-400');
            btn.classList.add('text-blue-400');
        }, 3000);
    }).catch(function() {
        // Fallback for older browsers
        const btn = document.getElementById('email-btn');
        btn.textContent = email;
        btn.classList.remove('text-blue-400');
        btn.classList.add('text-green-400');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(17, 24, 39, 0.9)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});

// Add stagger delays
document.querySelectorAll('.stagger-1').forEach(el => {
    el.style.transitionDelay = '0.1s';
});
document.querySelectorAll('.stagger-2').forEach(el => {
    el.style.transitionDelay = '0.2s';
});
document.querySelectorAll('.stagger-3').forEach(el => {
    el.style.transitionDelay = '0.3s';
});