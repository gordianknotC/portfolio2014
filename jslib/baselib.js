//bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
///  ********  C O R E    ***********
//   Class, Module, Decorator, Bindings
///  ********  C O R E    ***********
// Decorators
__all__ = Array()

function BuiltinCollision(lib, libname) {
	if (lib == 'undefined'){
		throw(Error('Namespace collision on funcion:'+ libname))
	}
}

BuiltinCollision(property, 'property')
function property(fn, scope, fget, fset, call_context) {
	var getname, setname
	if (typeof fn == 'string'){
		getname = fn
		setname = fn + '_setter'
		fn = fget
	}else{
		getname = fn.name
	}
	function setter(_scope, k) {
		var setter_conventions = ['set'+k, 'set_'+k, k+'_setter', k+'setter'], i, clen=setter_conventions.length
		function wrapper(value) {
			if (isEmpty(_scope.__property_methods__[k].__property_init__)) {
				_scope.__property_methods__[k].__property_init__ = true;
				return;
			}
			if (typeof value == "function") {
				//for (i=0; i<clen; i++ ){
				//	if (setter_conventions[i] == value.lower()) {
				//		_scope.__defineSetter__(k, fn)
				//	}
				//}
				_scope.__property_methods__[k] = value;
			} else {
				throw "decorated property only allowed for assigning to function";
			}
		}
		return wrapper;
	}

	function getter() {
		return scope.__property_methods__[getname].call(this);
	}
	function setterB(value){
		return scope.__property_methods__[setname].call(this, value)
	}
	function _getter() {
		//console.log('call custom context')
		return scope.__property_methods__[getname].call(call_context);
	}
	function _setterB(value){
		//console.log('call custom context')
		return scope.__property_methods__[setname].call(call_context, value)
	}
	if (typeof(call_context) != 'undefined') {
		getter = _getter
		setterB = _setterB
	}

	if (isEmpty(scope.__property_methods__)) {
		scope.__property_methods__ = {};
	}

	if (typeof fget == 'undefined'){
		scope.__property_methods__[getname] = fn;
		scope.__defineGetter__(getname, getter);
		scope.__defineSetter__(getname, setter(scope, getname));
	}else{
		if (fget.hasOwnProperty('orig') || fset.hasOwnProperty('orig'))
			 throw ('assigning binded method to property is not allowed\n' +
			'the side effect of doing this is that it would break inheritance\n' +
			'from inherited method that trying to access __property_methods__\n' +
			'because of the characteristic of binded methods, calling context\n' +
			'remain unchanged ')
		scope.__property_methods__[setname] = fset
		scope.__property_methods__[getname] = fget
		scope.__defineGetter__(getname, getter);
		scope.__defineSetter__(getname, setterB);
	}
	return fn;
}


BuiltinCollision(classmethod, 'classmethod')
function classmethod(fn, scope) {
	function getter() {
		return scope.prototype[fn.name]
	}

	scope.__defineGetter__(fn.name, getter);
	return fn;
}


BuiltinCollision(getter, 'getter')
function getter(fn, scope) {
	function _getter() {
		return scope.__property_methods__[fn.name].call(this);
	}

	name = fn.name.replace('_getter', '');
	scope.__property_methods__[fn.name] = fn;
	scope.__defineGetter__(name, _getter);
	return fn;
}


BuiltinCollision(setter, 'setter')
function setter(fn, scope) {
	function _setter(value) {
		return scope.__property_methods__[fn.name].call(this, value);
	}

	name = fn.name.replace('_setter', '');
	scope.__property_methods__[fn.name] = fn;
	scope.__defineSetter__(name, _setter);
	return fn;
}
/* class and Modules */
BuiltinCollision(super_, 'super_')
function super_(cls, instance) {
	var level, super_name, super_class, name;
	level = "";
	function find_class_name(ref, name, level) {
		level += ".__proto__";
		if (ref.__proto__.__name__ == name) {
			return [ref.__proto__, level];
		} else {
			return find_class_name(ref.__proto__, name, level);
		}
	}

	super_name = cls.prototype.__proto__.__name__;
	//instance.name = cls.name;
	_$Unpack = find_class_name(instance, super_name, level);
	super_class = _$Unpack[0];
	level = _$Unpack[1];
	instance.__superlevel__ = level;
	if (super_class.constructor == Object){
		name = cls.name
		if (cls.hasOwnProperty('__name__')) name = cls.__name__
		throw( new Error('Fetch super class from: {} failed'.format(name)) )
	}
	return super_class;
}


