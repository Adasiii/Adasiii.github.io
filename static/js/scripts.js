const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications', 'travels'];


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

    // Lightbox for travel images
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeButton = lightbox.querySelector('.lightbox-close');

        const closeLightbox = () => {
            lightbox.classList.remove('is-active');
            lightbox.setAttribute('aria-hidden', 'true');
            if (lightboxImage) {
                lightboxImage.src = '';
                lightboxImage.alt = '';
            }
            document.body.classList.remove('lightbox-open');
        };

        document.addEventListener('click', (event) => {
            const target = event.target;
            if (target instanceof HTMLImageElement && target.closest('.gallery')) {
                if (lightboxImage) {
                    lightboxImage.src = target.src;
                    lightboxImage.alt = target.alt || 'Travel photo';
                }
                lightbox.classList.add('is-active');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.classList.add('lightbox-open');
            }
        });

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        if (closeButton) {
            closeButton.addEventListener('click', closeLightbox);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.classList.contains('is-active')) {
                closeLightbox();
            }
        });
    }

}); 
