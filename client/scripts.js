$(document).ready(function () {
  // Fetch the states from the Node.js API
  $.ajax({
    url: "http://localhost:7200/api/states", // Replace with your Node.js API URL
    method: "GET",
    success: function (data) {
      // Iterate through each state and create cards
      data.forEach((state) => {
        const card = `
          <div class="col-md-4" data-aos="fade-up" data-aos-delay='3200'>
            <div class="card">
              <div class="card-header">${state.name}</div>
              <div class="card-body">
                <h5 class="card-title">Capital: ${state.capital}</h5>
                <p class="card-text">President: ${state.president}</p>
                <p><strong>Regions:</strong></p>
                <ul>
                  ${state.regions
                    .map(
                      (region) => `
                    <li>${region.name} (Capital: ${region.capital})
                      <ul>
                        ${region.districts
                          .map(
                            (district) =>
                              `<li>${district.name} (${district.type})</li>`
                          )
                          .join("")}
                      </ul>
                    </li>`
                    )
                    .join("")}
                </ul>
              </div>
            </div>
          </div>
        `;
        // Append the card to the container
        $("#states-container").append(card);
      });

      // Refresh AOS animations after adding dynamic content
      AOS.refresh();
    },
    error: function () {
      $("#states-container").html(
        `<p class="text-danger text-center">Failed to load data from the server. Please try again later.</p>`
      );
    },
  });
});
