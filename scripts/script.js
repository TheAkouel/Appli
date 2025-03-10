// scripts/script.js
document.addEventListener('DOMContentLoaded', () => {
    const pageContainer = document.getElementById('page-container');
    const links = document.querySelectorAll('.nav-link');
    const loadingOverlay = document.getElementById('loading-overlay');
    let currentPageId = 'content-index';

    function showLoading() {
        loadingOverlay.style.display = 'flex';
    }

    function hideLoading() {
        console.log("Page chargée, masquage du loader");
        loadingOverlay.style.display = 'none';
    }
    

    function loadPage(targetPageId, updateHistory = true) {
        console.log("Chargement de la page:", targetPageId); // Test d'appel de la fonction
    
        // Si la page est 'index.html', on n'appelle pas fetch et on cache directement le loader
        if (targetPageId === 'index.html') {
            console.log("Chargement de la page d'accueil, masquage du loader");
            hideLoading();
            return;
        }
    
        showLoading();
        const currentPage = document.getElementById(currentPageId);
        const targetPage = document.getElementById('content-' + targetPageId.replace('.html', ''));
    
        if (!targetPage) {
            console.error("Page cible non trouvée:", 'content-' + targetPageId.replace('.html', ''));
            hideLoading();
            return;
        }
    
        // Mettre à jour l'URL avant la transition, mais seulement si updateHistory est true
        if (updateHistory) {
            history.pushState({ page: targetPageId }, '', targetPageId);
        }
    
        // Si la page est déjà chargée, on fait juste la transition
        if (targetPage.innerHTML.trim().length > 0) {
            transitionPages(currentPage, targetPage);
            return;
        }
    
        // Autres pages (todo.html, weather.html, etc.) chargées via fetch
        fetch(targetPageId)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                targetPage.innerHTML = html;
    
                // Exécuter le script de la page chargée, si elle en a un
                if (targetPageId === 'todo.html') {
                    initTodo(); // Initialise la ToDo List
                } else if (targetPageId === 'weather.html') {
                    initWeather(); // Initialise la météo
                }
                transitionPages(currentPage, targetPage);
            })
            .catch(error => {
                console.error("Erreur lors du chargement de la page:", error);
                targetPage.innerHTML = `<p>Erreur lors du chargement de la page.</p>`;
            })
            .finally(() => {
                hideLoading();
            });
    }
    


    function transitionPages(currentPage, targetPage) {
        anime.timeline({
            easing: 'easeInOutSine',
        })
        .add({
            targets: currentPage,
            translateX: [0, '-100%'],
            opacity: [1, 0],
            duration: 500,
            complete: () => {
                currentPage.style.display = 'none';
                currentPage.style.transform = 'translateX(0)';
            }
        })
        .add({
            targets: targetPage,
            translateX: ['100%', 0],
            opacity: [0, 1],
            duration: 500,
            begin: () => {
                targetPage.style.display = 'block';
            },
        }, '-=500')
        .add({
            targets: '#page-container',
            duration: 500,
            complete: () => {
                 currentPageId = targetPage.id; // Met à jour la page courante
            }
        })
    }



    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetPageId = link.getAttribute('data-target');
            loadPage(targetPageId);
        });
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            const targetPageId = event.state.page;
            const currentPage = document.getElementById(currentPageId);
            const targetPage = document.getElementById('content-' + targetPageId.replace('.html', ''));

            if (targetPage && targetPage !== currentPage) {
                 transitionPages(currentPage, targetPage);
            }
        } else {

            loadPage('index.html', false);  // Ne pas mettre à jour l'historique
        }
    });


     // Charger la page initiale en fonction de l'URL, SANS mettre à jour l'historique
     const initialPage = window.location.pathname.split('/').pop();
     if (initialPage && initialPage !== 'index.html' && initialPage !== '') {
        loadPage(initialPage, false); //  <--  IMPORTANT:  false ici !
     } else {
        loadPage('index.html', false); // Charge la page d'accueil par défaut, sans mettre à jour l'historique
     }

});