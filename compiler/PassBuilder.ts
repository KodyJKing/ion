import {Visitor,skip} from "./Traversal"

export type Filter = Visitor & {name:string,target:string[],mutate:boolean}
export type Pass = Visitor & {names:string[]}

function createFilter(filter: Filter | ((node:any) => any)): Filter {
    if (typeof filter === 'function') {
        let name = filter.name
        //  allows you to provide target in name of function
        let split = filter.name.split('_')
        if (split.length <= 1)
            throw new Error("Name must have target prefix: " + name)
        let target = split.slice(0, -1)
        return {name, target, mutate:false, leave:filter}
    }
    else {
        if (!Array.isArray(filter.target))
            throw new Error(filter.name + " target is not an array: " + filter.target)
        return filter
    }
}

const AllNodeTargetType = "Node"

export function createPass(filters: Filter[]): Pass {
    //  ensure all filters are visitors
    filters = filters.map(f => createFilter(f))
    //  get mutate filters
    let mutators = filters.filter(f => f.mutate === true)
    //  check that none operate on same types
    let mutationTypes: any = {}
    for (let filter of mutators) {
        for (let target of filter.target) {
            if (target === AllNodeTargetType)
                throw new Error("Mutation filters cannot target all nodes: " + filter.name)
            if (mutationTypes[target] != null)
                throw new Error("Mutation filters operate on same type: " + mutationTypes[target] + " and " + filter.name)
            mutationTypes[target] = filter.name
        }
    }
    //  sort mutate filters to end
    filters = filters.filter(f => f.mutate !== true).concat(mutators)

    //  create type map
    let targetTypeMap: any = {}
    for (let filter of filters) {
        for (let target of filter.target) {
            let handlers = targetTypeMap[target]
            if (handlers == null)
                handlers = targetTypeMap[target] = {enters:[],leaves:[]}

            if (filter.enter) {
                (<any>filter.enter).filter = filter    // store filter ref
                handlers.enters.push(filter.enter)
            }
            if (filter.leave) {
                (<any>filter.leave).filter = filter    //  store filter ref
                handlers.leaves.push(filter.leave)
            }
        }
    }

    // now join the all's to every other handlers enters/leaves
    let allHandler = targetTypeMap[AllNodeTargetType]
    if (allHandler != null) {
        for (let type in targetTypeMap) {
            if (type !== allHandler) {
                let handler = targetTypeMap[type]
                handler.enters = handler.enters.concat(allHandler.enters)
                handler.leaves = handler.leaves.concat(allHandler.leaves)
            }
        }
    }

    function getHandler(type: string) {
        return targetTypeMap[type] || targetTypeMap[AllNodeTargetType]
    }

    return {
        names: filters.map(f => f.name),
        enter: (node:any) => {
            let handler = getHandler(node.type)
            if (handler) {
                let {enters} = handler
                for (let enter of enters) {
                    enter(node)
                }
            }
        },
        leave: (node:any) => {
            let handler = getHandler(node.type)
            if (handler) {
                let {leaves} = handler
                let finalResult = undefined
                for (let leave of leaves) {
                    let result = leave(node)
                    if (result !== undefined) {
                        if (leave.filter.mutate !== true)
                            throw new Error("Filter mutated without setting mutate true: " + leave.filter.name)
                        if (finalResult !== undefined) {
                            debugger
                            throw new Error("This shouldn't be possible")
                        }
                        finalResult = result
                    }
                }
                return finalResult
            }
        }
    }
}
