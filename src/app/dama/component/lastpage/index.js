
function Decorator(){
    return function (target, name, descriptor){
        console.log(target,name,descriptor)

        if (descriptor.initializer) {
            return {
                enumerable: true,
                configurable: true,
                get: function() {
                    console.log(this)
                    return descriptor.initializer && descriptor.initializer.call(this);
                },
            }
        }
        return descriptor
    }
}
export default Decorator
