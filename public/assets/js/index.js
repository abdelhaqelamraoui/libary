

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



function loadBooks(url = '../app/router.php') {
  tbody.innerHTML = ''
  const xhr = new XMLHttpRequest()
  try {
    xhr.open('GET', url, true)
  } catch (error) {
    
  }
  xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      
      const data = JSON.parse(xhr.responseText)
      if(data.length == 0) {
        //alert('لا يوجد أي كتاب ')
        return
      }
      let i = 1
      for (const book of data) {
        
        const tr = document.createElement('tr')
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        const td3 = document.createElement('td')
        const td4 = document.createElement('td')
        const td5 = document.createElement('td')
        const td6 = document.createElement('td')
        const td7 = document.createElement('td')

        // td7.innerHTML = `<p href="" id="${book['id']}" onclick="remove(this)" class="action remove">إزالة</p>`
        // td6.innerHTML = `<p href="" id="${book['id']}" onclick="edit(this)" class="action edit">تعديل</p>`
        td7.innerHTML = `<img id="${book['id']}" onclick="remove(this)" class="action" src="assets/icons/delete_red.gif"/>`
        td7.classList = 'action-td'
        td6.innerHTML = `<img id="${book['id']}" onclick="edit(this)" class="action" src="assets/icons/edit_blue.gif"/>`
        td6.classList = 'action-td'
        td5.textContent = book['notes']
        td4.textContent = book['loaner']
        td3.textContent = book['author']
        td2.textContent = book['title']
        td1.textContent = i++
        tr.append(td1, td2, td3, td4, td4, td5, td6, td7);
        tbody.appendChild(tr)

      }
    }
  }
  xhr.send()
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
    loadBooks(`../app/router.php?action=search/${pattern}`)
  } else {
    loadBooks();
  }
})
/* *************************************************************** */


/* *************************** dark ****************************** */
dark.addEventListener('click', enableDarkMode)
/* *************************************************************** */

function enableDarkMode() {
  if(dark.checked) {
    body.style.backgroundColor = '#000'
    tbody.style = 'color: rgba(255,255,255,0.74) !important'
    localStorage.setItem('theme', 'dark')
  } else {
    body.style.backgroundColor = 'rgba(244, 198, 90, 0.098)'
    tbody.style = 'color: rgba(0, 0, 0, 0.9) !important'
    localStorage.setItem('theme', 'light')
  }
  render()

  body.className.replace('light', 'dark')
}


function testDarkMode() {
  const theme = localStorage.getItem('theme')
  console.log(theme);
  if(theme == 'dark') {
    dark.checked = true
    enableDarkMode()
  }
}