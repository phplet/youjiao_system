/**
 * Created by tonyjiang on 15/2/8.
 */
define([
    'modules/Util'
],function(Util){
    var ClassBase = function(){
        this.inherited = function(){
            return (function(_this , _proto , arg){
                var name = arg.callee.name;
                if(!name){
                    for(var i in _this){
                        if(_this[i] == arg.callee){
                            name = i;
                            break;
                        }
                    }
                }
                if(name && _proto[name]){
                    _proto[name].apply(_this , arg);
                    arguments.callee.call(this , _this , _proto.constructor.prototype , arg);
                }
            })(this , this.constructor.prototype , arguments[0]);

        }
    };

    Function.prototype.extend = function(){
        this.prototype = new arguments[0];
        var _extendsPrototype = {};
        if(arguments.length > 1){
            for(var i = 1,len = arguments.length ; i < len ; i++){
                _extendsPrototype = Util.mixin(_extendsPrototype , new arguments[i]);
            }
        }
        this.prototype = Util.mixin(this.prototype , _extendsPrototype);
        return Util.hitch(this , function(){
            //暂时满足当前使用,后期完善
            var o = new this(arguments[0]);
            o.constructor = this;
            return o;
        });
    };

    return ClassBase;

});
