import logging

def analysis_Declaration(self, blck, _type, f=0):
    if _type == "VariableDeclaration":
        self.analysis_VariableDeclaration(blck)
    elif _type == "FunctionDeclaration":
        self.analysis_FunctionDeclaration(blck, f=f)
    elif _type == "ClassDeclaration":
        self.analysis_ClassDeclaration(blck, f=f)

def analysis_ClassDeclaration(self, blck, f=0):
    if f == 0:
        _sid = self.scope_id
        _name = blck["id"]["name"]
        _key = (self.scope_id[1], (_name, (blck["start"], blck["end"])))
        self.scopes[self.module_name][_sid][_key] = {
                                    "name": _name,
                                    "type": "class",
                                    "edge": [],
                                    "blck": [],
                                    "loc": blck["loc"],
                                    "start": blck["start"],
                                    "end": blck["end"],
                                }
        if _key not in self.scopes[self.module_name]:
            self.scopes[self.module_name][_key] = dict()
        if (self.scope_id[1], (_name, blck)) not in self.scope_list:
            self.scope_list.append((self.scope_id[1], (_name, blck)))
        self.func_id[(blck["start"], blck["end"])] = f"{_name}@{self.module_name}, {blck['loc']['start']['line']}"
        self.record_function_table(name=_name, id=(_sid, _key))

        if blck["superClass"]:
            p_list = self.analysis_Expression(blck["superClass"], blck["superClass"]["type"], f=1)
            self.scopes[self.module_name][_sid][_key]["edge"].extend(p_list)

        return [(self.module_name, (_sid, (blck["start"], blck["end"])))]
    else:
        if self.stage == "inter":
            _sid = self.scope_id
            _name = blck["id"]["name"]
            _key = (self.scope_id[1], (_name, (blck["start"], blck["end"])))
            self.scopes[self.module_name][_sid][_key]
            return [(self.module_name, (_sid, _key)), ]
        else:
            _sid = self.scope_id
            for _block in blck["body"]["body"]:
                if "Declaration" in _block["type"]:
                    self.analysis_Declaration(_block, _block["type"])
                elif "MethodDefinition" == _block["type"]:
                    _value = _block["value"]
                    _key = _block["key"]
                    if _key["type"] in ["Identifier", "PrivateIdentifier"]:
                        _key = _block["key"]["name"]
                        _keyP = (self.scope_id[1], (_block["key"]["name"], (_block["value"]["start"], _block["value"]["end"])))
                        self.scopes[self.module_name][_sid][_keyP]  = {
                            "name": _key,
                            "type": "func",
                            "loc": _block["loc"],
                            "start": _block["start"],
                            "end": _block["end"],
                            "blck": [],
                            "edge": [],
                            "prop": [],
                            "self": False
                        }

                        self.func_id[(_block["value"]["start"], _block["value"]["end"])] = f"{_block['key']['name']}@{self.module_name}, {_block['loc']['start']['line']}"

                        if (self.scope_id[1], (_key,_value)) not in self.scope_list:
                            self.scope_list.append((self.scope_id[1], (_key,_value)))
                    else:
                        logging.error("[-] analysis class declaration key is not a identifier! ", _key['type'], self.source_code[self.module_name][_key["start"]:_key["end"]], self.module_name)
                else:
                    logging.error("_block type error")

