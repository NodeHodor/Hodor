import logging

def analysis_Statement(self, block, type):
    if type == "BlockStatement":
        self.analysis_BlockStatement(block)
    elif type == "ExpressionStatement":
        self.analysis_ExpressionStatement(block)
    elif type == "ThrowStatement":
        self.analysis_ThrowStatement(block)
    elif type == "IfStatement":
        self.analysis_IfStatement(block)
    elif type == "ForStatement":
        self.analysis_ForStatement(block)
    elif type == "ForOfStatement":
        self.analysis_ForOfStatement(block)
    elif type == "ForInStatement":
        self.analysis_ForInStatement(block)
    elif type == "TryStatement":
        self.analysis_TryStatement(block)
    elif type == "ReturnStatement":
        self.analysis_ReturnStatement(block)
    elif type == "SwitchStatement":
        self.analysis_SwitchStatement(block)
    elif type == "ContinueStatement":
        self.analysis_ContinueStatement(block)
    elif type == "WhileStatement":
        self.analysis_WhileStatement(block)
    elif type == "BreakStatement":
        self.analysis_BreakStatement(block)
    elif type == "DoWhileStatement":
        self.analysis_DoWhileStatement(block)
    elif type == "EmptyStatement":
        self.analysis_EmptyStatement(block)
    else:
        pass
    
def analysis_BlockStatement(self, block):
    if (self.scope_id[1], ("anonymous", block)) not in self.scope_list:
        self.scope_list.append((self.scope_id[1], ("anonymous", block)))

def analysis_ExpressionStatement(self, block):
    block_source_code = self.get_source_code(self.module_name, block)
    if 'this.run' in block_source_code:
        print("herre")
    self.analysis_Expression(block["expression"], block["expression"]["type"])

def analysis_ThrowStatement(self, block):
    argument = block["argument"]
    self.analysis_Expression(argument, argument["type"])

def analysis_IfStatement(self, block):
        test_block = block["test"]
        consequent_block = block["consequent"]
        alternate_block = block["alternate"]
        
        if "Expression" in test_block["type"]:
            self.analysis_Expression(test_block, test_block["type"])
        elif test_block["type"] == "TemplateLiteral":
            self.analysis_TemplateLiteral(test_block)
        elif test_block["type"] == "Identifier" or test_block["type"] == "Literal":
            pass
        elif test_block["type"] == 'MetaProperty':
            pass
        else:
            pass

        if "Statement" in consequent_block["type"]:
            if consequent_block["type"] == "BlockStatement":
                body = consequent_block["body"]
                for block in body:
                    if "Statement" in block["type"]:
                        self.analysis_Statement(block, block["type"])
                    elif "Declaration" in block["type"]:
                        self.analysis_Declaration(block, block["type"])
                    else:
                        pass
            elif "Statement" in consequent_block["type"]:
                self.analysis_Statement(consequent_block, consequent_block["type"])
            else:
                pass
        elif "Expression" in consequent_block["type"]:
            self.analysis_Expression(consequent_block, consequent_block["type"])
        else:
            pass

        if alternate_block != None:
            if alternate_block["type"] == "BlockStatement":
                body = alternate_block["body"]
                for block in body:
                    if "Statement" in block["type"]:
                        self.analysis_Statement(block, block["type"])
                    elif "Declaration" in block["type"]:
                        self.analysis_Declaration(block, block["type"])
                    else:
                        pass
            elif "Statement" in alternate_block["type"]:
                self.analysis_Statement(alternate_block, alternate_block["type"])
            elif "Expression" in alternate_block["type"]:
                self.analysis_Expression(alternate_block, alternate_block["type"])
            else:
                pass

