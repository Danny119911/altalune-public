// DOM Elements
const headerNav = document.getElementById('main-nav');
const gateWrapper = document.querySelector('.logo-wrapper');
const gateLogo = document.querySelector('.hero-logo');
const scrollIndicator = document.querySelector('.scroll-indicator');
const heroGlowBg = document.querySelector('.hero-glow-bg');

// 1. SCROLL-DRIVEN PORTAL PARALLAX ANIMATION
function updateParallax() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // Calculate progress between 0 and 1 over the first viewport height
    const progress = Math.min(Math.max(scrollY / viewportHeight, 0), 1);
    
    // Set scroll progress custom property on root for CSS transitions
    document.documentElement.style.setProperty('--scroll-progress', progress);
    
    // Toggle scrolled class for header backdrop blur
    if (scrollY > 50) {
        headerNav.classList.add('scrolled');
    } else {
        headerNav.classList.remove('scrolled');
    }
}

// Attach scroll and resize listeners
window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
});
window.addEventListener('resize', () => {
    requestAnimationFrame(updateParallax);
});

// Run initially
updateParallax();


// 2. SCROLLSPY NAV LINK HIGHLIGHTING
const spyTargets = document.querySelectorAll('section, .pillar-section');
const navLinks = document.querySelectorAll('.nav-links a');

const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px', // Sweet spot in middle of screen
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            // Skip the main hero section to avoid highlight conflicts, or highlight first link
            if (id === 'hero') return;
            
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}, observerOptions);

spyTargets.forEach(target => observer.observe(target));


// 3. WORKSPACE MOCKUP TABS SWITCHER
const sidebarTabs = document.querySelectorAll('.sidebar-tab');
const tabContents = document.querySelectorAll('.sidebar-tab-content');

sidebarTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs
        sidebarTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        // Show target content
        document.getElementById(targetTab).classList.add('active');
    });
});


// 4. MOCKUP THEME SWITCHER (Standard Dark vs Warm Light Toggle)
const mockThemeBtn = document.getElementById('btn-mock-theme-toggle');
const mockContainer = document.querySelector('.mockup-container');

if (mockThemeBtn && mockContainer) {
    mockThemeBtn.addEventListener('click', () => {
        if (mockContainer.classList.contains('theme-dark')) {
            mockContainer.classList.remove('theme-dark');
            mockContainer.classList.add('theme-warm');
            mockThemeBtn.textContent = 'DARK';
        } else {
            mockContainer.classList.remove('theme-warm');
            mockContainer.classList.add('theme-dark');
            mockThemeBtn.textContent = 'WARM';
        }
    });
}


