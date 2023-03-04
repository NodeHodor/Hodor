var parser = require('mongodb-query-parser');
var query = '{_id: ObjectId("58c33a794d08b991e3648fd2")}';
// What is this highlighting/language mode for this string?
parser(query);
// >>> `javascript`

var queryAsJSON = '{"_id":{"$oid":"58c33a794d08b991e3648fd2"}}';
// What is this highlighting/language mode for this string?
parser(queryAsJSON);
// >>> `json`

// Turn it into a JS string that looks pretty in codemirror:
// parser.toJavascriptString(parse(query));
// >>> '{_id:ObjectId(\'58c33a794d08b991e3648fd2\')}'
//

