import copy
import logging
from re import L
from subprocess import call
from xml.dom.minidom import Identified

def analysis_Expression(self, block, type, f=0, p=None):
    if type == "AssignmentExpression":
        return self.analysis_AssignmentExpression(block)
    elif type == "ArrowFunctionExpression":
        return self.analysis_ArrowFunctionExpression(block, f=f)
    elif type == "ArrayExpression":
        return self.analysis_ArrayExpression(block)
    elif type == "BinaryExpression":
        return self.analysis_BinaryExpression(block)
    elif type == "FunctionExpression":
        return self.analysis_FunctionExpression(block, f=f)
    elif type == "CallExpression":
        return self.analysis_CallExpression(block=block, f=f, call_p=p)
    elif type == "ChainExpression":
        return self.analysis_ChainExpression(block)
    elif type == "ClassExpression":
        return self.analysis_ClassExpression(block)
    elif type == "ConditionalExpression":
        return self.analysis_ConditionalExpression(block)
    elif type == "LogicalExpression":
        self.analysis_LogicalExpression(block)
    elif type == "MemberExpression":
        return self.analysis_MemberExpression(block, f=f)
    elif type == "NewExpression":
        return self.analysis_NewExpression(block, f=f, call_p=p)
    elif type == "ObjectExpression":
        return self.analysis_ObjectExpression(block, f=f)
    elif type == "TaggedTemplateExpression":
        self.analysis_TaggedTemplateExpression(block)
    elif type == "UnaryExpression":
        self.analysis_UnaryExpression(block)
    elif type == "ThisExpression":
        return []
    elif type == "UpdateExpression":
        return self.analysis_UpdateExpression(block)
    elif type == "AwaitExpression":
        return self.analysis_AwaitExpression(block)
    elif type == "Literal":
        pass
    elif type == "TemplateLiteral":
        return self.analysis_TemplateLiteral(block)
    elif type == "YieldExpression":
        pass
    elif type == "Identifier":
        return self.analysis_Identifier(block)
    elif type == "SpreadElement":
        return self.analysis_SpreadElement(block)
    elif type == "MetaProperty":
        pass
    elif type == "Literal":
        pass
    else:
        pass #TODO logging.error(f"Expression type did not be analysised! {type}")
        return [("", ())]

def analysis_TemplateLiteral(self, _node):
    # `Hello, ${user.name}!`
    r = list()
    expressions = _node["expressions"]
    for expression in expressions:
        expression_p_list = self.analysis_Expression(expression, expression["type"])
        if expression_p_list:
            r.extend(expression_p_list)
    return r

def analysis_AssignmentExpression(self, block):
    left_list = list()

    right_expression = block["right"]
    left_expression = block["left"]

    left_list.append(left_expression)

    while right_expression["type"] == "AssignmentExpression":
        left_expression = right_expression["left"]
        left_list.append(left_expression)
        right_expression = right_expression["right"]

    sid = self.scope_id
    for i in left_list:
        if i["type"] == "Identifier":
            _key = (self.scope_id[1], (i["name"], (i["start"], i["end"])))
            self.scopes[self.module_name][sid][_key] = {
                "name": i["name"],
                "type": "var",
                "edge": [],
                "blck": [right_expression, ],
                "loc": i["loc"],
                "start": block["start"],
                "end": block["end"],
                "native": False,
            }
        elif i["type"] == "MemberExpression":
            source_code = self.get_source_code(self.module_name, i)
            p_list = self.assignment_memberexpression(i)
            # for debugging
            for p in p_list:
                if p[0] in ["undefined", "primordials", "binding", "internalBinding"]:
                    continue
                if p[1][1][0] in ["this", "prop"]:
                    if not p[1][1][1]:
                        continue
                    self.scopes[p[0]][p[1][0]][p[1][1][0]][p[1][1][1]]["blck"].append(right_expression)
                else:
                    self.scopes[p[0]][p[1][0]][p[1][1]]["blck"].append(right_expression)
        elif i["type"] == "ObjectPattern":
            work_list = list()
            work_list.append(i)
            _right_expression = right_expression
            while len(work_list) > 0:
                properties = work_list.pop()
                __properties = properties
                if type(properties) == tuple:
                    _right_expression = (_right_expression, properties[1])
                    properties = properties[0]
                properties = properties["properties"]
                for property in properties:
                    if property["value"]["type"] == "Identifier":
                        _name = property["value"]["name"]
                        _key = (
                            self.scope_id[1], (_name, (property["value"]["start"], property["value"]["end"])))
                        self.scopes[self.module_name][sid][_key] = {
                            "name": _name,
                            "type": "obj_mem",
                            "blck": [(_right_expression, _name) ],
                            "loc": property["value"]["loc"],
                            "edge": [],
                        }
                    elif property["value"]["type"] == "ObjectPattern":
                        work_list.append((property["value"], property["key"]["name"]))
                if type(__properties) == tuple:
                    _init = _init[0]
        else:
            pass #TODO logging.error("[-] Assignment Expression left list type is error!! ", i["type"])
    return right_expression

def assignment_memberexpression(self, block):
    _property = block["property"]
    _object = block["object"]
    work_list = list()
    work_list.append(_property)
    while _object["type"] == "MemberExpression":
        _property = _object["property"]
        _object = _object["object"]
        work_list.append(_property)
    work_list.append(_object)
    if (work_list[-1]["type"] == "Identifier" and work_list[-1]["name"] == "module" \
        and work_list[-2]["type"] == "Identifier" and work_list[-2]["name"] == "exports"):
        _key = (self.scope_id[1], ("module.exports", (block["start"], block["end"])))
        self.scopes[self.module_name][self.scope_id][_key] = {
            "name": "module.exports",
            "type": "obj",
            "loc": block["loc"],
            "edge": [],
            "blck": [],
            "start": block["start"],
            "end": block["end"],
            "native": False
        }
        if self.module_name not in self.module_exports:
            self.module_exports[self.module_name] = list()
        self.module_exports[self.module_name].append((self.module_name, (self.scope_id, _key)))

        p = _key
        work_list.pop()
        work_list.pop()
        if work_list:
            self.scopes[self.module_name][_key] = dict()
            while work_list:
                if len(work_list) == 1:
                    node = work_list.pop()
                    if node["type"] == "Identifier":
                        _name = node["name"]
                        final_key = (_key[1],(_name, (block["start"], block["end"])))
                        self.scopes[self.module_name][_key][final_key] = {
                            "name": _name,
                            "type": "var",
                            "loc": block["loc"],
                            "edge": [],
                            "blck": [],
                            "start": block["start"],
                            "end": block["end"],
                            "native": False
                        }
                        return [(self.module_name, (p, final_key))]
                    else:
                        pass #TODO logging.error(f"node type error {node['type']}")
                        return [(self.module_name, (self.scope_id, _key))]
                else:
                    pass #TODO logging.error("length of work list > 1")
                    return [(self.module_name, (self.scope_id, _key))]
        else:
            return [(self.module_name, (self.scope_id, _key))]
    elif work_list[-1]["type"] == "Identifier" and work_list[-1]["name"] == "exports":
        _key = (self.scope_id[1], ("exports", (block["start"], block["end"])))
        self.scopes[self.module_name][self.scope_id][_key] = {
            "name": "exports",
            "type": "obj",
            "loc": block["loc"],
            "edge": [],
            "blck": [],
            "start": block["start"],
            "end": block["end"],
            "native": False
        }
        if self.module_name not in self.module_exports:
            self.module_exports[self.module_name] = list()
        self.module_exports[self.module_name].append((self.module_name, (self.scope_id, _key)))

        p = _key
        work_list.pop()
        if work_list:
            self.scopes[self.module_name][_key] = dict()
            while work_list:
                if len(work_list) == 1:
                    node = work_list.pop()
                    if node["type"] == "Identifier":
                        _name = node["name"]
                        final_key = (_key[1],(_name, (block["start"], block["end"])))
                        self.scopes[self.module_name][_key][final_key] = {
                            "name": _name,
                            "type": "var",
                            "loc": block["loc"],
                            "edge": [],
                            "blck": [],
                            "start": block["start"],
                            "end": block["end"],
                            "native": False
                        }
                        return [(self.module_name, (p, final_key))]
                    else:
                        pass #TODO logging.error(f"node type error {node['type']}")
                        return [(self.module_name, (self.scope_id, _key))]
                else:
                    pass #TODO logging.error("length of work list > 1")
                    return [(self.module_name, (self.scope_id, _key))]
        else:
            return [(self.module_name, (self.scope_id, _key))]

    else:
        p_list = list()
        r_list = list()
        node = work_list.pop()
        node_type = node["type"]

        if node_type == "Identifier":
            _key = (self.scope_id[1], (node["name"], (node["start"], node["end"])))
            self.scopes[self.module_name][self.scope_id][_key] = {
                "name": node["name"],
                "type": "var",
                "edge": [],
                "blck": [],
                "loc": node["loc"],
                "start": block["start"],
                "end": block["end"],
                "native": False,
            }
            p_list.append((self.module_name, (self.scope_id, _key)))
        elif node_type == "ThisExpression":
            if "this" not in self.scopes[self.module_name][self.scope_id]:
                self.scopes[self.module_name][self.scope_id]["this"] = dict()
            p_list.append((self.module_name, (self.scope_id, ("this", ()))))
        else:
            pass #TODO logging.error(node_type)

        while work_list:
            node = work_list.pop()
            node_type = node["type"]
            node_name = self.source_code[self.module_name][node["start"]:node["end"]]
            if node_type in ["Literal", 'UpdateExpression', 'BinaryExpression']:
                continue
            elif node_type == "MemberExpression":
                continue
            elif node_type == "Identifier":
                new_p_list = list()
                analysised_p_list = list()
                while p_list:
                    p = p_list.pop()
                    if p in analysised_p_list:
                        continue
                    analysised_p_list.append(p)
                    if node_name == "prototype":
                        if p[1][1] not in self.scopes[p[0]]:
                            self.scopes[p[0]][p[1][1]] = dict()
                        if "prop" not in self.scopes[p[0]][p[1][1]]:
                            self.scopes[p[0]][p[1][1]]["prop"] = dict()
                        prop_key = (p[0],(p[1][1], ("prop",())))
                        new_p_list.append(prop_key)
                        continue
                    if p[0] in ["undefined", "primordials", "binding"]:
                        continue

                    if p[1][1][0] in ["this", "prop"]:
                        _key = (p[1][0][1], (node["name"], (node["start"], node["end"])))
                        self.scopes[p[0]][p[1][0]][p[1][1][0]][_key] = {
                            "name": node["name"],
                            "type": "var",
                            "edge": [],
                            "blck": [],
                            "loc": node["loc"],
                            "start": block["start"],
                            "end": block["end"],
                            "native": False,
                        }
                        new_p_list.append((p[0], (p[1][0], (p[1][1][0], _key))))
                    else:
                        if p[1][1] not in self.scopes[p[0]]:
                            self.scopes[p[0]][p[1][1]] = dict()
                            _key = (p[1][1][1], (node["name"], (node["start"], node["end"])))
                            self.scopes[p[0]][p[1][1]][_key] = {
                                "name": node["name"],
                                "type": "var",
                                "edge": [],
                                "blck": [],
                                "loc": node["loc"],
                                "start": block["start"],
                                "end": block["end"],
                                "native": False,
                            }
                            new_p_list.append((self.module_name, (p[1][1], _key)))
                p_list.extend(new_p_list)
            else:
                pass #TODO logging.error(f"node type error {node_type}")
                # pass
        r_list.extend(p_list)
        return r_list



