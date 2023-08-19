

const body = document.querySelector('body')
const tbody = document.getElementById('list')
const form = document.getElementById('add-form')
const table = document.querySelector('table')

const stats = document.getElementById('stats')
const search = document.getElementById('search')
const searchPattern = document.getElementById('search-pattern')
const dark = document.getElementById('dark')


/* 
This prevents the default form submission which refreshes the page
and set a custom one 
*/
form.addEventListener('submit', event => {
  event.preventDefault() // preventing default event submission
   // handling the submission instead of default one
   /* 
    If the id exists, it means that we've already went through the edit function
    (clicki on edit action)
    else we've not   
   */
   if(localStorage.getItem('book-id') == null) {
    addNewBook()
  } else {
    editBook()
  }
})

function ajax(callback, index = 0, url = '../app/router.php') {
  const xhr = new XMLHttpRequest()
  // const url = '../app/router.php'
  xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      data = JSON.parse(xhr.responseText)
      callback(data, index)
    }
  }

  xhr.open('GET', url, true)
  xhr.send()

}

function loadBooks(url = '../app/router.php') {
  ajax(renderBooks, 0, url)
}

function renderBooks(data, index = 0) {

  if(index < 0) {
    return
  }

  
  tbody.innerHTML = ''

  for (; index < data.length; index++) {

    const book = data[index];
    const tr = document.createElement('tr')
  
    tr.innerHTML = `
      <td>${index+1}</td>
      <td>${book['title']}</td>
      <td>${book['author']}</td>
      <td>${book['loaner']}</td>
      <td>${book['notes']}</td>
      <td class="action">
        <img id="${book['id']}" onclick="edit(this)" class="action-icon" src="assets/icons/edit_blue.gif"/>
      </td>
      <td class="action">
        <img id="${book['id']}" onclick="remove(this)" class="action-icon" src="assets/icons/delete_red.gif"/>
      </td>
    `
    tbody.appendChild(tr)
  }
      
}

function render() {
  tbody.innerHTML = ''
  loadBooks()
}

function addNewBook() {

  const formData = new FormData(form)
  formData.append('add', 'add') // for distinguishig add from update
  const xhr = new XMLHttpRequest()
  const url = '../app/router.php'

  xhr.open('POST', url, true);
  xhr.send(formData)
  xhr.onload = function() {
      render()
      clearForm()
  }

}


function edit(element) {
  
  const rowChildren = element.parentElement.parentElement.children
  
  document.getElementById('title').value = rowChildren[1].textContent
  document.getElementById('author').value = rowChildren[2].textContent
  document.getElementById('loaner').value = rowChildren[3].textContent
  document.getElementById('notes').value = rowChildren[4].textContent
  
  document.getElementById('add').textContent = 'تعديل'
  
  /* 
  Storing the id of the book in order to use for submitting
  the update form that needs it. (in the function editBook bellow)
  */
 localStorage.setItem('book-id', element.id)

}

/* 
  The event submission function that will be called
  after clicking on the edit action
*/
function editBook() {
  const xhr = new XMLHttpRequest()
  const formData = new FormData(form)
  const id = parseInt(localStorage.getItem('book-id'))
  formData.append('id', id) // the id of the book to update
  formData.append('update', 'update') // sse the php script to understand
  const url = '../app/router.php'
  xhr.open('POST', url, true)
  xhr.send(formData)
  xhr.onload = function() {
    clearForm()
    document.getElementById('add').textContent = 'إضافة'
    render()
  }

  localStorage.removeItem('book-id')
}



function remove(element) {

  const id = element.id
  const title = element.parentElement.parentElement.children[1].textContent
  const message = ' أترغب في إزالة الكتاب' + ' : ' + title
  const xhr = new XMLHttpRequest()
  const url = `../app/router.php?action=remove/${id}`
  xhr.open('GET', url, true)


showConfirmatioinDialog('إزالة كتاب', message, () => {
  xhr.send()
  
  })
  
  xhr.onload = function() {
    //console.log(xhr.responseText);
    render()
  }

}


function clearForm() {
  for (const element of form.children) {
    if(element.type === 'text') {
      element.value = ''
    }
  }
}


/* ************************** stats ***************************** */

stats.addEventListener('click', event => {
 

  const xhr = new XMLHttpRequest()


  xhr.open('GET', '../app/router.php?action=count')
  xhr.send()
  xhr.onload = function() {
    // console.log(xhr.responseText);
    const data = JSON.parse(xhr.responseText)
    const total = parseInt(data['total'])
    const loaned = parseInt(data['loaned'])
    const unloaned = total - loaned
  
    let message = `المقترضة: ${loaned}\n غير المقترضة: ${unloaned}\nالمجموع : ${total}\n `
    window.alert(message)
  }

})
/* *************************************************************** */



/* ************************* search ****************************** */

search.addEventListener('click', event => {
  const pattern = searchPattern.value.trim()
  if(pattern.length > 0) {
    loadBooks(`../app/router.php?action=search/${pattern}`)
  } else {
    loadBooks();
  }
})

/* 
  This is for performing live search without clicking
  the search button
*/
searchPattern.addEventListener('input', event => {
  const pattern = searchPattern.value.trim()
  if(pattern.length > 0) {
    // loadBooks(`../app/router.php?action=search/${pattern}`)
    const url = `../app/router.php?action=search/${pattern}`
    const index = parseInt(localStorage.getItem('index'))
    ajax(renderBooks, index, url)
  } else {
    // loadBooks();
    ajax(renderBooks)
  }
})
/* *************************************************************** */


/* *************************** dark ****************************** */
dark.addEventListener('click', enableDarkMode)
/* *************************************************************** */

function enableDarkMode() {
  if(dark.checked) {
    localStorage.setItem('theme', 'dark')
    document.body.className = 'dark'
    document.querySelector('thead').style.color = 'black'
  } else {
    document.body.className = 'light'
    localStorage.setItem('theme', 'light')
  }
}

function testDarkMode() {
  const theme = localStorage.getItem('theme')

  if(theme == 'dark') {
    dark.checked = true
    enableDarkMode()
  }
}

