// Importing required modules
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Setting up middleware
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(express.static('public')); // Serve static files from 'public' directory

// Route to render the homepage
app.get('/', async (req, res) => {
  try {
    // Fetch random cocktail from CocktailDB API
    const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const cocktail = response.data.drinks[0];

    // Extract ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`] || '';
      if (ingredient) {
        ingredients.push({ ingredient, measure });
      } else {
        break;
      }
    }

    // Render the EJS template with cocktail data
    res.render('index', {
      cocktail: {
        name: cocktail.strDrink,
        instructions: cocktail.strInstructions,
        image: cocktail.strDrinkThumb,
        ingredients
      },
      error: null
    });
  } catch (error) {
    // Handle errors (e.g., API failure)
    console.error('Error fetching cocktail:', error.message);
    res.render('index', {
      cocktail: null,
      error: 'Failed to fetch a cocktail. Please try again later.'
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});