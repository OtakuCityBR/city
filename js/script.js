// Função para scroll suave até os produtos
function scrollToProducts(event) {
    event.preventDefault();
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// SISTEMA DE POP-UP DE VÍDEO - CORRIGIDO
class VideoPopup {
    constructor() {
        this.helpButton = document.getElementById('helpButton');
        this.videoPopup = document.getElementById('videoPopup');
        this.closePopup = document.getElementById('closePopup');
        this.popupVideo = document.getElementById('popupVideo');

        // Link do vídeo do Vimeo configurado
        this.videoUrl = 'https://player.vimeo.com/video/1098854357?autoplay=1&title=0&byline=0&portrait=0&controls=1';

        this.init();
    }

    init() {
        console.log('Inicializando VideoPopup...');
        console.log('Help Button:', this.helpButton);
        console.log('Video Popup:', this.videoPopup);
        console.log('Close Popup:', this.closePopup);
        console.log('Popup Video:', this.popupVideo);

        if (!this.helpButton) {
            console.error('Botão de ajuda não encontrado! ID: helpButton');
            return;
        }
        
        if (!this.videoPopup) {
            console.error('Overlay do pop-up não encontrado! ID: videoPopup');
            return;
        }
        
        if (!this.closePopup) {
            console.error('Botão de fechar não encontrado! ID: closePopup');
            return;
        }
        
        if (!this.popupVideo) {
            console.error('Iframe do vídeo não encontrado! ID: popupVideo');
            return;
        }

        this.bindEvents();
        console.log('VideoPopup inicializado com sucesso!');
    }

    bindEvents() {
        // Abrir pop-up
        this.helpButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Botão "Como Comprar" clicado!');
            this.openPopup();
        });

        // Fechar pop-up
        this.closePopup.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Botão fechar clicado!');
            this.closePopupHandler();
        });

        // Fechar clicando no overlay
        this.videoPopup.addEventListener('click', (e) => {
            if (e.target === this.videoPopup) {
                console.log('Clicou no overlay - fechando pop-up');
                this.closePopupHandler();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.videoPopup.classList.contains('active')) {
                console.log('ESC pressionado - fechando pop-up');
                this.closePopupHandler();
            }
        });
    }

    openPopup() {
        console.log('Abrindo pop-up...');
        
        // Carrega o vídeo apenas quando abrir
        this.popupVideo.src = this.videoUrl;
        this.videoPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll do fundo
        
        console.log('Pop-up aberto!');
        console.log('Classe active adicionada:', this.videoPopup.classList.contains('active'));
        console.log('URL do vídeo:', this.popupVideo.src);
    }

    closePopupHandler() {
        console.log('Fechando pop-up...');
        
        this.videoPopup.classList.remove('active');
        this.popupVideo.src = ''; // Para o vídeo ao fechar
        document.body.style.overflow = ''; // Restaura scroll do fundo
        
        console.log('Pop-up fechado!');
    }
}

// Carousel functionality
class ImageCarousel {
    constructor() {
        this.carouselTrack = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.carouselIndicators = document.getElementById('carouselIndicators');

        // Verifica se os elementos existem antes de inicializar
        if (!this.carouselTrack || !this.prevBtn || !this.nextBtn || !this.carouselIndicators) {
            console.warn('Elementos do carrossel não encontrados. Carrossel não será inicializado.');
            return;
        }

        this.slides = Array.from(this.carouselTrack.children);
        
        // Verifica se há slides antes de continuar
        if (this.slides.length === 0) {
            console.warn('Nenhum slide encontrado no carrossel.');
            return;
        }
        
        this.slideWidth = this.slides[0].offsetWidth; // Initial width
        this.currentIndex = 0;
        this.intervalTime = 4000; // 4 seconds
        this.autoSlideInterval = null;

        this.init();
    }

    init() {
        this.createIndicators();
        this.updateIndicators();
        this.setupEventListeners();
        this.startAutoSlide();
        this.adjustSlideWidth(); // Adjust width initially
        window.addEventListener('resize', this.adjustSlideWidth.bind(this));
    }

    adjustSlideWidth() {
        // Recalculate slide width on resize
        if (this.slides.length === 0) return;
        this.slideWidth = this.slides[0].offsetWidth;
        this.moveToSlide(this.currentIndex, false); // Reposition without animation
    }

