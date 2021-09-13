const form = document.querySelector(`#jokesForm`),
   mainJoke = document.querySelector(`#mainJokes`),
   mainFavJoke = document.querySelector(`#mainFavJokes`),
   fromCaterogies = document.querySelector(`#caterogies`),
   categoriesList = document.querySelector(`#categoriesList`),
   categorySearch = document.querySelector(`.category__search`),
   allCategories = document.querySelectorAll(`input[name="jokeType"]`),
   jokeUrl = `https://api.chucknorris.io/`,
   searchValue = document.querySelector(`#inputCategory`);

allCategories.forEach(input => {
   input.addEventListener(`change`, () => {
      input.id === `caterogies` ? categoriesList.classList.add(`show`) : categoriesList.classList.remove(`show`)
      input.id === `search` ? categorySearch.classList.add(`show`) : categorySearch.classList.remove(`show`)
   })
})

form.addEventListener(`submit`, e => {
   e.preventDefault()

   let category = form.querySelector(`input[name="jokeType"]:checked`).value;

   if (category === `random`) {
      getJoke(`${jokeUrl}jokes/random`)
   } else if (category === `caterogies`) {
      let category = categoriesList.querySelector(`.categories__list--type.active`).textContent;
      getJoke(`${jokeUrl}jokes/random?category=${category}`)
   } else if (category === `search`) {
      getJoke(`${jokeUrl}jokes/search?query=${searchValue.value ? searchValue.value.trim() : `write any words`}`)
   }
   
})

const getJoke = url => {
   let xhr = new XMLHttpRequest()
   xhr.open(`get`, url)
   xhr.send()

   xhr.addEventListener(`readystatechange`, () => {
      if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
         let joke = JSON.parse(xhr.responseText)
         mainJoke.innerHTML = ``
         if (joke.result) {
            if (joke.result.length) {
               joke.result.forEach(joke => {renderJoke(joke, mainJoke)})
            }
         } else {renderJoke(joke, mainJoke)}
      }
   })
}

const getCategories = () => {
   let xhr = new XMLHttpRequest()
   xhr.open(`get`, `${jokeUrl}jokes/categories`)
   xhr.send()

   xhr.addEventListener(`readystatechange`, () => {
      if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
         let categories = JSON.parse(xhr.responseText)
         renderCategories(categories)
      }
   })
}

getCategories()

const renderCategories = categories => {
   categories.forEach(item => {
      let li = document.createElement(`li`)
      li.innerHTML = `${item}`
      li.classList.add(`categories__list--type`)
      categoriesList.append(li)

      getActiveLi(li)
   })
}

const getActiveLi = li => {
   li.addEventListener(`click`, () => {
      let activeLi = document.querySelectorAll(`.categories__list--type.active`);  
      activeLi && activeLi.forEach(item => {
         item.classList.remove(`active`);
      })
      li.classList.add(`active`);
   })
}

const getLastUpdate = (create, update) => {
   let createDate = new Date(create),
      updateDate = new Date(update);
      return Math.ceil(Math.abs(updateDate.getTime() - createDate.getTime()) / (1000 * 3600 * 24))
}

const renderJoke = (joke, block, favourite = false) => {

   let jokesMain = document.createElement(`div`)
   jokesMain.classList.add(`jokes__main--card`)
   jokesMain.innerHTML = `<div class="jokes__main--body">
                              <div class="jokes__main--icon"><img src="${joke.icon_url}" alt="icon joke" width="40" height="40"></div>
                              <div class="jokes__main--value">
                                 <span class="jokes__main--id">ID: <a href="${joke.url}" target="_blank">${joke.id}</a></span>
                                 <p class="jokes__main--text">${joke.value}</p>
                              </div>
                           </div>
                           <div class="jokes__main--info">
                              <div class="jokes__main--date">Last update: <span class="jokes__main--time">${getLastUpdate(joke.created_at, joke.updated_at)} hours ago</span>
                              </div>
                              ${joke.categories.length ? `<div class="jokes__main--category">${joke.categories}</div>` : ``}
                           </div>`
   let jokesHeart = document.createElement(`div`)
   jokesHeart.classList.add(`jokes__main--heart`)
   jokesHeart.addEventListener(`click`, () => {
      jokesHeart.classList.add(`active`)
      let localJokes = getLocalJokes()
      
      if (favourite) {
         let removeLocalJoke = localJokes.findIndex(localJoke => localJoke.id === joke.id)
         localJokes.splice(removeLocalJoke, 1) && setLocaLJokes(localJokes)
         getFavJokes()
      } else {
         let checkLocalJokes = localJokes.find(localJoke => localJoke.id === joke.id)
         !checkLocalJokes && localJokes.push(joke) && setLocaLJokes(localJokes)
         getFavJokes()
      }
   })
   
   jokesMain.prepend(jokesHeart)
   block.append(jokesMain)
}

const getLocalJokes = () => {
   let favJokes = localStorage.getItem(`favJokes`)

   return favJokes ? JSON.parse(favJokes) : new Array()
}

const setLocaLJokes = arr => {
   localStorage.setItem(`favJokes`, JSON.stringify(arr))
}

const getFavJokes = () => {
   mainFavJoke.innerHTML = ``

   let localJoke = getLocalJokes()
   localJoke.forEach(joke => {
      renderJoke(joke, mainFavJoke, true)
   })
}

getFavJokes()
