import axios from "axios";
const API_URL = 'https://pixabay.com/api/';
const API_KEY = '22647650-093efc913fe4b5bfd764725e8';

export default class ImageService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;

    };

    async fetchImages() {
        const url = `${API_URL}?key = ${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true& per_page=40&page=${this.page}`
        const response = await axios.get(url);
        this.incrementPage()
        return response;
    }



    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}