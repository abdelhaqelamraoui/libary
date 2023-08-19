




let csvForm = document.getElementById('csv-form')
let csvFile = document.getElementById('csv-file')

csvForm.addEventListener('submit', event => {
  event.preventDefault()
  uploadCSVFile()  
})


function uploadCSVFile() {

  const formData = new FormData(csvForm)
  const xhr = new XMLHttpRequest()
  const url = '../app/router.php'
  formData.append('csv', 'csv')
  try {
    xhr.open('POST', url, true)
  } catch (error) {
    console.error('Cannot fech the server')
  }

  xhr.onload = function() {
    console.log(xhr.responseText)
    csvFile.value = ''
    loadBooks()
  }

  const message = 'هل أنت متأكد من رفع الملف ؟'

  showConfirmatioinDialog('', message, () => {
    xhr.send(formData)
  })


}


/* 
  For handlingthe event of uploading a file
*/
csvFile.addEventListener('change', e => {
  if (e.target.files[0]) {
    // console.log('You selected ' + e.target.files[0].name);
    uploadCSVFile()
  }
})