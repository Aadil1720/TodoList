 //Note Module.exports is js obejct.
 //console.log(module); this gives the useful information about this page
// module.exports="Hello World";// Whenever the app.js require this page it will export hello world

exports.getDate  =function() {// module.exports==exports
    const today = new Date();

    options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return today.toLocaleDateString("en-US", options);
}

exports.getDay=function() {
    const today = new Date();

    options = {
        weekday: "long"
    };

    return today.toLocaleDateString("en-US", options);
}
