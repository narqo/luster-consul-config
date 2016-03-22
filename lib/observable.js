function removeSubsriber(subscribers, item) {
    delete subscribers[subscribers.indexOf(item)];
}

module.exports = function observableVal(initialVal) {
    var val = initialVal,
        subscribers = [];

    observable.set = function(newVal) {
        val = newVal;
        for (var i = 0; i < subscribers.length; i++) {
            subscribers[i](val);
        }
    };

    return observable;

    function observable(subscriber) {
        subscribers.push(subscriber);
        subscriber(val);
        return function() {
            removeSubsriber(subscribers, subscriber);
        };
    }
};
