module.exports = class Response {
    constructor(success=false, message="", data=null) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}