async function getData () {
  const url = 'https://script.google.com/macros/s/AKfycbzFYSNhDhWcbYbcIl_T26XC1_IUfKserO2hovx27RcSaHIgjy8SC31d1nviYQlYldhu/exec?api=update-flag'
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ flag: false }),
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
