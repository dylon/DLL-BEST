/*
 * Created: Tue 22 Feb 2011 06:13:36 PM EST
 * Last Modified: Tue 03 May 2011 04:09:58 PM EDT
 */

/*!
 * Copyright ( C ) 2010 Dylon Edwards
 *
 * This code is available under MIT License.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files ( the "Software" ), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*global window */

(function ( window, undefined ) {

/**
 * Extends a child function with a parent one
 *
 * @param {function ()} Super The super constructor
 *
 * @return {object} this
 */
Function.prototype.inherits = function ( Super ) {
	var proto = new Super();

	if ( proto.__proto__ === undefined ) {
		proto.__proto__ = proto;
	}

	proto.__super__ = Super;
	this.prototype = proto;
	this.prototype.constructor = this;
	return this;
};

/**
 * Extends this constructor with an arbitrary number of prototypical objects.
 * This is not intended to mimic multiple inheritance, but to make
 * modularization of type definitions easy.
 *
 * @return {object} this
 */
Function.prototype.extend = function ( /* arguments */ ) {
	var p, a, o, k, i, j;
	
	p = this.prototype;
	a = arguments;
	j = a.length;

	for ( i = 0; i < j; ++ i ) {
		o = a[ i ];

		if ( !o ) {
			continue;
		}

		for ( k in o ) {
			if ( o.hasOwnProperty( k )) {
				p[ k ] = o[ k ];
			}
		}
	}

	return this;
};

/**
 * Assigns this constructor a namespace, which is created if it does not yet
 * exist.
 *
 * @param {string} ns
 * The namespace to assign this constructor
 *
 * @return {object} this
 */
Function.prototype.namespace = function ( ns ) {
	var i, j, p, n;

	if ( typeof ns === 'string' ) {
		ns = ns.split( '.' );
	}
	
	j = ns.length;
	p = window;

	for ( i = 0; i < j; ++ i ) {
		n = ns[ i ];

		if ( !( n in p )) {
			p[ n ] = {};
		}

		p = p[ n ];
	}

	this.__ns__ = p;
	return this;
};

/**
 * Assigns this constructor a global name in its namespace
 *
 * @param {string} name
 * The name of this constructor
 *
 * @return {object} this
 */
Function.prototype.cname = function ( name ) {
	this.__ns__[ name ] = this;
	this.__name__ = name;
	return this;
};

/**
 * Registers this constructor in the global namespace using its fully qualified
 * name.
 *
 * @param {string|array.<string>} name
 * Should be in the form, "namespace.CName"
 * 
 * @return {object} this
 */
Function.prototype.fname = function ( name ) {
	var ln, cn, ns;

	if ( typeof name === 'string' ) {
		name = name.split( '.' );
	}

	ln = name.length;
	cn = name[ ln - 1 ];
	ns = name.slice( 0, ln - 1 ); // NOTE: This was ( ln - 2 ), HTML 5 stuff?

	this.namespace( ns ).cname( cn );
	return this;
};

/*
 * IDEA: With something like this, I could do away with the above prototypical
 * functions:
 *
 * window.namespace( 'DllBest.Avl',
 *     Tree: {
 *         inherits: 'DllBest.Tree',
 *
 *         modifier: public|protected|private,
 *
 *         generics: {
 *             T : 'DllBest.Tree',
 *             N : 'DllBest.Node'
 *         },
 *
 *         class: {
 *
 *             /// Notice that the constructor has the same name ///
 *             Tree: function (  arguments  ) {
 *                 /// Constructor ///
 *             }
 *         }
 *     }
 *  );
 *
 * var Node = DllBest.Avl.Tree.prototype.class( 'Node' );
 * var node = new Node( function ( x, y ) { return x > y ? 1 : x < y ? -1 : 0; });
 */

/**
 * Base constructor of all DllBest-related types
 */
function Base() {
	/// Empty Constructor ///
}

Base.inherits( Object ).fname( 'DllBest.Base' );

}( window ));

