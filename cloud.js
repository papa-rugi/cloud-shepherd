
/*
Each child of this abstract class will be a an abstraction of a given clouds api. The intent is to genericise the apis
so they can all easily be used under one uniform interface.
 */

class Cloud {
    constructor( credentials ) {
        this.self = this;
        this.credentials = credentials;
    }


    getCredentials() {
        return this.credentials;
    }

    setCredentials( credentials ) {
        this.credentials = credentials;
    }






}

module.exports = Cloud;