//function set_scope(Module_path) {
//	var scope;
//	scope = {};
//	scope.__Module__ = Module_path;
//	return scope;
//}
//function Module(fn_Module) {
//	var Module_member_data, scope_attrs, scope, _filter, is_k_in_filter, k, v, key, value, attr;
//
//	function getAllExcept(lst, _Module) {
//		function wrapper() {
//			var name, _filter, tmp, m, is_k_in_filter, k, v;
//			name = _Module.name;
//			_filter = lst;
//			tmp = {};
//			m = eval(name).prototype;
//			var _$Iter1 = dict.items(m);
//			for (var _$id1 = 0; _$id1 < _$Iter1.length; _$id1++) {
//				k = _$Unpack[0];
//				v = _$Unpack[1];
//				is_k_in_filter = _$in_(k, _filter);
//				_$Unpack = _$Iter1[_$id1];
//				if (!is_k_in_filter) {
//					tmp[k] = v;
//				}
//			}
//			return tmp;
//		}
//
//		return wrapper;
//	}
//
//	if (isEmpty(fn_Module.prototype)) {
//		Module_member_data = fn_Module();
//		//Module_member_data.ALL = getAllExcept([ "ALL", "scope" ], fn_Module);
//		scope_attrs = [];
//		scope = Module_member_data.scope;
//		_filter = ["arguments", "caller", "length", "name", "prototype", "__proto__", "__Module__"];
//		var _$Iter2 = dict.items(Module_member_data);
//		for (var _$id2 = 0; _$id2 < _$Iter2.length; _$id2++) {
//			_$Unpack = _$Iter2[_$id2];
//			key = _$Unpack[0];
//			value = _$Unpack[1];
//			if (key == "scope") {
//				var _$Iter3 = dict.items(value);
//				for (var _$id3 = 0; _$id3 < _$Iter3.length; _$id3++) {
//					_$Unpack = _$Iter3[_$id3];
//					k = _$Unpack[0];
//					v = _$Unpack[1];
//					is_k_in_filter = _$in_(k, _filter);
//					if (!is_k_in_filter) {
//						//console.log("scope var..", k, v);
//						if (isEmpty(Module_member_data[k])) {
//							Module_member_data[k] = v;
//						} else {
//							throw "[Error][Naming Confliction]Module-scope variable: [" + k + "] interfere with Module member: [" + k + "]";
//						}
//						scope["_" + k] = v;
//						scope_attrs.append(k);
//					}
//				}
//			}
//		}
//		Module_member_data["scope"] = scope;
//		fn_Module.prototype = Module_member_data;
//		function setter_callback(scope_obj, _attr) {
//			function wrapper(_value) {
//				eval(scope_obj.__Module__).prototype.scope["_" + _attr] = _value;
//			}
//
//			return wrapper;
//		}
//
//		function getter_callback(scope_obj, _attr) {
//			function wrapper() {
//				return eval(scope_obj.__Module__).prototype.scope["_" + _attr];
//			}
//
//			return wrapper;
//		}
//
//		var _$Iter4 = scope_attrs;
//		for (var _$id4 = 0; _$id4 < _$Iter4.length; _$id4++) {
//			attr = _$Iter4[_$id4];
//			//console.log("set getter and setter for ", attr);
//			scope.__defineSetter__(attr, setter_callback(scope, attr));
//			scope.__defineGetter__(attr, getter_callback(scope, attr));
//		}
//		fn_Module.prototype.__defineSetter__(attr, getter_callback(scope, attr));
//		fn_Module.prototype.__defineGetter__(attr, getter_callback(scope, attr));
//		fn_Module.prototype.prototype = fn_Module.prototype;
//		return fn_Module.prototype;
//	} else {
//		return fn_Module.prototype;
//	}
//}
_$Callable = function (__init__) {
	function Class(behavior, successor_class) {
		var e
		function instance() {
			////console.log('inside obj.... obj = ', instance)
			if (Class.prototype.__call__ != undefined) {
				var caller = instance.caller;
				instance.__call__.apply(instance, arguments)
			} else {
				throw '[not callable] __call__ method is not found in ' + instance.name + ' ' + instance.__name__
			}
		}


		instance.__proto__ = Class.prototype
		for (e in instance.__proto__){
			if (instance.__proto__.__property_methods__.hasOwnProperty(e)){
			}else{
				instance[e] = instance.__proto__[e]
			}
		}
		instance.__name__ = __init__.name.split('_')[0];
		instance.__init__ = __init__;
		instance.__class__ = Class;
		if (behavior == "__inheritance__") {
			//successor_class = arguments[1]
			if (successor_class == undefined) return instance;
			inheritee = instance;
			//console.log('inheritance defualts')
			function inheriter() {
				//console.log('inside obj.... obj = ', inheriter)
				if (successor_class.prototype.hasOwnProperty('__call__')) {
					var caller = inheriter.caller;
					args = arguments.tolist();
					args.push(caller);
					inheriter.__call__.apply(inheriter, args);
				} else {
					r = inheriter.name + ' ' + inheriter.__name__ + ' is not callable';
					console.trace(r);
					throw r
				}
			}

			//console.log('____________________________-')
			inheriter.__proto__ = inheritee;
			inheriter.__name__ = successor_class.prototype.__name__;
			inheriter.__init__ = successor_class.prototype.__init__;
			//console.log(inheritee)
			if (inheritee.__proto__.hasOwnProperty('__recordinheritance__')) {
				if (isEmpty(inheritee.__proto__.__inheritance__)) inheritee.__proto__.__inheritance__ = [];
				function get_successor() {
					return successor_class
				}
				get_successor.__name__ = successor_class.__name__;
				inheritee.__proto__.__inheritance__.append(get_successor);
				inheritee.__proto__.__recordinheritance__()
				//console.log('record inheritance')
			}
			return inheriter;
		} else {
			// instantiate instance
			//----------------------------------
			function bind(fn, thisArg, _name) {
				var ret = function () {
					fn.caller = ret.orig.caller;
					return fn.apply(thisArg, arguments);
				};
				ret.__name__ = fn.__name__ = ret.name = fn.name = _name;
				ret.orig = fn;
				ret.__self__ = fn.__self__ = thisArg;
				return ret;
			}
			if (isEmpty(Class.prototype.__inheritedproperties__)) Class.prototype.__inheritedproperties__ = ['__dict__']
			var method_sets = instance.__proto__.items();
			var builtins = ['__init__', '__inheritance__', '__defineClassProperties__', '__classproperties__',
			'__getattr__', '__setattr__', '__getattribute__', '__add__', '__mul__', '__sub__', '__div__', '__mod__',
			'__pow__', '__lshift__', '__rshift__', '__and__', '__or__', '__xor__'];
			//console.log('method set:', instance.keys());
			//console.log('proto:', instance.__proto__);
			var itm, _name, _method;
			for (var i = 0; i < method_sets.length; i++) {
				itm = method_sets[i];
				_name = itm[0];
				_method = itm[1];
				//console.log(_name);
				if (typeof(_method) == 'function') {
					if(typeof(_method.__class__) == 'undefined' ){
						// bind methods
						if (builtins.find(_name) == -1) {
							instance[_name.toString()] = bind(_method, instance, _name);
							instance[_name + '_fastcall'] = _method;
						}
					}else{
						// assign python class object
						instance[_name] = _method
					}
				}
			}
			//------------------------------
			// simu __dict__, dir behavior
			if (Class.prototype.__inheritedproperties__.length == 1) {
				instance.__class__.prototype.__inheritedproperties__ = dir(instance)
				instance.__class__.prototype.__inheritedproperties__.extend(['__superlevel__', '__inheritedproperties__'])
			}
			//---------------------------------
			// run user constructor
			__init__.apply(instance, arguments);
			return instance;
		}
	}

	//console.log('class default settings')

	Class.__name__ = Class.prototype.__name__ = __init__.name.split('_')[0];
	Class.__init__ = Class.prototype.__init__ = __init__;
	Class.prototype.__class__ = Class;
	Class.__dict__ = Class.prototype.__dict__ = function __dict__() {
		return this.properties()
	};
	Class.__dict__ = property(Class.__dict__, Class);
	Class.prototype.__dict__ = property(Class.prototype.__dict__, Class.prototype)
	return Class;
};
function ____bind(fn, thisArg, _name) {
	var ret = function () {
		fn.caller = ret.orig.caller;
		return fn.apply(thisArg, arguments);
	};
	ret.__name__ = fn.__name__ = ret.name = fn.name = _name;
	ret.orig = fn;
	return ret;
}
function ____new(fn, thisArg, name){
	return new fn()
}
// _$rapyd$_
function _$rapyd$_bind_orig(fn, thisArg) {
	fn.__class__ = thisArg;
	if (fn.orig) fn = fn.orig;
	var ret = function () {
		fn.caller = ret.orig.caller;
		return fn.apply(thisArg, arguments);
	};
	ret.orig = fn;
	return ret;
}
function _$rapyd$_unbindAll(thisArg, rebind) {
	return;
	for (var p in thisArg) {
		if (thisArg[p] && thisArg[p].orig) {
			if (rebind) thisArg[p] = _$rapyd$_bind(thisArg[p], thisArg);
			else thisArg[p] = thisArg[p].orig;
		}
	}
}
function _$in(val, arr) {
	if (arr instanceof Array || typeof arr === "string") return arr.indexOf(val) != -1;
	else return val in arr;
}
function _$print() {
	console.log.apply(console, arguments)
 }
