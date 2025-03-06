import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RecipeContext = createContext();

// Sample recipe data
const sampleRecipes = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish made with eggs, cheese, pancetta, and black pepper.',
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    categories: ['Italian', 'Pasta', 'Main Course'],
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale, diced',
      '4 large eggs',
      '100g Pecorino Romano cheese, grated',
      '100g Parmigiano-Reggiano cheese, grated',
      'Freshly ground black pepper',
      'Salt'
    ],
    instructions: [
      'Bring a large pot of salted water to boil.',
      'Cook spaghetti according to package instructions.',
      'While pasta cooks, fry pancetta until crispy.',
      'In a bowl, whisk eggs, grated cheeses, and black pepper.',
      'Drain pasta, reserving some pasta water.',
      'Quickly mix hot pasta with egg mixture and pancetta.',
      'Add pasta water if needed for creaminess.',
      'Serve immediately with extra cheese and pepper.'
    ],
    image: 'https://cdn.pixabay.com/photo/2020/05/11/21/57/spaghetti-5160837_1280.jpg'
  },
  {
    id: '2',
    title: 'Homemade Margherita Pizza',
    description: 'A classic Neapolitan pizza with fresh tomatoes, mozzarella, and basil.',
    cookingTime: 45,
    servings: 2,
    difficulty: 'Easy',
    categories: ['Italian', 'Pizza', 'Vegetarian'],
    ingredients: [
      '300g pizza dough',
      '200g San Marzano tomatoes',
      '200g fresh mozzarella',
      'Fresh basil leaves',
      'Extra virgin olive oil',
      'Salt and pepper'
    ],
    instructions: [
      'Preheat oven to 250°C/480°F with pizza stone.',
      'Roll out pizza dough on floured surface.',
      'Spread crushed tomatoes on dough.',
      'Add torn mozzarella pieces.',
      'Bake for 12-15 minutes until crust is golden.',
      'Top with fresh basil and olive oil.',
      'Season with salt and pepper.'
    ],
    image: 'https://cdn.pixabay.com/photo/2020/06/08/16/49/pizza-5275191_1280.jpg'
  }
];

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : sampleRecipes;
  });
  const [collections, setCollections] = useState(() => {
    const savedCollections = localStorage.getItem(`collections_${user?.id}`);
    return savedCollections ? JSON.parse(savedCollections) : [];
  });
  const [ratings, setRatings] = useState(() => {
    const savedRatings = localStorage.getItem(`ratings_${user?.id}`);
    return savedRatings ? JSON.parse(savedRatings) : {};
  });
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem(`reviews_${user?.id}`);
    return savedReviews ? JSON.parse(savedReviews) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    if (!user) return [];
    const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Update favorites when user changes
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Persist favorites to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
    if (user?.id) {
      localStorage.setItem(`collections_${user.id}`, JSON.stringify(collections));
      localStorage.setItem(`ratings_${user.id}`, JSON.stringify(ratings));
      localStorage.setItem(`reviews_${user.id}`, JSON.stringify(reviews));
    }
  }, [recipes, collections, ratings, reviews, user?.id]);

  // Recipe Management
  const addRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecipes(prev => [...prev, newRecipe]);
    return newRecipe.id;
  };

  const updateRecipe = (recipeId, updates) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === recipeId
          ? { ...recipe, ...updates, updatedAt: new Date().toISOString() }
          : recipe
      )
    );
  };

  const deleteRecipe = (recipeId) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
  };

  // Collection Management
  const createCollection = (name, description = '') => {
    const newCollection = {
      id: Date.now().toString(),
      name,
      description,
      recipes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCollections(prev => [...prev, newCollection]);
    return newCollection.id;
  };

  const updateCollection = (collectionId, updates) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === collectionId
          ? { ...collection, ...updates, updatedAt: new Date().toISOString() }
          : collection
      )
    );
  };

  const deleteCollection = (collectionId) => {
    setCollections(prev => prev.filter(collection => collection.id !== collectionId));
  };

  const addToCollection = (collectionId, recipeId) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === collectionId && !collection.recipes.includes(recipeId)
          ? {
              ...collection,
              recipes: [...collection.recipes, recipeId],
              updatedAt: new Date().toISOString(),
            }
          : collection
      )
    );
  };

  const removeFromCollection = (collectionId, recipeId) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === collectionId
          ? {
              ...collection,
              recipes: collection.recipes.filter(id => id !== recipeId),
              updatedAt: new Date().toISOString(),
            }
          : collection
      )
    );
  };

  // Rating System
  const rateRecipe = (recipeId, rating) => {
    setRatings(prev => ({
      ...prev,
      [recipeId]: rating,
    }));
  };

  const getAverageRating = (recipeId) => {
    const allRatings = Object.values(ratings).filter(r => r.recipeId === recipeId);
    if (allRatings.length === 0) return 0;
    return allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
  };

  // Review System
  const addReview = (recipeId, content) => {
    const newReview = {
      id: Date.now().toString(),
      recipeId,
      userId: user?.id,
      userName: user?.name,
      userAvatar: user?.avatar,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReviews(prev => [...prev, newReview]);
    return newReview.id;
  };

  const updateReview = (reviewId, content) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, content, updatedAt: new Date().toISOString() }
          : review
      )
    );
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const getRecipeReviews = (recipeId) => {
    return reviews.filter(review => review.recipeId === recipeId);
  };

  // Social Sharing
  const shareRecipe = async (recipeId, platform) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const shareUrl = `${window.location.origin}/recipes/${recipeId}`;
    const shareText = `Check out this amazing recipe for ${recipe.title}!`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(recipe.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share({
              title: recipe.title,
              text: shareText,
              url: shareUrl,
            });
          } catch (error) {
            console.error('Error sharing:', error);
          }
        }
    }
  };

  // Favorites Management
  const toggleFavorite = async (recipeId) => {
    if (!user) return; // Don't allow toggling if not logged in
    
    try {
      // Simulate a delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setFavorites(prev => {
        const newFavorites = prev.includes(recipeId)
          ? prev.filter(id => id !== recipeId)
          : [...prev, recipeId];
        
        // Persist to localStorage
        if (user) {
          localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
        }
        
        return newFavorites;
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error; // Re-throw to handle in component
    }
  };

  const value = {
    recipes,
    collections,
    ratings,
    reviews,
    favorites,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    rateRecipe,
    getAverageRating,
    addReview,
    updateReview,
    deleteReview,
    getRecipeReviews,
    shareRecipe,
    toggleFavorite,
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export default RecipeProvider;