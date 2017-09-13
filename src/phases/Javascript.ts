import * as escodegen from "escodegen"
import * as jst from "../JsAstTypes"
import * as iot from "../IonAstTypes"
import {fail} from "./Input"

////////////////////////////////////////////////////////////////////////////////////
//  Export to Javascript Filters
////////////////////////////////////////////////////////////////////////////////////
const __VariableDeclaration_ToJavascript = (node:any) => {
    return {
        type: jst.VariableDeclaration,
        kind: node.kind === 'let' ? 'const' : 'var',
        declarations: [
            {
                type: jst.VariableDeclarator,
                id: node.id,
                init: node.value
            }
        ]
    }
}
const __IdDeclaration_IdReference_Id_ToIdentifier = (node:any) => {
    node.type = jst.Identifier
}

const Assembly_ModulesToJavascriptFiles = (node: any) => {
    //  make a file for each root module
    node.files = Object.keys(node.modules).map(
        (name: any) => {
            return {
                type: "File",
                language: "javascript",
                path: node.options.output + '/' + name + '.js',
                content: {
                    type: jst.Program,
                    body: [
                        {
                            type: jst.ExpressionStatement,
                            expression: {
                                type: jst.CallExpression,
                                arguments: [],
                                callee: {
                                    type: jst.FunctionExpression,
                                    params: [],
                                    body: {
                                        type: jst.BlockStatement,
                                        body: [
                                            {
                                                type: jst.VariableDeclaration,
                                                kind: 'const',
                                                declarations: [
                                                    {
                                                        type: jst.VariableDeclarator,
                                                        id: {type:jst.Identifier, name},
                                                        init: {
                                                            type: jst.AssignmentExpression,
                                                            left: {
                                                                type: jst.MemberExpression,
                                                                object: {type:jst.ThisExpression},
                                                                property: {type:jst.Identifier, name}
                                                            },
                                                            operator: '=',
                                                            right: node.modules[name]
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    )
    //  delete modules from assembly
    delete node.modules
}
    
const __Module_ToJavascript = (node: any, ancestors: object[], path: string[]) => {
    let name = path[path.length - 1]
    return {
        type: jst.CallExpression,
        callee: {
            type: jst.FunctionExpression,
            id: {type:jst.Identifier,name},
            params: [],
            body: {
                type: jst.BlockStatement,
                body: (function(){
                    //  imports? not yet
                    let statements: any[] = [...node.declarations]
                    if (Array.isArray(node.exports)) {
                        for (let exportDeclaration of node.exports) {
                            statements.push(exportDeclaration)
                        }
                        statements.push({
                            type: jst.ReturnStatement,
                            argument: {
                                type: jst.ObjectExpression,
                                properties: node.exports.map(
                                    (declaration:any) => {
                                        return {
                                            type: jst.Property,
                                            kind: "init",
                                            key: declaration.id,
                                            value: declaration.id
                                        }
                                    }
                                )
                            }
                        })
                    } else {
                        let exportDeclaration = node.exports
                        statements.push(exportDeclaration)
                        statements.push({
                            type: jst.ReturnStatement,
                            argument: exportDeclaration.id
                        })
                    }
                    return statements
                }())
            }
        },
        arguments: [],
    }
}

const File_CompileJavascript = (node:any) => {
    if (node.language == "javascript") {
        node.content = escodegen.generate(node.content)
    }
}

const idChars = new Set("_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
const validId = /^[_a-zA-Z][_a-zA-Z0-9]*$/
const encodeLiteralIdentifier = (name: string) => {
    let result = ['__id_']
    for (let c of name) {
        if (idChars.has(c)) {
            result.push(c)
        } else {
            result.push('_', c.charCodeAt(0).toString())
        }
    }
    result.push('_')
    return result.join('')
}
const Identifier_ensureValidName = (node:any) => {
    if (!validId.test(node.name)) {
        node.name = encodeLiteralIdentifier(node.name)
    }
}

export const passes = [
    [__Module_ToJavascript]
    ,[__VariableDeclaration_ToJavascript, __IdDeclaration_IdReference_Id_ToIdentifier]
    ,[Identifier_ensureValidName, Assembly_ModulesToJavascriptFiles]
//    ,[File_CompileJavascript]
]