// gordianknot added
function _$rapyd$_constructor(cls) {
	cls.prototype.__name__ = cls.name;
	cls.prototype.constructor = cls;
	cls.prototype.__init__ = cls
}
// gordianknot modified
function _$rapyd$_bind(fn, thisArg) {
	is_prototype_initialize = ( fn.root_class) ? false : true;
	var get_class_method = function () {
		function find_method(ref, _fn) {
			if (ref.__methods__.hasOwnProperty(_fn.name)) {
				return ref
			}
			else {
				_super = ref.__proto__;
				if (_super.__methods__) {
					return find_method(_super, _fn)
				}
				else {
					throw 'AttributeError: class {0} has no attribute {1}'.
						format(ref.constructor.name, _fn.name)
				}
			}
		}

		founded = find_method(thisArg, fn);
		//thisArg.__methods__[fn.name] = founded_in_super.__methods__[fn.name]
		f = founded.__methods__[fn.name];
		f.__class__ = this;
		return f
	};
	if (is_prototype_initialize) {
		//fn.im_self = undefined
		//thisArg.__class__ = undefined
		if (!thisArg.__proto__.hasOwnProperty('__methods__')) {
			thisArg.__proto__.__methods__ = {};
			thisArg.__proto__.__init__ = thisArg.constructor
		}
		fn.root_class = thisArg.__proto__;
		fn.root_class.__name__ = fn.root_class.constructor.name;
		thisArg.__proto__.__methods__[fn.name] = fn;
	}
	// instance initiate and inheritance initiate
	//thisArg.__init__ 	= thisArg.constructor
	//thisArg.__class__ 	= thisArg.__proto__
	thisArg.__defineGetter__(fn.name, get_class_method);
	thisArg.__defineSetter__(fn.name, function (value) {
		thisArg.__methods__[fn.name] = value
	});
	return fn
}


function __expose_classproperties__() {
	function getter(_cls, k) {
		function wrapper() {
			return _cls.prototype[k];
		}

		return wrapper;
	}

	function setter(_cls, k) {
		function wrapper(value) {
			_cls.prototype[k] = value;
		}

		return wrapper;
	}

	var cls = arguments[0], i = 1, l = arguments.length, props, prop, pl, pi = 0
	//console.log('expose classproeprties:', arguments)
	for (; i < l; i++) {
		props = arguments[i]
		//console.log('props', props)
		pl = props.length
		for (pi = 0; pi < pl; pi++) {
			prop = props[pi]
			//console.log('classAttribute define getter setter:', prop)
			cls.__defineGetter__(prop, getter(cls, prop))
			cls.__defineSetter__(prop, setter(cls, prop))
		}
	}

}


// gordianknot