def analysis_FunctionDeclaration(self, block, f=0):
    if f == 0:
        id = block["id"]
        _sid = self.scope_id
        _name  = id["name"] if id else "anonymous"
        _key = (self.scope_id[1], (_name, (block["start"], block["end"])))
        self.scopes[self.module_name][self.scope_id][_key] = {
                                    "name": _name,
                                    "type": "func",
                                    "loc": block["loc"],
                                    "start": block["start"],
                                    "end": block["end"],
                                    "edge": [(self.module_name, (_sid, _key))],
                                    "blck": [],
                                    "prop": [],
                                    "self": False
                                }

        if _key not in self.scopes[self.module_name]:
            self.scopes[self.module_name][_key] = dict()
        if (self.scope_id[1], (_name, block)) not in self.scope_list:
            self.scope_list.append((self.scope_id[1], (_name, block)))
        
        self.record_function_table(name=_name, id=(self.scope_id, _key))
        self.func_id[(block["start"], block["end"])] = f"{_name}@{self.module_name}, {block['loc']['start']['line']}"

        return [(self.module_name, (_sid, _key))]
        
    else:
        if self.stage == "inter":
            id = block["id"]
            _sid = self.scope_id
            _name  = id["name"] if id else "anonymous"
            _key = (self.scope_id[1], (_name, (block["start"], block["end"])))
            self.scopes[self.module_name][_sid][_key]
            return [(self.module_name, (_sid, _key)), ]
        else:
            _sid = self.scope_id
            params = block["params"]
            self.analysis_params(params)

            body = block["body"]
            for _block in body["body"]:
                if "Declaration" in _block["type"]:
                    self.analysis_Declaration(_block, _block["type"])
                elif "Statement" in _block["type"]:
                    self.analysis_Statement(_block, _block["type"])
                else:
                    logging.error("[-] analysis function declaration error! ", _block["type"])