// 5. EDITOR DYNAMIC AUTOCOMPLETE SIMULATOR (On Page Load)
function runAutocompleteSimulation() {
    const editorContent = document.getElementById('mock-editor-text');
    const linkPopover = document.getElementById('link-popover');
    if (!editorContent || !linkPopover) return;
    
    // Select the cursor element
    const cursor = editorContent.querySelector('.editor-cursor');
    
    // Simulate typing trigger after 2.5s
    setTimeout(() => {
        // Create typing element
        const textNode = document.createTextNode('');
        editorContent.insertBefore(textNode, cursor);
        
        const phraseToType = " to open the door. He needs to check the [[";
        let charIndex = 0;
        
        function typeNextChar() {
            if (charIndex < phraseToType.length) {
                textNode.textContent += phraseToType.charAt(charIndex);
                charIndex++;
                editorContent.scrollTop = editorContent.scrollHeight;
                
                // Show popover when typing "[["
                if (phraseToType.substring(0, charIndex).endsWith("[[")) {
                    linkPopover.style.display = 'block';
                    // Position popover near the bottom of editor
                    linkPopover.style.bottom = '40px';
                    linkPopover.style.left = '40px';
                }
                
                setTimeout(typeNextChar, 55);
            } else {
                // Typings done. Wait 1.2 seconds, select first item, and replace
                setTimeout(() => {
                    // Hide popover
                    linkPopover.style.display = 'none';
                    
                    // Replace the last "[[" with a highlighted link
                    const text = textNode.textContent;
                    textNode.textContent = text.substring(0, text.length - 2); // remove "[["
                    
                    // Insert highlighted link element
                    const linkSpan = document.createElement('span');
                    linkSpan.className = 'editor-highlight location resolved-glow';
                    linkSpan.setAttribute('data-ref', 'bunker-alpha');
                    linkSpan.id = 'dynamic-link-bunker';
                    linkSpan.textContent = 'Consular Bunker Alpha';
                    editorContent.insertBefore(linkSpan, cursor);
                    
                    // Add period after link
                    const periodNode = document.createTextNode('.');
                    editorContent.insertBefore(periodNode, cursor);
                    
                    // Insert reference card into sidebar references panel
                    const refPanel = document.getElementById('mock-prose-references');
                    if (refPanel) {
                        const bunkerCard = document.createElement('div');
                        bunkerCard.className = 'reference-card resolved-glow';
                        bunkerCard.id = 'ref-card-bunker-alpha';
                        bunkerCard.innerHTML = `
                            <div class="reference-header">
                                <h4 class="reference-title">Consular Bunker Alpha</h4>
                                <span class="reference-type">BIBLE_NOTE</span>
                            </div>
                            <p class="reference-desc">Consular Bunker Alpha: The primary containment complex on Lexia Fornent. Houses debriefing cells, life-support nodes, and skindiver storage units.</p>
                            <div class="reference-fields">
                                <span class="reference-field">Category: Facility</span>
                                <span class="reference-field">Status: Operational</span>
                            </div>
                        `;
                        refPanel.insertBefore(bunkerCard, refPanel.firstChild);
                        
                        // Switch sidebar tab to References to show the result
                        const refTab = document.querySelector('[data-tab="tab-references"]');
                        if (refTab) refTab.click();
                        
                        // Flash the card
                        setTimeout(() => {
                            bunkerCard.classList.remove('resolved-glow');
                        }, 1500);
                    }
                    
                    // Hook up event listener for the newly created link
                    linkSpan.addEventListener('click', () => {
                        const refTab = document.querySelector('[data-tab="tab-references"]');
                        if (refTab) refTab.click();
                        const card = document.getElementById('ref-card-bunker-alpha');
                        if (card) {
                            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            card.style.borderColor = 'var(--mock-bronze)';
                            card.style.boxShadow = '0 0 10px var(--mock-bronze)';
                            setTimeout(() => {
                                card.style.borderColor = '';
                                card.style.boxShadow = '';
                            }, 1200);
                        }
                    });
                }, 1200);
            }
        }
        
        typeNextChar();
    }, 2500);
}

// Run the autocomplete simulation on load
window.addEventListener('load', runAutocompleteSimulation);


// 6. CLICK HANDLERS FOR HIGHLIGHTED WORDS IN EDITOR
const highlights = document.querySelectorAll('.editor-highlight');
highlights.forEach(h => {
    h.addEventListener('click', () => {
        const refId = h.getAttribute('data-ref');
        
        // Switch tab to Prose References
        const refTab = document.querySelector('[data-tab="tab-references"]');
        if (refTab) refTab.click();
        
        // Find matching reference card
        const card = document.getElementById(`ref-card-${refId}`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            card.style.borderColor = 'var(--mock-bronze)';
            card.style.boxShadow = '0 0 10px var(--mock-bronze)';
            setTimeout(() => {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            }, 1200);
        }
    });
});


// 7. EVE ASSISTANT PERSONA TOGGLES
const eveModePills = document.querySelectorAll('.eve-mode-pill');
const eveChatArea = document.getElementById('eve-mock-chat');

