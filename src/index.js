import './sass/main.scss';
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox"
import ImageService from './js/fetchImages'
import imagesTpl from './templates/card.hbs'
import '../node_modules/simplelightbox/src/simple-lightbox.scss';


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
    

    imageMarkup(response.hits);
     Notiflix.Notify.success(`Hooray! We found ${response.total} images.`)
   
}

async function onloadMoreBtnClick() {
  
  
    const response =  await newApi.fetchImages();
       
    lightbox.refresh();
    
  
imageMarkup(response.hits)
      smoothScroll()

}



function imageMarkup(images) {
    refs.imagesContainer.insertAdjacentHTML('beforeend', imagesTpl(images))
    lightbox.refresh()
      
    refs.loadMoreBtn.classList.remove('is-hidden')
    

    if (images.length === 0) {
        refs.loadMoreBtn.classList.add('is-hidden')
        
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        
    }




}

function checkImagesCount(total, current, per) {
    if (current * per >= total) {
        Notiflix.Notify.info('We are sorry, but you have reached the end of search results.');
        refs.loadMoreBtn.classList.add('is-hidden');
    } else {
        refs.loadMoreBtn.classList.remove('is-hidden');
    }
}

function clearImageContainer() {
    refs.imagesContainer.innerHTML = '';
}

function smoothScroll() {
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    })
}