def analysis_VariableDeclaration(self, blck):
    source_code = self.get_source_code(self.module_name, blck)
    _sid = self.scope_id
    for declaration in blck["declarations"]:
        if declaration["init"] != None:
            id = declaration["id"]
            init = declaration["init"]
            if init["type"] == "AssignmentExpression":
                _right = self.analysis_Expression(init, init["type"], f=1)
                if id["type"] == "Identifier":
                        _name = id["name"]
                        _key = (self.scope_id[1], (_name, (id["start"], id["end"])))
                        self.scopes[self.module_name][_sid][_key] = {
                            "name": _name,
                            "type": "var",
                            "blck": [_right,],
                            "edge": [],
                            "loc": id["loc"],
                            "start": blck["start"],
                            "end": blck["end"],
                            "native": False
                        }
                elif id["type"] == "ObjectPattern":
                    work_list = list()
                    work_list.append(id)
                    _init = _right
                    while len(work_list) > 0:
                        properties = work_list.pop()
                        __properties = properties
                        if type(properties) == tuple:
                            _init = (_init, properties[1])
                            properties = properties[0]
                        properties = properties["properties"]
                        for property in properties:
                            if property["type"] == "Property":
                                if property["value"]["type"] == "Identifier":
                                    _name = property["value"]["name"]
                                    _key = (self.scope_id[1], (_name, (property["value"]["start"], property["value"]["end"])))
                                    self.scopes[self.module_name][_sid][_key] = {
                                        "name": _name,
                                        "type": "obj_mem",
                                        "blck": [(_init, property["key"]["name"]), ],
                                        "edge": [],
                                        "loc": property["value"]["loc"],
                                        "start": blck["start"],
                                        "end": blck["end"],
                                    }
                                elif property["value"]["type"] == "ObjectPattern":
                                    work_list.append((property["value"], property["key"]["name"]))
                                elif property["value"]["type"] == "AssignmentPattern":
                                    left = property["value"]["left"]
                                    right = property["value"]["right"]
                                    if left["type"] == "Identifier":
                                        _key = (self.scope_id[1], (left["name"], (left["start"], left["end"])))
                                        self.scopes[self.module_name][_sid][_key] = {
                                            "name": left["name"],
                                            "type": "obj_mem",
                                            "blck": [(_init, left["name"]),],
                                            "edge": [],
                                            "loc": left["loc"],
                                            "start": blck["start"],
                                            "end": blck["end"],
                                            "points": []
                                        }
                                    else:
                                        logging.error("AssignmentPattern", left["type"])
                                else:
                                    logging.error(f"property value type error")
                        if type(__properties) == tuple:
                            _init = _init[0]
                elif id["type"] == "ArrayPattern":
                        work_list = list()
                        work_list.append(id)
                        while len(work_list) > 0:
                            elements = work_list.pop()["elements"]
                            for element in elements:
                                if element == None:
                                    continue
                                if element["type"] == "Identifier":
                                    _name = element["name"]
                                    _key = (self.scope_id[1], (_name, (element["start"], element["end"])))
                                    self.scopes[self.module_name][_sid][_key] = {
                                        "name": _name,
                                        "type": "var",
                                        "blck": [_right,],
                                        "edge": [],
                                        "loc": element["loc"],
                                        "start": blck["start"],
                                        "end": blck["end"],
                                        "native": False
                                    }
                                elif element["type"] == "ObjectPattern":
                                    work_list.append(element)
                                else:
                                    logging.error("element type error")
                else:
                    pass
            else:
                self.analysis_Expression(init, init["type"])
                if id["type"] == "Identifier":
                        _name = id["name"]
                        _key = (self.scope_id[1], (_name, (id["start"], id["end"])))
                        self.scopes[self.module_name][_sid][_key] = {
                            "name": _name,
                            "type": "var",
                            "blck": [init,],
                            "edge": [],
                            "loc": id["loc"],
                            "start": blck["start"],
                            "end": blck["end"],
                            "native": False
                        }
                elif id["type"] == "ObjectPattern":
                    work_list = list()
                    work_list.append(id)
                    _init = init
                    while len(work_list) > 0:
                        properties = work_list.pop()
                        __properties = properties
                        if type(properties) == tuple:
                            _init = (_init, properties[1])
                            properties = properties[0]
                        properties = properties["properties"]
                        for property in properties:
                            if property["type"] == "Property":
                                if property["value"]["type"] == "Identifier":
                                    _name = property["value"]["name"]
                                    _key = (self.scope_id[1], (_name, (property["value"]["start"], property["value"]["end"])))
                                    if property["key"]["type"] == "Literal":
                                        pass
                                    elif property["key"]["type"] == "Identifier":
                                        self.scopes[self.module_name][_sid][_key] = {
                                            "name": _name,
                                            "type": "obj_mem",
                                            "blck": [(_init, property["key"]["name"]), ],
                                            "edge": [],
                                            "loc": property["value"]["loc"],
                                            "start": blck["start"],
                                            "end": blck["end"],
                                        }
                                    else:
                                        logging.error("wrong property type")
                                elif property["value"]["type"] == "ObjectPattern":
                                    work_list.append((property["value"], property["key"]["name"]))
                                elif property["value"]["type"] == "AssignmentPattern":
                                    left = property["value"]["left"]
                                    right = property["value"]["right"]
                                    if left["type"] == "Identifier":
                                        _key = (self.scope_id[1], (left["name"], (left["start"], left["end"])))
                                        self.scopes[self.module_name][_sid][_key] = {
                                            "name": left["name"],
                                            "type": "obj_mem",
                                            "blck": [(_init, left["name"]),],
                                            "edge": [],
                                            "loc": left["loc"],
                                            "start": blck["start"],
                                            "end": blck["end"],
                                            "points": []
                                        }
                                    else:
                                        logging.error("AssignmentPattern", left["type"])
                                else:
                                    logging.error(f"property value type error")
                        if type(__properties) == tuple:
                            _init = _init[0]
                elif id["type"] == "ArrayPattern":
                        work_list = list()
                        work_list.append(id)
                        while len(work_list) > 0:
                            elements = work_list.pop()["elements"]
                            for element in elements:
                                if element == None:
                                    continue
                                if element["type"] == "Identifier":
                                    _name = element["name"]
                                    _key = (self.scope_id[1], (_name, (element["start"], element["end"])))
                                    self.scopes[self.module_name][_sid][_key] = {
                                        "name": _name,
                                        "type": "var",
                                        "blck": [init,],
                                        "edge": [],
                                        "loc": element["loc"],
                                        "start": blck["start"],
                                        "end": blck["end"],
                                        "native": False
                                    }
                                elif element["type"] == "ObjectPattern":
                                    work_list.append(element)
                                else:
                                    logging.error("element type error")
                else:
                    logging.error("!!", id["type"], self.module_name, self.source_code[id["start"]:id["end"]], self.source_code[declaration["start"]:declaration["end"]])
        else:
            id = declaration["id"]
            if id["type"] == "Identifier":
                _name = id["name"]
                _key = (self.scope_id[1], (_name, (id["start"], id["end"])))
                self.scopes[self.module_name][_sid][_key] = {
                    "name": _name,
                    "type": "var",
                    "edge": [],
                    "blck": [],
                    "loc": id["loc"],
                    "start": id["start"],
                    "end": id["end"],
                    "native": False
                }
            else:
                logging.error("declaration id error")