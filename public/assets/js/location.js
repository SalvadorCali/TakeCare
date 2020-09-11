const query = function () {
    let vars = [], hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}();

$(window).ready(function () {
    // Left-bar request
    $.ajax({
        method: "GET",
        dataType: "json",
        url: "https://polimi-hyp-2018-team-10525745.herokuapp.com/locations?fields=id,title&sort=asc",
        success: function (response) {
            const sidebar = $('#sidebar-list-group');

            sidebar.empty();
            $.each(response, function (i, location) {
                const active = location["id"] === query["id"] ? " list-group-item-active" : "";
                sidebar.append(
                    `<a href="location.html?id=${location["id"]}" class="list-group-item list-group-item-action${active}">
                        ${location["title"]}
                     </a>`
                );
            });
        },
        error: function (request, error) {
            console.log(request + ":" + error);
        }
    });

    // Location request
    $.ajax({
        method: "GET",
        dataType: "json",
        url: `https://polimi-hyp-2018-team-10525745.herokuapp.com/locations/${query.id}`,
        success: function (response) {
            $('#location-title').text(response["title"]);
            $('#location-address').html(response["address"]);
            $('#location-hours').text(response["hours"]);
            $('#location-description').text(response["description"]);
            $('#location-tel').text(response["tel"]);
            $('#location-mail').text(response["mail"]);
            $('#location-fax').text(response["fax"]);
            $('#location-image').attr("src", "../assets/img/" + response["img"]);

            document.title = response["title"] + " - TakeCare";
        },
        error: function (request, error) {
            console.log(request + ":" + error);
            document.title = "Sede - TakeCare";
        }
    });

    // Services request
    $.ajax({
        method: "GET",
        dataType: "json",
        url: `https://polimi-hyp-2018-team-10525745.herokuapp.com/locations/${query.id}/services?fields=id,img,title,description`,
        success: function (response) {
            const container = $('#services-row');
            container.empty();

            $.each(response, function (i, service) {
                container.append(
                    `<div class="col-12 col-md-6 col-lg-4">
                                <a href="service.html?id=${service["id"]}">
                                    <div class="card service-card">
                                        <img class="card-img-top" src="../assets/img/${service["img"]}">
                                        <div class="card-body">
                                            <h5 class="card-title text-title text-primary-dark">${service["title"]}</h5>
                                            <p class="card-text text-body text-secondary-dark max-lines">${service["description"]}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>`
                );
            });
        },
        error: function (request, error) {
            console.log(request + ":" + error);
        }
    })
});