def analysis_ArrayExpression(self, block):
    r = list()
    work_list = list()
    work_list.append(block)
    while work_list:
        _b = work_list.pop()
        elements = _b["elements"]
        for element in elements:
            if element["type"] == "ArrayExpression":
                work_list.append(element)
            element_type = element["type"]
            if element_type in ["BinaryExpression", "Literal", "LogicalExpression", "UnaryExpression", "TaggedTemplateExpression", "UpdateExpression", "AssignmentExpression"]:
                self.analysis_Expression(element, element["type"])
            elif element_type in ["FunctionExpression", "ArrowFunctionExpression"]:
                r.extend(self.analysis_Expression(element, element["type"]))
            elif element_type in ["NewExpression", "ObjectExpression"]:
                r.extend(self.analysis_Expression(element, element["type"]))
            elif element_type in ["ClassExpression"]:
                r.extend(self.analysis_Expression(element, element["type"]))
            elif element_type in ["CallExpression"]:
                r.extend(self.analysis_Expression(element, element["type"]))
            elif element_type in ["MemberExpression"]:
                r.extend(self.analysis_MemberExpression(element, element["type"]))
            elif element_type in ["Identifier"]:
                r.extend(self.analysis_Expression(element, element["type"]))
            elif element_type in ["TemplateLiteral", "AwaitExpression", "SpreadElement"]:
                r.extend(self.analysis_Expression(element, element["type"]))
            elif element_type in ["ArrayExpression", "ConditionalExpression", "ChainExpression"]:
                r.extend(self.analysis_Expression(element, element["type"]))
            elif element_type in ["ThisExpression"]:
                pass
            elif element in ["YieldExpression"]:
                pass
            else:
                pass #TODO logging.error(f"tmp blck type error {tmp_blck_type}")
    return r

def analysis_ArrowFunctionExpression(self, block, f=0):
    if f == 0:
        _sid = self.scope_id
        _name = "anonymous"
        _key = (self.scope_id[1], (_name, (block["start"], block["end"])))
        self.scopes[self.module_name][_sid][_key] = {
            "name": _name,
            "type": "func",
            "loc": block["loc"],
            "start": block["start"],
            "end": block["end"],
            "edge": [(self.module_name, (_sid, _key))],
            "blck": [],
            "prop": [],
            "self": False,
        }
        if (self.scope_id[1], (_name, block)) not in self.scope_list:
            self.scope_list.append((self.scope_id[1], (_name, block)))
        if _key not in self.scopes[self.module_name]:
            self.scopes[self.module_name][_key] = dict()

        self.record_function_table(name=_name, id=(_sid, _key))
        self.func_id[(block["start"], block["end"])] = f"{_name}@{self.module_name}, {block['loc']['start']['line']}"

        return [(self.module_name, (_sid, _key))]
    else:
        _sid = self.scope_id
        self.analysis_params(block["params"])
        body = block["body"]
        if body["type"] == "BlockStatement":
            for _block in body["body"]:
                if "Declaration" in _block["type"]:
                    self.analysis_Declaration(_block, _block["type"])
                elif "Statement" in _block["type"]:
                    self.analysis_Statement(_block, _block["type"])
                else:
                    pass #TODO logging.error("[-] analysis arrow function declaration error! ", _block["type"])
        elif "Expression" in body["type"]:
            self.analysis_Expression(body, body["type"])
        elif body["type"] == "Literal":
            pass
        elif body["type"] == "Identifier":
            pass
        else:
            pass #TODO logging.error(f"[-] Arrow Function Expressio body type error! {body['type']}")

def analysis_BinaryExpression(self, block):
    r = list()
    left = block["left"]
    if "Expression" in left["type"]:
        self.analysis_Expression(left, left["type"])
    elif left["type"] == "TemplateLiteral":
        self.analysis_TemplateLiteral(left)
    elif left["type"] == "Literal" or left["type"] == "Identifier":
        pass

    right = block["right"]
    if "Expression" in left["type"]:
        self.analysis_Expression(right, right["type"])
    elif right["type"] == "TemplateLiteral":
        self.analysis_TemplateLiteral(right)
    elif right["type"] == "Literal" or right["type"] == "Identifier":
        pass
    return r

