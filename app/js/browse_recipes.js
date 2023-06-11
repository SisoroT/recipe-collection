async function fetchRandomRecipes() {
    const recipeContainer = document.querySelector('.recipe-container')

    for (let i = 0; i < 10; i++) {
        try {
            const response = await axios.get(
                'https://www.themealdb.com/api/json/v1/1/random.php'
            )

            const meal = response.data.meals[0]
            const recipeCard = document.createElement('div')
            recipeCard.classList.add('recipe-card')

            recipeCard.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <p>Category: ${meal.strCategory}</p>
                <p>Cuisine: ${meal.strArea}</p>
                <a href="${meal.strSource}" target="_blank" rel="noopener noreferrer">View Recipe</a>
                <button class="save-recipe-btn">Save Recipe</button>
            `

            recipeContainer.appendChild(recipeCard)
        } catch (error) {
            console.error(error)
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchRandomRecipes().then(() => {
        const saveRecipeBtns = document.querySelectorAll('.save-recipe-btn')
        saveRecipeBtns.forEach((btn) => {
            btn.addEventListener('click', function (event) {
                if (checkLoginStatus()) {
                    saveRecipe(event.target)
                } else {
                    alert('Please log in to use this feature.')
                }
            })
        })
    })
})

function checkLoginStatus() {
    // Check for the existence and value of the login cookie
    const loginCookieValue = getCookie('login')
    return loginCookieValue && loginCookieValue !== 'logged_out'
}

async function saveRecipe(target) {
    const recipeCard = target.parentElement
    const title = recipeCard.querySelector('h3').textContent
    const image = recipeCard.querySelector('img').getAttribute('src')
    const category = recipeCard
        .querySelector('p:nth-child(3)')
        .textContent.replace('Category: ', '')
    const cuisine = recipeCard
        .querySelector('p:nth-child(4)')
        .textContent.replace('Cuisine: ', '')
    const source = recipeCard.querySelector('a').getAttribute('href')
    const recipeId = parseInt(title.hashCode())

    try {
        const formData = new FormData()
        formData.append('recipe_id', recipeId)
        formData.append('title', title)
        formData.append('image', image)
        formData.append('category', category)
        formData.append('cuisine', cuisine)
        formData.append('source', source)

        const response = await axios.post('php/save_recipe.php', formData)
        console.log('Response data:', response.data)

        alert(response.data.message)
    } catch (error) {
        alert(response.data.message)
    }
}

// Helper function to create a hash code from the title
String.prototype.hashCode = function () {
    let hash = 0
    for (let i = 0; i < this.length; i++) {
        const chr = this.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to a 32-bit integer
    }
    return Math.abs(hash)
}
