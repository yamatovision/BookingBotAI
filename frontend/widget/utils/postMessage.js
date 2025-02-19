// widget/src/utils/postMessage.js
export const sendMessage = (type, data) => {
  window.parent.postMessage({ type, data }, '*')
}

export const createMessageHandler = (handlers) => {
  return (event) => {
    const { type, data } = event.data
    if (handlers[type]) {
      handlers[type](data)
    }
  }
}