def analysis_CallExpression(self, block=None, f=0, call_p=None):
    if f == 0:
        block_source_code = self.get_source_code(self.module_name, block)
        _sid = self.scope_id
        _callee = block["callee"]
        arguments = block["arguments"]

        _key = (self.scope_id[1], (self.source_code[self.module_name]
                [_callee["start"]:_callee["end"]], (block["start"], block["end"])))

        if _key not in self.scopes[self.module_name][_sid]:

            self.scopes[self.module_name][_sid][_key] = {
                "type": "call",
                "name": _key[1][0],
                "edge": [],
                "blck": [block, ],
                "loc": block["loc"],
                "start": block["start"],
                "end": block["end"],
                "arguments": block["arguments"],
                "callee": block["callee"],
                "arguments_key": {
                    "id": dict(),
                    "name": dict()
                },
                "native": False
            }

            if block["callee"]["type"] == "Identifier" and block["callee"]["name"] == "require":
                if block["arguments"][0]["type"] == "Literal":
                    module_name_value = block["arguments"][0]["value"]
                    if module_name_value not in self.builtins:
                        # if "." in module_name_value or "/" in module_name_value:
                        absModule_path = self.calc_require_path(module_name_value)
                        if absModule_path not in self.module_list and absModule_path not in self.scopes:
                            self.module_list.append(absModule_path)
                else:
                    pass #TODO logging.error("module name value error")

            arguments = block["arguments"]
            for argument_num in range(0, len(arguments)):
                argument = arguments[argument_num]
                argument_type = argument["type"]
                argument_node_list = list()
                argument_node_list.append(argument)
                while argument_node_list:
                    argument_node = argument_node_list.pop()
                    argument_node_type = argument_node["type"]
                    if argument_node_type in ["FunctionExpression",
                                        "CallExpression",
                                        "NewExpression",
                                        "MemberExpression",
                                        "Identifier",
                                        "ArrowFunctionExpression",
                                        "ObjectExpression",
                                        "ArrayExpression",
                                        "AwaitExpression",
                                        "SpreadElement",
                                        "UpdateExpression",
                                        "ChainExpression",
                                        "ArrayExpression"
                                        ]:
                        _name = "anonymous"
                        if argument_node["type"] == "SpreadElement":
                            argument_node = argument_node["argument"]

                        if argument_node["type"] == "FunctionExpression":
                            if argument_node["id"]:
                                _name = argument_node["id"]["name"]
                        elif argument_node["type"] == "CallExpression" or argument_node["type"] == "NewExpression":
                            _name = self.source_code[self.module_name][argument_node["callee"]["start"]:argument_node["callee"]["end"]]
                        elif argument_node["type"] == "MemberExpression":
                            _name = self.source_code[self.module_name][argument_node["start"]:argument_node["end"]]
                        elif argument_node["type"] == "Identifier":
                            _name = argument_node["name"]
                        else:
                            pass
                        __key = (self.scope_id[1], (_name, (argument_node["start"], argument_node["end"])))
                        if __key not in self.scopes[self.module_name][_sid]:
                            self.scopes[self.module_name][_sid][__key] = {
                                "name": _name,
                                "type": "argument",
                                "anum": argument_num,
                                "blck": [argument_node, ],
                                "edge": [],
                                "loc": argument_node["loc"],
                                "start": argument_node["start"],
                                "end": argument_node["end"],
                                "points": []
                            }
                            # if argument_num not in self.scopes[self.module_name][_sid][_key]["arguments_key"]["id"]:
                            self.scopes[self.module_name][_sid][_key]["arguments_key"]["id"][argument_num] = list()
                            self.scopes[self.module_name][_sid][_key]["arguments_key"]["id"][argument_num].append((self.module_name, (_sid, __key)))

                            # if _name not in self.scopes[self.module_name][_sid][_key]["arguments_key"]["name"]:
                            self.scopes[self.module_name][_sid][_key]["arguments_key"]["name"][_name] = list()
                            self.scopes[self.module_name][_sid][_key]["arguments_key"]["name"][_name].append((self.module_name, (_sid, __key)))
                    elif argument_node["type"] in ["ConditionalExpression"]:
                        consequent = argument_node["consequent"]
                        alternate = argument_node["alternate"]
                        argument_node_list.append(consequent)
                        argument_node_list.append(alternate)
                    elif argument_node["type"] in [
                        "BinaryExpression",
                        "TemplateLiteral",
                        "LogicalExpression",
                        "ThisExpression",
                        "UnaryExpression"]:
                        self.analysis_Expression(argument_node, argument_node["type"])
                    elif argument_node["type"] in ["Literal", ]:
                        pass
                    else:
                        pass #TODO logging.error(f"aaaaaaaaaaaaaaaa {argument_node['type']}")

        if _callee["type"] in ["CallExpression", "MemberExpression", "NewExpression"]:
            self.analysis_Expression(_callee, _callee["type"], f=0)
        elif _callee["type"] in ["FunctionExpression", "ArrowFunctionExpression"]:
            self.scopes[self.module_name][_sid][_key]["edge"].extend(self.analysis_Expression(_callee, _callee["type"], f=0))

        return [(self.module_name, (_sid, _key))]
    else:
        block_source_code = self.get_source_code(self.module_name, block)
        p_list = list()
        r_list = list()
        callee = block["callee"]
        if callee["type"] == "Identifier":
            callee_name = callee["name"]
            if callee_name == "internalBinding":
                arguments = block["arguments"]
                argument = arguments[0]
                if argument["type"] == "Literal":
                    r_list.append(("internalBinding", (argument["value"], )))
                else:
                    pass #TODO logging.error(f"argument type error, {argument['type']}")
            if callee_name == "require":
                if block["arguments"][0]["type"] == "Literal":
                    module_name_value = block["arguments"][0]["value"]
                    if self.aim == "built-in":
                        if module_name_value in self.builtins:
                            r_list.append((module_name_value, ))
                        else:
                            absModule_path = self.calc_require_path(module_name_value)
                            if absModule_path in self.module_exports:
                                return self.module_exports[absModule_path]
                            else:
                                pass
                else:
                    pass #TODO logging.error("module name value error")

            if callee_name in self.function_table:
                for func_id in self.function_table[callee_name]:
                    func_key = self.function_table[callee_name][func_id]["key"]
                    if func_key[0] == self.module_name:
                        r_list.append(self.function_table[callee_name][func_id]["key"])
                    else:
                        iden_s = self.analysis_Identifier(callee)
                        p_list.extend(iden_s)
            else:
                iden_s = self.analysis_Identifier(callee)
                p_list.extend(iden_s)
        elif callee["type"] == "MemberExpression":
            memberexpression_pointer_list = self.analysis_memberexpression_pointer(callee, call_p=call_p)
            p_list.extend(memberexpression_pointer_list)
        elif callee["type"] == "CallExpression":
            callee_edge_list = self.analysis_Expression(callee, callee["type"], f=1, p=call_p)
            return_list = list()
            for callee_edge in callee_edge_list:
                callee_edge_node = self.scopes[callee_edge[0]][callee_edge[1][0]][callee_edge[1][1]]
                callee_edge_node_type = callee_edge_node["type"]
                if callee_edge_node_type == "func":
                    callee_edge_node_name = callee_edge_node["name"]
                    if callee_edge_node_name in self.function_table:
                        if callee_edge[1][1] in self.function_table[callee_edge_node_name]:
                            return_p_list = self.function_table[callee_edge_node_name][callee_edge[1][1]]["return"]
                            if return_p_list:
                                p_list.extend(return_p_list)
                            else:
                                pass #TODO logging.error("")
                        else:
                            pass #TODO logging.error(f"callee_edge_node_range not in function table {callee_edge}")
                    else:
                        pass #TODO logging.error(f"callee egde not in function table")

                else:
                    pass #TODO logging.error(f"callee edge node type error {callee_edge_node_type}")
            p_list.extend(return_list)
        else:
            pass #TODO logging.error(f"callee type error {callee['type']}")

        alias = set()
        analysised_p_list = set()

        while p_list:
            p = p_list.pop()
            if p in analysised_p_list:
                continue
            alias.add(p)
            analysised_p_list.add(p)

            if p[0] in ["undefined", "primordials", "binding", ]:
                r_list.append(p)
                continue
            if self.aim == "built-in":
                if p[0] in self.builtins:
                    r_list.append(p)
                    continue

            if p[1][1][0] == "this" or p[1][1][0] == "prop":
                p_node = self.scopes[p[0]][p[1][0]][p[1][1][0]][p[1][1][1]]
                p_name = p[1][1][1][1][0]
            else:
                p_node = self.scopes[p[0]][p[1][0]][p[1][1]]
                p_name = p[1][1][1][0]
                if call_p != None:
                    if p[1][1][1][1][0] ==  call_p[1][1][1][1][0]:
                        continue

            p_type = p_node["type"]
            p_blck_list = p_node["blck"]
            p_edge_list = p_node["edge"]

            if p_type == "func":
                r_list.append(p)
                alias.add(p)
            elif p_type == "var":
                if p_edge_list:
                    for e in p_edge_list:
                        p_list.append(e)
                        alias.add(e)
                else:
                    if p_blck_list:
                        for __blck in p_blck_list:
                            if __blck["type"] == "MemberExpression":
                                self.push_module_scopeid_stack()
                                self.module_name = p[0]
                                self.scope_id = p[1][0]
                                memberexpression_pointer_list = self.analysis_memberexpression_pointer(__blck)
                                self.pop_module_scopeid_stack()
                                p_list.extend(memberexpression_pointer_list)
                            else:
                                pass #TODO logging.error(f"")
                        if p[1][1] in self.scopes[p[0]]:
                            r_list.append(p)
            elif p_type == "call":
                if p_name == "require":
                    module_name_value = ""
                    if p_node["arguments"][0]["type"] == "Identifier":
                        if "value" in p_node["arguments"][0]:
                            module_name_value = p_node["arguments"][0]["value"]
                    elif p_node["arguments"][0]["type"] == "Literal":
                        module_name_value = p_node["arguments"][0]["value"]
                    if module_name_value:
                        absModule_path = self.calc_require_path(module_name_value)
                        if absModule_path in self.module_exports:
                            module_exports_list = self.module_exports[absModule_path]
                            self.push_module_scopeid_stack()
                            self.module_name = absModule_path
                            require_pointer_list = self.calc_require_pointer(module_exports_list, p_node)
                            p_list.extend(require_pointer_list)
                            self.pop_module_scopeid_stack()
                else:
                    if not p_edge_list and p_blck_list:
                        for _blck in p_blck_list:
                            p_edge_list.extend(self.analysis_Expression(_blck, _blck["type"], 1, p=p))
                    if p_edge_list:
                        for p_edge in p_edge_list:
                            if p_edge[0] in ["undefined", "primordials", "binding"]:
                                continue
                            if p_edge[0] in self.builtins:
                                r_list.append(p_edge)
                                continue
                            p_edge_node = self.scopes[p_edge[0]][p_edge[1][0]][p_edge[1][1]]
                            p_edge_node_type = p_edge_node["type"]
                            p_edge_node_name = p_edge_node["name"]
                            if p_edge_node_type == "func":
                                return_p_list = list()
                                if p_edge_node_name in self.function_table:
                                    return_p_list = self.function_table[p_edge_node_name][p_edge[1][1]]["return"]
                                if return_p_list:
                                    p_list.extend(return_p_list)
                                else:
                                    pass #TODO logging.error("")
                            else:
                                pass #TODO logging.error("p edge type error")
            elif p_type == "mem":
                if p_blck_list and not p_edge_list:
                    for p_blck in p_blck_list:
                        p_edge_list.extend(self.analysis_memberexpression_pointer(p_blck, call_p=p))
                else:
                    p_list.extend(p_edge_list)
            elif p_type == "rtrn":
                if not p_edge_list and p_blck_list:
                    for _blck in p_blck_list:
                        p_list.extend(self.analysis_Expression(_blck, _blck["type"], 1))
                else:
                    p_list.extend(p_edge_list)
            elif p_type == "param":
                if call_p:
                    if call_p not in self.scopes[p[0]][p[1][0]][p[1][1]]["call"]:
                        self.scopes[p[0]][p[1][0]][p[1][1]]["call"].append(call_p)
                else:
                    pass #TODO logging.error("call p is None")
            elif p_type == "obj_mem":
                p_list.extend(self.analysis_objmem(p_node))
            else:
                pass #TODO logging.error(f"call expression error {p_type}")
        return r_list



