async function fetchData(url) {
  let data = null;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    data = await response.text();
    console.log(data)
  } catch (error) {
    console.error(error);
    document.querySelectorAll(".error").forEach((element) => {
      element.style.display = "block";
    });
  } 

  return data;
}

export default fetchData;
