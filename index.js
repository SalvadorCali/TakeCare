const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const process = require("process");

let sqlDb;

function initSqlDB() {
    if (process.env.TEST) {
        sqlDb = sqlDbFactory({
            client: "sqlite3",
            debug: true,
            connection: {
                filename: "./takecaredb.sqlite"
            },
            useNullAsDefault: true
        });
    } else {
        sqlDb = sqlDbFactory({
            debug: false,
            client: "pg",
            connection: process.env.DATABASE_URL,
            ssl: true
        });
    }
}

function initDb() {
    sqlDb.schema
        .dropTableIfExists('servicesByLocation')
        .dropTableIfExists('servicesByProfile')
        .dropTableIfExists('locations')
        .dropTableIfExists('services')
        .dropTableIfExists('profiles')
        .createTableIfNotExists('locations', table => {
            table.string('id').primary();
            table.string('title');
            table.string('address');
            table.float('lat');
            table.float('lng');
            table.string('img');
            table.string('hours');
            table.string('tel');
            table.string('mail');
            table.string('fax');
            table.string('description', 1000);
        })
        .createTableIfNotExists('services', table => {
            table.string('id').primary();
            table.string('title');
            table.string('description', 1000);
            table.string('img');
        })
        .createTableIfNotExists('profiles', table => {
            table.string('id').primary();
            table.string('first_name');
            table.string('last_name');
            table.string('img');
            table.string('job');
            table.string('education');
            table.string('experience');
            table.string('expertise');
            table.string('bio', 1000);
            table.string('tel');
            table.string('mail');
            table.string('twitter');
        })
        .createTableIfNotExists('servicesByLocation', table => {
            table.string('locationId');
            table.string('serviceId');
            table.primary(['locationId', 'serviceId']);
            table.foreign('locationId').references('locations.id').onDelete('cascade');
            table.foreign('serviceId').references('services.id').onDelete('cascade');
        })
        .createTableIfNotExists('servicesByProfile', table => {
            table.string('profileId');
            table.string('serviceId');
            table.primary(['profileId', 'serviceId']);
            table.foreign('profileId').references('profiles.id').onDelete('cascade');
            table.foreign('serviceId').references('services.id').onDelete('cascade');
        }).then(ignored => {
        populateDb();
    });
}


function populateDb() {
    return Promise.all(jsonDb['locations'].map(location => {
        return sqlDb('locations').insert({
            id: location.id,
            title: location.title,
            address: location.address,
            lat: location.lat,
            lng: location.lng,
            img: location.img,
            hours: location.hours,
            tel: location.tel,
            mail: location.mail,
            fax: location.fax,
            description: location.description
        });
    })).then(ignored => {
        console.log('Locations added');
        return Promise.all(jsonDb['services'].map(service => {
            return sqlDb('services').insert({
                id: service.id,
                title: service.title,
                description: service.description,
                img: service.img
            });
        })).then(ignored => {
            console.log('Services added');
            return Promise.all(jsonDb['profiles'].map(profile => {
                return sqlDb('profiles').insert({
                    id: profile.id,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    img: profile.img,
                    job: profile.job,
                    education: profile.education,
                    experience: profile.experience,
                    expertise: profile.expertise,
                    bio: profile.bio,
                    tel: profile.tel,
                    mail: profile.mail,
                    twitter: profile.twitter
                });
            })).then(ignored => {
                console.log('Profiles added');
                return Promise.all(jsonDb['locations'].map(location => {
                    return sqlDb('servicesByLocation').insert(location['services'].map(service => {
                        return {locationId: location.id, serviceId: service}
                    }));
                })).then(ignored => {
                    console.log('Services by location added');
                    return Promise.all(jsonDb['profiles'].map(profile => {
                        return sqlDb('servicesByProfile').insert(profile['services'].map(service => {
                            return {profileId: profile.id, serviceId: service}
                        }));
                    })).then(ignored => {
                        console.log('Services by profile added');
                    })
                });
            });
        });
    });
}


const _ = require("lodash");