def analysis_ChainExpression(self, block):
    if block["expression"]["type"] == "MemberExpression" or \
        block["expression"]["type"] == "CallExpression":
        p_list = self.analysis_Expression(block["expression"], block["expression"]["type"])
        return p_list
    else:
        pass #TODO logging.error(block["expression"]["type"])

def analysis_ClassExpression(self, block, f=0):
    if f == 0:
        _sid = self.scope_id
        _name = "anonymous"
        if "id" in block:
            if block["id"] != None:
                if "name" in block["id"]:
                    _name = block["id"]["name"]
        _key = (self.scope_id[1], (_name, (block["start"], block["end"])))
        self.scopes[self.module_name][_sid][_key] = {
            "name": _name,
            "type": "class",
            "loc": block["loc"],
            "start": block["start"],
            "end": block["end"],
            "edge": [],
            "blck": [],
        }

        if _key not in self.scopes[self.module_name]:
            self.scopes[self.module_name][_key] = dict()
        if (self.scope_id[1], (_name, block)) not in self.scope_list:
            self.scope_list.append((self.scope_id[1], (_name, block)))
        self.func_id[(block["start"], block["end"])] = f"{_name}@{self.module_name}, {block['loc']['start']['line']}"

        return [(self.module_name, (_sid, _key))]
    else:
        _sid = self.scope_id
        body = block["body"]
        for _block in body["body"]:
            if "Declaration" in _block["type"]:
                self.analysis_Declaration(_block, _block["type"])
            elif "MethodDefinition" == _block["type"]:
                _value = _block["value"]
                _key = _block["key"]
                if _key["type"] in ["Identifier", "PrivateIdentifier"]:
                    _key = _block["key"]["name"]
                    _keyP = (self.scope_id[1], (_block["key"]["name"],
                             (_block["value"]["start"], _block["value"]["end"])))
                    self.scopes[self.module_name][_sid][_keyP] = {
                        "name": _key,
                        "type": "func",
                        "edge": [],
                        "blck":[],
                        "loc": _block["loc"],
                        "start": _block["start"],
                        "end": _block["end"],
                        "prop": [],
                        "self": False
                    }
                    if (self.scope_id[1], (_key, _value)) not in self.scope_list:
                        self.scope_list.append((self.scope_id[1], (_key, _value)))
                    self.func_id[(_value["start"], _value["end"])] = f"{_key}@{self.module_name}, {_block['loc']['start']['line']}"
                else:
                    pass #TODO logging.error("[-] analysis class expression key is not a identifier! ", _key['type'], self.source_code[self.module_name][_key["start"]:_key["end"]], self.module_name)
            else:
                pass #TODO logging.error("_block type error")

def analysis_ConditionalExpression(self, block, f=0):
    test = block["test"]
    consequent = block["consequent"]
    alternate = block["alternate"]
    r = list()

    test_expression = self.analysis_Expression(test, test["type"])
    if test_expression:
        r.extend(test_expression)
    consequent_expression = self.analysis_Expression(consequent, consequent["type"])
    if consequent_expression:
        r.extend(consequent_expression)
    alternate_expression = self.analysis_Expression(alternate, alternate["type"])
    if alternate_expression:
        r.extend(alternate_expression)
    return r

def analysis_FunctionExpression(self, block, f=0):
    if f == 0:
        _sid = self.scope_id
        _name = block["id"]["name"] if block["id"] else "anonymous"
        _key = (self.scope_id[1], (_name, (block["start"], block["end"])))
        self.scopes[self.module_name][_sid][_key] = {
            "name": _name,
            "type": "func",
            "loc": block["loc"],
            "edge": [(self.module_name, (_sid, _key))],
            "blck": [],
            "start": block["start"],
            "end": block["end"],
            "self": False,
        }
        if (self.scope_id[1], (_name, block)) not in self.scope_list:
            self.scope_list.append((self.scope_id[1], (_name, block)))
        self.record_function_table(name=_name, id=(_sid, _key))
        self.func_id[(block["start"], block["end"])] = f"{_name}@{self.module_name}, {block['loc']['start']['line']}"

        return [(self.module_name, (_sid, _key))]
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
                pass #TODO logging.error("[-] analysis function declaration error! ", _block["type"])

def analysis_LogicalExpression(self, block):
    left_expression = block["left"]
    right_expression = block["right"]

    while left_expression["type"] == "LogicalExpression":
        right_expression = left_expression["right"]
        left_expression = left_expression["left"]
        _right_expression = right_expression
        self.analysis_Expression(right_expression, right_expression["type"])
        right_expression = _right_expression
    self.analysis_Expression(left_expression, left_expression["type"])

def analysis_MemberExpression(self, block, f=0):
    if f == 0:
        _key = (self.scope_id[1], (self.source_code[self.module_name][block["start"]:block["end"]], (block["start"], block["end"])))
        if _key not in self.scopes[self.module_name][self.scope_id]:
            self.scopes[self.module_name][self.scope_id][_key] = {
                "name": self.source_code[self.module_name][block["start"]:block["end"]],
                "type": "mem",
                "blck": [block, ],
                "edge": [],
                "loc": block["loc"],
                "start": block["start"],
                "end": block["end"],
                "native":False
            }

        _object = block["object"]
        if _object["type"] in ["CallExpression", "MemberExpression", "NewExpression"]:
            self.analysis_Expression(_object, _object["type"], f=0)

        return [(self.module_name, (self.scope_id, _key))]
    else:
        return self.analysis_memberexpression_pointer(block)

