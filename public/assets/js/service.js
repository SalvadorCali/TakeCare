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
        url: "https://polimi-hyp-2018-team-10525745.herokuapp.com/services?fields=id,title&sort=asc",
        success: function (response) {
            const sidebar = $('#sidebar-list-group');
            sidebar.empty();
            $.each(response, function (i, service) {
                const active = service["id"] === query["id"] ? " list-group-item-active" : "";
                sidebar.append(
                    `<a href="service.html?id=${service["id"]}" class="list-group-item list-group-item-action${active}">
                        ${service["title"]}
                     </a>`
                );
            });
        },
        error: function (request, error) {
            console.log(request + ":" + error);
        }
    });

    // Service request
    $.ajax({
        method: "GET",
        dataType: "json",
        url: `https://polimi-hyp-2018-team-10525745.herokuapp.com/services/${query.id}`,
        success: function (response) {
            $('#service-title').text(response["title"]);
            $('#service-description').text(response["description"]);
            $('#service-image').attr("src", "../assets/img/" + response["img"]);

            document.title = response["title"] + " - TakeCare";
        },
        error: function (request, error) {
            console.log(request + ":" + error);
            document.title = "Servizio - TakeCare";
        }
    });

    // Profile request
    $.ajax({
        method: "GET",
        dataType: "json",
        url: `https://polimi-hyp-2018-team-10525745.herokuapp.com/services/${query.id}/profiles?fields=id,img,job,first_name,last_name,twitter`,
        success: function (response) {
            const container = $('#profile-row');
            container.empty();

            $.each(response, function (i, profile) {
                const html = `<div class="col-12 col-sm-6 col-md-4 col-lg-4">
                            <a href="profile.html?id=${profile["id"]}">
                                <div class="card profile-card">
                                    <img class="card-img-top img-center-crop" src="../assets/img/${profile["img"]}" alt="Card image cap">
                                    <div class="card-body">
                                        <p class="text-caption text-secondary-dark">${profile["job"]}</p>
                                        <h5 class="text-title text-primary-dark pt-2">${profile["first_name"]} ${profile["last_name"]}</h5>
                                        <p class="text-body text-secondary-dark pt-1">${profile["twitter"]}</p>
                                    </div>
                                </div>
                            </a>
                        </div>`;
                container.append(html);
            })
        },
        error: function (request, error) {
            console.log(request + ":" + error);
        }
    });

    // Location request
    $.ajax({
        method: "GET",
        dataType: "json",
        url: `https://polimi-hyp-2018-team-10525745.herokuapp.com/services/${query.id}/locations?fields=id,title,address,img`,
        success: function (response) {
            const container = $('#location-row');
            container.empty();

            $.each(response, function (i, location) {
                const html = `<div class="col-12 col-md-6">
                            <a href="location.html?id=${location["id"]}">
                                <div class="card location-card">
                                    <img class="card-img-top img-center-crop" src="../assets/img/${location["img"]}">
                                    <div class="card-body">
                                        <h5 class="card-title text-primary-dark">${location["title"]}</h5>
                                        <p class="card-text text-secondary-dark">${location["address"]}</p>
                                    </div>
                                </div>
                            </a>
                        </div>`;
                container.append(html);
            });
        },
        error: function (request, error) {
            console.log(request + ":" + error);
        }
    });
});