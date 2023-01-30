var policy  = require("access-policy");

var statement = {
    "statements": [
        {
            "action": "*",
            "resource": [
                "/user/${user.id}",
                "/user/${user.id}/*"
            ]
        }
    ]
}
var data = {
    user: {
        id: 12345
        }
    };
policy.encode(statement, data);