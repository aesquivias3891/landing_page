// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Navegación suave para enlaces internos
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Menú móvil toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Tabs del menú
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuGrids = document.querySelectorAll('.menu-grid');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase active de todos los tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            // Agregar clase active al tab clickeado
            this.classList.add('active');
            
            // Ocultar todos los grids
            menuGrids.forEach(grid => grid.classList.remove('active'));
            
            // Mostrar el grid correspondiente
            const targetTab = this.getAttribute('data-tab');
            const targetGrid = document.getElementById(targetTab);
            if (targetGrid) {
                targetGrid.classList.add('active');
            }
        });
    });

    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    const animateElements = document.querySelectorAll('.service-card, .menu-item, .plan-card, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Header con efecto de scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validación básica
            if (!data.name || !data.email || !data.phone || !data.plan) {
                showNotification('Por favor completa todos los campos requeridos', 'error');
                return;
            }
            
            // Simular envío del formulario
            showNotification('¡Gracias por tu interés! Te contactaremos pronto.', 'success');
            this.reset();
        });
    }

    // Botones de planes
    const planButtons = document.querySelectorAll('.plan-card .btn-primary');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planName = this.closest('.plan-card').querySelector('h3').textContent;
            showNotification(`¡Excelente elección! Has seleccionado el ${planName}`, 'success');
        });
    });

    // Botones del hero
    const heroButtons = document.querySelectorAll('.hero-buttons .btn-primary, .hero-buttons .btn-secondary');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('Menú')) {
                // Scroll al menú
                const menuSection = document.querySelector('#menu');
                if (menuSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = menuSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } else if (this.textContent.includes('Planes')) {
                // Scroll a los planes
                const plansSection = document.querySelector('#planes');
                if (plansSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = plansSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Función para mostrar notificaciones
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Agregar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Contador animado para estadísticas
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        
        updateCounter();
    }

    // Observar estadísticas para animar contadores
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // Efecto parallax suave para la imagen del hero
    const heroImage = document.querySelector('.hero-card');
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `rotate(3deg) translateY(${rate}px)`;
        });
    }

    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        imageObserver.observe(img);
    });

    // Efecto hover mejorado para cards
    const cards = document.querySelectorAll('.service-card, .menu-item, .plan-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform + ' scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
    });

    // Validación de formulario en tiempo real
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remover clases de error previas
        field.classList.remove('error', 'success');

        // Validaciones específicas
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
        }

        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un teléfono válido';
            }
        }

        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        }

        // Aplicar clases y mensajes
        if (isValid && value) {
            field.classList.add('success');
            field.style.borderColor = '#10b981';
        } else if (!isValid) {
            field.classList.add('error');
            field.style.borderColor = '#ef4444';
            
            // Mostrar mensaje de error
            let errorElement = field.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.cssText = `
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                `;
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        } else {
            field.style.borderColor = '#e5e7eb';
        }
    }

    // Smooth scroll para botones de navegación
    const navButtons = document.querySelectorAll('.nav-cta .btn-primary');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('#contacto');
            if (contactSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Chatbot Functionality
    class NutriKitchenChatbot {
        constructor() {
            this.isOpen = false;
            this.isMinimized = false;
            this.conversationHistory = [];
            this.currentOrder = null;
            this.userInfo = {};
            
            this.initializeElements();
            this.bindEvents();
            this.showWelcomeMessage();
        }

        initializeElements() {
            this.container = document.getElementById('chatbotContainer');
            this.toggle = document.getElementById('chatbotToggle');
            this.window = document.getElementById('chatbotWindow');
            this.messages = document.getElementById('chatbotMessages');
            this.input = document.getElementById('chatbotInput');
            this.sendBtn = document.getElementById('chatbotSend');
            this.closeBtn = document.getElementById('chatbotClose');
            this.minimizeBtn = document.getElementById('chatbotMinimize');
            this.notification = document.getElementById('chatbotNotification');
            this.quickActions = document.getElementById('chatbotQuickActions');
        }

        bindEvents() {
            this.toggle.addEventListener('click', () => this.toggleChat());
            this.closeBtn.addEventListener('click', () => this.closeChat());
            this.minimizeBtn.addEventListener('click', () => this.minimizeChat());
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });

            // Quick actions
            this.quickActions.addEventListener('click', (e) => {
                if (e.target.classList.contains('quick-action-btn')) {
                    const action = e.target.dataset.action;
                    this.handleQuickAction(action);
                }
            });

            // Auto-hide notification after first interaction
            this.toggle.addEventListener('click', () => {
                this.notification.style.display = 'none';
            }, { once: true });
        }

        toggleChat() {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }

        openChat() {
            this.isOpen = true;
            this.window.classList.add('active');
            this.input.focus();
            this.scrollToBottom();
        }

        closeChat() {
            this.isOpen = false;
            this.window.classList.remove('active');
            this.isMinimized = false;
            this.window.classList.remove('minimized');
        }

        minimizeChat() {
            this.isMinimized = !this.isMinimized;
            this.window.classList.toggle('minimized');
        }

        showWelcomeMessage() {
            const welcomeMessage = `
                ¡Hola! 👋 Soy tu asistente virtual de NutriKitchen. 
                
                Puedo ayudarte con:
                • 📋 Ver nuestro menú semanal
                • 🍽️ Hacer pedidos
                • 💰 Información sobre planes
                • 🆘 Soporte y quejas
                • 📞 Contacto
                
                ¿En qué puedo ayudarte hoy?
            `;
            
            this.addBotMessage(welcomeMessage);
        }

        sendMessage() {
            const message = this.input.value.trim();
            if (!message) return;

            this.addUserMessage(message);
            this.input.value = '';
            this.processUserMessage(message);
        }

        addUserMessage(message) {
            const messageElement = this.createMessageElement(message, 'user');
            this.messages.appendChild(messageElement);
            this.scrollToBottom();
        }

        addBotMessage(message, isTyping = false) {
            if (isTyping) {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    const messageElement = this.createMessageElement(message, 'bot');
                    this.messages.appendChild(messageElement);
                    this.scrollToBottom();
                }, 1000 + Math.random() * 2000);
            } else {
                const messageElement = this.createMessageElement(message, 'bot');
                this.messages.appendChild(messageElement);
                this.scrollToBottom();
            }
        }

        createMessageElement(message, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${sender}`;
            
            const time = new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            const avatar = sender === 'bot' ? '<i class="fas fa-leaf"></i>' : '<i class="fas fa-user"></i>';
            
            messageDiv.innerHTML = `
                <div class="chatbot-message-avatar">
                    ${avatar}
                </div>
                <div class="chatbot-message-content">
                    ${this.formatMessage(message)}
                    <div class="chatbot-message-time">${time}</div>
                </div>
            `;

            return messageDiv;
        }

        formatMessage(message) {
            // Convertir URLs en enlaces
            message = message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="chatbot-message-link">$1</a>');
            
            // Convertir saltos de línea en <br>
            message = message.replace(/\n/g, '<br>');
            
            return message;
        }

        showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chatbot-message bot';
            typingDiv.id = 'typing-indicator';
            
            typingDiv.innerHTML = `
                <div class="chatbot-message-avatar">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="chatbot-typing">
                    <div class="chatbot-typing-dot"></div>
                    <div class="chatbot-typing-dot"></div>
                    <div class="chatbot-typing-dot"></div>
                </div>
            `;
            
            this.messages.appendChild(typingDiv);
            this.scrollToBottom();
        }

        hideTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        scrollToBottom() {
            setTimeout(() => {
                this.messages.scrollTop = this.messages.scrollHeight;
            }, 100);
        }

        handleQuickAction(action) {
            switch (action) {
                case 'menu':
                    this.showMenu();
                    break;
                case 'plans':
                    this.showPlans();
                    break;
                case 'order':
                    this.startOrder();
                    break;
                case 'support':
                    this.showSupport();
                    break;
            }
        }

        showSupport() {
            const supportMessage = `
                🆘 <strong>Soporte y Ayuda</strong>
                
                ¿En qué puedo ayudarte?
                
                <strong>Opciones disponibles:</strong>
                • 📋 Información sobre pedidos
                • 🚚 Problemas de entrega
                • 💳 Problemas de pago
                • 🍽️ Quejas sobre la comida
                • 📞 Contactar servicio al cliente
                • 🔄 Cambios o cancelaciones
                
                ¿Cuál es tu consulta específica?
            `;
            this.addBotMessage(supportMessage, true);
        }

        processUserMessage(message) {
            const lowerMessage = message.toLowerCase();
            
            // Guardar en historial
            this.conversationHistory.push({ user: message, timestamp: new Date() });

            // Si hay una orden en progreso, procesar según el paso actual
            if (this.currentOrder && this.currentOrder.step) {
                this.processOrderStep(message);
                return;
            }

            // Si hay una queja en progreso, procesar según el paso actual
            if (this.currentComplaint && this.currentComplaint.step) {
                this.processComplaintStep(message);
                return;
            }

            // Detectar intención del usuario
            if (this.isGreeting(lowerMessage)) {
                this.handleGreeting();
            } else if (this.isMenuRequest(lowerMessage)) {
                this.showMenu();
            } else if (this.isPlansRequest(lowerMessage)) {
                this.showPlans();
            } else if (this.isOrderRequest(lowerMessage)) {
                this.startOrder();
            } else if (this.isComplaint(lowerMessage)) {
                this.handleComplaint();
            } else if (this.isContactRequest(lowerMessage)) {
                this.showContactInfo();
            } else if (this.isPriceRequest(lowerMessage)) {
                this.showPricing();
            } else if (this.isDeliveryRequest(lowerMessage)) {
                this.showDeliveryInfo();
            } else if (this.isHealthRequest(lowerMessage)) {
                this.showHealthInfo();
            } else if (this.isThankYou(lowerMessage)) {
                this.handleThankYou();
            } else {
                this.handleUnknownMessage();
            }
        }

        processOrderStep(message) {
            switch (this.currentOrder.step) {
                case 'name':
                    this.currentOrder.customerName = message;
                    this.currentOrder.step = 'phone';
                    this.addBotMessage(`Gracias ${message}! 📱 Ahora necesito tu número de teléfono para contactarte.`, true);
                    break;
                    
                case 'phone':
                    this.currentOrder.customerPhone = message;
                    this.currentOrder.step = 'address';
                    this.addBotMessage(`Perfecto! 🏠 Ahora necesito tu dirección de entrega.`, true);
                    break;
                    
                case 'address':
                    this.currentOrder.customerAddress = message;
                    this.currentOrder.step = 'items';
                    this.addBotMessage(`¡Excelente! 🍽️ Ahora vamos a seleccionar tu comida. 

¿Qué te gustaría ordenar?

<strong>Desayunos:</strong>
• Bowl de Açaí con Granola - $12.50
• Tostadas de Aguacate - $10.00
• Smoothie Verde Energético - $8.50

<strong>Almuerzos:</strong>
• Ensalada César Saludable - $15.00
• Bowl de Quinoa Mediterráneo - $16.50
• Salmón a la Plancha - $22.00

Escribe el nombre del plato que deseas.`, true);
                    break;
                    
                case 'items':
                    this.processOrderItem(message);
                    break;
                    
                case 'confirm':
                    if (message.toLowerCase().includes('sí') || message.toLowerCase().includes('si') || message.toLowerCase().includes('confirmar')) {
                        this.confirmOrder();
                    } else {
                        this.currentOrder = null;
                        this.addBotMessage(`Entendido, cancelamos el pedido. ¿En qué más puedo ayudarte?`, true);
                    }
                    break;
            }
        }

        processOrderItem(message) {
            const lowerMessage = message.toLowerCase();
            const menuItems = {
                'bowl de açaí': { name: 'Bowl de Açaí con Granola', price: 12.50 },
                'açaí': { name: 'Bowl de Açaí con Granola', price: 12.50 },
                'tostadas de aguacate': { name: 'Tostadas de Aguacate', price: 10.00 },
                'aguacate': { name: 'Tostadas de Aguacate', price: 10.00 },
                'smoothie verde': { name: 'Smoothie Verde Energético', price: 8.50 },
                'smoothie': { name: 'Smoothie Verde Energético', price: 8.50 },
                'ensalada césar': { name: 'Ensalada César Saludable', price: 15.00 },
                'cesar': { name: 'Ensalada César Saludable', price: 15.00 },
                'bowl de quinoa': { name: 'Bowl de Quinoa Mediterráneo', price: 16.50 },
                'quinoa': { name: 'Bowl de Quinoa Mediterráneo', price: 16.50 },
                'salmón': { name: 'Salmón a la Plancha', price: 22.00 },
                'salmon': { name: 'Salmón a la Plancha', price: 22.00 }
            };

            let foundItem = null;
            for (const [key, item] of Object.entries(menuItems)) {
                if (lowerMessage.includes(key)) {
                    foundItem = item;
                    break;
                }
            }

            if (foundItem) {
                this.currentOrder.items.push(foundItem);
                this.currentOrder.total += foundItem.price;
                
                this.addBotMessage(`¡Perfecto! ✅ Agregué ${foundItem.name} a tu pedido.

<strong>Tu pedido actual:</strong>
${this.currentOrder.items.map(item => `• ${item.name} - $${item.price}`).join('\n')}

<strong>Total: $${this.currentOrder.total.toFixed(2)}</strong>

¿Te gustaría agregar algo más o confirmar tu pedido? (Escribe "confirmar" para terminar)`, true);
            } else if (lowerMessage.includes('confirmar') || lowerMessage.includes('terminar') || lowerMessage.includes('listo')) {
                this.currentOrder.step = 'confirm';
                this.showOrderSummary();
            } else {
                this.addBotMessage(`No encontré ese plato en nuestro menú. ¿Podrías escribir el nombre exacto del plato que deseas?`, true);
            }
        }

        showOrderSummary() {
            const summary = `
                📋 <strong>Resumen de tu Pedido</strong>
                
                <strong>Cliente:</strong> ${this.currentOrder.customerName}
                <strong>Teléfono:</strong> ${this.currentOrder.customerPhone}
                <strong>Dirección:</strong> ${this.currentOrder.customerAddress}
                
                <strong>Platos:</strong>
                ${this.currentOrder.items.map(item => `• ${item.name} - $${item.price}`).join('\n')}
                
                <strong>Total: $${this.currentOrder.total.toFixed(2)}</strong>
                
                ¿Confirmas este pedido? (Responde "sí" para confirmar)
            `;
            this.addBotMessage(summary, true);
        }

        confirmOrder() {
            const orderNumber = Math.floor(Math.random() * 9000) + 1000;
            const confirmation = `
                🎉 <strong>¡Pedido Confirmado!</strong>
                
                <strong>Número de pedido:</strong> #${orderNumber}
                <strong>Total:</strong> $${this.currentOrder.total.toFixed(2)}
                
                <strong>Próximos pasos:</strong>
                • Te contactaremos en los próximos 10 minutos para confirmar
                • Entrega estimada: 30-45 minutos
                • Método de pago: Efectivo o tarjeta al momento de la entrega
                
                ¡Gracias por elegir NutriKitchen! 🥗
                
                ¿Hay algo más en lo que pueda ayudarte?
            `;
            
            this.addBotMessage(confirmation, true);
            this.currentOrder = null;
        }

        // Detección de intenciones
        isGreeting(message) {
            const greetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'hi', 'hello'];
            return greetings.some(greeting => message.includes(greeting));
        }

        isMenuRequest(message) {
            const menuKeywords = ['menú', 'menu', 'comida', 'platos', 'desayuno', 'almuerzo', 'cena', 'opciones'];
            return menuKeywords.some(keyword => message.includes(keyword));
        }

        isPlansRequest(message) {
            const planKeywords = ['plan', 'planes', 'precio', 'costo', 'tarifa', 'suscripción'];
            return planKeywords.some(keyword => message.includes(keyword));
        }

        isOrderRequest(message) {
            const orderKeywords = ['pedido', 'orden', 'comprar', 'ordenar', 'hacer pedido', 'quiero pedir'];
            return orderKeywords.some(keyword => message.includes(keyword));
        }

        isComplaint(message) {
            const complaintKeywords = ['queja', 'problema', 'mal', 'error', 'incorrecto', 'no funciona', 'molestia', 'malo', 'terrible', 'pésimo', 'disgusto'];
            return complaintKeywords.some(keyword => message.includes(keyword));
        }

        isContactRequest(message) {
            const contactKeywords = ['contacto', 'teléfono', 'email', 'dirección', 'ubicación', 'dónde'];
            return contactKeywords.some(keyword => message.includes(keyword));
        }

        isPriceRequest(message) {
            const priceKeywords = ['precio', 'costo', 'cuánto cuesta', 'valor', 'tarifa'];
            return priceKeywords.some(keyword => message.includes(keyword));
        }

        isDeliveryRequest(message) {
            const deliveryKeywords = ['entrega', 'delivery', 'domicilio', 'llegada', 'tiempo de entrega'];
            return deliveryKeywords.some(keyword => message.includes(keyword));
        }

        isHealthRequest(message) {
            const healthKeywords = ['saludable', 'nutrición', 'calorías', 'dieta', 'ingredientes', 'orgánico'];
            return healthKeywords.some(keyword => message.includes(keyword));
        }

        isThankYou(message) {
            const thanks = ['gracias', 'thank you', 'thanks', 'genial', 'perfecto', 'excelente'];
            return thanks.some(thank => message.includes(thank));
        }

        // Handlers de respuestas
        handleGreeting() {
            const responses = [
                "¡Hola! 👋 ¿En qué puedo ayudarte hoy?",
                "¡Buenos días! 🌅 ¿Te gustaría conocer nuestro menú semanal?",
                "¡Hola! 😊 Soy tu asistente de NutriKitchen. ¿Qué te gustaría saber?"
            ];
            this.addBotMessage(responses[Math.floor(Math.random() * responses.length)], true);
        }

        showMenu() {
            const menuMessage = `
                🍽️ <strong>Nuestro Menú Semanal</strong>
                
                <strong>Desayunos:</strong>
                • Bowl de Açaí con Granola - $12.50
                • Tostadas de Aguacate - $10.00
                • Smoothie Verde Energético - $8.50
                
                <strong>Almuerzos:</strong>
                • Ensalada César Saludable - $15.00
                • Bowl de Quinoa Mediterráneo - $16.50
                • Salmón a la Plancha - $22.00
                
                ¿Te gustaría hacer un pedido o conocer nuestros planes semanales?
            `;
            this.addBotMessage(menuMessage, true);
            
            // Scroll automático a la sección del menú
            setTimeout(() => {
                this.scrollToSection('menu');
            }, 2000);
        }

        showPlans() {
            const plansMessage = `
                💰 <strong>Nuestros Planes Semanales</strong>
                
                <strong>Plan Básico - $89/semana</strong>
                • 5 comidas a la semana
                • Menú de almuerzos
                • Entrega programada
                
                <strong>Plan Completo - $129/semana</strong>
                • 5 desayunos + 5 almuerzos
                • Menú personalizado
                • Soporte nutricional
                
                <strong>Plan Premium - $199/semana</strong>
                • 7 desayunos + 7 almuerzos
                • Consulta nutricional incluida
                • Entrega express
                
                ¿Te gustaría que te ayude a elegir el plan ideal para ti?
            `;
            this.addBotMessage(plansMessage, true);
            
            // Scroll automático a la sección de planes
            setTimeout(() => {
                this.scrollToSection('planes');
            }, 2000);
        }

        startOrder() {
            this.currentOrder = {
                items: [],
                total: 0,
                step: 'name'
            };
            
            const orderMessage = `
                🛒 <strong>¡Perfecto! Vamos a hacer tu pedido</strong>
                
                Para comenzar, necesito algunos datos:
                
                ¿Cuál es tu nombre completo?
            `;
            this.addBotMessage(orderMessage, true);
        }

        handleComplaint() {
            this.currentComplaint = {
                step: 'details',
                details: {}
            };
            
            const complaintMessage = `
                😔 <strong>Lamento mucho escuchar eso</strong>
                
                Para ayudarte mejor, necesito algunos detalles:
                
                <strong>¿Cuál fue el problema específico?</strong>
                • Comida fría o en mal estado
                • Entrega tardía
                • Pedido incorrecto
                • Problema con el pago
                • Otro
                
                Por favor, describe el problema que tuviste.
            `;
            this.addBotMessage(complaintMessage, true);
        }

        processComplaintStep(message) {
            if (!this.currentComplaint) return;

            switch (this.currentComplaint.step) {
                case 'details':
                    this.currentComplaint.details.problem = message;
                    this.currentComplaint.step = 'orderNumber';
                    this.addBotMessage(`Entiendo el problema. 📋 Ahora necesito tu número de pedido para poder ayudarte mejor. 

Si no lo tienes, escribe "no tengo" y continuaremos.`, true);
                    break;
                    
                case 'orderNumber':
                    this.currentComplaint.details.orderNumber = message;
                    this.currentComplaint.step = 'contact';
                    this.addBotMessage(`Perfecto. 📞 Para resolver tu queja, necesito tu información de contacto:

• Nombre completo
• Teléfono
• Email (opcional)

Por favor, proporciona tu nombre completo.`, true);
                    break;
                    
                case 'contact':
                    this.currentComplaint.details.customerName = message;
                    this.currentComplaint.step = 'phone';
                    this.addBotMessage(`Gracias. Ahora necesito tu número de teléfono para contactarte.`, true);
                    break;
                    
                case 'phone':
                    this.currentComplaint.details.customerPhone = message;
                    this.finalizeComplaint();
                    break;
            }
        }

        finalizeComplaint() {
            const complaintNumber = Math.floor(Math.random() * 9000) + 1000;
            const finalMessage = `
                📝 <strong>Queja Registrada</strong>
                
                <strong>Número de queja:</strong> #${complaintNumber}
                <strong>Cliente:</strong> ${this.currentComplaint.details.customerName}
                <strong>Teléfono:</strong> ${this.currentComplaint.details.customerPhone}
                <strong>Problema:</strong> ${this.currentComplaint.details.problem}
                <strong>Pedido:</strong> ${this.currentComplaint.details.orderNumber}
                
                <strong>Próximos pasos:</strong>
                • Nuestro equipo revisará tu queja en las próximas 24 horas
                • Te contactaremos al teléfono proporcionado
                • Buscaremos una solución que te satisfaga
                
                También puedes contactarnos directamente:
                📞 +1 (555) 123-4567
                📧 hola@nutrikitchen.com
                
                ¡Gracias por tu paciencia! 🙏
            `;
            
            this.addBotMessage(finalMessage, true);
            this.currentComplaint = null;
        }

        showContactInfo() {
            const contactMessage = `
                📞 <strong>Información de Contacto</strong>
                
                <strong>Teléfono:</strong> +1 (555) 123-4567
                <strong>Email:</strong> hola@nutrikitchen.com
                <strong>Dirección:</strong> Ciudad de México, México
                
                <strong>Horarios de atención:</strong>
                Lunes a Viernes: 8:00 AM - 8:00 PM
                Sábados: 9:00 AM - 6:00 PM
                
                ¿En qué puedo ayudarte específicamente?
            `;
            this.addBotMessage(contactMessage, true);
        }

        showPricing() {
            const pricingMessage = `
                💵 <strong>Nuestros Precios</strong>
                
                <strong>Platos Individuales:</strong>
                • Desayunos: $8.50 - $12.50
                • Almuerzos: $15.00 - $22.00
                
                <strong>Planes Semanales:</strong>
                • Básico: $89/semana
                • Completo: $129/semana
                • Premium: $199/semana
                
                <strong>Descuentos:</strong>
                • 10% en tu primer pedido
                • 15% por pago mensual adelantado
                
                ¿Te gustaría que te ayude a calcular el costo para tu caso específico?
            `;
            this.addBotMessage(pricingMessage, true);
        }

        showDeliveryInfo() {
            const deliveryMessage = `
                🚚 <strong>Información de Entrega</strong>
                
                <strong>Zonas de entrega:</strong>
                • Ciudad de México y área metropolitana
                • Entrega gratuita en pedidos superiores a $50
                
                <strong>Tiempos de entrega:</strong>
                • Desayunos: 6:00 AM - 9:00 AM
                • Almuerzos: 12:00 PM - 2:00 PM
                
                <strong>Programación:</strong>
                • Puedes programar entregas con 24h de anticipación
                • Cambios de horario hasta 2 horas antes
                
                ¿En qué zona vives para confirmar si tenemos entrega disponible?
            `;
            this.addBotMessage(deliveryMessage, true);
        }

        showHealthInfo() {
            const healthMessage = `
                🌱 <strong>Nuestra Filosofía Nutricional</strong>
                
                <strong>Ingredientes:</strong>
                • 100% frescos y orgánicos
                • Sin conservantes artificiales
                • Proteínas magras y vegetales
                
                <strong>Valores nutricionales:</strong>
                • Calorías controladas: 300-600 por comida
                • Proteína: 20-30g por porción
                • Fibra: 8-12g por porción
                
                <strong>Opciones especiales:</strong>
                • Sin gluten
                • Vegetariano
                • Vegano
                • Bajo en carbohidratos
                
                ¿Tienes alguna restricción alimentaria específica?
            `;
            this.addBotMessage(healthMessage, true);
        }

        handleThankYou() {
            const thankYouResponses = [
                "¡De nada! 😊 Me alegra haber podido ayudarte.",
                "¡Es un placer! 🌟 ¿Hay algo más en lo que pueda asistirte?",
                "¡Gracias a ti! 🙏 ¿Te gustaría conocer más sobre nuestros servicios?"
            ];
            this.addBotMessage(thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)], true);
        }

        handleUnknownMessage() {
            const unknownResponses = [
                "No estoy seguro de entender. ¿Podrías reformular tu pregunta?",
                "Disculpa, no tengo esa información. ¿Te puedo ayudar con nuestro menú, planes o contacto?",
                "No entiendo completamente. ¿Te refieres a nuestro menú, precios o servicios de entrega?"
            ];
            this.addBotMessage(unknownResponses[Math.floor(Math.random() * unknownResponses.length)], true);
        }

        scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = section.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Inicializar el chatbot cuando el DOM esté listo
    const chatbot = new NutriKitchenChatbot();
    
    console.log('NutriKitchen - Landing Page cargada exitosamente! 🥗');
    console.log('Chatbot inicializado! 🤖');
}); 