def analysis_NewExpression(self, block, f=0, call_p=None):
    sid = self.scope_id
    if f == 0:
        source_code = self.get_source_code(self.module_name, block)
        callee = block["callee"]
        _sid = self.scope_id
        _key = (self.scope_id[1], (self.source_code[self.module_name]
                [callee["start"]:callee["end"]], (callee["start"], callee["end"])))
        if _key not in self.scopes[self.module_name][_sid]:
            self.scopes[self.module_name][_sid][_key] = {
                "name": self.source_code[self.module_name][callee["start"]:callee["end"]],
                "type": "new",
                "edge": [],
                "blck": [block, ],
                "loc": callee["loc"],
                "start": block["start"],
                "end": block["end"],
                "arguments": block["arguments"],
                "arguments_key": {
                    "id": dict(),
                    "name": dict()
                },
            }

            if block["callee"]["type"] == "Identifier" and block["callee"]["name"] == "require":
                if block["arguments"][0]["type"] == "Literal":
                    module_name_value = block["arguments"][0]["value"]
                    if module_name_value not in self.builtins:
                        # if "." in module_name_value or "/" in module_name_value:
                        absModule_path = self.calc_require_path(module_name_value)
                        if absModule_path not in self.module_list and absModule_path not in self.scopes:
                            self.module_list.append(absModule_path)
                else:
                    pass #TODO logging.error("module name value error")

            arguments = block["arguments"]
            for argument_num in range(0, len(arguments)):
                argument = arguments[argument_num]
                argument_type = argument["type"]
                argument_node_list = list()
                argument_node_list.append(argument)
                while argument_node_list:
                    argument_node = argument_node_list.pop()
                    argument_node_type = argument_node["type"]
                    if argument_node_type in ["FunctionExpression",
                                        "CallExpression",
                                        "NewExpression",
                                        "MemberExpression",
                                        "Identifier",
                                        "ArrowFunctionExpression",
                                        "ObjectExpression",
                                        "ArrayExpression",
                                        "AwaitExpression",
                                        "SpreadElement",
                                        "UpdateExpression",
                                        "ChainExpression",
                                        "ArrayExpression"
                                        ]:
                        _name = "anonymous"
                        if argument_node["type"] == "SpreadElement":
                            argument_node = argument_node["argument"]
                        if argument_node["type"] in ["FunctionExpression", "ArrowFunctionExpression"]:
                            if argument_node["id"]:
                                _name = argument_node["id"]["name"]
                        elif argument_node["type"] == "CallExpression" or argument_node["type"] == "NewExpression":
                            _name = self.source_code[self.module_name][argument_node["callee"]["start"]:argument_node["callee"]["end"]]
                        elif argument_node["type"] == "MemberExpression":
                            _name = self.source_code[self.module_name][argument_node["start"]:argument_node["end"]]
                        elif argument_node["type"] == "Identifier":
                            _name = argument_node["name"]
                        else:
                            pass
                        __key = (self.scope_id[1], (_name, (argument_node["start"], argument_node["end"])))
                        if __key not in self.scopes[self.module_name][_sid]:
                            self.scopes[self.module_name][_sid][__key] = {
                                "name": _name,
                                "type": "argument",
                                "anum": argument_num,
                                "blck": [argument_node, ],
                                "edge": [],
                                "loc": argument_node["loc"],
                                "start": argument_node["start"],
                                "end": argument_node["end"],
                                "points": []
                            }

                            if argument_node["type"] in ["FunctionExpression", "ArrowFunctionExpression"]:
                                if (self.scope_id[1], (_name, argument_node)) not in self.scope_list:
                                    self.scope_list.append((self.scope_id[1], (_name, argument_node)))
                                if __key not in self.scopes[self.module_name]:
                                    self.scopes[self.module_name][__key] = dict()

                                self.record_function_table(name=_name, id=(_sid, __key))
                                self.func_id[(block["start"], block["end"])] = f"{_name}@{self.module_name}, {argument_node['loc']['start']['line']}"

                            # if argument_num not in self.scopes[self.module_name][_sid][_key]["arguments_key"]["id"]:
                            self.scopes[self.module_name][_sid][_key]["arguments_key"]["id"][argument_num] = list()
                            self.scopes[self.module_name][_sid][_key]["arguments_key"]["id"][argument_num].append((self.module_name, (_sid, __key)))

                            # if _name not in self.scopes[self.module_name][_sid][_key]["arguments_key"]["name"]:
                            self.scopes[self.module_name][_sid][_key]["arguments_key"]["name"][_name] = list()
                            self.scopes[self.module_name][_sid][_key]["arguments_key"]["name"][_name].append((self.module_name, (_sid, __key)))
                    elif argument_node["type"] in ["ConditionalExpression"]:
                        consequent = argument_node["consequent"]
                        alternate = argument_node["alternate"]
                        argument_node_list.append(consequent)
                        argument_node_list.append(alternate)
                    elif argument_node["type"] in [
                        "BinaryExpression",
                        "TemplateLiteral",
                        "LogicalExpression",
                        "ThisExpression",
                        "UnaryExpression"]:
                        self.analysis_Expression(argument_node, argument_node["type"])
                    elif argument_node["type"] in ["Literal", ]:
                        pass
                    else:
                        pass #TODO logging.error(f"aaaaaaaaaaaaaaaa {argument_node['type']}")


        if callee["type"] in ["CallExpression", "MemberExpression", "NewExpression"]:
            self.analysis_Expression(callee, callee["type"], f=0)

        return [(self.module_name, (_sid, _key))]
    else:
        p_list = list()
        r_list = list()

        block_source_code = self.get_source_code(self.module_name, block)
        callee = block["callee"]
        if callee["type"] == "MemberExpression":
            self.push_module_scopeid_stack()
            memberexpression_pointer_list = self.analysis_memberexpression_pointer(callee)
            p_list.extend(memberexpression_pointer_list)
            self.pop_module_scopeid_stack()
        elif callee["type"] == "Identifier":
            self.push_module_scopeid_stack()
            Identifier_pointer_list = self.analysis_Identifier(callee)
            p_list.extend(Identifier_pointer_list)
            self.pop_module_scopeid_stack()
        else:
            pass #TODO logging.error(f"callee type error {callee['type']}")
        while p_list:
            p = p_list.pop()
            if p [0] in ["undefined", "primordials", "binding"]:
                continue
            if p[0] in self.builtins:
                r_list.append(p)
                continue
            if p[1][1][0] == "this" or p[1][1][0] == "prop":
                p_node = self.scopes[p[0]][p[1][0]][p[1][1][0]][p[1][1][1]]
                p_name = p[1][1][1][1][0]
            else:
                p_node = self.scopes[p[0]][p[1][0]][p[1][1]]
                p_name = p[1][1][1][0]
            p_type = p_node["type"]
            p_edge_list = p_node["edge"]
            p_blck_list = p_node["blck"]
            if p_type == "var":
                if p_edge_list:
                    p_list.extend(p_edge_list)
                else:
                    for __blck in p_blck_list:
                        if __blck["type"] == "MemberExpression":
                            self.push_module_scopeid_stack()
                            self.module_name = p[0]
                            self.scope_id = p[1][0]
                            memberexpression_pointer_list = self.analysis_memberexpression_pointer(__blck)
                            self.pop_module_scopeid_stack()
                            p_list.extend(memberexpression_pointer_list)
                        else:
                            pass #TODO logging.error(f"")
                    if p[1][1] in self.scopes[p[0]]:
                        r_list.append(p)
            elif p_type in ["func", "class"]:
                r_list.append(p)
            elif p_type == "call":
                if p_name == "require":
                    if p_node["arguments"][0]["type"] != "Literal":
                        continue
                    module_name_value = p_node["arguments"][0]["value"]
                    self.push_module_scopeid_stack()
                    self.module_name = p[0]
                    absModule_path = self.calc_require_path(module_name_value)
                    self.pop_module_scopeid_stack()
                    if absModule_path in self.module_exports:
                        module_exports_list = self.module_exports[absModule_path]
                        self.push_module_scopeid_stack()
                        self.module_name = absModule_path
                        require_pointer_list = self.calc_require_pointer(module_exports_list, p_node)
                        p_list.extend(require_pointer_list)
                        self.pop_module_scopeid_stack()
                else:
                    if not p_edge_list and p_blck_list:
                        for _blck in p_blck_list:
                            p_edge_list.extend(self.analysis_Expression(_blck, _blck["type"], 1, p=p))
                    if p_edge_list:
                        for p_edge in p_edge_list:
                            p_edge_node = self.scopes[p_edge[0]][p_edge[1][0]][p_edge[1][1]]
                            p_edge_node_type = p_edge_node["type"]
                            p_edge_node_name = p_edge_node["name"]
                            if p_edge_node_type == "func":
                                return_p_list = self.function_table[p_edge_node_name][p_edge[1][1]]["return"]
                                if return_p_list:
                                    p_list.extend(return_p_list)
                                else:
                                    pass #TODO logging.error("")
                            else:
                                pass #TODO logging.error("p edge type error")
            elif p_type == "rtrn":
                if not p_edge_list and p_blck_list:
                    for _blck in p_blck_list:
                        p_list.extend(self.analysis_Expression(_blck, _blck["type"], 1))
                else:
                    p_list.extend(p_edge_list)
            elif p_type == "param":
                if call_p:
                    if call_p not in self.scopes[p[0]][p[1][0]][p[1][1]]["call"]:
                        self.scopes[p[0]][p[1][0]][p[1][1]]["call"].append(call_p)
                else:
                    pass #TODO logging.error("call p is None")
            elif p_type == "obj_mem":
                p_list.extend(self.analysis_objmem(p_node))
            else:
                # p_list.extend(self.analysis_objmem(p_node))
                pass #TODO logging.error(f"p type error {p_type}")
        return r_list

def analysis_TaggedTemplateExpression(self, block):
    quasi = block["quasi"]
    if quasi["type"] == "TemplateLiteral":
        self.analysis_TemplateLiteral(quasi)
    else:
        pass #TODO logging.error("[-] Type of Tagged Template Expression is error! ")

def analysis_UnaryExpression(self, block):
    argument = block["argument"]
    self.analysis_Expression(argument, argument["type"])

def analysis_UpdateExpression(self, block):
    argument = block["argument"]
    return self.analysis_Expression(argument, argument["type"])

def analysis_AwaitExpression(self, block):
    argument = block["argument"]
    return self.analysis_Expression(argument, argument["type"])

def analysis_SpreadElement(self, block):
    argument = block["argument"]
    return self.analysis_Expression(argument, argument["type"])

