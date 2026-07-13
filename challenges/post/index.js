async function getData () {
  const url = 'https://script.google.com/macros/s/AKfycbyKN3ywoFsx8KN_GPFzq-sv2Ni1eWo6X9OgcrKve3NGOwCu2FOuFAQxo5PqofizDSwh/exec?api=not-flag'
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