    createIndicators() {
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (index === 0) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                this.moveToSlide(index);
                this.resetAutoSlide();
            });
            this.carouselIndicators.appendChild(indicator);
        });
    }

    updateIndicators() {
        Array.from(this.carouselIndicators.children).forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    moveToSlide(index, animate = true) {
        if (index < 0) {
            this.currentIndex = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = index;
        }

        const offset = -this.currentIndex * this.slideWidth;
        this.carouselTrack.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
        this.carouselTrack.style.transform = `translateX(${offset}px)`;
        this.updateIndicators();
    }

    nextSlide() {
        this.moveToSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.moveToSlide(this.currentIndex - 1);
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.intervalTime);
    }

    resetAutoSlide() {
        clearInterval(this.autoSlideInterval);
        this.startAutoSlide();
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoSlide();
        });

        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.resetAutoSlide();
        });

        // Pause auto-slide on hover
        this.carouselTrack.addEventListener('mouseenter', () => clearInterval(this.autoSlideInterval));
        this.carouselTrack.addEventListener('mouseleave', () => this.startAutoSlide());
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado - inicializando componentes...');
    
    // Inicializa o pop-up de vídeo
    const videoPopup = new VideoPopup();
    
    // Inicializa o carrossel (apenas se os elementos existirem)
    const carousel = new ImageCarousel();
    
    console.log('Todos os componentes inicializados!');
});

// Função para navegação suave (pode ser usada em outras páginas)
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para voltar à página anterior
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
}

