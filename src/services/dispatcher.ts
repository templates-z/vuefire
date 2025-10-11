type Events = {
    [key: string]: ( ( ...args: any )=>void ) [];
};

const events: Events = {};

function subscribe(event: string, callback: ( ...args: any )=>void ): void {
    if (!events.hasOwnProperty(event)) {
        events[event] = [];
    }
    events[event].push(callback);
    
}

function unsubscribe(event: string, callback: ( ...args: any )=>void ): void {
    if (events.hasOwnProperty(event)) {
        events[event] = events[event].filter(subscriber => subscriber !== callback);
    }
}
function dispatch( event: string, ...args : any[] ): void{
    console.log('Dispatching event', event);
    if (events.hasOwnProperty(event)) {
        events[event].forEach( callback  => callback( ...args ));
    }
}

export {
    subscribe, unsubscribe, dispatch
}