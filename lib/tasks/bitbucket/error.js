module.exports = function (stage, message) {
    this.task = "bitbucket";
    this.name = stage + 'Error';
    this.message = message != null ? message : "No error message provided";
    this.command = stage.split(/(?=[A-Z])/).join(" ").toLowerCase();
    this.stack = (new Error()).stack;
};