//BuiltinCollision(cls, 'cls')
//function cls() {
//	var cls = arguments[0];
//	var args = [].slice.call(arguments, 1);
//	var tmp, i, fn, ins;
//	tmp = "";
//	for (i = 1; i < len(arguments); i++) {
//		tmp += "arguments[" + i + "],";
//	}
//	fn = arguments[0];
//	ins = eval("new fn(" + tmp.slice(0, -1) + ")");
//	return ins;
//}
//
//function __defineClassProperties__(cls) {
//	function expose(_cls) {
//		var items, k, v, name;
//		items = _cls.prototype.items();
//		for (var i = 0; i < items.length; i++) {
//			k = items[i][0];
//			v = items[i][1];
//			if ((typeof v == 'function')) {
//				name = v.name;
//				if (typeof v.classmethod != 'undefined') {
//					if (k.indexOf('_') != 0) {
//						_cls.__defineGetter__(k, getter(_cls, k));
//						_cls.__defineSetter__(k, setter(_cls, k));
//					}
//				} else {
//					_cls.__defineGetter__(k, function () {
//						throw 'unbound method ' + name + ' must be called with ' + _cls.__name__ + ' instance'
//					});
//					_cls.__defineSetter__(k, function () {
//						throw 'unbound method ' + name + ' must be called with ' + _cls.__name__ + 'instance'
//					});
//				}
//				_cls.prototype[k].__class__ = _cls
//			}
//		}
//	}
//
//	function getter(_cls, k) {
//		function wrapper() {
//			return _cls.prototype[k];
//		}
//
//		return wrapper;
//	}
//
//	function setter(_cls, k) {
//		function wrapper(value) {
//			_cls.prototype[k] = value;
//		}
//
//		return wrapper;
//	}
//
//	var tmp, k, v;
//	if (!(cls.prototype.hasOwnProperty('__classproperties__'))) {
//		expose(cls);
//		return cls;
//	}
//	cls.prototype.__classproperty_setted__ = false;
//	tmp = new cls("__inheritance__");
//	tmp.__classproperties__();
//	if (!cls.prototype.__classproperty_setted__) {
//		expose(cls);
//		var items = dict.items(tmp);
//		for (var i = 0; i < items.length; i++) {
//			k = items[i][0];
//			v = items[i][1];
//			if (k in cls.prototype.__property_methods__.keys()) {
//			}
//			if (!(typeof v == "function") && !(k in cls.prototype.__property_methods__.keys())) {
//				cls.prototype[k] = v;
//				cls.__defineGetter__(k, getter(cls, k));
//				cls.__defineSetter__(k, setter(cls, k));
//			} else {
//				cls.prototype[k].__class__ = cls
//			}
//		}
//		cls.prototype.__classproperty_setted__ = true;
//	}
//	return cls;
//}
// ********************************************
// Node.js lib
// ********************************************
//function console_mode(_mode, _type) {
//	var dbg, nomo, m_close, c_close;
//	if (_mode == 'node-codein') {
//		//console.log('change console mode to node codein');
//		dbg = require("node-codein").dbg;
//		function c_close() {
//			if (dbg.pendingBroadcast._idleNext == null) {
//				console.timeEnd('server closed');
//				dbg.stopproc();
//				process.exit()
//			} else {
//				setTimeout(c_close, 500)
//			}
//		}
//
//		if (_type != 'forever')    setTimeout(c_close, 600);
//		console.time('server closed')
//	} else if (_mode == 'node-monkey') {
//		//console.log('change console mode to node monkey');
//		nomo = require('node-monkey').start({host: 'localhost', port: 50500});
//		function m_close() {
//			if (nomo.msgbuffer == 0) {
//				console.timeEnd('server closed');
//				process.exit()
//			} else {
//				setTimeout(m_close, 300)
//			}
//		}
//
//		console.clear('owefjeofij');
//		console.time('server closed');
//		if (_type != 'forever')    setTimeout(m_close, 3000)
//	} else if (_mode == 'normal') {
//		var chromelogger = require('chromelogger');
//		var http = require('http');
//		var server = http.createServer();
//		server.on('request', chromelogger.middleware);
//		server.on('request', function (req, res) {
//			res.chrome.log('Hello from Node.js %s', process.version);
//			res.end('Hello World');
//		});
//		//console.log('chromelogger');
//		server.listen(7357);
//		function c_close() {
//			//console.log('close...');
//			setTimeout(c_close, 600)
//		}
//
//		if (_type != 'forever')    setTimeout(c_close, 600);
//		console.time('server closed')
//	}
//}
//function importALL(from, to) {
//	tmp = from.keys();
//	for (var i = 0; i < tmp.length; i++) {
//		key = tmp[i];
//		to[key] = from[key]
//	}
//}
// User defiend utility


BuiltinCollision(isEmpty, 'isEmpty')
function isEmpty(n) {
	switch (typeof n) {
		case 'undefined':
			return true
		case 'boolean':
			return !n
		case 'string':
			if (n.strip()) {
				return false;
			} else {
				return true;
			}
		case 'object':
			if (n.length == 0) {
				return true;
			}
			var counts = 0;
			for (var i in n) {
				if (n.hasOwnProperty(i)) counts++;
			}
			if (counts != 0) return false;
			return true;
	}
	if (n) {
		return false;
	} else {
		return true;
	}
}
function notEmpty(n){
	return !isEmpty(n)
}


BuiltinCollision(type_, 'type_')
function type_(a){
	switch(typeof a){
		case 'function':
			if (a.hasOwnProperty('__class__')) return a.__class__
			return a.constructor
		case 'object':
			if (a.hasOwnProperty('__class__')) return a.__class__
			return a.constructor
		case 'string':
			return a.constructor
		case 'number':
			return a.constructor
	}
	return 'undefined'
}

// ********************************************
// modified unittest for my needs
// ********************************************


BuiltinCollision(ensure, 'ensure')
function ensure(condition, msg){
	if (!condition) {
		function getErrorObject(msg){
			try { throw Error( new AssertionError(msg)  ) } catch(err) { return err; }
		}
		var err = getErrorObject(msg);
		var caller_line = err.stack.split("\n")[4];
		var index = caller_line.indexOf("at ");
		var clean = caller_line.slice(index+2, caller_line.length);
		r = new Error(new AssertionError(msg))
		throw(r)
	}
}


function assert(r, m) {
	if (isEmpty(r)) throw new AssertionError(m)
}

function assertEqual(a, b) {
	if (a == b) {
	} else {
		var err = new Error("AssertEqualError");
		//console.log('from:', arguments.callee.caller, err.stack);
		throw err
	}
}

function AssertionError(message) {
	if (typeof message === "undefined") message = "";
	this.name = "AssertionError";
	this.message = message;
}

function Exception(message){
	if (typeof message === "undefined") message = "";
	this.message = message;
}
function TypeError(message){
	if (typeof message === "undefined") message = "";
	this.message = message;
}
Exception.prototype = new Error()
Exception.prototype.constructor = Exception
TypeError.prototype = new Error()
TypeError.prototype.constructor = TypeError
AssertionError.prototype = new Error();
AssertionError.prototype.constructor = AssertionError;

deepEqual = ____comp
function deepEqual(a, b) {
	var i;
	if (a === b) {
		return true;
	}
	if (a instanceof Array && b instanceof Array || a instanceof Object && b instanceof Object) {
		if (a.constructor !== b.constructor || a.length !== b.length) {
			return false;
		}
		var keys = dict.keys(a);
		for (var i = 0; i < keys.length; i++) {
			key = keys[i];
			if (b.hasOwnProperty(key)) {
				if (!deepEqual(a[key], b[key])) {
					return false;
				}
			} else {
				return false;
			}
		}
		return true;
	}
	return false;
}


