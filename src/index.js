import './sass/main.scss';
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox"
import ImageService from './js/fetchImages'
import imagesTpl from './templates/card.hbs'


const refs = {
    searchForm: document.querySelector('.search-form'),
    imagesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

const lightbox = new SimpleLightbox('.photo-card a');
refs.searchForm.addEventListener('submit', onSearch)
refs.loadMoreBtn.addEventListener('click', onloadMoreBtnClick)

const newApi = new ImageService();


async function onSearch(e) {
    e.preventDefault();

    newApi.query = e.currentTarget.elements.searchQuery.value;

    if (newApi.query === '') {
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }

    newApi.resetPage();

    const response = await newApi.fetchImages();

    clearImageContainer();

    return await imageMarkup(response);
}

async function onloadMoreBtnClick() {
    const response = await newApi.fetchImages();
    lightbox.refresh()
    return imageMarkup(response);

}



function imageMarkup(images) {
    refs.imagesContainer.insertAdjacentHTML('beforeend', imagesTpl(images))
    lightbox.refresh()
    refs.loadMoreBtn.classList.remove('is-hidden')

    if (images.length === 0) {
        refs.loadMoreBtn.classList.add('is-hidden')
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }



    if (images.length < 40) {
        refs.loadMoreBtn.classList.add('is-hidden')
        Notiflix.Notify.info('We are sorry, but you have reached the end of search results.');
    }
}

function clearImageContainer() {
    refs.imagesContainer.innerHTML = '';
}
