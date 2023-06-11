document.addEventListener('DOMContentLoaded', function () {
    if (!checkLoginStatus()) {
        alert('Please log in to use this feature.')
        window.location.href = 'index.html'
    } else {
        loadMyCollection()
    }
})

function checkLoginStatus() {
    // Check for the existence and value of the login cookie
    const loginCookieValue = getCookie('login')
    return loginCookieValue && loginCookieValue !== 'logged_out'
}

async function loadMyCollection() {
    try {
        const recipeContainer = document.querySelector('.recipe-container')
        recipeContainer.innerHTML = ''
        const response = await axios.get('php/fetch_saved_recipes.php')
        const savedRecipes = response.data
        displaySavedRecipes(savedRecipes)
    } catch (error) {
        console.error('Error: ', error.response.data)
    }
}

function displaySavedRecipes(savedRecipes) {
    const recipeContainer = document.querySelector('.recipe-container')

    savedRecipes.forEach((recipe) => {
        const recipeCard = document.createElement('div')
        recipeCard.classList.add('recipe-card')

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" />
            <h3>${recipe.title}</h3>
            <p>Category: ${recipe.category}</p>
            <p>Cuisine: ${recipe.cuisine}</p>
            <a href="${recipe.source}" target="_blank" rel="noopener noreferrer">View Recipe</a>
            <button class="delete-recipe-btn" data-recipe-id="${recipe.id}">Delete Recipe</button>
        `
        recipeCard
            .querySelector('.delete-recipe-btn')
            .addEventListener('click', function () {
                const recipeId = this.dataset.recipeId
                deleteRecipeFromCollection(recipeId)
            })

        recipeContainer.appendChild(recipeCard)
    })
}

async function deleteRecipeFromCollection(recipeId) {
    try {
        const userId = getCookie('user_id')

        const response = await fetch('php/delete_recipe.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
        })

        if (response.status !== 200) {
            throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
            alert(data.message)
            loadMyCollection()
        } else {
            alert(data.message)
        }
    } catch (error) {
        console.error('Error:', error)
        alert('Failed to delete the recipe.')
    }
}
