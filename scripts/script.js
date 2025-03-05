// scripts/script.js
document.addEventListener('DOMContentLoaded', () => {

    const pageContainer = document.getElementById('page-container');
    const links = document.querySelectorAll('.nav-link');
    const loadingOverlay = document.getElementById('loading-overlay');
    let currentPageId = 'content-index'; // Page initiale

    function showLoading() {
        loadingOverlay.style.display = 'flex';
    }

    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }


   // scripts/script.js (modifications)

function loadPage(targetPageId) {
    showLoading();
    const currentPage = document.getElementById(currentPageId);
    const targetPage = document.getElementById('content-' + targetPageId.replace('.html', ''));

    // Vérification supplémentaire pour éviter les boucles
    if (targetPage === currentPage) {
        hideLoading(); // Important: Masquer le chargement si on est déjà sur la bonne page
        return;
    }
     // Mettre à jour l'URL (pour l'historique) AVANT la transition
     history.pushState({ page: targetPageId }, '', targetPageId);

    // Si la page est deja charge on fait juste la transition
    if(targetPage.innerHTML.trim().length > 0){
        transitionPages(currentPage, targetPage);
        return;
    }

     fetch(targetPageId)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            targetPage.innerHTML = html;
             transitionPages(currentPage, targetPage);

            const scriptSrc = targetPage.querySelector('script')?.src;
            if(scriptSrc) {
              const script = document.createElement('script');
              script.src = scriptSrc;
              document.body.appendChild(script);
            }

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
            currentPage.style.transform = 'translateX(0)'; // Reset
        }
    })
    .add({
        targets: targetPage,
        translateX: ['100%', 0],
        opacity: [0, 1],
        duration: 500,
        begin: () => {
            targetPage.style.display = 'block'; //Utiliser 'block' si ce n'est pas une flexbox
        }
    }, '-=500');

    currentPageId = targetPage.id; // Met à jour la page courante à la FIN de la transition
}

window.addEventListener('popstate', (event) => {

    if (event.state && event.state.page) {
        const targetPageId = event.state.page;
        const currentPage = document.getElementById(currentPageId);
        const targetPage = document.getElementById('content-' + targetPageId.replace('.html', ''));

         // Vérification pour éviter les transitions inutiles.
        if (targetPage && targetPage !== currentPage) {
             transitionPages(currentPage, targetPage);
        }
    } else {
        loadPage('index.html');
    }
});

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetPageId = link.getAttribute('data-target');

            loadPage(targetPageId);

            // Mettre à jour l'URL (pour l'historique)
            history.pushState({ page: targetPageId }, '', targetPageId);
        });
    });

    // Gérer le bouton "Précédent"
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            const targetPageId = event.state.page;
            const currentPage = document.getElementById(currentPageId);
             // Correction ici: Supprimer .html de targetPageId
            const targetPage = document.getElementById('content-' + targetPageId.replace('.html', ''));

            if (targetPage) {
               transitionPages(currentPage, targetPage);
            }
        } else {
            // Gérer le cas où l'état est null (par exemple, retour à la page d'accueil)
            loadPage('index.html'); // Ou une autre page par défaut.
        }
    });

      // Gérer la navigation initiale basée sur l'URL.
    const initialPage = window.location.pathname.split('/').pop().replace('.html', ''); // Extrait "weather" de "/weather.html"

    if (initialPage && initialPage !== 'index') {
         loadPage(initialPage + ".html"); // Charge la page si ce n'est pas index.html
    }
});