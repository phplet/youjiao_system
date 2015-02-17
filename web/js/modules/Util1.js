/**
 * Created by tonyjiang on 15/2/8.
 */
define(function(){

    return {
        //切换作用域
        hitch : function(scope , method){
            return function(){
                return method.apply(scope , arguments);
            }
        },

        //暂时没用
        clone : function(src){
            var target = {};
            for(var i in src){
                target[i] = src[i];
            }
            return target;
        },

        //混入
        mixin : function(){
            var target = arguments[0];

            for(var i = 1, len = arguments.length ; i < len ; i++){

                var src = arguments[i];

                for(var property in src){
                    if(typeof src[property] == 'object'){

                        target[property] = this.clone(src[property])

                    }else if(typeof src[property] == 'function'){

                        target[property] = this.hitch(target , src[property]);
                    }else{
                        target[property] = src[property];
                    }
                }
            }

            return target;

        },


        indexOf : function(arr , key){
            if(Array.prototype.indexOf){
                return Array.prototype.indexOf.call(arr , key);
            }else{
                for(var i = 0, len = arr.length ; i < len ; i++){
                    if(arr[i] == key){
                        return i;
                    }
                }
                return -1;
            }
        }

    };

});