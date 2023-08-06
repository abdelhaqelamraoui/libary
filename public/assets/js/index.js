

const tbody = document.getElementById('list')
const form = document.getElementById('add-form')

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
        alert('لا يوجد أي كتاب مسجل ')
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

        td7.innerHTML = `<p href="" id="${book['id']}" onclick="remove(this)" class="action remove">إزالة</p>`
        td6.innerHTML = `<p href="" id="${book['id']}" onclick="edit(this)" class="action edit">تعديل</p>`
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
  
  document.getElementById('title').value = rowChildren[2].textContent
  document.getElementById('author').value = rowChildren[3].textContent
  document.getElementById('loaner').value = rowChildren[4].textContent
  document.getElementById('notes').value = rowChildren[5].textContent
  
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
 const title = element.parentElement.parentElement.children[5].textContent
 const message = ' أترغب في إزالة الكتاب' + ' : ' + title
 const xhr = new XMLHttpRequest()
 const url = `../app/router.php?action=remove/${id}`
 xhr.open('GET', url, true)

 if(window.confirm(message)) {
   xhr.send()
  } 
  
  xhr.onload = function() {
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
const stats = document.getElementById('stats')
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
const search = document.getElementById('search')
const searchPattern = document.getElementById('search-pattern')
search.addEventListener('click', event => {
  const pattern = searchPattern.value.trim()
  if(pattern.length > 0) {
    loadBooks(`../app/router.php?action=search/${pattern}`)
  } else {
    loadBooks();
  }
})
/* *************************************************************** */