const eveModeMessages = {
    cowriter: "<strong>Eve (Co-writer Mode):</strong> I am ready to act as your co-writer. I will keep you on task, suggest expansions for your drafts, and offer light stylistic advice as you write.",
    critic: "<strong>Eve (Critic Mode):</strong> Critic mode activated. I will read your prose with a critical eye, focusing on pacing, dialogue naturalism, and structural flow. Let me know if you would like editing exercises.",
    factcheck: "<strong>Eve (Fact-check Mode):</strong> Fact-check mode activated. I am scanning your text and cross-referencing names, events, and categories against the Lore Bible to catch timeline or description errors.",
    brainstorm: "<strong>Eve (Brainstorm Mode):</strong> Brainstorming mode activated. Tell me what plot points, character arcs, or conflict resolutions you want to explore, and we can flesh out your ideas in a way that respect past chapters.",
    loremaster: "<strong>Eve (Loremaster Mode):</strong> Loremaster mode active. Ask me direct questions about your universe, and I will retrieve strict factual summaries directly from your Lore Bible."
};

eveModePills.forEach(pill => {
    pill.addEventListener('click', () => {
        eveModePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        const mode = pill.getAttribute('data-mode');
        
        // Append user message
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user';
        userBubble.innerHTML = `<div class="chat-sender user">You</div>Switch mode to ${pill.textContent.substring(3)}`;
        eveChatArea.appendChild(userBubble);
        
        // Append Eve response
        setTimeout(() => {
            const eveBubble = document.createElement('div');
            eveBubble.className = 'chat-bubble eve';
            eveBubble.innerHTML = `<div class="chat-sender eve">Eve</div>${eveModeMessages[mode]}`;
            eveChatArea.appendChild(eveBubble);
            
            // Scroll chat to bottom
            eveChatArea.scrollTop = eveChatArea.scrollHeight;
        }, 400);
    });
});


// 8. PILLAR 1: EVE CONTINUTY CHECKER WIDGET STATE MACHINE
const wordsDemoBtn = document.getElementById('words-demo-btn');
const wordsDemoText = document.getElementById('words-demo-text');
const eveTooltip = document.getElementById('eve-tooltip');
const btnFixSilver = document.getElementById('btn-fix-silver');
const btnDismissTooltip = document.getElementById('btn-dismiss-tooltip');

const highlight1 = document.getElementById('highlight-1');
const highlight2 = document.getElementById('highlight-2');

let widgetState = 'idle'; // states: idle, scanning, warning, resolved

if (wordsDemoBtn) {
    wordsDemoBtn.addEventListener('click', () => {
        if (widgetState === 'idle') {
            widgetState = 'scanning';
            wordsDemoBtn.disabled = true;
            wordsDemoBtn.textContent = 'Scanning Chapter Context...';
            
            // Simulate scanning delay
            setTimeout(() => {
                widgetState = 'warning';
                highlight1.classList.add('error-glow');
                highlight2.classList.add('error-glow');
                
                // Show Eve tooltip
                eveTooltip.classList.add('show');
                
                wordsDemoBtn.textContent = 'Warning: Inconsistency Found';
            }, 1200);
        }
    });
}

if (btnFixSilver) {
    btnFixSilver.addEventListener('click', () => {
        widgetState = 'resolved';
        
        // Hide tooltip
        eveTooltip.classList.remove('show');
        
        // Remove warning glows
        highlight1.classList.remove('error-glow');
        highlight2.classList.remove('error-glow');
        
        // Replace text "bronze sword" with "silver sword"
        highlight2.textContent = 'silver sword';
        
        // Add flashing success animation class
        highlight2.classList.add('resolved-glow');
        
        // Update button text
        wordsDemoBtn.textContent = 'Continuity Cleared';
        wordsDemoBtn.disabled = true;
        wordsDemoBtn.style.borderColor = 'rgba(39, 201, 63, 0.4)';
        wordsDemoBtn.style.color = '#27c93f';
    });
}

if (btnDismissTooltip) {
    btnDismissTooltip.addEventListener('click', () => {
        widgetState = 'idle';
        
        // Hide tooltip
        eveTooltip.classList.remove('show');
        
        // Remove warnings
        highlight1.classList.remove('error-glow');
        highlight2.classList.remove('error-glow');
        
        // Reset button
        wordsDemoBtn.textContent = 'Run Continuity Check';
        wordsDemoBtn.disabled = false;
    });
}


