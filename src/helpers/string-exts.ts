interface String {
    scrub(): string;
}

/** Extend string prototype to include a method to remove spaces, special chars 
 * returns all lowercase alphanumeric string
 */
String.prototype.scrub = function(){
    return this.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}