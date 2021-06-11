console.log("Client side JS file loaded.");

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

const fetchForecast = (search) => {
  fetch(`http://localhost:3000/weather?address=${search}`).then((response) => {
    // if (!response) {
    //   return "Error: Cannot reach server.";
    // }
    response.json().then((data) => {
      if (data.error) {
        messageOne.textContent = data.error;
        messageTwo.textContent = "Try Again."
      } else {
      messageOne.textContent = data.location;
      messageTwo.textContent = data.forecast;
      }
    });
  });
};

//AddEventListener( event (str), callback function)
weatherForm.addEventListener('submit', (event) => {
  event.preventDefault(); //preventDefault method: keeps browser from auto-refreshing after load

  messageOne.textContent = "";
  messageTwo.textContent = "Searching...";

  const location = search.value;
  const results = fetchForecast(location);
})