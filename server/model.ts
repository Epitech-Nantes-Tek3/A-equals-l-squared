/**
 * @swagger contains the data of the client
 */
export interface Client {
    host: string; //host of the client
}

/**
 * @swagger contains the data of the server
 */
export interface Server {
    current_time: number; //current time of the server
    services: Service[]; //list of services
}

/**
 * @swagger contains the data of a service
 */
export interface Service {
    name: string; //name of the service
    actions: Action[]; //list of actions
    reactions: Reaction[]; //list of reactions
}

/**
 * @swagger contains the data of an action
 */
export interface Action {
    name: string; //name of the action
    description: string; //description of the action
}

/**
 * @swagger contains the data of a reaction
 */
export interface Reaction {
    name: string; //name of the reaction
    description: string; //description of the reaction
}