function output(string) {
	//console.log(string);
}
// ********************************************
// Psuedo Python Libs [prototype implementation]
// ********************************************
// Psuedo Python Libs
BuiltinCollision(uuid, 'uuid')
function uuid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
	}

	return s4() + s4() + "_" + s4() + "_" + s4() + "_" + s4() + "_" + s4() + s4() + s4();
}


BuiltinCollision(len, 'len')
function len(obj) {
	if (obj instanceof Array || typeof obj === "string") return obj.length;
	else {
		var count = 0;
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) count++;
		}
		return count;
	}
}

BuiltinCollision(range, 'range')
function range(a, b, step) {
	var i= 0, l
	if (typeof b === "undefined") {
		b = a;
		a = 0;
	}
	step = step || 1;
	l = Math.floor(Math.abs((b-a)/step))
	var arr = new Array(l);

	if (step > 0) {
		while (a + step < b +step) {
			arr[i] = a;
			i ++;
			a += step;
		}
	}
	else {
		while (a + step > b+step) {
			arr[i] = a;
			i ++;
			a += step;
		}
	}
	return arr;
}

BuiltinCollision(reversed, 'reversed')
function reversed(arr) {
	var i = 0;
	l = arr.length, tmp = new Array(l), l0 = l - 1;
	for (i = 0; i < l; i++) {
		tmp[l0 - i] = arr[i];
	}
	return tmp;
}

BuiltinCollision(getattr, 'getattr')
function getattr(obj, name) {
	return obj[name];
}

BuiltinCollision(setattr, 'setattr')
function setattr(obj, name, value) {
	obj[name] = value;
}


function _$hasattr(obj, name) {
	if (typeof(obj) == 'object' || typeof(obj) == "function")return name in obj;
	return false
}
hasattr = _$hasattr

function ____listcomp(a,b){
	var la= a.length, lb = b.length, ia, ib
	if (la == 0 && lb == 0) return true
	if (la != lb)      return false
	for (ia=0; ia<la; ia++){
		if (a[ia] != b[ia]) return false
	}
	return true
}
function ____listncomp(a,b){
	return ! ____listcomp(a,b)
}
function ____objcomp(a,b){
	var key
	for (key in a){
		if (a.hasOwnProperty(key) && b.hasOwnProperty(key)){
			if (! ____comp(a[key],b[key])) return false
		}
	}
	return true
}
function ____objncomp(a,b){
	return ! ____objcomp(a,b)
}
function ____comp(a,b){
	if (a===b) return true
	if (a instanceof Array && b instanceof Array) return ____listcomp(a,b)
	if (a instanceof Object && b instanceof Object) return ____objcomp(a,b)
	return false
}


function ____get(obj, name) {
	if ('__getattribute__' in obj) return obj.__getattribute__(name);
	if (name in obj) {
		return obj[name]
	} else {
		if ('__getattr__' in obj) return obj.__getattr__(name);
		var err = new Error("attribute " + name + " not found");
	}
}
function ____set(obj, name, value) {
	obj[name] = value
}
function ____add(a, b) {
	if (typeof(a) == 'object') {
		if ('__add__' in a) return a.__add__(b)
	}
	return a + b
}
function ____mul(a, b) {
	if (typeof(a) == 'object') {
		if ('__mul__' in a) return a.__mul__(b)
	}
	return a * b
}
function ____div(a, b) {
	if (typeof(a) == 'object') {
		if ('__div__' in a) return a.__div__(b)
	}
	return a / b
}
function ____sub(a, b) {
	if (typeof(a) == 'object') {
		if ('__sub__' in a) return a.__sub__(b)
	}
	return a - b
}
function ____mod(a, b) {
	if (typeof(a) == 'object') {
		if ('__mod__' in a) return a.__mul__(b)
	}
	return a % b
}
function ____and(a, b) {
	if (typeof(a) == 'object') {
		if ('__and__' in a) return a.__and__(b)
	}
	return a && b
}
function ____or(a, b) {
	if (typeof(a) == 'object') {
		if ('__or__' in a) return a.__or__(b)
	}
	return a || b
}
function ____pow(a, b) {
	if (typeof(a) == 'object') {
		if ('__pow__' in a) return a.__pow__(b)
	}
	return Math.pow(a, b)
}
function ____flatten(lst) {
	if (lst instanceof Array) {
		var i = 0, l = lst.length, ret = new Array()
		for (i = 0; i < l; i++) {
			ret.extend(____flatten(lst[i]))
		}
		return ret
	} else {
		return [lst]
	}
}
function ____lshift(lst) {
	var error = new Error('NotImplement');
	thorw(err)
}
var ____rshift, ____xor = ____lshift;


BuiltinCollision(enumerate, 'enumerate')
function enumerate(item) {
	var i, l = item.length, arr = new Array(l);
	//console.log('l:', l)
	for (i = 0; i < l; i++) {
		arr[i] = [i, item[i]];
	}
	return arr;
}

BuiltinCollision(diff, 'diff')
function diff(a,b){
	var tmpa, tmpb, i = 0, j= 0, al= a.length,_a, bl = b.length,_b, ret = Array(), idx
	if (al < bl){
		return diff(b, a)
	}
	b = b.slice()
	for(i=0; i<al;i++){
		_a = a[i]
		idx = b.indexOf(_a)
		if(idx == -1) ret.push(_a)
		delete(b[idx])
	}
	for(j=0;j<bl;j++){
		_b = b[j]
		if(_b != undefined) ret.push(_b)
	}
	return ret
}

function ____apply  ( caller, callee, args ){
	caller.apply(callee, args)
}
function ____caller ( fn )                  { return fn.caller }
function print  (){
	console.log.apply(console, arguments)
}



