from bs4 import BeautifulSoup
import requests

def get_movies_for_page(page_num):
    url = (f'https://www.imdb.com/list/ls063676189/?sort=list_order,asc&st_dt=&mode=detail&page={page_num}')
    page_html = requests.get(url).content
    soup = BeautifulSoup(page_html, 'html.parser')
    movies = soup.find_all(class_='lister-item mode-detail')
    movie_data = []
    for movie in movies:
        parsed_movie = parse_movie(movie)
        if parsed_movie is not None:
            movie_data.append(parsed_movie)
    return movie_data

def parse_movie(movieElement):
    img_elem = movieElement.find('img')
    src = img_elem.get('src', None)
    title = img_elem.get('alt', None)
    if src is None or title is None:
        return None
    return {
        "title": title,
        "image": src
    }

movies = []
for page_num in range(1, 51):
    movies = get_movies_for_page(1)