def analysis_ForStatement(self, block):
    if block["init"]:
        if block["init"]["type"] == "VariableDeclaration":
            declarations = block["init"]["declarations"]
            for declaration in declarations:
                id = declaration["id"]
                if id["type"] == "Identifier":
                    _key = (self.scope_id[1], (id["name"], (id["start"], id["end"])))
                    self.scopes[self.module_name][self.scope_id][_key] ={
                                                                        "name": id["name"],
                                                                        "type": "index",
                                                                        "blck": [],
                                                                        "edge": [],
                                                                        "loc": id["loc"],
                                                                        "start": id["start"],
                                                                        "end": id["end"],
                                                                    }
                else:
                    pass
        elif block["init"]["type"] == "AssignmentExpression":
            left_list = list()

            right_expression = block["init"]["right"]
            left_expression = block["init"]["left"]
        
            left_list.append(left_expression)

            while right_expression["type"] == "AssignmentExpression":
                left_expression = right_expression["left"]
                left_list.append(left_expression)
                right_expression = right_expression["right"]

            for i in left_list:
                if i["type"] == "Identifier":
                    _key = (self.scope_id[1], (i["name"], (i["start"], i["end"])))
                    self.scopes[self.module_name][self.scope_id][_key] = {
                        "name": i["name"],
                        "type": "index",
                        "edge": [],
                        "blck": [],
                        "loc": i["loc"],
                        "start": block["start"],
                        "end": block["end"],
                    }
                else:
                    pass
        else:
            pass

    test = block["test"]
    if test:
        self.analysis_Expression(test, test["type"])

    if "Statement" in block["body"]["type"]:
        if block["body"]["type"] == "BlockStatement":
            body = block["body"]["body"]
            for block in body:
                if "Statement" in block["type"]:
                    self.analysis_Statement(block, block["type"])
                elif "Declaration" in block["type"]:
                    self.analysis_Declaration(block, block["type"])
                else:
                    pass
        elif "Statement" in block["body"]["type"]:
            self.analysis_Statement(block["body"], block["body"]["type"])
        elif "Expression" in block["body"]["type"]:
            self.analysis_Expression(block["body"], block["body"]["type"])
        else:
            pass
    else:
        pass

def analysis_ForOfStatement(self, block):
    left = block["left"]
    right = block["right"]

    if left["type"] == "VariableDeclaration":
        declarations = left["declarations"]
        for declaration in declarations:
            id = declaration["id"]
            if id["type"] == "Identifier":
                _key = (self.scope_id[1], (id["name"], (id["start"], id["end"])))
                self.scopes[self.module_name][self.scope_id][_key] ={
                                                                    "name": id["name"],
                                                                    "type": "index",
                                                                    "blck": [right,],
                                                                    "edge": [],
                                                                    "loc": id["loc"],
                                                                    "start": id["start"],
                                                                    "end": id["end"],
                                                                }
            elif id["type"] == "ObjectPattern":
                work_list = list()
                work_list.append(id)
                while len(work_list) > 0:
                    properties = work_list.pop()
                    __properties = properties
                    if type(properties) == tuple:
                        _init = (_init, properties[1])
                        properties = properties[0]
                    properties = properties["properties"]
                    for property in properties:
                        if property["value"]["type"] == "Identifier":
                            _name = property["value"]["name"]
                            _key = (self.scope_id[1], (_name, (property["value"]["start"], property["value"]["end"])))
                            self.scopes[self.module_name][self.scope_id][_key] = {
                                "name": _name,
                                "type": "index",
                                "blck": [right,],
                                "edge": [],
                                "loc": property["value"]["loc"],
                                "start": block["start"],
                                "end": block["end"],
                            } 
                        elif property["value"]["type"] == "ObjectPattern":
                            work_list.append((property["value"], property["key"]["name"]))
                        elif property["value"]["type"] == "AssignmentPattern":
                            left = property["value"]["left"]
                            right = property["value"]["right"]
                            if left["type"] == "Identifier":
                                _key = (self.scope_id[1], (left["name"], (left["start"], left["end"])))
                                self.scopes[self.module_name][self.scope_id][_key] = {
                                    "name": left["name"],
                                    "type": "index",
                                    "blck": [right,],
                                    "edge": [],
                                    "loc": left["loc"],
                                    "start": block["start"],
                                    "end": block["end"],
                                    "points": []
                                }
                            else:
                                pass
                        else:
                            pass
                    if type(__properties) == tuple:
                        _init = _init[0]
            else:
                pass
    else:
        pass

    body = block["body"]
    if "Statement" in block["body"]["type"]:
        if block["body"]["type"] == "BlockStatement":
            body = block["body"]["body"]
            for block in body:
                if "Statement" in block["type"]:
                    self.analysis_Statement(block, block["type"])
                elif "Declaration" in block["type"]:
                    self.analysis_Declaration(block, block["type"])
                else:
                    pass
        elif "Statement" in block["body"]["type"]:
            self.analysis_Statement(block["body"], block["body"]["type"])
        elif "Expression" in block["body"]["type"]:
            self.analysis_Expression(block["body"], block["body"]["type"])
        else:
            pass
    else:
        pass


