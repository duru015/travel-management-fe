document.addEventListener("DOMContentLoaded", fetchTrips);
document.addEventListener("DOMContentLoaded", fetchTestimonial);
document.addEventListener("DOMContentLoaded", fetchBookNow);

let imageInfoUrl = {};

function fetchTestimonial() {
  fetch("http://localhost:1337/api/testimonials?populate=*")
    .then((response) => response.json())
    .then((testimonial) => displayTestimonial(testimonial))
    .catch((error) => console.error("Error fetching trips:", error));
}

function displayTestimonial(trips) {
  const testimonialList = document.getElementById("testimonialList");
  testimonialList.innerHTML = "";

  trips.data.forEach((trip) => {
    const tripCard = document.createElement("div");
    tripCard.classList.add("trip-card");
    tripCard.innerHTML = `
    <img
    src=http://localhost:1337${trip?.attributes?.image?.data?.attributes?.url}
    alt="Image"
    height=250px;
    width=250px
  />
      <h3 class="testimonial-content"><strong>Name:</strong> ${trip?.attributes?.title}</h3>
      <p class="testimonial-content"> ${trip?.attributes?.description}</p>

    `;
    testimonialList.appendChild(tripCard);
  });
}

function fetchTrips() {
  fetch("http://localhost:1337/api/trips?populate=*")
    .then((response) => response.json())
    .then((trips) => displayTrips(trips))
    .catch((error) => console.error("Error fetching trips:", error));
}

function displayTrips(trips) {
  const tripList = document.getElementById("tripList");
  tripList.innerHTML = "";

  trips.data.forEach((trip) => {
    const tripCard = document.createElement("div");
    tripCard.classList.add("trip-card");
    tripCard.innerHTML = `
    <img
    src=http://localhost:1337${trip?.attributes?.imageUrl}
    onclick="goToTripPage(${trip?.id})"
    alt="Image"
    height=250px;
    width=250px
  />
      <h3>${trip.attributes.title}</h3>
      <p><strong>destination:</strong> ${trip.attributes.destination}</p>
      <p><strong>Trip Days:</strong> ${trip.attributes.tripDays}</p>
      <span class="icon" onclick="editTrip(${trip.id})">&#9998;</span>
      <span class="icon" onclick="deleteTrip(${trip.id})">&#x1F5D1;</span>
    `;
    tripList.appendChild(tripCard);
  });
}

function deleteTrip(tripId) {
  fetch(`http://localhost:1337/api/trips/${tripId}`, {
    method: "DELETE",
  });
  window.location.reload();
}

function goToTripPage(tripId) {
  fetch(`http://localhost:1337/api/trips/${tripId}?populate=*`)
    .then((response) => response.json())
    .then((trip) => {
      window.location.href = `detailpage.html?tripId=${
        trip.id
      }&title=${encodeURIComponent(
        trip.data.attributes.title
      )}&destination=${encodeURIComponent(
        trip.data.attributes.destination
      )}&tripDays=${
        trip.data.attributes.tripDays
      }&description=${encodeURIComponent(
        trip.data.attributes.description
      )}&tripCost=${
        trip.data.attributes.tripCost
      }&imageUrl=${`http://localhost:1337${trip?.data?.attributes?.imageUrl}`}`;
    })
    .catch((error) => console.error("Error fetching trips:", error));
  console.log(`Navigating to trip page with ID: ${tripId}`);
}

function addTrip() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const destination = document.getElementById("destination").value;
  const tripDays = document.getElementById("tripDays").value;
  const tripCost = document.getElementById("tripCost").value;

  fetch("http://localhost:1337/api/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        title,
        destination,
        tripDays,
        tripCost,
        description,
        imageUrl: imageInfoUrl[0]?.url,
      },
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      fetchTrips();
      resetForm();
    })
    .catch((error) => console.error("Error adding trip:", error));
}
function resetForm() {
  console.log("Resetting form...");
  const form = document.getElementById("tripForm");

  if (form && typeof form.reset === "function") {
    form.reset();
    window.location.href = `homepage.html`;
    console.log("Form reset successful.");
  } else {
    console.error(
      "Form not found or does not support reset method. Check the form ID."
    );
  }
}

function imageUpload() {
  const inputElement = document.querySelector('input[name="files"]');
  const files = inputElement.files;

  if (files.length === 0) {
    console.error("No files selected");
    return;
  }

  const formData = new FormData();
  formData.append("files", files[0]);

  fetch("http://localhost:1337/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      imageInfoUrl = result;
      console.log(result);
      // Handle the result as needed
    })
    .catch((error) => console.error("Error uploading image:", error));
}

function bookNow() {
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const mobile = document.getElementById("mobile").value;
  const country = document.getElementById("country").value;
  const trip = document.getElementById("selectedTrip").value;

  fetch("http://localhost:1337/api/book-trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        fullName,
        email,
        address,
        mobile,
        country,
        trip,
      },
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      fetchTrips();
      resetForm();
    })
    .catch((error) => console.error("Error booking trip:", error));
}

function fetchBookNow() {
  fetch("http://localhost:1337/api/book-trips")
    .then((response) => response.json())
    .then((trips) => displayBookNow(trips))
    .catch((error) => console.error("Error fetching trips:", error));
}

function displayBookNow(bookLists) {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";

  bookLists.data.forEach((trip) => {
    console.log("trip", trip);

    const tripCard = document.createElement("div");
    tripCard.classList.add("trip-card");
    tripCard.innerHTML = `
      <h3><strong>Trip Name:</strong> ${trip.attributes.trip}</h3>
      <p><strong>FullName:</strong> ${trip.attributes.fullName}</p>
      <p><strong>Email:</strong> ${trip.attributes.email}</p>
      <p><strong>Address:</strong> ${trip.attributes.address}</p>
      <p><strong>Mobile:</strong> ${trip.attributes.mobile}</p>
      <p><strong>Country:</strong> ${trip.attributes.country}</p>

    `;
    bookList.appendChild(tripCard);
  });
}

const fetchTripOptions = async () => {
  try {
    const response = await fetch("http://localhost:1337/api/trips");
    const data = await response.json();

    console.log("data", data);

    const tripSelect = document.getElementById("tripSelect");
    data.data.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.attributes.title; // Set the value attribute
      optionElement.textContent = option.attributes.title; // Set the visible text
      tripSelect.appendChild(optionElement);
    });
  } catch (error) {
    console.error("Error fetching trip options:", error);
  }
};

// Call the function to fetch and populate trip options
fetchTripOptions();

// Add an event listener to update the hidden input field when an option is selected
const tripSelect = document.getElementById("tripSelect");
const selectedTripInput = document.getElementById("selectedTrip");

tripSelect.addEventListener("change", () => {
  selectedTripInput.value = tripSelect.value;
});
