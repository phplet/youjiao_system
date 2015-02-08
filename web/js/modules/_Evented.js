/**
 * Created by tonyjiang on 15/2/8.
 */
define(function(){

    var _Evented = function(){

        var _handler = {};

        this.on = function(event , eventHandler){
            if(!_handler[event]){
                _handler[event] = [];
            }

            _handler[event].push(eventHandler);
        };

        this.off = function(event , eventHandler){
            if(!_handler[event]){
                return false;
            }

            for(var i = 0, len = _handler[event].length ; i < len ; i ++){
                if(_handler[event][i] == eventHandler){
                    _handler[event].splice(i , 1);
                    return true;
                }
            }
            return false;
        };

        this.emit = function(event , eventContent){
            if(!_handler[event]){
                return false;
            }

            for(var i = 0, len = _handler[event].length ; i < len ; i++){
                try{
                    _handler[event][i](eventContent);
                }catch(e){}
            }

        }
    };


    return _Evented;

});