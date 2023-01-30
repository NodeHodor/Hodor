var policy  = require("access-policy");

var statement = {
    "statements": [
        {
            "action": "*",
            "resource": [
                "/user/${user.id}/*"
            ]
        },
        {
            "effect": "deny",
            "action": "*",
            "resource": [
                 "/user/${user.id}/bill"
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