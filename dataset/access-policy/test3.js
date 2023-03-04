var policy  = require("access-policy");

var statement = {
    "statements": [
        {
            "action": ["get", "post"],
            "resource": [
                "/user/${user.id}"
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