// Função para detectar se é mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para otimizar performance em dispositivos móveis
function optimizeForMobile() {
    if (isMobile()) {
        // Reduz animações em dispositivos móveis
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        
        // Desabilita hover em dispositivos touch
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                .carousel-item:hover,
                .cta-button:hover,
                .whatsapp-button:hover {
                    transform: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Otimizações de performance
window.addEventListener('load', () => {
    optimizeForMobile();
    
    // Preload de imagens críticas
    const criticalImages = [
        'https://i.ibb.co/5fx7ydb/OC.png',
        'https://i.ibb.co/y3wvPbx/OCT.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Lazy loading para imagens do carrossel
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Inicializar lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);
// SISTEMA ONE PIECE SLIDER - OTIMIZADO
/**
 * CLASSE ONE PIECE SLIDER
 * 
 * COMO ADAPTAR PARA OUTROS ANIMES:
 * 1. Alterar o array 'this.images' com as URLs das imagens do novo anime
 * 2. Modificar as mensagens do WhatsApp (método setupEventListeners)
 * 3. Personalizar cores no CSS (variáveis CSS ou classes específicas)
 * 4. Ajustar textos e emojis no HTML conforme o tema do anime
 * 5. Renomear a classe e IDs se necessário (ex: NarutoSlider, DragonBallSlider)
 */
class OnePieceSlider {
    constructor() {
        // ALTERAR: Lista de imagens do anime específico
        // Para adaptar: Substituir todas as URLs pelas imagens do novo anime
        this.images = [
            "https://i.ibb.co/ksbt0y0w/OP-1.jpg",
            "https://i.ibb.co/xSmzBw27/OP-2.jpg",
            "https://i.ibb.co/jScdwdG/OP-3.jpg",
            "https://i.ibb.co/S7Mt7QYb/OP-4.jpg",
            "https://i.ibb.co/4g0gZMp8/OP-5.jpg",
            "https://i.ibb.co/RpncjJ3P/OP-6.jpg",
            "https://i.ibb.co/n8g8z1bt/OP-7.jpg",
            "https://i.ibb.co/KzWvYhhC/OP-8.jpg",
            "https://i.ibb.co/ZpsDvJGC/OP-9.jpg",
            "https://i.ibb.co/sppZsTZY/OP-10.jpg",
            "https://i.ibb.co/xqHNtpj5/OP-11.jpg",
            "https://i.ibb.co/m5BW96Wq/OP-12.jpg",
            "https://i.ibb.co/kVhP5X4V/OP-13.jpg",
            "https://i.ibb.co/6dLqbtR/OP-14.jpg",
            "https://i.ibb.co/Kjdq2jXj/OP-15.jpg",
            "https://i.ibb.co/p6vd5bkj/OP-16.jpg",
            "https://i.ibb.co/pvYWCfwd/OP-17.jpg",
            "https://i.ibb.co/fzZV51VM/OP-18.jpg",
            "https://i.ibb.co/FLnXhTsH/OP-19.jpg",
            "https://i.ibb.co/Vcg3VvnT/OP-20.jpg",
            "https://i.ibb.co/Z6pr2szn/OP-21.jpg",
            "https://i.ibb.co/Jj9PrTZL/OP-22.jpg",
            "https://i.ibb.co/W4t13QbJ/OP-23.jpg",
            "https://i.ibb.co/LDsq8F8M/OP-24.jpg",
            "https://i.ibb.co/SwnK28n4/OP-25.jpg",
            "https://i.ibb.co/bMkJgRDM/OP-26.jpg",
            "https://i.ibb.co/8LN9qZyH/OP-27.jpg",
            "https://i.ibb.co/RFXRBm8/OP-28.jpg",
            "https://i.ibb.co/zVdypxFp/OP-29.jpg",
            "https://i.ibb.co/BVCWVXZX/OP-30.jpg",
            "https://i.ibb.co/3ysQZTbq/OP-31.jpg",
            "https://i.ibb.co/4gVYfBRB/OP-32.jpg",
            "https://i.ibb.co/wN8Q1NSX/OP-33.jpg",
            "https://i.ibb.co/5h0TCP6H/OP-34.jpg",
            "https://i.ibb.co/zV7WZDvj/OP-35.jpg",
            "https://i.ibb.co/S4HjfL6X/OP-36.jpg",
            "https://i.ibb.co/v4K6RssB/OP-37.jpg",
            "https://i.ibb.co/fzWc1Rdg/OP-38.jpg",
            "https://i.ibb.co/b51pjL5Q/OP-39.jpg",
            "https://i.ibb.co/PzQNdBnQ/OP-40.jpg",
            "https://i.ibb.co/4ZC9tLys/OP-41.jpg",
            "https://i.ibb.co/1Yz0m5hp/OP-42.jpg",
            "https://i.ibb.co/4wrSrCM3/OP-43.jpg",
            "https://i.ibb.co/3YCXxWLS/OP-45.jpg",
            "https://i.ibb.co/RLkHL4J/OP-46.jpg",
            "https://i.ibb.co/m5Rfb6B2/OP-47.jpg",
            "https://i.ibb.co/C5bFfhS7/OP-48.jpg",
            "https://i.ibb.co/vxVgK7Zz/OP-49.jpg",
            "https://i.ibb.co/1JYL5Btk/OP-50.jpg",
            "https://i.ibb.co/C3Czq8fC/OP-51.jpg",
            "https://i.ibb.co/JwP6pZR5/OP-52.jpg",
            "https://i.ibb.co/nNgVNSCy/OP-53.jpg",
            "https://i.ibb.co/v6FBtyKm/OP-54.jpg",
            "https://i.ibb.co/JRPnT3LY/OP-55.jpg",
            "https://i.ibb.co/spQCZvmv/OP-56.jpg",
            "https://i.ibb.co/0psSbdQD/OP-57.jpg"
        ];

        // Configurações do slider
        this.currentIndex = 0;
        this.loadingHidden = false;
        this.imageCache = new Map();
        this.preloadedImages = new Set();
        
        // IMPORTANTE: Elementos DOM - manter os mesmos IDs em todas as páginas
        // Para adaptar: Verificar se os IDs existem no HTML da nova página
        this.sliderTrack = document.getElementById('sliderTrack');
        this.whatsappBtn = document.getElementById('whatsappBtn');
        this.loadingContainer = document.getElementById('loadingContainer');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentPosition = document.getElementById('currentPosition');
        this.totalImages = document.getElementById('totalImages');
        this.preloadContainer = document.getElementById('preloadContainer');

        // VERIFICAÇÃO: Confirma se estamos na página correta
        // Para adaptar: Manter esta verificação em todas as páginas de slider
        if (!this.sliderTrack || !this.whatsappBtn) {
            console.log('Elementos do slider não encontrados - não inicializando');
            return; // Não inicializar se não estivermos na página correta
        }

        this.init();
    }

    /**
     * INICIALIZAÇÃO DO SLIDER
     * Método principal que configura todo o sistema
     */
    init() {
        console.log('Inicializando OnePieceSlider...');
        
        // CONFIGURAÇÃO: Define o total de imagens no indicador
        if (this.totalImages) {
            this.totalImages.textContent = this.images.length;
        }
        
        // PERFORMANCE: Pré-carrega as primeiras imagens para carregamento rápido
        this.preloadInitialImages();
        
        // CRIAÇÃO: Gera os elementos HTML dos slides dinamicamente
        this.createSlides();
        
        // EVENTOS: Configura todos os listeners (cliques, toques, teclado)
        this.setupEventListeners();
        
        // POSICIONAMENTO: Define a posição inicial do slider
        this.updateSliderPosition();
        
        // OTIMIZAÇÃO: Inicia carregamento das demais imagens em background
        this.startBackgroundPreload();
        
        console.log('OnePieceSlider inicializado com sucesso!');
    }

    /**
     * PRÉ-CARREGAMENTO INICIAL
     * Carrega as primeiras 5 imagens para navegação instantânea
     */
    preloadInitialImages() {
        // PERFORMANCE: Carrega apenas as primeiras imagens para início rápido
        const initialCount = Math.min(5, this.images.length);
        
        for (let i = 0; i < initialCount; i++) {
            this.preloadImage(this.images[i]);
        }
    }

    /**
     * PRÉ-CARREGAMENTO DE IMAGEM INDIVIDUAL
     * @param {string} src - URL da imagem a ser carregada
     * @returns {Promise} - Promise que resolve quando a imagem carrega
     */
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            // CACHE: Verifica se a imagem já está em cache
            if (this.imageCache.has(src)) {
                resolve(this.imageCache.get(src));
                return;
            }

            // CARREGAMENTO: Cria nova imagem e configura eventos
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(src, img);
                this.preloadedImages.add(src);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
            
            // CACHE DO NAVEGADOR: Adiciona ao DOM invisível para cache
            if (this.preloadContainer) {
                const preloadImg = img.cloneNode();
                this.preloadContainer.appendChild(preloadImg);
            }
        });
    }

    /**
     * PRÉ-CARREGAMENTO EM BACKGROUND
     * Carrega todas as imagens restantes após a inicialização
     */
    startBackgroundPreload() {
        // OTIMIZAÇÃO: Delay para não interferir no carregamento inicial
        setTimeout(() => {
            this.images.forEach((src, index) => {
                if (!this.preloadedImages.has(src)) {
                    // THROTTLING: Delay progressivo para não sobrecarregar a conexão
                    setTimeout(() => {
                        this.preloadImage(src);
                    }, index * 100);
                }
            });
        }, 1000);
    }

    /**
     * CRIAÇÃO DOS SLIDES
     * Gera dinamicamente os elementos HTML para cada imagem
     */
    createSlides() {
        this.images.forEach((imgSrc, index) => {
            // CRIAÇÃO: Elemento slide individual
            const slide = document.createElement('div');
            slide.className = 'onepiece-slide';
            slide.dataset.index = index;
            
            // CRIAÇÃO: Elemento de imagem
            const img = document.createElement('img');
            
            // OTIMIZAÇÃO: Carregamento inteligente baseado em cache e posição
            if (this.imageCache.has(imgSrc)) {
                // Imagem já em cache - carrega imediatamente
                img.src = imgSrc;
            } else if (index < 3) {
                // Primeiras 3 imagens - carrega imediatamente
                img.src = imgSrc;
            } else {
                // Demais imagens - lazy loading
                img.dataset.src = imgSrc;
                img.loading = "lazy";
            }
            
            // ACESSIBILIDADE: Alt text descritivo
            // ALTERAR: Personalizar alt text conforme o anime
            img.alt = `One Piece - Placa decorativa ${index + 1}`;
            
            // MONTAGEM: Adiciona imagem ao slide e slide ao track
            slide.appendChild(img);
            this.sliderTrack.appendChild(slide);
            
            // POSICIONAMENTO: Define posição vertical inicial (100% = uma tela)
            slide.style.transform = `translateY(${index * 100}%)`;
        });
    }

    /**
     * ATUALIZAÇÃO DA POSIÇÃO DO SLIDER
     * Move o slider para mostrar a imagem atual
     */
    updateSliderPosition() {
        // ANIMAÇÃO: Move o track verticalmente para mostrar a imagem atual
        this.sliderTrack.style.transform = `translateY(-${this.currentIndex * 100}%)`;
        
        // INTERFACE: Atualiza o contador de posição
        if (this.currentPosition) {
            this.currentPosition.textContent = this.currentIndex + 1;
        }
        
        // OTIMIZAÇÃO: Pré-carrega imagens próximas para navegação suave
        this.preloadNearbyImages();
        
        // INTERFACE: Esconde loading quando chega na primeira imagem
        if (this.currentIndex === 0 && !this.loadingHidden) {
            this.hideLoading();
        }
    }

    /**
     * PRÉ-CARREGAMENTO DE IMAGENS PRÓXIMAS
     * Carrega imagens adjacentes para navegação suave
     */
    preloadNearbyImages() {
        // OTIMIZAÇÃO: Define quais imagens carregar (anterior e próximas 2)
        const indicesToPreload = [
            this.currentIndex - 1,
            this.currentIndex + 1,
            this.currentIndex + 2
        ].filter(index => index >= 0 && index < this.images.length);

        // CARREGAMENTO: Pré-carrega cada imagem se ainda não foi carregada
        indicesToPreload.forEach(index => {
            const src = this.images[index];
            if (!this.preloadedImages.has(src)) {
                this.preloadImage(src);
            }
        });
    }

    /**
     * NAVEGAÇÃO: PRÓXIMA IMAGEM
     * Move para a próxima imagem se disponível
     */
    nextImage() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateSliderPosition();
            this.loadCurrentImage();
        }
    }

    /**
     * NAVEGAÇÃO: IMAGEM ANTERIOR
     * Move para a imagem anterior se disponível
     */
    prevImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSliderPosition();
            this.loadCurrentImage();
        }
    }

    /**
     * CARREGAMENTO DA IMAGEM ATUAL
     * Força o carregamento da imagem sendo visualizada (lazy loading)
     */
    loadCurrentImage() {
        const currentSlide = this.sliderTrack.children[this.currentIndex];
        const img = currentSlide.querySelector('img');
        
        // LAZY LOADING: Carrega imagem se ainda não foi carregada
        if (img && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }

    /**
     * INTERFACE: ESCONDER LOADING
     * Remove a tela de carregamento
     */
    hideLoading() {
        if (!this.loadingHidden && this.loadingContainer) {
            this.loadingContainer.classList.add('hidden');
            this.loadingHidden = true;
            console.log('Loading escondido!');
        }
    }

    /**
     * CONFIGURAÇÃO DE EVENTOS
     * Configura todos os listeners de interação do usuário
     */
    setupEventListeners() {
        // NAVEGAÇÃO: Botões de seta
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextImage());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevImage());
        }

        // MOBILE: Gestos de toque para navegação
        let startY = 0;
        let isDragging = false;
        
        // TOQUE: Início do gesto
        this.sliderTrack.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
            this.sliderTrack.style.transition = 'none';
        }, { passive: true });
        
        // TOQUE: Movimento do dedo
        this.sliderTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const moveY = e.touches[0].clientY;
            const diffY = moveY - startY;
            // FEEDBACK VISUAL: Move o slider conforme o dedo
            this.sliderTrack.style.transform = `translateY(calc(-${this.currentIndex * 100}% + ${diffY}px))`;
        }, { passive: true });
        
        // TOQUE: Fim do gesto - decide se muda de imagem
        this.sliderTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endY = e.changedTouches[0].clientY;
            const diffY = endY - startY;
            
            // RESTAURA: Transição suave
            this.sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // DECISÃO: Muda imagem se o movimento foi suficiente (50px)
            if (diffY < -50 && this.currentIndex < this.images.length - 1) {
                // Deslizou para cima - próxima imagem
                this.nextImage();
            } else if (diffY > 50 && this.currentIndex > 0) {
                // Deslizou para baixo - imagem anterior
                this.prevImage();
            } else {
                // Movimento insuficiente - volta à posição original
                this.updateSliderPosition();
            }
        }, { passive: true });

        // DESKTOP: Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevImage();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextImage();
            }
        });

        // WHATSAPP: Configuração do botão de contato
        // ALTERAR: Personalizar mensagem conforme o anime
        if (this.whatsappBtn) {
            this.whatsappBtn.addEventListener('click', () => {
                const currentImageUrl = this.images[this.currentIndex];
                // PERSONALIZAR: Mensagem específica do anime
                const message = `🏴‍☠️ Olá! Quero esta placa do One Piece: ${currentImageUrl}`;
                const whatsappUrl = `https://wa.me/5511958588616?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            });
        }

        // LOADING: Esconde quando primeira imagem carrega
        const firstImage = this.sliderTrack.querySelector('img');
        if (firstImage) {
            firstImage.onload = () => this.hideLoading();
            firstImage.onerror = () => this.hideLoading();
        }
        
        // FALLBACK: Esconde loading após 3 segundos mesmo se imagem não carregar
        setTimeout(() => this.hideLoading(), 3000);
    }
}

/**
 * INICIALIZAÇÃO AUTOMÁTICA
 * Detecta se estamos na página correta e inicializa o slider
 * 
 * PARA ADAPTAR:
 * 1. Manter esta estrutura em todas as páginas de slider
 * 2. Alterar o nome da classe se necessário
 * 3. Verificar se o ID 'sliderTrack' existe na nova página
 */
document.addEventListener('DOMContentLoaded', () => {
    // DETECÇÃO: Verifica se estamos numa página de slider
    if (document.getElementById('sliderTrack')) {
        console.log('Página de slider detectada - inicializando...');
        // INICIALIZAÇÃO: Cria nova instância do slider
        const onePieceSlider = new OnePieceSlider();
    }
});