// 9. PILLAR 2: RELATIONSHIP EXPLORER CARD TOGGLES
const pillarRelationsCards = document.querySelectorAll('#pillar-relations-list .relations-widget-card');
const relInfoTitle = document.getElementById('rel-info-title');
const relInfoDesc = document.getElementById('rel-info-desc');

const relationsData = {
    xavier: {
        title: "Evelyn Thorne (CHARACTER) ➔ member of ➔ the Coalition",
        desc: "Evelyn Thorne: Recalled to active duty after the discovery of Aetheris, a key figure in humanity's response. Former IRR Marine, natural leader, carries the weight of Coalition operations."
    },
    'eve-moon': {
        title: "Eve (CHARACTER) ➔ resides on ➔ Vesta Prime",
        desc: "Eve resides on the Moon within the sanctuary vessel Aetheris. Her primary objective is to observe the development of humanity from a hidden sanctuary location."
    },
    tbm: {
        title: "Excavator 7 (BIBLE_NOTE) ➔ awakened ➔ Eve",
        desc: "Excavator 7 is the heavy-impact drilling vehicle that accidentally strikes the shell of the buried Aetheris structure, waking Eve from her ten-thousand-year observer stasis."
    }
};

pillarRelationsCards.forEach(card => {
    card.addEventListener('click', () => {
        const relId = card.getAttribute('data-rel');
        
        // Toggle active class
        pillarRelationsCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Update details card copy
        const data = relationsData[relId];
        if (data) {
            relInfoTitle.textContent = data.title;
            relInfoDesc.textContent = data.desc;
        }
    });
});


// 7. URL HASH SCROLL RECOVERY (For redirects from old subfolders)
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    // Replace hash if it is still using the old #download name
    const finalHash = hash === '#download' ? '#updates' : hash;
    if (finalHash) {
        const target = document.querySelector(finalHash);
        if (target) {
            // Delay slightly for render and scroll execution
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }
});


// 8. SUBSCRIBE FORM HANDLER (Waitlist submission state)
const subscribeForm = document.getElementById('subscribe-form');
const subscribeInput = document.getElementById('subscribe-email');
const subscribeBtn = document.getElementById('subscribe-btn');

if (subscribeForm && subscribeInput && subscribeBtn) {
    subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailVal = subscribeInput.value.trim();
        if (!emailVal || !emailVal.includes('@') || emailVal.length < 5) {
            // Signal invalid format
            subscribeInput.classList.add('error-pulse');
            setTimeout(() => subscribeInput.classList.remove('error-pulse'), 800);
            return;
        }
        
        subscribeBtn.disabled = true;
        subscribeInput.disabled = true;
        subscribeBtn.textContent = 'Joining...';
        
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailVal })
            });
            
            let data = {};
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            }
            
            if (response.ok && data.success) {
                subscribeInput.value = '';
                subscribeBtn.textContent = data.alreadySubscribed ? 'Already Subscribed!' : 'Joined!';
                subscribeBtn.style.borderColor = 'rgba(39, 201, 63, 0.4)';
                subscribeBtn.style.color = '#27c93f';
                subscribeBtn.style.background = 'transparent';
                subscribeBtn.style.boxShadow = 'none';
            } else {
                throw new Error(data.error || `Server returned error status ${response.status}.`);
            }
        } catch (err) {
            console.error('Waitlist submission error:', err);
            
            // Re-enable on error
            subscribeBtn.disabled = false;
            subscribeInput.disabled = false;
            subscribeBtn.textContent = 'Join Waitlist';
            
            // Flash red highlight
            subscribeInput.classList.add('error-pulse');
            setTimeout(() => subscribeInput.classList.remove('error-pulse'), 800);
            
            // Log/Show alert message
            alert(err.message || 'Waitlist submission failed. Please try again.');
        }
    });
}
