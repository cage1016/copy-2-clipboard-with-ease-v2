export default function (text) {
    document.oncopy = (event) => {
        event.clipboardData.setData('text/plain', text)
        event.preventDefault()
    }
    document.execCommand("copy", false, null)
}