def analysis_ObjectExpression(self, block, f=0):
    if f == 0:
        _sid = self.scope_id
        _name = "anonymous"
        _key = (self.scope_id[1], (_name, (block["start"], block["end"])))
        self.scopes[self.module_name][_sid][_key] = {
            "name": _name,
            "type": "obj",
            "loc": block["loc"],
            "edge": [],
            "blck": [],
            "start": block["start"],
            "end": block["end"],
            "native": False
        }
        if (self.scope_id[1], (_name, block)) not in self.scope_list:
            self.scope_list.append((self.scope_id[1], (_name, block)))
        self.func_id[(block["start"], block["end"])] = f"{_name}@{self.module_name}, {block['loc']['start']['line']}"

        self.scopes[self.module_name][_sid][_key]["edge"].append((self.module_name, (_sid, _key)))
        return [(self.module_name, (_sid, _key))]
    else:
        props = self.scopes[self.module_name][self.scope_id]
        work_list = list()
        r_list = list()
        work_list.append(block)
        properties = work_list.pop()["properties"]
        for property in properties:
            if "value" in property:
                if property["key"]["type"] == "Identifier":
                    _name = property["key"]["name"]
                    _key = (self.scope_id[1], (_name, (property["value"]["start"], property["value"]["end"])))
                    props[_key] = {
                        "type": "var",
                        "name": _name,
                        "blck": [],
                        "edge": [],
                        "loc": property["loc"],
                        "start": property["start"],
                        "end": property["end"],
                        "native": False
                    }
                    if property["value"]["type"]:
                        if property["value"]["type"] == "Identifier" or \
                                property["value"]["type"] == "NewExpression" or \
                                property["value"]["type"] == "ChainExpression" or \
                                property["value"]["type"] == "MemberExpression" or \
                                property["value"]["type"] == "ConditionalExpression" or \
                                property["value"]["type"] == "AwaitExpression" or \
                                property["value"]["type"] == "ArrowFunctionExpression" or \
                                property["value"]["type"] == "ChainExpression" or \
                                property["value"]["type"] == "FunctionExpression" or \
                                property["value"]["type"] == "CallExpression" or \
                                property["value"]["type"] == "ArrayExpression":
                            # props[_key]["blck"] = [self.analysis_Expression(property["value"],property["value"]["type"])
                            props[_key]["blck"] = [property["value"], ]
                        elif property["value"]["type"] == "ObjectExpression":
                            props[_key]["type"] = "obj"
                            props[_key]["prop"] = dict()
                            props[_key]["blck"] = [property["value"], ]
                            # self.update(props[_key]["edge"], self.analysis_Expression(property["value"], property["value"]["type"]))
                        elif property["value"]["type"] == "Literal" or \
                                property["value"]["type"] == "BinaryExpression" or \
                                property["value"]["type"] == "LogicalExpression" or \
                                property["value"]["type"] == "UnaryExpression" or \
                                property["value"]["type"] == "TaggedTemplateExpression":
                            self.analysis_Expression(
                                property["value"], property["value"]["type"])
                        elif property["value"]["type"] == "TemplateLiteral":
                            self.analysis_TemplateLiteral(property["value"])
                        else:
                            pass #TODO logging.error(f"property value type error~")
                    r_list.append((self.module_name, (self.scope_id, _key)))
                elif property["key"]["type"] == "Literal":
                    pass
                elif property["key"]["type"] == "MemberExpression":
                    pass
                else:
                    pass #TODO logging.error("property key type error~")
            elif property["type"] == "SpreadElement":
                pass
            else:
                pass #TODO logging.error(f"property type error~")
        return r_list

def analysis_Identifier(self, block):
    sid = self.scope_id
    block_start = block["start"]
    block_start_line = block["loc"]["start"]["line"]

    if block["name"] in ["undefined", "primordials", "binding"]:
        return [(block["name"], ()), ]

    found_list = list()
    for key in self.scopes[self.module_name][sid]:
        if key in ["this", "prop"]:
            nodes = self.scopes[self.module_name][sid][key]
            for _key in nodes:
                if block["name"] == _key[1][0]:
                    node = nodes[_key]
                    node_type = node["type"]
                    node_edge_list = node["edge"]
                    node_start_line = node["loc"]["start"]["line"]
                    if node_type in ["var", "obj", "obj_mem"]:
                        if block_start_line > node_start_line or _key in self.scopes[self.module_name]:
                            found_list.append((self.module_name, (sid, (key, _key))))
                        for node_edge in node_edge_list:
                            if node_edge[0] in ["undefined", "primordials", "binding", ]:
                                continue
                            if node_edge[0] in self.builtins:
                                continue
                            if node_edge[1][1][0] in ["this", "prop"]:
                                p_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1][0]][node_edge[1][1][1]]
                            else:
                                p_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1]]
                            if p_node["type"] in ["func", "class"]:
                                found_list.append((self.module_name, (sid, (key, _key))))
                    elif node_type in ["func", "class", "param", "index", "literal"]:
                        if block_start != _key[1][1][0]:
                            found_list.append((self.module_name, (sid, (key, _key))))
        else:
            nodes = self.scopes[self.module_name][sid]
            for _key in nodes:
                if block["name"] == _key[1][0]:
                    node = nodes[_key]
                    node_type = node["type"]
                    node_edge_list = node["edge"]
                    node_start_line = node["loc"]["start"]["line"]
                    if node_type in ["var", "obj", "obj_mem"]:
                        if block_start_line > node_start_line or _key in self.scopes[self.module_name]:
                            found_list.append((self.module_name, (sid, _key)))
                        for node_edge in node_edge_list:
                            if not node_edge[0]:
                                continue

                            if node_edge[0] in ["undefined", "primordials", "binding", ]:
                                continue

                            if node_edge[1][0] in ["undefined", "primordials", "binding", ]:
                                continue
                            if node_edge[0] in self.builtins:
                                continue
                            if node_edge[1][1][0] in ["this", "prop"]:
                                p_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1][0]][node_edge[1][1][1]]
                            else:
                                p_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1]]
                            if p_node["type"] in ["func", "class"]:
                                found_list.append((self.module_name, (sid, _key)))

                    elif node_type in ["func", "class", "param", "index", "literal"]:
                        if block_start != _key[1][1][0]:
                            found_list.append((self.module_name, (sid, _key)))
    # if len(found_list):
    #     return list(set(found_list))
    # found_list = []
    up_scope = sid[0]
    while True:
        for sid in self.scopes[self.module_name]:
            if sid[1] == up_scope:
                up_scope = sid[0]
                for key in self.scopes[self.module_name][sid]:
                    if key in ["this", "prop"]:
                        nodes = self.scopes[self.module_name][sid][key]
                        for _key in nodes:
                            if block["name"] == _key[1][0]:
                                node = nodes[_key]
                                node_type = node["type"]
                                node_edge_list = node["edge"]
                                node_start_line = node["loc"]["start"]["line"]
                                if node_type in ["var", "obj", "obj_mem"]:
                                    if block_start_line > node_start_line or _key in self.scopes[self.module_name]:
                                        found_list.append((self.module_name, (sid, (key, _key))))
                                    for node_edge in node_edge_list:
                                        if node_edge[0] in ["undefined", "primordials", "binding", ]:
                                            continue
                                        if node_edge[0] in self.builtins:
                                            continue
                                        if node_edge[1][1][0] in ["this", "prop"]:
                                            p_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1][0]][node_edge[1][1][1]]
                                        else:
                                            p_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1]]
                                        if p_node["type"] in ["func", "class"]:
                                            found_list.append((self.module_name, (sid, (key, _key))))
                                elif node_type in ["func", "class", "param", "index", "literal"]:
                                    if block_start != _key[1][1][0]:
                                        found_list.append((self.module_name, (sid, (key, _key))))
                    else:
                        nodes = self.scopes[self.module_name][sid]
                        for _key in nodes:
                            if block["name"] == _key[1][0]:
                                node = nodes[_key]
                                node_type = node["type"]
                                node_edge_list = node["edge"]
                                node_start_line = node["loc"]["start"]["line"]
                                if node_type in ["var", "obj", "obj_mem"]:
                                    if block_start_line > node_start_line or _key in self.scopes[self.module_name]:
                                        found_list.append((self.module_name, (sid, _key)))
                                    for node_edge in node_edge_list:
                                        if node_edge[0] in ["undefined", "primordials", "binding", ]:
                                            continue
                                        if node_edge[0] in self.builtins:
                                            continue
                                        if node_edge[1][1][0] in ["this", "prop"]:
                                            p_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1][0]][node_edge[1][1][1]]
                                        else:
                                            p_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1]]
                                        if p_node["type"] in ["func", "class"]:
                                            found_list.append((self.module_name, (sid, _key)))
                                elif node_type in ["func", "class", "param", "index", "literal"]:
                                    if block_start != _key[1][1][0]:
                                        found_list.append((self.module_name, (sid, _key)))
                if len(found_list):
                    return list(set(found_list))
                if sid[1][0] == "global":
                    return list(set(found_list))

def record_MemberExpression(self, block):
    pass

