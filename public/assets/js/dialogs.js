


function showIndicationnDialog(msg) {
  const body = document.querySelector('body')
  const container = document.createElement('div')
  const dialog = document.createElement('div')
  const message = document.createElement('p')
  const close = document.createElement('button')

  container.classList = 'top-dialog-container'
  dialog.classList = 'top-dialog-content'
  message.classList = 'top-dialog-msg'
  close.classList = 'top-dialog-btn'

  message.textContent = msg
  close.textContent = 'x'

  dialog.append(message, close)
  container.append(dialog)
  body.appendChild(container)

  container.addEventListener('mouseover', e => {
    container.remove()
  })
  close.addEventListener('click', e => {
    container.remove()
  })
}


function showConfirmatioinDialog(title, message, confirmCallback) {
  const body = document.querySelector('body')
  const container = document.createElement('div')
  const content = document.createElement('div')
  const dialogTitle = document.createElement('p')
  const msg = document.createElement('p')
  const confirm = document.createElement('button')
  const cancel = document.createElement('button')

  container.classList = 'dialog-container'
  content.classList = 'dialog-content'
  dialogTitle.classList = 'dialog-title'
  msg.classList = 'dialog-msg'
  confirm.classList = 'dialog-confirm'
  cancel.classList = 'dialog-cancel'

  dialogTitle.textContent = title
  msg.textContent = message
  cancel.textContent = 'إلغاء'
  confirm.textContent = 'استمرار'

  content.append(dialogTitle, msg, confirm, cancel)
  container.append(content)
  body.appendChild(container)

  confirm.addEventListener('click', e => {
    confirmCallback()
    container.remove()
  })
  cancel.addEventListener('click', e => {
    container.remove()
  })
  

}