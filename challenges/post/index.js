async function getData () {
  const url = 'https://script.google.com/macros/s/AKfycbwbxYbTF5La_QByN2jxyuwUpc8aHgDSeC94wKWLCyagSkVfIr7QYgYGw7mDsODMjp6b/exec?api=not-flag'
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
