
export class Position {
    line: number
    column: number
    constructor(line: number, column: number) {
        this.line = line        // >= 1
        this.column = column    // >= 0
    }
}
export class SourceLocation {
    start: Position
    end: Position
    source: string | null
    constructor(start: Position, end: Position, source: string) {
        this.start = start
        this.end = end
        this.source = source
    }
}
export abstract class Node {
    type: string
    location: SourceLocation | null = null
    constructor(properties?: any) {
        this.type = this.constructor.name
        if (properties != null) {
            for (const key in properties) {
                (this as any)[key] = properties[key]
            }
        }
    }
}
export abstract class Scope extends Node {
    //  from local variable name to a canonical type name
    //  the canonical types will be stored at the root level
    variables: {[name: string]: string}
}
export class Module extends Scope {
    imports: ImportDeclarations | null
    declarations: Declaration[]
    exports: Declaration | Declaration[]
}
export class ClassDeclaration extends Scope implements Declaration {
    valueType: boolean
    id: IdDeclaration
    typeParameters: Parameter[]
    baseClasses: IdReference[]
    properties: VariableDeclaration[]
}
export class BlockStatement extends Scope implements Statement {
    body: Statement[]
}
export class ForInStatement extends Scope implements Statement {
    left: Pattern
    right: Expression
    body: BlockStatement
}

export interface Pattern extends Node {}
export interface Expression extends Node {}
export interface Statement extends Node {}
export interface Declaration extends Node {}
export class Id extends Node {
    name: string
}
export class IdDeclaration extends Id implements Pattern {}
export class IdReference extends Id {}
export class Literal extends Node implements Pattern {
    value: string | number | boolean | null
}
export class VariableDeclaration extends Node implements Declaration {
    assignable: boolean
    id: IdDeclaration
    valueType: Type | null
    init: Expression | null
}
export class CallExpression extends Node implements Expression {
    callee: Expression
    arguments: Expression[]
}
export class Parameter extends Node {
    pattern: Pattern
    valueType: Type
}
export class ImportDeclarations extends Node {
    declarations: ImportSubDeclaration[]
}
export class ImportSubDeclaration extends Node {
    relative: number
    path: (Id | Literal)[]
    children: ImportSubDeclaration[] | null
    as: IdDeclaration | null
}

////////////////////////////////////////////////////////////////////////////////
//  Types
////////////////////////////////////////////////////////////////////////////////

export interface Type extends Node {}
export class TypeReference extends Node {
    id: IdReference
}