const allEntities = [
    "users",
    "posts"
];
const defaultState = allEntities.reduce(
    (acc, entity) => ({
        ...acc,
        [entity]: {
            byId: {},
            allIds: []
        }
    }), {}
);

const entityReducer = (entity, state = { allIds: [], byId: {} }, action) => {
    const actionEntities = action.payload[entity].undefined;
    const { actionType } = action.meta;



    switch(actionType) {
        case 'GET_ALL':
            return {
                byId: {
                    ...Object.values(actionEntities).reduce(
                        (acc, curr) => ({
                            ...acc,
                            [curr._id]: {
                                ...curr
                            }
                        })
                    , {}),
                },
                allIds: Object.values(actionEntities).reduce((acc,curr)=>{return [...acc,curr._id]},[])
            }
        case "DEL_ONE":      
            return {byId:Object.fromEntries(Object.entries(state.byId).slice(0).filter(([k,v]) => k!==actionEntities)),allIds:state.allIds.slice(0).filter(id => id !== actionEntities)}
        case "UPDATE_ONE": 
            return {byId:{...state.byId,actionEntities},allIds:[...state.allIds]}
        case "ADD_ONE":
            return {byId:{...state.byId,actionEntities},allIds:[...state.allIds,Object.values(actionEntities)._id]}
        default:
            return state;
    }
}


export const entities = (state = defaultState, action) => {
    if(!action.meta || !action.meta.actionType) return state;
    return {
        ...state,
        ...Object.keys(action.payload).reduce(
            (acc, entity) => ({
                ...acc,
                [entity]: entityReducer(entity, state[entity], action)
            }), {}
        ),
    }
}