BuiltinCollision(Set, 'Set')
var Set = function(){
	var data, l = arguments.length, result = Array()
	if (l ==1 && arguments[0].constructor == Array ){
		data = arguments[0]
		data.__proto__ = Set.prototype
		result = data._unique()
		result.sort(function(a, b){return a> b})
		return result
	}else if(l >= 1){
		arguments.__proto__ = Set.prototype
		result = arguments._unique()
		result.sort(function(a, b){return a> b})
		return result
	}
	return new Set([])
}
Set.prototype = Object.create(Array.prototype)
Set.prototype.add = function(data){
	if (this.indexOf(data) == -1) this.push(data); this.sort(function(a,b){return a>b})
}
Set.prototype.pop = function(idx){
	return Array.prototype.pop.call(this, idx)
	this.sort(function(a,b){return a>b})
}
Set.prototype._unique = function(){
	var i, l = this.length, result = Array()
	for (i=0;i<l;i++){
		v = this[i]
		if (result.indexOf(v) == -1) result.push(v)
	}
	result.__proto__ = this.__proto__
	return result
}


BuiltinCollision(KWarg, 'KWarg')
var KWarg = function(obj){obj.__proto__ = KWarg.prototype;return obj}
KWarg.prototype = Object.create(Object.prototype)
KWarg.prototype.__keywordargs__ = true



// prototype based


Object.defineProperty(Object.prototype, 'tolist', {value:
	function tolist() {
		var values = this.values(), l = values.length, tmp = new Array(l), i
		for (i = 0; i < l; i++) {
			tmp[i] = values[i]
		}
		return tmp
	}, enumerable: false});

Object.defineProperty(Object.prototype, '_update', {value:
	function (d) {
		var k;
		for (k in d) {
			if (d.hasOwnProperty(k)) {
				this[k] = d[k];
			}
		}
	}, enumerable:false});

Object.defineProperty(Object.prototype, 'keys', {value:
	function key() {
		var tmp = new Array(), i
		for (i in this) {
			if (this.hasOwnProperty(i)) tmp.push(i)
		}
		return tmp;
	}, enumerable:false});

Object.defineProperty(Object.prototype, '_keys', {value:
		function () {
		var tmp = new Array(), i
		for (i in this) {
			if (this.hasOwnProperty(i) && this.__inheritedproperties__.indexOf(i) == -1 ) tmp.push(i)
		}
		return tmp;
	}, enumerable:false});

Object.defineProperty(Object.prototype, 'values', {value:
		function () {
		var i, tmp = new Array(), value, j = 0;
		for (i in this) {
			if (this.hasOwnProperty(i)) {
				value = this[i];
				tmp[j] = value;
				j++
			}
		}
		return tmp
	}, enumerable:false});

Object.defineProperty(Object.prototype, '_values', {value:
	function () {
		var i, tmp = new Array(), value, j = 0;
		for (i in this) {
			if (this.hasOwnProperty(i) && this.__inheritedproperties__.find(i) == -1) {
				value = this[i];
				tmp[j] = value;
				j++
			}
		}
		return tmp
	}, enumerable:false})

Object.defineProperty(Object.prototype, '_$count', {value:
		function () {
			var el, i = 0
			for (el in this) {
				if (this.hasOwnProperty(el)) i++
			}
			return i
		}, enumerable:false})

Object.defineProperty(Object.prototype, 'count',{value:Object.prototype._$count, enumerable:false})

Object.defineProperty(Object.prototype, '_$pop', {value:
		function(key){
			var key, _value
			_value = this[key]
			delete(this[key])
			return _value
		}, enumerable:false})

Object.defineProperty(Object.prototype, 'pop',{value:Object.prototype._$pop, enumerable:false})

Object.defineProperty(Object.prototype, 'push_insert', {value:
	function (idx, rec) {
		var i, l = this.count()
		for (i=l-1;i>=idx;i--) {
			this[i+1] = this[i]
		}
		this[idx] = rec
	}, enumerable:false})

Object.defineProperty(Object.prototype, 'pull_insert', {value:
	function (idx, rec) {
		var i, l = this.count()
		for (i=0;i<idx;i++) {
			this[i] = this[i+1]
		}
		this[idx] = rec
	}, enumerable:false})

//Object.defineProperty(Object.prototype, 'append', {value:
//	function (data){
//		var l = this.count()
//		this[l] = data
//	}, enumerable:false})

Object.defineProperty(Object.prototype, '_$copy', {value:
	function (obj, start, end){
		var l=obj.count() , i=0
		start = start==undefined ? i: start
		end   = end  ==undefined ? l: end
		for(i=start; i<end; i++){
			this[i-start] = obj[i]
		}
	}, enumerable:false})

Object.defineProperty(Object.prototype, 'copy',{value:Object.prototype._$copy, enumerable:false})

Object.defineProperty(Object.prototype, 'properties', {value:
	function () {
		//console.log(this)
		if (typeof(this.__class__) == 'undefined') return this.items()
		var keys = this._keys(), tmp = Object(), l = keys.length, k, i = 0
		while (i < l) {
			k = keys[i]
			tmp[k] = this[k]
			i++
		}
		return tmp
	}, enumerable:false})

Object.defineProperty(Object.prototype, 'items', {value:
	function () {
		var tmp = new Array(), value, key, i = 0
		for (key in this) {
			if (this.hasOwnProperty(key)) {
				tmp[i] = [key, this[key]];
				i++
			}
		}
		return tmp
	}, enumerable:false})




var dir = function (target) {
	var tmp0 = target.__proto__.keys(), tmp1 = target.keys(), l1 = tmp1.length, tmp = [], j = 0;
	for (i = 0; i < l1; i++) {
		if (tmp0.find(tmp1[i]) == -1) {
			tmp[j] = tmp1[i]
			j++
		}
	}
	tmp0.extend(tmp);
	return tmp0
};

max = Math.max
min = Math.min


