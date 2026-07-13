async function getData () {
  const url = 'https://script.google.com/macros/s/AKfycbwlgcQJ8BmnvP4zaNd4ovnplcRJxUJYTD0cAACn9hrEj4LgkmrSuVfiy04AjAtqGuY/exec?api=not-flag'
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ api_key: 'flag_holder' }),
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()
    console.log(json)
  } catch (error) {
    console.error(error.message)
  }
}

getData()