let serverPort = process.env.PORT || 5000;
let jsonDb = require("./other/takecare.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/*
 * Locations - REST entry point
 */

app.get("/locations", function (req, res) {
    let start = parseInt(_.get(req, 'query.start', 0));
    let limit = parseInt(_.get(req, 'query.limit', 20));
    let sort = _.get(req, "query.sort", "none");
    let fields = _.get(req, "query.fields", "");

    let query = sqlDb('locations');

    if (fields.trim()) {
        query.columns(fields.split(','));
    }

    if (sort === "asc") {
        query.orderBy('title', 'asc');
    } else if (sort === "desc") {
        query.orderBy('title', 'desc');
    }

    query.limit(limit).offset(start).then(result => {
        res.send(JSON.stringify(result));
    });
});

app.get("/locations/:id", function (req, res) {
    sqlDb.select().from('locations').where('id', req.params.id).then(result => {
        res.send(JSON.stringify(result[0]));
    });
});

app.get("/locations/:id/services", function (req, res) {
    let fields = _.get(req, "query.fields", "");

    let query = sqlDb('services');

    if (fields.trim()) {
        query.columns(fields.split(',').map(field => 'services.' + field));
    } else {
        query.columns('services.*');
    }

    query.leftJoin('servicesByLocation', 'services.id', 'servicesByLocation.serviceId')
        .where('servicesByLocation.locationId', req.params.id).then(result => {
        res.send(JSON.stringify(result));
    });
});


/*
 * Services - REST entry point
 */

app.get("/services", function (req, res) {
    let start = parseInt(_.get(req, 'query.start', 0));
    let limit = parseInt(_.get(req, 'query.limit', 20));
    let sort = _.get(req, "query.sort", "none");
    let fields = _.get(req, "query.fields", "");
    let group = _.get(req, "query.group", "");

    if (group === "location") {
        let query = sqlDb('servicesByLocation as sl')
            .join('services as s', 's.id', 'sl.serviceId')
            .join('locations as l', 'l.id', 'sl.locationId')
            .limit(limit)
            .offset(start);

        if (sort === "asc") {
            query.orderBy('s.title', 'asc');
        } else if (sort === "desc") {
            query.orderBy('s.title', 'desc');
        }

        let columns = ['l.title as location'];
        if (fields.trim()) {
            fields.split(',').map(field => {
                columns.push('s.' + field);
            });
        } else {
            columns.push('s.*');
        }

        query.columns(columns).then(result => {
            res.send(JSON.stringify(result.map(service => service.location)
                .filter(function (element, index, array) {
                    return array.indexOf(element) === index;
                }).map(location => {
                    return {
                        "location": location,
                        "services": result.filter(item => item.location === location).map(item => {
                            delete item.location;
                            return item;
                        })
                    }
                })));
        });
    } else {
        let query = sqlDb('services');

        if (fields.trim()) {
            query.columns(fields.split(','));
        }

        if (sort === "asc") {
            query.orderBy('services.title', 'asc');
        } else if (sort === "desc") {
            query.orderBy('services.title', 'desc');
        }

        query.limit(limit).offset(start).then(result => {
            res.send(JSON.stringify(result));
        });
    }
});

app.get("/services/:id", function (req, res) {
    sqlDb.select().from('services').where('id', req.params.id).then(result => {
        res.send(JSON.stringify(result[0]));
    });
});

app.get("/services/:id/locations", function (req, res) {
    let fields = _.get(req, "query.fields", "");

    let query = sqlDb('locations');

    if (fields.trim()) {
        query.columns(fields.split(',').map(field => 'locations.' + field));
    } else {
        query.columns('locations.*');
    }

    query.leftJoin('servicesByLocation', 'locations.id', 'servicesByLocation.locationId')
        .where('servicesByLocation.serviceId', req.params.id).then(result => {
        res.send(JSON.stringify(result));
    });
});

app.get("/services/:id/profiles", function (req, res) {
    let fields = _.get(req, "query.fields", "");

    let query = sqlDb('profiles');

    if (fields.trim()) {
        query.columns(fields.split(',').map(field => 'profiles.' + field));
    } else {
        query.columns('profiles.*');
    }

    query.leftJoin('servicesByProfile', 'profiles.id', 'servicesByProfile.profileId')
        .where('servicesByProfile.serviceId', req.params.id).then(result => {
        res.send(JSON.stringify(result));
    });
});


/*
 * Profiles - REST entry point
 */

app.get("/profiles", function (req, res) {
    let start = parseInt(_.get(req, 'query.start', 0));
    let limit = parseInt(_.get(req, 'query.limit', 20));
    let sort = _.get(req, "query.sort", "none");
    let fields = _.get(req, "query.fields", "");

    let query = sqlDb('profiles');

    if (fields.trim()) {
        query.columns(fields.split(','));
    }

    if (sort === "asc") {
        query.orderBy('last_name', 'asc');
    } else if (sort === "desc") {
        query.orderBy('last_name', 'desc');
    }

    query.limit(limit).offset(start).then(result => {
        res.send(JSON.stringify(result));
    });
});

app.get("/profiles/:id", function (req, res) {
    sqlDb.select().from('profiles').where('id', req.params.id).then(result => {
        res.send(JSON.stringify(result[0]));
    });
});

app.get("/profiles/:id/services", function (req, res) {
    let fields = _.get(req, "query.fields", "");

    let query = sqlDb('services');

    if (fields.trim()) {
        query.columns(fields.split(',').map(field => 'services.' + field));
    } else {
        query.columns('services.*');
    }

    query.leftJoin('servicesByProfile', 'services.id', 'servicesByProfile.serviceId')
        .where('servicesByProfile.profileId', req.params.id).then(result => {
        res.send(JSON.stringify(result));
    });
});

app.set("port", serverPort);

initSqlDB();
initDb();

/* Start the server on port 5000 */
app.listen(serverPort, function () {
    console.log(`Your app is ready at port ${serverPort}`);
});
