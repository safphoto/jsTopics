/*
    Copyright © 2015 Scott Flaherty

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

var SAF = SAF || {};

SAF.Topics = {};

(function(bus) {
    'use strict';

    // subscriptions store
    var store = {};
    
    // A topic identifier
    var topicId = -1;

    /**
     * Send message to subscribers
     *
     * @param topic
     * @param data
     * @returns {*}
     */
    bus.publish = function (topic, data) {
        if (!store.hasOwnProperty(topic)) {
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
     * Ask to receive messages published to a specified topic
     *
     * @param topic
     * @param func
     * @returns {string}
     */
    bus.subscribe = function (topic, func) {
        if (!store.hasOwnProperty(topic)) {
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

    /**
     * Unsubscribe from a topic based on a tokenized reference to the subscription.
     *
     * @param token
     * @returns {*}
     */
    bus.unsubscribe = function (token) {
        for (var topic in store) {
            if (store.hasOwnProperty(topic)) {
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
     * Returns a list of topics that have subscriptions
     *
     * @returns {Array}
     */
    bus.topicList = function () {
        var topics = [];
        for (var topic in store) {
            if (store.hasOwnProperty(topic)) {
                topics.push(topic);
            }
        }
        
        return topics;
    };

    /**
     * Returns the number of topics that have subscriptions
     *
     * @returns {Number}
     */
    bus.topicCount = function () {
        var topics = bus.topicList();
        return topics.length;
    };

    /**
     * Removes all subscriptions
     */
    bus.clearSubscriptions = function () {
        store = {};
    };

    /**
     * Returns the number of times a subscription was fulfilled
     * @param token
     * @returns {number}
     */
    bus.invokedCount = function (token) {
        var count = 0;
        
        for (var topic in store) {
            if (store.hasOwnProperty(topic)) {
                for (var index = 0, topicCount = store[topic].length; index < topicCount; index++) {
                    if (store[topic][index].token === token) {
                        count = store[topic].invoked;
                    }                
                }            
            }        
        }
        
        return count;
    };
}(SAF.Topics));