re = function re(s, jsflag) {
	if (s.constructor == RegExp) return RegExp(s.source, jsflag)
	return RegExp(s, jsflag)
};
RegExp.prototype.find = RegExp.prototype.exec
RegExp.prototype.findall = function findall(string, keep_index) {
	if (!keep_index){
		if (this.global == false) return string.match(re(this.source, 'g'))
		return string.match( this  )
	}
	var result = Array(0), found
	while(found = this.exec(string)){
		string = string.slice(found.index + found[0].length)
		//console.log(found, string)
		result.push(found)
	}
	return result
}


function __stringformat__() {
	// string-format from node.js
	var format, lookup, resolve,
	__slice = [].slice;
	String.prototype._format = function _format(){
		function lengthen(fname, length){
			if (length == undefined) return fname
			if (fname == undefined) return ''
			var l, arr;
			l = fname.length;
			if (l > length) {
				fname = fname.slice(0, l);
			} else {
				arr   = new Array(length - l);
				fname = fname + arr.join(" ");
			}   return fname;}
		var matches, l, i, lbound, rbound, pair, compensate = 0, result = this, maybekarg = arguments.length == 1, key
		matches = re('\\{[a-zA-Z_]*:([0-9]+)?\}').findall( this, true)
		l = matches.length
		for (i=0; i < l ; i++){
			m = matches[i]

			if (m[1] != undefined){
				pair = m[0].split(':')
				if ( pair[0] == '{' ){
					// positional args
					arguments[i] = lengthen(arguments[i], parseInt(m[1]) )
					lbound = compensate + m.index + pair[0].length
					rbound = lbound + pair[1].length
					compensate += rbound - lbound
					result = this.slice(0, lbound) + this.slice(rbound)
				}else{
					if (maybekarg && pair[0] != undefined){
						key = pair[0].slice(1)
						arguments[0][key] = lengthen(arguments[0][key], parseInt(m[1]) )
						lbound = compensate + m.index + pair[0].length
						rbound = lbound + pair[1].length
						compensate += rbound - lbound
						result = this.slice(0, lbound) + this.slice(rbound)
					}

				}

			}
		}
		return [result, arguments]
	}

	format = String.prototype.format = function () {
		//console('format arguments:', arguments)
		var args, explicit, idx, implicit, message,	_this = this;
		args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
		if (args.length === 0) {
			return function () {
				var args;
				args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
				return _this.format.apply(_this, args);
			};
		}else{
			var raw = this._format.apply(this, arguments)
			args = raw[1]
			_this = raw[0]
		}
		idx = 0;
		explicit = implicit = false;
		message = 'cannot switch from {} to {} numbering'.format();
		return _this.replace(/([{}])\1|[{](.*?)(?:!(.+?))?[}]/g, function (match, literal, key, transformer) {
			var fn, value, _ref, _ref1, _ref2;
			if (literal) {
				return literal;
			}
			if (key.length) {
				explicit = true;
				if (implicit) {
					throw new Error(message('implicit', 'explicit'));
				}
				value = (_ref = lookup(args, key)) != null ? _ref : '';
			} else {
				implicit = true;
				if (explicit) {
					throw new Error(message('explicit', 'implicit'));
				}
				value = (_ref1 = args[idx++]) != null ? _ref1 : '';
			}
			value = value.toString();
			if (fn = format.transformers[transformer]) {
				return (_ref2 = fn.call(value)) != null ? _ref2 : '';
			} else {
				return value;
			}
		});
	};
	lookup = function (object, key) {
		var match;
		if (!/^(\d+)([.]|$)/.test(key)) {
			key = '0.' + key;
		}
		while (match = /(.+?)[.](.+)/.exec(key)) {
			object = resolve(object, match[1]);
			key = match[2];
		}
		return resolve(object, key);
	};
	resolve = function (object, key) {
		var value;
		value = object[key];
		if (typeof value === 'function') {
			return value.call(object);
		} else {
			return value;
		}
	};

	format.transformers = {};
	format.version = '0.2.1';
}
__stringformat__();



function str(s) {
	return String(s)
}
str.prototype = String.prototype;
list = Array
list.prototype = Array.prototype;

function dict(data) {
	if (data == undefined) return {}
	var l = data.length
	if (data.constructor == Object ){
		return data
	}
	var tmp = {}, key, value, i
	for ( i=0; i<l; i++) {
		key = data[i][0];
		value = data[i][1];
		tmp[key] = value
	}
	return tmp
}
dict.items = function items(s) {
	return s.items()
};
dict.keys = function keys(s) {
	return s.keys()
};
dict.values = function keys(s) {
	return s.values()
};
dict.copy = function copy(s) {
	return Object.create(s)
}; // not so sure?
// rapydscript building fn
JSON = JSON || {};
if (!JSON.stringify) {
	JSON.stringify = function (obj) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			// simple data type
			if (t == "string")
				obj = '"' + obj + '"';
			if (t == "function") {
				return;
			} else {
				return String(obj);
			}
		} else {
			// recurse array or object
			var n, v, json = [];
			var arr = (obj && obj.constructor == Array);
			for (n in obj) {
				v = obj[n];
				t = typeof (v);
				if (t != "function" && t != "undefined") {
					if (t == "string")
						v = '"' + v + '"';
					else if ((t == "object" || t == "function") && v !== null)
						v = JSON.stringify(v);
					json.push((arr ? "" : '"' + n + '":') + String(v));
				}
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	};
}
String.prototype.find = Array.prototype.indexOf;
String.prototype.strip = String.prototype.trim;
String.prototype.lstrip = String.prototype.trimLeft;
String.prototype.rstrip = String.prototype.trimRight;
String.prototype.lower = String.prototype.toLowerCase
String.prototype.join = function (iterable) {
	return iterable.join(this);
};
String.prototype.zfill = function (size) {
	var s;
	s = this;
	while (s.length < size) {
		s = "0" + s;
	}
	return s;
};
Array.prototype.append = Array.prototype.push;
Array.prototype.find = Array.prototype.indexOf;
Array.prototype.index = function (index) {
	var val;
	val = this.find(index);
	if (val == -1) {
		throw new Error(str(index) + " is not in list");
	}
	return val;
};
Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};

