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
        url: `https://polimi-hyp-2018-team-10525745.herokuapp.com/profiles?fields=id,first_name,last_name&sort=asc`,
        success: function (response) {
            const sidebar = $('#sidebar-list-group');
            sidebar.empty();
            $.each(response, function (i, profile) {
                const active = profile["id"] === query["id"] ? " list-group-item-active" : "";
                sidebar.append(
                    `<a href="profile.html?id=${profile["id"]}" class="list-group-item list-group-item-action${active}">
                        ${profile["first_name"]} ${profile["last_name"]}
                     </a>`
                );
            });
        },
        error: function (request, error) {
            console.log(request + ":" + error);
        }
    });

    // Profile request
    $.ajax({
        method: "GET",
        dataType: "json",
        url: `https://polimi-hyp-2018-team-10525745.herokuapp.com/profiles/${query.id}`,
        success: function (response) {
            $('#profile-name').text(response["first_name"] + " " + response["last_name"]);
            $('#profile-job').text(response["job"]);
            $('#profile-education').text(response["education"]);
            $('#profile-experience').text(response["experience"]);
            $('#profile-expertise').text(response["expertise"]);
            $('#profile-bio').text(response["bio"]);
            $('#profile-tel').text(response["tel"]);
            $('#profile-mail').text(response["mail"]);
            $('#profile-twitter').text(response["twitter"]);
            $('#profile-img').attr("src", "../assets/img/" + response["img"]);

            document.title = response["first_name"] + " " + response["last_name"] + " - TakeCare";
        },
        error: function (request, error) {
            console.log(request + ":" + error);
            document.title = "Profile - TakeCare";
        }
    });

    // Services request
    $.ajax({
        method: "GET",
        dataType: "json",
        url: `https://polimi-hyp-2018-team-10525745.herokuapp.com/profiles/${query.id}/services?fields=id,title,description,img`,
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
    });
});