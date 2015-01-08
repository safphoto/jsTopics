// Safely create namespace
var SAF = SAF || {};

SAF.JsTopics = {};

(function(bus) {
    // subscriptions store
    var store = {};
    
    // A topic identifier
    var topicId = -1;

    /**
     * @return {boolean}
     */
    bus.publish = function (topic, data) {
        if (!store[topic]) {
            return false;
        }

        var subscribers = store[topic], len = subscribers ? subscribers.length : 0;

        while (len--) {        
            subscribers[len].func(topic, data);
            subscribers[len].invoked++;
        }
        
        return this;    
    };

    /**
     * @return {string}
     */
    bus.subscribe = function (topic, func) {
        if (!store[topic]) {    
            store[topic] = [];    
        }

        // Subscription identifier used when unsubscribing
        var token = (++topicId).toString();
        
        store[topic].push({        
            token: token,        
            func: func,
            invoked: 0
        });
        
        return token;        
    };

    // Unsubscribe from a topic based on a tokenized reference to the subscription.
    bus.unsubscribe = function (token) {
        for (var topic in store) {
            if (store[topic]) {
                var topicCount = store[topic].length;
                for (var index = 0; index < topicCount; index++) {
                    if (store[topic][index].token === token) {
                        store[topic].splice(index, 1);
                        return token;
                    }                
                }            
            }        
        }
        
        return this;
    };

    /**
     * @return {Array.<string>}
     */
    bus.topicList = function () {
        var topics = [];
        for (var topic in store) {
            topics.push(topic);
        }
        
        return topics;
    };

    /**
     * @return {int}
     */
    bus.topicCount = function () {
        var topics = bus.topicList();
        return topics.length;
    };
    
    bus.clearSubscriptions = function () {
        topics = {};
    };

    /**
     * @return {int}
     */
    bus.invokedCount = function (token) {
        var count = 0;
        
        for (var topic in store) {
            if (store[topic]) {
                for (var index = 0, topicCount = store[topic].length; index < topicCount; index++) {
                    if (store[topic][index].token === token) {
                        count = store[topic].invoked;
                    }                
                }            
            }        
        }
        
        return count;
    }

}(SAF.JsTopics));