def analysis_TryStatement(self, block):
    block_ = block["block"]
    if block_["type"] == "BlockStatement":
        body = block_["body"]
        for _block in body:
            if "Statement" in _block["type"]:
                self.analysis_Statement(_block, _block["type"])
            elif "Declaration" in _block["type"]:
                self.analysis_Declaration(_block, _block["type"])
            else:
                pass
    else:
        pass

    handler = block["handler"]
    if handler:
        param = handler["param"]
        if handler["type"] == "CatchClause":
            if handler["body"]["type"] == "BlockStatement":
                body = handler["body"]
                for _block in body["body"]:
                    if "Statement" in _block["type"]:
                        self.analysis_Statement(_block, _block["type"])
                    elif "Declaration" in _block["type"]:
                        self.analysis_Declaration(_block, _block["type"])
                    else:
                        pass
            else:
                pass
        else:
            pass

    
    finalizer = block["finalizer"]
    if finalizer:
        if finalizer["type"] == "BlockStatement":
            body = finalizer["body"]
            for _block in body:
                if "Statement" in _block["type"]:
                    self.analysis_Statement(_block, _block["type"])
                elif "Declaration" in _block["type"]:
                    self.analysis_Declaration(_block, _block["type"])
                else:
                    print("[-] Try Statment finalizer error! ")
        else:
            print("[-] Try Statment finalizer error! ")

def analysis_ReturnStatement(self, block):
    sid = self.scope_id
    if "argument" in block and block["argument"]:
        _key = (self.scope_id[1], ("rtrn", (block["start"], block["end"])))
        if _key not in self.scopes[self.module_name][sid]:
            self.scopes[self.module_name][sid][_key] = {
                "type": "rtrn",
                "blck": [block["argument"]],
                "edge": [],
                "loc": block["loc"],
                "start": block["start"],
                "end": block["end"]
            }
        else:
            pass

        if sid[1][0] in self.function_table:
            func_name = sid[1][0]
            if sid in self.function_table[func_name]:
                self.function_table[func_name][sid]["return"].append((self.module_name, (sid, _key)))
            else:
                pass
        else:
            pass
    else:
        pass

def analysis_SwitchStatement(self, block):
    discriminant = block["discriminant"]
    self.analysis_Expression(discriminant, discriminant["type"])
    cases = block["cases"]
    for case in cases:
        test = case["test"]
        if test:
            if "Expression" in test["type"]:
                self.analysis_Expression(test, test["type"])
            elif test["type"] == "Literal" or test["type"] == "Identifier":
                pass
            else:
                pass
        
        consequent = case["consequent"]
        for i in consequent:
            if "Statement" in i["type"]:
                self.analysis_Statement(i, i["type"])
            elif "Declaration" in i["type"]:
                self.analysis_Declaration(i, i["type"])
            else:
                pass

def analysis_ContinueStatement(self, block):
    pass

def analysis_WhileStatement(self, block):
    test = block["test"]
    if "Expression" in test["type"]:
        self.analysis_Expression(test, test["type"])
    elif test["type"] == "Literal" or test["type"] == "Identifier":
        pass
    else:
        pass

    body = block["body"]
    if body["type"] == "BlockStatement":
        for block in body["body"]:
            if "Statement" in block["type"]:
                self.analysis_Statement(block, block["type"])
            elif "Declaration" in block["type"]:
                self.analysis_Declaration(block, block["type"])
            else:
                pass
    elif body["type"] == "EmptyStatement":
        pass
    elif body["type"] == "ExpressionStatement":
        self.analysis_ExpressionStatement(body)
    else:
        pass

def analysis_BreakStatement(self, block):
    pass

def analysis_DoWhileStatement(self, block):
    body = block["body"]
    test = block["test"]

    if body["type"] == "BlockStatement":
        for block in body["body"]:
            if "Statement" in block["type"]:
                self.analysis_Statement(block, block["type"])
            elif "Declaration" in block["type"]:
                self.analysis_Declaration(block, block["type"])
            else:
                pass
    else:
        pass

    
    if "Expression" in test["type"]:
        self.analysis_Expression(test, test["type"])
    elif test["type"] == "Literal" or test["type"] == "Identifier":
        pass
    else:
        pass

def analysis_ForInStatement(self, block):
    body = block["body"]
    if body["type"] == "BlockStatement":
        for block in body["body"]:
            if "Statement" in block["type"]:
                self.analysis_Statement(block, block["type"])
            elif "Declaration" in block["type"]:
                self.analysis_Declaration(block, block["type"])
            else:
                pass
    else:
        pass

def analysis_EmptyStatement(self, block):
    pass
