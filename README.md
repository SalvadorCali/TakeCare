# TakeCare website
## Introduction
This project is a web application developed for an hypothetical care center for children affected by autism and selective mutism.
It is designed for parents or relatives who want to get to know what the company is about, find the closest locations, meet the staff members or just check out what services are available.

* Heroku URL: https://polimi-hyp-2018-team-10525745.herokuapp.com/index.html
* Bitbucket repo URL: https://bitbucket.org/polimihyp2018team10525745/polimi-hyp-2018-project/src/master/
* Team administrator: Andrea, Porfiri Dal Cin, 10525745, polimi-hyp-2018-10525745
* Team member n.2 : Alessandro, Venerus, 10492058, polimi-hyp-2018-10492058
* Team member n.3 : Andrea, Calici, 10490117, polimi-hyp-2018-10490117


This website was designed and developed by Andrea Porfiri Dal Cin, Alessandro Venerus and Andrea Calici. At the beginning of the development process, we decided to split the work as evenly as possible and that each of us would be responsible for a specific area of the project:

1.  Andrea Porfiri Dal Cin
:   Responsible for front-end and back-end technologies.
Mainly worked on HTML, CSS, JS, the relational and JSON database designs and the REST API implementation in Node.js.
2.  Alessandro Venerus
:   Responsible for the concept and the website UI.
Mainly worked on HTML, CSS and usability.
3.  Andrea Calici
:   Responsible for the design part, the user experience and the API documentation.
Mainly worked on the IDM specification, usability, general website design and REST API concept and documentation.

## Description of the REST API

The server provides a REST API to access information about the staff members, locations and services.

##### Show all locations
* URL: /locations
* Method: GET
* Optional parameters
    (
    
        start=[integer]; index of the first location to retrieve [default = 0].
        limit=[integer]; maximum amount of locations [default = 20].
        sort=[string]; sort strategy for locations [undefined => not sorted, asc => ascending by title, desc => descending by title]
        fields=[string]; request specific fields [undefined => all fields will be sent, usage field1,field2,field3,..., (fields: id, title, address, lat, lng, img, hours, tel, mail, fax, description)]
    )

##### Show location
* URL: /locations/:id
* Method: GET
* Required parameters
    (

        :id=[string] the identifier of the location.
    )
    
##### Show all services by location
* URL: /locations/:id/services
* Method: GET
* Required parameters
    (

        :id=[string]; the identifier of the location.
    )

* Optional parameters
    (

        fields=[string]; request specific fields [undefined => all fields will be sent, usage field1,field2,field3,..., (fields: id, title, description, image)]
    )

##### Show all services
* URL: /services
* Method: GET
* Optional parameters
    (

        start=[integer]; index of the first service to retrieve [default = 0].
        limit=[integer]; maximum amount of services [default = 20].
        sort=[string]; sort strategy for services [undefined => not sorted, asc => ascending by title, desc => descending by title]
        fields=[string]; filter specific fields [undefined => shows all fields, usage field1,field2,field3,..., (fields: id, title, description, image)]
        group=[string]; the criteria for groupping services [undefined => services will not be groupped, location => group services by location]
    )

##### Show service
* URL: /services/:id
* Method: GET
* Required parameters
    (

        :id=[string]; the identifier of the service.
    )

##### Show all locations by service
* URL: /services/:id/locations
* Method: GET
* Required parameters
    (

        :id=[string]; the identifier of the service.
    )
    
* Optional parameters
    (

        fields=[string]; filter specific fields [undefined => shows all fields, usage field1,field2,field3,..., (fields: id, title, address, lat, lng, img, hours, tel, mail, fax, description)]
    )

##### Show all profiles by service
* URL: /services/:id/profiles
* Method: GET
* Required parameters
    (

        :id=[string]; the identifier of the service.
    )

* Optional parameters
    (

        fields=[string]; filter specific fields [undefined => shows all fields, usage field1,field2,field3,..., (fields: id, first_name, last_name, img, job, education, experience, expertise, bio, tel, mail, twitter)]
    )

##### Show all profiles
* URL: /profiles
* Method: GET
* Optional parameters
    (

        start=[index]; index of the first profile to retrieve [default = 0].
        limit=[index]; maximum amount of profiles [default = 20].
        sort=[string]; sort strategy for profiles [undefined => not sorted, asc => ascending by last_name, desc => descending by last_name]
        fields=[string]; filter specific fields [by default shows all fields, usage field1,field2,field3,..., (fields: id, first_name, last_name, img, job, education, experience, expertise, bio, tel, mail, twitter)]
    )

##### Show profile
* URL: /profiles/:id
* Method: GET
* Required parameters
    (

        :id=[string]; the identifier of the profile.
    )

##### Show all services by profile
* URL: /profiles/:id/services
* Method: GET
* Required parameters
    (

        :id=[string]; the identifier of the profile.
    )

* Optional parameters
    (

        fields=[string]; filter specific fields to improve data transfer efficiency [undefined => shows all fields, usage field1,field2,field3,..., (fields: id, title, description, image)]
    )
    
### About data transfer efficiency
The API has been optimized in order to provide great efficiency by reducing the amount of data sent to the client by as much as possible.
In order to achieve this result, we added the ability to specify a new parameter called 'fields' in most queries: this allows clients to request only necessary fields and reduce data transfers altogether.

For instance, the 'All Locations' web page does not display all the information available for every location (e.g. address, phone number, ...), hence it would be a waste of bandwidth to request those kinds of data. The API allows the client to request only the required subset of data (identifier, title, description and image) at this URI: '/locations?fields=id,title,description,img'.
    
## Client-side languages
The project uses the following technologies:

1.  HTML
:   Used for the entire structure of the website.
2.  CSS
:   Used for styling and theming.
3.  Javascript
:   Used to fetch data asynchronously from the JSON database using Ajax and to populate the HTML files accordingly.
4.  JSON
:   Used to organize data for the time being.

## Design
The project was designed entirely by us, that is to say we did not use an existing template and wrote all the HTML, CSS and Javascript code linked to the user interface.
We used Bootstrap to help us make the website responsive on all screen sizes.
We employed the free font Fredoka One from Google Fonts.
We also took some minor design clues from popular websites such as:

1.  https://www.engadget.com
2.  https://www.apple.com/retail/unionsquare

## Third party libraries
We used the following third party libraries to help us write better code:

1.  Bootstrap
:   UI and responsiveness.
2.  jQuery
:   Asynchronous data load.
3.  Google Maps API
:   Maps and markers.

## Issues faced during development
During our development process we encountered a few minor issues we had to deal with:

1.  Make the JSON database work as a relational database
:   Using a JSON file as your database can be tricky, especially if you have to emulate the behavior of a relational database and foreign keys. In order to do that we employed ids for every item in the database (locations, services and people) and assigned an array of ids as a link to foreign items.
For instance, a service can be offered in multiple locations: we assign an array of location ids to the service so, when we retrive it, we can also get all of the locations from the database, filter them and display only the ones linked to the service.
2.  Responsiveness and cross-platform compatibility
:   Another issue we faced was to make the website adapt to all kind of screens and resolutions. We worked hard to make it scale beautifully from smartphones to 27 inch screens.
For instance, we decided that columns of cards worked well on large screens and helped us emphasize the content, but we also found out that they did not work well at all for smartphones, given the limited space available . We made heavy use of CSS to seamlessly morph columns of cards into lists and viceversa.