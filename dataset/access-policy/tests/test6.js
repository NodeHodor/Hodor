var policy  = require("access-policy");

var statement = {
    "statements": [
        {
            "action": "*",
            "resource": "/user/${user.id}",
            "restriction": {
                "equals": {
                    "user_id": "${user.id}",
                    "active": true
                }
            }
        }
    ]
}
var data = {
    user: {
        id: 12345
        }
    };
policy.encode(statement, data);