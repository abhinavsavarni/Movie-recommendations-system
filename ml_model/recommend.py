import sys
import json
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import requests
import os
from dotenv import load_dotenv # type: ignore

load_dotenv()

TMDB_API_KEY = os.getenv('TMDB_API_KEY')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

def fetch_movie_data():
    """Fetch movie data from TMDB API"""
    movies = []
    page = 1
    
    while len(movies) < 1000:  # Limit to 1000 movies for this example
        response = requests.get(
            f'{TMDB_BASE_URL}/movie/popular',
            params={
                'api_key': TMDB_API_KEY,
                'page': page
            }
        )
        data = response.json()
        
        if not data['results']:
            break
            
        movies.extend(data['results'])
        page += 1
    
    return movies

def create_movie_features(movies):
    """Create feature vectors for movies"""
    # Combine relevant features for each movie
    features = []
    for movie in movies:
        feature = f"{movie['title']} {movie['overview']}"
        if 'genres' in movie:
            feature += ' ' + ' '.join(genre['name'] for genre in movie['genres'])
        features.append(feature)
    
    return features

def get_recommendations(movie_id, n_recommendations=5):
    """Get movie recommendations based on content similarity"""
    try:
        # Fetch movies data
        movies = fetch_movie_data()
        
        # Create feature vectors
        features = create_movie_features(movies)
        
        # Create TF-IDF matrix
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(features)
        
        # Calculate cosine similarity
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        
        # Find the index of the input movie
        movie_indices = {movie['id']: idx for idx, movie in enumerate(movies)}
        if movie_id not in movie_indices:
            return []
        
        idx = movie_indices[movie_id]
        
        # Get similarity scores
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:n_recommendations+1]
        
        # Get movie indices
        movie_indices = [i[0] for i in sim_scores]
        
        # Return recommended movies
        recommendations = [movies[i] for i in movie_indices]
        
        # Format recommendations
        formatted_recommendations = []
        for movie in recommendations:
            formatted_recommendations.append({
                'id': movie['id'],
                'title': movie['title'],
                'poster_path': movie['poster_path'],
                'vote_average': movie['vote_average']
            })
        
        return formatted_recommendations
    
    except Exception as e:
        print(f"Error in get_recommendations: {str(e)}")
        return []

if __name__ == '__main__':
    if len(sys.argv) > 1:
        movie_id = int(sys.argv[1])
        recommendations = get_recommendations(movie_id)
        print(json.dumps(recommendations))
    else:
        print(json.dumps([])) 