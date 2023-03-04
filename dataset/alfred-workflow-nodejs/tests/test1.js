var AlfredNode = require('alfred-workflow-nodejs');
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
var Item = AlfredNode.Item;

(function main() {
    actionHandler.onAction("action1", function(query) {
        // your code to handle action 1 here
    });
    actionHandler.onAction("action2", function(query) {
        // your code to handle action 2 here
    });
    
    actionHandler.onMenuItemSelected("action2", function(query, selectedTitle, selectedData) {
        // your code to handle manu item selected of action 2 here
    });

    AlfredNode.run();
})();


workflow.setName("example-alfred-workflow-using-nodejs");