Array.prototype._pop = Array.prototype.pop
Array.prototype.pop = function (index) {
	if (typeof index === "undefined") return this._pop()
	return this.splice(index, 1)[0];
};
Array.prototype.extend = function (array2) {
	var i = 0, l = array2.length, l0 = this.length
	this.length += l
	for (i = 0; i < l; i++) {
		this[l0 + i] = array2[i]
	}
};
Array.prototype.remove = function (item) {
	var index, l = this.length;
	index = this.indexOf(item);
	for (var i = 0; i < l; i++) {
		if (i >= index) {
			this[i] = this[i + 1]
		}
	}
	this.length -= 1
};
Array.prototype._$copy = function(obj, start, end){
	if (obj==undefined) return this.slice(0);
	var i = 0;
	start = start==undefined ? i         : start;
	end   = end  ==undefined ? obj.length: end;
	for(i=start; i<end; i++){
		this[i-start] = obj[i];
	}
}
Array.prototype.copy = Array.prototype._$copy;





if (!Array.prototype.map) {
	Array.prototype.map = function (callback, thisArg) {
		var T, A;
		if (this == null) {
			throw new TypeError(" this is null or not defined");
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if ({}.toString.call(callback) != "[object Function]") {
			throw new TypeError(callback + " is not a function");
		}
		if (thisArg) {
			T = thisArg;
		}
		A = new Array(len);
		for (var k = 0; k < len; k++) {
			var kValue, mappedValue;
			if (k in O) {
				kValue = O[k];
				mappedValue = callback.call(T, kValue);
				A[k] = mappedValue;
			}
		}
		return A;
	};
}

BuiltinCollision(map, 'map')
function map(oper, arr) {
	return arr.map(oper);
}
if (!Array.prototype.filter) {
	Array.prototype.filter = function (filterfun, thisArg) {
		"use strict";
		if (this == null) {
			throw new TypeError(" this is null or not defined");
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if ({}.toString.call(filterfun) != "[object Function]") {
			throw new TypeError(filterfun + " is not a function");
		}
		if (thisArg) {
			T = thisArg;
		}
		var A = [];
		var thisp = arguments[1];
		for (var k = 0; k < len; k++) {
			if (k in O) {
				var val = O[k]; // in case fun mutates this
				if (filterfun.call(T, val))
					A.push(val);
			}
		}
		return A;
	};
}

BuiltinCollision(filter, 'filter')
function filter(oper, arr) {
	return arr.filter(oper);
}


//-------------------------------------------------------------------
//-------------------- Fake sys Module ------------------------------
BuiltinCollision(sys, 'sys')
var sys = (function () {
	var module, version, is_fire, is_safari, is_chrome, is_opera, is_ie, is_nodejs;
	var NODEJS, OPERA, FIREFOX, CHROME, SAFARI;
	NODEJS = 'nodejs';
	is_nodejs = typeof global !== "undefined";
	if (typeof window == 'undefined' || is_nodejs) return {'version': NODEJS, 'modules': {}}

	version = [];
	module = window;
	module.__name__ = 'sys';
	module.__file__ = 'baselib.js';
	OPERA = 'opera';
	FIREFOX = 'firefox';
	SAFARI = 'safari';
	CHROME = 'chrome';
	if (window.opera || navigator.userAgent.indexOf(" OPR/") >= 0) {
		is_opera = true;
	} else {
		is_opera = false;
	}
	if (typeof InstallTrigger !== "undefined") {
		is_fire = true;
	} else {
		is_fire = false;
	}
	if (Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0) {
		is_safari = true;
	} else {
		is_safari = false;
	}
	is_chrome = is_opera = typeof window.chrome !== "undefined";
	is_ie = typeof document.documentMode !== "undefined";

	if (is_nodejs) {
		version.append(NODEJS);
	} else {	}

	if      (navigator.userAgent.indexOf('Android')!=-1)      {version.append('Android');version.append('Mobile')}
	else if (navigator.userAgent.indexOf('webOS')!=-1)        {version.append('webOS');version.append('Mobile')}
	else if (navigator.userAgent.indexOf('iPhone')!=-1)       {version.append('iPhone');version.append('Mobile')}
	else if (navigator.userAgent.indexOf('iPad')!=-1)         {version.append('iPad');version.append('Mobile')}
	else if (navigator.userAgent.indexOf('iPod')!=-1)         {version.append('iPod');version.append('Mobile')}
	else if (navigator.userAgent.indexOf('BlackBerry')!=-1)   {version.append('BlackBerry');version.append('Mobile')}
	else if (navigator.userAgent.indexOf('Windows Phone')!=-1){version.append('Windows Phone');version.append('Mobile')}
	if (is_opera) {
		version.append(OPERA);
	} else if (is_fire) {
		version.append(FIREFOX);
	} if (is_chrome) {
		version.append(CHROME);
	} else if (is_safari) {
		version.append(SAFARI);
	} else if (is_ie) {
		version.append(IE);
	}  else {
		//throw Exception("Uncaught exceptoin")
	}
	return {
		'version': version,
		'modules':{}
	}
})();


sys.modules.__html_ids     = {}
sys.modules.__html_actions = {}

function framework_init(){
	jQuery.fn._html = jQuery.fn.html
	jQuery.fn.on = {
		html:function(a){
			console.log('on changing html', a)
		}
	}
	jQuery.fn.html = function html(a){
		jQuery.fn.on.html(a)
		return jQuery.fn._html(a)
	}
	Element.prototype._remove = Element.prototype.remnove
	Element.prototype.remove = function remove(){
		console.log('element removed')
		delete(sys.modules.__html_ids[this.getAttribute('ident')])
		this._remove()
	}
	var tmp = jQuery('div.ident[ident]'), ltmp = tmp.length
	for (i=0; i<ltmp; i++){
		sys.modules.__html_ids[tmp[i].getAttribute('ident')] = tmp[i]
	}
	tmp = jQuery('a.ident[action]')
	ltmp = tmpl.legnth
	for (i=0; i<ltmp; i++){
		sys.modules.__html_actions[tmp[i].getAttribute('ident')] = tmp[i]
	}
}