def analysis_memberexpression_pointer(self, block, call_p=None, f=1):
    block_source_code = self.get_source_code(self.module_name, block)
    _property = block["property"]
    _object = block["object"]
    work_list = list()
    work_list.append(_property)
    while _object["type"] == "MemberExpression":
        _property = _object["property"]
        _object = _object["object"]
        work_list.append(_property)
    work_list.append(_object)

    p_list = list()
    r_list = list()

    node = work_list.pop()
    node_type = node["type"]

    if node_type == "CallExpression":
        if node["callee"]["type"] == "Identifier" and node["callee"]["name"] == "require":
            if node["arguments"][0]["type"] == "Literal":
                module_name_value = node["arguments"][0]["value"]
                if self.aim == "built-in":
                    if module_name_value in self.builtins:
                        p_list.append((module_name_value, ))
                absModule_path = self.calc_require_path(module_name_value)
                if absModule_path in self.module_exports:
                    module_exports_list = self.module_exports[absModule_path]
                    self.push_module_scopeid_stack()
                    self.module_name = absModule_path
                    require_pointer_list = self.calc_require_pointer(module_exports_list, work_list[-1])
                    work_list.pop()
                    if not work_list:
                        r_list.extend(require_pointer_list)
                    else:
                        p_list.extend(require_pointer_list)
                    self.pop_module_scopeid_stack()
                else:
                    pass
            else:
                pass #TODO logging.error("module name value error")
        elif node["callee"]["type"] == "MemberExpression":
            self.push_module_scopeid_stack()
            p_list.extend(self.analysis_memberexpression_pointer(node["callee"], call_p=call_p))
            self.pop_module_scopeid_stack()
        else:
            self.push_module_scopeid_stack()
            p_edge_list = self.analysis_Expression(node, node["type"], p=call_p, f=1)
            self.pop_module_scopeid_stack()
            if p_edge_list:
                callee_edge_list = p_edge_list
                return_list = list()
                for callee_edge in callee_edge_list:
                    if self.aim == "built-in":
                        if callee_edge[0] in self.builtins:
                            new_p = list(callee_edge)
                            new_p.append(node["callee"]["name"])
                            r_list.append(tuple(new_p))
                            continue
                    callee_edge_node = self.scopes[callee_edge[0]][callee_edge[1][0]][callee_edge[1][1]]
                    callee_edge_node_type = callee_edge_node["type"]
                    if callee_edge_node_type in ["func", "class", "var"]:
                        callee_edge_node_name = callee_edge_node["name"]
                        if callee_edge_node_name in self.function_table:
                            if callee_edge[1][1] in self.function_table[callee_edge_node_name]:
                                return_p_list = self.function_table[callee_edge_node_name][callee_edge[1][1]]["return"]
                                if return_p_list:
                                    p_list.extend(return_p_list)
                                else:
                                    pass
                            else:
                                pass #TODO logging.error(f"callee_edge_node_range not in function table {callee_edge}")
                        else:
                            pass #TODO logging.error(f"callee egde not in function table")
                    elif callee_edge_node_type == "obj":
                        p_list.append(callee_edge)
                    else:
                        pass #TODO logging.error(f"callee edge node type error {callee_edge_node_type}")
                p_list.extend(return_list)


    elif node_type == "Identifier":
        p_list.extend(self.analysis_Identifier(node))
    elif node_type == "ThisExpression":
        this_p = self.scope_id
        while this_p[1][0] != "global":
            for this_p_key in self.scopes[self.module_name][this_p]:
                if this_p_key in ["this", "prop"]:
                    this_p_nodes = self.scopes[self.module_name][this_p][this_p_key]
                    for _key in this_p_nodes:
                        this_p_node = this_p_nodes[_key]
                        if "name" in work_list[-1]:
                            if _key[1][0] == work_list[-1]["name"]:
                                if this_p_node["loc"]["start"]["line"] >= work_list[-1]["loc"]["start"]["line"]:
                                    continue
                                p_list.append((self.module_name, (this_p, (this_p_key, _key))))
                        else:
                            pass #TODO logging.error(f"work list type error")
                if "name" in work_list[-1]:
                    if this_p_key[1][0] == work_list[-1]["name"]:
                        this_p_node = self.scopes[self.module_name][this_p][this_p_key]
                        if this_p_node["loc"]["start"]["line"] >= work_list[-1]["loc"]["start"]["line"]:
                            continue
                        p_list.append((self.module_name, (this_p, this_p_key)))
                else:
                    pass #TODO logging.error(f"work list type error")
            for _scope_id in self.scopes[self.module_name]:
                if _scope_id[1] == this_p[0]:
                    this_p = _scope_id
                    break
        if p_list:
            work_list.pop()
    else:
        pass #TODO logging.error(f"module name value error2 {node_type}")

    if len(work_list) > 1:
        pass
        while len(work_list) > 1:
            node = work_list.pop()
            new_p_list = list()
            analysised_p_set = set()
            while p_list:
                p = p_list.pop()
                if p in analysised_p_set:
                    continue
                analysised_p_set.add(p)
                if p[0] in ["undefined", "primordials", "binding", ]:
                    continue
                if self.aim == "built-in":
                    if p[0] in self.builtins:
                        if node["type"] == "Identifier":
                            new_p = list(p)
                            new_p.append(node["name"])
                            new_p_list.append(tuple(new_p))
                            continue
                        else:
                            pass #TODO logging.error(f"node type error {node['type']}")
                if p[1][1][0] in ["this", "prop"]:
                    p_node = self.scopes[p[0]][p[1][0]][p[1][1][0]][p[1][1][1]]
                else:
                    p_node = self.scopes[p[0]][p[1][0]][p[1][1]]
                    if call_p:
                        if p[1][1][1][0] ==  call_p[1][1][1][0]:
                            continue
                p_type = p_node["type"]
                p_edge_list = p_node["edge"]
                p_blck = p_node["blck"]
                if p_type == "var":
                    if not p_edge_list and p_blck:
                        for _blck in p_blck:
                            if _blck["type"] == "ThisExpression":
                                if node["type"] == "Identifier":
                                    new_p_list.extend(self.analysis_Identifier(node))
                                else:
                                    pass #TODO logging.error("this next node type error~")
                            else:
                                _blck_p_list = self.analysis_Expression(_blck, _blck["type"], f=f, p=p)
                                if _blck_p_list:
                                    p_edge_list.extend(_blck_p_list)
                    if p_edge_list:
                        p_list.extend(p_edge_list)
                elif p_type in ["func", "class"]:
                    if not p_edge_list and p_blck:
                        for _blck in p_blck:
                            p_edge_list.extend(self.analysis_Expression(_blck, _blck["type"], f=f, p=p))
                    if p_edge_list:
                        new_p_list.extend(self.find_node(p_edge_list, node))
                elif p_type in ["call", "new"]:
                    if not p_edge_list and p_blck:
                        for _blck in p_blck:
                            self.push_module_scopeid_stack()
                            self.module_name = p[0]
                            self.scope_id = p[1][0]
                            p_edge_list.extend(self.analysis_Expression(_blck, _blck["type"], f=f, p=p))
                            self.pop_module_scopeid_stack()
                    if p_edge_list:
                        callee_edge_list = p_edge_list
                        return_list = list()
                        for callee_edge in callee_edge_list:
                            if self.aim == "built-in":
                                if callee_edge[0] in self.builtins:
                                    new_p = list(callee_edge)
                                    new_p.append(node["name"])
                                    new_p_list.append(tuple(new_p))
                                    continue
                            callee_edge_node = self.scopes[callee_edge[0]][callee_edge[1][0]][callee_edge[1][1]]
                            callee_edge_node_type = callee_edge_node["type"]
                            if callee_edge_node_type in ["func", "class"]:
                                if callee_edge[1][1] in self.scopes[callee_edge[0]]:
                                    if "this" in self.scopes[callee_edge[0]][callee_edge[1][1]]:
                                        for _key in self.scopes[callee_edge[0]][callee_edge[1][1]]["this"]:
                                            if _key[1][0] == node["name"]:
                                                new_p_list.append((callee_edge[0], (callee_edge[1][1], ("this", _key))))
                                    if "prop" in self.scopes[callee_edge[0]][callee_edge[1][1]]:
                                        for _key in self.scopes[callee_edge[0]][callee_edge[1][1]]["prop"]:
                                            if _key[1][0] == node["name"]:
                                                new_p_list.append((callee_edge[0], (callee_edge[1][1], ("prop", _key))))
                                    if callee_edge_node_type == "class":
                                        for _key in self.scopes[callee_edge[0]][callee_edge[1][1]]:
                                            if _key[1][0] == node["name"]:
                                                new_p_list.append((callee_edge[0], (callee_edge[1][1], _key)))
                                callee_edge_node_name = callee_edge_node["name"]
                                if callee_edge_node_name in self.function_table:
                                    if callee_edge[1][1] in self.function_table[callee_edge_node_name]:
                                        return_p_list = self.function_table[callee_edge_node_name][callee_edge[1][1]]["return"]
                                        if return_p_list:
                                            p_list.extend(return_p_list)
                                        else:
                                            pass #TODO logging.error("")
                                    else:
                                        pass #TODO logging.error(f"callee_edge_node_range not in function table {callee_edge}")
                                else:
                                    pass #TODO logging.error(f"callee egde not in function table")
                            elif callee_edge_node_type == "obj":
                                p_list.append(callee_edge)
                            else:
                                pass #TODO logging.error(f"callee edge node type error {callee_edge_node_type}")
                        p_list.extend(return_list)
                elif p_type == "obj":
                    if p[1][1] in self.scopes[p[0]]:
                        for key in self.scopes[p[0]][p[1][1]]:
                            if "name" in node:
                                if key[1][0] == node["name"]:
                                    new_p_list.append((p[0], (p[1][1], key)))
                    else:
                        if p_edge_list:
                            for p_edge in p_edge_list:
                                if p_edge[1][1] in self.scopes[p_edge[0]]:
                                    for key in self.scopes[p_edge[0]][p_edge[1][1]]:
                                        if key[1][0] == node["name"]:
                                            new_p_list.append((p[0], (p_edge[1][1], key)))
                                else:
                                    p_list.append(p_edge)
                        else:
                            pass #TODO logging.error("Module.exports")
                elif p_type == "param":
                    if call_p not in self.scopes[p[0]][p[1][0]][p[1][1]]["mem"]:
                        self.scopes[p[0]][p[1][0]][p[1][1]]["mem"].append(call_p)
                else:
                    pass #TODO logging.error(f"p type error {p_type}")

            p_list = new_p_list


    if len(work_list) == 1:
        alias = set()
        node = work_list.pop()

        node_type = node["type"]
        if node_type == "Identifier":

            tmp_p_list = copy.deepcopy(p_list)
            analysised_p_set = set()
            while p_list:
                p = p_list.pop()
                if p in analysised_p_set:
                    continue
                analysised_p_set.add(p)

                if p[0] in ["undefined", "primordials", "binding", ]:
                    continue
                if self.aim == "built-in":
                    if p[0] in self.builtins:
                        if node["type"] == "Identifier":
                            new_p = list(p)
                            new_p.append(node["name"])
                            r_list.append(tuple(new_p))
                            continue
                        else:
                            pass #TODO logging.error(f"node type error {node['type']}")

                if p[1][1][0] in ["this", "prop"]:
                    p_node = self.scopes[p[0]][p[1][0]][p[1][1][0]][p[1][1][1]]
                else:
                    p_node = self.scopes[p[0]][p[1][0]][p[1][1]]
                    if call_p:
                        if p[1][1][1][1][0] ==  call_p[1][1][1][1][0]:
                            continue
                p_type = p_node["type"]
                p_edge_list = p_node["edge"]
                p_blck = p_node["blck"]
                if p_type == "var":
                    if not p_edge_list and p_blck:
                        for _blck in p_blck:
                            if _blck["type"] == "ThisExpression":
                                if node["type"] == "Identifier":
                                    r_list.extend(self.analysis_Identifier(node))
                                else:
                                    pass #TODO logging.error("this next node type error~")
                            else:
                                _blck_p_list = self.analysis_Expression(_blck, _blck["type"], f=f, p=p)
                                if _blck_p_list:
                                    p_edge_list.extend(_blck_p_list)
                    if p_edge_list:
                        p_list.extend(p_edge_list)
                elif p_type in ["func", "class"]:
                    if not p_edge_list and p_blck:
                        for _blck in p_blck:
                            p_edge_list.extend(self.analysis_Expression(_blck, _blck["type"], f=f, p=p))
                    if p_edge_list:
                        r_list.extend(self.find_node(p_edge_list, node))
                elif p_type in ["call", "new"]:
                    if not p_edge_list and p_blck:
                        for _blck in p_blck:
                            self.push_module_scopeid_stack()
                            self.module_name = p[0]
                            self.scope_id = p[1][0]
                            p_edge_list.extend(self.analysis_Expression(_blck, _blck["type"], f=f, p=p))
                            self.pop_module_scopeid_stack()
                    if p_edge_list:
                        callee_edge_list = p_edge_list
                        return_list = list()
                        for callee_edge in callee_edge_list:
                            if callee_edge[0] in ["undefined", "primordials", "binding", "internalBinding"]:
                                continue
                            if self.aim == "built-in":
                                if callee_edge[0] in self.builtins:
                                    new_p = list(callee_edge)
                                    new_p.append(node["name"])
                                    r_list.append(tuple(new_p))
                                    continue
                            callee_edge_node = self.scopes[callee_edge[0]][callee_edge[1][0]][callee_edge[1][1]]
                            callee_edge_node_type = callee_edge_node["type"]
                            if callee_edge_node_type in ["func", "class", "var"]:
                                if callee_edge[1][1] in self.scopes[callee_edge[0]]:
                                    if "this" in self.scopes[callee_edge[0]][callee_edge[1][1]]:
                                        for _key in self.scopes[callee_edge[0]][callee_edge[1][1]]["this"]:
                                            if _key[1][0] == node["name"]:
                                                r_list.append((callee_edge[0], (callee_edge[1][1], ("this", _key))))
                                    if "prop" in self.scopes[callee_edge[0]][callee_edge[1][1]]:
                                        for _key in self.scopes[callee_edge[0]][callee_edge[1][1]]["prop"]:
                                            if _key[1][0] == node["name"]:
                                                r_list.append((callee_edge[0], (callee_edge[1][1], ("prop", _key))))
                                    if callee_edge_node_type == "class":
                                        for _key in self.scopes[callee_edge[0]][callee_edge[1][1]]:
                                            if _key[1][0] == node["name"]:
                                                r_list.append((callee_edge[0], (callee_edge[1][1], _key)))
                                callee_edge_node_name = callee_edge_node["name"]
                                if callee_edge_node_name in self.function_table:
                                    if callee_edge[1][1] in self.function_table[callee_edge_node_name]:
                                        return_p_list = self.function_table[callee_edge_node_name][callee_edge[1][1]]["return"]
                                        if return_p_list:
                                            p_list.extend(return_p_list)
                                        else:
                                            pass #TODO logging.error("")
                                    else:
                                        pass #TODO logging.error(f"callee_edge_node_range not in function table {callee_edge}")
                                else:
                                    pass #TODO logging.error(f"callee egde not in function table")
                            elif callee_edge_node_type == "obj":
                                p_list.append(callee_edge)
                            else:
                                pass #TODO logging.error(f"callee edge node type error {callee_edge_node_type}")
                        p_list.extend(return_list)
                    # if not p_edge_list and p_blck:
                    #     for _blck in p_blck:
                    #         p_edge_list.extend(self.analysis_Expression(_blck, _blck["type"], f=f, p=p))
                    # if p_edge_list:
                    #     r_list.extend(self.find_node(p_edge_list, node))
                    # for _blck in p_blck:
                    #     _node = node
                    #     p_list.extend(self.analysis_Expression(_blck, _blck["type"], f=format, p=p))
                elif p_type == "obj":
                    if p[1][1] in self.scopes[p[0]]:
                        for key in self.scopes[p[0]][p[1][1]]:
                            if key[1][0] == node["name"]:
                                r_list.append((p[0], (p[1][1], key)))
                    else:
                        if p_edge_list:
                            for p_edge in p_edge_list:
                                if p_edge[1][1] in self.scopes[p_edge[0]]:
                                    for key in self.scopes[p_edge[0]][p_edge[1][1]]:
                                        if key[1][0] == node["name"]:
                                            r_list.append((p[0], (p_edge[1][1], key)))
                                else:
                                    p_list.append(p_edge)
                        else:
                            pass #TODO logging.error("Module.exports")
                elif p_type == "param":
                    if call_p not in self.scopes[p[0]][p[1][0]][p[1][1]]["mem"]:
                        self.scopes[p[0]][p[1][0]][p[1][1]]["mem"].append(call_p)
                elif p_type == "rtrn":
                    p_list.extend(p_edge_list)
                else:
                    pass #TODO logging.error(f"p type error {p_type}")

            if not r_list:
                if node["name"] in self.native_methods:
                    r_list.extend(tmp_p_list)
                    if call_p:
                        self.scopes[call_p[0]][call_p[1][0]][call_p[1][1]]["native"] = True
                    else:
                        pass #TODO logging.error("forget call_p")
                    if call_p:
                        if "arguments_key" not in self.scopes[call_p[0]][call_p[1][0]][call_p[1][1]]:
                            self.scopes[call_p[0]][call_p[1][0]][call_p[1][1]]["arguments_key"] = {
                                "id": dict(),
                                "name": dict()
                            }
                        arguments_key = self.scopes[call_p[0]][call_p[1][0]][call_p[1][1]]["arguments_key"]
                        arguments_id = arguments_key["id"]
                        # for _id in range(0, len(arguments_id)):
                        for _id in arguments_id:
                            argument_p_list = arguments_id[_id]
                            for argument_p in argument_p_list:
                                argument_node = self.scopes[argument_p[0]][argument_p[1][0]][argument_p[1][1]]
                                argument_node_edge_list = argument_node["edge"]
                                argument_node_blck = argument_node["blck"]
                                if not argument_node_edge_list and argument_node_blck:
                                    for _blck in argument_node_blck:
                                        pass #TODO logging.error(f'heeeeeeeere {_blck["type"]}')
                                else:
                                    if argument_node_edge_list:
                                        for argument_node_edge in argument_node_edge_list:
                                            if argument_node_edge[0] in ["undefined", "primordials", "binding", "internalBinding"]:
                                                continue
                                            elif self.aim == "built-in":
                                                if argument_node_edge[0] in self.builtins:
                                                    continue

                                            if argument_node_edge[1][1][0] in ["this", "prop"]:
                                                argument_node_edge_node = self.scopes[argument_node_edge[0]][argument_node_edge[1][0]][argument_node_edge[1][1][0]][argument_node_edge[1][1][1]]
                                            else:
                                                argument_node_edge_node = self.scopes[argument_node_edge[0]][argument_node_edge[1][0]][argument_node_edge[1][1]]
                                            argument_node_edge_node_name = argument_node_edge_node["name"]
                                            argument_node_edge_node_type = argument_node_edge_node["type"]
                                            if argument_node_edge_node_type == "func":
                                                argument_node["self"] = True
                                            else:
                                                pass #TODO logging.error(f"argument_node_edge_node_type type error {argument_node_edge_node_type}")

                    else:
                        pass #TODO logging.error("call p error")
        elif node_type == "Literal":
            if p_list:
                r_list.extend(p_list)
        else:
            pass #TODO logging.error(f"node type error {node_type}")
    else:
        if p_list:
            return p_list
        else:
            logging.warn(f"work list length error")
    return r_list
